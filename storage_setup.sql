-- ==========================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- ==========================================

-- 1. Create a new storage bucket for product images
-- (Note: If this errors because the bucket already exists or permissions fail, 
-- you can manually create it in the Supabase Dashboard -> Storage -> New Bucket -> "product-images")
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up RLS for Storage (Admins can insert/update/delete)

-- (RLS is already enabled by default on storage.objects, so we skip the ALTER TABLE command which causes ownership errors)

-- Allow public to read any image in the product-images bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- Allow admins to insert files into the product-images bucket
CREATE POLICY "Admin Insert Access" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'product-images' 
    AND (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
);

-- Allow admins to update files in the product-images bucket
CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'product-images' 
    AND (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
);

-- Allow admins to delete files in the product-images bucket
CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'product-images' 
    AND (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
);
