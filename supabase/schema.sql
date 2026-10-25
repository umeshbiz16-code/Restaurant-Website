-- ==============================================================================
-- SATVIK CATERS AND EVENTS - FIXED IDEMPOTENT SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- 1. Enable UUID Extension
-- 2. Admin Authentication Table (admin_users)
-- 3. Categories Table (categories)
-- 4. Menu Items Table (menu_items)
-- 5. Razorpay Gateway Settings Table (razorpay_settings)
-- 6. Customer Orders Table (orders) with safe column migrations
-- 7. Row Level Security (RLS) Policies (with DROP POLICY IF EXISTS)
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. ADMIN USERS TABLE (Authentication for /admin, /admin-menu, /admin-order, /admin-razorpay)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed verified Admin Credentials
INSERT INTO public.admin_users (email, password_hash, role)
VALUES ('umeshbiz16@gmail.com', 'Umesh#2032', 'admin')
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash,
    updated_at = timezone('utc'::text, now());

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.categories (name, slug, description, display_order)
VALUES 
    ('Starters', 'starters', 'Clay oven tandoori kebabs and tikkas', 1),
    ('Mains', 'mains', 'Sacred curries cooked in hand-churned A2 desi ghee', 2),
    ('Sweets', 'sweets', 'Pure ghee sweets and desserts', 3),
    ('Catering', 'catering', 'Luxury wedding, satsang, and event packages', 4)
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. MENU ITEMS & DISHES TABLE (/admin-menu, /menu, /strater)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    hindi_name TEXT,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL CHECK (category IN ('Starters', 'Mains', 'Sweets', 'Catering')),
    spicy TEXT DEFAULT 'Mild' CHECK (spicy IN ('Mild', 'Medium', 'Hot')),
    rating DECIMAL(2, 1) DEFAULT 4.9,
    reviews INT DEFAULT 50,
    image TEXT NOT NULL,
    is_jain BOOLEAN DEFAULT true,
    is_chef_special BOOLEAN DEFAULT false,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items (category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items (available);

-- Seed Sample Live Dishes
INSERT INTO public.menu_items (name, hindi_name, description, price, category, spicy, rating, reviews, image, is_jain, is_chef_special)
VALUES
    ('Paneer Tikka', 'पनीर टिक्का', 'Cubes of fresh Malai cottage cheese marinated in hung curd, ajwain, and roasted Kashmiri spices, clay-oven roasted to smoky perfection.', 260.00, 'Starters', 'Medium', 4.9, 142, '/images/satvik_paneer_tikka_1783699415993.jpg', true, true),
    ('Paneer Malai Tikka', 'पनीर मलाई टिक्का', 'Tender paneer cubes infused with rich cashew-cream paste, green cardamom, and white pepper, glazed with pure desi ghee.', 275.00, 'Starters', 'Mild', 4.9, 98, '/images/shahi_paneer.jpg', true, true),
    ('Crispy Beetroot Kebab', 'चुकंदर कबाब', 'Vibrant ruby-red beetroot patties blended with crushed peanuts and rock salt, shallow-fried to a delicate crisp exterior.', 210.00, 'Starters', 'Medium', 4.8, 86, '/images/beetroot_kebab.jpg', true, false),
    ('Dahi Ke Kebab', 'दही के कबाब', 'Melt-in-the-mouth hung curd and fresh paneer medallions spiced with crushed cardamom and saffron, fried to golden perfection.', 240.00, 'Starters', 'Mild', 4.9, 92, '/images/breakfast_buffet.jpg', true, false),
    ('Maharaja Satvik Thali', 'महाराजा सात्विक थाली', 'Our royal signature thali: 2 seasonal curries, Dal Makhani, 4 Desi Ghee Phulkas, Jeera Rice, Gulab Jamun, and Fresh Salad.', 350.00, 'Mains', 'Mild', 5.0, 310, '/images/satvik_royal_thali_1783699368595.jpg', true, true),
    ('Special Shuddh Jain Thali', 'शुद्ध जैन थाली', 'Authentic Jain meal cooked strictly without root vegetables. Basmati Rice, Moong Dal, Shahi Paneer, Phulkas, and sweet Saffron Rasgulla.', 369.00, 'Mains', 'Mild', 5.0, 118, '/images/shuddh_jain_thali_1785510029541.jpg', true, true),
    ('Dal Makhani Satvik', 'दाल मखनी सात्विक', 'Black lentils slow-cooked overnight on charcoal embers with fresh churned butter and ginger-tomato concassé. Zero onion, zero garlic.', 220.00, 'Mains', 'Mild', 4.9, 180, '/images/dal_makhani.jpg', true, true),
    ('Shahi Paneer (Satvik)', 'शाही पनीर सात्विक', 'Cottage cheese simmered in a luscious cashew, melon seed, and fresh tomato gravy with saffron threads.', 280.00, 'Mains', 'Mild', 4.9, 210, '/images/shahi_paneer.jpg', true, false),
    ('Golden Malpua Rabdi', 'मालपुआ रबड़ी', 'Crisp fried whole-wheat crepes dipped in saffron syrup, served with thick clotted cream rabdi.', 160.00, 'Sweets', 'Mild', 5.0, 140, '/images/golden_malpua_1785510059835.jpg', true, true),
    ('Saffron Rasgulla Plate', 'केसर रसगुल्ला', 'Soft spongy cottage cheese balls soaked in chilled saffron and cardamom infused sugar syrup.', 130.00, 'Sweets', 'Mild', 4.9, 95, '/images/rasgulla.jpg', true, false)
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. RAZORPAY GATEWAY CONFIGURATION TABLE (/admin-razorpay)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.razorpay_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    mode TEXT NOT NULL DEFAULT 'test' CHECK (mode IN ('test', 'live')),
    test_key_id TEXT,
    test_key_secret TEXT,
    live_key_id TEXT,
    live_key_secret TEXT,
    notification_whatsapp TEXT DEFAULT '8527296771' NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely ensure all columns exist
ALTER TABLE public.razorpay_settings ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'test';
ALTER TABLE public.razorpay_settings ADD COLUMN IF NOT EXISTS test_key_id TEXT;
ALTER TABLE public.razorpay_settings ADD COLUMN IF NOT EXISTS test_key_secret TEXT;
ALTER TABLE public.razorpay_settings ADD COLUMN IF NOT EXISTS live_key_id TEXT;
ALTER TABLE public.razorpay_settings ADD COLUMN IF NOT EXISTS live_key_secret TEXT;
ALTER TABLE public.razorpay_settings ADD COLUMN IF NOT EXISTS notification_whatsapp TEXT DEFAULT '8527296771';

-- Clean any dummy placeholder text from previous setups
UPDATE public.razorpay_settings
SET live_key_id = NULL
WHERE live_key_id LIKE '%YOUR_%' OR live_key_id LIKE '%placeholder%';

UPDATE public.razorpay_settings
SET live_key_secret = NULL
WHERE live_key_secret LIKE '%YOUR_%' OR live_key_secret LIKE '%placeholder%';

-- Seed Initial Razorpay Gateway Settings if not exists
INSERT INTO public.razorpay_settings (id, mode, notification_whatsapp)
VALUES ('default', 'test', '8527296771')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 6. CUSTOMER ORDERS TABLE (/cart checkout & /admin-order)
-- ------------------------------------------------------------------------------
-- Step 6a: Create base table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. 'SATVIK-109283'
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_charge DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'Placed',
    payment_method TEXT DEFAULT 'Razorpay',
    payment_status TEXT DEFAULT 'Paid',
    gateway_mode TEXT DEFAULT 'test',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    special_instructions TEXT,
    whatsapp_notified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 6b: Safely add any missing columns if public.orders already existed previously (Fixes: column "razorpay_payment_id" does not exist)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Razorpay';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Paid';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS gateway_mode TEXT DEFAULT 'test';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS special_instructions TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS whatsapp_notified BOOLEAN DEFAULT false;

-- Step 6c: Safe Indexes
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders (razorpay_payment_id);

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES (Idempotent with DROP POLICY IF EXISTS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.razorpay_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Categories Policies
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin all categories" ON public.categories;
CREATE POLICY "Admin all categories" ON public.categories FOR ALL USING (true);

-- Menu Items Policies
DROP POLICY IF EXISTS "Public read menu_items" ON public.menu_items;
CREATE POLICY "Public read menu_items" ON public.menu_items FOR SELECT USING (available = true);

DROP POLICY IF EXISTS "Admin all menu_items" ON public.menu_items;
CREATE POLICY "Admin all menu_items" ON public.menu_items FOR ALL USING (true);

-- Admin Users Policies
DROP POLICY IF EXISTS "Admin all admin_users" ON public.admin_users;
CREATE POLICY "Admin all admin_users" ON public.admin_users FOR ALL USING (true);

-- Razorpay Settings Policies
DROP POLICY IF EXISTS "Public read razorpay_settings" ON public.razorpay_settings;
CREATE POLICY "Public read razorpay_settings" ON public.razorpay_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin all razorpay_settings" ON public.razorpay_settings;
CREATE POLICY "Admin all razorpay_settings" ON public.razorpay_settings FOR ALL USING (true);

-- Orders Policies
DROP POLICY IF EXISTS "Public create orders" ON public.orders;
CREATE POLICY "Public create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin all orders" ON public.orders;
CREATE POLICY "Admin all orders" ON public.orders FOR ALL USING (true);
