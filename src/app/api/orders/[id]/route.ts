import { NextResponse } from 'next/server';
import { memoryOrders, updateOrderStatus } from '@/lib/data';
import { fetchOrderByIdFromSupabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const upperId = id.toUpperCase();

  // Try querying Supabase first
  const supabaseOrder = await fetchOrderByIdFromSupabase(upperId);
  if (supabaseOrder) {
    supabaseOrder.status = updateOrderStatus(supabaseOrder);
    return NextResponse.json(supabaseOrder);
  }

  // Fallback to in-memory order store
  const order = memoryOrders.get(upperId);
  if (!order) {
    return NextResponse.json({ error: "Order not found. Please double check the ID." }, { status: 404 });
  }

  order.status = updateOrderStatus(order);
  return NextResponse.json(order);
}
