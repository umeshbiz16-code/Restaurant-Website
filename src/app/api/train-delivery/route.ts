import { NextResponse } from 'next/server';
import { memoryTrainDeliveries, TrainDeliveryRecord } from '@/lib/data';
import { saveTrainDeliveryToSupabase, fetchTrainDeliveriesFromSupabase } from '@/lib/supabase';

// GET all train deliveries (for admin preview)
export async function GET() {
  try {
    const supabaseRecords = await fetchTrainDeliveriesFromSupabase();
    if (supabaseRecords && supabaseRecords.length > 0) {
      return NextResponse.json(supabaseRecords);
    }

    const runtimeList = Array.from(memoryTrainDeliveries.values()).sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );
    return NextResponse.json(runtimeList);
  } catch (err: any) {
    console.error('Failed to get train deliveries:', err);
    return NextResponse.json(Array.from(memoryTrainDeliveries.values()));
  }
}

// POST new train delivery registration
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      trainNumber,
      trainName,
      pnrNumber,
      coachNumber,
      berthNumber,
      passengerName,
      phone,
      deliveryStation,
      deliveryDate,
      deliveryTime,
      specialNotes,
    } = body;

    if (!trainNumber || !coachNumber || !berthNumber || !passengerName || !phone || !deliveryStation) {
      return NextResponse.json(
        { error: 'Train Number, Coach Number, Berth Number, Passenger Name, Phone, and Delivery Station are required.' },
        { status: 400 }
      );
    }

    const deliveryId = `TRN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newRecord: TrainDeliveryRecord = {
      id: deliveryId,
      trainNumber: trainNumber.trim(),
      trainName: trainName ? trainName.trim() : undefined,
      pnrNumber: pnrNumber ? pnrNumber.trim() : undefined,
      coachNumber: coachNumber.trim().toUpperCase(),
      berthNumber: berthNumber.trim(),
      passengerName: passengerName.trim(),
      phone: phone.trim(),
      deliveryStation: deliveryStation.trim(),
      deliveryDate: deliveryDate || undefined,
      deliveryTime: deliveryTime || undefined,
      specialNotes: specialNotes ? specialNotes.trim() : undefined,
      status: 'Registered',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Save in memory
    memoryTrainDeliveries.set(deliveryId, newRecord);

    // Save to Supabase
    await saveTrainDeliveryToSupabase(newRecord);

    return NextResponse.json(
      {
        success: true,
        message: 'Train coach delivery registered successfully!',
        record: newRecord,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error registering train delivery:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to register train delivery' },
      { status: 500 }
    );
  }
}
