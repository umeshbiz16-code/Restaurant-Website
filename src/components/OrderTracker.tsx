import React, { useState, useEffect } from "react";
import { Order, OrderStatus } from "../types";
import { 
  Search, Clock, Package, ShoppingBag, MapPin, CheckCircle2, 
  HelpCircle, Utensils, ShieldCheck, Truck, Navigation, Phone, ChevronRight 
} from "lucide-react";

interface OrderTrackerProps {
  searchedOrderId: string;
  setSearchedOrderId: (id: string) => void;
}

export default function OrderTracker({ searchedOrderId, setSearchedOrderId }: OrderTrackerProps) {
  const [orderInput, setOrderInput] = useState<string>(searchedOrderId);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Poll server for updates when order is loaded
  const fetchOrderDetails = async (id: string, silence: boolean = false) => {
    if (!silence) setIsSearching(true);
    setErrorMsg("");
    try {
      const response = await fetch(`/api/orders/${id.trim()}`);
      const data = await response.json();
      
      if (response.ok && data.id) {
        setCurrentOrder(data);
        setErrorMsg("");
      } else {
        setCurrentOrder(null);
        setErrorMsg(data.error || "Order code not found. Double check and try again.");
      }
    } catch (err) {
      console.error(err);
      if (!silence) setErrorMsg("Connection issue. Please retry.");
    } finally {
      if (!silence) setIsSearching(false);
    }
  };

  // Sync state if searchedOrderId changes from parent
  useEffect(() => {
    if (searchedOrderId) {
      setOrderInput(searchedOrderId);
      fetchOrderDetails(searchedOrderId);
    }
  }, [searchedOrderId]);

  // Periodic polling for status progression while tracker is visible and order isn't delivered yet
  useEffect(() => {
    if (!currentOrder || currentOrder.status === "Delivered") return;

    const interval = setInterval(() => {
      fetchOrderDetails(currentOrder.id, true);
    }, 5000); // Poll every 5s for smooth state change demo

    return () => clearInterval(interval);
  }, [currentOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) return;
    fetchOrderDetails(orderInput);
  };

  // Status mapping details
  const steps: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      status: "Placed",
      label: "Order Logged",
      desc: "Sacred order accepted; cooking rituals prepared.",
      icon: <CheckCircle2 className="h-5 w-5" />
    },
    {
      status: "Chef Preparing",
      label: "Vedic Cooking",
      desc: "Slow-cooking with A2 ghee and meditation chanting.",
      icon: <Utensils className="h-5 w-5" />
    },
    {
      status: "Quality Check",
      label: "Purity Audited",
      desc: "Hygienically packaged and checked for satvik standards.",
      icon: <ShieldCheck className="h-5 w-5" />
    },
    {
      status: "Out for Delivery",
      label: "Courier Transit",
      desc: "Peaceful rider carrying hot meal to your address.",
      icon: <Truck className="h-5 w-5" />
    },
    {
      status: "Delivered",
      label: "Arrived Safely",
      desc: "Received in pure grace. Om Shanti! Enjoy your meal.",
      icon: <ShoppingBag className="h-5 w-5" />
    }
  ];

  const getStepIndex = (status: OrderStatus) => {
    const idx = steps.findIndex(s => s.status === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <section className="py-16 bg-[#0F0F0F] min-h-[75vh] text-[#E0E0E0] border-t border-white/5" id="order-tracker">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center space-y-3 mb-10">
          <h2 className="font-serif text-3xl font-normal text-white tracking-wide">
            Satvik <span className="text-[#D4AF37]">Order Tracker</span>
          </h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto font-sans leading-relaxed">
            Input your unique Order ID (e.g. <span className="font-mono bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-1.5 py-0.5 text-[#D4AF37] font-bold">SATVIK-783612</span>) to track cooking and transit progression in real-time.
          </p>
        </div>

        {/* Search Bar Panel */}
        <div className="rounded-none bg-[#121212] border border-white/10 p-6 shadow-none mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#D4AF37]" />
              <input
                type="text"
                placeholder="Enter order ID (e.g. SATVIK-783612)"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                className="w-full rounded-none border border-white/10 bg-black/40 pl-10 pr-4 py-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] placeholder-gray-600"
                id="tracker-input"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="rounded-none bg-[#D4AF37] px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-[#B8962E] transition-colors disabled:opacity-75 flex items-center justify-center space-x-1.5"
              id="tracker-search-btn"
            >
              {isSearching ? (
                <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Track Status</span>
              )}
            </button>
          </form>

          {errorMsg && (
            <p className="mt-3 text-xs font-semibold text-red-400 bg-red-950/20 p-2.5 rounded-none border border-red-900/30 text-center">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Main Tracking Details */}
        {currentOrder ? (
          <div className="space-y-8 animate-fade-in" id="tracker-results">
            
            {/* Status Summary Banner */}
            <div className="rounded-none bg-[#1A1A1A] border border-white/10 p-6 shadow-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tracking Code</span>
                <h3 className="font-mono text-lg font-bold text-[#D4AF37] tracking-wider">{currentOrder.id}</h3>
                <p className="text-xs text-gray-400">
                  Customer: <span className="font-serif text-white font-medium">{currentOrder.customerName}</span>
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-[#121212] px-4 py-3 rounded-none border border-white/5 w-full md:w-auto">
                <Clock className="h-5 w-5 text-[#D4AF37] animate-pulse" />
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Estimated Delivery</p>
                  <p className="text-xs font-serif font-bold text-[#D4AF37]">
                    {new Date(currentOrder.estimatedDeliveryAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="rounded-none bg-[#1A1A1A] border border-white/10 p-6 shadow-none">
              <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-6 font-serif">Preparation Progression</h4>
              
              <div className="relative pl-6 sm:pl-0 sm:flex sm:justify-between items-start gap-4">
                {/* Connecting Line (Desktop) */}
                <div className="hidden sm:block absolute left-6 right-6 top-5 h-0.5 bg-white/5 -z-10" />

                {steps.map((step, idx) => {
                  const isCompleted = idx < currentStepIdx;
                  const isActive = idx === currentStepIdx;
                  const isFuture = idx > currentStepIdx;

                  return (
                    <div 
                      key={step.status}
                      className="relative pb-8 sm:pb-0 flex sm:flex-col items-center sm:text-center sm:flex-1"
                    >
                      {/* Connecting Line (Mobile vertical) */}
                      {idx < steps.length - 1 && (
                        <div className={`sm:hidden absolute left-4.5 top-9 bottom-0 w-0.5 ${
                          idx < currentStepIdx ? "bg-[#D4AF37]" : "bg-white/5"
                        }`} />
                      )}

                      {/* Icon Bubble */}
                      <div className={`flex h-9 w-9 items-center justify-center rounded-none border shadow-none transition-colors z-10 ${
                        isActive ? "bg-[#D4AF37] border-[#D4AF37] text-black animate-bounce" :
                        isCompleted ? "bg-emerald-600 border-emerald-600 text-black font-bold" :
                        "bg-black border-white/10 text-gray-500"
                      }`}>
                        {step.icon}
                      </div>

                      {/* Label and description text */}
                      <div className="ml-4 sm:ml-0 sm:mt-3 text-left sm:text-center flex-1">
                        <h5 className={`text-xs font-bold font-serif tracking-wide ${
                          isActive ? "text-[#D4AF37]" : isCompleted ? "text-emerald-400" : "text-gray-500"
                        }`}>
                          {step.label}
                        </h5>
                        <p className="text-[10px] text-gray-400 leading-normal mt-0.5 max-w-[150px] mx-auto">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map/Rider Showcase */}
            {currentOrder.status !== "Delivered" && (
              <div className="rounded-none bg-[#1A1A1A] border border-white/10 p-5 shadow-none space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                      <Navigation className="h-4 w-4 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-semibold text-white tracking-wide">Rider On The Way</h4>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Simulated live GPS route</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 rounded-none bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[9px] font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>GPS Signal Locked</span>
                  </div>
                </div>

                {/* Simulated SVG Map */}
                <div className="relative h-44 rounded-none overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center">
                  {/* Decorative Map Vector Design */}
                  <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    {/* Road pathways */}
                    <path d="M 50,0 Q 150,120 400,60 T 800,100" fill="none" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" strokeDasharray="5,5"/>
                    <path d="M 0,100 L 900,100" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.1"/>
                    <path d="M 250,0 L 250,300" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.1"/>
                  </svg>

                  {/* Pin: Kitchen */}
                  <div className="absolute left-[15%] top-[30%] flex flex-col items-center">
                    <div className="rounded-none bg-[#D4AF37]/15 p-1.5 text-[#D4AF37] border border-[#D4AF37]/30 shadow-md">
                      <Utensils className="h-3 w-3" />
                    </div>
                    <span className="text-[9px] font-bold text-[#D4AF37] bg-black px-1.5 py-0.5 rounded-none mt-1 border border-white/10 font-mono">Central Kitchen</span>
                  </div>

                  {/* Moving Courier Icon */}
                  <div 
                    className="absolute flex flex-col items-center transition-all duration-1000 z-10"
                    style={{
                      left: currentOrder.status === "Placed" ? "15%" :
                            currentOrder.status === "Chef Preparing" ? "25%" :
                            currentOrder.status === "Quality Check" ? "45%" : "70%",
                      top: currentOrder.status === "Placed" ? "30%" :
                           currentOrder.status === "Chef Preparing" ? "40%" :
                           currentOrder.status === "Quality Check" ? "35%" : "25%"
                    }}
                  >
                    <div className="rounded-none bg-[#D4AF37] p-2 text-black shadow-lg border border-black animate-pulse">
                      <Truck className="h-4 w-4" />
                    </div>
                    <span className="text-[9px] font-bold text-black bg-[#D4AF37] px-1.5 py-0.5 rounded-none mt-1 font-mono uppercase tracking-wider">Rider</span>
                  </div>

                  {/* Pin: Destination Address */}
                  <div className="absolute right-[15%] top-[20%] flex flex-col items-center">
                    <div className="rounded-none bg-emerald-600/20 p-1.5 text-emerald-400 border border-emerald-500/30 shadow-md">
                      <MapPin className="h-3 w-3" />
                    </div>
                    <span className="text-[9px] font-bold text-emerald-400 bg-black px-1.5 py-0.5 rounded-none mt-1 border border-white/10">Your Place</span>
                  </div>
                </div>

                {/* Rider Info Card */}
                <div className="flex items-center justify-between rounded-none bg-[#121212] p-3 border border-white/10">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-9 w-9 rounded-none bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center font-bold text-[#D4AF37] text-xs shadow-sm">
                      M
                    </div>
                    <div>
                      <h5 className="text-xs font-serif font-semibold text-white">Mukesh Kumar</h5>
                      <p className="text-[10px] text-gray-500">Pure Ghee Delivery Expert • Rating: 4.9</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert("Connecting with rider via proxy: +91 9988776655. Satvik food is secure.")}
                    className="flex items-center space-x-1 rounded-none bg-transparent border border-white/10 px-3 py-1.5 text-[11px] font-bold text-[#D4AF37] hover:bg-white/5 transition-colors uppercase tracking-wider"
                  >
                    <Phone className="h-3 w-3 text-[#D4AF37]" />
                    <span>Call Courier</span>
                  </button>
                </div>
              </div>
            )}

            {/* Receipt Breakdown Card */}
            <div className="rounded-none bg-[#1A1A1A] border border-white/10 p-6 shadow-none space-y-4">
              <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider border-b border-white/5 pb-2.5 font-serif">
                Summary Receipt Details
              </h4>
              
              <div className="space-y-3">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-gray-300">
                    <div>
                      <span className="font-serif text-white tracking-wide">{item.name}</span>
                      <span className="ml-1.5 text-[9px] text-[#D4AF37] font-bold px-1.5 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-none">x{item.quantity}</span>
                    </div>
                    <span className="font-mono">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {currentOrder.eventType && (
                <div className="rounded-none bg-[#121212] p-3.5 border border-white/10 text-[11px] space-y-1.5 text-gray-300">
                  <p><strong>Catering Setup:</strong> {currentOrder.eventType}</p>
                  <p><strong>Guest Coverage:</strong> {currentOrder.guestCount} Plates Reserved</p>
                  <p><strong>Venue Site:</strong> {currentOrder.address}</p>
                </div>
              )}

              <div className="border-t border-white/5 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#D4AF37]">₹{currentOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Ayurvedic Transport Charge</span>
                  <span className="font-mono text-[#D4AF37]">{currentOrder.deliveryCharge === 0 ? "FREE" : `₹${currentOrder.deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>GST (5%)</span>
                  <span className="font-mono text-[#D4AF37]">₹{currentOrder.tax}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-white font-serif">
                  <span>Grand Total</span>
                  <span className="text-[#D4AF37] font-mono font-bold">₹{currentOrder.total}</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Empty / Unsearched State */
          <div className="text-center py-12 rounded-none border-2 border-dashed border-white/10 bg-[#121212]">
            <Package className="h-10 w-10 text-[#D4AF37]/45 mx-auto mb-3" />
            <p className="font-serif text-white text-base">No Active Order Selected</p>
            <p className="text-xs text-gray-400 mt-1.5 max-w-sm mx-auto font-sans leading-relaxed">
              Submit your tracking code in the input above. Standard seeds like <code className="font-mono bg-[#D4AF37]/10 text-[#D4AF37] font-bold px-1.5 py-0.5 border border-[#D4AF37]/20 rounded-none">SATVIK-783612</code> can be loaded for testing.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
