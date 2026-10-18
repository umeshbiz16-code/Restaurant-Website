import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isCloudinaryConfigured } from '@/lib/cloudinary';

export async function GET() {
  return NextResponse.json({
    bannerText: "Om Namah Shivaya • Sourcing raw, pure hand-churned A2 cow ghee for all thalis!",
    operatingHours: "07:00 AM – 11:00 PM",
    restaurantName: "Satvik Caters and Events",
    owner: "Manish Jaiswal",
    phone: "+91 9981508165",
    address: "Plot No.255, Ward No.36 SBI Staff Housing Co-operative, Pushpa Nagar, Chandbad, Bhopal (MP) - 462010",
    integrations: {
      supabase: isSupabaseConfigured(),
      cloudinary: isCloudinaryConfigured(),
    }
  });
}
