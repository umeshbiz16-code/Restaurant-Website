'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, UtensilsCrossed, ShoppingBag, 
  Image as ImageIcon, ArrowLeft, LogOut, ShieldCheck 
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

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
      label: 'Orders & Dispatch',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      label: 'Menu & Dishes Manager',
      href: '/admin-menu',
      icon: UtensilsCrossed,
      active: pathname === '/admin-menu',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-stone-900 text-stone-200 border-r border-stone-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-800 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/images/logo-dark.png"
            alt="Satvik Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
          Admin
        </span>
      </div>

      {/* Admin User Badge */}
      <div className="px-5 py-4 border-b border-stone-800/80 bg-stone-950/40">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
            U
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">umeshbiz16@gmail.com</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Supabase Verified
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 flex-1 space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-3 mb-2">
          Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                item.active
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-stone-800 space-y-2">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>View Live Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout Admin</span>
        </button>
      </div>
    </aside>
  );
}
