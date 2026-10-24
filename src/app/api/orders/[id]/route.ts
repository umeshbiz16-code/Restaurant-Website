import { NextResponse } from 'next/server';
import { memoryOrders, updateOrderStatus } from '@/lib/data';
import { fetchOrderByIdFromSupabase, supabaseAdmin, supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const upperId = id.toUpperCase();

  // Try querying Supabase first
  const supabaseOrder = await fetchOrderByIdFromSupabase(upperId);
  if (supabaseOrder) {
    return NextResponse.json(supabaseOrder);
  }

  // Fallback to in-memory order store
  const order = memoryOrders.get(upperId);
  if (!order) {
    return NextResponse.json({ error: "Order not found. Please double check the ID." }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required." }, { status: 400 });
    }

    const client = supabaseAdmin || supabase;
    if (client) {
      await client
        .from('orders')
        .update({ status })
        .eq('id', id);
    }

    const memOrder = memoryOrders.get(id);
    if (memOrder) {
      memOrder.status = status;
      memoryOrders.set(id, memOrder);
    }

    return NextResponse.json({ success: true, id, status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update order" }, { status: 500 });
  }
}
