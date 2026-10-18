'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import { 
  Sparkles, ChevronRight, ShieldCheck, Heart, Leaf, UtensilsCrossed, 
  Flame, Briefcase, Award, CheckCircle2 
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950 transition-colors">
      
      {/* Navbar with responsive Light/Dark Logos and SunMoonThemeToggle */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          onOrderClick={() => router.push('/menu')}
          onCateringClick={() => router.push('/service')}
        />

        {/* Premium Category Spotlight Cards */}
        <section className="py-20 bg-stone-50/50 dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-14">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5 text-[#B8860B]" />
                <span>Sacred Flavors & Celebrations</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-950 dark:text-white tracking-tight">
                Our Signature Offerings
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                Handcrafted pure vegetarian dining prepared in traditional copper and clay vessels with pure A2 cow ghee.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Royal Satvik Thalis & Menu */}
              <div className="group border border-stone-200 bg-white dark:bg-stone-900 dark:border-stone-800 p-6 flex flex-col justify-between hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-600 transition-all rounded-xl shadow-xs">
                <div>
                  <div className="relative h-52 overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800 mb-5">
                    <img
                      src="/images/satvik_premium_thali_1783699387370.jpg"
                      alt="Royal Satvik Thali"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-900 dark:text-amber-300 shadow-xs flex items-center gap-1">
                      <UtensilsCrossed className="h-3 w-3 text-[#B8860B]" />
                      <span>Thalis & Mains</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-stone-950 dark:text-white text-lg mb-2">
                    Royal Satvik Thalis
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-6 font-sans">
                    Taste our signature Maharaja & Premium Thalis. Cooked strictly without garlic or onion, using mineral-rich rock salt, organic herbs, and wood-churned pure A2 ghee.
                  </p>
                </div>
                <Link
                  href="/menu"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Explore Menu</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Card 2: Clay Oven Starters */}
              <div className="group border border-stone-200 bg-white dark:bg-stone-900 dark:border-stone-800 p-6 flex flex-col justify-between hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-600 transition-all rounded-xl shadow-xs">
                <div>
                  <div className="relative h-52 overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800 mb-5">
                    <img
                      src="/images/satvik_paneer_tikka_1783699415993.jpg"
                      alt="Clay Oven Paneer Tikka"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-900 dark:text-amber-300 shadow-xs flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      <span>Live Tandoor</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-stone-950 dark:text-white text-lg mb-2">
                    Clay Oven Starters
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-6 font-sans">
                    Savor freshly marinated organic paneer tikkas, crispy pan-seared beetroot kebabs, and golden dahi kebabs. Lightly roasted in traditional clay ovens for delicate crunch.
                  </p>
                </div>
                <Link
                  href="/strater"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Explore Starters</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Card 3: Events & IRCTC Train Delivery */}
              <div className="group border border-stone-200 bg-white dark:bg-stone-900 dark:border-stone-800 p-6 flex flex-col justify-between hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-600 transition-all rounded-xl shadow-xs">
                <div>
                  <div className="relative h-52 overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800 mb-5">
                    <img
                      src="/images/indian_catering_event_1783699401228.jpg"
                      alt="Puja Catering Buffet Setup"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-900 dark:text-amber-300 shadow-xs flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-emerald-600" />
                      <span>Catering & IRCTC</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-stone-950 dark:text-white text-lg mb-2">
                    Events & IRCTC Train Delivery
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-6 font-sans">
                    Luxury event catering for weddings, griha pravesh, corporate summits, plus official IRCTC train berth food delivery across Bhopal Main, Rani Kamlapati, and Sant Hirdaram stations.
                  </p>
                </div>
                <Link
                  href="/service"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Explore Services</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Satvik - Standards & Purity Banner */}
        <section className="py-20 bg-white dark:bg-stone-950 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>The Satvik Purity Guarantee</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-950 dark:text-white tracking-tight">
                  Pure Vedic Cooking with Zero Compromises
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  At Satvik Caters and Events, cooking is an act of spiritual devotion. Every grain of rice, dal, and fresh vegetable is prepared to elevate prana (vital life energy) and cultivate tranquility of mind.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start space-x-3 p-3.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-950 dark:text-white">Strictly No Onion & Garlic</h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Authentic Jain-friendly satvik cuisine.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-950 dark:text-white">Pure Wood-Churned A2 Ghee</h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Crafted with pure indigenous cow ghee.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-950 dark:text-white">Himalayan Pink Salt</h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Mineral-rich unrefined rock salt.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-stone-950 dark:text-white">IRCTC Approved Catering</h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Certified berth delivery across Bhopal stations.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800">
                  <img
                    src="/images/vedic_herbs_produce.jpg"
                    alt="Pure Vedic Produce"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white space-y-1">
                      <p className="text-xs uppercase font-mono tracking-widest text-amber-300 font-bold">Ayurvedic Culinary Heritage</p>
                      <h3 className="text-lg font-bold">Infused with healing spices and mindfulness</h3>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
