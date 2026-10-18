'use client';

import React, { useState, useMemo } from 'react';
import { MenuItem } from '@/lib/data';
import SwiggyDishCard from './SwiggyDishCard';
import DishDetailModal from './DishDetailModal';
import { Search, Filter, Utensils, Sparkles } from 'lucide-react';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onAddToCart?: (item: MenuItem) => void;
  onBookCatering?: (item: MenuItem) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function MenuSection({
  menuItems,
  searchQuery = '',
  setSearchQuery,
}: MenuSectionProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSpice, setSelectedSpice] = useState<string>('All');
  const [selectedDishForModal, setSelectedDishForModal] = useState<MenuItem | null>(null);

  const categories = ['All', 'Starters', 'Mains', 'Sweets', 'Catering'];

  const query = setSearchQuery ? searchQuery : localSearch;
  const updateQuery = setSearchQuery ? setSearchQuery : setLocalSearch;

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category === selectedCategory ||
        (selectedCategory === 'Starters' && item.category === 'Starter');
      const matchesSpice = selectedSpice === 'All' || item.spicy === selectedSpice;
      const matchesSearch =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSpice && matchesSearch;
    });
  }, [menuItems, selectedCategory, selectedSpice, query]);

  return (
    <section className="py-16 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors" id="menu-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#B8860B]" />
            <span>Pure Vedic Kitchen</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-950 dark:text-white">
            Our Divine <span className="text-[#B8860B] dark:text-amber-400">Satvik Menu</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Cooked with wood-churned pure A2 cow ghee, natural pink rock salt, and positive Vedic vibrations.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-6">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                {cat === 'Catering' ? 'Catering Packages' : cat === 'Starters' ? 'Starter' : cat}
              </button>
            ))}
          </div>

          {/* Search Input & Taste Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search dishes, thalis..."
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
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
                <option value="All">All Flavors</option>
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Sweet">Sweet</option>
              </select>
            </div>
          </div>

        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <Utensils className="h-10 w-10 text-[#B8860B] mx-auto animate-pulse" />
            <h3 className="font-bold text-base text-stone-900 dark:text-white">
              No Satvik items matched your search
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Try resetting your filters or search for our signature Royal Thalis!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSpice('All');
                updateQuery('');
              }}
              className="mt-3 px-5 py-2 rounded-lg bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Swiggy / Zomato style Food Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredItems.map((dish) => (
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
        allDishes={menuItems}
        onClose={() => setSelectedDishForModal(null)}
        onSelectDish={(newDish) => setSelectedDishForModal(newDish)}
      />
    </section>
  );
}
