import { Sparkles, ArrowRight, ShieldCheck, Heart, Leaf } from "lucide-react";

interface HeroSectionProps {
  onOrderClick: () => void;
  onCateringClick: () => void;
}

export default function HeroSection({ onOrderClick, onCateringClick }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-[#0F0F0F] text-[#E0E0E0] py-16 md:py-24 border-b border-white/5" id="hero-section">
      {/* Decorative luxury gold/dark vector accent */}
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
      <div className="absolute left-10 bottom-10 -z-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Hero text contents */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center space-x-2 rounded-none bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/20 tracking-wider uppercase">
                <Sparkles className="h-4 w-4 text-[#D4AF37] animate-pulse" />
                <span>Sacred Ayurvedic Catering & Fine Dining</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 rounded-none bg-white/5 px-3 py-1.5 text-[10px] font-bold text-gray-300 border border-white/10 tracking-wider uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                <span>Daily Timing: 07:00 AM – 11:00 PM</span>
              </div>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-white leading-tight">
              Wholesome Food for <br className="hidden sm:inline" />
              <span className="text-[#D4AF37] italic font-serif tracking-widest block mt-2">
                Sacred Celebrations
              </span>
            </h1>

            <p className="mx-auto lg:mx-0 max-w-2xl text-xs sm:text-sm text-gray-400 leading-relaxed tracking-wide font-sans">
              Experience the sublime art of Satvik fine dining. We prepare pure, traditional Indian vegetarian cuisine cooked strictly without onion, garlic, or mushrooms. Every meal is slowly cooked using wood-churned pure A2 cow ghee, mineral-rich Himalayan rock salt, and organic ingredients, accompanied by positive mantra chanting to nurture mental clarity, health, and spiritual harmony.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOrderClick}
                className="group flex w-full sm:w-auto items-center justify-center space-x-2.5 rounded-none bg-[#D4AF37] hover:bg-[#B8962E] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-lg transition-all"
                id="hero-btn-order"
              >
                <span>Order Food Online</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={onCateringClick}
                className="flex w-full sm:w-auto items-center justify-center rounded-none border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#D4AF37]/10 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
                id="hero-btn-catering"
              >
                Book Event Catering
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 mt-8">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-3xl font-normal text-[#D4AF37]">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center mt-1 font-medium">
                  <Leaf className="h-3 w-3 text-[#D4AF37] mr-1" />
                  Jain Thali Available
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-3xl font-normal text-[#D4AF37]">A2 Ghee</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center mt-1 font-medium">
                  <ShieldCheck className="h-3 w-3 text-[#D4AF37] mr-1" />
                  Wood-Churned
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="font-serif text-3xl font-normal text-[#D4AF37]">10k+</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center mt-1 font-medium">
                  <Heart className="h-3 w-3 text-[#D4AF37] mr-1" />
                  Guests Served
                </span>
              </div>
            </div>
          </div>
          
          {/* Interactive Bento Image Display */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Image: Thali */}
              <div className="overflow-hidden rounded-none bg-[#1A1A1A] shadow-2xl border border-white/10 p-2 transform hover:scale-[1.01] transition-transform duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src="/src/assets/images/satvik_premium_thali_1783699387370.jpg"
                    alt="Maharaja Satvik Thali served on a polished brass plate"
                    className="h-72 w-full object-cover grayscale-[15%] contrast-115"
                    referrerPolicy="no-referrer"
                    id="hero-img-thali"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                </div>
                <div className="p-4 bg-[#121212] flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">Maharaja Satvik Thali</h3>
                    <p className="text-[10px] text-[#D4AF37] font-medium tracking-wide">Sacred Ayurvedic recipe</p>
                  </div>
                  <span className="rounded-none bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-3 py-1 text-xs font-bold text-[#D4AF37]">
                    ₹349
                  </span>
                </div>
              </div>

              {/* Floating Badge / Second Image Preview */}
              <div className="absolute -bottom-6 -left-6 hidden sm:block w-48 overflow-hidden rounded-none bg-[#1A1A1A] p-2 shadow-2xl border border-white/10 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/src/assets/images/satvik_paneer_tikka_1783699415993.jpg"
                  alt="Satvik Paneer Tikka skewered and grilled"
                  className="h-24 w-full object-cover rounded-none grayscale-[15%]"
                  referrerPolicy="no-referrer"
                  id="hero-img-paneer"
                />
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#D4AF37] mt-2 text-center">Herb Paneer Tikka</p>
              </div>

              {/* Floating Badge 2: Catering Preview */}
              <div className="absolute -top-6 -right-6 hidden sm:block w-48 overflow-hidden rounded-none bg-[#1A1A1A] p-2 shadow-2xl border border-white/10 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/src/assets/images/indian_catering_event_1783699401228.jpg"
                  alt="Elegant Catering Layout"
                  className="h-24 w-full object-cover rounded-none grayscale-[15%]"
                  referrerPolicy="no-referrer"
                  id="hero-img-catering"
                />
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#D4AF37] mt-2 text-center">Ritual Buffet</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
