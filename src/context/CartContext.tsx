'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { MenuItem, CartItem } from '@/lib/data';
import { TrainDeliveryDetails } from '@/types';
import FloatingCart from '@/components/FloatingCart';

export interface FlyingItem {
  flightId: string;
  image?: string;
  name: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  arrived: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    item: MenuItem, 
    quantity?: number, 
    event?: React.MouseEvent | { clientX: number; clientY: number }
  ) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  grandTotal: number;
  // Food delivery in Train state
  trainDeliveryInfo: TrainDeliveryDetails | null;
  setTrainDeliveryInfo: (info: TrainDeliveryDetails | null) => void;
  clearTrainDeliveryInfo: () => void;
  // Animation state for cart shifted to bottom-right
  cartBounce: boolean;
  flyingItems: FlyingItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [trainDeliveryInfo, setTrainDeliveryInfoState] = useState<TrainDeliveryDetails | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

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

      const savedTrain = localStorage.getItem('satvik_train_delivery');
      if (savedTrain) {
        try {
          setTrainDeliveryInfoState(JSON.parse(savedTrain));
        } catch (e) {
          console.error('Failed to parse train delivery from storage:', e);
        }
      }
    }
  }, []);

  const setTrainDeliveryInfo = (info: TrainDeliveryDetails | null) => {
    setTrainDeliveryInfoState(info);
    if (typeof window !== 'undefined') {
      if (info) {
        localStorage.setItem('satvik_train_delivery', JSON.stringify(info));
      } else {
        localStorage.removeItem('satvik_train_delivery');
      }
    }
  };

  const clearTrainDeliveryInfo = () => {
    setTrainDeliveryInfoState(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('satvik_train_delivery');
    }
  };

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('satvik_cart', JSON.stringify(items));
    }
  };

  const addToCart = (
    item: MenuItem, 
    quantity = 1, 
    event?: React.MouseEvent | { clientX: number; clientY: number }
  ) => {
    // 1. Update Cart Items in state and localStorage
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

    // 2. Trigger Flight Animation towards bottom-right cart
    if (typeof window !== 'undefined') {
      const startX = event && 'clientX' in event && event.clientX ? event.clientX : window.innerWidth / 2;
      const startY = event && 'clientY' in event && event.clientY ? event.clientY : window.innerHeight / 2;
      const targetX = window.innerWidth - 65;
      const targetY = window.innerHeight - 65;

      const flightId = `flight_${Date.now()}_${Math.random()}`;
      const newFlight: FlyingItem = {
        flightId,
        image: item.image,
        name: item.name,
        startX,
        startY,
        currentX: startX,
        currentY: startY,
        arrived: false,
      };

      setFlyingItems((prev) => [...prev, newFlight]);

      // Step towards target in next frame
      setTimeout(() => {
        setFlyingItems((prev) =>
          prev.map((f) => (f.flightId === flightId ? { ...f, currentX: targetX, currentY: targetY } : f))
        );
      }, 25);

      // Arrival at cart after 650ms
      setTimeout(() => {
        setFlyingItems((prev) =>
          prev.map((f) => (f.flightId === flightId ? { ...f, arrived: true } : f))
        );
        setCartBounce(true);
        setTimeout(() => setCartBounce(false), 500);
      }, 650);

      // Cleanup flight element after transition finishes
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((f) => f.flightId !== flightId));
      }, 950);
    }
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
        trainDeliveryInfo,
        setTrainDeliveryInfo,
        clearTrainDeliveryInfo,
        cartBounce,
        flyingItems,
      }}
    >
      {children}
      <FloatingCart />
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
      trainDeliveryInfo: null,
      setTrainDeliveryInfo: () => {},
      clearTrainDeliveryInfo: () => {},
      cartBounce: false,
      flyingItems: [],
    };
  }
  return context;
}
