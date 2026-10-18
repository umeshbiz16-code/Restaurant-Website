'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Lock, Upload, Image, Database, RefreshCw, CheckCircle, ArrowLeft, LogOut } from 'lucide-react';
import { Order } from '@/lib/data';

interface AdminSectionProps {
  onBackToStore: () => void;
}

export default function AdminSection({ onBackToStore }: AdminSectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  // Cloudinary upload state
  const [uploadFile, setUploadFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Check session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('satvik_admin_authenticated');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin PINs: 108 or admin123 or satvik2026
    if (password === '108' || password === 'admin123' || password === 'satvik2026' || password === 'admin') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('satvik_admin_authenticated', 'true');
      }
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Security Passcode. (Hint: 108 or admin123)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('satvik_admin_authenticated');
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  // Handle file selection for Cloudinary upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCloudinaryUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccessUrl(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: uploadFile, folder: 'satvik-caters' }),
      });

      const data = await res.json();
      if (data.url) {
        setUploadSuccessUrl(data.url);
      } else if (data.sampleUrl) {
        setUploadSuccessUrl(data.sampleUrl);
      } else if (data.error) {
        setUploadError(data.error);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-stone-50 dark:bg-stone-950">
        <div className="w-full max-w-md bg-white border border-stone-200 p-8 shadow-xl space-y-6 dark:bg-stone-900 dark:border-stone-800">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-[#B8860B] mb-2">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-950 dark:text-white">
              Kitchen Dispatch Admin
            </h2>
            <p className="text-xs text-gray-600 dark:text-stone-400">
              Enter your passcode to manage active orders, Supabase sync, and Cloudinary media.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-stone-300 font-mono">
                Admin Passcode
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter passcode (e.g. 108)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-stone-300 bg-white text-gray-900 focus:outline-none focus:border-[#B8860B] dark:bg-stone-800 dark:border-stone-700 dark:text-white"
                  autoFocus
                />
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errorMsg}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBackToStore}
                className="w-1/2 py-2.5 text-xs font-bold uppercase tracking-wider border border-stone-300 text-gray-700 hover:bg-stone-100 transition dark:border-stone-700 dark:text-stone-300 cursor-pointer"
              >
                Back to Site
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#C59B27] hover:to-amber-700 text-black shadow-md transition cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-gray-900 dark:bg-stone-950 dark:text-stone-100 p-4 sm:p-8 space-y-8">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white">
            Satvik Operations & Kitchen Management
          </h2>
          <p className="text-xs text-gray-600 dark:text-stone-400 font-mono mt-1">
            Connected integrations: Next.js 15 • Supabase Realtime • Cloudinary CDN
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Storefront</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cloudinary Media Uploader */}
        <div className="bg-white border border-stone-200 p-6 space-y-5 dark:bg-stone-900 dark:border-stone-800">
          <div className="flex items-center space-x-2 text-[#B8860B]">
            <Upload className="h-5 w-5" />
            <h3 className="font-serif font-bold text-lg text-gray-950 dark:text-white">
              Cloudinary Media Hub
            </h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-stone-400">
            Upload custom wedding banquet layouts, fresh dish photos, or customer customized cake designs directly to Cloudinary.
          </p>

          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
            />

            {uploadFile && (
              <div className="relative aspect-video w-full overflow-hidden border border-stone-200">
                <img src={uploadFile} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}

            <button
              onClick={handleCloudinaryUpload}
              disabled={!uploadFile || uploading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black py-2.5 text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50 cursor-pointer"
            >
              {uploading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload to Cloudinary CDN</span>
                </>
              )}
            </button>

            {uploadSuccessUrl && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-emerald-700" />
                  Uploaded successfully!
                </p>
                <p className="font-mono text-[10px] break-all">{uploadSuccessUrl}</p>
              </div>
            )}

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-xs text-rose-800">
                {uploadError}
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Live Orders & Supabase Sync */}
        <div className="lg:col-span-2 bg-white border border-stone-200 p-6 space-y-6 dark:bg-stone-900 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#B8860B]">
              <Database className="h-5 w-5" />
              <h3 className="font-serif font-bold text-lg text-gray-950 dark:text-white">
                Live Kitchen Orders & Supabase Records
              </h3>
            </div>
            <button
              onClick={loadOrders}
              className="p-1.5 hover:bg-stone-100 text-gray-600 dark:hover:bg-stone-800 dark:text-stone-300 transition"
              title="Refresh Orders"
            >
              <RefreshCw className={`h-4 w-4 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No active orders found.</p>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 border border-stone-200 bg-stone-50/50 space-y-2 dark:border-stone-800 dark:bg-stone-800/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2 py-0.5">
                        {ord.id}
                      </span>
                      <span className="font-serif font-bold text-sm text-gray-900 dark:text-white">
                        {ord.customerName}
                      </span>
                      <span className="text-xs text-gray-500">({ord.phone})</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                      {ord.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-stone-300">
                    <strong>Address:</strong> {ord.address}
                  </p>

                  <div className="text-xs text-gray-700 dark:text-stone-300 flex flex-wrap gap-2 pt-1 border-t border-stone-200 dark:border-stone-700">
                    {ord.items?.map((it: any, i: number) => (
                      <span key={i} className="bg-white dark:bg-stone-800 px-2 py-0.5 border border-stone-200 dark:border-stone-700 font-mono text-[11px]">
                        {it.quantity}x {it.name}
                      </span>
                    ))}
                    <span className="ml-auto font-bold text-[#B8860B] font-mono">
                      Total: ₹{ord.total}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
