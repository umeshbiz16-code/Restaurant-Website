'use client';

import React from 'react';
import { Leaf, Flame, Shield, Heart, Sparkles, UtensilsCrossed } from "lucide-react";

export default function AboutSection() {
  const principles = [
    {
      icon: <Leaf className="h-5 w-5 text-[#B8860B]" />,
      title: "Prana-Rich Ingredients",
      description: "We pick only the freshest, locally sourced, seasonal organic produce. Old, processed, or frozen ingredients are never permitted in our kitchen."
    },
    {
      icon: <Flame className="h-5 w-5 text-[#B8860B]" />,
      title: "Pure Wholesome Cooking",
      description: "We slow-cook our dishes using premium, organic wood-churned A2 cow ghee to boost digestive fire (Agni) and maximize nutrient absorption."
    },
    {
      icon: <Shield className="h-5 w-5 text-[#B8860B]" />,
      title: "Jain Food (No Onion & Garlic)",
      description: "Our recipes offer dedicated Shuddh Jain and Satvik options prepared strictly according to Ahimsa and spiritual culinary standards without root vegetables."
    },
    {
      icon: <Heart className="h-5 w-5 text-[#B8860B]" />,
      title: "Positive Kitchen Vibration",
      description: "Our chefs meditate and chant positive vibrational mantras during preparation, imbuing every dish with peaceful, nourishing energy."
    }
  ];

  return (
    <div className="space-y-4">
      <section className="bg-white dark:bg-stone-900 py-16 md:py-24 border-b border-stone-200 dark:border-stone-800 text-gray-900 dark:text-stone-100 transition-colors" id="about-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3.5 py-1 text-xs font-semibold text-[#B8860B] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ayurvedic Wisdom</span>
            </div>
            <h2 className="font-serif text-3xl font-normal tracking-wide text-gray-950 dark:text-white sm:text-4xl">
              What Makes Food <span className="text-[#B8860B] italic">"Satvik"</span>?
            </h2>
            <p className="text-sm text-gray-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
              In Ayurvedic philosophy, food is divided into three gunas: Satvik, Rajsik, and Tamsik. 
              Satvik food represents purity, truth, harmony, and mental clarity. It is easily digestible, 
              energizes the body, and creates serene wellness.
            </p>
          </div>

          {/* 2-Column Brand Showcase */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Bullet Points */}
            <div className="space-y-8">
              <h3 className="font-serif text-2xl font-normal text-gray-950 dark:text-white tracking-wide">
                Honoring Ancient Indian Culinary Secrets
              </h3>
              <p className="text-sm text-gray-600 dark:text-stone-300 leading-relaxed font-sans">
                At Satvik Caters and Events, we don't just cook—we perform a culinary ritual. 
                Whether it is a fast-paced train delivery order or a grand wedding buffet with 500 guests, 
                we stick to strict guidelines of hygiene, timing, and positive aura.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {principles.map((p, idx) => (
                  <div key={idx} className="bg-stone-50 dark:bg-stone-800 p-5 border border-stone-200 dark:border-stone-700 hover:border-amber-400 transition-all">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700">
                      {p.icon}
                    </div>
                    <h4 className="font-serif font-bold text-[#B8860B] text-base mb-1.5">{p.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-stone-400 leading-relaxed">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Presentation Card */}
            <div className="relative">
              <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-6 shadow-xl">
                <div className="relative h-64 overflow-hidden bg-stone-200 dark:bg-stone-900">
                  <img
                    src="/images/fresh_kitchen_herbs.jpg"
                    alt="Organic herbs and Indian spices on brass table"
                    className="h-full w-full object-cover"
                    id="about-img-organic"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-gradient-to-r from-[#D4AF37] to-amber-600 px-3.5 py-1 text-[10px] uppercase tracking-widest font-bold text-black shadow">
                    Central Kitchen Certified
                  </span>
                </div>
                
                <div className="mt-6 space-y-4">
                  <blockquote className="border-l-2 border-[#B8860B] pl-4 italic text-sm text-gray-800 dark:text-stone-200 font-serif leading-relaxed">
                    "Yatha Annam, Tatha Mannam" — As is the food, so is the mind. Eating pure food keeps thoughts peaceful, joyful, and healthy.
                  </blockquote>
                  <div className="flex items-center space-x-3 pt-2 border-t border-stone-200 dark:border-stone-700">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-amber-100 flex items-center justify-center font-serif font-bold text-amber-900">
                      MJ
                    </div>
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Manish Jaiswal</h5>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Founder & Managing Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Extended Reading: The Ayurvedic Diet Chart */}
      <section className="py-12 bg-white dark:bg-stone-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="border border-stone-200 bg-stone-50 dark:bg-stone-900 dark:border-stone-800 p-8 space-y-6">
            <h3 className="text-xl font-serif font-bold text-gray-950 dark:text-white flex items-center space-x-2">
              <UtensilsCrossed className="h-5 w-5 text-[#B8860B]" />
              <span>The Three Vedic Food Energies (Gunas)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-white dark:bg-stone-800 p-5 border border-stone-200 dark:border-stone-700 shadow-xs">
                <span className="bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase font-mono">
                  1. Satvik (Pure)
                </span>
                <h4 className="font-serif font-bold text-sm text-gray-950 dark:text-white mt-2">Purity & Clarity</h4>
                <p className="text-xs text-gray-600 dark:text-stone-400 mt-1.5 leading-relaxed font-sans">
                  Fresh fruits, organic vegetables, pure dairy, grains, lentils, and rock salt. Elevates calmness, intelligence, health, and peace.
                </p>
              </div>

              <div className="bg-white dark:bg-stone-800 p-5 border border-stone-200 dark:border-stone-700 shadow-xs">
                <span className="bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase font-mono">
                  2. Rajsik (Active)
                </span>
                <h4 className="font-serif font-bold text-sm text-gray-950 dark:text-white mt-2">Passion & Speed</h4>
                <p className="text-xs text-gray-600 dark:text-stone-400 mt-1.5 leading-relaxed font-sans">
                  Spicy foods, hot tea, salt, and sour ingredients. Stimulates action, passion, and sensory enjoyment, but can increase restlessness.
                </p>
              </div>

              <div className="bg-white dark:bg-stone-800 p-5 border border-stone-200 dark:border-stone-700 shadow-xs">
                <span className="bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 uppercase font-mono">
                  3. Tamsik (Heavy)
                </span>
                <h4 className="font-serif font-bold text-sm text-gray-950 dark:text-white mt-2">Dullness & Slumber</h4>
                <p className="text-xs text-gray-600 dark:text-stone-400 mt-1.5 leading-relaxed font-sans">
                  Meats, alcohol, onions, garlic, mushrooms, deep fried, and stale/frozen foods. Promotes sleep, lethargy, anxiety, and stress.
                </p>
              </div>
            </div>

            <p className="text-xs text-center text-amber-900 dark:text-amber-300 leading-normal italic pt-4 font-serif">
              "Every meal served by Satvik Caters and Events is cooked with Satvik Guna parameters to maintain peaceful minds and vibrant spirits."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
