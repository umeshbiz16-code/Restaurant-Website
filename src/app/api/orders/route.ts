import { NextResponse } from 'next/server';
import { memoryOrders } from '@/lib/data';
import { supabaseAdmin, supabase } from '@/lib/supabase';

export async function GET() {
  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const { data, error } = await client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          customerName: d.customer_name,
          email: d.email,
          phone: d.phone,
          address: d.address,
          items: d.items,
          subtotal: d.subtotal,
          deliveryCharge: d.delivery_charge,
          tax: d.tax,
          total: d.total,
          status: d.status,
          paymentMethod: d.payment_method || 'Razorpay',
          paymentStatus: d.payment_status || 'Paid',
          gatewayMode: d.gateway_mode || 'test',
          razorpayOrderId: d.razorpay_order_id,
          razorpayPaymentId: d.razorpay_payment_id || d.transaction_id,
          specialInstructions: d.special_instructions,
          whatsappNotified: d.whatsapp_notified,
          transactionId: d.transaction_id || d.razorpay_payment_id,
          createdAt: new Date(d.created_at).getTime(),
          eventType: d.event_type,
          guestCount: d.guest_count,
        }));
        return NextResponse.json(mapped);
      }
    } catch (e) {
      console.warn('Supabase fetch orders error:', e);
    }
  }

  // Only return real runtime placed orders (no demo/mock seed data)
  const runtimeOrders = Array.from(memoryOrders.values());
  return NextResponse.json(runtimeOrders);
}
