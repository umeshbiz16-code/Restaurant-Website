'use client';

import React, { useState } from "react";
import { CartItem, MenuItem, Order } from "../types";
import { 
  X, Trash2, Plus, Minus, CreditCard, Sparkles, CheckCircle, 
  MapPin, Phone, User, Calendar, Users, FileText, ArrowRight, Clock
} from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onOrderSuccess: (order: Order) => void;
  onTrackOrderClick: (orderId: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOrderSuccess,
  onTrackOrderClick
}: CartDrawerProps) {
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [loading, setLoading] = useState<boolean>(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"Card" | "UPI" | "NetBanking">("Card");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvv, setCardCvv] = useState<string>("");
  const [upiId, setUpiId] = useState<string>("");
  const [eventType, setEventType] = useState<string>("Satsang / Puja");
  const [guestCount, setGuestCount] = useState<number>(30); // 30 plates default minimum for catering
  const [specialInstructions, setSpecialInstructions] = useState<string>("");

  const isCateringOrder = cartItems.some(item => item.category === "Catering");

  // Calculate pricing
  const subtotal = cartItems.reduce((acc, item) => {
    if (item.category === "Catering") {
      return acc + (item.price * guestCount);
    }
    return acc + (item.price * item.quantity);
  }, 0);

  const deliveryCharge = isCateringOrder ? 1500 : (subtotal > 500 || subtotal === 0 ? 0 : 40);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal > 0 ? (subtotal + deliveryCharge + tax) : 0;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !email || !phone || !address) {
      alert("Please enter all required shipping details.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          address,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category
          })),
          paymentMethod,
          cardNumber: paymentMethod === "Card" ? cardNumber : undefined,
          upiId: paymentMethod === "UPI" ? upiId : undefined,
          eventType: isCateringOrder ? eventType : undefined,
          guestCount: isCateringOrder ? guestCount : undefined,
          specialInstructions
        }),
      });

      const data = await response.json();

      if (response.ok && data.order) {
        setPlacedOrder(data.order);
        onOrderSuccess(data.order);
        setStep("success");
      } else {
        alert(data.error || "Failed to process booking. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during booking. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("cart");
    setPlacedOrder(null);
    setCustomerName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setUpiId("");
    setSpecialInstructions("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer">
      {/* Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={step !== "success" ? onClose : handleReset}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-[#0F0F0F] border-l border-white/10 shadow-2xl transition-all flex flex-col h-full text-[#E0E0E0]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-[#121212]">
            <h2 className="font-serif text-lg font-normal text-white flex items-center tracking-wide">
              <span>{step === "cart" ? "Your Sacred Basket" : step === "checkout" ? "Complete Booking" : "Divine Booking Placed!"}</span>
              {step !== "success" && cartItems.length > 0 && (
                <span className="ml-2.5 rounded-none bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-2 py-0.5 text-[10px] font-bold text-[#D4AF37]">
                  {cartItems.length}
                </span>
              )}
            </h2>
            <button 
              onClick={step !== "success" ? onClose : handleReset}
              className="rounded-none p-1.5 text-gray-400 hover:bg-white/5 hover:text-[#D4AF37] transition-colors"
              id="cart-close-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Core Panel Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#121212]">
            
            {/* STEP 1: CART DISPLAY */}
            {step === "cart" && (
              <div className="h-full flex flex-col">
                {cartItems.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-center py-10">
                    <div className="flex h-14 w-14 items-center justify-center bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4 animate-pulse">
                      <CreditCard className="h-6 w-6 text-[#D4AF37]" />
                    </div>
                    <p className="font-serif text-white text-base">Your basket is currently empty</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed font-sans">
                      Browse our Satvik menu and add some pure ghee delights or cater packages to start!
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 rounded-none bg-[#D4AF37] hover:bg-[#B8962E] px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all"
                      id="cart-empty-browse"
                    >
                      Browse Dishes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 flex-1">
                    {/* Cart Items List */}
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                      {cartItems.map((item) => {
                        const isCateringItem = item.category === "Catering";
                        return (
                          <div key={item.id} className="flex items-center space-x-4 bg-[#1A1A1A] border border-white/5 p-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-14 w-14 object-cover bg-neutral-900 grayscale-[10%]"
                              referrerPolicy="no-referrer"
                              id={`cart-item-img-${item.id}`}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-serif text-white truncate tracking-wide">{item.name}</h4>
                              <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">
                                ₹{item.price}{isCateringItem ? "/plate" : ""}
                              </p>
                              <p className="text-[9px] uppercase tracking-wider text-gray-500 font-medium">Category: {item.category}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-1.5 bg-black/40 rounded-none p-1 border border-white/10">
                              {!isCateringItem ? (
                                <>
                                  <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    className="rounded-none p-0.5 hover:bg-white/5 text-[#D4AF37]"
                                    id={`qty-minus-${item.id}`}
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="rounded-none p-0.5 hover:bg-white/5 text-[#D4AF37]"
                                    id={`qty-plus-${item.id}`}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-[9px] font-bold text-[#D4AF37] px-2 uppercase tracking-wider">Catering</span>
                              )}
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                              id={`cart-remove-${item.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Catering Guests Config Slider (Only shows if a catering package is in basket) */}
                    {isCateringOrder && (
                      <div className="bg-[#1A1A1A] p-4 border border-white/5 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                            <Users className="h-4 w-4 text-[#D4AF37]" />
                            <span>Estimated Plate Count</span>
                          </label>
                          <span className="bg-[#D4AF37]/15 border border-[#D4AF37]/25 px-2.5 py-0.5 text-xs font-bold text-[#D4AF37]">
                            {guestCount} Guests
                          </span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="500"
                          step="10"
                          value={guestCount}
                          onChange={(e) => setGuestCount(parseInt(e.target.value))}
                          className="w-full accent-[#D4AF37] cursor-pointer h-1.5 bg-[#0F0F0F]"
                        />
                        <div className="flex justify-between text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                          <span>30 guests (Min)</span>
                          <span>250 guests</span>
                          <span>500 guests (Max)</span>
                        </div>
                        <p className="text-[10px] text-[#D4AF37] leading-normal italic bg-[#D4AF37]/5 p-2 border border-[#D4AF37]/10">
                          * Catering packages include buffet counters, clay serving plates, and copper hot chafers. Pricing is calculated as (Plates * ₹/Plate) + ₹1500 transport.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: SECURE CHECKOUT FORM */}
            {step === "checkout" && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-5" id="checkout-form">
                <div className="space-y-3.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center space-x-1.5 border-b border-white/5 pb-1.5">
                    <User className="h-4 w-4" />
                    <span>Customer Details</span>
                  </h3>
                  
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Shrivastava"
                      className="w-full rounded-none border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] placeholder-gray-600"
                    />
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full rounded-none border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] placeholder-gray-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded-none border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] placeholder-gray-600"
                      />
                    </div>
                  </div>

                  {/* Address Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Delivery Address <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter complete shipping or event venue address..."
                      className="w-full rounded-none border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Catering specific questions */}
                {isCateringOrder && (
                  <div className="bg-[#1A1A1A] p-4 border border-white/10 space-y-3.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center space-x-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>Catering Event Settings</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Event Type</label>
                        <select
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value)}
                          className="w-full rounded-none border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                        >
                          <option value="Satsang / Puja">Satsang / Puja</option>
                          <option value="Marriage / Ring Ceremony">Wedding & Ritual</option>
                          <option value="Ayurvedic Seminar">Ayurvedic Seminar</option>
                          <option value="House Warming (Griha Pravesh)">Griha Pravesh</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Guest Count</label>
                        <input
                          type="number"
                          disabled
                          value={guestCount}
                          className="w-full rounded-none border border-white/10 bg-black/30 px-3 py-2 text-xs font-bold text-[#D4AF37]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-1.5 text-[#D4AF37]" />
                    <span>Special Kitchen Instructions</span>
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Mild chili, strictly no honey, eco plates, etc."
                    className="w-full rounded-none border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] placeholder-gray-600"
                  />
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3 border-t border-white/10 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center space-x-1.5">
                    <CreditCard className="h-4 w-4" />
                    <span>Simulated Secured Payment</span>
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {["Card", "UPI", "NetBanking"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method as any)}
                        className={`py-2 rounded-none text-xs font-bold border transition-colors uppercase tracking-wider ${
                          paymentMethod === method
                            ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                            : "bg-transparent border-white/10 text-gray-300 hover:bg-white/5"
                        }`}
                      >
                        {method === "Card" ? "Debit/Credit" : method}
                      </button>
                    ))}
                  </div>

                  {/* Payment Inputs */}
                  {paymentMethod === "Card" && (
                    <div className="space-y-3 bg-[#1A1A1A] p-3.5 border border-white/5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4111 2222 3333 4444"
                          className="w-full rounded-none border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none placeholder-gray-700"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full rounded-none border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none placeholder-gray-700"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">CVV</label>
                          <input
                            type="password"
                            required
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full rounded-none border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none placeholder-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "UPI" && (
                    <div className="bg-[#1A1A1A] p-3 border border-white/5 space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">UPI Address (VPA)</label>
                      <input
                        type="text"
                        required
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okaxis"
                        className="w-full rounded-none border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none placeholder-gray-700"
                      />
                    </div>
                  )}

                  {paymentMethod === "NetBanking" && (
                    <p className="text-[10px] text-gray-400 bg-white/5 p-2.5 border border-white/5 italic">
                      * You will be securely redirected to select from top Indian banks (SBI, HDFC, ICICI, etc.) upon checking out.
                    </p>
                  )}
                </div>

                {/* Checkout submit trigger placed under billing block */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-none bg-[#D4AF37] hover:bg-[#B8962E] py-4 text-xs font-bold uppercase tracking-widest text-black shadow-lg disabled:opacity-75 transition-all flex items-center justify-center space-x-2"
                  id="checkout-submit-btn"
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Pay & Book Securely</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 3: SUCCESS CONGRATULATIONS PANEL */}
            {step === "success" && placedOrder && (
              <div className="text-center py-12 flex flex-col items-center h-full justify-center space-y-6" id="success-panel">
                <div className="flex h-16 w-16 items-center justify-center bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] shadow-inner">
                  <CheckCircle className="h-10 w-10 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-normal text-white tracking-wide">Order Received!</h3>
                  <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest flex items-center justify-center">
                    <Sparkles className="h-4 w-4 mr-1 text-[#D4AF37]" />
                    <span>Om Shanti — Paid & Processed</span>
                  </p>
                  <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                    Thank you, {placedOrder.customerName}. Your booking is logged in our central kitchen. Cooking begins with sacred chants.
                  </p>
                </div>

                {/* Booking Code Card */}
                <div className="bg-[#1A1A1A] border border-white/5 p-5 w-full text-center space-y-2.5">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Your Private Track ID</span>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="text-lg font-mono font-bold text-[#D4AF37] select-all tracking-wider px-3.5 py-1.5 bg-black border border-white/10">
                      {placedOrder.id}
                    </code>
                  </div>
                  <p className="text-[10px] text-gray-400 font-sans">
                    Use this ID to track preparation and courier location in real-time.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 w-full">
                  <button
                    onClick={() => {
                      onTrackOrderClick(placedOrder.id);
                      handleReset();
                    }}
                    className="w-full rounded-none bg-[#D4AF37] hover:bg-[#B8962E] py-3.5 text-xs font-bold uppercase tracking-widest text-black flex items-center justify-center space-x-2"
                    id="success-btn-track"
                  >
                    <Clock className="h-4 w-4 text-black" />
                    <span>Track Order Live</span>
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="w-full rounded-none border border-white/10 bg-transparent text-gray-300 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-white/5"
                    id="success-btn-continue"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Pricing & Footer Calculations Drawer */}
          {step !== "success" && cartItems.length > 0 && (
            <div className="border-t border-white/10 bg-[#0F0F0F] px-6 py-5 space-y-4">
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs text-gray-400 font-sans">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-white">₹{subtotal}</span>
                </div>
                {isCateringOrder && (
                  <div className="flex justify-between text-[10px] text-[#D4AF37] italic">
                    <span>* Catering Pricing ({guestCount} plates)</span>
                    <span>Computed Above</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-gray-400 font-sans">
                  <span>Ayurvedic Service & Freight</span>
                  <span className="font-bold text-white">{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-sans">
                  <span>GST (5% Satvik rate)</span>
                  <span className="font-bold text-white">₹{tax}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2.5 text-sm font-bold text-white font-serif">
                  <span>Total Amount</span>
                  <span className="text-[#D4AF37]">₹{total}</span>
                </div>
              </div>

              {step === "cart" && (
                <button
                  onClick={() => setStep("checkout")}
                  className="w-full rounded-none bg-[#D4AF37] hover:bg-[#B8962E] py-3.5 text-xs font-bold uppercase tracking-widest text-black flex items-center justify-center space-x-1.5"
                  id="cart-btn-checkout"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
