import { useState, useMemo } from "react";
import { MenuItem } from "../types";
import { Star, ShieldAlert, Sparkles, Filter, Search, Plus, Calendar } from "lucide-react";

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
    <section className="py-20 bg-[#0F0F0F] text-[#E0E0E0] border-b border-white/5" id="menu-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="font-serif text-3xl font-normal tracking-wide text-white sm:text-4xl">
            Our Divine <span className="text-[#D4AF37] italic">Pure Ghee Menu</span>
          </h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
            Cooked with wood-churned A2 cow ghee, fresh spices, and positive cosmic vibes.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/10 pb-6">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === cat
                    ? "bg-[#D4AF37] text-black shadow-lg"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
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
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#D4AF37]" />
              <input
                type="text"
                placeholder="Search satvik dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-none border border-white/10 bg-[#1A1A1A] text-white pl-10 pr-4 py-2.5 text-xs focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                id="menu-search-input"
              />
            </div>

            {/* Spice Filter */}
            <div className="flex items-center space-x-2 w-full sm:w-auto bg-[#1A1A1A] rounded-none px-3.5 py-1.5 border border-white/10">
              <Filter className="h-3.5 w-3.5 text-[#D4AF37]" />
              <select
                value={selectedSpice}
                onChange={(e) => setSelectedSpice(e.target.value)}
                className="bg-transparent text-xs font-semibold text-gray-300 border-none focus:outline-none cursor-pointer"
                id="spice-select"
              >
                <option value="All" className="bg-[#1A1A1A] text-white">All Tastes</option>
                <option value="Mild" className="bg-[#1A1A1A] text-white">Mild</option>
                <option value="Medium" className="bg-[#1A1A1A] text-white">Medium</option>
                <option value="Sweet" className="bg-[#1A1A1A] text-white">Sweet</option>
                <option value="Customizable" className="bg-[#1A1A1A] text-white">Customizable</option>
              </select>
            </div>
          </div>

        </div>

        {/* Empty Search State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-[#1A1A1A] rounded-none border border-white/10">
            <ShieldAlert className="h-10 w-10 text-[#D4AF37] mx-auto mb-3 animate-pulse" />
            <p className="font-serif font-medium text-white text-base">No Satvik items matched your search</p>
            <p className="text-xs text-gray-400 mt-1">Try clearing some filters or searching for our signature "Thali"!</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedSpice("All");
                setSearchQuery("");
              }}
              className="mt-5 rounded-none bg-[#D4AF37] hover:bg-[#B8962E] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-colors"
              id="clear-filters-btn"
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
                className="group relative flex flex-col overflow-hidden rounded-none border border-white/5 bg-[#1A1A1A] shadow-none transition-all hover:border-white/10"
                id={`menu-card-${item.id}`}
              >
                {/* Product Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover grayscale-[10%] contrast-110 transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    id={`menu-img-${item.id}`}
                  />
                  
                  {/* Top floating badges */}
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    {/* Organic / Ghee indicator */}
                    <span className="rounded-none bg-[#D4AF37] text-black px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider shadow-sm flex items-center space-x-1">
                      <Sparkles className="h-3 w-3 text-black" />
                      <span>{isCatering ? "Premium Setup" : "A2 Cow Ghee"}</span>
                    </span>
                    
                    {/* Spice Badge */}
                    <span className="w-fit rounded-none px-2 py-0.5 text-[8px] font-bold uppercase bg-black/60 border border-white/10 text-white tracking-widest">
                      {item.spicy}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute right-3 top-3 flex items-center space-x-1 rounded-none bg-black/70 border border-white/10 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                    <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <span>{item.rating}</span>
                    <span className="text-[9px] text-gray-400 font-normal">({item.reviews})</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5 space-y-2 bg-[#1A1A1A]">
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-base font-normal text-white tracking-wide">
                      {item.name}
                    </h3>
                    <span className="font-serif text-sm font-semibold text-[#D4AF37] whitespace-nowrap ml-2">
                      ₹{item.price}{isCatering ? "/plate" : ""}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed flex-1 font-sans">
                    {item.description}
                  </p>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-white/5">
                    {isCatering ? (
                      <button
                        onClick={() => onBookCatering(item)}
                        className="flex w-full items-center justify-center space-x-1.5 rounded-none bg-transparent py-3 text-xs font-bold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37] transition-all hover:bg-[#D4AF37]/10"
                        id={`menu-btn-catering-${item.id}`}
                      >
                        <Calendar className="h-4 w-4 text-[#D4AF37]" />
                        <span>Plan & Book Event</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddToCart(item)}
                        className="flex w-full items-center justify-center space-x-1.5 rounded-none bg-[#D4AF37] hover:bg-[#B8962E] py-3 text-xs font-bold uppercase tracking-widest text-black transition-all"
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
