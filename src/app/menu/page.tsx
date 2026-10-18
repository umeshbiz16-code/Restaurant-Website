'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuSection from '@/components/MenuSection';
import { MenuItem, DEFAULT_MENU_ITEMS } from '@/lib/data';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(data);
        }
      })
      .catch((err) => console.warn('Could not fetch /api/menu:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-grow">
        <MenuSection menuItems={menuItems} />
      </main>

      <Footer />
    </div>
  );
}
