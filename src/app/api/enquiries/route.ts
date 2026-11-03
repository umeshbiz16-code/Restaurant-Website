import { NextResponse } from 'next/server';
import { memoryEnquiries, Enquiry } from '@/lib/data';
import { saveEnquiryToSupabase, fetchEnquiriesFromSupabase } from '@/lib/supabase';

// GET all enquiries (for admin preview)
export async function GET() {
  try {
    const supabaseEnquiries = await fetchEnquiriesFromSupabase();
    if (supabaseEnquiries && supabaseEnquiries.length > 0) {
      return NextResponse.json(supabaseEnquiries);
    }

    // Fallback to in-memory enquiries
    const runtimeList = Array.from(memoryEnquiries.values()).sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );
    return NextResponse.json(runtimeList);
  } catch (err: any) {
    console.error('Failed to get enquiries:', err);
    return NextResponse.json(Array.from(memoryEnquiries.values()));
  }
}

// POST new customer special order enquiry
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      email,
      demandDetails,
      dietaryPreference,
      guestCount,
      preferredDate,
      preferredTime,
      location,
      preferredContactMethod,
    } = body;

    if (!customerName || !phone || !demandDetails) {
      return NextResponse.json(
        { error: 'Customer Name, Contact Phone, and Specific Food Demand Details are required.' },
        { status: 400 }
      );
    }

    const enquiryId = `ENQ-${Math.floor(100000 + Math.random() * 900000)}`;

    const newEnquiry: Enquiry = {
      id: enquiryId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      demandDetails: demandDetails.trim(),
      dietaryPreference: dietaryPreference || 'Sattvic (No Onion-Garlic)',
      guestCount: Number(guestCount) || 1,
      preferredDate: preferredDate || undefined,
      preferredTime: preferredTime || undefined,
      location: location ? location.trim() : undefined,
      preferredContactMethod: preferredContactMethod || 'call',
      status: 'Pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Store in memory
    memoryEnquiries.set(enquiryId, newEnquiry);

    // Persist to Supabase
    await saveEnquiryToSupabase(newEnquiry);

    return NextResponse.json(
      {
        success: true,
        message: 'Your special order inquiry has been received! Our kitchen admin team will call or email you shortly.',
        enquiry: newEnquiry,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error creating enquiry:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
