'use client';

import React, { useState, useMemo } from 'react';
import { Flame, Search, Plus, Minus, Check, Star } from 'lucide-react';
import { MenuItem } from '@/lib/data';

export const STARTERS_DATA: MenuItem[] = [
  {
    id: "st1",
    name: "Paneer Tikka",
    description: "Cubes of fresh Malai cottage cheese marinated in hung curd, carom seeds (ajwain), and roasted Kashmiri spices, clay-oven tandoor roasted to a smoky perfection.",
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
    image: "/images/panchamel_dal_1785510045096.jpg",
    spicy: "Mild",
    rating: 4.9,
    reviews: 79,
    available: true
  },
  {
    id: "st6",
    name: "Corn Cheese Tikki",
    description: "Crisp American sweet corn and mozzarella cutlets flavored with green chilies, cilantro, and roasted cumin. A favorite for all ages.",
    price: 210,
    category: "Starters",
    image: "/images/golden_malpua_1785510059835.jpg",
    spicy: "Mild",
    rating: 4.7,
    reviews: 68,
    available: true
  },
  {
    id: "st7",
    name: "Tandoori Malai Chaap",
    description: "Juicy soya chaap marinated in fresh cream, roasted gram flour, and aromatic whole spices, roasted over charcoal.",
    price: 230,
    category: "Starters",
    image: "/images/satvik_paneer_tikka_1783699415993.jpg",
    spicy: "Mild",
    rating: 4.8,
    reviews: 95,
    available: true
  },
  {
    id: "st8",
    name: "Kurkuri Bhindi Crisps",
    description: "Thinly julienned tender ladyfingers crisped with roasted besan, dry mango powder (amchur), and crushed ajwain. Pious & crunchiest snack.",
    price: 180,
    category: "Starters",
    image: "/images/beetroot_kebab.jpg",
    spicy: "Medium",
    rating: 4.7,
    reviews: 58,
    available: true
  },
  {
    id: "st9",
    name: "Satvik Grand Starter Platter",
    description: "Assorted sharing platter featuring 2 pcs Paneer Tikka, 2 pcs Malai Tikka, 2 pcs Beetroot Kebab, and 2 pcs Hara Bhara Kebab with mint & tamarind chutneys.",
    price: 499,
    category: "Starters",
    image: "/images/satvik_paneer_tikka_1783699415993.jpg",
    spicy: "Medium",
    rating: 5.0,
    reviews: 160,
    available: true
  }
];

interface StarterSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

export default function StarterSection({ onAddToCart }: StarterSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const categories = ["All", "Tandoor & Tikka", "Crispy Kebabs", "Platters"];

  const filteredStarters = useMemo(() => {
    return STARTERS_DATA.filter((item) => {
      let matchesCat = true;
      if (activeCategory === "Tandoor & Tikka") {
        matchesCat = item.name.includes("Tikka") || item.name.includes("Chaap");
      } else if (activeCategory === "Crispy Kebabs") {
        matchesCat = item.name.includes("Kebab") || item.name.includes("Tikki") || item.name.includes("Crisps");
      } else if (activeCategory === "Platters") {
        matchesCat = item.name.includes("Platter");
      }

      const q = searchQuery.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const getQty = (id: string) => quantities[id] || 1;

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleAdd = (item: MenuItem) => {
    const qty = getQty(item.id);
    for (let i = 0; i < qty; i++) {
      onAddToCart(item);
    }
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  return (
    <section className="py-12 bg-white text-gray-900 min-h-[85vh] dark:bg-stone-950 dark:text-stone-100" id="starter-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full bg-amber-50 border border-amber-200/90 px-4 py-1 text-xs uppercase tracking-widest font-bold text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300">
            <Flame className="h-4 w-4 text-[#B8860B]" />
            <span>Clay Oven & Tandoor Delicacies</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-gray-950 tracking-wide dark:text-white">
            Our Pure Satvik <span className="text-[#B8860B] italic font-serif">STARTERS</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed dark:text-stone-400">
            Freshly prepared tikkas, aromatic tandoor treats, and crispy kebabs made in pure desi ghee and rock salt. 100% vegetarian, strictly without onion and garlic.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black shadow-md font-mono"
                    : "bg-stone-100 text-gray-700 hover:bg-stone-200 border border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#B8860B]" />
            <input
              type="text"
              placeholder="Search starters (e.g. Tikka, Kebab)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-stone-300 rounded-none bg-white text-gray-900 focus:outline-none focus:border-[#B8860B] dark:bg-stone-900 dark:border-stone-800 dark:text-stone-100"
            />
          </div>
        </div>

        {/* Starters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStarters.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden border border-stone-200 bg-white shadow-xs transition-all hover:border-amber-300 hover:shadow-xl dark:bg-stone-900 dark:border-stone-800"
              id={`starter-card-${item.id}`}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex items-center space-x-1 rounded-none bg-gradient-to-r from-[#D4AF37] to-amber-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black shadow-sm">
                  <Flame className="h-3 w-3" />
                  <span>Clay Oven</span>
                </div>
                <div className="absolute right-3 top-3 flex items-center space-x-1 rounded-none bg-white/95 px-2 py-0.5 text-[10px] font-bold text-gray-900 shadow-sm backdrop-blur-sm dark:bg-stone-900/95 dark:text-stone-200">
                  <Star className="h-3 w-3 fill-[#B8860B] text-[#B8860B]" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white">
                    {item.name}
                  </h3>
                  <span className="font-serif text-base font-bold text-[#B8860B]">
                    ₹{item.price}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-stone-400 leading-relaxed flex-1">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                  {/* Quantity adjustment */}
                  <div className="flex items-center border border-stone-300 dark:border-stone-700">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 transition text-gray-600 dark:text-stone-300 cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-900 dark:text-white font-mono">
                      {getQty(item.id)}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 transition text-gray-600 dark:text-stone-300 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Add to Basket button */}
                  <button
                    onClick={() => handleAdd(item)}
                    className="flex items-center space-x-1.5 bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#C59B27] hover:to-amber-700 text-black px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-md transition cursor-pointer"
                  >
                    {addedItems[item.id] ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <span>Add to Basket</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
