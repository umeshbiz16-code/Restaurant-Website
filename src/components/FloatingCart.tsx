'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function FloatingCart() {
  const { totalCount, subtotal, cartBounce, flyingItems } = useCart();
  const pathname = usePathname();

  // Hide floating cart button on cart page itself to avoid overlap
  const isCartPage = pathname === '/cart';

  return (
    <>
      {/* --------------------------------------------------------------------------
          FLYING FOOD ITEM TO CART ANIMATION LAYER
          Visual indicator of items flying directly into the bottom-right cart
          -------------------------------------------------------------------------- */}
      {flyingItems.map((item) => (
        <div
          key={item.flightId}
          style={{
            position: 'fixed',
            left: item.currentX,
            top: item.currentY,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)',
            zIndex: 9999,
            pointerEvents: 'none',
            opacity: item.arrived ? 0 : 1,
            transformOrigin: 'center center',
          }}
          className="flex items-center justify-center"
        >
          <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-amber-400 bg-stone-950 shadow-2xl flex items-center justify-center ring-4 ring-amber-400/50 animate-pulse">
            {item.image ? (
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl">🍲</span>
            )}
            <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-md border border-stone-950">
              +1
            </span>
          </div>
        </div>
      ))}

      {/* --------------------------------------------------------------------------
          CART SHIFTED TO BELOW IN RIGHT CORNER (FIXED FLOATING BUTTON)
          -------------------------------------------------------------------------- */}
      {!isCartPage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in pointer-events-auto">
          <Link
            href="/cart"
            id="floating-bottom-cart-btn"
            className={`group flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 border-2 select-none ${
              cartBounce
                ? 'scale-120 rotate-[-4deg] bg-amber-500 text-stone-950 border-amber-300 ring-8 ring-amber-400/60 shadow-amber-500/50'
                : totalCount > 0
                ? 'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-stone-950 border-amber-300/90 hover:scale-105 hover:shadow-amber-500/40'
                : 'bg-stone-950/90 text-stone-200 border-amber-500/50 hover:border-amber-400 hover:text-white hover:scale-105 backdrop-blur-md'
            }`}
            title="Cart shifted to bottom right corner • Click to view items & checkout"
          >
            {/* Cart Icon with Live Count Badge */}
            <div className="relative flex items-center justify-center">
              <ShoppingBag
                className={`h-6 w-6 transition-transform duration-200 group-hover:scale-110 ${
                  cartBounce ? 'animate-bounce text-stone-950' : ''
                }`}
              />
              {totalCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-stone-950 text-white font-mono text-[10px] font-black border border-amber-300 shadow-md">
                  {totalCount}
                </span>
              )}
            </div>

            {/* Item Count & Subtotal Text */}
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider opacity-90 leading-tight">
                {totalCount > 0 ? `${totalCount} item${totalCount > 1 ? 's' : ''}` : 'Cart'}
              </span>
              <span className="text-xs font-black leading-tight">
                {totalCount > 0 ? `₹${subtotal}` : 'Empty'}
              </span>
            </div>

            {/* Quick View Arrow */}
            <div className="pl-1 border-l border-black/20 dark:border-white/20">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      )}
    </>
  );
}
