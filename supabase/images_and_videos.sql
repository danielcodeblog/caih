-- ============================================================================
-- CAIH GROUP - IMAGES & VIDEO LINKS DATABASE SCHEMA & SEED SQL
-- For Supabase / PostgreSQL
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ENSURE SCHEMA SUPPORTS IMAGES, GALLERY ARRAYS, AND VIDEO LINKS
-- ----------------------------------------------------------------------------

-- Add image and video columns to properties table if they don't already exist
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_list JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_coming_soon BOOLEAN DEFAULT false;

-- Add image and video columns to blog articles table if needed
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS video_url TEXT;

-- ----------------------------------------------------------------------------
-- 2. (OPTIONAL) DEDICATED TABLE FOR VIDEO DISPATCHES & SITE WALKTHROUGHS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_dispatches (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'ON-SITE WALKTHROUGH',
  duration TEXT NOT NULL DEFAULT '03:30',
  thumbnail TEXT NOT NULL,
  embed_url TEXT NOT NULL,
  speaker TEXT NOT NULL DEFAULT 'Caih Group Directorate',
  description TEXT NOT NULL DEFAULT '',
  property_id TEXT REFERENCES public.properties(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for video dispatches
ALTER TABLE public.video_dispatches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view video dispatches" ON public.video_dispatches;
CREATE POLICY "Public can view video dispatches" ON public.video_dispatches FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage video dispatches" ON public.video_dispatches;
CREATE POLICY "Admins can manage video dispatches" ON public.video_dispatches FOR ALL USING (true);

-- ----------------------------------------------------------------------------
-- 3. POPULATE & UPDATE ALL PROPERTY IMAGES AND VIDEO LINKS
-- ----------------------------------------------------------------------------

-- 3.1 APPLETON COURT (Ajah / Akachukwu St)
UPDATE public.properties SET
  image = '/images/appleton_court_aerial_clean.jpg',
  gallery_images = ARRAY[
    '/images/appleton_court_aerial_clean.jpg',
    '/images/appleton_court_exterior_real.jpg',
    '/images/appleton_court_interior_living.jpg',
    '/images/appleton_court_interior_stairs.jpg',
    '/images/IMG-20260919-WA0004 (1).jpg',
    '/images/IMG-20260919-WA0005 (1).jpg',
    '/images/IMG-20260919-WA0006.jpg'
  ],
  video_url = 'https://www.youtube.com/embed/qa550kq6gc8',
  video_list = '[
    {
      "url": "https://www.youtube.com/embed/qa550kq6gc8",
      "title": "Welcome to Appleton Court",
      "duration": "03:15",
      "description": "Official estate tour of Appleton Court on Emmanuel Akachukwu St, Ajah, by Caih Properties."
    }
  ]'::jsonb,
  video_coming_soon = false
WHERE id = 'appleton-court';

-- 3.2 APPLETON GARDENS (Idera Scheme, Eleko)
UPDATE public.properties SET
  image = '/images/appleton_gardens_hero.jpg',
  gallery_images = ARRAY[
    '/images/appleton_gardens_hero.jpg',
    '/images/appleton_gardens_greenery.jpg',
    '/images/appleton_enclave_entrance.jpg'
  ],
  video_url = NULL,
  video_list = '[]'::jsonb,
  video_coming_soon = false
WHERE id = 'appleton-gardens';

-- 3.3 APPLETON HAVEN (Victoria Island)
UPDATE public.properties SET
  image = 'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.10-1-e1770664687158.jpg',
  gallery_images = ARRAY[
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.10-1-e1770664687158.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.14.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.14-1.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.14-2.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.14-3.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.13.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12-4.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12-3.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12-2.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12-5.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.10.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.11-3.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12.jpg',
    'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.12-1.jpg'
  ],
  video_url = 'https://player.vimeo.com/video/1051104651',
  video_list = '[
    {
      "url": "https://player.vimeo.com/video/1051104651",
      "title": "Appleton Haven: Luxury Residential Tour (Victoria Island)",
      "duration": "03:45",
      "description": "Ultra-luxurious residential tower on Balarabe Musa Crescent, Victoria Island, featuring swimming pool, concierge, and elevator."
    }
  ]'::jsonb,
  video_coming_soon = false
WHERE id = 'appleton-haven';

-- 3.4 APPLETON APARTMENTS & MAISONETTE (Lekki Phase 1)
UPDATE public.properties SET
  image = 'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette3-1-e1770664790399.jpeg',
  gallery_images = ARRAY[
    'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette3-1-e1770664790399.jpeg',
    'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette1.jpeg',
    'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette2.jpeg',
    'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette3.jpeg',
    'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette4.jpeg'
  ],
  video_url = 'https://player.vimeo.com/video/1051104651',
  video_list = '[
    {
      "url": "https://player.vimeo.com/video/1051104651",
      "title": "Appleton Apartments & Maisonette: Lekki Phase 1 Tour",
      "duration": "05:12",
      "description": "Executive apartments & maisonettes on Remi Olowude Street, Lekki Phase 1, with rooftop pool and smart home technology."
    }
  ]'::jsonb,
  video_coming_soon = false
WHERE id = 'appleton-luxury-apartments';

-- 3.5 APPLETON TERRACES AND APARTMENTS (Ogombo Road, Lekki)
UPDATE public.properties SET
  image = 'https://caihgroup.com/wp-content/uploads/2025/01/SL-070720-32260-33-scaled.jpg',
  gallery_images = ARRAY[
    'https://caihgroup.com/wp-content/uploads/2025/01/SL-070720-32260-33-scaled.jpg'
  ],
  video_url = NULL,
  video_list = '[]'::jsonb,
  video_coming_soon = true
WHERE id = 'appleton-terraces-and-apartments';

-- 3.6 APPLETON ENCLAVE (Free Trade Zone, Ibeju-Lekki)
UPDATE public.properties SET
  image = '/images/appleton_enclave_entrance.jpg',
  gallery_images = ARRAY[
    '/images/appleton_enclave_entrance.jpg',
    '/images/yt_ihEzpBhqRjY.jpg'
  ],
  video_url = 'https://www.youtube.com/embed/ihEzpBhqRjY',
  video_list = '[
    {
      "url": "https://www.youtube.com/embed/ihEzpBhqRjY",
      "title": "Premium Living at Appleton Enclave: Prime Plots in Ibeju Lekki",
      "duration": "03:45",
      "description": "Official site video tour of Appleton Enclave in the Free Trade Zone corridor."
    },
    {
      "url": "https://vimeo.com/1235852176?fl=ip&fe=ec",
      "title": "Appleton Enclave: Aerial Drone Survey & Topography Tour",
      "duration": "04:32",
      "description": "Aerial drone inspection of the 100% dry table topography, perimeter fencing, and internal road network in Idera Scheme, Eleko."
    }
  ]'::jsonb,
  video_coming_soon = false
WHERE id = 'appleton-enclave';

-- 3.7 APPLETON COMMERCIAL & RESIDENCES (Origanrigan, Free Trade Zone)
UPDATE public.properties SET
  image = 'https://caihgroup.com/wp-content/uploads/2026/02/commercial-e1770636774756.jpeg',
  gallery_images = ARRAY[
    'https://caihgroup.com/wp-content/uploads/2026/02/commercial-e1770636774756.jpeg',
    '/images/regenerated_image_1791992702647.png'
  ],
  video_url = 'https://vimeo.com/1235840039?fl=ip&fe=ec',
  video_list = '[
    {
      "url": "https://vimeo.com/1235840039?fl=ip&fe=ec",
      "title": "Appleton Commercial & Residences: Free Trade Zone Corridor Tour",
      "duration": "05:15",
      "description": "Strategic corridor inspection by Dangote Refinery Axis and Lekki Free Trade Zone."
    }
  ]'::jsonb,
  video_coming_soon = false
WHERE id = 'appleton-commercial-residential';

-- ----------------------------------------------------------------------------
-- 4. INSERT VIDEO DISPATCHES (SITE WALKTHROUGHS & MEDIA REEL)
-- ----------------------------------------------------------------------------
INSERT INTO public.video_dispatches (id, title, tag, duration, thumbnail, embed_url, speaker, description, property_id)
VALUES
(
  'vid-1',
  'Appleton Haven: Luxury Penthouse & Maisonette Tour (Victoria Island)',
  'ON-SITE WALKTHROUGH',
  '04:18',
  'https://caihgroup.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-05-at-09.28.10-1-e1770664687158.jpg',
  'https://player.vimeo.com/video/1051104651',
  'Caih Group Architectural Directorate',
  'Exclusive tour of Appleton Haven in Victoria Island, showcasing bespoke Italian kitchens, soaring ceilings, and panoramic skyline views.',
  'appleton-haven'
),
(
  'vid-2',
  'Welcome to Appleton Court (Ajah)',
  'COMPLETED PROJECT',
  '03:15',
  'https://i.ytimg.com/vi/qa550kq6gc8/hqdefault.jpg',
  'https://www.youtube.com/embed/qa550kq6gc8',
  'Caih Properties',
  'Official estate tour and walkthrough of Appleton Court on Emmanuel Akachukwu Street, Ajah by Caih Properties.',
  'appleton-court'
),
(
  'vid-3',
  'Appleton Apartments & Maisonette: Lekki Phase 1 Rooftop & Interiors',
  'LEKKI PHASE 1',
  '05:12',
  'https://caihgroup.com/wp-content/uploads/2026/02/ApartmentMaisonnette3-1-e1770664790399.jpeg',
  'https://player.vimeo.com/video/1051104651',
  'Caih Group Real Estate Advisory',
  'Exploring smart home features, executive maisonettes, and rooftop pool on Remi Olowude Street, Lekki Phase 1.',
  'appleton-luxury-apartments'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  tag = EXCLUDED.tag,
  duration = EXCLUDED.duration,
  thumbnail = EXCLUDED.thumbnail,
  embed_url = EXCLUDED.embed_url,
  speaker = EXCLUDED.speaker,
  description = EXCLUDED.description,
  property_id = EXCLUDED.property_id,
  updated_at = NOW();

-- ----------------------------------------------------------------------------
-- 5. VERIFICATION QUERIES (RUN THESE TO CONFIRM YOUR DATA)
-- ----------------------------------------------------------------------------
-- View property images and video links:
-- SELECT id, title, image, video_url, jsonb_array_length(video_list) AS video_count, array_length(gallery_images, 1) AS gallery_count FROM public.properties;

-- View video dispatches:
-- SELECT id, title, tag, embed_url, thumbnail FROM public.video_dispatches;
