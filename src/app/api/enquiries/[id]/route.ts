import { NextResponse } from 'next/server';
import { memoryEnquiries } from '@/lib/data';
import { updateEnquiryInSupabase, deleteEnquiryFromSupabase } from '@/lib/supabase';

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  try {
    const body = await req.json();
    const { status, adminNotes } = body;

    // Update memory
    const existing = memoryEnquiries.get(id);
    if (existing) {
      if (status !== undefined) existing.status = status;
      if (adminNotes !== undefined) existing.adminNotes = adminNotes;
      existing.updatedAt = Date.now();
      memoryEnquiries.set(id, existing);
    }

    // Update Supabase
    await updateEnquiryInSupabase(id, { status, adminNotes });

    return NextResponse.json({ success: true, message: 'Enquiry updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update enquiry' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  try {
    memoryEnquiries.delete(id);
    await deleteEnquiryFromSupabase(id);
    return NextResponse.json({ success: true, message: 'Enquiry deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete enquiry' }, { status: 500 });
  }
}
