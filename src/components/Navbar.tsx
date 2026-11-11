'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { SunMoonThemeToggle } from '@/components/ui/sun-moon-theme-toggle';
import { Menu as MenuIcon, X, ShoppingBag } from 'lucide-react';

const TRAIN_STATIONS = [
  { name: 'Bhopal Station (Main)', code: 'BPL' },
  { name: 'Rain Kamlapati Station', code: 'RKMP' },
  { name: 'Sant Hirdaram Nagar', code: 'SHRN' },
  { name: 'Nishatpura', code: 'NSZ' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'Starter', href: '/strater' },
    { label: 'Services', href: '/service' },
    { label: 'Special Enquiry', href: '/form-enquiry' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md dark:bg-stone-950/95 dark:border-stone-800 transition-colors shadow-xs">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - Enlarged inside the navbar for prominent visibility */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center space-x-2 py-0.5 outline-none group"
            id="navbar-brand-link"
          >
            {theme === 'dark' ? (
              <img
                src="/images/logo-dark.png"
                alt="Satvik Caters & Events"
                className="h-16 sm:h-17 md:h-18 max-h-[74px] w-auto object-contain transition-transform duration-200 group-hover:scale-102"
                id="brand-logo-dark"
              />
            ) : (
              <img
                src="/images/logo-light.png"
                alt="Satvik Caters & Events"
                className="h-16 sm:h-17 md:h-18 max-h-[74px] w-auto object-contain transition-transform duration-200 group-hover:scale-102"
                id="brand-logo-light"
              />
            )}
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-9 tracking-[0.08em] text-[13px] font-semibold">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 transition-all relative ${
                  active
                    ? 'text-[#B8860B] dark:text-amber-400 font-bold'
                    : 'text-stone-700 hover:text-[#B8860B] dark:text-stone-300 dark:hover:text-amber-300 font-medium'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B8860B] dark:bg-amber-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Train Delivery Button (with stations hover tooltip), Sun-Moon Toggle, & Mobile Menu Trigger */}
        <div className="flex items-center space-x-2 sm:space-x-3.5">
          
          {/* Food delivery in Train Button with Hover Railway Stations Dropdown */}
          <div className="relative group">
            <Link
              href="/train-food-delivery"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs border ${
                isActive('/train-food-delivery')
                  ? 'bg-[#B8860B] text-white border-[#B8860B] shadow-amber-500/20'
                  : 'bg-amber-50/90 text-[#B8860B] border-amber-300/80 hover:bg-[#B8860B] hover:text-white dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/60 dark:hover:bg-[#B8860B] dark:hover:text-white'
              }`}
              title="Order food delivery to your train coach & berth"
              id="navbar-train-delivery-btn"
            >
              <span className="text-sm">🚆</span>
              <span className="hidden sm:inline">Food delivery in Train</span>
              <span className="sm:hidden">Train Food</span>
            </Link>

            {/* Hover Tooltip / Dropdown: Railway Stations */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white dark:bg-stone-900 border-2 border-amber-400 dark:border-amber-600 rounded-2xl p-3 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-auto">
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 font-mono pb-1.5 mb-1.5 border-b border-amber-100 dark:border-stone-800 flex items-center justify-between">
                <span>🚆 Railway Stations Served</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded font-bold">Coach Drop</span>
              </div>
              <ul className="space-y-1">
                {TRAIN_STATIONS.map((st) => (
                  <li key={st.name}>
                    <Link
                      href={`/train-food-delivery?station=${encodeURIComponent(st.name)}`}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/60 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:text-[#B8860B] dark:hover:text-amber-400 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">📍</span>
                        <span>{st.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                        {st.code}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-2 pt-2 border-t border-amber-100 dark:border-stone-800 text-[10px] text-stone-500 dark:text-stone-400 text-center font-medium">
                Piping-hot Satvik thalis delivered to your seat
              </div>
            </div>
          </div>

          {/* Animated Sun-Moon Toggle Component */}
          <div className="flex items-center">
            <SunMoonThemeToggle size={34} duration={700} sky={true} />
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            id="mobile-menu-button"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-stone-900 dark:text-stone-100" />
            ) : (
              <MenuIcon className="h-6 w-6 text-stone-900 dark:text-stone-100" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Navigation */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white/98 dark:bg-stone-950/98 px-4 pt-3 pb-5 shadow-lg animate-fade-in"
          id="mobile-navigation-drawer"
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-sm font-semibold transition-colors flex items-center justify-between ${
                    active
                      ? 'bg-amber-50 text-[#B8860B] dark:bg-amber-950/40 dark:text-amber-400 font-bold'
                      : 'text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-900'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[#B8860B] dark:bg-amber-400" />}
                </Link>
              );
            })}
            
            {/* Food delivery in Train in Mobile Drawer with Railway Stations */}
            <div className="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-500/10 p-2.5 space-y-2 mt-1.5">
              <Link
                href="/train-food-delivery"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm font-bold text-[#B8860B] dark:text-amber-300"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">🚆</span>
                  <span>Food delivery in Train</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-[#B8860B] dark:text-amber-300 font-bold">
                  Coach Drop
                </span>
              </Link>
              <div className="pt-1.5 border-t border-amber-200 dark:border-amber-800/60 grid grid-cols-2 gap-1 text-[11px] font-medium text-stone-700 dark:text-stone-300">
                {TRAIN_STATIONS.map((st) => (
                  <Link
                    key={st.name}
                    href={`/train-food-delivery?station=${encodeURIComponent(st.name)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1 hover:text-[#B8860B] transition-colors truncate"
                  >
                    <span>📍</span>
                    <span className="truncate">{st.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Cart Link in Mobile Navigation */}
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-md text-sm font-semibold transition-colors flex items-center justify-between text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-900 border-t border-stone-100 dark:border-stone-800 mt-2 pt-3"
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4 text-[#B8860B]" />
                <span>My Cart</span>
              </div>
              {totalCount > 0 && (
                <span className="bg-[#B8860B] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {totalCount} items
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
