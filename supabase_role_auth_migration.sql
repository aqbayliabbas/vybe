-- ==========================================================================
-- Vybe Algeria Connect – Role-Based Auth Migration
-- Run this in your Supabase Dashboard → SQL Editor
-- ==========================================================================

-- 1. Ensure the profiles table is configured properly (from previous migration, but we ensure 'role' is present)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'creator' CHECK (role IN ('brand', 'creator')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure RLS is active
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Ensure users can only update their own profile
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" ON public.profiles
            FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;


-- 2. Create the custom access token hook function
-- This will inject the user_role into the JWT claims
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
  DECLARE
    claims jsonb;
    user_role text;
  BEGIN
    -- Check if the user is marked as brand or creator in profiles
    SELECT role INTO user_role FROM public.profiles WHERE id = (event->>'user_id')::uuid;

    claims := event->'claims';

    IF user_role IS NOT NULL THEN
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    ELSE
      -- Fallback to 'creator' if not found
      claims := jsonb_set(claims, '{user_role}', '"creator"');
    END IF;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);
    -- Return the modified or original event
    RETURN event;
  END;
$$;

-- Grant permissions for Supabase Auth to execute the hook
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;


-- 3. Create a helper function to easily get the current user role in RLS policies
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text AS $$
  -- Read from the custom JWT claim first (which we injected above)
  -- Fallback to the profiles table if the claim is missing for any reason
  SELECT COALESCE(
    (auth.jwt() ->> 'user_role'),
    (SELECT role FROM public.profiles WHERE id = auth.uid())
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- 4. Update the existing handle_new_user trigger to grab the role from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'creator')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- (The trigger itself should already exist on auth.users from previous migrations, 
-- but we recreate it here to be safe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================================================
-- IMPORTANT NEXT STEPS:
-- 1. In your Supabase Dashboard, go to Authentication -> Hooks.
-- 2. Under "Custom access token (jwt)", select the `custom_access_token_hook` 
--    function and click Save.
-- ==========================================================================
