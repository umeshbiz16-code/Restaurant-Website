'use client';

import React, { useState, useEffect } from 'react';
import Navbar, { NavTab } from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import StarterSection from '@/components/StarterSection';
import FoodByKiloSection from '@/components/FoodByKiloSection';
import ServicesSection from '@/components/ServicesSection';
import AboutSection from '@/components/AboutSection';
import AdminSection from '@/components/AdminSection';
import CartDrawer from '@/components/CartDrawer';
import OrderTracker from '@/components/OrderTracker';
import ChatBox from '@/components/ChatBox';
import { MenuItem, CartItem, Order } from '@/lib/data';
import { 
  Sparkles, Clock, ChevronRight, Heart, Utensils, Sun, Moon, Database, Cloud 
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchedOrderId, setSearchedOrderId] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [siteConfig, setSiteConfig] = useState({
    bannerText: 'Om Namah Shivaya • Sourcing raw, pure hand-churned A2 cow ghee for all thalis!',
    operatingHours: '07:00 AM – 11:00 PM',
    owner: 'Manish Jaiswal',
    phone: '+91 9981508165',
    address: 'Plot No.255, Ward No.36 SBI Staff Housing Co-operative, Pushpa Nagar, Chandbad, Bhopal (MP) - 462010',
    integrations: {
      supabase: true,
      cloudinary: true,
    }
  });

  // Load theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('satvik_theme') as 'light' | 'dark';
      if (savedTheme) {
        setTheme(savedTheme);
        const root = document.documentElement;
        if (savedTheme === 'dark') {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
      }
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('satvik_theme', nextTheme);
        const root = document.documentElement;
        if (nextTheme === 'dark') {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
      }
      return nextTheme;
    });
  };

  // Load menu items & config from Next.js API
  useEffect(() => {
    Promise.all([
      fetch('/api/menu').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/config').then((r) => (r.ok ? r.json() : null))
    ])
      .then(([menuData, configData]) => {
        if (Array.isArray(menuData) && menuData.length > 0) {
          setMenuItems(menuData);
        }
        if (configData) {
          setSiteConfig(configData);
        }
      })
      .catch((err) => console.warn('Failed to load menu/config:', err));
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('satvik_cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem('satvik_cart', JSON.stringify(newCart));
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    const existing = cartItems.find((ci) => ci.id === item.id);
    if (existing) {
      const updated = cartItems.map((ci) =>
        ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
      );
      saveCart(updated);
    } else {
      const updated = [...cartItems, { ...item, quantity: 1 }];
      saveCart(updated);
    }
    setIsCartOpen(true);
  };

  const handleBookCatering = (item: MenuItem) => {
    const existing = cartItems.find((ci) => ci.id === item.id);
    if (!existing) {
      const updated = [...cartItems, { ...item, quantity: 1 }];
      saveCart(updated);
    }
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
    } else {
      const updated = cartItems.map((ci) =>
        ci.id === id ? { ...ci, quantity: newQty } : ci
      );
      saveCart(updated);
    }
  };

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter((ci) => ci.id !== id);
    saveCart(updated);
  };

  const handleOrderSuccess = (order: Order) => {
    saveCart([]);
    setSearchedOrderId(order.id);
  };

  const handleTrackOrderClick = (orderId: string) => {
    setSearchedOrderId(orderId);
    setActiveTab('track');
  };

  const handleSearchShortcut = () => {
    setActiveTab('menu');
    setTimeout(() => {
      const searchInput = document.getElementById('menu-search-input');
      if (searchInput) searchInput.focus();
    }, 100);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950 dark:bg-stone-950 dark:text-stone-100 transition-colors" id="app-root">
      
      {/* Upper Announcements Strip */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-amber-500 text-center py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 shadow-xs">
        <div className="flex items-center justify-center space-x-1">
          <Sparkles className="h-4 w-4 text-black animate-pulse" />
          <p className="text-[11px] font-bold text-black uppercase tracking-wider">
            {siteConfig.bannerText}
          </p>
        </div>
        <div className="hidden sm:block text-black/40 text-[11px] font-bold">•</div>
        <div className="flex items-center justify-center space-x-1.5">
          <Clock className="h-3.5 w-3.5 text-black" />
          <p className="text-[11px] font-bold text-black uppercase tracking-wider">
            Daily Hours: {siteConfig.operatingHours}
          </p>
        </div>
      </div>

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        onSearchClick={handleSearchShortcut}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Page Layout Switcher */}
      <main className="flex-grow">
        {/* HOME VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            <HeroSection
              onOrderClick={() => setActiveTab('menu')}
              onCateringClick={() => setActiveTab('services')}
            />

            {/* Premium Category Spotlights: Sacred Specialties */}
            <section className="py-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 transition-colors">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-2 mb-12">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950 dark:text-white tracking-tight">
                    Our Sacred Culinary Specialties
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-stone-400">
                    Handcrafted Pure formulations prepared fresh in clay and copper vessels.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Card 1: Royal Satvik Thalis */}
                  <div className="border border-stone-200 bg-white dark:bg-stone-800 dark:border-stone-700 p-6 flex flex-col space-y-4 hover:shadow-xl hover:border-amber-300 transition-all shadow-xs">
                    <div className="relative h-44 overflow-hidden bg-stone-100 dark:bg-stone-700">
                      <img 
                        src="/images/satvik_premium_thali_1783699387370.jpg" 
                        alt="Satvik Thali" 
                        className="h-full w-full object-cover" 
                        id="specialty-img-thali"
                      />
                    </div>
                    <h3 className="font-serif font-bold text-gray-950 dark:text-white text-base">
                      Royal Satvik Thalis
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-stone-300 leading-relaxed flex-1 font-sans">
                      Taste our signature Maharaja Thali. Cooked strictly without garlic or onion, using mineral-rich saindhav salt and whole cumin.
                    </p>
                    <button 
                      onClick={() => setActiveTab('menu')}
                      className="text-xs font-bold text-[#B8860B] flex items-center space-x-1 hover:text-amber-800 transition-colors cursor-pointer"
                    >
                      <span>Explore Thalis</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Card 2: Stone-Grilled Appetizers */}
                  <div className="border border-stone-200 bg-white dark:bg-stone-800 dark:border-stone-700 p-6 flex flex-col space-y-4 hover:shadow-xl hover:border-amber-300 transition-all shadow-xs">
                    <div className="relative h-44 overflow-hidden bg-stone-100 dark:bg-stone-700">
                      <img 
                        src="/images/satvik_paneer_tikka_1783699415993.jpg" 
                        alt="Paneer Tikka" 
                        className="h-full w-full object-cover" 
                        id="specialty-img-paneer"
                      />
                    </div>
                    <h3 className="font-serif font-bold text-gray-950 dark:text-white text-base">
                      Stone-Grilled Appetizers
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-stone-300 leading-relaxed flex-1 font-sans">
                      Savor marinated organic paneer tikkas, crispy pan-seared beetroot kebabs, and nutritious mung bean rolls. Perfect healthy starters.
                    </p>
                    <button 
                      onClick={() => setActiveTab('starter')}
                      className="text-xs font-bold text-[#B8860B] flex items-center space-x-1 hover:text-amber-800 transition-colors cursor-pointer"
                    >
                      <span>Explore Starters</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Card 3: Events Catering */}
                  <div className="border border-stone-200 bg-white dark:bg-stone-800 dark:border-stone-700 p-6 flex flex-col space-y-4 hover:shadow-xl hover:border-amber-300 transition-all shadow-xs">
                    <div className="relative h-44 overflow-hidden bg-stone-100 dark:bg-stone-700">
                      <img 
                        src="/images/indian_catering_event_1783699401228.jpg" 
                        alt="Puja Catering Buffet Setup" 
                        className="h-full w-full object-cover" 
                        id="specialty-img-catering"
                      />
                    </div>
                    <h3 className="font-serif font-bold text-gray-950 dark:text-white text-base">
                      Holy Satsang & Wedding Buffets
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-stone-300 leading-relaxed flex-1 font-sans">
                      Professional luxury event catering. Beautiful flower-decorated live counters, copper chaffing arrangements, and pious hospitality.
                    </p>
                    <button 
                      onClick={() => setActiveTab('services')}
                      className="text-xs font-bold text-[#B8860B] flex items-center space-x-1 hover:text-amber-800 transition-colors cursor-pointer"
                    >
                      <span>Explore Services</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Philosophy Segment */}
            <AboutSection />
          </div>
        )}

        {/* MENU VIEW */}
        {activeTab === 'menu' && (
          <MenuSection
            menuItems={menuItems}
            onAddToCart={handleAddToCart}
            onBookCatering={handleBookCatering}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* STARTER VIEW */}
        {activeTab === 'starter' && (
          <StarterSection onAddToCart={handleAddToCart} />
        )}

        {/* FOOD BY KILO VIEW */}
        {activeTab === 'food-kilo' && (
          <FoodByKiloSection onAddToCart={handleAddToCart} />
        )}

        {/* SERVICES VIEW */}
        {activeTab === 'services' && (
          <ServicesSection />
        )}

        {/* PHILOSOPHY VIEW */}
        {activeTab === 'about' && (
          <AboutSection />
        )}

        {/* ADMIN VIEW */}
        {activeTab === 'admin' && (
          <AdminSection onBackToStore={() => setActiveTab('home')} />
        )}

        {/* TRACK ORDER VIEW */}
        {activeTab === 'track' && (
          <OrderTracker
            searchedOrderId={searchedOrderId}
            setSearchedOrderId={setSearchedOrderId}
          />
        )}
      </main>

      {/* Cart Drawer Sliding Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOrderSuccess={handleOrderSuccess}
        onTrackOrderClick={handleTrackOrderClick}
      />

      {/* Floating Expandable AI Assistant (Sita) */}
      <ChatBox />

      {/* Floating Quick Theme Toggle (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
        <div className="flex items-center rounded-full p-1 shadow-xl border backdrop-blur-md transition-all bg-white/95 dark:bg-stone-900/95 border-stone-200 dark:border-stone-700">
          <button
            onClick={() => {
              setTheme('light');
              if (typeof window !== 'undefined') {
                localStorage.setItem('satvik_theme', 'light');
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'light');
              }
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-amber-100 text-stone-900 shadow-xs border border-amber-300'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
            }`}
            title="Switch to White Background"
            id="quick-theme-white"
          >
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            <span>White</span>
          </button>
          <button
            onClick={() => {
              setTheme('dark');
              if (typeof window !== 'undefined') {
                localStorage.setItem('satvik_theme', 'dark');
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-stone-800 text-amber-300 shadow-xs border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-900'
            }`}
            title="Switch to Black Background"
            id="quick-theme-black"
          >
            <Moon className="h-3.5 w-3.5 text-amber-400" />
            <span>Black</span>
          </button>
        </div>
      </div>

      {/* Footer Banner */}
      <footer className="bg-stone-50 dark:bg-stone-950 text-gray-600 dark:text-stone-400 py-14 border-t border-stone-200 dark:border-stone-800 shadow-inner transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-200 dark:border-stone-800">
            
            {/* Branding Column */}
            <div className="space-y-3.5">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#B8860B] tracking-wider leading-none">
                  SATVIK
                </h2>
                <div className="text-gray-950 dark:text-stone-100 font-extrabold text-xs sm:text-sm uppercase tracking-[0.24em] mt-1 font-sans">
                  CATERS AND EVENTS
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-stone-400 leading-relaxed font-sans">
                Nourishing celebrations with pure vegetarian fine dining and luxury event catering, cooked meticulously with love and ancient Vedic traditions.
              </p>
              <div className="text-[11px] text-gray-500 font-medium border-t border-stone-200 dark:border-stone-800 pt-2 font-mono">
                Founder & Owner: <span className="text-gray-950 dark:text-white font-bold">{siteConfig.owner}</span>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider font-sans">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-[#B8860B] transition-colors cursor-pointer">Home Page</button></li>
                <li><button onClick={() => setActiveTab('menu')} className="hover:text-[#B8860B] transition-colors cursor-pointer">Menu & Thalis</button></li>
                <li><button onClick={() => setActiveTab('starter')} className="hover:text-[#B8860B] text-[#B8860B] font-bold transition-colors cursor-pointer">STARTER Menu</button></li>
                <li><button onClick={() => setActiveTab('food-kilo')} className="hover:text-[#B8860B] text-[#B8860B] font-bold transition-colors cursor-pointer">Food by Kilo (Pasand Apki)</button></li>
                <li><button onClick={() => setActiveTab('services')} className="hover:text-[#B8860B] transition-colors cursor-pointer">Services (Event & IRCTC)</button></li>
                <li><button onClick={() => setActiveTab('track')} className="hover:text-[#B8860B] transition-colors cursor-pointer">Track Order Live</button></li>
                <li><button onClick={() => setActiveTab('about')} className="hover:text-[#B8860B] transition-colors cursor-pointer">Our Philosophy</button></li>
                <li><button onClick={() => setActiveTab('admin')} className="hover:text-[#B8860B] text-amber-700 dark:text-amber-400 font-bold transition-colors cursor-pointer">Admin Dispatch Portal</button></li>
              </ul>
            </div>

            {/* Cooking Guidelines */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider font-sans">
                Our Standards
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-600 dark:text-stone-400">
                <li className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-2" />100% Pure Vegetarian</li>
                <li className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-2" />Strictly Onion & Garlic Free</li>
                <li className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-2" />Pure A2 Cow Ghee Preparations</li>
                <li className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-2" />Himalayan Pink Rock Salt</li>
                <li className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-2" />Positive Vedic Vibrations</li>
              </ul>
            </div>

            {/* Catering & Hours Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-950 dark:text-white uppercase tracking-wider font-sans">
                Catering & Hours
              </h4>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-stone-400">
                <strong className="text-gray-900 dark:text-white">Hours:</strong> {siteConfig.operatingHours} Daily<br />
                <strong className="text-gray-900 dark:text-white">Address:</strong> {siteConfig.address}<br />
                <strong className="text-gray-900 dark:text-white">Email:</strong> bookings@satvikcaters.com<br />
                <strong className="text-gray-900 dark:text-white">Helpline:</strong> <a href={`tel:${siteConfig.phone}`} className="text-[#B8860B] font-bold">{siteConfig.phone}</a>
              </p>
            </div>

          </div>

          {/* Database and Integration Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-none text-xs mb-8">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 font-mono text-[11px]">
                <Database className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                Supabase Realtime Database Ready
              </span>
              <span className="text-gray-400 text-[11px] hidden sm:inline">•</span>
              <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 font-mono text-[11px] hidden sm:flex">
                <Cloud className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                Cloudinary Media Storage Ready
              </span>
            </div>

            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-mono font-medium flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Next.js 15 Fullstack Framework</span>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 dark:text-stone-400 gap-4">
            <p>© 2026 Satvik Caters and Events. All Vedic Rights Reserved.</p>
            <p className="flex items-center text-[#B8860B]">
              <Heart className="h-3 w-3 fill-[#B8860B] text-[#B8860B] mr-1 animate-pulse" />
              <span>Prepared strictly to support physical wellness and peace of mind.</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
