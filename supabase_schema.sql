-- Supabase Database Schema for Vybe Algeria Connect
-- Use this script in your Supabase SQL Editor to set up the tables and RLS policies.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Campaigns table (handles both Contests and Deals)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  brand_logo TEXT,
  type TEXT NOT NULL CHECK (type IN ('deal', 'contest')),
  status TEXT NOT NULL CHECK (status IN ('live', 'draft', 'ended')) DEFAULT 'draft',
  submissions_count INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  budget TEXT NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER,
  prize_pool INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  days_left INTEGER NOT NULL DEFAULT 14,
  industry TEXT,
  niches TEXT[] DEFAULT '{}',
  platforms TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  dos TEXT[] DEFAULT '{}',
  donts TEXT[] DEFAULT '{}'
);

-- Enable Row Level Security (RLS) on Campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- 2. Create Submissions table (handles applications/submissions from creators)
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  creator TEXT NOT NULL,
  handle TEXT NOT NULL,
  avatar TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('TikTok', 'Instagram', 'YouTube')),
  views INTEGER NOT NULL DEFAULT 0,
  bid INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'declined', 'edits')) DEFAULT 'pending',
  followers INTEGER NOT NULL DEFAULT 0,
  avg_views INTEGER NOT NULL DEFAULT 0,
  engagement NUMERIC NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT false,
  feedback TEXT,
  revision_count INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security (RLS) on Submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 3. Create Saved Creator Lists table
CREATE TABLE IF NOT EXISTS public.creator_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on Creator Lists
ALTER TABLE public.creator_lists ENABLE ROW LEVEL SECURITY;

-- 4. Create Creator List Members table (Many-to-Many junction)
CREATE TABLE IF NOT EXISTS public.creator_list_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES public.creator_lists(id) ON DELETE CASCADE,
  creator_id TEXT NOT NULL, -- References the text ID of the creator (e.g. 'yasmine', 'karim')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(list_id, creator_id)
);

-- Enable Row Level Security (RLS) on Creator List Members
ALTER TABLE public.creator_list_members ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- CREATE INDEXES FOR SPEED
-- =========================================================================
CREATE INDEX IF NOT EXISTS campaigns_type_idx ON public.campaigns(type);
CREATE INDEX IF NOT EXISTS campaigns_status_idx ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS submissions_campaign_id_idx ON public.submissions(campaign_id);
CREATE INDEX IF NOT EXISTS creator_list_members_list_id_idx ON public.creator_list_members(list_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
-- Allow anyone to read, write, and edit lists/campaigns during testing.
-- In a production scenario, you would limit policies to authenticated users using: auth.uid()

CREATE POLICY "Allow public read access to campaigns" ON public.campaigns
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to campaigns" ON public.campaigns
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to campaigns" ON public.campaigns
    FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to submissions" ON public.submissions
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to submissions" ON public.submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to submissions" ON public.submissions
    FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to creator_lists" ON public.creator_lists
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to creator_lists" ON public.creator_lists
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete access to creator_lists" ON public.creator_lists
    FOR DELETE USING (true);

CREATE POLICY "Allow public read access to creator_list_members" ON public.creator_list_members
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to creator_list_members" ON public.creator_list_members
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete access to creator_list_members" ON public.creator_list_members
    FOR DELETE USING (true);

-- =========================================================================
-- 5. PROFILES TABLE (linked to auth.users)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'creator' CHECK (role IN ('creator', 'brand', 'admin')),
  bio TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  instagram_handle TEXT,
  tiktok_handle TEXT,
  youtube_handle TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on profile changes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
