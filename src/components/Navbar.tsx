'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { SunMoonThemeToggle } from '@/components/ui/sun-moon-theme-toggle';
import { Menu as MenuIcon, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'Starter', href: '/strater' },
    { label: 'Services', href: '/service' },
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
        
        {/* Brand Logo - Responsive & High Contrast on Light/Dark Themes */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center space-x-2 py-1 outline-none group"
            id="navbar-brand-link"
          >
            {/* Show light theme logo when theme is light, dark theme logo when theme is dark */}
            {theme === 'dark' ? (
              <img
                src="/images/logo-dark.png"
                alt="Satvik Caters & Events"
                className="h-11 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
                id="brand-logo-dark"
              />
            ) : (
              <img
                src="/images/logo-light.png"
                alt="Satvik Caters & Events"
                className="h-11 sm:h-12 md:h-13 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
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

        {/* Right Section: Animated Sun-Moon Theme Toggle & Mobile Menu Trigger */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Animated Sun-Moon Toggle Component */}
          <div className="flex items-center pl-2">
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
          </div>
        </div>
      )}
    </header>
  );
}
