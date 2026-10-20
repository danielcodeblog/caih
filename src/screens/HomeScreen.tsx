import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Project, Article, VideoDispatch, PageId } from '../types';
import { VIDEO_DISPATCHES, TESTIMONIALS, BRAND_ASSETS } from '../data/mockData';
import { getStoredArticles } from '../utils/articlesStore';
import { getStoredProjects } from '../utils/projectsStore';
import gsap from 'gsap';
import {
  Search,
  MapPin,
  Building2,
  Calendar,
  Play,
  ArrowRight,
  ShieldCheck,
  Phone,
  Layers,
  Plus,
  Minus,
  Zap,
  CreditCard,
  Shield,
  Sun,
  Video,
  Quote,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles
} from 'lucide-react';

interface HomeScreenProps {
  projects?: Project[];
  articles?: Article[];
  onNavigate: (page: PageId) => void;
  onViewProject: (project: Project) => void;
  onViewArticle: (article: Article) => void;
  onViewVideo: (video: VideoDispatch) => void;
  onBookInspection: (projectTitle?: string) => void;
  onSearchSubmit?: (filters: { keyword: string; type: string; location: string; beds: string }) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  projects: passedProjects,
  articles: passedArticles,
  onNavigate,
  onViewProject,
  onViewArticle,
  onViewVideo,
  onBookInspection,
  onSearchSubmit
}) => {
  const [projectsList, setProjectsList] = useState<Project[]>(() =>
    passedProjects && passedProjects.length > 0 ? passedProjects : getStoredProjects()
  );
  const [articlesList, setArticlesList] = useState<Article[]>(() =>
    passedArticles && passedArticles.length > 0 ? passedArticles : getStoredArticles()
  );

  useEffect(() => {
    if (passedProjects && passedProjects.length > 0) {
      setProjectsList(passedProjects);
    }
  }, [passedProjects]);

  useEffect(() => {
    if (passedArticles && passedArticles.length > 0) {
      setArticlesList(passedArticles);
    }
  }, [passedArticles]);

  useEffect(() => {
    const handleProjectsUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setProjectsList(e.detail);
      }
    };
    const handleArticlesUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setArticlesList(e.detail);
      }
    };

    window.addEventListener('caih_projects_updated', handleProjectsUpdated);
    window.addEventListener('caih_articles_updated', handleArticlesUpdated);

    return () => {
      window.removeEventListener('caih_projects_updated', handleProjectsUpdated);
      window.removeEventListener('caih_articles_updated', handleArticlesUpdated);
    };
  }, []);

  // Hero Search Dock State
  const [selectedType, setSelectedType] = useState('ALL TYPES');
  const [keyword, setKeyword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('ALL LOCATIONS');
  const [selectedBeds, setSelectedBeds] = useState('ANY');
  const [selectedPriceBracket, setSelectedPriceBracket] = useState('ANY');

  // Dark Section Active Category Tab
  const [activeCategory, setActiveCategory] = useState<'apartment' | 'house' | 'office' | 'villa'>('apartment');

  // Testimonials Carousel Gallery State
  const [testimonialSlideIndex, setTestimonialSlideIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isTestimonialAutoPlaying, setIsTestimonialAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isTestimonialAutoPlaying || TESTIMONIALS.length <= 1) return;
    const interval = setInterval(() => {
      setTestimonialSlideIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isTestimonialAutoPlaying]);

  const handlePrevTestimonial = () => {
    setTestimonialSlideIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };
  const handleNextTestimonial = () => {
    setTestimonialSlideIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

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
    const list = [...projectsList];
    const filtered = list.filter((p) => {
      // Keyword match
      if (keyword.trim()) {
        const query = keyword.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesLocation = p.location.toLowerCase().includes(query);
        const matchesSummary = (p.summary || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation && !matchesSummary) return false;
      }

      // Type match from Hero
      if (selectedType !== 'ALL TYPES') {
        if (selectedType === 'RESIDENTIAL' && p.propertyType !== 'residential') return false;
        if (
          selectedType === 'COMMERCIAL' &&
          p.propertyType !== 'commercial' &&
          !p.title.toLowerCase().includes('commercial') &&
          !p.badge?.toLowerCase().includes('commercial')
        ) return false;
        if (selectedType === 'PLOTS' && p.propertyType !== 'plots') return false;
        if (
          selectedType === 'INDUSTRIAL' &&
          p.propertyType !== 'industrial' &&
          !p.keyFeatures?.some((k) => k.toLowerCase().includes('warehouse') || k.toLowerCase().includes('logistics'))
        ) return false;
      }

      // Advanced filters
      if (selectedLocation !== 'ALL LOCATIONS') {
        const queryLoc = selectedLocation.toLowerCase();
        if (
          !p.location.toLowerCase().includes(queryLoc) &&
          !(p.corridor || '').toLowerCase().includes(queryLoc)
        ) {
          return false;
        }
      }

      if (selectedBeds !== 'ANY') {
        const bedNum = parseInt(selectedBeds, 10);
        if (p.specs?.beds !== bedNum) return false;
      }

      return true;
    });

    // Prioritize properties with "Featured" in badge or newly created properties
    return filtered.sort((a, b) => {
      const aFeatured = a.badge?.toLowerCase().includes('featured') ? 1 : 0;
      const bFeatured = b.badge?.toLowerCase().includes('featured') ? 1 : 0;
      return bFeatured - aFeatured;
    });
  }, [projectsList, keyword, selectedType, selectedLocation, selectedBeds]);

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
            Discover premier luxury residences and master-planned communities across Lagos with Caih Group. Explore living spaces crafted for comfort, prestige, and lasting value.
          </p>
        </div>

        {/* Hero Search Dock (Exact layout & styling from Screenshot 1) */}
        <div className="relative z-10 max-w-[1120px] mx-auto px-6 sm:px-8 w-full mt-8 sm:mt-10">
          {/* "FOR SALE" White Tab */}

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
                    <option value="ALL LOCATIONS">All Corridors & Locations</option>
                    <option value="Idera">Idera (Appleton Enclave)</option>
                    <option value="Free Trade Zone">Free Trade Zone / Origanrigan (Appleton Commercial)</option>
                    <option value="Ibeju-Lekki">Ibeju-Lekki (Appleton Garden)</option>
                    <option value="Victoria Island">Victoria Island (Appleton Haven)</option>
                    <option value="Akachukwu Street">Akachukwu Street (Appleton Court)</option>
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
          {filteredProperties.length === 0 ? (
            <div className="py-16 text-center bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1]">
              <Building2 className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#000f22] mb-1">No matching properties found</h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto mb-4">
                Try clearing your search keyword or switching filters to view all available listings.
              </p>
              <button
                onClick={() => {
                  setSelectedType('ALL TYPES');
                  setKeyword('');
                  setSelectedLocation('ALL LOCATIONS');
                  setSelectedBeds('ANY');
                }}
                className="px-4 py-2 rounded-xl bg-[#000f22] text-white text-xs font-bold hover:bg-[#b7102a] transition-colors cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProperties.slice(0, 8).map((prop) => (
                <div
                  key={prop.id}
                  className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative">
                    {/* Visual Frame */}
                    <div
                      onClick={() => onViewProject(prop)}
                      className="h-60 overflow-hidden relative cursor-pointer"
                    >
                      <img
                        src={prop.image || '/images/appleton_court_exterior_real.jpg'}
                        alt={prop.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
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

                      {/* Video tour available pill */}
                      {prop.id !== 'appleton-haven' && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
                          <Video className="w-3 h-3 text-[#ffb3b1]" />
                          <span>Video Tour Available</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Description */}
                    <div className="p-5">
                      <div className="flex items-center gap-1 text-xs text-[#94A3B8] mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#b7102a]" />
                        <span className="truncate">{prop.location}</span>
                      </div>

                      <h3
                        onClick={() => onViewProject(prop)}
                        className="text-base font-bold text-[#000f22] group-hover:text-[#b7102a] transition-colors line-clamp-1 cursor-pointer"
                      >
                        {prop.title}
                      </h3>

                      {/* Specs Ribbon */}
                      <div className="grid grid-cols-3 gap-2 py-3 mt-2 border-y border-[#E2E8F0] text-xs text-[#475569]">
                        {prop.propertyType === 'plots' ? (
                          <>
                            <div className="font-semibold text-[#000f22] truncate">{prop.specs?.area || 'Plots'}</div>
                            <div className="font-semibold text-[#000f22] truncate">{prop.specs?.landType || '100% Dry Land'}</div>
                            <div className="font-semibold text-emerald-700 truncate">{prop.specs?.titleType || 'Consent'}</div>
                          </>
                        ) : (
                          <>
                            <div className="font-semibold text-[#000f22]">{prop.specs?.beds ? `${prop.specs.beds} Beds` : 'Luxury'}</div>
                            <div className="font-semibold text-[#000f22]">{prop.specs?.baths ? `${prop.specs.baths} Baths` : 'Ensuite'}</div>
                            <div className="font-semibold text-[#000f22] truncate">{prop.specs?.area || 'Prime'}</div>
                          </>
                        )}
                      </div>

                      {/* Pricing Tag */}
                      <div className="mt-3">
                        <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider block">
                          Pricing
                        </span>
                        <div className="text-lg font-extrabold text-[#b7102a]">
                          {prop.priceDisplay}
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5 truncate">
                          {prop.priceSub || 'Direct Allocation'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action -> Routes to Dedicated Full Page */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => onViewProject(prop)}
                      className="flex-1 py-2.5 rounded bg-[#F8FAFC] hover:bg-[#000f22] hover:text-white border border-[#E2E8F0] text-xs font-bold text-[#000f22] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <span>{prop.propertyType === 'plots' ? 'View Plots & Master Plan' : 'View Residence & Plans'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {prop.id !== 'appleton-haven' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewProject(prop);
                        }}
                        className={`px-3 py-2.5 rounded border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          prop.videoComingSoon
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-[#FFF1F2] hover:bg-[#b7102a] text-[#b7102a] hover:text-white border-[#FFE4E6]'
                        }`}
                        title={prop.videoComingSoon ? 'Video Walkthrough Coming Soon' : 'Watch Project Video Tour'}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{prop.videoComingSoon ? 'Video (Soon)' : 'Video'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Properties Link */}
          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#000f22] hover:bg-[#b7102a] text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer"
            >
              <span>Explore All Properties ({projectsList.length} In Lagos &amp; Abuja)</span>
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
              className={`p-6 sm:p-8 flex flex-col items-center justify-center group transition-all ${
                activeCategory === 'apartment' ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
              disabled={true}
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
              className={`p-6 sm:p-8 flex flex-col items-center justify-center group transition-all ${
                activeCategory === 'house' ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
              disabled={true}
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
              className={`p-6 sm:p-8 flex flex-col items-center justify-center group transition-all ${
                activeCategory === 'office' ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
              disabled={true}
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
              className={`p-6 sm:p-8 flex flex-col items-center justify-center group transition-all ${
                activeCategory === 'villa' ? 'bg-white/5' : 'hover:bg-white/5'
              }`}
              disabled={true}
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
            {articlesList
              .slice()
              .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
              .slice(0, 3)
              .map((art) => (
              <article
                key={art.id}
                className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div
                    onClick={() => onViewArticle(art)}
                    className="relative h-56 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded bg-[#b7102a] text-white text-[10px] uppercase font-bold tracking-wider shadow-sm">
                        {art.categoryLabel}
                      </span>
                      {art.featured && (
                        <span className="px-2.5 py-1 rounded bg-amber-500 text-white text-[10px] uppercase font-bold tracking-wider shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium">
                      {art.readTime}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#b7102a]">
                        Market Advisory &amp; Research
                      </span>
                      <span>•</span>
                      <span className="text-[11px] text-[#64748B] font-medium">{art.date}</span>
                    </div>
                    <h3
                      onClick={() => onViewArticle(art)}
                      className="text-base sm:text-lg font-bold text-[#000f22] group-hover:text-[#b7102a] transition-colors leading-snug line-clamp-2 cursor-pointer"
                    >
                      {art.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] mt-2 leading-relaxed line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0 border-t border-[#E2E8F0]/50 mt-4 pt-4 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a]">
                    By {art.author?.name || 'Caih Group'}
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
          SECTION 7: INVESTOR & PARTNER TESTIMONIALS (MATCHING REFERENCE UI)
         ========================================================================= */}
      <section className="w-full bg-[#FAFAFA] py-20 lg:py-28 border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-[#b7102a] mb-2 block">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#000f22] tracking-tight leading-tight">
              Our Testimonial Gallery
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-3">
              Official key handover moments and milestone celebrations across our flagship developments.
            </p>
          </div>



          {/* Carousel Viewport Container */}
          <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsTestimonialAutoPlaying(false)}
            onMouseLeave={() => setIsTestimonialAutoPlaying(true)}
          >
            {/* Main Stage Image Slide */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-950 aspect-[4/3] sm:aspect-[16/10] shadow-2xl border border-[#CBD5E1]">
              {TESTIMONIALS.map((t, idx) => {
                const isActive = idx === testimonialSlideIndex;
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ease-out flex items-center justify-center cursor-pointer ${
                      isActive
                        ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                        : 'opacity-0 scale-95 z-0 pointer-events-none'
                    }`}
                    onClick={() => setLightboxImage(t.avatar)}
                  >
                    <img
                      src={t.avatar}
                      alt={`Testimonial photo ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Enlarge icon button */}
                    <button
                      type="button"
                      aria-label="Enlarge image"
                      className="absolute bottom-5 right-5 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImage(t.avatar);
                      }}
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}

              {/* Prev / Next Arrows */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevTestimonial();
                }}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#000f22] backdrop-blur-md shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-slate-200 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 text-[#000f22]" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextTestimonial();
                }}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#000f22] backdrop-blur-md shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-slate-200 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 text-[#000f22]" />
              </button>
            </div>

            {/* Navigation Bar: Dot Indicators & Thumbnail Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-1">
              {/* Dot Indicators & Slide Count */}
              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTestimonialSlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === testimonialSlideIndex
                        ? 'w-8 bg-[#b7102a]'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
                <span className="text-xs text-slate-500 font-medium ml-2">
                  0{testimonialSlideIndex + 1} / 0{TESTIMONIALS.length}
                </span>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex items-center gap-3">
                {TESTIMONIALS.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTestimonialSlideIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                    className={`relative rounded-xl overflow-hidden w-20 h-14 sm:w-24 sm:h-16 transition-all duration-300 border-2 cursor-pointer ${
                      idx === testimonialSlideIndex
                        ? 'border-[#b7102a] scale-105 shadow-md ring-2 ring-[#b7102a]/20'
                        : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={t.avatar}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
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

      {/* Lightbox Modal for Full Image Preview */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Testimonial photo preview"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
