'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Lock, Mail, ArrowRight, RefreshCw, CheckCircle, Clock, 
  Utensils, Star, Plus, ExternalLink, Sparkles, 
  ShoppingBag, IndianRupee, ChefHat, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { MenuItem, DEFAULT_MENU_ITEMS } from '@/lib/data';
import { SunMoonThemeToggle } from '@/components/ui/sun-moon-theme-toggle';
import { useTheme } from '@/context/ThemeContext';

export default function AdminPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('umeshbiz16@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeniedModal, setShowDeniedModal] = useState(false);
  const [deniedMessage, setDeniedMessage] = useState('');

  // Dashboard Data - Live Dishes from Supabase
  const [dishes, setDishes] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [loadingDishes, setLoadingDishes] = useState(false);

  // Live Orders fetched from Supabase
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Check login state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('satvik_admin_auth') || localStorage.getItem('satvik_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch live dishes and orders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDishes();
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadDishes = async () => {
    setLoadingDishes(true);
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDishes(data);
        }
      }
    } catch (e) {
      console.error('Failed to load dishes:', e);
    } finally {
      setLoadingDishes(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const refreshAllData = () => {
    loadDishes();
    loadOrders();
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

  // ----------------------------------------------------------------------------
  // LOGIN SCREEN (Themed for both light and dark modes)
  // ----------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-center items-center p-4 relative font-sans transition-colors">
        
        {/* Top Floating Theme Switcher */}
        <div className="absolute top-6 right-6 z-20">
          <SunMoonThemeToggle size={34} duration={700} sky={true} />
        </div>

        {/* Access Denied Modal */}
        {showDeniedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative text-stone-900 dark:text-stone-100">
              <div className="relative mx-auto w-52 sm:w-60 mb-4 overflow-hidden rounded-2xl shadow-sm">
                <img
                  src="/images/admin-access-denied.png"
                  alt="Admin Access Denied"
                  className="w-full h-auto object-contain"
                />
              </div>

              <h3 className="text-xl font-bold text-[#B8860B] dark:text-amber-400 mb-2">
                Admin Access Denied
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-6 font-sans">
                {deniedMessage || 'Invalid master chef credentials. Please try again or return to the website.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeniedModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center"
                >
                  Continue to Website
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-md w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8 space-y-2">
            <Link href="/" className="inline-block">
              {theme === 'dark' ? (
                <img
                  src="/images/logo-dark.png"
                  alt="Satvik Logo"
                  className="h-14 w-auto object-contain mx-auto mb-2"
                />
              ) : (
                <img
                  src="/images/logo-light.png"
                  alt="Satvik Logo"
                  className="h-14 w-auto object-contain mx-auto mb-2"
                />
              )}
            </Link>
            <h2 className="text-xl font-bold text-stone-950 dark:text-white">Admin Control Room</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
              Sign in with your master restaurant credentials
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-stone-950" />
                  <span>Verifying with Supabase...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Panel</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-[#B8860B] dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD (THEMED WITH BLACK & WHITE SUPPORT)
  // ----------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-stone-50/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col md:flex-row font-sans transition-colors">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar onLogout={() => setIsAuthenticated(false)} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Top Bar with Title & Theme Switcher */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
                  Kitchen Portal
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-500 font-mono">Live Sync Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 dark:text-white">
                Website Dishes Overview
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Live dishes currently published on the storefront, fetched real-time from Supabase.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle Icon Component */}
              <div className="p-1 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
                <SunMoonThemeToggle size={30} duration={700} sky={true} />
              </div>

              <Link
                href="/admin-order"
                className="py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Live Orders</span>
              </Link>

              <Link
                href="/admin-razorpay"
                className="py-2.5 px-3.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm border border-stone-200 dark:border-stone-700"
              >
                <span>Razorpay Settings</span>
              </Link>

              <Link
                href="/admin-menu"
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add / Edit Dishes</span>
              </Link>

              <button
                onClick={refreshAllData}
                className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Refresh Live Data from Supabase"
              >
                <RefreshCw className={`h-4 w-4 ${loadingDishes || loadingOrders ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Realtime Metrics: Total Dishes & Live Orders Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Dishes Metric */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Dishes</span>
                <Utensils className="h-4 w-4 text-[#B8860B]" />
              </div>
              <p className="text-3xl font-black text-stone-950 dark:text-white">
                {dishes.length}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Live on public website
              </p>
            </div>

            {/* Total Live Orders Metric */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Live Orders</span>
                <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-3xl font-black text-stone-950 dark:text-white">
                {orders.length}
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                Fetched realtime from Supabase
              </p>
            </div>

            {/* Total Order Revenue Metric */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Order Revenue</span>
                <IndianRupee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-stone-950 dark:text-white">
                ₹{orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Collected via Razorpay
              </p>
            </div>

            {/* Active Kitchen Orders Metric */}
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                <span className="text-xs font-bold uppercase tracking-wider">Active Kitchen Orders</span>
                <ChefHat className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-stone-950 dark:text-white">
                {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}
              </p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Preparing or in transit
              </p>
            </div>
          </div>

          {/* Live Order Analytics Card */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                  <span className="h-2 w-2 rounded-full bg-blue-600 -ml-3" />
                  <h3 className="text-base font-bold text-stone-950 dark:text-white">
                    Live Orders Analytics
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                    Realtime Supabase Sync
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Live summary of incoming customer orders, kitchen processing, and payments.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin-order"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Full Order Manager</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Status Pill Counters */}
            <div className="p-4 bg-stone-50/70 dark:bg-stone-950/40 border-b border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-400 font-medium">New Placed:</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">
                  {orders.filter(o => o.status === 'Placed').length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-400 font-medium">In Kitchen:</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">
                  {orders.filter(o => o.status === 'Chef Preparing' || o.status === 'Quality Check').length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-400 font-medium">Out for Delivery:</span>
                <span className="font-extrabold text-purple-600 dark:text-purple-400">
                  {orders.filter(o => o.status === 'Out for Delivery').length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-400 font-medium">Completed:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {orders.filter(o => o.status === 'Delivered').length}
                </span>
              </div>
            </div>

            {/* Recent Live Orders List */}
            {loadingOrders ? (
              <div className="p-10 text-center text-xs text-stone-400 flex flex-col items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                <span>Loading live customer orders from Supabase...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-10 text-center text-xs text-stone-500 dark:text-stone-400 space-y-2">
                <ShoppingBag className="h-8 w-8 mx-auto text-stone-400/60" />
                <p className="font-semibold text-stone-700 dark:text-stone-300">No customer orders placed yet</p>
                <p className="text-[11px]">When customers place orders from the website, they will appear here in real-time with full details.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
                  <thead className="bg-stone-50 dark:bg-stone-950/60 text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-200 dark:border-stone-800">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer &amp; Phone</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total Amount</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-stone-900 dark:text-white">
                          #{order.id}
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-stone-900 dark:text-white">{order.customerName}</p>
                          <p className="text-[11px] text-stone-500 font-mono">{order.phone}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-semibold text-stone-800 dark:text-stone-200">
                            {order.items?.length || 0} dishes
                          </p>
                          <p className="text-[11px] text-stone-500 truncate max-w-xs">
                            {order.items?.map((i: any) => `${i.name} (x${i.quantity})`).join(', ')}
                          </p>
                        </td>
                        <td className="p-3.5 font-bold text-sm text-stone-950 dark:text-white">
                          ₹{order.total}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
                            {order.paymentStatus || 'Paid'} ({order.paymentMethod || 'Razorpay'})
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'Placed'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                              : order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <Link
                            href="/admin-order"
                            className="py-1 px-2.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold text-[11px] transition-colors inline-block"
                          >
                            Manage Order
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Main Box: Live Dishes on the Website */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-950 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#B8860B]" />
                  <span>All Dishes Live on Website ({dishes.length})</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Real-time dishes visible to customers on /menu and /strater pages.
                </p>
              </div>

              <Link
                href="/admin-menu"
                className="text-xs font-bold text-[#B8860B] dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Open Dish Manager to Add/Edit</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loadingDishes ? (
              <div className="p-14 text-center text-xs text-stone-400 flex flex-col items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />
                <span>Loading live dishes from Supabase...</span>
              </div>
            ) : dishes.length === 0 ? (
              <div className="p-12 text-center text-xs text-stone-500">
                No dishes found in database. Go to <Link href="/admin-menu" className="text-amber-500 underline font-bold">Menu Manager</Link> to add your first dish.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
                  <thead className="bg-stone-50 dark:bg-stone-950/60 text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-200 dark:border-stone-800">
                    <tr>
                      <th className="p-4">Dish Photo</th>
                      <th className="p-4">Dish Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Spiciness</th>
                      <th className="p-4">Satvik / Jain</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {dishes.map((dish) => (
                      <tr key={dish.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                        {/* Thumbnail with onError fallback */}
                        <td className="p-4">
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                            <img
                              src={dish.image || '/images/satvik_royal_thali_1783699368595.jpg'}
                              alt={dish.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/images/satvik_royal_thali_1783699368595.jpg';
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-stone-900 dark:text-white text-sm">{dish.name}</p>
                          <p className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">{dish.description}</p>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            {dish.category}
                          </span>
                        </td>

                        <td className="p-4 font-bold text-base text-[#B8860B] dark:text-amber-400">
                          ₹{dish.price}
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-stone-800">
                            {dish.spicy || 'Mild'}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>100% Satvik</span>
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <Link
                            href="/admin-menu"
                            className="py-1 px-3 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold text-[11px] transition-colors inline-block"
                          >
                            Manage
                          </Link>
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
