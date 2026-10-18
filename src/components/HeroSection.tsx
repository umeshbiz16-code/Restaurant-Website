'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Leaf } from "lucide-react";

interface HeroSectionProps {
  onOrderClick: () => void;
  onCateringClick: () => void;
  onWatchVideoClick?: () => void;
}

export default function HeroSection({ onOrderClick, onCateringClick, onWatchVideoClick }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-stone-950 text-gray-900 dark:text-stone-100 py-16 md:py-24 border-b border-stone-200 dark:border-stone-800 transition-colors" id="hero-section">
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="absolute left-10 bottom-10 -z-10 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Hero text contents */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center space-x-2 rounded-none bg-amber-50 dark:bg-amber-950/40 px-4 py-1.5 text-xs font-semibold text-[#B8860B] border border-amber-200 dark:border-amber-800 tracking-wider uppercase">
                <Sparkles className="h-4 w-4 text-[#B8860B] animate-pulse" />
                <span>Sacred Ayurvedic Catering & Fine Dining</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 rounded-none bg-stone-100 dark:bg-stone-900 px-3 py-1.5 text-[10px] font-bold text-gray-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                <span>Daily Timing: 07:00 AM – 11:00 PM</span>
              </div>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-gray-950 dark:text-white leading-tight">
              Wholesome Food for <br className="hidden sm:inline" />
              <span className="text-[#B8860B] italic font-serif tracking-widest block mt-2">
                Sacred Celebrations
              </span>
            </h1>

            <p className="mx-auto lg:mx-0 max-w-2xl text-xs sm:text-sm text-gray-600 dark:text-stone-300 leading-relaxed tracking-wide font-sans">
              Experience the sublime art of Satvik fine dining. We prepare pure, traditional Indian vegetarian cuisine cooked strictly without onion, garlic, or mushrooms. Every meal is slowly cooked using wood-churned pure A2 cow ghee, mineral-rich Himalayan rock salt, and organic ingredients, accompanied by positive mantra chanting to nurture mental clarity, health, and spiritual harmony.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOrderClick}
                className="group flex w-full sm:w-auto items-center justify-center space-x-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#C59B27] hover:to-amber-700 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-lg transition-all cursor-pointer"
                id="hero-btn-order"
              >
                <span>Order Food Online</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={onCateringClick}
                className="flex w-full sm:w-auto items-center justify-center border-2 border-[#B8860B] bg-transparent text-[#B8860B] hover:bg-amber-50 dark:hover:bg-amber-950/40 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                id="hero-btn-catering"
              >
                Book Event Catering
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 border-t border-stone-200 dark:border-stone-800 pt-8 mt-8">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-3xl font-bold text-[#B8860B]">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-stone-400 flex items-center mt-1 font-semibold">
                  <Leaf className="h-3 w-3 text-[#B8860B] mr-1" />
                  Jain Food (No Onion & Garlic)
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-3xl font-bold text-[#B8860B]">A2 Ghee</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-stone-400 flex items-center mt-1 font-semibold">
                  <ShieldCheck className="h-3 w-3 text-[#B8860B] mr-1" />
                  Wood-Churned Pure Ghee
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-3xl font-bold text-[#B8860B]">10k+</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-stone-400 flex items-center mt-1 font-semibold">
                  <Heart className="h-3 w-3 text-rose-600 mr-1" />
                  Guests Served
                </span>
              </div>
            </div>
          </div>
          
          {/* Bento Image Display */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Image: Thali */}
              <div className="overflow-hidden rounded-none bg-white dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-800 p-2.5 transform hover:scale-[1.01] transition-transform duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src="/images/satvik_premium_thali_1783699387370.jpg"
                    alt="Maharaja Satvik Thali served on a polished brass plate"
                    className="h-72 w-full object-cover contrast-105"
                    id="hero-img-thali"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
                <div className="p-4 bg-stone-50 dark:bg-stone-800/80 flex justify-between items-center border-t border-stone-200/60 dark:border-stone-700">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                      Maharaja Satvik Thali
                    </h3>
                    <p className="text-[10px] text-[#B8860B] font-semibold tracking-wide">
                      Sacred Pure Recipe
                    </p>
                  </div>
                  <span className="bg-amber-100 border border-amber-300 dark:bg-amber-950 dark:border-amber-800 px-3 py-1 text-xs font-bold text-amber-900 dark:text-amber-300 font-mono">
                    ₹349
                  </span>
                </div>
              </div>

              {/* Floating Thumb 1: Paneer Tikka */}
              <div className="absolute -bottom-6 -left-6 hidden sm:block w-48 overflow-hidden rounded-none bg-white dark:bg-stone-900 p-2 shadow-xl border border-stone-200 dark:border-stone-800 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/images/satvik_paneer_tikka_1783699415993.jpg"
                  alt="Satvik Paneer Tikka skewered and grilled"
                  className="h-24 w-full object-cover"
                  id="hero-img-paneer"
                />
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-800 dark:text-stone-300 mt-2 text-center font-mono">
                  Herb Paneer Tikka
                </p>
              </div>

              {/* Floating Thumb 2: Catering Setup */}
              <div className="absolute -top-6 -right-6 hidden sm:block w-48 overflow-hidden rounded-none bg-white dark:bg-stone-900 p-2 shadow-xl border border-stone-200 dark:border-stone-800 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/images/indian_catering_event_1783699401228.jpg"
                  alt="Elegant Catering Layout"
                  className="h-24 w-full object-cover"
                  id="hero-img-catering"
                />
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-800 dark:text-stone-300 mt-2 text-center font-mono">
                  Ritual Buffet
                </p>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
