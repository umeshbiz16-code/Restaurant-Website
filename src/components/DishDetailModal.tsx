'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { 
  X, Star, Plus, Minus, Check, Sparkles, ShieldCheck, 
  Heart, ShoppingBag, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

interface DishDetailModalProps {
  dish: MenuItem | null;
  allDishes: MenuItem[];
  onClose: () => void;
  onSelectDish: (dish: MenuItem) => void;
}

export default function DishDetailModal({
  dish,
  allDishes,
  onClose,
  onSelectDish,
}: DishDetailModalProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  if (!dish) return null;

  const relatedDishes = allDishes
    .filter((d) => d.category === dish.category && d.id !== dish.id)
    .slice(0, 3);

  const handleAddCurrent = () => {
    addToCart(dish, qty);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-stone-900 dark:text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-6 shadow-md">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-white/95 dark:bg-stone-950/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-900 dark:text-amber-300 shadow-sm flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pure A2 Cow Ghee Preparation</span>
          </div>
          <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg text-white font-extrabold text-lg">
            ₹{dish.price}
          </div>
        </div>

        {/* Header & Badges */}
        <div className="space-y-3 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded-xs border-2 border-emerald-600 flex items-center justify-center p-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
              100% Satvik Jain (Zero Onion, Zero Garlic)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {dish.name}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {dish.rating && (
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>{dish.rating} Rating ({dish.reviews || 80}+ reviews)</span>
              </div>
            )}
            <span className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
              Category: {dish.category}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
              Spiciness: {dish.spicy || 'Mild'}
            </span>
          </div>

          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans pt-1">
            {dish.description}
          </p>
        </div>

        {/* Purity & Ingredients Spotlight */}
        <div className="py-6 border-b border-stone-200 dark:border-stone-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#B8860B]" />
            <span>Sacred Ayurvedic Formulation</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/50">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Wood-churned Gir Cow A2 Ghee</span>
            </div>
            <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/50">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Natural Himalayan Pink Rock Salt</span>
            </div>
            <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/50">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Strictly No Onion, Garlic, or Mushroom</span>
            </div>
            <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/50">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Cooked in Traditional Clay & Brass</span>
            </div>
          </div>
        </div>

        {/* Order Controls */}
        <div className="py-6 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold uppercase text-stone-500">Quantity:</span>
            <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm font-bold cursor-pointer"
              >
                -
              </button>
              <span className="px-3 text-xs font-bold">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleAddCurrent}
              className="flex-1 sm:flex-none py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Cart • ₹{dish.price * qty}</span>
            </button>

            <Link
              href="/cart"
              className="py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <span>View Cart</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {addedToast && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-bold text-center animate-fade-in flex items-center justify-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Added {qty} item(s) to your Cart!</span>
          </div>
        )}

        {/* Related Dishes Below */}
        {relatedDishes.length > 0 && (
          <div className="pt-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#B8860B]" />
              <span>Related Dishes You Might Love</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedDishes.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectDish(rel)}
                  className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 cursor-pointer transition-all bg-stone-50/50 dark:bg-stone-800/40 flex flex-col justify-between group"
                >
                  <div className="h-24 w-full rounded-lg overflow-hidden mb-2 bg-stone-200 dark:bg-stone-700">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900 dark:text-white truncate">
                      {rel.name}
                    </h5>
                    <p className="text-[11px] font-bold text-[#B8860B] dark:text-amber-400 mt-0.5">
                      ₹{rel.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
