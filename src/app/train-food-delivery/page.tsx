'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { 
  Sparkles, Train, MapPin, Phone, User, Calendar, Clock, 
  CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, RefreshCw,
  ShoppingBag, Ticket, Info, Check, HelpCircle
} from 'lucide-react';

const POPULAR_STATIONS = [
  'Bhopal Station (Main)',
  'Rain Kamlapati Station',
  'Sant Hirdaram Nagar',
  'Nishatpura',
  'Bhopal Junction (BPL)',
  'Rani Kamlapati / Habibganj (RKMP)',
  'Itarsi Junction (ET)',
  'Bina Junction (BINA)',
  'Vidisha (BHS)',
  'Hoshangabad / Narmadapuram (NDPM)',
  'Ujjain Junction (UJN)',
  'Indore Junction (INDB)',
  'Jabalpur (JBP)',
  'Gwalior Junction (GWL)',
];

export default function TrainFoodDeliveryPage() {
  const router = useRouter();
  const { trainDeliveryInfo, setTrainDeliveryInfo } = useCart();

  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [pnrNumber, setPnrNumber] = useState('');
  const [coachNumber, setCoachNumber] = useState('');
  const [berthNumber, setBerthNumber] = useState('');
  const [deliveryStation, setDeliveryStation] = useState('Bhopal Junction (BPL)');
  const [customStation, setCustomStation] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(3);

  // Prefill if existing train delivery info in context or localStorage
  useEffect(() => {
    if (trainDeliveryInfo) {
      setTrainNumber(trainDeliveryInfo.trainNumber || '');
      setTrainName(trainDeliveryInfo.trainName || '');
      setPnrNumber(trainDeliveryInfo.pnrNumber || '');
      setCoachNumber(trainDeliveryInfo.coachNumber || '');
      setBerthNumber(trainDeliveryInfo.berthNumber || '');
      if (POPULAR_STATIONS.includes(trainDeliveryInfo.deliveryStation)) {
        setDeliveryStation(trainDeliveryInfo.deliveryStation);
      } else if (trainDeliveryInfo.deliveryStation) {
        setDeliveryStation('OTHER');
        setCustomStation(trainDeliveryInfo.deliveryStation);
      }
      setDeliveryDate(trainDeliveryInfo.deliveryDate || '');
      setDeliveryTime(trainDeliveryInfo.deliveryTime || '');
      setPassengerName(trainDeliveryInfo.passengerName || '');
      setPhone(trainDeliveryInfo.passengerPhone || '');
      setSpecialNotes(trainDeliveryInfo.specialNotes || '');
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setDeliveryDate(today);
    }

    // Check if station query param is passed from Navbar hover
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const stationParam = params.get('station');
      if (stationParam) {
        setDeliveryStation(stationParam);
      }
    }
  }, [trainDeliveryInfo]);

  // Handle countdown auto-redirect after successful submission
  useEffect(() => {
    if (!successData) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/menu');
    }
  }, [successData, countdown, router]);

  const activeStation = deliveryStation === 'OTHER' ? customStation.trim() : deliveryStation;
  const cleanPhone = phone.replace(/\D/g, '');
  const isFormValid = 
    trainNumber.trim().length >= 3 &&
    coachNumber.trim().length >= 1 &&
    berthNumber.trim().length >= 1 &&
    activeStation.length >= 2 &&
    passengerName.trim().length >= 2 &&
    cleanPhone.length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrorMessage('Please enter Train No., Coach No., Berth No., Station, Passenger Name, and 10-digit Phone.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      trainNumber: trainNumber.trim(),
      trainName: trainName.trim(),
      pnrNumber: pnrNumber.trim(),
      coachNumber: coachNumber.trim().toUpperCase(),
      berthNumber: berthNumber.trim(),
      deliveryStation: activeStation,
      deliveryDate: deliveryDate || undefined,
      deliveryTime: deliveryTime || undefined,
      passengerName: passengerName.trim(),
      phone: phone.trim(),
      specialNotes: specialNotes.trim(),
    };

    try {
      // 1. Submit to backend API
      const res = await fetch('/api/train-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to register train delivery');
      }

      // 2. Save in CartContext & LocalStorage for checkout
      setTrainDeliveryInfo({
        trainNumber: payload.trainNumber,
        trainName: payload.trainName,
        pnrNumber: payload.pnrNumber,
        coachNumber: payload.coachNumber,
        berthNumber: payload.berthNumber,
        deliveryStation: payload.deliveryStation,
        deliveryDate: payload.deliveryDate,
        deliveryTime: payload.deliveryTime,
        passengerName: payload.passengerName,
        passengerPhone: payload.phone,
        specialNotes: payload.specialNotes,
        createdAt: Date.now(),
      });

      setSuccessData(data.record || payload);
      setCountdown(3);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error registering food delivery in train');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Top Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <span className="text-sm">🚆</span>
            <span>Indian Railways Coach &amp; Berth Delivery</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-950 dark:text-white tracking-tight">
            Hot Pure Satvik Food Delivered Right to Your Train Seat
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Traveling by train? Don&apos;t compromise on pure food. Enter your Train No., Coach No., and Berth No. below.
            We will hand-deliver fresh, hot Satvik thalis, tikkas, and pure cow ghee delicacies straight to your coach door!
          </p>
        </div>

        {/* Process Flow Roadmap (4 Clear Steps) */}
        <div className="mb-10 p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 text-center mb-4 font-mono">
            How Food delivery in Train Works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60">
              <span className="h-7 w-7 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-white">Fill Train Details</h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Train, Coach &amp; Berth No.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
              <span className="h-7 w-7 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-white">Choose Food</h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Add favorite dishes to cart</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
              <span className="h-7 w-7 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-white">Coach Checkout</h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Train details on bill &amp; pay</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="h-7 w-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Berth Delivery</h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">Hot meal at your train door</p>
              </div>
            </div>

          </div>
        </div>

        {/* ----------------------------------------------------------------------------
           SUCCESS SUBMISSION CARD
           ---------------------------------------------------------------------------- */}
        {successData ? (
          <div className="max-w-xl mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 text-center shadow-xl space-y-6 animate-fade-in">
            <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono flex items-center justify-center gap-1">
                <span>🚆</span>
                <span>Train Coach Delivery Confirmed</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 dark:text-white">
                Train Details Verified!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                We have linked your train journey details. Your hot food will be delivered directly to your berth!
              </p>
            </div>

            {/* Verified Train Details Card */}
            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-amber-200/60 dark:border-amber-800">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Train Number:</span>
                  <span className="font-mono font-bold text-sm text-amber-700 dark:text-amber-400">
                    #{successData.trainNumber} {successData.trainName ? `(${successData.trainName})` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Coach &amp; Berth:</span>
                  <span className="font-bold text-sm text-stone-950 dark:text-white">
                    Coach {successData.coachNumber} • Berth {successData.berthNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Delivery Station:</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{successData.deliveryStation}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Passenger:</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{successData.passengerName}</span>
                </div>
              </div>

              {successData.pnrNumber && (
                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800 flex justify-between">
                  <span className="text-stone-500">IRCTC PNR:</span>
                  <span className="font-mono font-bold text-stone-700 dark:text-stone-300">{successData.pnrNumber}</span>
                </div>
              )}
            </div>

            {/* Auto Redirect Banner */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-center space-y-2">
              <p className="text-xs font-bold text-blue-950 dark:text-blue-200 flex items-center justify-center gap-1.5">
                <ShoppingBag className="h-4 w-4 text-blue-600" />
                <span>Redirecting to Menu to add your pure food ({countdown}s)...</span>
              </p>
              <p className="text-[11px] text-blue-700 dark:text-blue-300">
                All train details will automatically show on the checkout page when you place your order!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/menu"
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
              >
                <span>Proceed to Menu &amp; Add Food</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (

          /* ----------------------------------------------------------------------------
             TRAIN DELIVERY REGISTRATION FORM
             ---------------------------------------------------------------------------- */
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6"
          >
            {/* Active Train delivery banner notice if previously filled */}
            {trainDeliveryInfo && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚆</span>
                  <p className="text-stone-700 dark:text-stone-300">
                    You currently have an active train booking saved for <strong>Train #{trainDeliveryInfo.trainNumber} (Coach {trainDeliveryInfo.coachNumber}, Berth {trainDeliveryInfo.berthNumber})</strong>. You can update it below.
                  </p>
                </div>
                <Link
                  href="/menu"
                  className="font-bold text-[#B8860B] hover:underline whitespace-nowrap shrink-0"
                >
                  Go to Menu &rarr;
                </Link>
              </div>
            )}

            {/* Form Section 1: Train, Coach & Berth Info */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-stone-950 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <Train className="h-4 w-4 text-[#B8860B]" />
                <span>1. Train, Coach &amp; Berth Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Train Number (5 Digits) *
                  </label>
                  <div className="relative">
                    <Train className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={trainNumber}
                      onChange={(e) => setTrainNumber(e.target.value)}
                      placeholder="e.g. 12002 or 12155"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Train Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={trainName}
                    onChange={(e) => setTrainName(e.target.value)}
                    placeholder="e.g. Bhopal Shatabdi Express / Shaan-e-Bhopal"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                  />
                </div>
              </div>

              {/* Coach and Berth in a highlighted side-by-side row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50">
                <div>
                  <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
                    Coach Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={coachNumber}
                    onChange={(e) => setCoachNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. B1, S4, A2, H1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-700 text-xs text-stone-950 dark:text-white font-mono font-bold uppercase focus:outline-none focus:border-amber-500 shadow-xs"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Sleeper, 3AC, 2AC, 1AC or CC</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
                    Berth / Seat Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={berthNumber}
                    onChange={(e) => setBerthNumber(e.target.value)}
                    placeholder="e.g. 45 (Lower) / 12 (SU)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-700 text-xs text-stone-950 dark:text-white font-mono font-bold focus:outline-none focus:border-amber-500 shadow-xs"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Lower, Middle, Upper, Side</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    IRCTC PNR Number (Optional)
                  </label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      maxLength={10}
                      value={pnrNumber}
                      onChange={(e) => setPnrNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit IRCTC PNR"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white font-mono focus:outline-none focus:border-amber-500 shadow-xs"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">Helps live train tracking</p>
                </div>
              </div>

              {/* Station Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Delivery Station (Where you want food delivered) *
                  </label>
                  <select
                    value={deliveryStation}
                    onChange={(e) => setDeliveryStation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs cursor-pointer"
                  >
                    {POPULAR_STATIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                    <option value="OTHER">Other Railway Station (Type Manually)</option>
                  </select>
                </div>

                {deliveryStation === 'OTHER' ? (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Enter Railway Station Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customStation}
                      onChange={(e) => setCustomStation(e.target.value)}
                      placeholder="e.g. Nagpur Junction / Mathura Junction"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Delivery Date
                      </label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Train Arrival Time
                      </label>
                      <input
                        type="time"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Section 2: Passenger Details */}
            <div className="space-y-4 pt-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-950 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <User className="h-4 w-4 text-[#B8860B]" />
                <span>2. Passenger Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Passenger Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      placeholder="e.g. Devansh Sharma"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Passenger Mobile Phone (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">Delivery runner will call this number when train arrives</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Delivery Runner Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Will be standing at coach door, please deliver quickly as stoppage is 5 mins"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-xs"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit & Next Step Button */}
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
                    <span>Verifying Train Details...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Train Details &amp; Proceed to Select Food</span>
                    <ArrowRight className="h-4 w-4 text-stone-950" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-stone-500 dark:text-stone-400 mt-2.5 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>On next step, pick dishes from the menu. All train coach details will be preserved on checkout.</span>
              </p>
            </div>
          </form>
        )}

      </main>

      <Footer />
    </div>
  );
}
