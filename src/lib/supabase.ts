import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
  );
};

// Public client for client-side or anonymous requests
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server / Admin client with service role key if provided
export const supabaseAdmin: SupabaseClient | null =
  isSupabaseConfigured() && supabaseServiceKey && !supabaseServiceKey.includes('your-supabase-service-role')
    ? createClient(supabaseUrl, supabaseServiceKey)
    : supabase;

// --- Admin Authentication ---
export async function verifyAdminCredentials(email: string, pass: string): Promise<boolean> {
  const targetEmail = 'umeshbiz16@gmail.com';
  const targetPass = 'Umesh#2032';

  if (!email || !pass) return false;

  // Direct check first
  const isDirectMatch = email.trim().toLowerCase() === targetEmail.toLowerCase() && pass === targetPass;

  if (supabaseAdmin) {
    try {
      // Check admin_users table in Supabase
      const { data, error } = await supabaseAdmin
        .from('admin_users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .limit(1);

      if (!error && data && data.length > 0) {
        const adminUser = data[0];
        return adminUser.password_hash === pass || adminUser.password === pass || isDirectMatch;
      }

      // If user matched direct credentials but table doesn't have it yet, seed it into Supabase
      if (isDirectMatch) {
        await supabaseAdmin.from('admin_users').upsert({
          email: targetEmail,
          password_hash: targetPass,
          role: 'admin',
          created_at: new Date().toISOString()
        }, { onConflict: 'email' });
        return true;
      }
    } catch (err) {
      console.warn('Supabase admin_users check error, fallback to direct validation:', err);
    }
  }

  return isDirectMatch;
}

// --- Supabase Helper Methods for Menu Items ---
export async function fetchMenuItemsFromSupabase(fallbackData: any[]): Promise<any[]> {
  if (!supabase) return fallbackData;
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackData;
    }
    return data;
  } catch (err) {
    console.warn('Supabase connection error for menu_items, using local fallback:', err);
    return fallbackData;
  }
}

export async function fetchKiloDishesFromSupabase(fallbackData: any[]): Promise<any[]> {
  if (!supabase) return fallbackData;
  try {
    const { data, error } = await supabase
      .from('kilo_dishes')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackData;
    }
    return data;
  } catch (err) {
    return fallbackData;
  }
}

export async function insertMenuItemToSupabase(item: any): Promise<{ data: any; error: any }> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    return { data: item, error: null };
  }
  try {
    const { data, error } = await client
      .from('menu_items')
      .insert([item])
      .select()
      .single();
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateMenuItemInSupabase(id: string, updates: any): Promise<{ data: any; error: any }> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    return { data: updates, error: null };
  }
  try {
    const { data, error } = await client
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function deleteMenuItemFromSupabase(id: string): Promise<{ success: boolean; error: any }> {
  const client = supabaseAdmin || supabase;
  if (!client) {
    return { success: true, error: null };
  }
  try {
    const { error } = await client
      .from('menu_items')
      .delete()
      .eq('id', id);
    return { success: !error, error };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

export async function saveOrderToSupabase(order: any): Promise<boolean> {
  if (!supabaseAdmin && !supabase) return false;
  try {
    const client = supabaseAdmin || supabase;
    const { error } = await client!
      .from('orders')
      .insert([
        {
          id: order.id,
          customer_name: order.customerName,
          email: order.email,
          phone: order.phone,
          address: order.address,
          items: order.items,
          subtotal: order.subtotal,
          delivery_charge: order.deliveryCharge,
          tax: order.tax,
          total: order.total,
          status: order.status,
          payment_method: order.paymentMethod,
          payment_status: order.paymentStatus,
          transaction_id: order.transactionId,
          event_type: order.eventType,
          guest_count: order.guestCount,
          special_instructions: order.specialInstructions,
          created_at: new Date(order.createdAt).toISOString()
        }
      ]);

    if (error) {
      console.warn('Failed to insert order into Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error saving order to Supabase:', err);
    return false;
  }
}

export async function fetchOrderByIdFromSupabase(orderId: string): Promise<any | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      customerName: data.customer_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      items: data.items,
      subtotal: data.subtotal,
      deliveryCharge: data.delivery_charge,
      tax: data.tax,
      total: data.total,
      status: data.status,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      transactionId: data.transaction_id,
      createdAt: new Date(data.created_at).getTime(),
      eventType: data.event_type,
      guestCount: data.guest_count,
      specialInstructions: data.special_instructions
    };
  } catch {
    return null;
  }
}
