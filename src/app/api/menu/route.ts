import { NextResponse } from 'next/server';
import { DEFAULT_MENU_ITEMS, MenuItem } from '@/lib/data';
import { fetchMenuItemsFromSupabase, insertMenuItemToSupabase } from '@/lib/supabase';

// In-memory runtime cache allowing instant updates even before Supabase table is migrated
let runtimeDishes: MenuItem[] = [...DEFAULT_MENU_ITEMS];

export async function GET() {
  try {
    const items = await fetchMenuItemsFromSupabase(runtimeDishes);
    return NextResponse.json(items);
  } catch (err: any) {
    console.error('Error fetching menu items:', err);
    return NextResponse.json(runtimeDishes);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, hindi_name, description, price, category, image, spicy, is_jain, is_chef_special } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Name, price and category are required' },
        { status: 400 }
      );
    }

    const newDish: MenuItem = {
      id: `dish_${Date.now()}`,
      name,
      description: description || 'Prepared with pure A2 cow ghee and Vedic spices.',
      price: Number(price),
      category: category || 'Mains',
      image: image || '/images/satvik_royal_thali_1783699368595.jpg',
      spicy: spicy || 'Medium',
      rating: 5.0,
      reviews: 1,
      available: true
    };

    // Save to runtime dishes
    runtimeDishes = [newDish, ...runtimeDishes];

    // Persist to Supabase menu_items table
    const { data: dbData, error: dbError } = await insertMenuItemToSupabase({
      name: newDish.name,
      hindi_name: hindi_name || null,
      description: newDish.description,
      price: newDish.price,
      category: newDish.category,
      image: newDish.image,
      spicy: newDish.spicy,
      rating: newDish.rating,
      reviews: newDish.reviews,
      is_jain: Boolean(is_jain),
      is_chef_special: Boolean(is_chef_special),
      available: true,
      created_at: new Date().toISOString()
    });

    if (dbError) {
      console.warn('Inserted to memory, Supabase note:', dbError.message);
    }

    return NextResponse.json({
      success: true,
      dish: dbData || newDish
    });
  } catch (err: any) {
    console.error('Error adding dish:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to add dish' },
      { status: 500 }
    );
  }
}
