import { NextResponse } from 'next/server';
import { getRazorpaySettings, updateRazorpaySettings, getActiveRazorpayCredentials } from '@/lib/razorpay';

export async function GET() {
  try {
    const settings = await getRazorpaySettings();
    const active = await getActiveRazorpayCredentials();

    return NextResponse.json({
      success: true,
      mode: settings.mode,
      activeKeyId: active.keyId,
      isRealKeysConfigured: active.isRealKeysConfigured,
      testKeyId: settings.testKeyId,
      testKeyConfigured: Boolean(settings.testKeyId && !settings.testKeyId.includes('YOUR_')),
      liveKeyId: settings.liveKeyId,
      liveKeyConfigured: Boolean(settings.liveKeyId && !settings.liveKeyId.includes('YOUR_')),
      notificationWhatsapp: settings.notificationWhatsapp || '8527296771',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, testKeyId, testKeySecret, liveKeyId, liveKeySecret, notificationWhatsapp } = body;

    const updates: any = {};
    if (mode === 'test' || mode === 'live') {
      updates.mode = mode;
    }
    if (typeof testKeyId === 'string' && testKeyId.trim()) {
      updates.testKeyId = testKeyId.trim();
    }
    if (typeof testKeySecret === 'string' && testKeySecret.trim()) {
      updates.testKeySecret = testKeySecret.trim();
    }
    if (typeof liveKeyId === 'string' && liveKeyId.trim()) {
      updates.liveKeyId = liveKeyId.trim();
    }
    if (typeof liveKeySecret === 'string' && liveKeySecret.trim()) {
      updates.liveKeySecret = liveKeySecret.trim();
    }
    if (typeof notificationWhatsapp === 'string' && notificationWhatsapp.trim()) {
      updates.notificationWhatsapp = notificationWhatsapp.trim();
    }

    const updated = await updateRazorpaySettings(updates);

    return NextResponse.json({
      success: true,
      message: `Razorpay successfully switched to ${updated.mode.toUpperCase()} mode!`,
      settings: {
        mode: updated.mode,
        testKeyId: updated.testKeyId,
        liveKeyId: updated.liveKeyId,
        notificationWhatsapp: updated.notificationWhatsapp,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
