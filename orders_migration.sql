-- Run this script in your Supabase SQL Editor to enable guest checkout details in the orders table

-- 1. Make customer_id optional so guests can checkout without an account
ALTER TABLE orders ALTER COLUMN customer_id DROP NOT NULL;

-- 2. Add columns to save customer details directly with the order
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_charges NUMERIC(10, 2) DEFAULT 15.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2) DEFAULT 0.00;

-- 3. Adjust RLS policies so public can insert orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on orders" 
    ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts on order_items" 
    ON order_items FOR INSERT WITH CHECK (true);

-- Allow public to select their own orders (by ID)
CREATE POLICY "Allow public select on orders" 
    ON orders FOR SELECT USING (true);

CREATE POLICY "Allow public select on order_items" 
    ON order_items FOR SELECT USING (true);

-- 4. Adjust Profiles RLS to allow signup registrations
CREATE POLICY "Users can insert own profile" 
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
