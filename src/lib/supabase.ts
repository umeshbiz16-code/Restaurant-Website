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
          payment_method: order.paymentMethod || 'Razorpay',
          payment_status: order.paymentStatus || 'Paid',
          gateway_mode: order.gateway_mode || order.gatewayMode || 'test',
          razorpay_order_id: order.razorpay_order_id || order.razorpayOrderId || null,
          razorpay_payment_id: order.razorpay_payment_id || order.razorpayPaymentId || order.transactionId || null,
          razorpay_signature: order.razorpay_signature || order.razorpaySignature || null,
          whatsapp_notified: order.whatsapp_notified ?? true,
          transaction_id: order.transactionId || order.razorpayPaymentId || null,
          event_type: order.eventType,
          guest_count: order.guestCount,
          special_instructions: order.specialInstructions,
          is_train_delivery: Boolean(order.isTrainDelivery || order.is_train_delivery),
          train_number: order.trainNumber || order.train_number || null,
          train_name: order.trainName || order.train_name || null,
          pnr_number: order.pnrNumber || order.pnr_number || null,
          coach_number: order.coachNumber || order.coach_number || null,
          berth_number: order.berthNumber || order.berth_number || null,
          delivery_station: order.deliveryStation || order.delivery_station || null,
          train_delivery_time: order.trainDeliveryTime || order.train_delivery_time || null,
          created_at: new Date(order.createdAt).toISOString()
        }
      ]);

    if (error) {
      console.warn('Initial insert into orders failed, trying base columns fallback:', error.message);
      const basePayload = {
        id: order.id,
        customer_name: order.customerName,
        phone: order.phone,
        email: order.email || null,
        address: order.address,
        items: order.items,
        subtotal: order.subtotal,
        delivery_charge: order.deliveryCharge || 0,
        tax: order.tax || 0,
        total: order.total,
        status: order.status || 'Placed',
        payment_method: order.paymentMethod || 'Razorpay',
        payment_status: order.paymentStatus || 'Paid',
        special_instructions: order.specialInstructions || null,
        created_at: new Date(order.createdAt || Date.now()).toISOString()
      };
      const { error: fallbackError } = await client!.from('orders').insert([basePayload]);
      if (fallbackError) {
        console.error('Base fallback insert error:', fallbackError.message);
        return false;
      }
      return true;
    }
    return true;
  } catch (err) {
    console.warn('Error saving order to Supabase:', err);
    return false;
  }
}

// ==============================================================================
// CUSTOMER SPECIAL ENQUIRIES HELPERS (/form-enquiry & /admin-enquiries)
// ==============================================================================

export async function saveEnquiryToSupabase(enquiry: any): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  if (!client) return false;
  try {
    const { error } = await client.from('enquiries').insert([
      {
        id: enquiry.id,
        customer_name: enquiry.customerName,
        phone: enquiry.phone,
        email: enquiry.email || null,
        demand_details: enquiry.demandDetails,
        dietary_preference: enquiry.dietaryPreference || 'Sattvic (No Onion-Garlic)',
        guest_count: enquiry.guestCount || 1,
        preferred_date: enquiry.preferredDate || null,
        preferred_time: enquiry.preferredTime || null,
        location: enquiry.location || null,
        preferred_contact_method: enquiry.preferredContactMethod || 'call',
        status: enquiry.status || 'Pending',
        admin_notes: enquiry.adminNotes || null,
        created_at: new Date(enquiry.createdAt || Date.now()).toISOString(),
        updated_at: new Date(enquiry.updatedAt || Date.now()).toISOString(),
      }
    ]);
    if (error) {
      console.warn('Error saving enquiry to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase saveEnquiry exception:', err);
    return false;
  }
}

export async function fetchEnquiriesFromSupabase(): Promise<any[]> {
  const client = supabaseAdmin || supabase;
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((d: any) => ({
      id: d.id,
      customerName: d.customer_name,
      phone: d.phone,
      email: d.email,
      demandDetails: d.demand_details,
      dietaryPreference: d.dietary_preference,
      guestCount: d.guest_count,
      preferredDate: d.preferred_date,
      preferredTime: d.preferred_time,
      location: d.location,
      preferredContactMethod: d.preferred_contact_method,
      status: d.status,
      adminNotes: d.admin_notes,
      createdAt: new Date(d.created_at).getTime(),
      updatedAt: new Date(d.updated_at).getTime(),
    }));
  } catch (err) {
    console.warn('Supabase fetchEnquiries exception:', err);
    return [];
  }
}

export async function updateEnquiryInSupabase(id: string, updates: any): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  if (!client) return false;
  try {
    const payload: any = {
      updated_at: new Date().toISOString()
    };
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.adminNotes !== undefined) payload.admin_notes = updates.adminNotes;

    const { error } = await client
      .from('enquiries')
      .update(payload)
      .eq('id', id);

    return !error;
  } catch (err) {
    console.warn('Supabase updateEnquiry exception:', err);
    return false;
  }
}

export async function deleteEnquiryFromSupabase(id: string): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  if (!client) return false;
  try {
    const { error } = await client.from('enquiries').delete().eq('id', id);
    return !error;
  } catch (err) {
    return false;
  }
}

// ==============================================================================
// TRAIN FOOD DELIVERY SESSIONS HELPERS (/train-food-delivery & /admin-train-orders)
// ==============================================================================

export async function saveTrainDeliveryToSupabase(record: any): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  if (!client) return false;
  try {
    const { error } = await client.from('train_deliveries').insert([
      {
        id: record.id,
        train_number: record.trainNumber,
        train_name: record.trainName || null,
        pnr_number: record.pnrNumber || null,
        coach_number: record.coachNumber,
        berth_number: record.berthNumber,
        passenger_name: record.passengerName,
        phone: record.phone,
        delivery_station: record.deliveryStation,
        delivery_date: record.deliveryDate || null,
        delivery_time: record.deliveryTime || null,
        special_notes: record.specialNotes || null,
        order_id: record.orderId || null,
        status: record.status || 'Registered',
        created_at: new Date(record.createdAt || Date.now()).toISOString(),
        updated_at: new Date(record.updatedAt || Date.now()).toISOString(),
      }
    ]);
    if (error) {
      console.warn('Error saving train delivery to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase saveTrainDelivery exception:', err);
    return false;
  }
}

export async function fetchTrainDeliveriesFromSupabase(): Promise<any[]> {
  const client = supabaseAdmin || supabase;
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('train_deliveries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((d: any) => ({
      id: d.id,
      trainNumber: d.train_number,
      trainName: d.train_name,
      pnrNumber: d.pnr_number,
      coachNumber: d.coach_number,
      berthNumber: d.berth_number,
      passengerName: d.passenger_name,
      phone: d.phone,
      deliveryStation: d.delivery_station,
      deliveryDate: d.delivery_date,
      deliveryTime: d.delivery_time,
      specialNotes: d.special_notes,
      orderId: d.order_id,
      status: d.status,
      createdAt: new Date(d.created_at).getTime(),
      updatedAt: new Date(d.updated_at).getTime(),
    }));
  } catch (err) {
    console.warn('Supabase fetchTrainDeliveries exception:', err);
    return [];
  }
}

export async function updateTrainDeliveryInSupabase(id: string, updates: any): Promise<boolean> {
  const client = supabaseAdmin || supabase;
  if (!client) return false;
  try {
    const payload: any = {
      updated_at: new Date().toISOString()
    };
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.orderId !== undefined) payload.order_id = updates.orderId;

    const { error } = await client
      .from('train_deliveries')
      .update(payload)
      .eq('id', id);

    return !error;
  } catch (err) {
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
