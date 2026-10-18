export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  spicy: string;
  rating: number;
  reviews: number;
  available?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface KiloDish {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  image: string;
  category: string;
  minKg: number;
  spicy: string;
  submenu?: string;
  available?: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  status: "Placed" | "Chef Preparing" | "Quality Check" | "Out for Delivery" | "Delivered";
  paymentMethod: "Card" | "UPI" | "NetBanking";
  paymentStatus: "Pending" | "Paid" | "Failed";
  transactionId?: string;
  createdAt: number;
  estimatedDeliveryAt: number;
  eventType?: string;
  guestCount?: number;
  specialInstructions?: string;
}

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: "m1",
    name: "Maharaja Satvik Thali",
    description: "A divine royal thali with Basmati cumin rice, Panchamel Dal, Shahi Paneer, seasonal dry sabji, fresh butter rotis, cucumber raita, and premium Rasgulla. Prepared in pure A2 ghee.",
    price: 349,
    category: "Mains",
    image: "/images/satvik_premium_thali_1783699387370.jpg",
    spicy: "Mild",
    rating: 4.9,
    reviews: 142
  },
  {
    id: "m_jain",
    name: "Special Shuddh Jain Thali",
    description: "Authentic Jain meal cooked strictly without root vegetables (no potato, onion, garlic, or ginger). Features Basmati Rice, Moong Dal, Shahi Paneer, Phulkas, and sweet Saffron Rasgulla.",
    price: 369,
    category: "Mains",
    image: "/images/shuddh_jain_thali_1785510029541.jpg",
    spicy: "Mild",
    rating: 5.0,
    reviews: 118
  },
  {
    id: "m2",
    name: "Satvik Paneer Tikka",
    description: "Premium fresh cottage cheese cubes marinated in a hung curd paste of Himalayan pink salt, organic turmeric, and hand-ground spices, grilled to perfection with bell peppers.",
    price: 249,
    category: "Starters",
    image: "/images/satvik_paneer_tikka_1783699415993.jpg",
    spicy: "Medium",
    rating: 4.8,
    reviews: 98
  },
  {
    id: "m3",
    name: "Crispy Beetroot Kebabs",
    description: "Hearty croquettes made of grated beetroot, sweet potato, and aromatic green herbs, pan-seared with a light sesame crust. Served with cooling mint-coconut chutney.",
    price: 189,
    category: "Starters",
    image: "/images/beetroot_kebab.jpg",
    spicy: "Mild",
    rating: 4.7,
    reviews: 76
  },
  {
    id: "m4",
    name: "Moong Dal Chilla Roll",
    description: "Thin crepes of stone-ground yellow moong dal stuffed with spiced grated paneer, fresh coriander, and steamed carrots. Light, nutritious, and incredibly wholesome.",
    price: 199,
    category: "Starters",
    image: "/images/paneer_tikka_starter.jpg",
    spicy: "Mild",
    rating: 4.6,
    reviews: 54
  },
  {
    id: "m5",
    name: "Kesar Shahi Paneer",
    description: "Tender paneer cubes simmered in a velvety sauce of pureed cashews, organic milk cream, and premium Kashmiri saffron strands. Elegant and rich without onion or garlic.",
    price: 279,
    category: "Mains",
    image: "/images/shahi_paneer.jpg",
    spicy: "Medium",
    rating: 4.9,
    reviews: 110
  },
  {
    id: "m6",
    name: "Ayurvedic Panchamel Dal",
    description: "A nourishing mixture of five high-protein lentils tempered with pure organic A2 cow ghee, cumin seeds, fresh grated ginger, and healing digestive spices.",
    price: 189,
    category: "Mains",
    image: "/images/panchamel_dal_1785510045096.jpg",
    spicy: "Mild",
    rating: 4.8,
    reviews: 87
  },
  {
    id: "m7",
    name: "Saffron Rasgulla Plate",
    description: "Soft, spongy cottage cheese balls soaked in a delicate sugar syrup infused with pure organic saffron (kesar) and crushed green cardamom pods. Served chilled.",
    price: 129,
    category: "Sweets",
    image: "/images/rasgulla.jpg",
    spicy: "Sweet",
    rating: 4.9,
    reviews: 124
  },
  {
    id: "m8",
    name: "Golden Malpua with Rabdi",
    description: "Traditional Indian sweet pancakes made with milk solids and fennel seeds, fried in pure ghee, and dipped in saffron syrup. Topped with rich, slow-simmered rabdi.",
    price: 159,
    category: "Sweets",
    image: "/images/golden_malpua_1785510059835.jpg",
    spicy: "Sweet",
    rating: 4.9,
    reviews: 95
  },
  {
    id: "cat1",
    name: "Satsang & Puja Buffet Package",
    description: "An elegant, traditional catering layout featuring a pure satvik menu with holy elements. Includes starter, primary mains, customized thali service, holy water stations, and clay-pot sweets. Minimum 30 guests.",
    price: 499,
    category: "Catering",
    image: "/images/indian_catering_event_1783699401228.jpg",
    spicy: "Customizable",
    rating: 5.0,
    reviews: 64
  },
  {
    id: "cat2",
    name: "Royal Satvik Wedding Feast",
    description: "A grand, lavish multi-course catering experience for weddings. Live counters for paper-thin dosas, stone-ground dal chilla, and hot jalebis with rabdi. 100% vegetarian, organic ingredients, cooked under ultra-sanitary conditions. Minimum 100 guests.",
    price: 799,
    category: "Catering",
    image: "/images/event_decorations.jpg",
    spicy: "Customizable",
    rating: 4.9,
    reviews: 48
  }
];

export const DEFAULT_KILO_DISHES: KiloDish[] = [
  {
    id: "k1",
    name: "Shahi Paneer (Per Kg)",
    description: "Rich cottage cheese cubes cooked in creamy cashew-tomato gravy, topped with fresh malai and saffron. 100% Pure Satvik (No Onion, No Garlic).",
    pricePerKg: 650,
    image: "/images/shahi_paneer.jpg",
    category: "Curries",
    minKg: 1,
    spicy: "Mild",
    available: true
  },
  {
    id: "k_curry2",
    name: "Kadhai Paneer (Per Kg)",
    description: "Fresh cottage cheese tossed with bell peppers and roasted coriander-cumin spices in an earthen pot. Pure Jain friendly.",
    pricePerKg: 680,
    image: "/images/shahi_paneer.jpg",
    category: "Curries",
    minKg: 1,
    spicy: "Medium",
    available: true
  },
  {
    id: "k_curry3",
    name: "Mix Vegetable Handi (Per Kg)",
    description: "Garden-fresh seasonal vegetables slow-simmered in aromatic yellow gravy with hand-ground garam masala.",
    pricePerKg: 480,
    image: "/images/event_decorations.jpg",
    category: "Curries",
    minKg: 1,
    spicy: "Mild",
    available: true
  },
  {
    id: "k_curry4",
    name: "Malai Kofta in White Gravy (Per Kg)",
    description: "Delicate paneer and mawa dumplings gently stewed in a rich, velvety white cashew and melon seed sauce.",
    pricePerKg: 690,
    image: "/images/shahi_paneer.jpg",
    category: "Curries",
    minKg: 1,
    spicy: "Mild",
    available: true
  },
  {
    id: "k2",
    name: "Satvik Panchamel Dal (Per Kg)",
    description: "Five lentil harmony slow-cooked with cumin seeds, asafoetida, aromatic herbs, and Himalayan pink rock salt.",
    pricePerKg: 450,
    image: "/images/panchamel_dal_1785510045096.jpg",
    category: "Dal",
    minKg: 1,
    spicy: "Mild",
    available: true
  },
  {
    id: "k6",
    name: "Shuddh Jain Dal Makhani (Per Kg)",
    description: "Slow-simmered black urad lentils and rajma cooked overnight with white butter and pure malai without onion or garlic.",
    pricePerKg: 480,
    image: "/images/dal_makhani.jpg",
    category: "Dal",
    minKg: 1,
    spicy: "Mild",
    available: true
  },
  {
    id: "k_dal3",
    name: "Yellow Moong Dal Tadka (Per Kg)",
    description: "Light split yellow lentils tempered in pure desi ghee with cumin, hing, green chilies, and fresh coriander.",
    pricePerKg: 380,
    image: "/images/panchamel_dal_1785510045096.jpg",
    category: "Dal",
    minKg: 1,
    spicy: "Mild",
    available: true
  },
  {
    id: "k5",
    name: "Golden Malpua with Rabdi (Per Kg)",
    description: "Traditional Rajasthani festive malpuas dipped in saffron cardamom syrup, served with thick lachhadar rabdi.",
    pricePerKg: 620,
    image: "/images/golden_malpua_1785510059835.jpg",
    category: "Sweets",
    minKg: 1,
    spicy: "Sweet",
    available: true
  },
  {
    id: "k7",
    name: "Saffron Rasgulla (Per Kg)",
    description: "Delicate spongy chenna dumplings soaked in light divine cardamom and Kashmiri saffron sugar syrup.",
    pricePerKg: 420,
    image: "/images/rasgulla.jpg",
    category: "Sweets",
    minKg: 1,
    spicy: "Sweet",
    available: true
  },
  {
    id: "k_sweet3",
    name: "Shahi Gulab Jamun (Per Kg)",
    description: "Golden fried mawa dumplings steeped in rose water and cardamom syrup. Soft and melt-in-the-mouth.",
    pricePerKg: 460,
    image: "/images/golden_malpua_1785510059835.jpg",
    category: "Sweets",
    minKg: 1,
    spicy: "Sweet",
    available: true
  },
  {
    id: "k_rice1",
    name: "Veg Pulao (Per Kg)",
    description: "Fragrant long-grain aged Basmati rice tossed with fresh green peas, diced carrots, beans, and whole aromatic spices.",
    pricePerKg: 420,
    image: "/images/dum_biryani.jpg",
    category: "Rice",
    submenu: "Veg Pulao",
    minKg: 1,
    spicy: "Mild",
    available: true
  },
  {
    id: "k_rice2",
    name: "Veg Biryani (Per Kg)",
    description: "Royal Basmati Dum Biryani layered with marinated garden vegetables, saffron milk, fresh mint leaves, and roasted cashews.",
    pricePerKg: 520,
    image: "/images/dum_biryani.jpg",
    category: "Rice",
    submenu: "Veg Biryani",
    minKg: 1,
    spicy: "Medium",
    available: true
  },
  {
    id: "k_rice3",
    name: "Jeera Rice (Per Kg)",
    description: "Fluffy steamed Basmati rice delicately tempered in desi ghee with roasted cumin seeds and fresh cilantro.",
    pricePerKg: 350,
    image: "/images/dum_biryani.jpg",
    category: "Rice",
    submenu: "Jeera Rice",
    minKg: 1,
    spicy: "Mild",
    available: true
  }
];

// Global in-memory cache for orders (survives across requests in Node runtime)
const globalOrdersMap = new Map<string, Order>();

// Seed sample orders
const seedOrder1: Order = {
  id: "SATVIK-783612",
  customerName: "Aarav Mehta",
  email: "aarav.mehta@example.com",
  phone: "9876543210",
  address: "Apartment 4B, Shanti Enclave, Bhopal",
  items: [
    { id: "m1", name: "Maharaja Satvik Thali", price: 349, quantity: 2, category: "Mains" },
    { id: "m7", name: "Saffron Rasgulla Plate", price: 129, quantity: 1, category: "Sweets" }
  ],
  subtotal: 827,
  deliveryCharge: 0,
  tax: 41,
  total: 868,
  status: "Chef Preparing",
  paymentMethod: "UPI",
  paymentStatus: "Paid",
  transactionId: "TXN-SEED9812A",
  createdAt: Date.now() - 35 * 1000,
  estimatedDeliveryAt: Date.now() + 20 * 60 * 1000,
  specialInstructions: "Please deliver near the main entrance gate."
};

const seedOrder2: Order = {
  id: "SATVIK-412953",
  customerName: "Sonia Sharma",
  email: "sonia@example.com",
  phone: "9123456789",
  address: "Villa 12, Lotus Greens, Bhopal",
  items: [
    { id: "cat1", name: "Satsang & Puja Buffet Package", price: 499, quantity: 1, category: "Catering" }
  ],
  subtotal: 14970,
  deliveryCharge: 1500,
  tax: 749,
  total: 17219,
  status: "Placed",
  paymentMethod: "Card",
  paymentStatus: "Paid",
  transactionId: "TXN-SEED2410B",
  createdAt: Date.now() - 5 * 1000,
  estimatedDeliveryAt: Date.now() + 86400 * 1000,
  eventType: "Ganesh Puja",
  guestCount: 30,
  specialInstructions: "Aesthetic traditional flower decorations needed."
};

globalOrdersMap.set(seedOrder1.id, seedOrder1);
globalOrdersMap.set(seedOrder2.id, seedOrder2);

export const memoryOrders = globalOrdersMap;

export const updateOrderStatus = (order: Order): Order["status"] => {
  const elapsedSeconds = (Date.now() - order.createdAt) / 1000;
  if (elapsedSeconds >= 120) return "Delivered";
  if (elapsedSeconds >= 80) return "Out for Delivery";
  if (elapsedSeconds >= 50) return "Quality Check";
  if (elapsedSeconds >= 20) return "Chef Preparing";
  return "Placed";
};
