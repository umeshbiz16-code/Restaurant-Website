'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  CreditCard, ShieldAlert, ShieldCheck, CheckCircle2, AlertCircle, 
  RefreshCw, Save, ArrowRight, Zap, Info, Key, Phone, ExternalLink, Sparkles 
} from 'lucide-react';
import { SunMoonThemeToggle } from '@/components/ui/sun-moon-theme-toggle';

export default function AdminRazorpayPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings State
  const [mode, setMode] = useState<'test' | 'live'>('test');
  const [testKeyId, setTestKeyId] = useState('');
  const [testKeySecret, setTestKeySecret] = useState('');
  const [liveKeyId, setLiveKeyId] = useState('');
  const [liveKeySecret, setLiveKeySecret] = useState('');
  const [notificationWhatsapp, setNotificationWhatsapp] = useState('8527296771');
  const [isRealKeysConfigured, setIsRealKeysConfigured] = useState(false);
  const [testingOrder, setTestingOrder] = useState(false);
  const [testOrderResult, setTestOrderResult] = useState<any | null>(null);

  // Check auth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('satvik_admin_auth') || localStorage.getItem('satvik_admin_auth');
      if (auth !== 'true') {
        router.push('/admin');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  // Load Razorpay config
  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/razorpay/config');
      if (res.ok) {
        const data = await res.json();
        setMode(data.mode || 'test');
        setTestKeyId(data.testKeyId || '');
        setLiveKeyId(data.liveKeyId || '');
        setNotificationWhatsapp(data.notificationWhatsapp || '8527296771');
        setIsRealKeysConfigured(data.isRealKeysConfigured || false);
      }
    } catch (err) {
      console.warn('Failed to load razorpay config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadConfig();
    }
  }, [isAuthenticated]);

  // Quick Switch Mode between Test & Live
  const handleQuickSwitchMode = async (newMode: 'test' | 'live') => {
    if (newMode === mode) return;
    setSaving(true);
    setNotification(null);
    try {
      const res = await fetch('/api/razorpay/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMode(newMode);
        setNotification({
          type: 'success',
          message: `Successfully switched gateway to ${newMode.toUpperCase()} mode!`,
        });
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to switch mode' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error switching mode' });
    } finally {
      setSaving(false);
    }
  };

  // Save Credentials & Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);
    try {
      const payload: any = {
        mode,
        notificationWhatsapp,
      };
      if (testKeyId) payload.testKeyId = testKeyId;
      if (testKeySecret) payload.testKeySecret = testKeySecret;
      if (liveKeyId) payload.liveKeyId = liveKeyId;
      if (liveKeySecret) payload.liveKeySecret = liveKeySecret;

      const res = await fetch('/api/razorpay/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({
          type: 'success',
          message: 'Razorpay settings and credentials updated successfully in Supabase!',
        });
        loadConfig();
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to update settings' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error updating settings' });
    } finally {
      setSaving(false);
    }
  };

  // Test Order Creation
  const handleTestGateway = async () => {
    setTestingOrder(true);
    setTestOrderResult(null);
    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 299,
          customerName: 'Test Admin',
          phone: '8527296771',
          address: 'Pushpa Nagar Kitchen, Bhopal',
          notes: 'Test payment gateway verification',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestOrderResult({
          success: true,
          message: `Verified! Created Razorpay Order ${data.orderId} (₹${data.amount / 100}) in ${data.mode.toUpperCase()} mode.`,
          orderId: data.orderId,
          keyId: data.keyId,
        });
      } else {
        setTestOrderResult({
          success: false,
          message: data.error || 'Gateway test failed',
        });
      }
    } catch (err: any) {
      setTestOrderResult({
        success: false,
        message: err.message || 'Error testing gateway',
      });
    } finally {
      setTestingOrder(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-stone-50/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Top Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-stone-950 dark:text-white">
                  Razorpay Payment Gateway Settings
                </h1>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Seamlessly toggle between Test (Sandbox) & Live (Production) modes without logging into Razorpay Dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-stone-900 p-1 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm">
                <SunMoonThemeToggle size={36} duration={1200} />
              </div>
              <button
                onClick={loadConfig}
                disabled={loading}
                className="py-2.5 px-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
                title="Refresh settings"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Notification Toast */}
          {notification && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-center justify-between shadow-sm animate-fade-in ${
                notification.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                )}
                <span>{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white ml-2 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* ACTIVE MODE HERO SWITCHER CARD */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-all ${
            mode === 'live'
              ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 dark:from-emerald-950/40 dark:via-stone-900 dark:to-emerald-950/20 border-emerald-300 dark:border-emerald-800'
              : 'bg-gradient-to-br from-amber-50 via-white to-amber-50/30 dark:from-amber-950/40 dark:via-stone-900 dark:to-amber-950/20 border-amber-300 dark:border-amber-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${
                    mode === 'live'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-amber-500 text-stone-950 shadow-xs'
                  }`}>
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    {mode === 'live' ? 'LIVE PRODUCTION ACTIVE' : 'TEST SANDBOX ACTIVE'}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    (Current Website Gateway Mode)
                  </span>
                </div>

                <h2 className="text-xl font-black text-stone-950 dark:text-white">
                  {mode === 'live' 
                    ? 'Customer Orders Will Be Charged In Real Money'
                    : 'Customer Orders Will Open Razorpay Test Window (No Real Money Deducted)'
                  }
                </h2>
                <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xl">
                  {mode === 'live'
                    ? 'All payments made on /cart will process through your verified Razorpay live merchant account directly to your bank.'
                    : 'Safe testing environment for checking checkout flow, UI, and instant WhatsApp notifications using Razorpay test UPI/Cards.'
                  }
                </p>
              </div>

              {/* Mode Toggle Controls */}
              <div className="flex flex-col items-center gap-2 w-full sm:w-auto shrink-0">
                <div className="bg-stone-200 dark:bg-stone-800 p-1.5 rounded-2xl flex items-center w-full sm:w-auto border border-stone-300 dark:border-stone-700">
                  <button
                    type="button"
                    onClick={() => handleQuickSwitchMode('test')}
                    disabled={saving}
                    className={`flex-1 sm:flex-none py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mode === 'test'
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    Test Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSwitchMode('live')}
                    disabled={saving}
                    className={`flex-1 sm:flex-none py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      mode === 'live'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    Live Mode
                  </button>
                </div>
                <span className="text-[10px] text-stone-400 text-center">
                  Click to switch gateway immediately
                </span>
              </div>

            </div>
          </div>

          {/* WHATSAPP NOTIFICATION ALERT CARD */}
          <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-950 dark:text-white flex items-center gap-2">
                  <span>WhatsApp Order Alerts Target</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold">
                    ACTIVE
                  </span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Target Admin Phone: <strong className="text-emerald-600 dark:text-emerald-400">{notificationWhatsapp}</strong>
                </p>
                <p className="text-[11px] text-stone-400">
                  Whenever an order is successfully paid via Razorpay, a detailed WhatsApp breakdown is instantly generated and dispatched to this number.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://api.whatsapp.com/send?phone=91${notificationWhatsapp.replace(/\D/g, '')}&text=${encodeURIComponent('Satvik Caters and Events WhatsApp order notification system is verified and connected!')}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <span>Test WhatsApp Ping</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* CREDENTIALS CONFIGURATION FORM */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-stone-950 dark:text-white flex items-center gap-2">
                  <Key className="h-4 w-4 text-amber-500" />
                  <span>Razorpay API Keys Configuration</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Save your Razorpay Test & Live API credentials directly. Values are securely stored in your Supabase backend.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Test Credentials Section */}
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Razorpay Test Credentials (Sandbox)
                    </h4>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Starts with &quot;rzp_test_...&quot;
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase mb-1">
                      Test Key ID
                    </label>
                    <input
                      type="text"
                      value={testKeyId}
                      onChange={(e) => setTestKeyId(e.target.value)}
                      placeholder="rzp_test_xxxxxxxxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase mb-1">
                      Test Key Secret
                    </label>
                    <input
                      type="password"
                      value={testKeySecret}
                      onChange={(e) => setTestKeySecret(e.target.value)}
                      placeholder="Enter new test secret (leave blank to keep current)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Live Credentials Section */}
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Razorpay Live Credentials (Production)
                    </h4>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Starts with &quot;rzp_live_...&quot;
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase mb-1">
                      Live Key ID
                    </label>
                    <input
                      type="text"
                      value={liveKeyId}
                      onChange={(e) => setLiveKeyId(e.target.value)}
                      placeholder="rzp_live_xxxxxxxxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase mb-1">
                      Live Key Secret
                    </label>
                    <input
                      type="password"
                      value={liveKeySecret}
                      onChange={(e) => setLiveKeySecret(e.target.value)}
                      placeholder="Enter new live secret (leave blank to keep current)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Admin WhatsApp Target Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase mb-1">
                  Admin WhatsApp Notification Number
                </label>
                <div className="relative max-w-sm">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={notificationWhatsapp}
                    onChange={(e) => setNotificationWhatsapp(e.target.value)}
                    placeholder="8527296771"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Instant WhatsApp notification with full order details will be sent to this number.
                </p>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                
                <button
                  type="button"
                  onClick={handleTestGateway}
                  disabled={testingOrder}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {testingOrder ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Creating Test Order...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>Test Order Generation</span>
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save & Sync Settings</span>
                    </>
                  )}
                </button>

              </div>

            </form>

            {/* Test Order Feedback Box */}
            {testOrderResult && (
              <div className={`p-4 rounded-2xl text-xs space-y-1 animate-fade-in ${
                testOrderResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {testOrderResult.success ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>{testOrderResult.message}</span>
                </div>
                {testOrderResult.orderId && (
                  <p className="font-mono text-[11px] text-stone-500 dark:text-stone-400 pl-6">
                    Order ID: {testOrderResult.orderId} | Public Key: {testOrderResult.keyId}
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Quick Help Guide */}
          <div className="p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs space-y-2">
            <h4 className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span>How to obtain your Razorpay API Keys</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-300 pl-1 leading-relaxed">
              <li>Log in to your <strong>Razorpay Dashboard</strong> (https://dashboard.razorpay.com).</li>
              <li>Toggle between <strong>Test Mode</strong> and <strong>Live Mode</strong> in the Razorpay top navigation.</li>
              <li>Go to <strong>Settings</strong> &gt; <strong>API Keys</strong> tab.</li>
              <li>Click <strong>Generate Key</strong> to copy your <code>Key Id</code> and <code>Key Secret</code>.</li>
              <li>Paste both keys above, click <strong>Save &amp; Sync Settings</strong>, and your website is ready for payments!</li>
            </ol>
          </div>

        </div>
      </main>
    </div>
  );
}
