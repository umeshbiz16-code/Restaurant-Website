'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sparkles, Phone, Mail, Clock, Calendar, MapPin, 
  Users, CheckCircle2, AlertCircle, RefreshCw, Send,
  ShieldCheck, HeartHandshake, ChefHat, ArrowRight, MessageSquare
} from 'lucide-react';

export default function FormEnquiryPage() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [demandDetails, setDemandDetails] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('Sattvic (No Onion-Garlic)');
  const [guestCount, setGuestCount] = useState<string>('5');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [location, setLocation] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'call' | 'email' | 'whatsapp' | 'any'>('call');

  const [submitting, setSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cleanPhone = phone.replace(/\D/g, '');
  const isFormValid = 
    customerName.trim().length >= 2 && 
    cleanPhone.length >= 10 && 
    demandDetails.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrorMessage('Please fill in your name, 10-digit phone number, and detailed order demand.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          demandDetails: demandDetails.trim(),
          dietaryPreference,
          guestCount: parseInt(guestCount) || 1,
          preferredDate,
          preferredTime,
          location: location.trim(),
          preferredContactMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSubmittedEnquiry(data.enquiry);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong while submitting your inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedEnquiry(null);
    setCustomerName('');
    setPhone('');
    setEmail('');
    setDemandDetails('');
    setLocation('');
    setPreferredDate('');
    setPreferredTime('');
    setGuestCount('5');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#B8860B]" />
            <span>Special Culinary Requests &amp; Custom Demands</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-950 dark:text-white tracking-tight">
            Tell Us What You Crave, We Fulfill It
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Have a specific dish demand, sacred dietary preference, bulk gathering meal, or unique catering request? 
            Submit your requirements below. Our kitchen admin will directly call or write an email to you to fulfill it!
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-[#B8860B] flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-white">Admin Direct Call</h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">Personal discussion of your menu</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-white">Custom Email Proposal</h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">Written estimates &amp; dish options</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-900 dark:text-white">100% Pure Satvik &amp; Jain</h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">Desi A2 cow ghee, rock salt</p>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------------
           SUBMISSION SUCCESS CARD
           ---------------------------------------------------------------------------- */}
        {submittedEnquiry ? (
          <div className="max-w-xl mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 text-center shadow-xl space-y-6 animate-fade-in">
            <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
                Demand Received Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 dark:text-white">
                Thank You, {submittedEnquiry.customerName}!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Your order demand has been securely registered with Reference ID{' '}
                <strong className="font-mono text-[#B8860B] dark:text-amber-400">#{submittedEnquiry.id}</strong>.
                Our admin team will review your requirement and make a phone call or write an email to you shortly.
              </p>
            </div>

            {/* Demand Summary Card */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Contact Phone:</span>
                <span className="font-bold text-stone-900 dark:text-white">{submittedEnquiry.phone}</span>
              </div>
              {submittedEnquiry.email && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Email:</span>
                  <span className="font-medium text-stone-700 dark:text-stone-300">{submittedEnquiry.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500">Dietary Style:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{submittedEnquiry.dietaryPreference}</span>
              </div>
              {submittedEnquiry.preferredDate && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Target Date:</span>
                  <span className="font-medium">{submittedEnquiry.preferredDate}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                <span className="text-stone-500 block mb-1">Your Demand Details:</span>
                <p className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-800 dark:text-stone-200 italic leading-relaxed">
                  &ldquo;{submittedEnquiry.demandDetails}&rdquo;
                </p>
              </div>
            </div>

            {/* Quick Direct Actions */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left space-y-2.5">
              <p className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <ChefHat className="h-4 w-4 text-[#B8860B]" />
                <span>Need Urgent Assistance? Contact Admin Directly:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:9981508165"
                  className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call Admin: 9981508165</span>
                </a>
                <a
                  href={`https://wa.me/919981508165?text=${encodeURIComponent(`Hello Satvik Admin, I submitted Special Order Enquiry #${submittedEnquiry.id} for: ${submittedEnquiry.demandDetails}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>WhatsApp Admin</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
              <Link
                href="/menu"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Browse Menu</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (

          /* ----------------------------------------------------------------------------
             CUSTOMER INQUIRY FORM
             ---------------------------------------------------------------------------- */
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6"
          >
            {/* Form Section 1: Customer Details */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-stone-950 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <Users className="h-4 w-4 text-[#B8860B]" />
                <span>1. Customer &amp; Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Mobile Phone Number (Admin will call) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9826012345"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Email Address (Admin will write email)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ramesh.verma@gmail.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Delivery Area / Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Pushpa Nagar / Bhopal Station / Arera Colony"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section 2: Demand & Dietary Details */}
            <div className="space-y-4 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-950 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <ChefHat className="h-4 w-4 text-[#B8860B]" />
                <span>2. Specific Order Demand &amp; Food Requirements</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Describe Your Specific Order Demand in Detail *
                </label>
                <textarea
                  required
                  rows={4}
                  value={demandDetails}
                  onChange={(e) => setDemandDetails(e.target.value)}
                  placeholder="e.g. We require 12 Pure Jain Thalis without root vegetables, Dal Makhani slow-cooked in cow ghee, and 2 kg hot Gulab Jamun for our family puja. Please pack them in airtight leakproof trays."
                  className="w-full p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs leading-relaxed"
                />
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                  Specify dish names, quantities, customized spice levels, oil/ghee preferences, or special packaging.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Dietary Strictness
                  </label>
                  <select
                    value={dietaryPreference}
                    onChange={(e) => setDietaryPreference(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs cursor-pointer"
                  >
                    <option value="Sattvic (No Onion-Garlic)">Sattvic (Pure Ghee, Zero Onion/Garlic)</option>
                    <option value="Pure Jain (No Root Veg)">Pure Jain (No Onion, Garlic, Potato, Ginger)</option>
                    <option value="Swaminarayan / Vaishnav">Swaminarayan / Vaishnav Temple Style</option>
                    <option value="Standard Pure Vegetarian">Standard Pure Vegetarian</option>
                    <option value="Diabetic / Sugar-Free Sweets">Diabetic Friendly / Sugar-Free Sweets</option>
                    <option value="Custom Spicing Only">Custom Spicing / Mild For Kids &amp; Elders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Estimated Portions / Persons
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Preferred Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section 3: Preferred Contact Mode */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                How Should the Admin Reach Out to You?
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'call', label: 'Call Me on Phone', icon: Phone },
                  { id: 'email', label: 'Write Me an Email', icon: Mail },
                  { id: 'whatsapp', label: 'Message on WhatsApp', icon: MessageSquare },
                  { id: 'any', label: 'Any Method is Fine', icon: HeartHandshake },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const selected = preferredContactMethod === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setPreferredContactMethod(opt.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col items-start gap-1.5 cursor-pointer ${
                        selected
                          ? 'border-[#B8860B] bg-amber-50 dark:bg-amber-950/40 text-[#B8860B] dark:text-amber-300 font-bold shadow-xs'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[11px]">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || !isFormValid}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                  submitting || !isFormValid
                    ? 'bg-stone-300 dark:bg-stone-800 text-stone-500 dark:text-stone-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 shadow-amber-500/20 active:scale-98 cursor-pointer'
                }`}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-stone-950" />
                    <span>Submitting Your Special Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 text-stone-950" />
                    <span>Submit Demand to Kitchen Admin</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-stone-500 dark:text-stone-400 mt-2.5 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Instant dispatch to admin panel. Admin will call or email you directly to finalize.</span>
              </p>
            </div>
          </form>
        )}

      </main>

      <Footer />
    </div>
  );
}
