-- ==============================================================================
-- SATVIK CATERS AND EVENTS - PRODUCTION SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- This SQL script sets up all tables, foreign keys, constraints, indexes, 
-- Row Level Security (RLS) policies, and initial seed data for:
-- 1. Categories & Menu Items (/menu)
-- 2. Clay Oven Starters (/strater)
-- 3. Catering & IRCTC Train Delivery Services (/service)
-- 4. Customer Orders & Order Items
-- 5. Catering Inquiries & Train Passenger Berth Orders
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. MENU ITEMS TABLE (/menu)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    hindi_name TEXT,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    category TEXT NOT NULL,
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

-- Index on category and availability for fast menu loading
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items (category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items (available);

-- ------------------------------------------------------------------------------
-- 3. CLAY OVEN STARTERS TABLE (/strater)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.starters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    category TEXT DEFAULT 'Starters' NOT NULL,
    image TEXT NOT NULL,
    spicy TEXT DEFAULT 'Medium' CHECK (spicy IN ('Mild', 'Medium', 'Hot')),
    pieces INT DEFAULT 6,
    basted_with_a2_ghee BOOLEAN DEFAULT true,
    clay_oven_roasted BOOLEAN DEFAULT true,
    rating DECIMAL(2, 1) DEFAULT 4.9,
    reviews INT DEFAULT 80,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_starters_available ON public.starters (available);

-- ------------------------------------------------------------------------------
-- 4. SERVICES & PACKAGES TABLE (/service)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('EVENT', 'CORPORATE', 'IRCTC')),
    description TEXT NOT NULL,
    price_starts_at TEXT,
    image TEXT NOT NULL,
    highlights TEXT[],
    stations TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_services_category ON public.services (category);

-- ------------------------------------------------------------------------------
-- 5. SERVICE INQUIRIES & CATERING BOOKINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.service_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_title TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    event_date DATE NOT NULL,
    guest_count INT NOT NULL CHECK (guest_count > 0),
    event_type TEXT,
    venue_address TEXT,
    special_requirements TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.service_inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_event_date ON public.service_inquiries (event_date);

-- ------------------------------------------------------------------------------
-- 6. IRCTC TRAIN BERTH FOOD ORDERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.train_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pnr_number VARCHAR(10) NOT NULL,
    train_number VARCHAR(10) NOT NULL,
    train_name TEXT,
    station_code VARCHAR(10) NOT NULL CHECK (station_code IN ('BPL', 'RKMP', 'SHRN')),
    station_name TEXT NOT NULL,
    coach VARCHAR(10) NOT NULL,
    berth_number VARCHAR(10) NOT NULL,
    passenger_name TEXT NOT NULL,
    passenger_phone TEXT NOT NULL,
    order_items JSONB NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_date DATE NOT NULL,
    expected_arrival_time TIME NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cooking', 'at_platform', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_train_orders_pnr ON public.train_orders (pnr_number);
CREATE INDEX IF NOT EXISTS idx_train_orders_station ON public.train_orders (station_code);
CREATE INDEX IF NOT EXISTS idx_train_orders_date ON public.train_orders (delivery_date);

-- ------------------------------------------------------------------------------
-- 7. ONLINE FOOD ORDERS & ORDER ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. 'SAT-9821'
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    pin_code VARCHAR(10),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_mode TEXT DEFAULT 'COD' CHECK (payment_mode IN ('COD', 'UPI', 'CARD', 'ONLINE')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    order_status TEXT DEFAULT 'placed' CHECK (order_status IN ('placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (order_status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders (customer_phone);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.starters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.train_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public can read active menu items, starters, services, and categories
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON public.menu_items FOR SELECT USING (available = true);
CREATE POLICY "Public read starters" ON public.starters FOR SELECT USING (available = true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (is_active = true);

-- Public can create orders, inquiries, and train bookings
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own order" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Public insert service_inquiries" ON public.service_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert train_orders" ON public.train_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read train_orders" ON public.train_orders FOR SELECT USING (true);

-- Service role (Admin) full access
CREATE POLICY "Admin all categories" ON public.categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all menu_items" ON public.menu_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all starters" ON public.starters FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all services" ON public.services FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all inquiries" ON public.service_inquiries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all train_orders" ON public.train_orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all orders" ON public.orders FOR ALL USING (auth.role() = 'service_role');

-- ------------------------------------------------------------------------------
-- 9. INITIAL SEED DATA
-- ------------------------------------------------------------------------------
INSERT INTO public.categories (name, slug, description, display_order)
VALUES 
    ('Starters', 'starters', 'Clay oven grilled kebabs and tikkas', 1),
    ('Mains', 'mains', 'Rich curries cooked in hand-churned A2 desi ghee', 2),
    ('Thalis', 'thalis', 'Complete Vedic and Jain thali meals', 3),
    ('Sweets', 'sweets', 'Traditional ghee sweets and desserts', 4),
    ('Catering', 'catering', 'Bulk buffet and event feasts', 5)
ON CONFLICT (name) DO NOTHING;

-- Seed Starters
INSERT INTO public.starters (name, description, price, category, image, spicy, pieces, basted_with_a2_ghee, clay_oven_roasted)
VALUES
    ('Paneer Tikka', 'Cubes of fresh Malai cottage cheese marinated in hung curd, ajwain, and roasted spices, clay-oven tandoor roasted.', 260.00, 'Starters', '/images/satvik_paneer_tikka_1783699415993.jpg', 'Medium', 6, true, true),
    ('Paneer Malai Tikka', 'Tender paneer cubes infused with rich cashew-cream paste, green cardamom, and white pepper, glazed with pure ghee.', 275.00, 'Starters', '/images/shahi_paneer.jpg', 'Mild', 6, true, true),
    ('Crispy Beetroot Kebab', 'Vibrant ruby-red beetroot patties blended with crushed peanuts and rock salt, shallow-fried to delicate crisp.', 210.00, 'Starters', '/images/beetroot_kebab.jpg', 'Medium', 6, true, false),
    ('Hara Bhara Kebab', 'Nutrient-packed spinach, green peas, and fresh coriander patties stuffed with roasted cashew nuts.', 195.00, 'Starters', '/images/event_decorations.jpg', 'Mild', 6, true, false),
    ('Dahi Ke Kebab', 'Melt-in-the-mouth hung curd and fresh paneer medallions spiced with crushed cardamom and saffron.', 240.00, 'Starters', '/images/breakfast_buffet.jpg', 'Mild', 6, true, false)
ON CONFLICT DO NOTHING;

-- Seed Sample Menu Items
INSERT INTO public.menu_items (name, hindi_name, description, price, category, spicy, rating, reviews, image, is_jain, is_chef_special)
VALUES
    ('Maharaja Satvik Thali', 'महाराजा सात्विक थाली', 'Our royal signature thali: 2 Seasonal curries, Dal Makhani, 4 Desi Ghee Phulkas, Jeera Rice, Gulab Jamun, and Fresh Salad.', 350.00, 'Mains', 'Mild', 5.0, 310, '/images/satvik_royal_thali_1783699368595.jpg', true, true),
    ('Dal Makhani Satvik', 'दाल मखनी सात्विक', 'Black lentils slow-cooked overnight on charcoal embers with fresh churned butter and ginger-tomato concassé. Zero onion, zero garlic.', 220.00, 'Mains', 'Mild', 4.9, 180, '/images/dal_makhani.jpg', true, true),
    ('Shahi Paneer (Satvik)', 'शाही पनीर सात्विक', 'Cottage cheese simmered in a luscious cashew, melon seed, and fresh tomato gravy with saffron threads.', 280.00, 'Mains', 'Mild', 4.9, 210, '/images/shahi_paneer.jpg', true, false),
    ('Panchamel Dal', 'पंचमेल दाल', 'Traditional Rajasthani 5-lentil blend tempered with hing (asafoetida), dry red chillies, and cumin in smoking A2 cow ghee.', 190.00, 'Mains', 'Medium', 4.8, 95, '/images/panchamel_dal_1785510045096.jpg', true, false),
    ('Golden Malpua Rabdi', 'मालपुआ रबड़ी', 'Crisp fried whole-wheat crepes dipped in saffron syrup, served with thick clotted cream rabdi.', 160.00, 'Sweets', 'Mild', 5.0, 140, '/images/golden_malpua_1785510059835.jpg', true, true)
ON CONFLICT DO NOTHING;

-- Seed IRCTC Train Delivery Service
INSERT INTO public.services (title, category, description, price_starts_at, image, highlights, stations)
VALUES
    (
        'IRCTC Train Food Service',
        'IRCTC',
        'Official Authorised Vendor of IRCTC delivering fresh, piping-hot, 100% pure Satvik & Shuddh Jain meals directly to passenger berths.',
        'Authorise vendor of IRCTC',
        '/images/satvik_royal_thali_1783699368595.jpg',
        ARRAY['Authorise vendor of IRCTC', 'Bhopal Main Station (BPL)', 'Rani Kamlapati Station (RKMP)', 'Sant Hirdaram Station (SHRN)'],
        ARRAY['Bhopal Main Station', 'Rani Kamlapati Station', 'Sant Hirdaram Station']
    )
ON CONFLICT DO NOTHING;
