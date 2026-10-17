import { ShoppingBag, Search, Sparkles, Clock, UtensilsCrossed } from "lucide-react";

interface NavbarProps {
  activeTab: "home" | "menu" | "track" | "about";
  setActiveTab: (tab: "home" | "menu" | "track" | "about") => void;
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  onSearchClick: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  setIsCartOpen,
  onSearchClick
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0F0F0F]/95 backdrop-blur-md text-[#E0E0E0]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div 
          className="flex cursor-pointer items-center space-x-3" 
          onClick={() => setActiveTab("home")}
          id="navbar-brand"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] shadow-lg">
            <UtensilsCrossed className="h-5 w-5 text-black" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-widest text-[#D4AF37] flex items-center">
              SATVIK <span className="text-[#E0E0E0] text-[10px] uppercase tracking-[0.2em] font-sans font-medium ml-2.5 hidden sm:inline-block">Events & Caters</span>
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#A0A0A0] -mt-1 font-semibold">
              Pure • Wholesome • Divine
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 uppercase tracking-[0.15em] text-xs font-semibold">
          <button
            onClick={() => setActiveTab("home")}
            className={`font-sans py-1 transition-colors hover:text-[#D4AF37] ${
              activeTab === "home" ? "text-[#D4AF37] border-b border-[#D4AF37] pb-1" : "text-[#E0E0E0]/80"
            }`}
            id="nav-link-home"
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`font-sans py-1 transition-colors hover:text-[#D4AF37] ${
              activeTab === "menu" ? "text-[#D4AF37] border-b border-[#D4AF37] pb-1" : "text-[#E0E0E0]/80"
            }`}
            id="nav-link-menu"
          >
            Menu & Catering
          </button>
          <button
            onClick={() => setActiveTab("track")}
            className={`font-sans py-1 transition-colors hover:text-[#D4AF37] flex items-center space-x-1.5 ${
              activeTab === "track" ? "text-[#D4AF37] border-b border-[#D4AF37] pb-1" : "text-[#E0E0E0]/80"
            }`}
            id="nav-link-track"
          >
            <Clock className="h-3.5 w-3.5 text-[#D4AF37] animate-pulse" />
            <span>Track Order</span>
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`font-sans py-1 transition-colors hover:text-[#D4AF37] ${
              activeTab === "about" ? "text-[#D4AF37] border-b border-[#D4AF37] pb-1" : "text-[#E0E0E0]/80"
            }`}
            id="nav-link-about"
          >
            Our Philosophy
          </button>
        </nav>

        {/* Action Buttons: Cart, Search, Mini Tracking Badge */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onSearchClick}
            className="rounded-full p-2 text-gray-400 hover:bg-white/5 hover:text-[#D4AF37] transition-colors"
            title="Search Menu"
            id="nav-btn-search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Premium Quality Indicator */}
          <div className="hidden lg:flex items-center space-x-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3.5 py-1 text-[10px] uppercase tracking-wider font-bold text-[#D4AF37]">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37] animate-bounce" />
            <span>Jain Thali Available</span>
          </div>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center rounded-full bg-white/5 border border-white/10 p-2.5 text-[#D4AF37] transition-all hover:scale-105 hover:bg-white/10"
            id="nav-btn-cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-black shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row (Sticky underheader) */}
      <div className="flex md:hidden border-t border-white/10 justify-around py-3 bg-[#121212] uppercase tracking-wider text-[10px] font-bold">
        <button
          onClick={() => setActiveTab("home")}
          className={`font-sans ${
            activeTab === "home" ? "text-[#D4AF37]" : "text-gray-400"
          }`}
          id="mobile-nav-home"
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`font-sans ${
            activeTab === "menu" ? "text-[#D4AF37]" : "text-gray-400"
          }`}
          id="mobile-nav-menu"
        >
          Menu & Catering
        </button>
        <button
          onClick={() => setActiveTab("track")}
          className={`font-sans flex items-center space-x-0.5 ${
            activeTab === "track" ? "text-[#D4AF37]" : "text-gray-400"
          }`}
          id="mobile-nav-track"
        >
          <Clock className="h-3.5 w-3.5 mr-0.5 text-[#D4AF37] animate-pulse" />
          <span>Track</span>
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`font-sans ${
            activeTab === "about" ? "text-[#D4AF37]" : "text-gray-400"
          }`}
          id="mobile-nav-about"
        >
          Philosophy
        </button>
      </div>
    </header>
  );
}
