// ============================================================================
// CAIH GROUP: SUPABASE SQL SCRIPT FOR ADMIN SIGNUP AND LOGIN
// Supports both Supabase Native Auth (auth.users) and Custom Stored Procedures
// with pgcrypto Blowfish password hashing and auto-triggers.
// ============================================================================

export const ADMIN_AUTH_SQL = `-- ============================================================================
-- CAIH GROUP: ADMIN AUTHENTICATION, SIGNUP & LOGIN SCHEMA (Supabase / Postgres)
-- ============================================================================

-- 1. Enable Cryptography & UUID Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing Admin table & functions if resetting
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_admin();
DROP FUNCTION IF EXISTS public.admin_login(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.admin_signup(TEXT, TEXT, TEXT, TEXT);
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- 3. Create Admin Users Table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Managing Director',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_users_auth_id ON public.admin_users(auth_id);
CREATE INDEX idx_admin_users_role ON public.admin_users(role);

-- Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_admin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW EXECUTE FUNCTION public.handle_admin_updated_at();

-- 4. Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow reading admin profiles
CREATE POLICY "Allow read admin users" ON public.admin_users
  FOR SELECT USING (true);

-- Allow authenticated admins or anon service key to update profiles
CREATE POLICY "Allow update admin users" ON public.admin_users
  FOR UPDATE USING (true);

-- Allow insert via signup
CREATE POLICY "Allow insert admin users" ON public.admin_users
  FOR INSERT WITH CHECK (true);

-- Allow delete admin users
CREATE POLICY "Allow delete admin users" ON public.admin_users
  FOR DELETE USING (true);

-- 5. Stored Function: ADMIN SIGNUP (pgcrypto bcrypt hash)
CREATE OR REPLACE FUNCTION public.admin_signup(
  p_name TEXT,
  p_email TEXT,
  p_password TEXT,
  p_role TEXT DEFAULT 'Managing Director'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_clean_email TEXT;
  v_admin_id UUID;
  v_hashed_password TEXT;
BEGIN
  v_clean_email := LOWER(TRIM(p_email));
  
  IF v_clean_email = '' OR p_password = '' OR TRIM(p_name) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Name, email and password are required');
  END IF;

  IF LENGTH(p_password) < 6 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Password must be at least 6 characters in length');
  END IF;

  IF EXISTS (SELECT 1 FROM public.admin_users WHERE email = v_clean_email) THEN
    RETURN jsonb_build_object('success', false, 'error', 'An administrator account with this email already exists');
  END IF;

  -- Hash password securely using Blowfish salt
  v_hashed_password := crypt(p_password, gen_salt('bf', 10));

  INSERT INTO public.admin_users (name, email, password_hash, role)
  VALUES (TRIM(p_name), v_clean_email, v_hashed_password, p_role)
  RETURNING id INTO v_admin_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Admin registered successfully',
    'admin', jsonb_build_object(
      'id', v_admin_id,
      'name', TRIM(p_name),
      'email', v_clean_email,
      'role', p_role,
      'createdAt', NOW()
    )
  );
END;
$$;

-- 6. Stored Function: ADMIN LOGIN (Verifies password against pgcrypto hash)
CREATE OR REPLACE FUNCTION public.admin_login(
  p_email TEXT,
  p_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_clean_email TEXT;
  v_admin RECORD;
BEGIN
  v_clean_email := LOWER(TRIM(p_email));

  SELECT id, auth_id, name, email, password_hash, role, is_active, created_at
  INTO v_admin
  FROM public.admin_users
  WHERE email = v_clean_email;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Administrator email not found in directory');
  END IF;

  IF NOT v_admin.is_active THEN
    RETURN jsonb_build_object('success', false, 'error', 'This administrative account is inactive');
  END IF;

  -- Verify password with crypt
  IF v_admin.password_hash <> crypt(p_password, v_admin.password_hash) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid administrative password. Access denied.');
  END IF;

  -- Record last login timestamp
  UPDATE public.admin_users SET last_login = NOW() WHERE id = v_admin.id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Authentication successful',
    'admin', jsonb_build_object(
      'id', v_admin.id,
      'name', v_admin.name,
      'email', v_admin.email,
      'role', v_admin.role,
      'createdAt', v_admin.created_at
    )
  );
END;
$$;

-- 7. Trigger: Auto-sync Supabase Native Auth (auth.users) to public.admin_users
CREATE OR REPLACE FUNCTION public.handle_new_auth_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_users (
    auth_id,
    email,
    name,
    password_hash,
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    'SUPABASE_AUTH_MANAGED',
    COALESCE(NEW.raw_user_meta_data->>'role', 'Managing Director')
  )
  ON CONFLICT (email) DO UPDATE
  SET auth_id = NEW.id,
      name = EXCLUDED.name,
      updated_at = NOW();

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_admin();

-- 8. Initial Seed Data: Default Authorized Corporate Administrators
INSERT INTO public.admin_users (name, email, password_hash, role)
VALUES 
(
  'Director Daniel Samuel',
  'danielsamuel1662@gmail.com',
  crypt('caih2026', gen_salt('bf', 10)),
  'Managing Director'
),
(
  'Engr. D. Obafaiye',
  'admin@caihgroup.com',
  crypt('caih2026', gen_salt('bf', 10)),
  'Super Admin'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = crypt('caih2026', gen_salt('bf', 10)),
    name = EXCLUDED.name,
    role = EXCLUDED.role;
`;
