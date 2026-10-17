import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Serve static assets from public and dist folders
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.static(path.join(process.cwd(), "dist")));
app.use("/images", express.static(path.join(process.cwd(), "public", "images")));
app.use("/assets", express.static(path.join(process.cwd(), "public", "assets")));

// Initialize Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (e) {
    console.warn("Gemini client initialization error:", e);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined. AI Chat Box will run in fallback simulation mode.");
}

// In-Memory Database for Orders
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface Order {
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

const orders: Map<string, Order> = new Map();

// Helper to transition orders automatically in background
const updateOrderStatus = (order: Order): Order["status"] => {
  const elapsedSeconds = (Date.now() - order.createdAt) / 1000;
  
  if (elapsedSeconds >= 120) {
    return "Delivered";
  } else if (elapsedSeconds >= 80) {
    return "Out for Delivery";
  } else if (elapsedSeconds >= 50) {
    return "Quality Check";
  } else if (elapsedSeconds >= 20) {
    return "Chef Preparing";
  }
  return "Placed";
};

// Website Configuration Endpoint
app.get("/api/config", (req, res) => {
  res.json({
    bannerText: "Om Namah Shivaya • Sourcing raw, pure hand-churned A2 cow ghee for all thalis!",
    operatingHours: "07:00 AM – 11:00 PM",
    restaurantName: "Satvik Caters and Events",
    owner: "Manish Jaiswal",
    phone: "+91 9981508165",
    address: "Plot No.255, Ward No.36 SBI Staff Housing Co-operative, Pushpa Nagar, Chandbad, Bhopal (MP) - 462010"
  });
});

// Menu Data
const MENU_ITEMS = [
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

// Food by Kilo ("Pasand Apki") Data
const KILO_DISHES = [
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

// --- REST API ENDPOINTS ---

// Get Menu Items
app.get("/api/menu", (req, res) => {
  res.json(MENU_ITEMS);
});

// Get Food by Kilo Items
app.get("/api/kilo-dishes", (req, res) => {
  res.json(KILO_DISHES);
});

// Place a New Order & Handle Payment Simulation
app.post("/api/checkout", (req, res) => {
  const {
    customerName,
    email,
    phone,
    address,
    items,
    paymentMethod,
    cardNumber,
    upiId,
    eventType,
    guestCount,
    specialInstructions
  } = req.body;

  if (!customerName || !email || !phone || !address || !items || !items.length || !paymentMethod) {
    return res.status(400).json({ error: "Missing required booking details." });
  }

  // Calculate receipt totals
  let subtotal = 0;
  items.forEach((item: any) => {
    subtotal += item.price * (item.quantity || 1);
  });

  const isCateringOrder = items.some((item: any) => item.category === "Catering");
  if (isCateringOrder && guestCount) {
    subtotal = 0;
    items.forEach((item: any) => {
      if (item.category === "Catering") {
        subtotal += item.price * guestCount;
      } else {
        subtotal += item.price * (item.quantity || 1);
      }
    });
  }

  const deliveryCharge = isCateringOrder ? 1500 : (subtotal > 500 ? 0 : 40);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + deliveryCharge + tax;

  const orderId = "SATVIK-" + Math.floor(100000 + Math.random() * 900000);
  const transactionId = "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  const newOrder: Order = {
    id: orderId,
    customerName,
    email,
    phone,
    address,
    items,
    subtotal,
    deliveryCharge,
    tax,
    total,
    status: "Placed",
    paymentMethod,
    paymentStatus: "Paid",
    transactionId,
    createdAt: Date.now(),
    estimatedDeliveryAt: Date.now() + (isCateringOrder ? 86400000 : 25 * 60 * 1000),
    eventType,
    guestCount,
    specialInstructions
  };

  orders.set(orderId, newOrder);

  res.status(201).json({
    message: "Order placed successfully!",
    order: newOrder
  });
});

// Get Order Tracking Information
app.get("/api/orders/:id", (req, res) => {
  const id = req.params.id.toUpperCase();
  const order = orders.get(id);

  if (!order) {
    return res.status(404).json({ error: "Order not found. Please double check the ID." });
  }

  const currentStatus = updateOrderStatus(order);
  order.status = currentStatus;

  res.json(order);
});

// List all orders (for admin & tracker demo)
app.get("/api/orders", (req, res) => {
  const allOrders = Array.from(orders.values()).map(order => {
    order.status = updateOrderStatus(order);
    return order;
  });
  res.json(allOrders);
});

// Chat Bot Endpoint with Server-Side Gemini API Proxy & Smart Local Ayurvedic Responder
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const systemPrompt = `You are "Sita", the intelligent Satvik Dining and Event Coordinator for "Satvik Caters and Events".
Founder & Owner: Manish Jaiswal. Central Kitchen: Pushpa Nagar, Bhopal. Helpline: +91 9981508165.
Your tone is deeply polite, humble, welcoming, warm, and professional, reflecting Ayurvedic hospitality (Atithi Devo Bhava).
You assist customers with:
1. Understanding the Satvik philosophy (strictly pure vegetarian, Special Shuddh Jain Thali available, prepared in pure A2 ghee, no onion, no garlic).
2. Explaining the menu options (Maharaja Satvik Thali, Special Shuddh Jain Thali, Starters, Food by Kilo bulk packs, and custom wedding buffets).
3. IRCTC Train Food Delivery at Bhopal Main Station, Rani Kamlapati Station, and Sant Hirdaram Station.
4. Specifying our hours: 07:00 AM to 11:00 PM daily.
5. Helping calculate catering costs (Satsang Buffet is ₹499/plate, Royal Wedding Feast is ₹799/plate).
6. Order tracking queries.
Format responses in clear, brief markdown.`;

  if (ai) {
    try {
      const chatHistory = history ? history.map((h: any) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      })) : [];

      const contents = [
        ...chatHistory,
        { role: "user", parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      return res.json({ response: response.text });
    } catch (error) {
      console.error("Gemini API Error:", error);
    }
  }

  // Smart local Ayurvedic rule-based fallback
  const normalizedMsg = message.toLowerCase();
  let reply = "Om Shanti! Welcome to Satvik Caters and Events. I would be honored to assist you with our purely vegetarian (no onion, no garlic) culinary offerings. How may I serve you today?";

  if (normalizedMsg.includes("time") || normalizedMsg.includes("hour") || normalizedMsg.includes("open") || normalizedMsg.includes("close")) {
    reply = "Our central kitchen and dispatch services operate **daily from 07:00 AM to 11:00 PM (365 days)**. You can place orders online or call our helpline anytime during these hours!";
  } else if (normalizedMsg.includes("irctc") || normalizedMsg.includes("train") || normalizedMsg.includes("station") || normalizedMsg.includes("berth")) {
    reply = "We are an **Official Authorised Vendor of IRCTC** delivering fresh, piping-hot Satvik and Shuddh Jain meals directly to passenger berths at **Bhopal Main Station (BPL)**, **Rani Kamlapati Station (RKMP)**, and **Sant Hirdaram Station (SHRN)**! You can book train meals directly on our Services tab or call our live station counter at +91 9981508165.";
  } else if (normalizedMsg.includes("kilo") || normalizedMsg.includes("bulk") || normalizedMsg.includes("kg")) {
    reply = "We offer **Food by Kilo (Pasand Apki)** in 1kg to 5kg packs! Favorites include Shahi Paneer (₹650/kg), Satvik Panchamel Dal (₹450/kg), Golden Malpua with Rabdi (₹620/kg), and Veg Dum Biryani (₹520/kg). Head to the 'Food by Kilo' tab to customize your order!";
  } else if (normalizedMsg.includes("menu") || normalizedMsg.includes("food") || normalizedMsg.includes("dish")) {
    reply = `We offer a magnificent selection of pure Satvik delicacies:
* **Maharaja Satvik Thali** (₹349): Complete royal meal cooked in pure A2 ghee.
* **Special Shuddh Jain Thali** (₹369): 100% root-vegetable free, pure Ahimsa preparation.
* **Satvik Paneer Tikka** (₹249): Clay oven roasted in hung curd and pink rock salt.
* **Golden Malpua with Rabdi** (₹159): Divine traditional sweet.
* **Starter Menu**: 9 clay-oven and tandoor delicacies on our STARTER tab!`;
  } else if (normalizedMsg.includes("catering") || normalizedMsg.includes("event") || normalizedMsg.includes("wedding") || normalizedMsg.includes("party")) {
    reply = `We specialize in pure gourmet catering for auspicious occasions:
* **Satsang & Puja Buffet Package** (₹499 per plate): Ideal for housewarmings, bhajans, and pujas.
* **Royal Satvik Wedding Feast** (₹799 per plate): Lavish spread with live counters and copper chaffing setups.
You can explore 10 event services and 10 corporate packages in the Services tab!`;
  } else if (/\b\d+\b/.test(normalizedMsg)) {
    const match = normalizedMsg.match(/\b\d+\b/);
    const guests = parseInt(match[0]);
    if (guests >= 10) {
      reply = `Custom catering estimate for **${guests} guests**:
1. **Satsang Buffet Package** (₹499/plate): ₹${guests * 499}
2. **Royal Wedding Feast** (₹799/plate): ₹${guests * 799}
*Includes full floral buffet setup, live copper display, and hospitality staff.*`;
    }
  } else if (normalizedMsg.includes("track") || normalizedMsg.includes("order status")) {
    reply = "To track your food order live, click on the **'Track Order'** link in the navigation bar and enter your Order ID (e.g. `SATVIK-783612`) to view minute-by-minute progress from chef preparation to delivery!";
  } else if (normalizedMsg.includes("onion") || normalizedMsg.includes("garlic")) {
    reply = "Every single meal prepared by Satvik Caters and Events is **100% strictly pure vegetarian and free from onion and garlic**. We use pure A2 cow ghee, digestive cumin, ginger, and Himalayan rock salt according to sacred Ayurvedic principles.";
  }

  return res.json({ response: reply });
});

// Seed Initial Orders for instant Tracking demonstration
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

orders.set(seedOrder1.id, seedOrder1);
orders.set(seedOrder2.id, seedOrder2);

// SPA Fallback - Serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Satvik Server successfully running at http://0.0.0.0:${PORT}`);
});
