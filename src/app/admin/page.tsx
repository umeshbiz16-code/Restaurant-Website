'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Lock, Mail, ArrowRight, RefreshCw, CheckCircle, Clock, 
  Upload, Database, Cloud, AlertCircle, ShieldAlert 
} from 'lucide-react';
import { Order } from '@/lib/data';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('umeshbiz16@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeniedModal, setShowDeniedModal] = useState(false);
  const [deniedMessage, setDeniedMessage] = useState('');

  // Dashboard Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [uploadFile, setUploadFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Check login state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('satvik_admin_auth') || localStorage.getItem('satvik_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch orders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowDeniedModal(false);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('satvik_admin_auth', 'true');
          localStorage.setItem('satvik_admin_auth', 'true');
        }
      } else {
        setDeniedMessage(data.message || 'Invalid username or password.');
        setShowDeniedModal(true);
      }
    } catch (err: any) {
      setDeniedMessage('Could not connect to authentication server. Please try again.');
      setShowDeniedModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadFile(reader.result as string);
        setUploadSuccessUrl(null);
        setUploadError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadToCloudinary = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: uploadFile, folder: 'satvik_dishes' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadSuccessUrl(data.url);
      } else {
        setUploadError(data.error || 'Failed to upload photo to Cloudinary.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  // ----------------------------------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex flex-col justify-center items-center p-4 relative font-sans">
        {/* Access Denied Modal */}
        {showDeniedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative">
              <div className="relative mx-auto w-52 sm:w-60 mb-4 overflow-hidden rounded-xl">
                <img
                  src="/images/admin-access-denied.png"
                  alt="Admin Access Denied"
                  className="w-full h-auto object-contain"
                />
              </div>

              <h3 className="text-xl font-bold text-amber-400 mb-2">
                Admin Access Denied
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed mb-6 font-sans">
                {deniedMessage || 'Invalid administrator username or password. Please try again or return to the website.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeniedModal(false)}
                  className="flex-1 py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="flex-1 py-3 px-4 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center"
                >
                  Continue to Website
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8 space-y-2">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo-dark.png"
                alt="Satvik Logo"
                className="h-14 w-auto object-contain mx-auto mb-2"
              />
            </Link>
            <h2 className="text-xl font-bold text-white">Admin Control Portal</h2>
            <p className="text-xs text-stone-400 font-sans">
              Enter your verified master chef credentials to enter
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Admin Username / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="umeshbiz16@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-stone-950" />
                  <span>Verifying with Database...</span>
                </>
              ) : (
                <>
                  <span>Login to Admin Panel</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-800 text-center">
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // ----------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar onLogout={() => setIsAuthenticated(false)} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Top Welcome Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-800">
            <div>
              <h1 className="text-2xl font-bold text-white">Live Orders & Dispatch</h1>
              <p className="text-xs text-stone-400 mt-1">
                Real-time kitchen order monitor powered by Supabase Realtime Database.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin-menu"
                className="py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Manage Menu Dishes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={loadOrders}
                className="p-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
                title="Refresh Orders"
              >
                <RefreshCw className={`h-4 w-4 ${loadingOrders ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
              <p className="text-xs text-stone-400 font-semibold uppercase">Total Orders</p>
              <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
              <p className="text-xs text-stone-400 font-semibold uppercase">Supabase Status</p>
              <p className="text-sm font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync Active
              </p>
            </div>
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
              <p className="text-xs text-stone-400 font-semibold uppercase">Cloudinary CDN</p>
              <p className="text-sm font-bold text-amber-400 mt-2 flex items-center gap-1.5">
                <Cloud className="h-4 w-4" />
                uvxk7ige Storage Ready
              </p>
            </div>
          </div>

          {/* Cloudinary Media Quick Uploader */}
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cloud className="h-4 w-4 text-amber-400" />
              <span>Cloudinary Direct Photo Uploader</span>
            </h3>
            <p className="text-xs text-stone-400">
              Upload dishes or event photos directly to your Cloudinary cloud account.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full sm:w-auto text-xs text-stone-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-800 file:text-amber-400 hover:file:bg-stone-700 cursor-pointer"
              />
              <button
                onClick={handleUploadToCloudinary}
                disabled={!uploadFile || uploading}
                className="w-full sm:w-auto py-2.5 px-5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Photo</span>
                  </>
                )}
              </button>
            </div>

            {uploadSuccessUrl && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="truncate">Uploaded successfully: {uploadSuccessUrl}</span>
              </div>
            )}
            {uploadError && (
              <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden">
            <div className="p-4 border-b border-stone-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Recent Customer Orders</h3>
              <span className="text-xs text-stone-400 font-mono">{orders.length} Records</span>
            </div>

            {orders.length === 0 ? (
              <div className="p-10 text-center text-xs text-stone-500">
                No orders placed yet. Orders made via website checkout appear here in real-time.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-800">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Phone</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-amber-400">{order.id}</td>
                        <td className="p-3.5 font-medium text-white">{order.customerName}</td>
                        <td className="p-3.5 text-stone-400">{order.phone}</td>
                        <td className="p-3.5">
                          {order.items?.map((it) => `${it.name} x${it.quantity}`).join(', ') || 'N/A'}
                        </td>
                        <td className="p-3.5 font-bold text-white">₹{order.total}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
