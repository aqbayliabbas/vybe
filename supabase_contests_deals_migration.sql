-- ==========================================================================
-- Vybe Algeria Connect – Split Database Schema Migration (Contests & Deals)
-- Run this in your Supabase Dashboard → SQL Editor
-- ==========================================================================

-- 0. Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================================
-- 1. PROFILE SUB-TABLES (linked to profiles)
-- ==========================================================================

-- Brand Profiles table
CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  logo_url TEXT,
  country TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'growth', 'scale')),
  trial_contests_used INTEGER DEFAULT 0,
  trial_deals_used INTEGER DEFAULT 0,
  stripe_customer_id TEXT,
  chargily_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Creator Profiles table
CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  country TEXT,
  niche TEXT[] DEFAULT '{}',
  content_language TEXT[] DEFAULT '{}',
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  phyllo_user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Creator Social Accounts table
CREATE TABLE IF NOT EXISTS public.creator_social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube')),
  username TEXT NOT NULL,
  follower_count INTEGER DEFAULT 0,
  avg_views INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  phyllo_account_id TEXT,
  access_token TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================================
-- 2. CAMPAIGNS (CONTESTS & DEALS SPLIT)
-- ==========================================================================

-- Contests table
CREATE TABLE IF NOT EXISTS public.contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  dos TEXT[] DEFAULT '{}',
  donts TEXT[] DEFAULT '{}',
  inspiration_links TEXT[] DEFAULT '{}',
  asset_urls TEXT[] DEFAULT '{}',
  platforms TEXT[] DEFAULT '{}',
  region TEXT,
  content_languages TEXT[] DEFAULT '{}',
  min_followers INTEGER,
  duration_days INTEGER CHECK (duration_days IN (7, 14, 21, 30)) DEFAULT 14,
  prize_type TEXT CHECK (prize_type IN ('fixed', 'per_view')) DEFAULT 'fixed',
  prize_pool DECIMAL(10,2) DEFAULT 0.00,
  prize_distribution JSONB DEFAULT '[]',
  per_view_rate DECIMAL(10,2),
  per_view_cap DECIMAL(10,2),
  platform_fee DECIMAL(10,2) DEFAULT 0.00,
  status TEXT CHECK (status IN ('draft', 'live', 'ended', 'disputed', 'paid_out')) DEFAULT 'draft',
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Deals table
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  deliverable TEXT NOT NULL,
  dos TEXT[] DEFAULT '{}',
  donts TEXT[] DEFAULT '{}',
  inspiration_links TEXT[] DEFAULT '{}',
  asset_urls TEXT[] DEFAULT '{}',
  platforms TEXT[] DEFAULT '{}',
  region TEXT,
  follower_range TEXT CHECK (follower_range IN ('nano', 'micro', 'mid', 'macro')) DEFAULT 'nano',
  niche_tags TEXT[] DEFAULT '{}',
  content_languages TEXT[] DEFAULT '{}',
  application_deadline TIMESTAMP WITH TIME ZONE,
  max_creators INTEGER DEFAULT 1,
  budget_type TEXT CHECK (budget_type IN ('fixed', 'range', 'creator_proposes')) DEFAULT 'fixed',
  budget_fixed DECIMAL(10,2),
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  revision_limit INTEGER CHECK (revision_limit IN (0, 1, 2)) DEFAULT 1,
  status TEXT CHECK (status IN ('draft', 'open', 'closed', 'completed')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================================
-- 3. SUBMISSIONS & APPLICATIONS
-- ==========================================================================

-- Contest Submissions table
CREATE TABLE IF NOT EXISTS public.contest_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  social_account_id UUID REFERENCES public.creator_social_accounts(id) ON DELETE SET NULL,
  post_url TEXT NOT NULL,
  video_id TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube')),
  phyllo_content_id TEXT,
  status TEXT CHECK (status IN ('active', 'disqualified')) DEFAULT 'active',
  final_rank INTEGER,
  prize_amount DECIMAL(10,2) DEFAULT 0.00,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Submission Stats Snapshots (Time-series views history)
CREATE TABLE IF NOT EXISTS public.submission_stats_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.contest_submissions(id) ON DELETE CASCADE NOT NULL,
  views BIGINT DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Deal Applications table
CREATE TABLE IF NOT EXISTS public.deal_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  social_account_id UUID REFERENCES public.creator_social_accounts(id) ON DELETE SET NULL,
  proposed_bid DECIMAL(10,2),
  pitch TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'declined', 'withdrawn')) DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Deal Submissions table (creator uploads video for review after application approved)
CREATE TABLE IF NOT EXISTS public.deal_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.deal_applications(id) ON DELETE CASCADE NOT NULL,
  post_url TEXT NOT NULL,
  video_id TEXT,
  platform TEXT NOT NULL,
  phyllo_content_id TEXT,
  status TEXT CHECK (status IN ('submitted', 'accepted', 'edits_requested', 'declined')) DEFAULT 'submitted',
  brand_feedback TEXT,
  revision_number INTEGER DEFAULT 1,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================================
-- 4. PAYMENTS, DISPUTES, PAYOUTS
-- ==========================================================================

-- Contest Payments
CREATE TABLE IF NOT EXISTS public.contest_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE NOT NULL,
  brand_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  prize_pool DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_charged DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'dzd',
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'chargily')) DEFAULT 'chargily',
  stripe_payment_id TEXT,
  chargily_payment_id TEXT,
  status TEXT CHECK (status IN ('pending', 'held', 'released', 'refunded', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Deal Payments
CREATE TABLE IF NOT EXISTS public.deal_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.deal_submissions(id) ON DELETE CASCADE NOT NULL,
  brand_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  bid_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_charged DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'dzd',
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'chargily')) DEFAULT 'chargily',
  stripe_payment_id TEXT,
  chargily_payment_id TEXT,
  status TEXT CHECK (status IN ('pending', 'processing', 'paid', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Creator Payouts
CREATE TABLE IF NOT EXISTS public.creator_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('contest_prize', 'deal_payment')) NOT NULL,
  reference_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'dzd',
  provider TEXT CHECK (provider IN ('stripe_connect', 'chargily')) DEFAULT 'chargily',
  status TEXT CHECK (status IN ('pending', 'processing', 'paid', 'failed')) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disputes (Contests review window)
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE NOT NULL,
  brand_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('open', 'resolved_valid', 'resolved_invalid')) DEFAULT 'open',
  admin_notes TEXT,
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================================
-- 5. INDEXES FOR HIGH-SPEED QUERIES
-- ==========================================================================
CREATE INDEX IF NOT EXISTS contests_brand_id_idx ON public.contests(brand_id);
CREATE INDEX IF NOT EXISTS contests_status_idx ON public.contests(status);
CREATE INDEX IF NOT EXISTS deals_brand_id_idx ON public.deals(brand_id);
CREATE INDEX IF NOT EXISTS deals_status_idx ON public.deals(status);
CREATE INDEX IF NOT EXISTS contest_submissions_contest_id_idx ON public.contest_submissions(contest_id);
CREATE INDEX IF NOT EXISTS contest_submissions_creator_id_idx ON public.contest_submissions(creator_id);
CREATE INDEX IF NOT EXISTS stats_snapshots_submission_id_idx ON public.submission_stats_snapshots(submission_id);
CREATE INDEX IF NOT EXISTS deal_applications_deal_id_idx ON public.deal_applications(deal_id);
CREATE INDEX IF NOT EXISTS deal_applications_creator_id_idx ON public.deal_applications(creator_id);
CREATE INDEX IF NOT EXISTS deal_submissions_application_id_idx ON public.deal_submissions(application_id);

-- ==========================================================================
-- 6. TRIGGER TRIGGERS FOR UPDATED_AT TIMESTAMP
-- ==========================================================================

-- Trigger for public.contests
DROP TRIGGER IF EXISTS on_contests_updated ON public.contests;
CREATE TRIGGER on_contests_updated
  BEFORE UPDATE ON public.contests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for public.deals
DROP TRIGGER IF EXISTS on_deals_updated ON public.deals;
CREATE TRIGGER on_deals_updated
  BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================================
-- Enabling RLS
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_stats_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Creating permissive RLS policies for developer/testing environments.
-- Anyone can select, insert, update, or delete lists/rows easily.

-- brand_profiles
CREATE POLICY "Allow public select on brand_profiles" ON public.brand_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on brand_profiles" ON public.brand_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on brand_profiles" ON public.brand_profiles FOR UPDATE USING (true);

-- creator_profiles
CREATE POLICY "Allow public select on creator_profiles" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on creator_profiles" ON public.creator_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on creator_profiles" ON public.creator_profiles FOR UPDATE USING (true);

-- creator_social_accounts
CREATE POLICY "Allow public select on creator_social_accounts" ON public.creator_social_accounts FOR SELECT USING (true);
CREATE POLICY "Allow public insert on creator_social_accounts" ON public.creator_social_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on creator_social_accounts" ON public.creator_social_accounts FOR UPDATE USING (true);

-- contests
CREATE POLICY "Allow public select on contests" ON public.contests FOR SELECT USING (true);
CREATE POLICY "Allow public insert on contests" ON public.contests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on contests" ON public.contests FOR UPDATE USING (true);

-- deals
CREATE POLICY "Allow public select on deals" ON public.deals FOR SELECT USING (true);
CREATE POLICY "Allow public insert on deals" ON public.deals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on deals" ON public.deals FOR UPDATE USING (true);

-- contest_submissions
CREATE POLICY "Allow public select on contest_submissions" ON public.contest_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on contest_submissions" ON public.contest_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on contest_submissions" ON public.contest_submissions FOR UPDATE USING (true);

-- submission_stats_snapshots
CREATE POLICY "Allow public select on stats_snapshots" ON public.submission_stats_snapshots FOR SELECT USING (true);
CREATE POLICY "Allow public insert on stats_snapshots" ON public.submission_stats_snapshots FOR INSERT WITH CHECK (true);

-- deal_applications
CREATE POLICY "Allow public select on deal_applications" ON public.deal_applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert on deal_applications" ON public.deal_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on deal_applications" ON public.deal_applications FOR UPDATE USING (true);

-- deal_submissions
CREATE POLICY "Allow public select on deal_submissions" ON public.deal_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on deal_submissions" ON public.deal_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on deal_submissions" ON public.deal_submissions FOR UPDATE USING (true);

-- contest_payments
CREATE POLICY "Allow public select on contest_payments" ON public.contest_payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on contest_payments" ON public.contest_payments FOR INSERT WITH CHECK (true);

-- deal_payments
CREATE POLICY "Allow public select on deal_payments" ON public.deal_payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on deal_payments" ON public.deal_payments FOR INSERT WITH CHECK (true);

-- creator_payouts
CREATE POLICY "Allow public select on creator_payouts" ON public.creator_payouts FOR SELECT USING (true);
CREATE POLICY "Allow public insert on creator_payouts" ON public.creator_payouts FOR INSERT WITH CHECK (true);

-- disputes
CREATE POLICY "Allow public select on disputes" ON public.disputes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on disputes" ON public.disputes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on disputes" ON public.disputes FOR UPDATE USING (true);
