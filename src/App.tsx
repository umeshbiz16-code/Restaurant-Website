import { useState, useEffect } from "react";
import { MenuItem, CartItem, Order } from "./types";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MenuSection from "./components/MenuSection";
import AboutSection from "./components/AboutSection";
import CartDrawer from "./components/CartDrawer";
import OrderTracker from "./components/OrderTracker";
import ChatBox from "./components/ChatBox";
import { 
  Heart, Sparkles, UtensilsCrossed, CalendarDays, ShoppingBag, 
  MapPin, CheckCircle2, ChevronRight, MessageSquare, Clock
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "menu" | "track" | "about">("home");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchedOrderId, setSearchedOrderId] = useState<string>("");

  // Fetch Menu from Express Server API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("/api/menu");
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        }
      } catch (err) {
        console.error("Failed to fetch menu from API, using static failover:", err);
      }
    };
    fetchMenu();
  }, []);

  // Load Cart from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("satvik_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save Cart to LocalStorage
  const saveCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem("satvik_cart", JSON.stringify(newCart));
  };

  // Add Item to Cart
  const handleAddToCart = (item: MenuItem) => {
    const existing = cartItems.find((ci) => ci.id === item.id);
    if (existing) {
      const updated = cartItems.map((ci) =>
        ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
      );
      saveCart(updated);
    } else {
      const updated = [...cartItems, { ...item, quantity: 1 }];
      saveCart(updated);
    }
    // Automatically open Cart Drawer when food is added
    setIsCartOpen(true);
  };

  // Trigger Catering Booking Form
  const handleBookCatering = (item: MenuItem) => {
    // For catering packages, we add the single package item to cart and open checkout immediately
    const existing = cartItems.find((ci) => ci.id === item.id);
    if (!existing) {
      const updated = [...cartItems, { ...item, quantity: 1 }];
      saveCart(updated);
    }
    setIsCartOpen(true);
  };

  // Update Cart Item Quantity
  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
    } else {
      const updated = cartItems.map((ci) =>
        ci.id === id ? { ...ci, quantity: newQty } : ci
      );
      saveCart(updated);
    }
  };

  // Remove Item from Cart
  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter((ci) => ci.id !== id);
    saveCart(updated);
  };

  // Handle successful order placements (clears basket, updates search code, focuses tracking tab)
  const handleOrderSuccess = (order: Order) => {
    saveCart([]); // Clear cart
    setSearchedOrderId(order.id); // Load ID into tracker automatically
  };

  const handleTrackOrderClick = (orderId: string) => {
    setSearchedOrderId(orderId);
    setActiveTab("track");
  };

  const handleSearchShortcut = () => {
    setActiveTab("menu");
    const searchInput = document.getElementById("menu-search-input");
    if (searchInput) searchInput.focus();
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900" id="app-root">
      
      {/* Upper announcements strip */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-amber-600 text-center py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center justify-center space-x-1">
          <Sparkles className="h-4 w-4 text-black animate-pulse" />
          <p className="text-[11px] font-bold text-black uppercase tracking-wider">
            Om Namah Shivaya • Sourcing raw, pure hand-churned A2 cow ghee for all thalis!
          </p>
        </div>
        <div className="hidden sm:block text-black/30 text-[11px] font-bold">•</div>
        <div className="flex items-center justify-center space-x-1.5">
          <Clock className="h-3.5 w-3.5 text-black" />
          <p className="text-[11px] font-bold text-black uppercase tracking-wider">
            Daily Hours: 07:00 AM – 11:00 PM
          </p>
        </div>
      </div>

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        onSearchClick={handleSearchShortcut}
      />

      {/* Main Page Layout Views */}
      <main className="flex-grow">
        {activeTab === "home" && (
          <div className="space-y-4">
            {/* Hero presentation with custom CTA routing triggers */}
            <HeroSection
              onOrderClick={() => setActiveTab("menu")}
              onCateringClick={() => setActiveTab("menu")}
            />

            {/* Premium Category Spotlights */}
            <section className="py-16 bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-2 mb-12">
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Our Sacred Culinary Specialties</h2>
                  <p className="text-sm text-gray-500">Handcrafted Ayurvedic formulations prepared fresh in clay and copper vessels.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Card 1: Main Dishes */}
                  <div className="rounded-2xl border border-orange-100 bg-amber-50/20 p-6 flex flex-col space-y-4 hover:shadow-md transition-shadow">
                    <div className="relative h-44 rounded-xl overflow-hidden bg-amber-100">
                      <img 
                        src="/src/assets/images/satvik_premium_thali_1783699387370.jpg" 
                        alt="Satvik Thali" 
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer"
                        id="specialty-img-thali"
                      />
                    </div>
                    <h3 className="font-sans font-bold text-gray-900 text-base">Royal Satvik Thalis</h3>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">
                      Taste our signature Maharaja Thali. Cooked strictly without garlic or onion, using mineral-rich saindhav salt and whole cumin.
                    </p>
                    <button 
                      onClick={() => setActiveTab("menu")}
                      className="text-xs font-bold text-orange-600 flex items-center space-x-1 hover:text-orange-700"
                    >
                      <span>Explore Thalis</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Card 2: Starters */}
                  <div className="rounded-2xl border border-orange-100 bg-amber-50/20 p-6 flex flex-col space-y-4 hover:shadow-md transition-shadow">
                    <div className="relative h-44 rounded-xl overflow-hidden bg-amber-100">
                      <img 
                        src="/src/assets/images/satvik_paneer_tikka_1783699415993.jpg" 
                        alt="Paneer Tikka" 
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer"
                        id="specialty-img-paneer"
                      />
                    </div>
                    <h3 className="font-sans font-bold text-gray-900 text-base">Stone-Grilled Appetizers</h3>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">
                      Savor marinated organic paneer tikkas, crispy pan-seared beetroot kebabs, and nutritious mung bean rolls. Perfect healthy starters.
                    </p>
                    <button 
                      onClick={() => setActiveTab("menu")}
                      className="text-xs font-bold text-orange-600 flex items-center space-x-1 hover:text-orange-700"
                    >
                      <span>Explore Starters</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Card 3: Events Catering */}
                  <div className="rounded-2xl border border-orange-100 bg-amber-50/20 p-6 flex flex-col space-y-4 hover:shadow-md transition-shadow">
                    <div className="relative h-44 rounded-xl overflow-hidden bg-amber-100">
                      <img 
                        src="/src/assets/images/indian_catering_event_1783699401228.jpg" 
                        alt="Puja Catering Buffet Setup" 
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer"
                        id="specialty-img-catering"
                      />
                    </div>
                    <h3 className="font-sans font-bold text-gray-900 text-base">Holy Satsang & Wedding Buffets</h3>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">
                      Professional luxury event catering. Beautiful flower-decorated live counters, copper chaffing arrangements, and pious hospitality.
                    </p>
                    <button 
                      onClick={() => setActiveTab("menu")}
                      className="text-xs font-bold text-orange-600 flex items-center space-x-1 hover:text-orange-700"
                    >
                      <span>Book Catering</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* About & Philosophy Segment */}
            <AboutSection />
          </div>
        )}

        {activeTab === "menu" && (
          <MenuSection
            menuItems={menuItems}
            onAddToCart={handleAddToCart}
            onBookCatering={handleBookCatering}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === "track" && (
          <OrderTracker
            searchedOrderId={searchedOrderId}
            setSearchedOrderId={setSearchedOrderId}
          />
        )}

        {activeTab === "about" && (
          <div className="space-y-4">
            <AboutSection />
            
            {/* Extended Reading: The Ayurvedic Diet Chart */}
            <section className="py-12 bg-white">
              <div className="mx-auto max-w-4xl px-4 sm:px-6">
                <div className="rounded-3xl border border-orange-100 bg-amber-50/30 p-8 space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-1.5">
                    <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                    <span>The Three Vedic Food Energies (Gunas)</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="bg-white p-5 rounded-2xl border border-emerald-100">
                      <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">1. Satvik (Pure)</span>
                      <h4 className="font-bold text-sm text-gray-900 mt-2">Purity & Clarity</h4>
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                        Fresh fruits, organic vegetables, pure dairy (ghee), grains, lentils, and rock salt. Elevates calmness, intelligence, health, and peace.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-orange-100">
                      <span className="rounded bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-800 uppercase">2. Rajsik (Active)</span>
                      <h4 className="font-bold text-sm text-gray-900 mt-2">Passion & Speed</h4>
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                        Spicy foods, hot tea, salt, and sour ingredients. Stimulates action, passion, and sensory enjoyment, but can increase restlessness.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-red-100">
                      <span className="rounded bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-800 uppercase">3. Tamsik (Heavy)</span>
                      <h4 className="font-bold text-sm text-gray-900 mt-2">Dullness & Slumber</h4>
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                        Meats, alcohol, onions, garlic, mushrooms, deep fried, and stale/frozen foods. Promotes sleep, lethargy, anxiety, and stress.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-center text-orange-700 leading-normal italic pt-4">
                    "Every meal served by Satvik Events and Caters is cooked with Satvik Guna parameters to maintain peaceful minds and vibrant spirits."
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Cart Drawer sliding panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOrderSuccess={handleOrderSuccess}
        onTrackOrderClick={handleTrackOrderClick}
      />

      {/* Floating Expandable Chat box assistant (Sita) */}
      <ChatBox />

      {/* Footer Banner */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-orange-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-900">
            
            {/* Branding col */}
            <div className="space-y-3.5">
              <h2 className="text-lg font-bold text-white flex items-center">
                Satvik <span className="text-orange-500 font-medium text-sm ml-1.5">Events & Caters</span>
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Nourishing celebrations with pure vegetarian fine dining and luxury event catering, cooked meticulously with love and ancient Vedic traditions.
              </p>
            </div>

            {/* Quick Links col */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setActiveTab("home")} className="hover:text-orange-500 transition-colors">Home Page</button></li>
                <li><button onClick={() => setActiveTab("menu")} className="hover:text-orange-500 transition-colors">Menu & Catering</button></li>
                <li><button onClick={() => setActiveTab("track")} className="hover:text-orange-500 transition-colors">Track Order Live</button></li>
                <li><button onClick={() => setActiveTab("about")} className="hover:text-orange-500 transition-colors">Our Philosophy</button></li>
              </ul>
            </div>

            {/* Cooking Guidelines col */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Our Standards</h4>
              <ul className="space-y-1.5 text-xs text-gray-500">
                <li className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />100% Pure Vegetarian</li>
                <li className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />Strictly Onion & Garlic Free</li>
                <li className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />Pure A2 Cow Ghee Preparations</li>
                <li className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />Himalayan Pink Rock Salt</li>
              </ul>
            </div>

            {/* Event Contact Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Catering & Hours</h4>
              <p className="text-xs leading-relaxed text-gray-500">
                <strong>Hours:</strong> 07:00 AM – 11:00 PM Daily<br />
                <strong>Address:</strong> 108, Sacred Lotus Marg, Sector 62, Noida, UP<br />
                <strong>Email:</strong> bookings@satvikcaters.com<br />
                <strong>Phone:</strong> +91 99887 76655
              </p>
            </div>

          </div>

          {/* Copywrite and disclaimer info */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-600 gap-4">
            <p>© 2026 Satvik Events and Caters. All Vedic Rights Reserved.</p>
            <p className="flex items-center text-orange-500">
              <Heart className="h-3 w-3 fill-orange-500 text-orange-500 mr-1 animate-pulse" />
              <span>Prepared strictly to support physical wellness and peace of mind.</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
