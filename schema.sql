-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Enum Types
CREATE TYPE order_status AS ENUM ('Pending', 'Packed', 'Shipped');

-- ==========================================
-- 1. PROFILES TABLE
-- ==========================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    full_name TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 2. PLANTS INVENTORY TABLE
-- ==========================================
CREATE TABLE plants_inventory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock_count INTEGER DEFAULT 0 NOT NULL,
    image_url TEXT,
    care_light TEXT,
    care_water TEXT,
    care_toxicity TEXT,
    best_seller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 3. ORDERS TABLE
-- ==========================================
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    status order_status DEFAULT 'Pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 4. ORDER ITEMS TABLE
-- ==========================================
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    plant_id UUID REFERENCES plants_inventory(id) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    pot_size TEXT,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Profiles RLS
CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
    ON profiles FOR SELECT USING (is_admin());

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- Plants Inventory RLS
CREATE POLICY "Public can view inventory" 
    ON plants_inventory FOR SELECT USING (true);

CREATE POLICY "Admins can insert inventory" 
    ON plants_inventory FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update inventory" 
    ON plants_inventory FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete inventory" 
    ON plants_inventory FOR DELETE USING (is_admin());

-- Orders RLS
CREATE POLICY "Users can view own orders" 
    ON orders FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Admins can view all orders" 
    ON orders FOR SELECT USING (is_admin());

CREATE POLICY "Users can insert own orders" 
    ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admins can update orders" 
    ON orders FOR UPDATE USING (is_admin());

-- Order Items RLS
CREATE POLICY "Users can view own order items" 
    ON order_items FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
    );

CREATE POLICY "Admins can view all order items" 
    ON order_items FOR SELECT USING (is_admin());

CREATE POLICY "Users can insert order items" 
    ON order_items FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
    );

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_plants_inventory_modtime
    BEFORE UPDATE ON plants_inventory
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_orders_modtime
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
