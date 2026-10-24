'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  CreditCard, ShieldCheck, CheckCircle2, AlertCircle, 
  RefreshCw, Zap, Info, Phone, ExternalLink, Sparkles, Check, Lock
} from 'lucide-react';
import { SunMoonThemeToggle } from '@/components/ui/sun-moon-theme-toggle';

export default function AdminRazorpayPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings State
  const [mode, setMode] = useState<'test' | 'live'>('test');
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

  // Quick Switch Mode between Test & Live (Auto-saves automatically!)
  const handleSwitchMode = async (newMode: 'test' | 'live') => {
    if (newMode === mode || switching) return;
    setSwitching(true);
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
          message: `Switched to ${newMode === 'live' ? 'LIVE (Production)' : 'TEST (Sandbox)'} mode! Setting saved automatically.`,
        });
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to switch mode' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error switching mode' });
    } finally {
      setSwitching(false);
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
          notes: 'Testing payment gateway connectivity',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestOrderResult({
          success: true,
          message: `Gateway verified! Successfully generated Razorpay Order ${data.orderId} in ${data.mode.toUpperCase()} mode.`,
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
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Top Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-stone-950 dark:text-white">
                  Razorpay Payment Gateway Mode
                </h1>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Switch instantly between Test (Sandbox) and Live (Production) modes. Settings save automatically.
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

          {/* Toast Notification */}
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
                className="text-stone-400 hover:text-stone-700 dark:hover:text-white ml-2 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* INSTANT ONE-CLICK MODE SWITCHER HERO CARD */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition-all ${
            mode === 'live'
              ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-stone-900 dark:to-emerald-950/20 border-emerald-300 dark:border-emerald-800'
              : 'bg-gradient-to-br from-amber-50 via-white to-amber-50/40 dark:from-amber-950/40 dark:via-stone-900 dark:to-amber-950/20 border-amber-300 dark:border-amber-800'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-xs ${
                    mode === 'live'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-stone-950'
                  }`}>
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    {mode === 'live' ? 'LIVE MODE (PRODUCTION ACTIVE)' : 'TEST MODE (SANDBOX ACTIVE)'}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-white">
                  {mode === 'live' 
                    ? 'Live Real-Money Payment Processing'
                    : 'Test Window / Sandbox Testing'
                  }
                </h2>
                
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
                  {mode === 'live'
                    ? 'Customers on the website will be charged in real money via your verified live Razorpay gateway account.'
                    : 'Customers will experience the full Razorpay payment window using Razorpay test cards & test UPI without deducting real money.'
                  }
                </p>
              </div>

              {/* Instant Toggle Control */}
              <div className="w-full md:w-auto shrink-0 bg-stone-200/80 dark:bg-stone-800 p-1.5 rounded-2xl flex items-center border border-stone-300 dark:border-stone-700 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('test')}
                  disabled={switching}
                  className={`flex-1 md:flex-none py-3 px-5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'test'
                      ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
                  }`}
                >
                  {mode === 'test' && <Check className="h-3.5 w-3.5" />}
                  <span>Test Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchMode('live')}
                  disabled={switching}
                  className={`flex-1 md:flex-none py-3 px-5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'live'
                      ? 'bg-emerald-600 text-white shadow-md font-extrabold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
                  }`}
                >
                  {mode === 'live' && <Check className="h-3.5 w-3.5" />}
                  <span>Live Mode</span>
                </button>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800/80 flex flex-wrap items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 gap-2">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Clicking either mode instantly switches and saves the setting to your database automatically.</span>
              </span>
              {switching && (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Saving automatically...</span>
                </span>
              )}
            </div>
          </div>

          {/* SECURE ENVIRONMENT KEYS BADGE CARD */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-950 dark:text-white flex items-center gap-2">
                    <span>API Credentials Protected in Environment Variables</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold">
                      SECURED
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Your Test &amp; Live API keys are loaded securely from <code>.env</code> and Vercel Environment Variables.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestGateway}
                disabled={testingOrder}
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                {testingOrder ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" />
                    <span>Test Gateway Order</span>
                  </>
                )}
              </button>
            </div>

            {/* Test Order Feedback */}
            {testOrderResult && (
              <div className={`p-4 rounded-2xl text-xs space-y-1 animate-fade-in ${
                testOrderResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {testOrderResult.success ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  )}
                  <span>{testOrderResult.message}</span>
                </div>
                {testOrderResult.orderId && (
                  <p className="font-mono text-[11px] text-stone-500 dark:text-stone-400 pl-6">
                    Verified Order ID: {testOrderResult.orderId}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* WHATSAPP ORDER NOTIFICATION TARGET CARD */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-950 dark:text-white flex items-center gap-2">
                  <span>WhatsApp Order Alerts Target</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{notificationWhatsapp}
                  </span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Whenever an order is successfully paid via Razorpay, a detailed breakdown with dishes, customer info, address, and cooking instructions is immediately dispatched to this number.
                </p>
              </div>
            </div>

            <a
              href={`https://api.whatsapp.com/send?phone=91${notificationWhatsapp.replace(/\D/g, '')}&text=${encodeURIComponent('Satvik Caters and Events WhatsApp order notification system is verified and connected!')}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <span>Test WhatsApp Ping</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}
