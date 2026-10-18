'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Phone, Clock, MapPin, ShieldCheck, Check } from 'lucide-react';
import { KiloDish, DEFAULT_KILO_DISHES, MenuItem } from '@/lib/data';

interface FoodByKiloProps {
  onAddToCart: (item: MenuItem) => void;
}

export default function FoodByKiloSection({ onAddToCart }: FoodByKiloProps) {
  const [dishes, setDishes] = useState<KiloDish[]>(DEFAULT_KILO_DISHES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedRiceSubmenu, setSelectedRiceSubmenu] = useState("All Rice");
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/kilo-dishes')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDishes(data);
        }
      })
      .catch((err) => console.log('Using default kilo dishes:', err));
  }, []);

  const categories = ["All", "Curries", "Dal", "Sweets", "Rice"];
  const riceOptions = ["All Rice", "Veg Pulao", "Veg Biryani", "Jeera Rice"];

  const getWeight = (id: string, minKg: number = 1) => selectedWeights[id] || minKg;

  const setWeight = (id: string, weight: number) => {
    setSelectedWeights((prev) => ({ ...prev, [id]: weight }));
  };

  const handleAddKiloDish = (dish: KiloDish) => {
    const weight = getWeight(dish.id, dish.minKg);
    const totalPrice = dish.pricePerKg * weight;

    const cartItem: MenuItem = {
      id: `${dish.id}-${weight}kg`,
      name: `${dish.name.replace(' (Per Kg)', '')} (${weight} Kg Pack)`,
      description: dish.description,
      price: totalPrice,
      category: dish.category,
      image: dish.image,
      spicy: dish.spicy,
      rating: 4.9,
      reviews: 42,
    };

    onAddToCart(cartItem);
    setAddedItems((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [dish.id]: false }));
    }, 2000);
  };

  const filteredDishes = dishes.filter((dish) => {
    if (activeCategory !== "All" && dish.category !== activeCategory) return false;
    if (activeCategory === "Rice" && selectedRiceSubmenu !== "All Rice") {
      const sub = dish.submenu || "";
      if (selectedRiceSubmenu === "Veg Pulao") return sub.includes("Pulao") || dish.name.includes("Pulao");
      if (selectedRiceSubmenu === "Veg Biryani") return sub.includes("Biryani") || dish.name.includes("Biryani");
      if (selectedRiceSubmenu === "Jeera Rice") return sub.includes("Jeera") || dish.name.includes("Jeera");
    }
    return true;
  });

  return (
    <section className="py-12 bg-white text-gray-900 min-h-[80vh] dark:bg-stone-950 dark:text-stone-100" id="food-by-kilo-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full bg-amber-50 border border-amber-200/90 px-4 py-1 text-xs uppercase tracking-widest font-bold text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300">
            <Scale className="h-4 w-4 text-[#B8860B]" />
            <span>Pasand Apki • Bulk Ordering</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-gray-950 tracking-wide dark:text-white">
            Food by <span className="text-[#B8860B] italic font-serif">Kilo</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed dark:text-stone-400">
            Order your favorite pure Satvik dishes in Kilograms for family gatherings, pujas, or private feasts. Freshly cooked in traditional brass cookware without onion or garlic.
          </p>
        </div>

        {/* Quick Highlights / Helpline Banner */}
        <div className="p-6 bg-stone-50 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6 dark:bg-stone-900 dark:border-stone-800">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-gray-950 dark:text-white">
              Bulk Ordering & Custom Family Feasts from Pushpa Nagar, Bhopal
            </h3>
            <p className="text-xs text-gray-600 dark:text-stone-400 max-w-2xl">
              All Food by Kilo orders are cooked freshly on order to maintain pure prana and hygiene. Free doorstep delivery for bulk orders across Bhopal.
            </p>
          </div>
          <a
            href="tel:+919981508165"
            className="flex items-center space-x-2 bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#C59B27] hover:to-amber-700 text-black font-bold text-xs uppercase tracking-wider px-5 py-3 shadow-md transition flex-shrink-0"
          >
            <Phone className="h-4 w-4" />
            <span>Direct Kitchen Helpline: +91 9981508165</span>
          </a>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="p-4 bg-stone-50 border border-stone-200 space-y-1.5 dark:bg-stone-900 dark:border-stone-800">
            <div className="flex items-center space-x-2 text-[#B8860B]">
              <Clock className="h-4 w-4" />
              <span className="font-bold text-[11px] uppercase tracking-wider font-mono">Kitchen Hours</span>
            </div>
            <p className="font-bold text-gray-950 text-sm dark:text-white">07:00 AM – 11:00 PM</p>
            <p className="text-[11px] text-gray-500 dark:text-stone-400">Open Daily • 365 Days a Year</p>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 space-y-1.5 sm:col-span-2 dark:bg-stone-900 dark:border-stone-800">
            <div className="flex items-center space-x-2 text-[#B8860B]">
              <MapPin className="h-4 w-4" />
              <span className="font-bold text-[11px] uppercase tracking-wider font-mono">Kitchen & Dispatch Center</span>
            </div>
            <p className="font-semibold text-gray-950 leading-relaxed dark:text-white">
              Plot No.255, Ward No.36 SBI Staff Housing Co-operative, Pushpa Nagar, Chandbad, Bhopal (MP) - 462010
            </p>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 space-y-1.5 dark:bg-stone-900 dark:border-stone-800">
            <div className="flex items-center space-x-2 text-[#B8860B]">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-bold text-[11px] uppercase tracking-wider font-mono">Quality Standards</span>
            </div>
            <p className="font-bold text-gray-950 text-sm dark:text-white">100% Shuddh Satvik</p>
            <p className="text-[11px] text-gray-500 dark:text-stone-400">Zero Onion, Zero Garlic</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="space-y-4">
          <div className="flex flex-wrap justify-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  if (cat !== "Rice") setSelectedRiceSubmenu("All Rice");
                }}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black shadow-md font-mono"
                    : "bg-stone-100 text-gray-700 hover:bg-stone-200 border border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {activeCategory === "Rice" && (
            <div className="flex justify-center gap-2 pt-2">
              {riceOptions.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedRiceSubmenu(sub)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition cursor-pointer ${
                    selectedRiceSubmenu === sub
                      ? "bg-amber-100 border-[#B8860B] text-[#B8860B] font-bold"
                      : "bg-white border-stone-300 text-gray-700 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-300"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDishes.map((dish) => {
            const currentWeight = getWeight(dish.id, dish.minKg);
            const calculatedPrice = dish.pricePerKg * currentWeight;

            return (
              <div
                key={dish.id}
                className="group relative flex flex-col overflow-hidden border border-stone-200 bg-white shadow-xs transition-all hover:border-amber-300 hover:shadow-xl dark:bg-stone-900 dark:border-stone-800"
                id={`kilo-card-${dish.id}`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 flex items-center space-x-1 rounded-none bg-gradient-to-r from-[#D4AF37] to-amber-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black shadow-sm">
                    <Scale className="h-3 w-3" />
                    <span>Per Kg Bulk</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white">
                      {dish.name}
                    </h3>
                    <div className="text-right">
                      <span className="font-serif text-base font-bold text-[#B8860B]">
                        ₹{calculatedPrice}
                      </span>
                      <p className="text-[10px] text-gray-500 font-mono">
                        (₹{dish.pricePerKg}/kg)
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-stone-400 leading-relaxed flex-1">
                    {dish.description}
                  </p>

                  {/* Weight Selector (1kg, 2kg, 3kg, 5kg) */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-stone-300 font-mono">
                      Select Quantity (Kg):
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 5].map((kg) => (
                        <button
                          key={kg}
                          onClick={() => setWeight(dish.id, kg)}
                          className={`py-1.5 text-xs font-bold border transition cursor-pointer ${
                            currentWeight === kg
                              ? "bg-amber-100 border-[#B8860B] text-amber-900 font-mono"
                              : "bg-stone-50 border-stone-200 text-gray-700 hover:bg-stone-100 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300"
                          }`}
                        >
                          {kg} Kg
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Basket button */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => handleAddKiloDish(dish)}
                      className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#C59B27] hover:to-amber-700 text-black py-2.5 text-xs font-bold uppercase tracking-wider shadow-md transition cursor-pointer"
                    >
                      {addedItems[dish.id] ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Added ({currentWeight} Kg)!</span>
                        </>
                      ) : (
                        <>
                          <Scale className="h-4 w-4" />
                          <span>Add {currentWeight} Kg to Basket (₹{calculatedPrice})</span>
                        </>
                      )}
                    </button>
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
