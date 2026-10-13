import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Project, Article, VideoDispatch, PageId } from '../types';
import { PROJECTS, ARTICLES, VIDEO_DISPATCHES, TESTIMONIALS, BRAND_ASSETS } from '../data/mockData';
import gsap from 'gsap';
import {
  Search,
  MapPin,
  Building2,
  Calendar,
  CheckCircle,
  Play,
  ArrowRight,
  ShieldCheck,
  Phone,
  Layers,
  Sparkles,
  Plus,
  Minus,
  Zap,
  CreditCard,
  Shield,
  Sun
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (page: PageId) => void;
  onViewProject: (project: Project) => void;
  onViewArticle: (article: Article) => void;
  onViewVideo: (video: VideoDispatch) => void;
  onBookInspection: (projectTitle?: string) => void;
  onSearchSubmit?: (filters: { keyword: string; type: string; location: string; beds: string }) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onViewProject,
  onViewArticle,
  onViewVideo,
  onBookInspection,
  onSearchSubmit
}) => {
  // Hero Search Dock State
  const [selectedType, setSelectedType] = useState('ALL TYPES');
  const [keyword, setKeyword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('ALL LOCATIONS');
  const [selectedBeds, setSelectedBeds] = useState('ANY');
  const [selectedPriceBracket, setSelectedPriceBracket] = useState('ANY');

  // Dark Section Active Category Tab
  const [activeCategory, setActiveCategory] = useState<'apartment' | 'house' | 'office' | 'villa'>('apartment');

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.25, ease: 'power3.out' }
      );
    }
  }, []);

  // Filter properties based on dark section category and hero search
  const filteredProperties = useMemo(() => {
    return PROJECTS.filter((p) => {
      // Keyword match
      if (keyword.trim()) {
        const query = keyword.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesLocation = p.location.toLowerCase().includes(query);
        const matchesSummary = p.summary.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation && !matchesSummary) return false;
      }

      // Type match from Hero
      if (selectedType !== 'ALL TYPES') {
        if (selectedType === 'RESIDENTIAL' && p.propertyType !== 'residential') return false;
        if (selectedType === 'COMMERCIAL' && p.propertyType !== 'commercial') return false;
        if (selectedType === 'PLOTS' && p.propertyType !== 'plots') return false;
        if (selectedType === 'INDUSTRIAL' && p.propertyType !== 'industrial') return false;
      }

      // Advanced filters
      if (selectedLocation !== 'ALL LOCATIONS') {
        if (!p.location.toLowerCase().includes(selectedLocation.toLowerCase()) && !p.corridor.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      if (selectedBeds !== 'ANY') {
        const bedNum = parseInt(selectedBeds, 10);
        if (p.specs.beds !== bedNum) return false;
      }

      return true;
    });
  }, [keyword, selectedType, selectedLocation, selectedBeds]);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit({
        keyword,
        type: selectedType,
        location: selectedLocation,
        beds: selectedBeds
      });
    } else {
      onNavigate('projects');
    }
  };

  const handleCategorySelect = (cat: 'apartment' | 'house' | 'office' | 'villa') => {
    setActiveCategory(cat);
    if (cat === 'apartment' || cat === 'house') {
      setSelectedType('RESIDENTIAL');
    } else if (cat === 'office') {
      setSelectedType('COMMERCIAL');
    } else if (cat === 'villa') {
      setSelectedType('RESIDENTIAL');
    }
    const el = document.getElementById('featured-properties-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full bg-white">
      {/* =========================================================================
          SECTION 1: HERO SECTION (EXACT STYLE FROM SCREENSHOT 1)
          - Full-bleed luxury residential facade
          - Uppercase subtitle: "Victoria Crest Homes: Most Recommended Real Estate Company in Lagos"
          - Big bold title: "FIND YOUR DREAM HOME"
          - Cyan underline bar
          - Ambient description
          - "FOR SALE" tab with clean white search dock & "ADVANCED +" button
         ========================================================================= */}
      <section className="relative w-full min-h-[660px] sm:min-h-[720px] md:min-h-[780px] lg:min-h-[820px] xl:min-h-[850px] flex flex-col justify-between pt-16 sm:pt-22 md:pt-28 pb-10 sm:pb-12 md:pb-14 overflow-hidden">
        {/* Full-bleed background image with modern luxury terraces */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/caih_luxury_residence_1791879278290.jpg"
            alt="Caih Group Premier Luxury Residences in Lagos"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Subtle dark film overlay for optimal contrast matching Screenshot 1 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75"></div>
        </div>

        {/* Hero Content (Centered typography - exact from Screenshot 1) */}
        <div ref={heroRef} className="relative z-10 max-w-[1320px] mx-auto px-6 sm:px-10 w-full flex-1 flex flex-col items-center justify-center text-center pt-6 sm:pt-8 pb-4 sm:pb-6">
          {/* Massive Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[88px] text-white tracking-tight uppercase leading-[1.05] drop-shadow-lg max-w-5xl mb-6">
            FIND YOUR DREAM HOME
          </h1>

          {/* Emotional Narrative Paragraph */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-100 max-w-4xl mx-auto leading-relaxed drop-shadow">
            Discover premier luxury residences and master-planned communities across Lagos with Caih Group. From upcoming off-plan developments like Appleton Enclave to fully delivered homes like Appleton Court, explore living spaces crafted for comfort, prestige, and lasting value.
          </p>
        </div>

        {/* Hero Search Dock (Exact layout & styling from Screenshot 1) */}
        <div className="relative z-10 max-w-[1120px] mx-auto px-6 sm:px-8 w-full mt-8 sm:mt-10">
          {/* "FOR SALE" White Tab */}
          <div className="flex items-center">
            <div className="bg-white text-[#000f22] font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-t-lg shadow-md border-t border-x border-[#E2E8F0]">
              FOR SALE
            </div>
          </div>

          {/* Main White Dock */}
          <form
            onSubmit={handleHeroSubmit}
            className="bg-white rounded-b-xl rounded-tr-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-[#E2E8F0] overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] items-stretch">
              {/* Column 1: Type Dropdown */}
              <div className="md:col-span-4 p-4 sm:p-5 flex flex-col justify-center">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  Type
                </label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-transparent text-[#000f22] font-extrabold text-sm sm:text-base uppercase tracking-wide focus:outline-none cursor-pointer appearance-none pr-6"
                  >
                    <option value="ALL TYPES">ALL TYPES</option>
                    <option value="RESIDENTIAL">RESIDENTIAL TERRACES</option>
                    <option value="COMMERCIAL">COMMERCIAL ARCADES</option>
                    <option value="PLOTS">SERVICED PLOTS</option>
                    <option value="INDUSTRIAL">INDUSTRIAL PARKS</option>
                  </select>
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#000f22] font-bold text-xs">
                    ▼
                  </span>
                </div>
              </div>

              {/* Column 2: Keyword Input */}
              <div className="md:col-span-5 p-4 sm:p-5 flex flex-col justify-center">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  Keyword
                </label>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleHeroSubmit(e);
                      }
                    }}
                    placeholder="Enter Keyword..."
                    className="w-full bg-transparent text-[#000f22] text-sm placeholder:text-[#94A3B8] focus:outline-none"
                  />
                  <Search
                    onClick={(e) => handleHeroSubmit(e as any)}
                    className="w-5 h-5 text-[#64748B] hover:text-[#000f22] shrink-0 ml-2 cursor-pointer transition-colors"
                  />
                </div>
              </div>

              {/* Column 3: Search Button */}
              <div className="md:col-span-3 bg-[#b7102a] hover:bg-[#a00e24] transition-colors flex items-center justify-center p-4 sm:p-5">
                <button
                  type="submit"
                  className="w-full h-full flex items-center justify-center gap-2 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>SEARCH</span>
                </button>
              </div>
            </div>

            {/* Advanced Toggle Link Bar */}
            <div className="px-5 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Need specific locations, corridors or bedroom configurations?</span>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[#b7102a] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showAdvanced ? 'Hide Advanced Filters' : '+ Advanced Filters'}
              </button>
            </div>

            {/* Advanced Drawer Expansion */}
            {showAdvanced && (
              <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">
                    Location Corridor
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2.5 text-xs font-bold text-[#000f22]"
                  >
                    <option value="ALL LOCATIONS">All Corridors (Lagos & Abuja)</option>
                    <option value="Lekki Phase 2">Lekki Phase 2</option>
                    <option value="Ajah">Ajah Axis</option>
                    <option value="Epe">Epe Expressway</option>
                    <option value="Victoria Island">Victoria Island</option>
                    <option value="Guzape">Guzape Abuja</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">
                    Bedrooms
                  </label>
                  <select
                    value={selectedBeds}
                    onChange={(e) => setSelectedBeds(e.target.value)}
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-2.5 text-xs font-bold text-[#000f22]"
                  >
                    <option value="ANY">Any Configuration</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-[#000f22] text-white text-xs font-bold hover:bg-[#0a2540] transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType('ALL TYPES');
                      setKeyword('');
                      setSelectedLocation('ALL LOCATIONS');
                      setSelectedBeds('ANY');
                    }}
                    className="px-4 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-[#475569] text-xs font-semibold hover:bg-slate-100"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FEATURED PROPERTIES (EXACT STYLE FROM SCREENSHOT 2 BOTTOM)
          - Centered Subtitle: "Featured Properties"
          - Heading: "Find Premium Lagos Properties That Deliver Both Lifestyle And Investment Growth"
          - Clean property cards with View Details & Plan (Dedicated Page navigation, NO POP-UP!)
         ========================================================================= */}
      <section
        className="w-full bg-white py-16 md:py-24 border-b border-[#E2E8F0]"
        id="featured-properties-section"
      >
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          {/* Centered Section Header from Screenshot 2 */}
          <div className="text-center max-w-4xl mx-auto mb-14">
            <span className="text-sm sm:text-base font-bold text-[#000f22] block mb-2">
              Featured Properties
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-[42px] font-extrabold text-[#000f22] tracking-tight leading-snug">
              Find Premium Lagos Properties That Deliver Both Lifestyle And Investment Growth
            </h2>
          </div>

          {/* Grid of Clean Property Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.slice(0, 4).map((prop) => (
              <div
                key={prop.id}
                className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative">
                  {/* Visual Frame */}
                  <div className="h-60 overflow-hidden relative">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {prop.badge && (
                        <span className="px-2.5 py-1 rounded bg-[#b7102a] text-white text-[10px] uppercase font-bold tracking-wider shadow-sm">
                          {prop.badge}
                        </span>
                      )}
                      {prop.secondaryBadge && (
                        <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider">
                          {prop.secondaryBadge}
                        </span>
                      )}
                    </div>
                  </div>

                    {/* Metadata & Description */}
                    <div className="p-5">
                      <div className="flex items-center gap-1 text-xs text-[#94A3B8] mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#b7102a]" />
                        <span>{prop.location}</span>
                      </div>

                      <h3 className="text-base font-bold text-[#000f22] group-hover:text-[#b7102a] transition-colors line-clamp-1">
                        {prop.title}
                      </h3>

                      {/* Specs Ribbon */}
                      <div className="grid grid-cols-3 gap-2 py-3 mt-2 border-y border-[#E2E8F0] text-xs text-[#475569]">
                        <div className="font-semibold text-[#000f22]">
                          {prop.specs.beds ? `${prop.specs.beds} Beds` : prop.specs.landType || 'Commercial'}
                        </div>
                        <div className="font-semibold text-[#000f22]">
                          {prop.specs.baths ? `${prop.specs.baths} Baths` : 'Serviced'}
                        </div>
                        <div className="font-semibold text-[#000f22]">
                          {prop.specs.area || '3,549 sqft'}
                        </div>
                      </div>

                      {/* Pricing Tag */}
                      <div className="mt-3">
                        <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider block">
                          Initial Deposit / Milestone
                        </span>
                        <div className="text-lg font-extrabold text-[#b7102a]">
                          {prop.priceDisplay}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action -> Routes to Dedicated Full Page (NO POP-UP!) */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => onViewProject(prop)}
                      className="w-full py-2.5 rounded bg-[#F8FAFC] hover:bg-[#000f22] hover:text-white border border-[#E2E8F0] text-xs font-bold text-[#000f22] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <span>View Details & Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* View All Properties Link */}
          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#000f22] hover:bg-[#0a2540] text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
            >
              <span>Explore All Selling Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: DARK CATEGORIES SECTION (EXACT STYLE FROM SCREENSHOT 2)
          - Put after Featured Properties per user request
          - Pure midnight black background
          - Green/teal topographic elevation contour lines on left and right
          - "LOOKING TO BUY A NEW APARTMENT IN LAGOS?"
          - Subtitle: Sleep soundly knowing your investment is secure...
          - 4 Architectural Category Icons: Apartment, House, Office, Villa with vertical dividers
         ========================================================================= */}
      <section className="relative w-full bg-[#000000] text-white py-20 lg:py-28 overflow-hidden border-b border-neutral-900">
        {/* Left Topographic Contour Wave Lines (Authentic SVG vectors from Screenshot 2) */}
        <div className="absolute left-0 top-0 bottom-0 w-80 md:w-96 pointer-events-none opacity-30 select-none overflow-hidden">
          <svg
            viewBox="0 0 400 600"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.2"
            className="w-full h-full object-cover"
          >
            <path d="M-50,50 C50,80 120,40 180,120 C240,200 160,320 230,400 C300,480 320,520 280,650" />
            <path d="M-70,80 C30,110 100,70 160,150 C220,230 140,350 210,430 C280,510 300,550 260,680" />
            <path d="M-90,110 C10,140 80,100 140,180 C200,260 120,380 190,460 C260,540 280,580 240,710" />
            <path d="M-110,140 C-10,170 60,130 120,210 C180,290 100,410 170,490 C240,570 260,610 220,740" />
            <path d="M-130,170 C-30,200 40,160 100,240 C160,320 80,440 150,520 C220,600 240,640 200,770" />
            <path d="M-150,200 C-50,230 20,190 80,270 C140,350 60,470 130,550 C200,630 220,670 180,800" />
          </svg>
        </div>

        {/* Right Topographic Contour Wave Lines (Authentic SVG vectors from Screenshot 2) */}
        <div className="absolute right-0 top-0 bottom-0 w-80 md:w-96 pointer-events-none opacity-30 select-none overflow-hidden">
          <svg
            viewBox="0 0 400 600"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.2"
            className="w-full h-full object-cover scale-x-[-1]"
          >
            <path d="M-50,50 C50,80 120,40 180,120 C240,200 160,320 230,400 C300,480 320,520 280,650" />
            <path d="M-70,80 C30,110 100,70 160,150 C220,230 140,350 210,430 C280,510 300,550 260,680" />
            <path d="M-90,110 C10,140 80,100 140,180 C200,260 120,380 190,460 C260,540 280,580 240,710" />
            <path d="M-110,140 C-10,170 60,130 120,210 C180,290 100,410 170,490 C240,570 260,610 220,740" />
            <path d="M-130,170 C-30,200 40,160 100,240 C160,320 80,440 150,520 C220,600 240,640 200,770" />
            <path d="M-150,200 C-50,230 20,190 80,270 C140,350 60,470 130,550 C200,630 220,670 180,800" />
          </svg>
        </div>

        {/* Center Typography & Category Cards */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 text-center">
          {/* Main Question Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase leading-snug">
            LOOKING TO BUY A NEW APARTMENT IN LAGOS?
          </h2>

          {/* Subtitle Guarantee Paragraph */}
          <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-3xl mx-auto mt-4 mb-16 leading-relaxed">
            Sleep soundly knowing your investment is secure. Legitimate titles with C of O and proper government approval. Durable construction using quality materials. Fully developed estates with roads, top-tier drainage, electricity, water, and round-the-clock security.
          </p>

          {/* 4 Category Architectural Selector Columns with Delicate Hairline Dividers */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/15 max-w-4xl mx-auto border-y md:border-y-0 border-white/15 bg-neutral-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* 1. Apartment */}
            <button
              onClick={() => handleCategorySelect('apartment')}
              className={`p-6 sm:p-8 flex flex-col items-center justify-center group cursor-pointer transition-all ${
                activeCategory === 'apartment' ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
            >
              {/* Custom Line Icon: Multi-story Building with Checkmark in Badge */}
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="w-14 h-14"
                >
                  {/* Left building */}
                  <rect x="12" y="14" width="22" height="42" rx="1" />
                  <line x1="18" y1="20" x2="22" y2="20" />
                  <line x1="26" y1="20" x2="30" y2="20" />
                  <line x1="18" y1="28" x2="22" y2="28" />
                  <line x1="26" y1="28" x2="30" y2="28" />
                  <line x1="18" y1="36" x2="22" y2="36" />
                  <line x1="26" y1="36" x2="30" y2="36" />
                  <line x1="18" y1="44" x2="22" y2="44" />
                  <line x1="26" y1="44" x2="30" y2="44" />
                  {/* Right building top */}
                  <path d="M34 24 H48 V38" />
                  {/* Verified circular badge with checkmark at bottom right */}
                  <circle cx="44" cy="46" r="10" fill="#000000" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M40 46 L43 49 L49 43" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm font-semibold tracking-wide text-white group-hover:text-[#00a8ff] transition-colors">
                Apartment
              </span>
            </button>

            {/* 2. House */}
            <button
              onClick={() => handleCategorySelect('house')}
              className={`p-6 sm:p-8 flex flex-col items-center justify-center group cursor-pointer transition-all ${
                activeCategory === 'house' ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
            >
              {/* Custom Line Icon: Arc Floor Lamp + Living Room Sofa */}
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="w-14 h-14"
                >
                  {/* Arc lamp on left */}
                  <path d="M16 56 V24 C16 16 26 14 28 20" />
                  {/* Lamp shade */}
                  <path d="M24 20 H32 L34 26 H22 Z" />
                  <line x1="28" y1="26" x2="28" y2="29" />
                  {/* Base */}
                  <line x1="12" y1="56" x2="20" y2="56" />
                  {/* Modern Sofa */}
                  <rect x="22" y="38" width="30" height="18" rx="2" />
                  <line x1="26" y1="38" x2="26" y2="56" />
                  <line x1="48" y1="38" x2="48" y2="56" />
                  <line x1="22" y1="46" x2="52" y2="46" />
                  {/* Sofa legs */}
                  <line x1="26" y1="56" x2="26" y2="60" />
                  <line x1="48" y1="56" x2="48" y2="60" />
                </svg>
              </div>
              <span className="text-sm font-semibold tracking-wide text-white group-hover:text-[#00a8ff] transition-colors">
                House
              </span>
            </button>

            {/* 3. Office */}
            <button
              onClick={() => handleCategorySelect('office')}
              className={`p-6 sm:p-8 flex flex-col items-center justify-center group cursor-pointer transition-all ${
                activeCategory === 'office' ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
            >
              {/* Custom Line Icon: Twin Corporate Skyscrapers */}
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="w-14 h-14"
                >
                  {/* Left Tower */}
                  <rect x="14" y="20" width="16" height="36" rx="1" />
                  <line x1="22" y1="12" x2="22" y2="20" />
                  <line x1="18" y1="26" x2="26" y2="26" />
                  <line x1="18" y1="32" x2="26" y2="32" />
                  <line x1="18" y1="38" x2="26" y2="38" />
                  <line x1="18" y1="44" x2="26" y2="44" />
                  {/* Right Tower */}
                  <rect x="34" y="20" width="16" height="36" rx="1" />
                  <line x1="42" y1="12" x2="42" y2="20" />
                  <line x1="38" y1="26" x2="46" y2="26" />
                  <line x1="38" y1="32" x2="46" y2="32" />
                  <line x1="38" y1="38" x2="46" y2="38" />
                  <line x1="38" y1="44" x2="46" y2="44" />
                  {/* Sky bridge connector */}
                  <line x1="30" y1="34" x2="34" y2="34" />
                  <line x1="30" y1="38" x2="34" y2="38" />
                </svg>
              </div>
              <span className="text-sm font-semibold tracking-wide text-white group-hover:text-[#00a8ff] transition-colors">
                Office
              </span>
            </button>

            {/* 4. Villa */}
            <button
              onClick={() => handleCategorySelect('villa')}
              className={`p-6 sm:p-8 flex flex-col items-center justify-center group cursor-pointer transition-all ${
                activeCategory === 'villa' ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
            >
              {/* Custom Line Icon: Gable House with Eco Leaf Emblem */}
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="w-14 h-14"
                >
                  {/* Pitched Roof outline */}
                  <path d="M12 28 L32 12 L52 28 V56 H12 Z" />
                  {/* Leaf inside */}
                  <path d="M32 26 C26 30 24 40 32 48 C40 40 38 30 32 26 Z" fill="none" />
                  <line x1="32" y1="28" x2="32" y2="48" />
                  <line x1="32" y1="35" x2="28" y2="32" />
                  <line x1="32" y1="40" x2="36" y2="37" />
                </svg>
              </div>
              <span className="text-sm font-semibold tracking-wide text-white group-hover:text-[#00a8ff] transition-colors">
                Villa
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THE THREE STRUCTURAL PILLARS (Properties, Construction, Resources)
         ========================================================================= */}
      <section className="w-full bg-[#F8FAFC] py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a]">
                Conglomerate Synergy
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#000f22] tracking-tight">
              The Three Structural Pillars of Caih Group
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-2">
              Integrating master-planned real estate, turnkey civil construction, and heavy industrial building resources into a unified sovereign powerhouse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Pillar 1 */}
            <div className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-60 overflow-hidden relative">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpC47bcbE54rAaCiLNXn7XfkPu0Nipp9jOyIxTI5sQZ2I_JwWekuN-ThsRaiv3Cb1F7Q9-1CWxei5URI_nq5mJP_wNI8sI-3LcqSmvvnPoyxvpaUJzI4y7-6zoUtdBESR5ita26AJhkObPsB9vs1GSTHPIfD2yNNyzF4iOunfFnbXKgRs0Ue1k8lmTKAFWdD_obvPTxq8xnyRJM8Xcrhc5YlaVcQBABN9ZZcJU3j-01NmBmHBizgqwuw"
                    alt="Caih Properties"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-[#000f22] text-white px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider shadow-sm">
                    01. Properties
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#000f22]">Caih Properties</h3>
                  <p className="text-xs sm:text-sm text-[#475569] mt-2 leading-relaxed">
                    Master-planned residential communities, serviced estates, and Appleton Enclave series across Lekki and Lagos corridors.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                      <CheckCircle className="w-4 h-4 text-[#b7102a]" />
                      <span>Gated Master-Planned Estates</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                      <CheckCircle className="w-4 h-4 text-[#b7102a]" />
                      <span>Flexible Milestone-Linked Payments</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                      <CheckCircle className="w-4 h-4 text-[#b7102a]" />
                      <span>Governor's Consent & Pristine Titles</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => onNavigate('projects')}
                  className="inline-flex items-center gap-1.5 text-[#b7102a] text-xs font-bold group-hover:translate-x-1 transition-transform cursor-pointer"
                >
                  <span>View Housing Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-60 overflow-hidden relative">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH98qz3hJJWxr6Cvud_k8b-BNisFlBDXwgOqw9ioesdnfBm5EtGgnDsDrerr5fv2fzJlz5PwSFijZGx5VzG28EeZAqYdc6SDAr5I4LZXt2mioYWWcSNC0EaNccQuJE7VECSLsGd8MUoKzBqGmRJwpxmZ-iMEwjYzZyL0rLcoCyxtJbGLzuUF_6sDY2QSdrxlmt6i6HtSFkF05rK7_0Zwtd6-o59CEPjWiGhD596zh4XauzNEln8VxVDA"
                    alt="Caih Construction"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-[#b7102a] text-white px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider shadow-sm">
                    02. Construction
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#000f22]">Caih Construction</h3>
                  <p className="text-xs sm:text-sm text-[#475569] mt-2 leading-relaxed">
                    Turnkey civil engineering, architectural contracting, foundation piling, and custom precision metal fabrication to exact standards.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                      <CheckCircle className="w-4 h-4 text-[#b7102a]" />
                      <span>Architectural Contracting & Steel Works</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                      <CheckCircle className="w-4 h-4 text-[#b7102a]" />
                      <span>Subsurface Drainage & Deep Piling</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                      <CheckCircle className="w-4 h-4 text-[#b7102a]" />
                      <span>Guaranteed On-Schedule Project Milestones</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => onBookInspection()}
                  className="inline-flex items-center gap-1.5 text-[#b7102a] text-xs font-bold group-hover:translate-x-1 transition-transform cursor-pointer"
                >
                  <span>Contracting Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-60 overflow-hidden relative">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzFRpyIeLl7ogQtifHFeUSAtsbvv_RPJ1yEeAbDuPtIHdJEGVW4stbhGuTxfe_8wiEOOdKSAkBSAAOy4Mqj7urOF1NMrlFr3WHW4xTdhW0o__vJDXiVW1x3rh1PBzr7hJZ5dHq3xJUg_-AF_oCNhsjh4YZnfVme_KSBZuTFKZ1wDWCChSx5x1OXG9Hm1rsYHY2TvmAMpL6LWA4GC9sF82dAOISCIHDZ2D0nEziCKCyeXyNV0j-M5qvPA"
                    alt="Caih Resources"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-[#001D66] text-white px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider shadow-sm">
                    03. Resources
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#000f22]">Caih Resources</h3>
                  <p className="text-xs sm:text-sm text-[#475569] mt-2 leading-relaxed">
                    Strategic heavy equipment leasing, verified high-grade quarry aggregates supply, and rapid haulage logistics across West Africa.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                      <CheckCircle className="w-4 h-4 text-[#b7102a]" />
                      <span>Heavy Excavator & Plant Fleet Leasing</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                      <CheckCircle className="w-4 h-4 text-[#b7102a]" />
                      <span>Quarry Aggregates & Rebar Supply</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                      <CheckCircle className="w-4 h-4 text-[#b7102a]" />
                      <span>Dedicated Interstate Logistics Routing</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <a
                  href={`tel:${BRAND_ASSETS.phoneClean}`}
                  className="inline-flex items-center gap-1.5 text-[#b7102a] text-xs font-bold group-hover:translate-x-1 transition-transform cursor-pointer"
                >
                  <span>Fleet & Materials Supply</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: MULTIMEDIA & FIELD DISPATCHES (Routes to dedicated Video page!)
         ========================================================================= */}
      <section className="w-full bg-white py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a]">
              Multimedia & Field Dispatches
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#000f22] tracking-tight mt-1">
              See What Our Homeowners & Investors Are Saying
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-2">
              Watch verified site inspections, construction walkthroughs, and client testimonial briefings from our active Lagos developments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VIDEO_DISPATCHES.map((vid) => (
              <div
                key={vid.id}
                onClick={() => onViewVideo(vid)}
                className="group bg-white rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#000f22]/30 flex items-center justify-center transition-all group-hover:bg-[#000f22]/40">
                    <div className="w-14 h-14 rounded-full bg-white/95 text-[#b7102a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 ml-1 fill-[#b7102a]" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-medium">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[10px] uppercase text-[#b7102a] font-bold">
                    {vid.tag}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[#000f22] mt-1 line-clamp-1 group-hover:text-[#b7102a] transition-colors">
                    {vid.title}
                  </h4>
                  <p className="text-xs text-[#475569] mt-1 line-clamp-2">
                    {vid.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: LATEST NEWS & INSIGHTS (Routes to dedicated Blog article page!)
         ========================================================================= */}
      <section className="w-full bg-white py-16 md:py-20 border-b border-[#E2E8F0]" id="news-insights">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#000f22] tracking-tight">
                Latest News & Insights
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-2 max-w-xl leading-relaxed">
                Authoritative intelligence on Nigerian real estate, Lekki-Epe corridor megatrends, and structural investment analysis.
              </p>
            </div>
            <button
              onClick={() => onNavigate('blog')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#F8FAFC] hover:bg-[#000f22] hover:text-white border border-[#E2E8F0] text-[#000f22] text-xs font-bold transition-all whitespace-nowrap self-start md:self-auto shadow-sm cursor-pointer"
            >
              <span>Explore Blog & Insights</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {ARTICLES.slice(0, 3).map((art) => (
              <article
                key={art.id}
                className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded bg-[#b7102a] text-white text-[10px] uppercase font-bold tracking-wider shadow-sm">
                        {art.categoryLabel}
                      </span>
                    </div>
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium">
                      {art.readTime}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#b7102a]">
                        Market Advisory & Research
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#000f22] group-hover:text-[#b7102a] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] mt-2 leading-relaxed line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0 border-t border-[#E2E8F0]/50 mt-4 pt-4 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a]">
                    Advisory
                  </span>
                  <button
                    onClick={() => onViewArticle(art)}
                    className="inline-flex items-center gap-1 text-[#b7102a] text-xs font-bold group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: TRUST PILLARS & INVESTOR TESTIMONIALS
         ========================================================================= */}
      <section className="w-full bg-[#F8FAFC] py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a]">
                The Caih Advantage
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#000f22] tracking-tight">
              Why Discerning Buyers Choose Caih Group
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-2">
              Engineered excellence and rock-solid legal titles designed for long-term generational security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-lg bg-[#b7102a]/10 text-[#b7102a] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#000f22]">Verifiable C of O & Consent</h4>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                Pristine legal status certified with the Lagos State Lands Bureau and CAC Corporate Registry.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-lg bg-[#000f22]/10 text-[#000f22] flex items-center justify-center mb-4">
                <Sun className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#000f22]">24/7 Security & Solar Grids</h4>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                Integrated perimeter sensors, dedicated security personnel, and uninterrupted clean power backup.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-lg bg-[#b7102a]/10 text-[#b7102a] flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#000f22]">Milestone-Linked Payouts</h4>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                Pay progressively aligned with verifiable construction tranches certified by independent civil engineers.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col items-start">
              <div className="w-12 h-12 rounded-lg bg-[#000f22]/10 text-[#000f22] flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#000f22]">Rapid Capital Appreciation</h4>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                Prime positions along the Lekki Phase 2 and coastal corridor yielding above-market 22.4% annual returns.
              </p>
            </div>
          </div>

          {/* Real Investor Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex text-[#b7102a] gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="w-4 h-4 text-[#b7102a]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    “{t.quote}”
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[#E2E8F0]">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-[#000f22]">{t.name}</h5>
                    <span className="text-[11px] text-[#94A3B8]">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FINAL CTA BANNER
         ========================================================================= */}
      <section className="w-full bg-white py-16">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="bg-[#0a2540] rounded-2xl p-8 md:p-14 text-white relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl z-10">
              <span className="text-[11px] uppercase tracking-widest text-[#ffb3b1] font-bold">
                READY TO COMMENCE
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
                Ready to Own a Property That Grows in Value?
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 mt-3 leading-relaxed">
                Contact our corporate desk directly in Lagos. We schedule same-week on-site visits and tailored investment appraisals.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 z-10">
              <a
                href={`tel:${BRAND_ASSETS.phoneClean}`}
                className="px-6 py-3.5 rounded bg-white text-[#000f22] text-xs sm:text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#b7102a]" />
                <span>{BRAND_ASSETS.phone}</span>
              </a>
              <button
                onClick={() => onBookInspection()}
                className="px-6 py-3.5 rounded bg-[#b7102a] hover:bg-[#db313f] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Private Inspection</span>
              </button>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none"></div>
          </div>
        </div>
      </section>
    </div>
  );
};
