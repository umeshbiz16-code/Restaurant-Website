import { NextResponse } from 'next/server';
import { DEFAULT_KILO_DISHES } from '@/lib/data';
import { fetchKiloDishesFromSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const dishes = await fetchKiloDishesFromSupabase(DEFAULT_KILO_DISHES);
    return NextResponse.json(dishes);
  } catch (err: any) {
    console.error('Error fetching kilo dishes:', err);
    return NextResponse.json(DEFAULT_KILO_DISHES);
  }
}
