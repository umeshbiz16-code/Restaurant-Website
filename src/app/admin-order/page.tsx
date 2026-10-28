'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  ClipboardList, Search, RefreshCw, CheckCircle2, Clock, 
  MapPin, Phone, User, ExternalLink, AlertCircle, ChefHat, 
  Truck, CheckCircle, XCircle, ArrowUpRight, DollarSign, 
  Sparkles, MessageSquare 
} from 'lucide-react';
import { SunMoonThemeToggle } from '@/components/ui/sun-moon-theme-toggle';
import { generateWhatsAppDirectLink } from '@/lib/whatsapp';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

interface OrderRecord {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  status: 'Placed' | 'Chef Preparing' | 'Quality Check' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  paymentStatus: string;
  gatewayMode?: 'test' | 'live';
  razorpayPaymentId?: string;
  specialInstructions?: string;
  whatsappNotified?: boolean;
  createdAt: number;
}

export default function AdminOrderPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  // Load orders
  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  // Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.phone.includes(q) ||
      (order.address && order.address.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-stone-50/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-amber-500" />
                <h1 className="text-2xl font-bold text-stone-950 dark:text-white">
                  Customer Orders Management
                </h1>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Real-time feed of all website orders with Razorpay payments, cooking instructions, and WhatsApp dispatch.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-stone-900 p-1 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm">
                <SunMoonThemeToggle size={36} duration={1200} />
              </div>
              <button
                onClick={loadOrders}
                disabled={loading}
                className="py-2.5 px-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
                title="Refresh Orders"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Orders</span>
              </button>
            </div>
          </div>

          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Total Orders */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Orders</span>
              <p className="text-2xl font-black text-stone-950 dark:text-white">{orders.length}</p>
              <p className="text-[10px] text-stone-400 font-medium">Recorded in Database</p>
            </div>

            {/* Total Revenue */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Revenue</span>
              <p className="text-2xl font-black text-[#B8860B] dark:text-amber-400">₹{totalRevenue}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">via Razorpay Gateway</p>
            </div>

            {/* Active Orders */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Kitchen Active</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{activeOrdersCount}</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Preparing / In Transit</p>
            </div>

            {/* Delivered */}
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Delivered</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{deliveredCount}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Fulfilled Successfully</p>
            </div>

          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Customer Name, Phone..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 shadow-xs"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'Placed', 'Chef Preparing', 'Out for Delivery', 'Delivered'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

          </div>

          {/* Orders Feed */}
          {loading ? (
            <div className="p-16 text-center text-xs text-stone-500 dark:text-stone-400 flex flex-col items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />
              <span>Loading orders from Supabase...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">No orders found.</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try clearing the search or filter.'
                  : 'Customer orders will appear here automatically when placed on /cart.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const whatsappUrl = generateWhatsAppDirectLink({
                  orderId: order.id,
                  customerName: order.customerName,
                  phone: order.phone,
                  address: order.address,
                  items: order.items || [],
                  subtotal: order.subtotal || 0,
                  deliveryCharge: order.deliveryCharge || 0,
                  tax: order.tax || 0,
                  total: order.total || 0,
                  paymentMethod: order.paymentMethod,
                  paymentStatus: order.paymentStatus,
                  gatewayMode: order.gatewayMode || 'test',
                  razorpayPaymentId: order.razorpayPaymentId,
                  specialInstructions: order.specialInstructions,
                  createdAt: order.createdAt,
                });

                return (
                  <div
                    key={order.id}
                    className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-sm font-black text-stone-950 dark:text-white">
                          #{order.id}
                        </span>

                        {/* Razorpay Mode Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          order.gatewayMode === 'live'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        }`}>
                          Razorpay {order.gatewayMode === 'live' ? 'LIVE' : 'TEST'}
                        </span>

                        {/* Payment Status */}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {order.paymentStatus || 'PAID'}
                        </span>

                        {order.razorpayPaymentId && (
                          <span className="text-[11px] font-mono text-stone-400">
                            Txn: {order.razorpayPaymentId}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Order Grid: Customer & Items */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      
                      {/* Customer & Address Details (5 cols) */}
                      <div className="md:col-span-5 space-y-2 text-xs text-stone-700 dark:text-stone-300 border-b md:border-b-0 md:border-r border-stone-100 dark:border-stone-800 pb-4 md:pb-0 md:pr-4">
                        <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
                          <User className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                          <span>{order.customerName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                          <a href={`tel:${order.phone}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            {order.phone}
                          </a>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed text-stone-600 dark:text-stone-400">
                            {order.address}
                          </span>
                        </div>

                        {/* Cooking / Delivery Instructions */}
                        {order.specialInstructions && (
                          <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-[11px]">
                            <strong className="text-amber-800 dark:text-amber-300 block uppercase font-mono tracking-wider">
                              Kitchen / Delivery Note:
                            </strong>
                            <p className="text-amber-900 dark:text-amber-200 mt-0.5">
                              {order.specialInstructions}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Dishes Ordered List (4 cols) */}
                      <div className="md:col-span-4 space-y-2 border-b md:border-b-0 md:border-r border-stone-100 dark:border-stone-800 pb-4 md:pb-0 md:pr-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          Dishes Ordered ({order.items?.length || 0})
                        </p>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-stone-800 dark:text-stone-200 truncate pr-2">
                                <strong className="text-amber-600 dark:text-amber-400">{item.quantity}x</strong> {item.name}
                              </span>
                              <span className="font-semibold text-stone-500 shrink-0">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bill Total & Actions (3 cols) */}
                      <div className="md:col-span-3 flex flex-col justify-between space-y-3">
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Amount Paid</p>
                          <p className="text-xl font-black text-stone-950 dark:text-white">
                            ₹{order.total}
                          </p>
                          <div className="text-[10px] text-stone-500 dark:text-stone-400">
                            Subtotal: ₹{order.subtotal} | Tax: ₹{order.tax}
                          </div>
                        </div>

                        {/* Status Selector */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase text-stone-400">
                            Update Order Status
                          </label>
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-white cursor-pointer focus:outline-none focus:border-amber-500"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Chef Preparing">Chef Preparing</option>
                            <option value="Quality Check">Quality Check</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                    </div>

                    {/* Order Bottom Bar: WhatsApp Dispatch Action */}
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50/50 dark:bg-stone-950/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-3xl">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Order details and payment verified</span>
                      </div>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        title="Open full order formatted message on WhatsApp to 9981508165"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Send / View WhatsApp to 9981508165</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
