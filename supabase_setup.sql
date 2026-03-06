-- Create the audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
    section TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    performed_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view logs
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable read access for authenticated users' AND tablename = 'audit_logs') THEN
        CREATE POLICY "Enable read access for authenticated users" ON public.audit_logs
            FOR SELECT
            TO authenticated
            USING (true);
    END IF;
END $$;

-- Allow authenticated users to insert logs
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable insert access for authenticated users' AND tablename = 'audit_logs') THEN
        CREATE POLICY "Enable insert access for authenticated users" ON public.audit_logs
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = performed_by);
    END IF;
END $$;

-- Create page_content table if it doesn't exist (used by BusinessManager)
CREATE TABLE IF NOT EXISTS public.page_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page TEXT NOT NULL,
    key TEXT NOT NULL,
    value JSONB,
    section TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(page, key)
);

-- Enable RLS for page_content
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read/write page_content
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all access for authenticated users' AND tablename = 'page_content') THEN
        CREATE POLICY "Enable all access for authenticated users" ON public.page_content
            FOR ALL
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- Create hero_slides table if it doesn't exist (used by HeroManager)
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    subtitle TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for hero_slides
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read/write hero_slides
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all access for authenticated users' AND tablename = 'hero_slides') THEN
        CREATE POLICY "Enable all access for authenticated users" ON public.hero_slides
            FOR ALL
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- Create business_segments table if it doesn't exist (used by HomeConfigManager)
CREATE TABLE IF NOT EXISTS public.business_segments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    description TEXT,
    image_url TEXT,
    href TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for business_segments
ALTER TABLE public.business_segments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read/write business_segments
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all access for authenticated users' AND tablename = 'business_segments') THEN
        CREATE POLICY "Enable all access for authenticated users" ON public.business_segments
            FOR ALL
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- Create admins table for dynamic user management
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (who are potential admins) to read the list
-- Note: In a stricter setup, you might want to only allow existing admins to read this.
-- For now, we allow authenticated users to read to check if *they* are admins.
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable read access for authenticated users' AND tablename = 'admins') THEN
        CREATE POLICY "Enable read access for authenticated users" ON public.admins
            FOR SELECT
            TO authenticated
            USING (true);
    END IF;
END $$;

-- Allow authenticated users to insert/update/delete (needs to be restricted to super admins ideally, but for now open to auth users)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable write access for authenticated users' AND tablename = 'admins') THEN
        CREATE POLICY "Enable write access for authenticated users" ON public.admins
            FOR ALL
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- Insert initial admin (Migration helper)
INSERT INTO public.admins (email, role)
VALUES ('admin@gesit.co.id', 'super_admin'), ('rudi.siarudin@gesit.co.id', 'super_admin')

-- Create site_stats table for tracking total visits
CREATE TABLE IF NOT EXISTS public.site_stats (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for site_stats
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) and authenticated users to read site_stats
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable read access for all' AND tablename = 'site_stats') THEN
        CREATE POLICY "Enable read access for all" ON public.site_stats
            FOR SELECT
            USING (true);
    END IF;
END $$;

-- Allow public (anon) to upsert site_stats (used by tracking helper)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable upsert for tracking' AND tablename = 'site_stats') THEN
        CREATE POLICY "Enable upsert for tracking" ON public.site_stats
            FOR ALL
            TO anon
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- Initialize total_visitors if not exists
INSERT INTO public.site_stats (key, value)
VALUES ('total_visitors', '0')

-- RPC Function for atomic visitor increment
CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS void AS $$
BEGIN
    INSERT INTO public.site_stats (key, value)
    VALUES ('total_visitors', '1')
    ON CONFLICT (key) DO UPDATE
    SET value = (
        CASE 
            WHEN public.site_stats.value ~ '^[0-9]+$' THEN (public.site_stats.value::int + 1)::text
            ELSE '1'
        END
    ),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access
GRANT EXECUTE ON FUNCTION increment_visitor_count() TO anon;
GRANT EXECUTE ON FUNCTION increment_visitor_count() TO authenticated;
