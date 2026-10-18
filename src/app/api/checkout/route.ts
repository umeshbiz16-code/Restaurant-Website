import { NextResponse } from 'next/server';
import { memoryOrders, Order } from '@/lib/data';
import { saveOrderToSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
    } = body;

    if (!customerName || !email || !phone || !address || !items || !items.length || !paymentMethod) {
      return NextResponse.json({ error: "Missing required booking details." }, { status: 400 });
    }

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

    // Store in memory
    memoryOrders.set(orderId, newOrder);

    // Save to Supabase (if configured)
    await saveOrderToSupabase(newOrder);

    return NextResponse.json(
      {
        message: "Order placed successfully!",
        order: newOrder
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message || "Failed to process order." }, { status: 500 });
  }
}
