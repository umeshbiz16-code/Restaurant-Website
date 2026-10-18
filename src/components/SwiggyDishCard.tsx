'use client';

import React from 'react';
import Link from 'next/link';
import { MenuItem } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { Star, Plus, Minus, Eye, Sparkles } from 'lucide-react';

interface SwiggyDishCardProps {
  dish: MenuItem;
  onSeeInside?: (dish: MenuItem) => void;
}

export default function SwiggyDishCard({ dish, onSeeInside }: SwiggyDishCardProps) {
  const { cartItems, addToCart, updateQuantity } = useCart();

  const cartItem = cartItems.find((ci) => ci.id === dish.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="group rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 sm:p-5 flex flex-col justify-between hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-600/60 transition-all duration-300 shadow-xs relative">
      
      {/* Top Section: Veg Symbol & Bestseller */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {/* Green Veg Dot in Square (Swiggy / Zomato Mark) */}
          <div className="h-4 w-4 rounded-xs border-2 border-emerald-600 flex items-center justify-center p-0.5 bg-emerald-50 dark:bg-emerald-950/40">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
            100% Satvik
          </span>
        </div>

        {dish.rating && (
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] font-bold text-amber-900 dark:text-amber-300">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span>{dish.rating}</span>
            {dish.reviews && <span className="text-stone-400 font-normal">({dish.reviews})</span>}
          </div>
        )}
      </div>

      {/* Main Content Layout (Text Left, Image Right on tablets/desktops; stacked on mobile) */}
      <div className="flex flex-col-reverse sm:flex-row gap-4 items-start justify-between flex-1">
        
        {/* Left Side: Dish Info */}
        <div className="flex-1 space-y-1.5 sm:pr-2">
          <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-white group-hover:text-[#B8860B] dark:group-hover:text-amber-400 transition-colors">
            {dish.name}
          </h3>

          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg font-extrabold text-[#B8860B] dark:text-amber-400">
              ₹{dish.price}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              {dish.spicy || 'Mild'}
            </span>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed pt-1">
            {dish.description}
          </p>
        </div>

        {/* Right Side: Dish Image */}
        <div className="relative w-full sm:w-36 h-36 sm:h-28 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 self-center sm:self-start">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Action Buttons: Add to Cart & See Inside */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2.5">
        
        {/* See Inside Button */}
        {onSeeInside ? (
          <button
            type="button"
            onClick={() => onSeeInside(dish)}
            className="flex-1 py-2 px-3 rounded-lg border border-amber-500/40 text-[#B8860B] dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>See Inside</span>
          </button>
        ) : (
          <Link
            href={`/dish/${dish.id}`}
            className="flex-1 py-2 px-3 rounded-lg border border-amber-500/40 text-[#B8860B] dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-center"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>See Inside</span>
          </Link>
        )}

        {/* Add to Cart Button (Swiggy / Zomato style with quantity toggle if added) */}
        {quantity > 0 ? (
          <div className="flex-1 flex items-center justify-between bg-amber-500 text-stone-950 font-bold rounded-lg px-2 py-1.5 shadow-sm">
            <button
              onClick={() => updateQuantity(dish.id, quantity - 1)}
              className="p-1 hover:bg-amber-600 rounded transition-colors cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5 text-stone-950 font-bold" />
            </button>
            <span className="text-xs font-extrabold px-2">{quantity} in Cart</span>
            <button
              onClick={() => updateQuantity(dish.id, quantity + 1)}
              className="p-1 hover:bg-amber-600 rounded transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-stone-950 font-bold" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => addToCart(dish, 1)}
            className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add to Cart</span>
          </button>
        )}

      </div>
    </div>
  );
}
