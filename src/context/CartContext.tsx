'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { MenuItem, CartItem } from '@/lib/data';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('satvik_cart');
      if (saved) {
        try {
          setCartItems(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse cart from storage:', e);
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

  const addToCart = (item: MenuItem, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === item.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      } else {
        updated = [...prev, { ...item, quantity }];
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('satvik_cart', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) => {
      const updated = prev.map((ci) => (ci.id === id ? { ...ci, quantity } : ci));
      if (typeof window !== 'undefined') {
        localStorage.setItem('satvik_cart', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((ci) => ci.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('satvik_cart', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('satvik_cart');
    }
  };

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = subtotal >= 299 || subtotal === 0 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05); // 5% GST on food
  const grandTotal = subtotal + deliveryCharge + tax;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        subtotal,
        deliveryCharge,
        tax,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartItems: [],
      addToCart: () => {},
      updateQuantity: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      totalCount: 0,
      subtotal: 0,
      deliveryCharge: 0,
      tax: 0,
      grandTotal: 0,
    };
  }
  return context;
}
