'use client';

import React from 'react';
import { 
  ShoppingBag, Search, Sparkles, Clock, UtensilsCrossed, Flame, 
  Scale, Briefcase, Sun, Moon, Database, ShieldAlert, Video 
} from "lucide-react";

export type NavTab = "home" | "menu" | "starter" | "food-kilo" | "services" | "about" | "admin" | "track";

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  onSearchClick: () => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
  onWatchVideoClick?: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  setIsCartOpen,
  onSearchClick,
  theme = "light",
  onToggleTheme,
  onWatchVideoClick
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/95 backdrop-blur-md text-gray-900 dark:bg-stone-900/95 dark:border-stone-800 dark:text-stone-100 transition-colors">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div 
          className="flex cursor-pointer items-center space-x-3" 
          onClick={() => setActiveTab("home")}
          id="navbar-brand"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-none bg-gradient-to-r from-[#D4AF37] to-amber-600 shadow-md">
            <UtensilsCrossed className="h-5 w-5 text-black" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-wider text-[#B8860B] leading-none">
              SATVIK
            </h1>
            <div className="text-gray-950 dark:text-stone-100 font-extrabold text-[10px] sm:text-xs uppercase tracking-[0.24em] mt-0.5 font-sans">
              CATERS AND EVENTS
            </div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mt-0.5 font-semibold">
              Pure • Wholesome • Fresh
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 uppercase tracking-[0.14em] text-xs font-semibold">
          <button
            onClick={() => setActiveTab("home")}
            className={`font-sans py-1 transition-colors hover:text-[#B8860B] cursor-pointer ${
              activeTab === "home" ? "text-[#B8860B] border-b-2 border-[#C59B27] pb-0.5 font-bold" : "text-gray-600 dark:text-stone-300"
            }`}
            id="nav-link-home"
          >
            Home
          </button>
          
          <button
            onClick={() => setActiveTab("menu")}
            className={`font-sans py-1 transition-colors hover:text-[#B8860B] cursor-pointer ${
              activeTab === "menu" ? "text-[#B8860B] border-b-2 border-[#C59B27] pb-0.5 font-bold" : "text-gray-600 dark:text-stone-300"
            }`}
            id="nav-link-menu"
          >
            Menu
          </button>

          <button
            onClick={() => setActiveTab("starter")}
            className={`font-sans py-1 transition-colors hover:text-[#B8860B] flex items-center space-x-1 cursor-pointer ${
              activeTab === "starter" ? "text-[#B8860B] border-b-2 border-[#C59B27] pb-0.5 font-extrabold" : "text-gray-700 dark:text-stone-200 font-bold"
            }`}
            id="nav-link-starter"
          >
            <Flame className="h-3.5 w-3.5 text-[#B8860B]" />
            <span>STARTER</span>
          </button>

          <button
            onClick={() => setActiveTab("food-kilo")}
            className={`font-sans py-1 transition-colors hover:text-[#B8860B] flex items-center space-x-1 cursor-pointer ${
              activeTab === "food-kilo" ? "text-[#B8860B] border-b-2 border-[#C59B27] pb-0.5 font-bold" : "text-gray-600 dark:text-stone-300"
            }`}
            id="nav-link-food-kilo"
          >
            <Scale className="h-3.5 w-3.5 text-[#B8860B]" />
            <span>Food by Kilo</span>
            <span className="ml-1 rounded bg-amber-100 border border-amber-200 px-1 py-0.2 text-[8px] text-amber-800 font-mono normal-case font-bold dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300">
              Pasand Apki
            </span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`font-sans py-1 transition-colors hover:text-[#B8860B] flex items-center space-x-1 cursor-pointer ${
              activeTab === "services" ? "text-[#B8860B] border-b-2 border-[#C59B27] pb-0.5 font-bold" : "text-gray-600 dark:text-stone-300"
            }`}
            id="nav-link-services"
          >
            <Briefcase className="h-3.5 w-3.5 text-[#B8860B]" />
            <span>Services</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`font-sans py-1 transition-colors hover:text-[#B8860B] cursor-pointer ${
              activeTab === "about" ? "text-[#B8860B] border-b-2 border-[#C59B27] pb-0.5 font-bold" : "text-gray-600 dark:text-stone-300"
            }`}
            id="nav-link-about"
          >
            Philosophy
          </button>

          <button
            onClick={() => setActiveTab("admin")}
            className={`font-sans py-1 transition-colors hover:text-[#B8860B] flex items-center space-x-1 font-bold cursor-pointer ${
              activeTab === "admin" ? "text-[#B8860B] border-b-2 border-[#C59B27] pb-0.5" : "text-amber-700 hover:text-amber-900 dark:text-amber-400"
            }`}
            id="nav-link-admin"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-[#B8860B]" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Action Controls: Theme Switcher, Search, DB Indicator, Cart */}
        <div className="flex items-center space-x-2 sm:space-x-3.5">
          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`flex items-center space-x-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
                theme === "dark"
                  ? "bg-stone-800 text-amber-300 border-amber-500/40 hover:bg-stone-700"
                  : "bg-stone-100 text-stone-800 border-stone-300 hover:bg-stone-200"
              }`}
              title={`Switch to ${theme === "light" ? "Black" : "White"} Background`}
              id="nav-theme-toggle"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span className="hidden sm:inline font-mono font-bold text-[11px]">White BG</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-stone-700" />
                  <span className="hidden sm:inline font-mono font-bold text-[11px]">Black BG</span>
                </>
              )}
            </button>
          )}

          {/* Search Button */}
          <button
            onClick={onSearchClick}
            className="rounded-full p-2 text-gray-600 hover:bg-stone-100 hover:text-gray-900 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Search Menu"
            id="nav-btn-search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Jain Food Badge */}
          <div className="hidden xl:flex items-center space-x-1.5 rounded-full bg-emerald-50 border border-emerald-300/80 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Jain Food (No Onion & Garlic)</span>
          </div>

          {/* DB Indicator */}
          <div 
            className="hidden lg:flex items-center space-x-1.5 rounded-full bg-emerald-50 border border-emerald-300/80 px-2.5 py-1 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 cursor-help"
            title="Next.js Fullstack Server & Supabase Database Active"
            id="nav-db-indicator"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <Database className="h-3 w-3 text-emerald-700" />
            <span className="font-mono tracking-tight text-[9px] uppercase">DB Connected</span>
          </div>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center rounded-full bg-amber-50/80 border border-amber-200/90 p-2.5 text-[#B8860B] transition-all hover:scale-105 hover:bg-amber-100 dark:bg-amber-950/40 dark:border-amber-800/80 cursor-pointer shadow-xs"
            id="nav-btn-cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#C59B27] text-[10px] font-bold text-white shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row (Horizontal Scroll) */}
      <div 
        className="flex md:hidden border-t border-stone-200 dark:border-stone-800 justify-around py-2.5 bg-stone-50 dark:bg-stone-900 uppercase tracking-wider text-[9px] font-bold overflow-x-auto shadow-xs"
        id="mobile-nav-row"
      >
        <button
          onClick={() => setActiveTab("home")}
          className={`font-sans whitespace-nowrap px-1.5 cursor-pointer ${
            activeTab === "home" ? "text-[#B8860B] font-extrabold" : "text-gray-600 dark:text-stone-300"
          }`}
          id="mobile-nav-home"
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`font-sans whitespace-nowrap px-1.5 cursor-pointer ${
            activeTab === "menu" ? "text-[#B8860B] font-extrabold" : "text-gray-600 dark:text-stone-300"
          }`}
          id="mobile-nav-menu"
        >
          Menu
        </button>
        <button
          onClick={() => setActiveTab("starter")}
          className={`font-sans whitespace-nowrap px-1.5 font-bold flex items-center space-x-0.5 cursor-pointer ${
            activeTab === "starter" ? "text-[#B8860B] font-extrabold" : "text-amber-800 dark:text-amber-400"
          }`}
          id="mobile-nav-starter"
        >
          <Flame className="h-2.5 w-2.5 text-[#B8860B]" />
          <span>Starter</span>
        </button>
        <button
          onClick={() => setActiveTab("food-kilo")}
          className={`font-sans whitespace-nowrap px-1.5 cursor-pointer ${
            activeTab === "food-kilo" ? "text-[#B8860B] font-extrabold" : "text-gray-600 dark:text-stone-300"
          }`}
          id="mobile-nav-food-kilo"
        >
          Food by Kilo
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`font-sans whitespace-nowrap px-1.5 cursor-pointer ${
            activeTab === "services" ? "text-[#B8860B] font-extrabold" : "text-gray-600 dark:text-stone-300"
          }`}
          id="mobile-nav-services"
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab("track")}
          className={`font-sans whitespace-nowrap px-1.5 flex items-center space-x-0.5 cursor-pointer ${
            activeTab === "track" ? "text-[#B8860B] font-extrabold" : "text-gray-600 dark:text-stone-300"
          }`}
          id="mobile-nav-track"
        >
          <Clock className="h-2.5 w-2.5 text-[#B8860B]" />
          <span>Track</span>
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`font-sans whitespace-nowrap px-1.5 flex items-center text-amber-800 dark:text-amber-400 cursor-pointer ${
            activeTab === "admin" ? "text-[#B8860B] font-extrabold" : "text-amber-800 dark:text-amber-400"
          }`}
          id="mobile-nav-admin"
        >
          <ShieldAlert className="h-2.5 w-2.5 text-[#B8860B]" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
}
