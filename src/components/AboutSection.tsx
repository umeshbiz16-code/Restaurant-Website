import { Leaf, Flame, Shield, Heart, Sparkles } from "lucide-react";

export default function AboutSection() {
  const principles = [
    {
      icon: <Leaf className="h-5 w-5 text-[#D4AF37]" />,
      title: "Prana-Rich Ingredients",
      description: "We pick only the freshest, locally sourced, seasonal organic produce. Old, processed, or frozen ingredients are never permitted in our kitchen."
    },
    {
      icon: <Flame className="h-5 w-5 text-[#D4AF37]" />,
      title: "Pure A2 Cow Ghee",
      description: "We slow-cook our dishes using premium, organic wood-churned A2 cow ghee to boost digestive fire (Agni) and maximize nutrient absorption."
    },
    {
      icon: <Shield className="h-5 w-5 text-[#D4AF37]" />,
      title: "Jain Thali Available",
      description: "Our recipes offer dedicated Shuddh Jain and Satvik options prepared strictly according to Ahimsa and spiritual culinary standards without root vegetables."
    },
    {
      icon: <Heart className="h-5 w-5 text-[#D4AF37]" />,
      title: "Positive Kitchen Vibration",
      description: "Our chefs meditate and chant positive vibrational mantras during preparation, imbuing every dish with peaceful, nourishing energy."
    }
  ];

  return (
    <section className="bg-[#121212] py-16 md:py-24 border-b border-white/5 text-[#E0E0E0]" id="about-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3.5 py-1 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ayurvedic Wisdom</span>
          </div>
          <h2 className="font-serif text-3xl font-normal tracking-wide text-white sm:text-4xl">
            What Makes Food <span className="text-[#D4AF37] italic">"Satvik"</span>?
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
            In Ayurvedic philosophy, food is divided into three gunas: Satvik, Rajsik, and Tamsik. 
            Satvik food represents purity, truth, harmony, and mental clarity. It is easily digestible, 
            energizes the body, and creates serene wellness.
          </p>
        </div>

        {/* 2-Column Brand Showcase */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Bullet Points */}
          <div className="space-y-8">
            <h3 className="font-serif text-2xl font-normal text-white tracking-wide">
              Honoring Ancient Indian Culinary Secrets
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              At Satvik Events and Caters, we don't just cook—we perform a culinary ritual. 
              Whether it is a fast-paced delivery order or a grand wedding buffet with 500 guests, 
              we stick to strict guidelines of hygiene, timing, and positive aura.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {principles.map((p, idx) => (
                <div key={idx} className="bg-[#1A1A1A] p-5 border border-white/5 hover:border-[#D4AF37]/20 transition-all">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                    {p.icon}
                  </div>
                  <h4 className="font-serif font-medium text-[#D4AF37] text-base mb-1.5">{p.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Presentation Card */}
          <div className="relative">
            <div className="bg-[#1A1A1A] border border-white/10 p-6 shadow-2xl">
              <div className="relative h-64 overflow-hidden bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80"
                  alt="Organic herbs and Indian spices on brass table"
                  className="h-full w-full object-cover grayscale-[20%] contrast-110"
                  referrerPolicy="no-referrer"
                  id="about-img-organic"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-none bg-[#D4AF37] px-3.5 py-1 text-[10px] uppercase tracking-widest font-bold text-black shadow">
                  Aura Kitchen Certified
                </span>
              </div>
              
              <div className="mt-6 space-y-4">
                <blockquote className="border-l-2 border-[#D4AF37] pl-4 italic text-sm text-[#E0E0E0] font-serif leading-relaxed">
                  "Yatha Annam, Tatha Mannam" — As is the food, so is the mind. Eating pure food keeps the thoughts pure and peaceful.
                </blockquote>
                <div className="flex items-center space-x-3 pt-2 border-t border-white/5">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-800">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                      alt="Head Chef"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      id="about-img-chef"
                    />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-white">Acharya Shrivastav</h5>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Master Ayurvedic Culinary Director</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
