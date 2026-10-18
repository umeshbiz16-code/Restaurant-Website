'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Database, Cloud, Phone, MapPin, Clock, Mail } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const [config, setConfig] = useState({
    operatingHours: '07:00 AM – 11:00 PM',
    owner: 'Manish Jaiswal',
    phone: '+91 9981508165',
    address: 'Plot No.255, Ward No.36 SBI Staff Housing Co-operative, Pushpa Nagar, Chandbad, Bhopal (MP) - 462010',
  });

  useEffect(() => {
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setConfig((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-stone-50 dark:bg-stone-950 text-stone-600 dark:text-stone-400 py-14 border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-8 border-b border-stone-200 dark:border-stone-800">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              {theme === 'dark' ? (
                <img
                  src="/images/logo-dark.png"
                  alt="Satvik Caters & Events"
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <img
                  src="/images/logo-light.png"
                  alt="Satvik Caters & Events"
                  className="h-10 w-auto object-contain"
                />
              )}
            </Link>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Nourishing celebrations with pure vegetarian fine dining and luxury event catering, cooked meticulously with love and ancient Vedic traditions.
            </p>
            <div className="text-[11px] text-stone-500 font-medium border-t border-stone-200 dark:border-stone-800 pt-2 font-mono">
              Founder & Owner: <span className="text-stone-900 dark:text-white font-bold">{config.owner}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-[#B8860B] dark:hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#B8860B] dark:hover:text-amber-400 transition-colors">
                  Menu & Thalis
                </Link>
              </li>
              <li>
                <Link href="/strater" className="hover:text-[#B8860B] dark:hover:text-amber-400 transition-colors">
                  Clay Oven Starters
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-[#B8860B] dark:hover:text-amber-400 transition-colors">
                  Catering & Train Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quality & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Our Purity Standards
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-2 shrink-0" />
                100% Pure Vegetarian Kitchen
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-2 shrink-0" />
                Strictly Onion & Garlic Free (Jain)
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-2 shrink-0" />
                Hand-Churned Pure A2 Cow Ghee
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-2 shrink-0" />
                Saindhav Mineral Pink Rock Salt
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-2 shrink-0" />
                Vedic Cleanliness & Chanted Mantras
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Catering Assistance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Contact & Hours
            </h4>
            <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex items-start space-x-2">
                <Clock className="h-3.5 w-3.5 text-[#B8860B] mt-0.5 shrink-0" />
                <span>{config.operatingHours} Daily</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-3.5 w-3.5 text-[#B8860B] mt-0.5 shrink-0" />
                <span>{config.address}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="h-3.5 w-3.5 text-[#B8860B] mt-0.5 shrink-0" />
                <a href={`tel:${config.phone}`} className="text-[#B8860B] font-bold hover:underline">
                  {config.phone}
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="h-3.5 w-3.5 text-[#B8860B] mt-0.5 shrink-0" />
                <span>bookings@satvikcaters.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Realtime Integration Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs mb-8">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 font-mono text-[11px]">
              <Database className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
              Supabase Realtime Database Ready
            </span>
            <span className="text-gray-400 text-[11px] hidden sm:inline">•</span>
            <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 font-mono text-[11px] hidden sm:flex">
              <Cloud className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
              Cloudinary Media Storage Ready
            </span>
          </div>

          <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-mono font-medium flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Next.js 15 Fullstack Framework</span>
          </div>
        </div>

        {/* Copyright & Note */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 dark:text-stone-400 gap-3">
          <p>© 2026 Satvik Caters and Events. All Rights Reserved.</p>
          <p className="flex items-center text-[#B8860B]">
            <Heart className="h-3 w-3 fill-[#B8860B] text-[#B8860B] mr-1.5" />
            <span>Cooked strictly with love, peace, and spiritual purity.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
