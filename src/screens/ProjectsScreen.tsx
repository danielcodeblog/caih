import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { PROJECTS } from '../data/mockData';
import { InspectionForm } from '../components/InspectionForm';
import {
  MapPin,
  Building,
  CreditCard,
  CheckCircle,
  Download,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';

interface ProjectsScreenProps {
  onViewProject: (project: Project) => void;
  selectedProjectForInspection?: string;
  initialFilter?: {
    keyword: string;
    type: string;
    location: string;
    beds: string;
  };
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  onViewProject,
  selectedProjectForInspection,
  initialFilter
}) => {
  // Search & Filter State
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [keywordFilter, setKeywordFilter] = useState<string>(initialFilter?.keyword || '');
  const [locationFilter, setLocationFilter] = useState<string>(
    initialFilter?.location && initialFilter.location !== 'ALL LOCATIONS' ? initialFilter.location : 'all'
  );
  const [typeFilter, setTypeFilter] = useState<string>(
    initialFilter?.type && initialFilter.type !== 'ALL TYPES' ? initialFilter.type.toLowerCase() : 'all'
  );
  const [bedsFilter, setBedsFilter] = useState<string>(initialFilter?.beds || 'ANY');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [bookingTarget, setBookingTarget] = useState<string>(
    selectedProjectForInspection || 'Appleton Enclave Phase I & II (Lekki Phase 2)'
  );

  const flagship = PROJECTS[0];

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((p) => {
      // Keyword match
      if (keywordFilter.trim()) {
        const query = keywordFilter.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesLocation = p.location.toLowerCase().includes(query);
        const matchesSummary = p.summary.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation && !matchesSummary) return false;
      }

      // Status filter
      if (activeStatus !== 'all' && p.status !== activeStatus) return false;

      // Location filter
      if (locationFilter && locationFilter !== 'all') {
        const loc = locationFilter.toLowerCase();
        const pCorridor = p.corridor.toLowerCase();
        const pLoc = p.location.toLowerCase();
        if (!pCorridor.includes(loc) && !pLoc.includes(loc)) {
          if (loc.includes('lekki') && !pCorridor.includes('lekki')) return false;
          if (loc.includes('epe') && !pCorridor.includes('epe')) return false;
          if (loc.includes('victoria') && !pCorridor.includes('victoria')) return false;
          if (loc.includes('guzape') && !pCorridor.includes('abuja')) return false;
          if (loc.includes('ajah') && !pCorridor.includes('ajah')) return false;
        }
      }

      // Type filter
      if (typeFilter && typeFilter !== 'all') {
        const t = typeFilter.toLowerCase();
        if (t.includes('residential') && p.propertyType !== 'residential') return false;
        if (t.includes('commercial') && p.propertyType !== 'commercial') return false;
        if (t.includes('plots') && p.propertyType !== 'plots') return false;
        if (t.includes('industrial') && p.propertyType !== 'industrial') return false;
      }

      // Beds filter
      if (bedsFilter && bedsFilter !== 'ANY' && bedsFilter !== 'any') {
        const bedNum = parseInt(bedsFilter, 10);
        if (!isNaN(bedNum) && p.specs.beds && p.specs.beds !== bedNum) return false;
      }

      // Price filter
      if (priceFilter !== 'all') {
        if (priceFilter === 'deposit' && p.priceCategory !== 'deposit') return false;
        if (priceFilter === 'mid' && p.priceCategory !== 'mid') return false;
        if (priceFilter === 'high' && p.priceCategory !== 'high') return false;
      }

      return true;
    });
  }, [activeStatus, locationFilter, typeFilter, bedsFilter, keywordFilter, priceFilter]);

  const scrollToBooking = (projectTitle: string) => {
    setBookingTarget(projectTitle);
    const el = document.getElementById('inspection-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full bg-white">
      {/* SECTION 1 & 2: VCH INSPIRED HERO BANNER & SEARCH/FILTER BAR */}
      <section className="w-full bg-white pt-16 pb-12 border-b border-[#E2E8F0] relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#b7102a] text-[11px] uppercase tracking-widest mb-5 font-bold shadow-sm">
              <span>Caih Group Portfolio & Developments</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-[54px] lg:leading-[1.15] text-[#000f22] tracking-tight font-extrabold max-w-4xl mx-auto">
              Explore Our Premier Estates & Infrastructure
            </h1>
            <p className="text-base md:text-lg text-[#475569] max-w-3xl mx-auto mt-4 leading-relaxed">
              Verified title properties, master-planned residential communities, and institutional developments across the Lagos growth corridor and Abuja.
            </p>
          </div>

          {/* VCH Interactive Filter Ribbon & Multi-tier Search Dock */}
          <div className="mt-10 max-w-5xl mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-3 md:p-4 flex flex-col gap-3">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 border-b border-[#E2E8F0]">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'upcoming', label: 'Upcoming Projects' },
                { id: 'ongoing', label: 'Ongoing Off-Plan' },
                { id: 'completed', label: 'Completed & Delivered' },
                { id: 'sites', label: 'Sites & Services' },
                { id: 'civil', label: 'Commercial & Civil' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveStatus(pill.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeStatus === pill.id
                      ? 'bg-[#000f22] text-white shadow-sm'
                      : 'text-[#475569] hover:text-[#000f22] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Dropdowns Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Location Select */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <MapPin className="text-[#b7102a] w-4 h-4 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                    Location / Corridor
                  </span>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="bg-transparent text-[#000f22] font-bold text-xs focus:outline-none cursor-pointer mt-0.5"
                  >
                    <option value="all">All Locations</option>
                    <option value="Lekki Phase 2">Lekki Phase 2</option>
                    <option value="Ajah">Ajah</option>
                    <option value="Epe Expressway">Epe Expressway</option>
                    <option value="Victoria Island">Victoria Island</option>
                    <option value="Guzape Abuja">Guzape Abuja</option>
                  </select>
                </div>
              </div>

              {/* Property Type Select */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <Building className="text-[#000f22] w-4 h-4 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                    Property Type
                  </span>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-transparent text-[#000f22] font-bold text-xs focus:outline-none cursor-pointer mt-0.5"
                  >
                    <option value="all">All Property Types</option>
                    <option value="residential">Residential Terraces</option>
                    <option value="commercial">Commercial / Retail</option>
                    <option value="plots">Serviced Land Plots</option>
                    <option value="industrial">Industrial Facilities</option>
                  </select>
                </div>
              </div>

              {/* Price / Deposit Range Select */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <CreditCard className="text-[#b7102a] w-4 h-4 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                    Price / Deposit Range
                  </span>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="bg-transparent text-[#000f22] font-bold text-xs focus:outline-none cursor-pointer mt-0.5"
                  >
                    <option value="all">All Price Ranges</option>
                    <option value="deposit">Deposit &lt; ₦5M Initial</option>
                    <option value="mid">₦18M - ₦50M Plot / Unit</option>
                    <option value="high">₦100M+ Prime Asset</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Parameters */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#94A3B8]">
            <span className="text-[11px] uppercase tracking-wider text-[#475569] font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#b7102a]" /> Trust Parameters:
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
              Governor’s Consent & C of O
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
              Dedicated Infrastructure
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
              Milestone Escrow Delivery
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3: FLAGSHIP FEATURED PROJECT SHOWCASE (VCH Hero Card) */}
      <section className="w-full bg-[#F8FAFC] py-14 lg:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a]">
              Flagship Development Highlight
            </span>
            <span className="text-xs text-[#94A3B8] hidden sm:inline-block">
              Eleganza Axis, Lekki Phase 2 Corridor
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Frame */}
            <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[460px] overflow-hidden group">
              <img
                src={flagship.image}
                alt={flagship.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-5 left-5 flex gap-2">
                <span className="px-3 py-1 rounded bg-[#b7102a] text-white text-[11px] uppercase tracking-wider font-bold shadow-sm">
                  Flagship Development
                </span>
                <span className="px-3 py-1 rounded bg-[#000f22]/90 text-white text-[11px] uppercase tracking-wider font-semibold">
                  Lekki Corridor
                </span>
              </div>
              <div className="absolute bottom-5 left-5 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#b7102a]" />
                {flagship.location}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-2">
                    <span className="text-[#b7102a] font-bold">Residential Estate</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-[#000f22]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> C of O Titled
                    </span>
                    <span>•</span>
                    <span>Q4 2025 Handover</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-[#000f22] leading-snug tracking-tight">
                    {flagship.title}
                  </h2>
                </div>

                <p className="text-sm text-[#475569] leading-relaxed">
                  {flagship.summary}
                </p>

                <div className="grid grid-cols-2 gap-3 py-4 border-y border-[#E2E8F0] bg-[#F8FAFC]/60 rounded-xl px-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-[#94A3B8] font-bold">Starting Deposit</span>
                    <span className="text-2xl font-extrabold text-[#b7102a] mt-0.5">₦3,28B</span>
                    <span className="text-[11px] text-[#475569]">Flexible 18-month plan</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-[#94A3B8] font-bold">Property Config</span>
                    <span className="text-xl font-bold text-[#000f22] mt-0.5">3–4 Beds | 4–5 Baths</span>
                    <span className="text-[11px] text-[#475569]">3,549 Sq. Ft • Automated</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-center gap-3 mt-4">
                <button
                  onClick={() => scrollToBooking(flagship.title)}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded bg-[#b7102a] hover:bg-[#db313f] text-white text-xs sm:text-sm font-bold transition-all shadow-sm text-center cursor-pointer"
                >
                  <span>Schedule Site Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewProject(flagship)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#000f22] text-xs sm:text-sm font-semibold transition-all text-center cursor-pointer"
                >
                  <Building className="w-4 h-4 text-[#b7102a]" />
                  <span>View Project Page & Plans</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: MASTER PROJECTS GRID (Active Caih Group Developments) */}
      <section className="w-full bg-white py-16">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#000f22] tracking-tight mt-1">
                Active Caih Group Developments
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] max-w-md">
              Filter across residential estates, commercial hubs, and strategic group infrastructure assets across Nigeria.
            </p>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <Building className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#000f22]">No properties found matching criteria</h3>
              <p className="text-xs text-[#475569] mt-1">Try resetting your filter parameters or selecting All Projects.</p>
              <button
                onClick={() => {
                  setActiveStatus('all');
                  setLocationFilter('all');
                  setTypeFilter('all');
                  setPriceFilter('all');
                }}
                className="mt-4 px-4 py-2 rounded bg-[#000f22] text-white text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative">
                    <div className="h-60 overflow-hidden relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-white/90 backdrop-blur-sm text-[#000f22] text-xs font-bold">
                        {project.corridor}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                        <MapPin className="w-4 h-4 text-[#b7102a]" />
                        <span>{project.location}</span>
                      </div>

                      <h3 className="text-lg font-bold text-[#000f22] group-hover:text-[#b7102a] transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#475569] line-clamp-2 leading-relaxed">
                        {project.summary}
                      </p>

                      <div className="flex items-center gap-3 py-2 border-y border-[#E2E8F0] text-xs text-[#475569] mt-1">
                        {project.specs.beds && (
                          <>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.beds}</strong> Beds</span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.baths || 5}</strong> Baths</span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.area}</strong></span>
                          </>
                        )}
                        {project.specs.landType && (
                          <>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.area}</strong></span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.landType}</strong></span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.titleType}</strong></span>
                          </>
                        )}
                        {project.specs.floors && (
                          <>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.floors}</strong> Floors</span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.area}</strong></span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">Delivered</strong></span>
                          </>
                        )}
                        {project.specs.yield && (
                          <>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.units}</strong> Suites</span>
                            <span>•</span>
                            <span><strong className="text-[#b7102a] font-bold">{project.specs.yield}</strong></span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">100% Sold</strong></span>
                          </>
                        )}
                        {project.specs.output && (
                          <>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.output}</strong></span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.landType}</strong></span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">Active</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-base sm:text-lg font-extrabold text-[#000f22]">
                        {project.priceDisplay}
                      </span>
                    </div>

                    <button
                      onClick={() => onViewProject(project)}
                      className="px-4 py-2 rounded bg-[#F8FAFC] hover:bg-[#000f22] hover:text-white text-[#000f22] text-xs font-bold transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE SITE INSPECTION BOOKING SECTION */}
      <InspectionForm initialProject={bookingTarget} />
    </div>
  );
};
