'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StarterSection from '@/components/StarterSection';
import CartDrawer from '@/components/CartDrawer';
import { MenuItem, CartItem, Order } from '@/lib/data';

export default function StraterPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-grow">
        <StarterSection onAddToCart={handleAddToCart} />
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
