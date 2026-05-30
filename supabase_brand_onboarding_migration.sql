-- ==========================================================================
-- Vybe Algeria Connect – Brand Details / Onboarding Migration
-- Run this in your Supabase Dashboard → SQL Editor
-- ==========================================================================

-- 1. Create the brand_details table linked to auth.users
CREATE TABLE IF NOT EXISTS public.brand_details (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Brand Info (Step 1)
  company_name TEXT,
  company_logo_url TEXT,
  industry TEXT,
  company_size TEXT,
  country TEXT,
  website TEXT,

  -- Legal & Official (Step 2)
  legal_name TEXT,
  registration_number TEXT,
  tax_id TEXT,
  legal_address TEXT,
  city TEXT,
  wilaya_state TEXT,
  postal_code TEXT,

  -- Contact & Socials (Step 3)
  contact_phone TEXT,
  contact_email TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  facebook_url TEXT,

  -- Onboarding status
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.brand_details ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can view their own brand details"
  ON public.brand_details FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own brand details"
  ON public.brand_details FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own brand details"
  ON public.brand_details FOR UPDATE
  USING (auth.uid() = id);

-- 4. Index for faster lookups
CREATE INDEX IF NOT EXISTS brand_details_onboarding_idx ON public.brand_details(onboarding_completed);

-- 5. Auto-update the updated_at column (reuses existing function if available)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_brand_details_updated ON public.brand_details;
CREATE TRIGGER on_brand_details_updated
  BEFORE UPDATE ON public.brand_details
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Update the handle_new_user trigger to also create a brand_details row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );

  -- Create brand_details placeholder
  INSERT INTO public.brand_details (id, contact_email)
  VALUES (
    NEW.id,
    NEW.email
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger on auth.users already exists from the profiles migration,
-- this just updates the function it calls.

-- ==========================================================================
-- DONE! After running this:
-- - Every new signup auto-creates a brand_details row
-- - onboarding_completed defaults to false
-- - Users can only read/update their own brand details
-- ==========================================================================
