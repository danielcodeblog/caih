-- ============================================================================
-- SQL: APPLETON GARDENS (ONLY) FOR PROPERTIES TABLE
-- Target Database: Supabase / PostgreSQL
-- Table: public.properties
-- Description: Standalone Upsert SQL for Appleton Gardens development at
--              Idera Government Scheme, Eleko, Lagos.
-- ============================================================================

-- Optional: Ensure table exists if running in isolation
CREATE TABLE IF NOT EXISTS public.properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  corridor TEXT NOT NULL DEFAULT 'Idera',
  property_type TEXT NOT NULL DEFAULT 'plots',
  price_category TEXT NOT NULL DEFAULT 'mid',
  status TEXT NOT NULL DEFAULT 'ongoing',
  status_label TEXT NOT NULL DEFAULT 'Selling Fast',
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

-- ============================================================================
-- UPSERT STATEMENT: ONLY APPLETON GARDENS
-- ============================================================================
INSERT INTO public.properties (
  id,
  title,
  location,
  corridor,
  property_type,
  price_category,
  status,
  status_label,
  badge,
  secondary_badge,
  image,
  price_display,
  price_sub,
  specs,
  summary,
  detailed_description,
  key_features,
  handover_date,
  payment_type,
  starting_deposit,
  units_or_plots,
  gallery_images,
  faq_pdf_url,
  map_embed_url,
  neighbourhood,
  payment_table,
  banking_details,
  faqs,
  updated_at
) VALUES (
  'appleton-gardens',
  'Appleton Gardens',
  'Idera Government Scheme, Eleko, Lagos',
  'Idera',
  'plots',
  'mid',
  'ongoing',
  'Selling Fast',
  'APPLETON GARDENS',
  'IDERA SCHEME • ELEKO LAGOS',
  '/images/appleton_gardens_hero.jpg',
  'From ₦40M',
  '300sqm (₦40M) • 500sqm (₦75M) • 1,000sqm (₦160M)',
  '{"area": "300 sqm – 1,000 sqm", "landType": "100% Dry Table Land", "titleType": "Idera Government Scheme Allocation"}'::jsonb,
  'Discover Appleton Gardens, located at Idera Government Scheme, Eleko, Lagos. A place to build your future, offering prime serviced land plots of 300 sqm, 500 sqm, and 1,000 sqm with paved roads, constant electricity, water, and 24/7 security.',
  'Appleton Gardens is a place to build your future. Located at the prestigious Idera Government Scheme, Eleko, Lagos, this estate is situated close to the proposed Lekki International Airport, Pan-Atlantic University, and Anglican Centenary City. Designed with modern estate infrastructure, Appleton Gardens features well-paved roads, constant electricity, water supply, children''s play area, lush greenery, and dedicated estate security.',
  ARRAY[
    'Well-Paved Internal Road Network',
    'Constant Electricity Infrastructure',
    'Treated Water Supply',
    'Landscaped Greenery Area',
    'Children''s Recreational Play Area',
    '24/7 Gated Perimeter Security & Access Control',
    '100% Dry Table Land (Zero Sand-Filling Needed)',
    'Strategic Proximity to Proposed Lekki Airport'
  ],
  'Immediate Allocation',
  'Direct Allocation & Flexible Spread',
  '₦10,000,000',
  '[
    {
      "id": "appleton-gardens-300",
      "name": "300sqm Serviced Plot",
      "size": "300 sqm",
      "priceDisplay": "₦40M",
      "priceSub": "₦40,000,000 Total Outright",
      "deposit": "₦10,000,000",
      "paymentType": "Flexible Installments",
      "landType": "100% Dry Land",
      "titleType": "Idera Government Scheme Allocation",
      "isPopular": true,
      "features": [
        "₦40M Total Plot Price",
        "300 sqm Table Land",
        "Close to Proposed Airport",
        "Well-Paved Roads & Drainage"
      ],
      "description": "Prime 300sqm serviced plot at Appleton Gardens, Idera Government Scheme, Eleko."
    },
    {
      "id": "appleton-gardens-500",
      "name": "500sqm Serviced Plot",
      "size": "500 sqm",
      "priceDisplay": "₦75M",
      "priceSub": "₦75,000,000 Total Outright",
      "deposit": "₦15,000,000",
      "paymentType": "Flexible Installments",
      "landType": "100% Dry Land",
      "titleType": "Idera Government Scheme Allocation",
      "isPopular": false,
      "features": [
        "₦75M Total Plot Price",
        "500 sqm Standard Residential Plot",
        "Near Pan-Atlantic University",
        "Constant Electricity & Water"
      ],
      "description": "Standard 500sqm residential parcel in Appleton Gardens, Eleko."
    },
    {
      "id": "appleton-gardens-1000",
      "name": "1,000sqm Commercial / Residential Parcel",
      "size": "1,000 sqm",
      "priceDisplay": "₦160M",
      "priceSub": "₦160,000,000 Total Outright",
      "deposit": "₦30,000,000",
      "paymentType": "Flexible Installments",
      "landType": "100% Dry Land",
      "titleType": "Idera Government Scheme Allocation",
      "isPopular": false,
      "features": [
        "₦160M Total Parcel Price",
        "1,000 sqm Double Plot Parcel",
        "High Capital Yield Potential",
        "Suitable for Villas or Multi-Unit Flats"
      ],
      "description": "Expansive 1,000sqm parcel for luxury residential or mixed-use development."
    }
  ]'::jsonb,
  ARRAY[
    '/images/appleton_gardens_hero.jpg',
    '/images/appleton_gardens_greenery.jpg',
    '/images/appleton_enclave_entrance.jpg'
  ],
  'https://caihgroup.com/wp-content/uploads/2024/11/APPLETON-FORM-FAQ.pdf',
  'https://maps.google.com/maps?q=Eleko%2C%20Lagos&t=m&z=14&output=embed&iwloc=near',
  ARRAY[
    'Proposed Lekki International Airport',
    'Pan-Atlantic University (PAU)',
    'Anglican Centenary City',
    'Eleko Beach & Coastal Highway Axis',
    'Alaro City & Lekki Free Trade Zone Corridor',
    'Amen Estate Phase 1 & 2'
  ],
  '[
    {"plotSize": "300 sqm", "initialDeposit": "₦10,000,000", "threeMonths": "₦40,000,000", "sixMonths": "₦43,000,000"},
    {"plotSize": "500 sqm", "initialDeposit": "₦15,000,000", "threeMonths": "₦75,000,000", "sixMonths": "₦80,000,000"},
    {"plotSize": "1,000 sqm", "initialDeposit": "₦30,000,000", "threeMonths": "₦160,000,000", "sixMonths": "₦170,000,000"}
  ]'::jsonb,
  '{"accountName": "CAIH RESOURCES LIMITED", "bankName": "TAJ BANK", "accountNumber": "0008343786"}'::jsonb,
  '[
    {"question": "Where is APPLETON GARDENS located?", "answer": "Appleton Gardens is located at Idera Government Scheme, Eleko, Lagos State, with close proximity to the proposed Lekki International Airport, Pan-Atlantic University, and Anglican Centenary City."},
    {"question": "What plot sizes and prices are available at Appleton Gardens?", "answer": "Plots are offered in 300 sqm at ₦40,000,000, 500 sqm at ₦75,000,000, and 1,000 sqm at ₦160,000,000."},
    {"question": "What infrastructure is provided in Appleton Gardens?", "answer": "The estate features well-paved internal roads, constant electricity, treated potable water supply, landscaped greenery areas, children''s play area, and round-the-clock security."},
    {"question": "Who is the developer of Appleton Gardens?", "answer": "Caih Group (Caih Properties / Caih Resources Limited). Phone: 0906 688 7444, Instagram: @caihproperties, Website: www.caihgroup.com."}
  ]'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  corridor = EXCLUDED.corridor,
  property_type = EXCLUDED.property_type,
  price_category = EXCLUDED.price_category,
  status = EXCLUDED.status,
  status_label = EXCLUDED.status_label,
  badge = EXCLUDED.badge,
  secondary_badge = EXCLUDED.secondary_badge,
  image = EXCLUDED.image,
  price_display = EXCLUDED.price_display,
  price_sub = EXCLUDED.price_sub,
  specs = EXCLUDED.specs,
  summary = EXCLUDED.summary,
  detailed_description = EXCLUDED.detailed_description,
  key_features = EXCLUDED.key_features,
  handover_date = EXCLUDED.handover_date,
  payment_type = EXCLUDED.payment_type,
  starting_deposit = EXCLUDED.starting_deposit,
  units_or_plots = EXCLUDED.units_or_plots,
  gallery_images = EXCLUDED.gallery_images,
  faq_pdf_url = EXCLUDED.faq_pdf_url,
  map_embed_url = EXCLUDED.map_embed_url,
  neighbourhood = EXCLUDED.neighbourhood,
  payment_table = EXCLUDED.payment_table,
  banking_details = EXCLUDED.banking_details,
  faqs = EXCLUDED.faqs,
  updated_at = NOW();
