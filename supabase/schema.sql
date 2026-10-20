-- ============================================================================
-- CAIH GROUP SUPABASE SCHEMA
-- Complete relational schema for Properties, Blog Articles, Inspections,
-- Newsletter Subscriptions, Realtor Registrations, and Contact Inquiries.
-- ============================================================================

-- 1. Enable UUID & Cryptographic Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. DROP EXISTING TABLES (IF RESETTING SCHEMA)
-- ============================================================================
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.newsletter_broadcasts CASCADE;
DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS public.inspections CASCADE;
DROP TABLE IF EXISTS public.realtor_registrations CASCADE;
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;

-- ============================================================================
-- 3. UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. TABLE: PROPERTIES / DEVELOPMENTS
-- ============================================================================
CREATE TABLE public.properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  corridor TEXT NOT NULL DEFAULT 'Idera',
  property_type TEXT NOT NULL DEFAULT 'residential',
  price_category TEXT NOT NULL DEFAULT 'high',
  status TEXT NOT NULL DEFAULT 'ongoing',
  status_label TEXT NOT NULL DEFAULT 'Under Construction',
  badge TEXT,
  secondary_badge TEXT,
  image TEXT NOT NULL,
  price_display TEXT NOT NULL,
  price_sub TEXT NOT NULL DEFAULT '',
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary TEXT NOT NULL DEFAULT '',
  detailed_description TEXT NOT NULL DEFAULT '',
  key_features TEXT[] DEFAULT '{}',
  handover_date TEXT,
  payment_type TEXT,
  starting_deposit TEXT,
  units_or_plots JSONB DEFAULT '[]'::jsonb,
  gallery_images TEXT[] DEFAULT '{}',
  faq_pdf_url TEXT,
  map_embed_url TEXT,
  neighbourhood TEXT[] DEFAULT '{}',
  payment_table JSONB DEFAULT '[]'::jsonb,
  banking_details JSONB DEFAULT '{}'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_corridor ON public.properties(corridor);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_created_at ON public.properties(created_at DESC);

CREATE TRIGGER set_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 5. TABLE: ARTICLES / BLOG POSTS
-- ============================================================================
CREATE TABLE public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'property-market',
  category_label TEXT NOT NULL DEFAULT 'Property Market',
  read_time TEXT NOT NULL DEFAULT '5 min read',
  date TEXT NOT NULL DEFAULT 'April 2026',
  author JSONB NOT NULL DEFAULT '{"name": "Caih Group", "avatarInitials": "CG", "role": "Editorial Directorate"}'::jsonb,
  image TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT[] NOT NULL DEFAULT '{}',
  sections JSONB DEFAULT '[]'::jsonb,
  key_takeaways TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_articles_category ON public.articles(category);
CREATE INDEX idx_articles_featured ON public.articles(featured);
CREATE INDEX idx_articles_created_at ON public.articles(created_at DESC);

CREATE TRIGGER set_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 6. TABLE: INSPECTIONS / SITE VISITS
-- ============================================================================
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  target_project TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Completed', 'Cancelled'
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inspections_email ON public.inspections(email);
CREATE INDEX idx_inspections_target_project ON public.inspections(target_project);
CREATE INDEX idx_inspections_status ON public.inspections(status);
CREATE INDEX idx_inspections_created_at ON public.inspections(created_at DESC);

CREATE TRIGGER set_inspections_updated_at
BEFORE UPDATE ON public.inspections
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 7. TABLE: NEWSLETTER SUBSCRIBERS
-- ============================================================================
CREATE TABLE public.newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  interest TEXT NOT NULL DEFAULT 'all', -- 'all', 'residential', 'plots', 'commercial', 'diaspora'
  source TEXT NOT NULL DEFAULT 'website', -- 'blog', 'footer', 'header', 'advisory', 'manual'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'unsubscribed'
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX idx_subscribers_interest ON public.newsletter_subscribers(interest);
CREATE INDEX idx_subscribers_status ON public.newsletter_subscribers(status);

-- ============================================================================
-- 8. TABLE: NEWSLETTER BROADCASTS
-- ============================================================================
CREATE TABLE public.newsletter_broadcasts (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  preheader TEXT,
  category TEXT NOT NULL DEFAULT 'Market Advisory',
  audience TEXT NOT NULL DEFAULT 'all',
  message TEXT NOT NULL,
  spotlight_property TEXT,
  author TEXT NOT NULL DEFAULT 'Caih Group Advisory Directorate',
  recipients_count INTEGER NOT NULL DEFAULT 0,
  recipient_emails TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'delivered',
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_broadcasts_sent_at ON public.newsletter_broadcasts(sent_at DESC);

-- ============================================================================
-- 9. TABLE: REALTOR REGISTRATIONS
-- ============================================================================
CREATE TABLE public.realtor_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  experience_years TEXT,
  license_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_realtors_email ON public.realtor_registrations(email);
CREATE INDEX idx_realtors_status ON public.realtor_registrations(status);

CREATE TRIGGER set_realtors_updated_at
BEFORE UPDATE ON public.realtor_registrations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 10. TABLE: CONTACT & INQUIRY MESSAGES
-- ============================================================================
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  target_project TEXT,
  status TEXT NOT NULL DEFAULT 'unread', -- 'unread', 'read', 'archived'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- ============================================================================
-- 11. TABLE: ADMIN USERS (LOGIN & SIGNUP DIRECTORY)
-- ============================================================================
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

CREATE TRIGGER set_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 12. STORED FUNCTIONS FOR ADMIN SIGNUP AND LOGIN (PGCRYPTO BCRYPT)
-- ============================================================================

-- Function: ADMIN SIGNUP
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

-- Function: ADMIN LOGIN
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

-- Trigger Function: Auto-sync Supabase Native Auth (auth.users)
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

-- ============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current request has administrative privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT (auth.role() = 'authenticated') OR 
         EXISTS (SELECT 1 FROM public.admin_users WHERE auth_id = auth.uid() AND is_active = true);
$$;

-- 13.1 PROPERTIES POLICIES
CREATE POLICY "Public can view properties" ON public.properties
  FOR SELECT USING (true);

CREATE POLICY "Only admin can manage properties" ON public.properties
  FOR ALL USING (public.is_admin());

-- 13.2 ARTICLES POLICIES
CREATE POLICY "Public can view articles" ON public.articles
  FOR SELECT USING (true);

CREATE POLICY "Only admin can manage articles" ON public.articles
  FOR ALL USING (public.is_admin());

-- 13.3 INSPECTIONS POLICIES (Public can ONLY insert; ONLY admin can view/manage)
CREATE POLICY "Public can insert inspections" ON public.inspections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can view and manage inspections" ON public.inspections
  FOR ALL USING (public.is_admin());

-- 13.4 NEWSLETTER SUBSCRIBERS POLICIES (Public can ONLY insert; ONLY admin can view/manage)
CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can view and manage subscribers" ON public.newsletter_subscribers
  FOR ALL USING (public.is_admin());

-- 13.5 NEWSLETTER BROADCASTS POLICIES (ONLY admin can view/manage)
CREATE POLICY "Only admin can view and manage broadcasts" ON public.newsletter_broadcasts
  FOR ALL USING (public.is_admin());

-- 13.6 REALTOR REGISTRATIONS POLICIES (Public can ONLY submit; ONLY admin can view/manage)
CREATE POLICY "Public can submit realtor registration" ON public.realtor_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can view and manage realtors" ON public.realtor_registrations
  FOR ALL USING (public.is_admin());

-- 13.7 CONTACT MESSAGES POLICIES (Public can ONLY submit; ONLY admin can view/manage)
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can view and manage contact messages" ON public.contact_messages
  FOR ALL USING (public.is_admin());

-- 13.8 ADMIN USERS POLICIES (ONLY admin can view/manage)
CREATE POLICY "Only admin can view admin users" ON public.admin_users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Only admin can manage admin users" ON public.admin_users
  FOR ALL USING (public.is_admin());

-- ============================================================================
-- 14. INITIAL SEED DATA
-- ============================================================================

INSERT INTO public.properties (
  id, title, location, corridor, property_type, price_category, status, status_label,
  badge, image, price_display, price_sub, summary, detailed_description, key_features
) VALUES 
(
  'appleton-enclave',
  'Appleton Enclave (Idera Scheme)',
  'Idera Scheme, Eleko Junction, Lekki-Epe Expressway, Lagos',
  'Idera',
  'plots',
  'high',
  'ongoing',
  'Fast Selling (Prime Plots)',
  'C of O in View',
  '/images/appleton_enclave_entrance.jpg',
  '₦35,000,000 – ₦65,000,000',
  'Flexible 3 to 6-month payment schedules available',
  'Prime commercial & premium residential plots situated along the dynamic Idera Scheme opposite Pan-Atlantic University corridor.',
  'Appleton Enclave is strategically positioned within the burgeoning Idera Scheme, directly accessible from the expanded Lekki-Epe Expressway. Featuring dry topography, institutional layout planning, and verifiable title deeds.',
  ARRAY['100% Dry Table Land', 'Government Approved Layout', 'Direct Expressway Access', 'Perimeter Fencing & Paved Access Roads', 'High Capital Appreciation Potential']
),
(
  'appleton-court',
  'Appleton Court Terraces and Apartments',
  'Akachukwu Street, off Monastery Road, Sangotedo, Lekki, Lagos',
  'Akachukwu Street',
  'residential',
  'high',
  'ongoing',
  'Under Construction',
  'Governor’s Consent',
  '/images/appleton_court_exterior_real.jpg',
  '₦75,000,000 – ₦125,000,000',
  'Starting with ₦20M Initial Deposit',
  'Sophisticated 4-Bedroom Terrace Duplexes with BQ and luxury 2-Bedroom Apartments in a private gated community.',
  'Appleton Court represents urban architectural excellence situated off Monastery Road. Engineered with reinforced concrete structures, contemporary finishing, solar-ready infrastructure, and high security.',
  ARRAY['Governor’s Consent Title', 'All Rooms En-Suite', 'Fitted Italian Kitchen Cabinets', 'Private Car Port for 3 Vehicles', 'Dedicated Transformer & Water Treatment']
),
(
  'appleton-haven',
  'Appleton Haven (Victoria Island)',
  'Victoria Island Corridor, Lagos State',
  'Victoria Island',
  'residential',
  'high',
  'upcoming',
  'Off-Plan Exclusive',
  'High ROI Luxury',
  '/images/caih_luxury_residence_1791879278290.jpg',
  '₦450,000,000 – ₦1,400,000,000',
  'Exclusive private investor allocation',
  'Ultra-luxury architectural icon delivering 2, 3, and 4-bedroom residences and penthouses in the financial heart of Lagos.',
  'Appleton Haven Victoria Island redefines modern coastal sophistication with private infinity pools, panoramic city and Atlantic views, cinema rooms, and smart home automation.',
  ARRAY['Panoramic Ocean & Lagoon Vistas', 'Private Cinema & Wellness Spa', 'Concierge & Valet Service', 'Underground Secure Parking', 'Smart Home Energy Automation']
)
ON CONFLICT (id) DO NOTHING;

-- Initial Subscribers Seed
INSERT INTO public.newsletter_subscribers (id, email, full_name, interest, source, status)
VALUES
('sub-seed-1', 'investor.diaspora@caihgroup.com', 'Dr. Babatunde Adeyemi', 'diaspora', 'advisory', 'active'),
('sub-seed-2', 'chinwe.o@verizon.net', 'Mrs. Chinwe Okonkwo', 'plots', 'footer', 'active'),
('sub-seed-3', 'olumide.lawal@chevron.com', 'Engr. Olumide Lawal', 'residential', 'manual', 'active')
ON CONFLICT (email) DO NOTHING;

-- Initial Executive Administrators Seed
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

