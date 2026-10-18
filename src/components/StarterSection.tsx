'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '@/lib/data';
import SwiggyDishCard from './SwiggyDishCard';
import DishDetailModal from './DishDetailModal';
import { Flame, Sparkles, Search, Filter, ShieldCheck } from 'lucide-react';

export const STARTERS_DATA: MenuItem[] = [
  {
    id: "st1",
    name: "Paneer Tikka",
    description: "Cubes of fresh Malai cottage cheese marinated in hung curd, ajwain (carom seeds), and roasted Kashmiri spices, clay-oven tandoor roasted to a smoky perfection.",
    price: 260,
    category: "Starters",
    image: "/images/satvik_paneer_tikka_1783699415993.jpg",
    spicy: "Medium",
    rating: 4.9,
    reviews: 142,
    available: true
  },
  {
    id: "st2",
    name: "Paneer Malai Tikka",
    description: "Tender paneer cubes infused with rich cashew-cream paste, green cardamom, and white pepper, glazed with pure desi ghee and roasted gently.",
    price: 275,
    category: "Starters",
    image: "/images/shahi_paneer.jpg",
    spicy: "Mild",
    rating: 4.9,
    reviews: 98,
    available: true
  },
  {
    id: "st3",
    name: "Crispy Beetroot Kebab",
    description: "Vibrant ruby-red beetroot patties blended with crushed roasted peanuts, ginger, and rock salt, shallow-fried to a delicate crisp exterior.",
    price: 210,
    category: "Starters",
    image: "/images/beetroot_kebab.jpg",
    spicy: "Medium",
    rating: 4.8,
    reviews: 86,
    available: true
  },
  {
    id: "st4",
    name: "Hara Bhara Kebab",
    description: "Nutrient-packed spinach, green peas, and fresh coriander patties stuffed with roasted cashew nuts and pan-seared in cold-pressed oil.",
    price: 195,
    category: "Starters",
    image: "/images/event_decorations.jpg",
    spicy: "Mild",
    rating: 4.8,
    reviews: 114,
    available: true
  },
  {
    id: "st5",
    name: "Dahi Ke Kebab",
    description: "Melt-in-the-mouth hung curd and fresh paneer medallions spiced with crushed cardamom, black pepper, and saffron, fried to golden perfection.",
    price: 240,
    category: "Starters",
    image: "/images/breakfast_buffet.jpg",
    spicy: "Mild",
    rating: 4.9,
    reviews: 92,
    available: true
  },
  {
    id: "st6",
    name: "Stuffed Tandoori Aloo",
    description: "Hollowed baby potatoes filled with spiced paneer, chopped cashews, and raisins, roasted in charcoal embers and basted with A2 cow ghee.",
    price: 220,
    category: "Starters",
    image: "/images/fresh_kitchen_herbs.jpg",
    spicy: "Medium",
    rating: 4.7,
    reviews: 64,
    available: true
  }
];

interface StarterSectionProps {
  onAddToCart?: (item: MenuItem) => void;
}

export default function StarterSection({ onAddToCart }: StarterSectionProps) {
  const [startersList, setStartersList] = useState<MenuItem[]>(STARTERS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpice, setSelectedSpice] = useState('All');
  const [selectedDishForModal, setSelectedDishForModal] = useState<MenuItem | null>(null);

  // Live fetch starters from /api/menu (including freshly added items from admin)
  useEffect(() => {
    fetch('/api/menu')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const apiStarters = data.filter(
            (item: MenuItem) => item.category === 'Starters' || item.category === 'Starter'
          );
          if (apiStarters.length > 0) {
            setStartersList(apiStarters);
          }
        }
      })
      .catch((err) => console.warn('Could not fetch starters from API:', err));
  }, []);

  const filteredStarters = useMemo(() => {
    return startersList.filter((item) => {
      const matchesSpice = selectedSpice === 'All' || item.spicy === selectedSpice;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpice && matchesSearch;
    });
  }, [startersList, selectedSpice, searchQuery]);

  return (
    <section className="py-16 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors" id="starters-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Flame className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
            <span>Clay Oven & Live Tandoor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-950 dark:text-white">
            Sacred <span className="text-orange-500">Tandoori Starters</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Slow-roasted on natural clay ovens, basted in Gir Cow A2 ghee with hand-pounded mountain spices.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search paneer tikka, kebabs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white pl-10 pr-4 py-2.5 text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto bg-stone-50 dark:bg-stone-900 rounded-xl px-3 py-2 border border-stone-200 dark:border-stone-800">
            <Filter className="h-3.5 w-3.5 text-stone-400" />
            <select
              value={selectedSpice}
              onChange={(e) => setSelectedSpice(e.target.value)}
              className="bg-transparent text-xs font-semibold text-stone-800 dark:text-stone-300 border-none focus:outline-none cursor-pointer"
            >
              <option value="All">All Spice Levels</option>
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Hot">Hot</option>
            </select>
          </div>
        </div>

        {/* Swiggy / Zomato style Food Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredStarters.map((dish) => (
            <SwiggyDishCard
              key={dish.id}
              dish={dish}
              onSeeInside={(selected) => setSelectedDishForModal(selected)}
            />
          ))}
        </div>

      </div>

      {/* See Inside Dish Detail Modal */}
      <DishDetailModal
        dish={selectedDishForModal}
        allDishes={startersList}
        onClose={() => setSelectedDishForModal(null)}
        onSelectDish={(newDish) => setSelectedDishForModal(newDish)}
      />
    </section>
  );
}
