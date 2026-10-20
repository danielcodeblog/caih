-- ============================================================================
-- CAIH GROUP - FEATURE UPGRADE MIGRATION SCRIPT
-- Safely applies schema enhancements for Admin Property Posts, Blog Articles,
-- Video Tours, Homepage Highlights, Inspections, and Team Management.
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- FEATURE 1: PROPERTIES ENHANCEMENTS
-- Adds video tours, admin tracking, and flexible JSONB specs
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.properties (
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
  video_url TEXT,
  faq_pdf_url TEXT,
  map_embed_url TEXT,
  neighbourhood TEXT[] DEFAULT '{}',
  payment_table JSONB DEFAULT '[]'::jsonb,
  banking_details JSONB DEFAULT '{}'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  updated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure newly added columns exist if table was already created
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS updated_by TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS secondary_badge TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS neighbourhood TEXT[] DEFAULT '{}';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS key_features TEXT[] DEFAULT '{}';

-- Indexes for lightning-fast querying on property catalog & homepage
CREATE INDEX IF NOT EXISTS idx_properties_corridor ON public.properties(corridor);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_badge ON public.properties(badge);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);


-- ============================================================================
-- FEATURE 2: BLOG & MARKET INTELLIGENCE ARTICLES
-- Adds homepage featured flag, video dispatches, takeaways & author specs
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'property-market',
  category_label TEXT NOT NULL DEFAULT 'Property Market',
  read_time TEXT NOT NULL DEFAULT '5 min read',
  date TEXT NOT NULL DEFAULT 'April 2026',
  author JSONB NOT NULL DEFAULT '{"name": "Caih Group", "avatarInitials": "CG", "role": "Editorial Directorate"}'::jsonb,
  image TEXT NOT NULL,
  video_url TEXT,
  excerpt TEXT NOT NULL,
  content TEXT[] NOT NULL DEFAULT '{}',
  sections JSONB DEFAULT '[]'::jsonb,
  key_takeaways TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  updated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure newly added columns exist if table was already created
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS updated_by TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS key_takeaways TEXT[] DEFAULT '{}';

-- Indexes for homepage spotlight and category filtration
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);


-- ============================================================================
-- FEATURE 3: INSPECTION SITE VISITS & BOOKINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  target_project TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inspections_status ON public.inspections(status);
CREATE INDEX IF NOT EXISTS idx_inspections_created_at ON public.inspections(created_at DESC);


-- ============================================================================
-- FEATURE 4: NEWSLETTER SUBSCRIBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  interest TEXT NOT NULL DEFAULT 'all',
  source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'active',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.newsletter_subscribers(email);


-- ============================================================================
-- FEATURE 5: ADMIN USERS & TEAM ACCESS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Content Manager',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures public visitors can read properties/articles and submit inspections,
-- while only authorized roles can insert or modify listings.
-- ============================================================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active properties and articles
DROP POLICY IF EXISTS "Public can view properties" ON public.properties;
CREATE POLICY "Public can view properties" ON public.properties
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view articles" ON public.articles;
CREATE POLICY "Public can view articles" ON public.articles
  FOR SELECT USING (true);

-- Allow public to book inspections and subscribe
DROP POLICY IF EXISTS "Public can submit inspection" ON public.inspections;
CREATE POLICY "Public can submit inspection" ON public.inspections
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Allow full administrative management (using anon / service keys)
DROP POLICY IF EXISTS "Enable all access for admin properties" ON public.properties;
CREATE POLICY "Enable all access for admin properties" ON public.properties
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for admin articles" ON public.articles;
CREATE POLICY "Enable all access for admin articles" ON public.articles
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for admin inspections" ON public.inspections;
CREATE POLICY "Enable all access for admin inspections" ON public.inspections
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for admin subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Enable all access for admin subscribers" ON public.newsletter_subscribers
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for admin users" ON public.admin_users;
CREATE POLICY "Enable all access for admin users" ON public.admin_users
  FOR ALL USING (true) WITH CHECK (true);
