'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, UtensilsCrossed, ArrowLeft, LogOut, ClipboardList, CreditCard 
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { SunMoonThemeToggle } from '@/components/ui/sun-moon-theme-toggle';

interface AdminSidebarProps {
  onLogout?: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('satvik_admin_auth');
      localStorage.removeItem('satvik_admin_auth');
    }
    if (onLogout) {
      onLogout();
    } else {
      router.push('/admin');
    }
  };

  const navItems = [
    {
      label: 'Website Dishes Overview',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      label: 'Add & Manage Dishes',
      href: '/admin-menu',
      icon: UtensilsCrossed,
      active: pathname === '/admin-menu',
    },
    {
      label: 'Customer Orders',
      href: '/admin-order',
      icon: ClipboardList,
      active: pathname === '/admin-order',
    },
    {
      label: 'Razorpay Gateway',
      href: '/admin-razorpay',
      icon: CreditCard,
      active: pathname === '/admin-razorpay',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-r border-stone-200 dark:border-stone-800 flex flex-col shrink-0 min-h-screen transition-colors">
      
      {/* Brand & Theme Toggle Header */}
      <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          {theme === 'dark' ? (
            <img
              src="/images/logo-dark.png"
              alt="Satvik Logo"
              className="h-10 w-auto object-contain"
            />
          ) : (
            <img
              src="/images/logo-light.png"
              alt="Satvik Logo"
              className="h-10 w-auto object-contain"
            />
          )}
        </Link>
        <div className="flex items-center space-x-2">
          <SunMoonThemeToggle size={28} duration={700} sky={true} />
        </div>
      </div>

      {/* Admin User Badge */}
      <div className="px-4 sm:px-5 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-full bg-amber-500/20 text-[#B8860B] dark:text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
            U
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
              umeshbiz16@gmail.com
            </p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 flex-1 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 px-3 mb-2">
          Kitchen Administration
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                item.active
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>View Public Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout Admin</span>
        </button>
      </div>
    </aside>
  );
}
