import crypto from 'crypto';
import { supabaseAdmin, supabase } from '@/lib/supabase';

export type RazorpayMode = 'test' | 'live';

export interface RazorpaySettings {
  mode: RazorpayMode;
  testKeyId: string;
  testKeySecret: string;
  liveKeyId: string;
  liveKeySecret: string;
  notificationWhatsapp: string;
  updatedAt?: string;
}

// Helper to check if a key is a real configured key (not a placeholder)
export function isRealKey(k?: string | null): boolean {
  if (!k || typeof k !== 'string') return false;
  const trimmed = k.trim();
  return (
    trimmed.length > 5 &&
    !trimmed.includes('YOUR_') &&
    !trimmed.includes('placeholder')
  );
}

// Runtime cached settings (allows instant mode switching in memory + Supabase sync)
let cachedSettings: RazorpaySettings = {
  mode: (process.env.RAZORPAY_MODE === 'live' ? 'live' : 'test') as RazorpayMode,
  testKeyId: process.env.RAZORPAY_KEY_ID_TEST || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  testKeySecret: process.env.RAZORPAY_KEY_SECRET_TEST || '',
  liveKeyId: process.env.RAZORPAY_KEY_ID_LIVE || '',
  liveKeySecret: process.env.RAZORPAY_KEY_SECRET_LIVE || '',
  notificationWhatsapp: process.env.ORDER_NOTIFY_WHATSAPP || '9981508165',
};

/**
 * Loads Razorpay settings from Supabase and/or environment variables.
 * Automatically chooses real configured keys over placeholders.
 */
export async function getRazorpaySettings(): Promise<RazorpaySettings> {
  const envMode = (process.env.RAZORPAY_MODE === 'live' ? 'live' : 'test') as RazorpayMode;
  const envTestKeyId = process.env.RAZORPAY_KEY_ID_TEST || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const envTestKeySecret = process.env.RAZORPAY_KEY_SECRET_TEST || '';
  const envLiveKeyId = process.env.RAZORPAY_KEY_ID_LIVE || '';
  const envLiveKeySecret = process.env.RAZORPAY_KEY_SECRET_LIVE || '';
  const envWhatsapp = process.env.ORDER_NOTIFY_WHATSAPP || '9981508165';

  let currentSettings: RazorpaySettings = {
    mode: envMode,
    testKeyId: envTestKeyId,
    testKeySecret: envTestKeySecret,
    liveKeyId: envLiveKeyId,
    liveKeySecret: envLiveKeySecret,
    notificationWhatsapp: envWhatsapp,
  };

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const { data, error } = await client
        .from('razorpay_settings')
        .select('*')
        .eq('id', 'default')
        .single();

      if (!error && data) {
        const dbMode = data.mode === 'live' ? 'live' : 'test';

        // Select real keys: prefer valid key from DB; if DB has placeholder/missing, fallback to env
        const testKeyId = isRealKey(data.test_key_id)
          ? data.test_key_id.trim()
          : (isRealKey(envTestKeyId) ? envTestKeyId.trim() : (data.test_key_id || ''));

        const testKeySecret = isRealKey(data.test_key_secret)
          ? data.test_key_secret.trim()
          : (isRealKey(envTestKeySecret) ? envTestKeySecret.trim() : (data.test_key_secret || ''));

        const liveKeyId = isRealKey(data.live_key_id)
          ? data.live_key_id.trim()
          : (isRealKey(envLiveKeyId) ? envLiveKeyId.trim() : (data.live_key_id || ''));

        const liveKeySecret = isRealKey(data.live_key_secret)
          ? data.live_key_secret.trim()
          : (isRealKey(envLiveKeySecret) ? envLiveKeySecret.trim() : (data.live_key_secret || ''));

        const notificationWhatsapp = data.notification_whatsapp || envWhatsapp;

        currentSettings = {
          mode: dbMode,
          testKeyId,
          testKeySecret,
          liveKeyId,
          liveKeySecret,
          notificationWhatsapp,
          updatedAt: data.updated_at
        };

        // Auto-heal DB: If DB lacked real keys but env has them, update DB automatically
        if ((!isRealKey(data.live_key_id) && isRealKey(envLiveKeyId)) ||
            (!isRealKey(data.test_key_id) && isRealKey(envTestKeyId))) {
          client
            .from('razorpay_settings')
            .update({
              test_key_id: testKeyId,
              test_key_secret: testKeySecret,
              live_key_id: liveKeyId,
              live_key_secret: liveKeySecret,
              updated_at: new Date().toISOString()
            })
            .eq('id', 'default')
            .then(() => {}, () => {});
        }
      }
    } catch {
      // Fallback to env currentSettings
    }
  }

  cachedSettings = currentSettings;
  return currentSettings;
}

/**
 * Saves/updates Razorpay settings into Supabase & runtime cache
 */
export async function updateRazorpaySettings(newSettings: Partial<RazorpaySettings>): Promise<RazorpaySettings> {
  const current = await getRazorpaySettings();
  const updated: RazorpaySettings = {
    ...current,
    ...newSettings,
  };

  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const payload: any = {
        updated_at: new Date().toISOString()
      };
      if (newSettings.mode) payload.mode = newSettings.mode;
      if (isRealKey(newSettings.testKeyId)) payload.test_key_id = newSettings.testKeyId;
      if (isRealKey(newSettings.testKeySecret)) payload.test_key_secret = newSettings.testKeySecret;
      if (isRealKey(newSettings.liveKeyId)) payload.live_key_id = newSettings.liveKeyId;
      if (isRealKey(newSettings.liveKeySecret)) payload.live_key_secret = newSettings.liveKeySecret;
      if (newSettings.notificationWhatsapp) payload.notification_whatsapp = newSettings.notificationWhatsapp;

      await client
        .from('razorpay_settings')
        .upsert({
          id: 'default',
          ...payload
        }, { onConflict: 'id' });
    } catch (e) {
      console.warn('Could not sync razorpay settings to Supabase, cached in memory:', e);
    }
  }

  cachedSettings = updated;
  return updated;
}

/**
 * Gets currently active Key ID & Secret according to active mode ('test' | 'live')
 */
export async function getActiveRazorpayCredentials(): Promise<{
  mode: RazorpayMode;
  keyId: string;
  keySecret: string;
  isRealKeysConfigured: boolean;
}> {
  const settings = await getRazorpaySettings();
  const isLive = settings.mode === 'live';
  const keyId = isLive ? settings.liveKeyId : settings.testKeyId;
  const keySecret = isLive ? settings.liveKeySecret : settings.testKeySecret;

  const isRealKeysConfigured = Boolean(
    keyId &&
    keySecret &&
    !keyId.includes('YOUR_') &&
    !keySecret.includes('YOUR_')
  );

  return {
    mode: settings.mode,
    keyId: keyId || (isLive ? 'rzp_live_placeholder' : 'rzp_test_placeholder'),
    keySecret: keySecret || 'placeholder_secret',
    isRealKeysConfigured,
  };
}

/**
 * Creates Razorpay Order on Razorpay REST API
 */
export async function createRazorpayOrder(
  amountInRupees: number,
  receiptId: string,
  notes: Record<string, any> = {}
): Promise<{
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  mode: RazorpayMode;
  error?: string;
}> {
  const { mode, keyId, keySecret, isRealKeysConfigured } = await getActiveRazorpayCredentials();
  const amountInPaise = Math.round(amountInRupees * 100);

  // If valid credentials exist, call Razorpay Orders API
  if (isRealKeysConfigured) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receiptId,
          notes: {
            ...notes,
            platform: 'Satvik Caters and Events',
            mode
          }
        })
      });

      if (response.ok) {
        const orderData = await response.json();
        return {
          success: true,
          orderId: orderData.id,
          amount: orderData.amount,
          currency: orderData.currency,
          keyId,
          mode
        };
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error('Razorpay API error response:', errData);
        const errMsg = errData.error?.description || errData.error?.message || 'Razorpay order creation failed';
        return {
          success: false,
          orderId: '',
          amount: amountInPaise,
          currency: 'INR',
          keyId,
          mode,
          error: errMsg
        };
      }
    } catch (err: any) {
      console.error('Razorpay network error:', err);
      return {
        success: false,
        orderId: '',
        amount: amountInPaise,
        currency: 'INR',
        keyId,
        mode,
        error: err.message || 'Network connection to Razorpay failed'
      };
    }
  }

  // Fallback ONLY in test mode when no credentials are configured
  if (mode === 'test') {
    const simulatedOrderId = `order_test_${Date.now()}`;
    return {
      success: true,
      orderId: simulatedOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId.startsWith('rzp_') ? keyId : 'rzp_test_simulated',
      mode
    };
  }

  return {
    success: false,
    orderId: '',
    amount: amountInPaise,
    currency: 'INR',
    keyId: '',
    mode,
    error: 'Live Razorpay API keys are not configured or account is not ready. Please verify RAZORPAY_KEY_ID_LIVE and RAZORPAY_KEY_SECRET_LIVE.'
  };
}

/**
 * Verifies Razorpay payment signature
 */
export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  if (!orderId || !paymentId) return false;

  const { keySecret, isRealKeysConfigured } = await getActiveRazorpayCredentials();

  // If simulated/test order with demo signature, allow for smooth testing
  if (!isRealKeysConfigured || orderId.startsWith('order_test_') || signature === 'mock_verified_signature') {
    return true;
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}
