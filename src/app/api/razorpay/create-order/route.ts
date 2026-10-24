import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, customerName, phone, address, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid order amount is required.' }, { status: 400 });
    }

    const receiptId = `rcpt_${Date.now().toString().slice(-8)}`;

    const orderResult = await createRazorpayOrder(Number(amount), receiptId, {
      customerName: customerName || '',
      phone: phone || '',
      address: address || '',
      notes: notes || '',
    });

    if (!orderResult.success) {
      return NextResponse.json({ error: orderResult.error || 'Failed to create Razorpay order' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: orderResult.orderId,
      amount: orderResult.amount,
      currency: orderResult.currency,
      keyId: orderResult.keyId,
      mode: orderResult.mode,
    });
  } catch (err: any) {
    console.error('Error in razorpay create-order route:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
