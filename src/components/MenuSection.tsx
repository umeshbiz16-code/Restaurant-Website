'use client';

import React, { useState, useMemo } from 'react';
import { MenuItem } from '@/lib/data';
import { Star, Sparkles, Filter, Search, Plus, Calendar, Utensils } from 'lucide-react';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onBookCatering: (item: MenuItem) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function MenuSection({
  menuItems,
  onAddToCart,
  onBookCatering,
  searchQuery,
  setSearchQuery
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSpice, setSelectedSpice] = useState<string>("All");

  const categories = ["All", "Starters", "Mains", "Sweets", "Catering"];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSpice = selectedSpice === "All" || item.spicy === selectedSpice;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSpice && matchesSearch;
    });
  }, [menuItems, selectedCategory, selectedSpice, searchQuery]);

  return (
    <section className="py-20 bg-white dark:bg-stone-950 text-gray-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 transition-colors" id="menu-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="font-serif text-3xl font-normal tracking-wide text-gray-950 dark:text-white sm:text-4xl">
            Our Divine <span className="text-[#B8860B] italic">Pure Satvik Menu</span>
          </h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
            Cooked with wood-churned pure A2 cow ghee, organic spices, and positive Vedic vibrations.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-6">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black shadow-md font-mono"
                    : "bg-stone-100 dark:bg-stone-900 text-gray-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800"
                }`}
                id={`cat-tab-${cat}`}
              >
                {cat === "Catering" ? "Catering Packages" : cat}
              </button>
            ))}
          </div>

          {/* Search Input & Spice Level Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#B8860B]" />
              <input
                type="text"
                placeholder="Search satvik dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-none border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-gray-900 dark:text-white pl-10 pr-4 py-2.5 text-xs focus:border-[#B8860B] focus:outline-none"
                id="menu-search-input"
              />
            </div>

            {/* Spice Filter */}
            <div className="flex items-center space-x-2 w-full sm:w-auto bg-stone-50 dark:bg-stone-900 rounded-none px-3.5 py-1.5 border border-stone-300 dark:border-stone-700">
              <Filter className="h-3.5 w-3.5 text-[#B8860B]" />
              <select
                value={selectedSpice}
                onChange={(e) => setSelectedSpice(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-800 dark:text-stone-300 border-none focus:outline-none cursor-pointer"
                id="spice-select"
              >
                <option value="All" className="bg-white dark:bg-stone-900 text-gray-900 dark:text-white">All Tastes</option>
                <option value="Mild" className="bg-white dark:bg-stone-900 text-gray-900 dark:text-white">Mild</option>
                <option value="Medium" className="bg-white dark:bg-stone-900 text-gray-900 dark:text-white">Medium</option>
                <option value="Sweet" className="bg-white dark:bg-stone-900 text-gray-900 dark:text-white">Sweet</option>
                <option value="Customizable" className="bg-white dark:bg-stone-900 text-gray-900 dark:text-white">Customizable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
            <Utensils className="h-10 w-10 text-[#B8860B] mx-auto animate-pulse" />
            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
              No Satvik items matched your search
            </h3>
            <p className="text-xs text-gray-600 dark:text-stone-400">
              Try clearing filters or searching for our signature "Thali"!
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedSpice("All");
                setSearchQuery("");
              }}
              className="mt-4 bg-gradient-to-r from-[#D4AF37] to-amber-600 px-6 py-2 text-xs font-bold uppercase tracking-wider text-black shadow-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isCatering = item.category === "Catering";

            return (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden border border-stone-200 bg-white shadow-xs transition-all hover:border-amber-300 hover:shadow-xl dark:bg-stone-900 dark:border-stone-800"
                id={`menu-card-${item.id}`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    <span className="bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider shadow-sm flex items-center space-x-1 font-mono">
                      <Sparkles className="h-3 w-3" />
                      <span>{isCatering ? "Catering Setup" : "Pure Quality"}</span>
                    </span>
                    <span className="w-fit px-2 py-0.5 text-[8px] font-bold uppercase bg-white/95 dark:bg-stone-900/95 border border-stone-300 dark:border-stone-700 text-gray-800 dark:text-stone-200 tracking-widest font-mono">
                      {item.spicy}
                    </span>
                  </div>

                  <div className="absolute right-3 top-3 flex items-center space-x-1 bg-white/95 dark:bg-stone-900/95 border border-stone-300 dark:border-stone-700 px-2.5 py-1 text-[10px] font-bold text-gray-900 dark:text-stone-200 shadow-sm backdrop-blur-sm">
                    <Star className="h-3.5 w-3.5 fill-[#B8860B] text-[#B8860B]" />
                    <span>{item.rating}</span>
                    <span className="text-[9px] text-gray-500 font-normal">({item.reviews})</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white">
                      {item.name}
                    </h3>
                    <span className="font-serif text-base font-bold text-[#B8860B] whitespace-nowrap ml-2">
                      ₹{item.price}{isCatering ? "/plate" : ""}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-stone-400 leading-relaxed flex-1">
                    {item.description}
                  </p>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                    {isCatering ? (
                      <button
                        onClick={() => onBookCatering(item)}
                        className="flex w-full items-center justify-center space-x-1.5 border-2 border-[#B8860B] py-3 text-xs font-bold uppercase tracking-widest text-[#B8860B] hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
                        id={`menu-btn-catering-${item.id}`}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Plan & Book Event</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddToCart(item)}
                        className="flex w-full items-center justify-center space-x-1.5 bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#C59B27] hover:to-amber-700 py-3 text-xs font-bold uppercase tracking-widest text-black shadow-md transition cursor-pointer"
                        id={`menu-btn-add-${item.id}`}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add to Basket</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
