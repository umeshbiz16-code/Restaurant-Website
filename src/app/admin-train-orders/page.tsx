'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Train, Search, RefreshCw, Phone, Clock, Calendar, 
  MapPin, User, CheckCircle2, AlertCircle, Ticket, 
  ExternalLink, MessageSquare, ShoppingBag, ArrowUpRight
} from 'lucide-react';
import { SunMoonThemeToggle } from '@/components/ui/sun-moon-theme-toggle';

interface TrainDeliveryItem {
  id: string;
  trainNumber: string;
  trainName?: string;
  pnrNumber?: string;
  coachNumber: string;
  berthNumber: string;
  passengerName: string;
  phone: string;
  deliveryStation: string;
  deliveryDate?: string;
  deliveryTime?: string;
  specialNotes?: string;
  orderId?: string;
  status: string;
  createdAt: number;
  // Associated order details if available
  orderTotal?: number;
  orderItems?: any[];
  paymentStatus?: string;
}

export default function AdminTrainOrdersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trainRecords, setTrainRecords] = useState<TrainDeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Auth check
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

  // Load train delivery records and orders
  const loadTrainData = async () => {
    setLoading(true);
    try {
      // 1. Fetch train registrations
      const trainRes = await fetch('/api/train-delivery');
      const trainData = trainRes.ok ? await trainRes.json() : [];

      // 2. Fetch orders to capture any orders placed with train info
      const ordersRes = await fetch('/api/orders');
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];

      const mergedList: TrainDeliveryItem[] = [];
      const seenIds = new Set<string>();

      // From orders with train details
      if (Array.isArray(ordersData)) {
        ordersData.forEach((order: any) => {
          if (order.isTrainDelivery || order.trainNumber) {
            seenIds.add(order.id);
            mergedList.push({
              id: order.id,
              trainNumber: order.trainNumber || 'N/A',
              trainName: order.trainName,
              pnrNumber: order.pnrNumber,
              coachNumber: order.coachNumber || 'N/A',
              berthNumber: order.berthNumber || 'N/A',
              passengerName: order.customerName,
              phone: order.phone,
              deliveryStation: order.deliveryStation || order.address,
              deliveryDate: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : undefined,
              deliveryTime: order.trainDeliveryTime,
              specialNotes: order.specialInstructions,
              orderId: order.id,
              status: order.status || 'Order Placed',
              createdAt: order.createdAt || Date.now(),
              orderTotal: order.total,
              orderItems: order.items,
              paymentStatus: order.paymentStatus || 'Paid',
            });
          }
        });
      }

      // From train registrations table
      if (Array.isArray(trainData)) {
        trainData.forEach((tr: any) => {
          if (!seenIds.has(tr.id) && !seenIds.has(tr.orderId)) {
            mergedList.push({
              id: tr.id,
              trainNumber: tr.trainNumber,
              trainName: tr.trainName,
              pnrNumber: tr.pnrNumber,
              coachNumber: tr.coachNumber,
              berthNumber: tr.berthNumber,
              passengerName: tr.passengerName,
              phone: tr.phone,
              deliveryStation: tr.deliveryStation,
              deliveryDate: tr.deliveryDate,
              deliveryTime: tr.deliveryTime,
              specialNotes: tr.specialNotes,
              orderId: tr.orderId,
              status: tr.status || 'Registered',
              createdAt: tr.createdAt || Date.now(),
            });
          }
        });
      }

      // Sort by newest
      mergedList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setTrainRecords(mergedList);
    } catch (e) {
      console.warn('Failed to load train orders data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTrainData();
    }
  }, [isAuthenticated]);

  // Update status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      if (id.startsWith('SATVIK-')) {
        await fetch(`/api/orders/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      } else {
        await fetch(`/api/train-delivery/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      }

      setTrainRecords((prev) =>
        prev.map((rec) => (rec.id === id ? { ...rec, status: newStatus } : rec))
      );
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered
  const filteredRecords = trainRecords.filter((rec) => {
    const matchesStatus = statusFilter === 'ALL' || rec.status.toLowerCase().includes(statusFilter.toLowerCase());
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      rec.id.toLowerCase().includes(q) ||
      rec.trainNumber.toLowerCase().includes(q) ||
      (rec.trainName && rec.trainName.toLowerCase().includes(q)) ||
      rec.coachNumber.toLowerCase().includes(q) ||
      rec.berthNumber.toLowerCase().includes(q) ||
      rec.passengerName.toLowerCase().includes(q) ||
      rec.phone.includes(q) ||
      (rec.pnrNumber && rec.pnrNumber.includes(q)) ||
      rec.deliveryStation.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const totalDeliveries = trainRecords.length;
  const activeDeliveries = trainRecords.filter(
    (r) => r.status !== 'Delivered to Coach' && r.status !== 'Delivered' && r.status !== 'Cancelled'
  ).length;
  const completedDeliveries = trainRecords.filter(
    (r) => r.status === 'Delivered to Coach' || r.status === 'Delivered'
  ).length;

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
                <span className="text-2xl">🚆</span>
                <h1 className="text-2xl font-bold text-stone-950 dark:text-white">
                  Train Food Deliveries &amp; Coach Drop Feed
                </h1>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Real-time feed of passengers ordering food delivered to their Train No., Coach No., and Berth No.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-stone-900 p-1 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm">
                <SunMoonThemeToggle size={36} duration={1200} />
              </div>
              <button
                onClick={loadTrainData}
                disabled={loading}
                className="py-2.5 px-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
                title="Refresh Train Data"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Live Feed</span>
              </button>
            </div>
          </div>

          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Train Orders</span>
              <p className="text-2xl font-black text-stone-950 dark:text-white">{totalDeliveries}</p>
              <p className="text-[10px] text-stone-400 font-medium">Coach &amp; Berth Requests</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Platform Active</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{activeDeliveries}</p>
              <p className="text-[10px] text-blue-600/80 font-medium">Preparing / Station Runner</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Delivered to Seat</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedDeliveries}</p>
              <p className="text-[10px] text-emerald-600/80 font-medium">Fulfilled at Coach</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pure Ghee Satvik</span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">100%</p>
              <p className="text-[10px] text-amber-600/80 font-medium">Ayurvedic Packaging</p>
            </div>

          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Train No, Coach (B1, S4), Berth, PNR, Station..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'Placed', 'Preparing', 'Delivered'].map((tab) => (
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

          {/* Train Orders Feed */}
          {loading ? (
            <div className="p-16 text-center text-xs text-stone-500 dark:text-stone-400 flex flex-col items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />
              <span>Loading live train deliveries...</span>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">No train food deliveries found.</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try clearing the search or filter.'
                  : 'Passengers ordering on /train-food-delivery will appear here in real-time.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((rec) => {
                const cleanPhone = (rec.phone || '').replace(/\D/g, '');
                const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                const waText = encodeURIComponent(
                  `Namaste ${rec.passengerName}! This is Satvik Caters Kitchen. We have received your food delivery in train for Train #${rec.trainNumber}, Coach ${rec.coachNumber}, Berth ${rec.berthNumber} at ${rec.deliveryStation}. Our runner is preparing fresh hot food!`
                );

                return (
                  <div
                    key={rec.id}
                    className="rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    
                    {/* Top Bar with Train & Coach Badges */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Train Number Badge */}
                        <div className="px-3 py-1 rounded-xl bg-amber-500 text-stone-950 font-black font-mono text-xs flex items-center gap-1.5 shadow-xs">
                          <span>🚆</span>
                          <span>Train #{rec.trainNumber}</span>
                          {rec.trainName && <span className="font-sans font-medium text-[11px]">({rec.trainName})</span>}
                        </div>

                        {/* Coach & Berth Badge (Prominent) */}
                        <div className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs">
                          <span>Coach: {rec.coachNumber}</span>
                          <span>•</span>
                          <span>Berth: {rec.berthNumber}</span>
                        </div>

                        {/* Order ID if linked */}
                        <span className="font-mono text-xs text-stone-500">
                          #{rec.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {rec.createdAt ? new Date(rec.createdAt).toLocaleString('en-IN') : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Main Grid: Station, Passenger & Dishes */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      
                      {/* Passenger & Journey Column (5 cols) */}
                      <div className="md:col-span-5 space-y-2.5 text-xs text-stone-700 dark:text-stone-300 border-b md:border-b-0 md:border-r border-stone-100 dark:border-stone-800 pb-4 md:pb-0 md:pr-4">
                        <div className="flex items-center gap-2 font-bold text-stone-950 dark:text-white">
                          <User className="h-4 w-4 text-stone-400 shrink-0" />
                          <span className="text-sm">{rec.passengerName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                          <a href={`tel:${rec.phone}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            {rec.phone}
                          </a>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">Delivery Station:</span>
                            <span className="font-bold text-stone-900 dark:text-white">{rec.deliveryStation}</span>
                            {rec.deliveryTime && (
                              <span className="text-[11px] text-stone-500 block">Expected Arrival: {rec.deliveryTime}</span>
                            )}
                          </div>
                        </div>

                        {rec.pnrNumber && (
                          <div className="flex items-center gap-2 text-[11px]">
                            <Ticket className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                            <span className="text-stone-500">IRCTC PNR:</span>
                            <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{rec.pnrNumber}</span>
                          </div>
                        )}

                        {rec.specialNotes && (
                          <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px]">
                            <strong className="text-amber-900 dark:text-amber-300 block uppercase font-mono tracking-wider">
                              Passenger Instructions:
                            </strong>
                            <p className="text-stone-800 dark:text-stone-200 mt-0.5">
                              {rec.specialNotes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Dishes Ordered & Total Column (4 cols) */}
                      <div className="md:col-span-4 space-y-2 border-b md:border-b-0 md:border-r border-stone-100 dark:border-stone-800 pb-4 md:pb-0 md:pr-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          Food Items ({rec.orderItems?.length || 0})
                        </p>

                        {rec.orderItems && rec.orderItems.length > 0 ? (
                          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            {rec.orderItems.map((item: any, idx: number) => (
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
                        ) : (
                          <p className="text-xs text-stone-400 italic">
                            Train coach registered. User browsing menu / checkout.
                          </p>
                        )}

                        {rec.orderTotal && (
                          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
                            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Total Paid:</span>
                            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                              ₹{rec.orderTotal}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status Selector & Live Platform Actions (3 cols) */}
                      <div className="md:col-span-3 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Train Delivery Status
                          </label>
                          <select
                            value={rec.status}
                            disabled={updatingId === rec.id}
                            onChange={(e) => handleUpdateStatus(rec.id, e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-white cursor-pointer focus:outline-none focus:border-amber-500 shadow-xs"
                          >
                            <option value="Registered">Registered / Pending</option>
                            <option value="Placed">Order Placed</option>
                            <option value="Chef Preparing">Chef Preparing</option>
                            <option value="Runner at Platform">Runner at Platform</option>
                            <option value="Delivered to Coach">Delivered to Coach</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-stone-600 dark:text-stone-400">
                          <p className="font-semibold text-amber-900 dark:text-amber-300">Action Tip:</p>
                          <p>Dispatch runner 15 mins before train arrival at platform side.</p>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Action Bar: Call Passenger & Send WhatsApp */}
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2.5 bg-stone-50/50 dark:bg-stone-950/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-3xl">
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Call Passenger */}
                        <a
                          href={`tel:${rec.phone}`}
                          className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          title="Call passenger on mobile"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Call Passenger: {rec.phone}</span>
                        </a>

                        {/* WhatsApp Passenger */}
                        <a
                          href={`https://wa.me/${waPhone}?text=${waText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          title="Message passenger on WhatsApp"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>WhatsApp to Coach {rec.coachNumber}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Real-time Sync Active</span>
                      </div>

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
