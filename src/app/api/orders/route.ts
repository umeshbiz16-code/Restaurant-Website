import { NextResponse } from 'next/server';
import { memoryOrders, updateOrderStatus } from '@/lib/data';
import { supabaseAdmin, supabase } from '@/lib/supabase';

export async function GET() {
  const client = supabaseAdmin || supabase;
  if (client) {
    try {
      const { data } = await client
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
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
          paymentMethod: d.payment_method,
          paymentStatus: d.payment_status,
          transactionId: d.transaction_id,
          createdAt: new Date(d.created_at).getTime(),
          eventType: d.event_type,
          guestCount: d.guest_count,
        }));
        return NextResponse.json(mapped);
      }
    } catch {
      // Fallback
    }
  }

  const allOrders = Array.from(memoryOrders.values()).map(order => {
    order.status = updateOrderStatus(order);
    return order;
  });
  return NextResponse.json(allOrders);
}
