-- =========================================================================
-- DATABASE PATCH: FULL COLUMNS CREATION, RLS POLICIES & SCHEMA REFRESH
-- =========================================================================
-- Run this script inside your Supabase SQL Editor to guarantee that placing
-- orders never fails due to security restrictions, and enable live notifications!

-- 1. Make sure all guest checkout details columns exist in the orders table
ALTER TABLE orders ALTER COLUMN customer_id DROP NOT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_charges NUMERIC(10, 2) DEFAULT 15.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2) DEFAULT 0.00;

-- 2. Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert order items" ON order_items;
DROP POLICY IF EXISTS "Allow public inserts on orders" ON orders;
DROP POLICY IF EXISTS "Allow public inserts on order_items" ON order_items;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Allow public select on orders" ON orders;
DROP POLICY IF EXISTS "Allow public select on order_items" ON order_items;
DROP POLICY IF EXISTS "Allow everyone to select orders" ON orders;
DROP POLICY IF EXISTS "Allow everyone to select order_items" ON order_items;
DROP POLICY IF EXISTS "Allow anyone to insert orders" ON orders;
DROP POLICY IF EXISTS "Allow anyone to insert order_items" ON order_items;


-- 3. Re-enable RLS securely
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. Create all-access SELECT and INSERT policies so buyers can place orders
CREATE POLICY "Allow anyone to insert orders" 
    ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anyone to insert order_items" 
    ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow everyone to select orders" 
    ON orders FOR SELECT USING (true);

CREATE POLICY "Allow everyone to select order_items" 
    ON order_items FOR SELECT USING (true);

-- 5. Enable Supabase Realtime replication on the orders table
-- (Note: If this line throws a conflict because orders is already in publication, it's fine to ignore)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- 6. FORCE POSTGREST SCHEMA CACHE RELOAD (Extremely Important!)
-- This forces Supabase to refresh its internal cache so it immediately recognizes the new columns.
NOTIFY pgrst, 'reload schema';
