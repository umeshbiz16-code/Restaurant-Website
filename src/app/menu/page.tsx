'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MenuSection from '@/components/MenuSection';
import CartDrawer from '@/components/CartDrawer';
import { MenuItem, CartItem, Order, DEFAULT_MENU_ITEMS } from '@/lib/data';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchedOrderId, setSearchedOrderId] = useState('');

  // Load menu items from Supabase/Next.js API
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

  // Sync cart from localStorage
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

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('satvik_cart', JSON.stringify(items));
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    const existing = cartItems.find((ci) => ci.id === item.id);
    let updated: CartItem[];
    if (existing) {
      updated = cartItems.map((ci) =>
        ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
      );
    } else {
      updated = [...cartItems, { ...item, quantity: 1 }];
    }
    saveCart(updated);
    setIsCartOpen(true);
  };

  const handleBookCatering = (item: MenuItem) => {
    handleAddToCart(item);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
    } else {
      const updated = cartItems.map((ci) =>
        ci.id === id ? { ...ci, quantity: qty } : ci
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

  return (
    <div className="min-h-screen bg-white text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-grow">
        <MenuSection
          menuItems={menuItems}
          onAddToCart={handleAddToCart}
          onBookCatering={handleBookCatering}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOrderSuccess={handleOrderSuccess}
      />

      <Footer />
    </div>
  );
}
