import { NextResponse } from 'next/server';
import { memoryTrainDeliveries } from '@/lib/data';
import { updateTrainDeliveryInSupabase } from '@/lib/supabase';

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  try {
    const body = await req.json();
    const { status, orderId } = body;

    const existing = memoryTrainDeliveries.get(id);
    if (existing) {
      if (status !== undefined) existing.status = status;
      if (orderId !== undefined) existing.orderId = orderId;
      existing.updatedAt = Date.now();
      memoryTrainDeliveries.set(id, existing);
    }

    await updateTrainDeliveryInSupabase(id, { status, orderId });

    return NextResponse.json({ success: true, message: 'Train delivery record updated' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update record' }, { status: 500 });
  }
}
