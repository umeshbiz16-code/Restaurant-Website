import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "your-gemini-api-key-here" && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'satvik-nextjs-app',
        }
      }
    });
  } catch (e) {
    console.warn("Gemini client initialization error:", e);
  }
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
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
          model: "gemini-2.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          }
        });

        return NextResponse.json({ response: response.text });
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

    return NextResponse.json({ response: reply });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Failed to generate response." }, { status: 500 });
  }
}
