-- Enable public read access to products table
-- This allows the store to be accessed without authentication

-- Enable RLS on products table if not already enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active products
CREATE POLICY "Public can read active products" ON products
  FOR SELECT
  USING (active = true);

-- Create policy for public read access to all products (for admin dashboard)
CREATE POLICY "Public can read all products" ON products
  FOR SELECT
  USING (true);

-- Grant usage on the products table to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON products TO anon;

-- Grant usage on the products table to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON products TO authenticated; 