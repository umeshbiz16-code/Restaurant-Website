'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  MessageSquare, Search, RefreshCw, Phone, Mail, Clock, Calendar, 
  MapPin, User, CheckCircle2, AlertCircle, ChefHat, Trash2, 
  ExternalLink, Filter, Save, MessageCircle, HeartHandshake, ShieldCheck
} from 'lucide-react';
import { SunMoonThemeToggle } from '@/components/ui/sun-moon-theme-toggle';

interface EnquiryRecord {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  demandDetails: string;
  dietaryPreference?: string;
  guestCount?: number;
  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  preferredContactMethod?: 'call' | 'email' | 'whatsapp' | 'any';
  status: 'Pending' | 'Contacted' | 'Confirmed' | 'Fulfilled' | 'Closed';
  adminNotes?: string;
  createdAt: number;
  updatedAt?: number;
}

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [saveSuccessId, setSaveSuccessId] = useState<string | null>(null);

  // Authentication check
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

  // Load enquiries
  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setEnquiries(data);
          // Initialize notes
          const noteMap: Record<string, string> = {};
          data.forEach((e: EnquiryRecord) => {
            noteMap[e.id] = e.adminNotes || '';
          });
          setEditingNotes(noteMap);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch enquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadEnquiries();
    }
  }, [isAuthenticated]);

  // Update status or notes
  const handleUpdate = async (id: string, updates: { status?: string; adminNotes?: string }) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, ...updates } as EnquiryRecord : e))
        );
        if (updates.adminNotes !== undefined) {
          setSaveSuccessId(id);
          setTimeout(() => setSaveSuccessId(null), 2500);
        }
      }
    } catch (err) {
      console.error('Error updating enquiry:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete enquiry
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error('Error deleting enquiry:', err);
    }
  };

  // Filtered list
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesStatus = statusFilter === 'ALL' || enq.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      enq.id.toLowerCase().includes(q) ||
      enq.customerName.toLowerCase().includes(q) ||
      enq.phone.includes(q) ||
      (enq.email && enq.email.toLowerCase().includes(q)) ||
      enq.demandDetails.toLowerCase().includes(q) ||
      (enq.location && enq.location.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  // Metric counts
  const totalCount = enquiries.length;
  const pendingCount = enquiries.filter((e) => e.status === 'Pending').length;
  const contactedCount = enquiries.filter((e) => e.status === 'Contacted').length;
  const confirmedCount = enquiries.filter((e) => e.status === 'Confirmed' || e.status === 'Fulfilled').length;

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
                <MessageSquare className="h-6 w-6 text-amber-500" />
                <h1 className="text-2xl font-bold text-stone-950 dark:text-white">
                  Customer Special Order Enquiries
                </h1>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Real-time feed of custom food demands submitted on /form-enquiry. Call or email each customer directly to fulfill their order.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-stone-900 p-1 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm">
                <SunMoonThemeToggle size={36} duration={1200} />
              </div>
              <button
                onClick={loadEnquiries}
                disabled={loading}
                className="py-2.5 px-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
                title="Refresh Enquiries"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Enquiries</span>
              <p className="text-2xl font-black text-stone-950 dark:text-white">{totalCount}</p>
              <p className="text-[10px] text-stone-400 font-medium">Customer Demands</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending Review</span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</p>
              <p className="text-[10px] text-amber-600/80 font-medium">Needs Call or Email</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">In Contact</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{contactedCount}</p>
              <p className="text-[10px] text-blue-600/80 font-medium">Discussion Underway</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Confirmed / Done</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{confirmedCount}</p>
              <p className="text-[10px] text-emerald-600/80 font-medium">Orders Accepted</p>
            </div>

          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer, phone, email, demand..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'Pending', 'Contacted', 'Confirmed', 'Fulfilled', 'Closed'].map((tab) => (
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

          {/* Enquiries Feed */}
          {loading ? (
            <div className="p-16 text-center text-xs text-stone-500 dark:text-stone-400 flex flex-col items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />
              <span>Loading customer enquiries...</span>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">No enquiries found.</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try clearing the search or filter.'
                  : 'Customer demands submitted on /form-enquiry will appear here automatically.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEnquiries.map((enq) => {
                const subject = encodeURIComponent(`Regarding Your Satvik Special Food Request (#${enq.id})`);
                const emailBody = encodeURIComponent(
                  `Hello ${enq.customerName},\n\nThank you for reaching out to Satvik Caters & Events. Regarding your special order demand:\n"${enq.demandDetails}"\n\nWe would be delighted to fulfill this for you. Here are the options and details...\n\nBest regards,\nKitchen Admin\nSatvik Caters & Events\nPhone: 9981508165`
                );
                const emailMailto = enq.email ? `mailto:${enq.email}?subject=${subject}&body=${emailBody}` : '';
                const cleanEnqPhone = (enq.phone || '').replace(/\D/g, '');
                const waPhone = cleanEnqPhone.length === 10 ? `91${cleanEnqPhone}` : cleanEnqPhone;
                const waText = encodeURIComponent(
                  `Hello ${enq.customerName}, this is Satvik Caters & Events Kitchen Admin regarding your Special Order Enquiry #${enq.id}. We are ready to fulfill your request: "${enq.demandDetails.slice(0, 100)}..."`
                );

                return (
                  <div
                    key={enq.id}
                    className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    {/* Top Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-sm font-black text-amber-700 dark:text-amber-400">
                          #{enq.id}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          enq.status === 'Pending'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : enq.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300'
                            : enq.status === 'Confirmed' || enq.status === 'Fulfilled'
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                        }`}>
                          {enq.status}
                        </span>

                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40">
                          {enq.dietaryPreference || 'Sattvic'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {enq.createdAt ? new Date(enq.createdAt).toLocaleString('en-IN') : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Main Grid: Customer Details & Food Demand Details */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      
                      {/* Customer Details Column (5 cols) */}
                      <div className="md:col-span-5 space-y-2.5 text-xs text-stone-700 dark:text-stone-300 border-b md:border-b-0 md:border-r border-stone-100 dark:border-stone-800 pb-4 md:pb-0 md:pr-4">
                        <div className="flex items-center gap-2 font-bold text-stone-950 dark:text-white">
                          <User className="h-4 w-4 text-stone-400 shrink-0" />
                          <span className="text-sm">{enq.customerName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                          <a href={`tel:${enq.phone}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            {enq.phone}
                          </a>
                        </div>

                        {enq.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                            <a href={emailMailto} className="text-stone-600 dark:text-stone-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate">
                              {enq.email}
                            </a>
                          </div>
                        )}

                        {enq.location && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed text-stone-600 dark:text-stone-400">
                              {enq.location}
                            </span>
                          </div>
                        )}

                        <div className="pt-1 flex items-center gap-2 text-[11px] text-stone-500">
                          <span>Target:</span>
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {enq.preferredDate || 'Flexible'} {enq.preferredTime ? `@ ${enq.preferredTime}` : ''}
                          </span>
                          <span>•</span>
                          <span>{enq.guestCount || 1} portions</span>
                        </div>

                        {enq.preferredContactMethod && (
                          <div className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                            Customer Preferred Contact: <span className="uppercase font-bold">{enq.preferredContactMethod}</span>
                          </div>
                        )}
                      </div>

                      {/* Demand Details Column (7 cols) */}
                      <div className="md:col-span-7 space-y-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                            Specific Order Demand / Requested Dishes:
                          </p>
                          <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs sm:text-sm text-stone-900 dark:text-stone-100 leading-relaxed font-sans">
                            &ldquo;{enq.demandDetails}&rdquo;
                          </div>
                        </div>

                        {/* Admin Notes & Status Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                              Update Status
                            </label>
                            <select
                              value={enq.status}
                              disabled={updatingId === enq.id}
                              onChange={(e) => handleUpdate(enq.id, { status: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-white cursor-pointer focus:outline-none focus:border-amber-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted / In Discussion</option>
                              <option value="Confirmed">Confirmed / Order Accepted</option>
                              <option value="Fulfilled">Fulfilled</option>
                              <option value="Closed">Closed / Cancelled</option>
                            </select>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                                Admin Internal Note
                              </label>
                              {saveSuccessId === enq.id && (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                                  Saved!
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editingNotes[enq.id] ?? ''}
                                onChange={(e) =>
                                  setEditingNotes((prev) => ({ ...prev, [enq.id]: e.target.value }))
                                }
                                placeholder="Add note: e.g. Called customer at 2 PM, quoted ₹3200..."
                                className="flex-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdate(enq.id, { adminNotes: editingNotes[enq.id] })}
                                className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold transition-colors cursor-pointer"
                                title="Save Admin Note"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Bar: Action Buttons for Admin to Call, Write Email, or WhatsApp */}
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2.5 bg-stone-50/50 dark:bg-stone-950/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-3xl">
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Call Customer Button */}
                        <a
                          href={`tel:${enq.phone}`}
                          className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          title="Call customer directly"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Make Call: {enq.phone}</span>
                        </a>

                        {/* Write Email Button */}
                        {enq.email ? (
                          <a
                            href={emailMailto}
                            className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                            title="Write email to customer"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>Write Email</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">No email provided</span>
                        )}

                        {/* WhatsApp Button */}
                        <a
                          href={`https://wa.me/${waPhone}?text=${waText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          title="Message customer on WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      {/* Delete Action */}
                      <button
                        onClick={() => handleDelete(enq.id)}
                        className="py-1.5 px-2.5 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="Delete enquiry record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>

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
