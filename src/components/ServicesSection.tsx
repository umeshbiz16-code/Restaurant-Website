'use client';

import React, { useState } from 'react';
import { 
  Utensils, Sparkles, Music, PartyPopper, Gift, Cake, Home, Trophy, 
  GraduationCap, Box, Coffee, Building2, Presentation, DoorOpen, Users, Train, Phone, CheckCircle 
} from 'lucide-react';

export const IRCTC_DATA = [
  {
    id: "irctc_service",
    number: 1,
    title: "IRCTC Train Food Service",
    category: "IRCTC",
    image: "/images/satvik_royal_thali_1783699368595.jpg",
    price: "Authorise vendor of IRCTC",
    description: "Official Authorised Vendor of IRCTC delivering fresh, piping-hot, 100% pure Satvik & Shuddh Jain meals directly to passenger berths across Bhopal Main Station, Rani Kamlapati Station, and Sant Hirdaram Station.",
    highlights: ["Authorise vendor of IRCTC", "Bhopal Main Station (BPL)", "Rani Kamlapati Station (RKMP)", "Sant Hirdaram Station (SHRN)"],
    stations: ["Bhopal Main Station", "Rani Kamlapati Station", "Sant Hirdaram Station"]
  }
];

export const STATIONS_INFO = [
  {
    name: "Bhopal Main Station",
    code: "BPL",
    description: "Centrally connected major railway junction. Direct platform delivery to all incoming & outgoing express trains.",
    platforms: "Platforms 1 to 6",
    deliveryInfo: "Hot Thalis & Food by Kilo delivered directly to your Train Coach and Berth number.",
    popularTrains: "Bhopal Express, Grand Trunk Express, Tamil Nadu Express, Malwa Express"
  },
  {
    name: "Rani Kamlapati Station",
    code: "RKMP",
    description: "India's first ultra-modern world-class railway station. Seamless berth delivery for premium high-speed trains.",
    platforms: "Platforms 1 to 5",
    deliveryInfo: "Dedicated onboard delivery staff for Vande Bharat, Shatabdi, Rajdhani & Superfast Express.",
    popularTrains: "Vande Bharat Express, Shatabdi Express, Rewanchal Express, Kamlapati Intercity"
  },
  {
    name: "Sant Hirdaram Station",
    code: "SHRN",
    description: "Key western railway junction serving Bhopal satellite zone and suburban express passenger routes.",
    platforms: "Platforms 1 to 3",
    deliveryInfo: "Fresh pure Satvik lunch & dinner packets delivered at your train stop on arrival.",
    popularTrains: "Somnath Express, Ujjain Passenger, Indore Intercity, Narmada Express"
  }
];

export const EVENT_SERVICES = [
  {
    id: "ev1",
    number: 1,
    title: "Catering Service for any occasion",
    category: "EVENT",
    image: "/images/indian_catering_event_1783699401228.jpg",
    description: "Pure Satvik gourmet buffet catering for weddings, pujas, anniversaries, housewarmings, and grand family celebrations.",
    highlights: ["Custom Menu Selection", "Live Copper Chaffing Display", "Uniformed Hospitality Staff"]
  },
  {
    id: "ev2",
    number: 2,
    title: "Decorations",
    category: "EVENT",
    image: "/images/event_decorations.jpg",
    description: "Theme-based floral decor, traditional mandap setups, royal entrance arches, and atmospheric lighting.",
    highlights: ["Fresh Marigold & Orchid Themes", "Eco-friendly Setups", "Stage & Photo Booth Design"]
  },
  {
    id: "ev3",
    number: 3,
    title: "Live food Counter",
    category: "EVENT",
    image: "/images/live_food_counter.jpg",
    description: "Interactive live cooking stations featuring hot Dosas, Moong Dal Chillas, Tandoori Snacks, Chaat Counters, and Jalebi Rabdi.",
    highlights: ["Cooked Fresh On-spot", "Hygienic Live Stalls", "Custom Spice Levels"]
  },
  {
    id: "ev4",
    number: 4,
    title: "DJ or Live Music",
    category: "EVENT",
    image: "/images/dj_music.jpg",
    description: "High-energy DJ setups with sound systems & dance floors or soulful live Bhajan, Ghazal, and instrumental performances.",
    highlights: ["Professional Sound & Lights", "Curated Playlists", "Live Singer & Musicians"]
  },
  {
    id: "ev5",
    number: 5,
    title: "Cocktail Party",
    category: "EVENT",
    image: "/images/mocktail_party.jpg",
    description: "Elegant mocktail bars, artisanal fruit punch stations, finger bites, and chic lounge styling for pre-wedding and evening bashes.",
    highlights: ["Exotic Satvik Mocktails", "Pass-around Finger Foods", "Ambient Bar Counter"]
  },
  {
    id: "ev6",
    number: 6,
    title: "Surprise Party",
    category: "EVENT",
    image: "/images/surprise_party.jpg",
    description: "End-to-end secret planning, midnight countdown setups, custom flash mobs, confetti drops, and memorable reveal moments.",
    highlights: ["Secret Execution Planning", "Personalized Banners & Balloons", "Photographer Coverage"]
  },
  {
    id: "ev7",
    number: 7,
    title: "Birthday Party",
    category: "EVENT",
    image: "/images/birthday_party.jpg",
    description: "Fun-filled birthday celebrations for kids and adults with games, balloon arches, return gifts, and customized dining.",
    highlights: ["Theme Party Props", "Anchor & Game Host", "Kid-friendly Snack Boxes"]
  },
  {
    id: "ev8",
    number: 8,
    title: "Customized Cake",
    category: "EVENT",
    image: "/images/customized_cake.jpg",
    description: "Pure eggless, artisanal 3D fondant, cream, and tier cakes crafted in your chosen flavor, design, and personalized theme.",
    highlights: ["100% Pure Eggless", "Designer 3D Shapes", "Organic Sugar Options"]
  },
  {
    id: "ev9",
    number: 9,
    title: "In House Party",
    category: "EVENT",
    image: "/images/inhouse_party.jpg",
    description: "Hassle-free cozy home gathering setups including home dining table styling, private chef service, and complete clean-up.",
    highlights: ["Private Chef At Home", "Compact Buffet Setup", "Post-event Cleaning Included"]
  },
  {
    id: "ev10",
    number: 10,
    title: "Sports Meet Catering",
    category: "EVENT",
    image: "/images/sports_meets.jpg",
    description: "Hydration stations, electrolyte fresh juice booths, high-protein satvik meal boxes, and quick-refuel snacks for athletic days.",
    highlights: ["Hydration & Juice Bars", "Energy Salad Boxes", "Sprouts & Coconut Water Stalls"]
  }
];

export const CORPORATE_SERVICES = [
  {
    id: "corp1",
    number: 1,
    title: "Annual Training Catering",
    category: "CORPORATE MEETS",
    image: "/images/training_catering.jpg",
    description: "Full-day catering package for corporate onboarding, seminars, and multi-day retreats with breakfast, lunch, and tea breaks.",
    highlights: ["Custom Timed Meal Servings", "Energy Boosting Menus", "Zero Lethargy Formulation"]
  },
  {
    id: "corp2",
    number: 2,
    title: "Packed Lunch Boxes",
    category: "CORPORATE MEETS",
    image: "/images/lunch_packs.jpg",
    description: "Hygienically heat-sealed eco-friendly bento meal packs with balanced rotis, paneer sabzi, dal, fragrant rice, salad, and sweet.",
    highlights: ["Eco Bento Packaging", "Custom Dietary Labels", "On-time Office Despatch"]
  },
  {
    id: "corp3",
    number: 3,
    title: "High Tea Setup",
    category: "CORPORATE MEETS",
    image: "/images/high_tea.jpg",
    description: "Artisanal masala chai counters, herbal infusions, premium filter coffee accompanied by freshly made samosas, kachoris, and cookies.",
    highlights: ["Live Chai & Coffee Barista", "Traditional Hot Savories", "Assorted Vedic Herbal Teas"]
  },
  {
    id: "corp4",
    number: 4,
    title: "Breakfast Buffet",
    category: "CORPORATE MEETS",
    image: "/images/breakfast_buffet.jpg",
    description: "Hot steaming idlis, medu vadas, poha, sabudana khichdi, fresh cut seasonal fruits, and warm milk counters to kickstart corporate mornings.",
    highlights: ["Live Steaming Counters", "Fresh Coconut Chutneys", "Sugar-free Options"]
  },
  {
    id: "corp5",
    number: 5,
    title: "Corporate Dinner Gala",
    category: "CORPORATE MEETS",
    image: "/images/corporate_dinner.jpg",
    description: "Upscale 5-course Satvik sit-down or buffet banquets for client felicitation dinners, annual days, and shareholder gatherings.",
    highlights: ["White Glove Service", "Curated Royal Thali Experience", "Custom Branding Setups"]
  },
  {
    id: "corp6",
    number: 6,
    title: "Corporate Brunch",
    category: "CORPORATE MEETS",
    image: "/images/corporate_brunch.jpg",
    description: "Mid-morning combination of breakfast favorites (poha, idli, chilla) and light lunch items for weekend corporate retreats.",
    highlights: ["Fresh Fruit Juices", "Poha, Upma & Idli Counter", "Pre-packed Box Option"]
  },
  {
    id: "corp7",
    number: 7,
    title: "Space for Meeting",
    category: "CORPORATE MEETS",
    image: "/images/meeting_spaces.jpg",
    description: "Flexible indoor and outdoor event venues fully equipped for corporate strategy meets, board sessions, and dinners.",
    highlights: ["Prime City Locations", "High-speed Wi-Fi & AV Setup", "Integrated Catering Included"]
  },
  {
    id: "corp8",
    number: 8,
    title: "Auditorium",
    category: "CORPORATE MEETS",
    image: "/images/auditorium.jpg",
    description: "Large capacity auditorium spaces with tiered seating, stage lighting, acoustics, projector screens, and foyer dining.",
    highlights: ["Acoustic Sound & Projection", "200+ Seating Capacity", "Dedicated Foyer Buffet Area"]
  },
  {
    id: "corp9",
    number: 9,
    title: "Conference Hall",
    category: "CORPORATE MEETS",
    image: "/images/conference_hall.jpg",
    description: "Air-conditioned conference halls with U-shape or classroom seating, podiums, microphones, and continuous tea service.",
    highlights: ["Ergonomic Seating", "Podium & Cordless Mics", "Butler Service On Demand"]
  },
  {
    id: "corp10",
    number: 10,
    title: "Training Classroom",
    category: "CORPORATE MEETS",
    image: "/images/training_classroom.jpg",
    description: "Equipped classroom setups with whiteboards, AV equipment, writing desks, and session break refreshments.",
    highlights: ["Whiteboard & Smart TV", "Flexible Desk Layout", "Workshops & Skill Seminars"]
  }
];

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState<"EVENT" | "CORPORATE MEETS" | "IRCTC">("EVENT");
  const [selectedStation, setSelectedStation] = useState<string>("Bhopal Main Station");

  const currentStationInfo = STATIONS_INFO.find((s) => s.name === selectedStation) || STATIONS_INFO[0];

  return (
    <section className="py-12 bg-white text-gray-900 min-h-[85vh] dark:bg-stone-950 dark:text-stone-100" id="services-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full bg-amber-50 border border-amber-200/90 px-4 py-1 text-xs uppercase tracking-widest font-bold text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-300">
            <Utensils className="h-4 w-4 text-[#B8860B]" />
            <span>Grand Celebrations • Corporate • Railway Dining</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-gray-950 tracking-wide dark:text-white">
            Our <span className="text-[#B8860B] italic font-serif">Services</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed dark:text-stone-400">
            From divine wedding feasts and corporate conference catering to authorized IRCTC berth food deliveries, we bring pristine hospitality everywhere.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center border-b border-stone-200 dark:border-stone-800 pb-4">
          <div className="inline-flex rounded-none p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setActiveTab("EVENT")}
              className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "EVENT"
                  ? "bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black shadow-md font-mono"
                  : "text-gray-700 hover:text-black dark:text-stone-400 dark:hover:text-white"
              }`}
            >
              Event Services (10)
            </button>
            <button
              onClick={() => setActiveTab("CORPORATE MEETS")}
              className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "CORPORATE MEETS"
                  ? "bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black shadow-md font-mono"
                  : "text-gray-700 hover:text-black dark:text-stone-400 dark:hover:text-white"
              }`}
            >
              Corporate Meets (10)
            </button>
            <button
              onClick={() => setActiveTab("IRCTC")}
              className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "IRCTC"
                  ? "bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black shadow-md font-mono"
                  : "text-gray-700 hover:text-black dark:text-stone-400 dark:hover:text-white"
              }`}
            >
              <Train className="h-3.5 w-3.5 text-[#B8860B]" />
              <span>IRCTC Train Delivery</span>
            </button>
          </div>
        </div>

        {/* IRCTC SPECIAL VIEW */}
        {activeTab === "IRCTC" && (
          <div className="space-y-8 animate-fade-in">
            {/* Banner */}
            <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 dark:from-stone-900 dark:to-stone-900 dark:border-amber-900/60 rounded-none flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 text-xs font-bold uppercase font-mono">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Official Authorised Vendor of IRCTC</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-950 dark:text-white">
                  Piping-Hot Satvik & Jain Meals Delivered Directly to Your Train Berth
                </h3>
                <p className="text-xs text-gray-600 dark:text-stone-300 max-w-2xl">
                  Order fresh Maharaja Thalis, Jain Thalis, and snacks delivered to your coach seat across 3 major Bhopal stations.
                </p>
              </div>

              <a
                href="tel:+919981508165"
                className="flex items-center space-x-2 bg-gradient-to-r from-[#D4AF37] to-amber-600 hover:from-[#C59B27] hover:to-amber-700 text-black font-bold text-xs uppercase tracking-wider px-6 py-3.5 shadow-md transition flex-shrink-0"
              >
                <Phone className="h-4 w-4" />
                <span>Call Station Delivery: +91 9981508165</span>
              </a>
            </div>

            {/* Stations Selection */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-stone-300 font-mono">
                Select Your Railway Station in Bhopal:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STATIONS_INFO.map((st) => (
                  <button
                    key={st.code}
                    onClick={() => setSelectedStation(st.name)}
                    className={`p-5 text-left border transition cursor-pointer flex flex-col justify-between ${
                      selectedStation === st.name
                        ? "bg-amber-50 border-[#B8860B] shadow-md dark:bg-stone-900 dark:border-[#B8860B]"
                        : "bg-white border-stone-200 hover:bg-stone-50 dark:bg-stone-900 dark:border-stone-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-300 px-2 py-0.5">
                          {st.code}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">{st.platforms}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-gray-950 dark:text-white mt-2">
                        {st.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-stone-400 mt-1 leading-relaxed">
                        {st.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 text-[11px] text-[#B8860B] font-semibold">
                      Trains: {st.popularTrains}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Station Details Card */}
            <div className="p-6 bg-stone-50 border border-stone-200 dark:bg-stone-900 dark:border-stone-800 space-y-3">
              <h4 className="font-serif font-bold text-lg text-gray-950 dark:text-white flex items-center space-x-2">
                <Train className="h-5 w-5 text-[#B8860B]" />
                <span>Station Dispatch Info: {currentStationInfo.name} ({currentStationInfo.code})</span>
              </h4>
              <p className="text-xs text-gray-700 dark:text-stone-300 leading-relaxed">
                {currentStationInfo.deliveryInfo}
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-600 dark:text-stone-400 pt-2">
                <span>• Platforms: {currentStationInfo.platforms}</span>
                <span>• Advance Booking: 30 mins prior to train arrival</span>
                <span>• Central Kitchen: Pushpa Nagar (Bhopal)</span>
              </div>
            </div>
          </div>
        )}

        {/* EVENT SERVICES GRID */}
        {activeTab === "EVENT" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {EVENT_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="group flex flex-col border border-stone-200 bg-white shadow-xs transition-all hover:border-amber-300 hover:shadow-xl dark:bg-stone-900 dark:border-stone-800"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                    Service #{srv.number}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-stone-400 leading-relaxed flex-1">
                    {srv.description}
                  </p>

                  <div className="space-y-1 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                    {srv.highlights.map((h, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-gray-700 dark:text-stone-300">
                        <CheckCircle className="h-3 w-3 text-[#B8860B] flex-shrink-0" />
                        <span className="text-[11px]">{h}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="tel:+919981508165"
                    className="block text-center bg-stone-100 hover:bg-amber-100 text-[#B8860B] font-bold text-xs uppercase tracking-wider py-2 transition mt-2 dark:bg-stone-800 dark:hover:bg-amber-950/60"
                  >
                    Inquire Event Service
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CORPORATE MEETS GRID */}
        {activeTab === "CORPORATE MEETS" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {CORPORATE_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="group flex flex-col border border-stone-200 bg-white shadow-xs transition-all hover:border-amber-300 hover:shadow-xl dark:bg-stone-900 dark:border-stone-800"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                    Package #{srv.number}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-stone-400 leading-relaxed flex-1">
                    {srv.description}
                  </p>

                  <div className="space-y-1 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                    {srv.highlights.map((h, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-gray-700 dark:text-stone-300">
                        <CheckCircle className="h-3 w-3 text-[#B8860B] flex-shrink-0" />
                        <span className="text-[11px]">{h}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="tel:+919981508165"
                    className="block text-center bg-stone-100 hover:bg-amber-100 text-[#B8860B] font-bold text-xs uppercase tracking-wider py-2 transition mt-2 dark:bg-stone-800 dark:hover:bg-amber-950/60"
                  >
                    Book Corporate Meet
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
