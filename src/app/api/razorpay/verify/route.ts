import { NextResponse } from 'next/server';
import { verifyRazorpaySignature, getRazorpaySettings } from '@/lib/razorpay';
import { saveOrderToSupabase } from '@/lib/supabase';
import { memoryOrders, Order } from '@/lib/data';
import { dispatchServerWhatsAppNotification, generateWhatsAppDirectLink } from '@/lib/whatsapp';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      customerName,
      phone,
      email,
      address,
      items,
      subtotal,
      deliveryCharge,
      tax,
      total,
      specialInstructions,
      // Train Food Delivery integration
      isTrainDelivery,
      trainNumber,
      trainName,
      pnrNumber,
      coachNumber,
      berthNumber,
      deliveryStation,
      trainDeliveryTime,
    } = body;

    // Verify signature
    const isValid = await verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Razorpay signature verification failed.' }, { status: 400 });
    }

    const settings = await getRazorpaySettings();
    const orderId = `SATVIK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      customerName: customerName || 'Valued Guest',
      phone: phone || '',
      email: email || '',
      address: address || '',
      items: items || [],
      subtotal: Number(subtotal) || 0,
      deliveryCharge: Number(deliveryCharge) || 0,
      tax: Number(tax) || 0,
      total: Number(total) || 0,
      status: 'Placed',
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      transactionId: razorpayPaymentId || `TXN-${Date.now()}`,
      createdAt: Date.now(),
      estimatedDeliveryAt: Date.now() + 30 * 60 * 1000,
      specialInstructions: specialInstructions || '',
      isTrainDelivery: Boolean(isTrainDelivery || trainNumber),
      trainNumber: trainNumber || undefined,
      trainName: trainName || undefined,
      pnrNumber: pnrNumber || undefined,
      coachNumber: coachNumber || undefined,
      berthNumber: berthNumber || undefined,
      deliveryStation: deliveryStation || undefined,
      trainDeliveryTime: trainDeliveryTime || undefined,
    };

    // Store in memory for instant availability
    memoryOrders.set(orderId, newOrder);

    // Save to Supabase orders table with Razorpay & train delivery fields
    await saveOrderToSupabase({
      ...newOrder,
      customerName: newOrder.customerName,
      gateway_mode: settings.mode,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      whatsapp_notified: true,
      is_train_delivery: newOrder.isTrainDelivery,
      train_number: newOrder.trainNumber,
      train_name: newOrder.trainName,
      pnr_number: newOrder.pnrNumber,
      coach_number: newOrder.coachNumber,
      berth_number: newOrder.berthNumber,
      delivery_station: newOrder.deliveryStation,
      train_delivery_time: newOrder.trainDeliveryTime,
    });

    // WhatsApp Notification Payload
    const notificationPayload = {
      orderId,
      customerName: newOrder.customerName,
      phone: newOrder.phone,
      address: newOrder.address,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      deliveryCharge: newOrder.deliveryCharge,
      tax: newOrder.tax,
      total: newOrder.total,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      gatewayMode: settings.mode,
      razorpayPaymentId: razorpayPaymentId,
      specialInstructions: newOrder.specialInstructions,
      createdAt: newOrder.createdAt,
      isTrainDelivery: newOrder.isTrainDelivery,
      trainNumber: newOrder.trainNumber,
      trainName: newOrder.trainName,
      pnrNumber: newOrder.pnrNumber,
      coachNumber: newOrder.coachNumber,
      berthNumber: newOrder.berthNumber,
      deliveryStation: newOrder.deliveryStation,
      trainDeliveryTime: newOrder.trainDeliveryTime,
    };

    // Dispatch WhatsApp server notification & generate direct link for customer/admin
    const whatsappResult = await dispatchServerWhatsAppNotification(notificationPayload);
    const directLink = whatsappResult.link || generateWhatsAppDirectLink(notificationPayload);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order placed successfully!',
      order: newOrder,
      whatsappNotification: {
        sent: true,
        targetNumber: settings.notificationWhatsapp || '9981508165',
        link: directLink,
      }
    }, { status: 201 });
  } catch (err: any) {
    console.error('Error verifying Razorpay payment:', err);
    return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 500 });
  }
}
