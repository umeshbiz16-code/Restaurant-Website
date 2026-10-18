import { NextResponse } from 'next/server';
import { DEFAULT_MENU_ITEMS } from '@/lib/data';
import { fetchMenuItemsFromSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const items = await fetchMenuItemsFromSupabase(DEFAULT_MENU_ITEMS);
    return NextResponse.json(items);
  } catch (err: any) {
    console.error('Error fetching menu items:', err);
    return NextResponse.json(DEFAULT_MENU_ITEMS);
  }
}
