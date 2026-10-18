'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MenuItem, DEFAULT_MENU_ITEMS } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { 
  Star, ShoppingBag, ArrowLeft, ShieldCheck, Check, 
  Sparkles, Heart 
} from 'lucide-react';
import Link from 'next/link';

export default function DishDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dishId = params?.id as string;
  const { addToCart } = useCart();

  const [dish, setDish] = useState<MenuItem | null>(null);
  const [allDishes, setAllDishes] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllDishes(data);
          const found = data.find((d) => d.id === dishId);
          if (found) setDish(found);
        } else {
          const found = DEFAULT_MENU_ITEMS.find((d) => d.id === dishId);
          if (found) setDish(found);
        }
      })
      .catch(() => {
        const found = DEFAULT_MENU_ITEMS.find((d) => d.id === dishId);
        if (found) setDish(found);
      });
  }, [dishId]);

  if (!dish) {
    return (
      <div className="min-h-screen bg-white text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <p className="text-sm font-semibold text-stone-500 mb-4">Dish details loading or not found...</p>
          <Link
            href="/menu"
            className="py-2.5 px-4 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs uppercase"
          >
            ← Back to Menu
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedDishes = allDishes
    .filter((d) => d.category === dish.category && d.id !== dish.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(dish, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to previous page</span>
          </button>
        </div>

        {/* Dish Main Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
          {/* Photo */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl h-80 sm:h-96">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/95 dark:bg-stone-950/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-900 dark:text-amber-300 shadow-sm flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Pure A2 Cow Ghee</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-4 w-4 rounded-xs border-2 border-emerald-600 flex items-center justify-center p-0.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                  100% Satvik Pure Veg
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-stone-950 dark:text-white">
                {dish.name}
              </h1>

              <div className="flex items-center space-x-3 mt-3">
                <span className="text-2xl font-extrabold text-[#B8860B] dark:text-amber-400">
                  ₹{dish.price}
                </span>
                {dish.rating && (
                  <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{dish.rating}</span>
                  </div>
                )}
                <span className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-xs font-bold text-stone-600 dark:text-stone-300">
                  {dish.spicy || 'Mild'}
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {dish.description}
            </p>

            {/* Ayurvedic Purity Guarantee */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#B8860B]" />
                <span>Purity & Preparation</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Wood-churned Gir Cow A2 Ghee</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Natural Pink Rock Salt</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Zero Onion & Zero Garlic</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Traditional Clay Oven Roasted</span>
                </li>
              </ul>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-3.5 text-xs font-bold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Cart • ₹{dish.price * qty}</span>
              </button>

              <Link
                href="/cart"
                className="py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <span>Go to Cart</span>
              </Link>
            </div>

            {added && (
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-bold text-center animate-fade-in flex items-center justify-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Added {qty} item(s) to Cart!</span>
              </div>
            )}
          </div>
        </div>

        {/* Related Dishes Below */}
        {relatedDishes.length > 0 && (
          <div className="pt-10 border-t border-stone-200 dark:border-stone-800 space-y-6">
            <h3 className="text-xl font-bold text-stone-950 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#B8860B]" />
              <span>Related Dishes from our Kitchen</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedDishes.map((rel) => (
                <div
                  key={rel.id}
                  className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-40 w-full rounded-xl overflow-hidden mb-3 bg-stone-100 dark:bg-stone-800">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-bold text-sm text-stone-950 dark:text-white">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">
                      {rel.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span className="font-extrabold text-[#B8860B] text-sm">₹{rel.price}</span>
                    <button
                      onClick={() => addToCart(rel, 1)}
                      className="py-1.5 px-3 rounded-lg bg-amber-500 text-stone-950 font-bold text-[11px] uppercase tracking-wider hover:bg-amber-600 transition-colors cursor-pointer"
                    >
                      Add +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
