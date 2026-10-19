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
  Sparkles,
  Video
} from 'lucide-react';

interface ProjectsScreenProps {
  onViewProject: (project: Project) => void;
  onBookInspection?: (target: string) => void;
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
  onBookInspection,
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
    selectedProjectForInspection || 'Appleton Enclave (Idera)'
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
          if (loc.includes('idera') && !pLoc.includes('idera') && !pCorridor.includes('idera')) return false;
          if (loc.includes('dangote') && !pLoc.includes('dangote') && !pCorridor.includes('dangote')) return false;
          if (loc.includes('ibeju') && !pLoc.includes('ibeju') && !pCorridor.includes('ibeju')) return false;
          if (loc.includes('victoria') && !pLoc.includes('victoria') && !pCorridor.includes('victoria')) return false;
          if (loc.includes('akachukwu') && !pLoc.includes('akachukwu') && !pCorridor.includes('akachukwu')) return false;
          if (loc.includes('lekki') && !pLoc.includes('lekki') && !pCorridor.includes('lekki')) return false;
          if (loc.includes('epe') && !pLoc.includes('epe') && !pCorridor.includes('epe')) return false;
          if (loc.includes('guzape') && !pCorridor.includes('abuja')) return false;
          if (loc.includes('ajah') && !pCorridor.includes('ajah')) return false;
        }
      }

      // Type filter
      if (typeFilter && typeFilter !== 'all') {
        const t = typeFilter.toLowerCase();
        if (t.includes('residential') && p.propertyType !== 'residential') return false;
        if (
          t.includes('commercial') &&
          p.propertyType !== 'commercial' &&
          !p.title.toLowerCase().includes('commercial') &&
          !p.badge?.toLowerCase().includes('commercial')
        ) return false;
        if (t.includes('plots') && p.propertyType !== 'plots') return false;
        if (
          t.includes('industrial') &&
          p.propertyType !== 'industrial' &&
          !p.keyFeatures.some((k) => k.toLowerCase().includes('warehouse') || k.toLowerCase().includes('logistics'))
        ) return false;
      }

      // Beds filter
      if (bedsFilter && bedsFilter !== 'ANY' && bedsFilter !== 'any') {
        const bedNum = parseInt(bedsFilter, 10);
        if (!isNaN(bedNum) && p.specs.beds && p.specs.beds !== bedNum) return false;
      }

      // Price filter
      if (priceFilter !== 'all') {
        if (priceFilter === 'mid' && p.priceCategory !== 'mid') return false;
        if (priceFilter === 'high' && p.priceCategory !== 'high') return false;
      }

      return true;
    });
  }, [activeStatus, locationFilter, typeFilter, bedsFilter, keywordFilter, priceFilter]);

  const scrollToBooking = (projectTitle: string) => {
    if (onBookInspection) {
      onBookInspection(projectTitle);
    } else {
      setBookingTarget(projectTitle);
      const el = document.getElementById('inspection-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
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
                    <option value="Idera">Idera (Appleton Enclave)</option>
                    <option value="Free Trade Zone">Free Trade Zone / Origanrigan (Appleton Commercial)</option>
                    <option value="Ibeju-Lekki">Ibeju-Lekki (Appleton Garden)</option>
                    <option value="Victoria Island">Victoria Island (Appleton Haven)</option>
                    <option value="Akachukwu Street">Akachukwu Street (Appleton Court)</option>
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

              {/* Budget Range Select */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <CreditCard className="text-[#b7102a] w-4 h-4 shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                    Price Range
                  </span>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="bg-transparent text-[#000f22] font-bold text-xs focus:outline-none cursor-pointer mt-0.5"
                  >
                    <option value="all">All Price Ranges</option>
                    <option value="mid">₦35M – ₦95M</option>
                    <option value="high">₦100M+ Prime</option>
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
                    <div
                      onClick={() => onViewProject(project)}
                      className="h-60 overflow-hidden relative cursor-pointer"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-white/90 backdrop-blur-sm text-[#000f22] text-xs font-bold">
                        {project.corridor}
                      </span>
                      {project.id !== 'appleton-haven' && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
                          <Video className="w-3 h-3 text-[#ffb3b1]" />
                          <span>Video Tour Available</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                        <MapPin className="w-4 h-4 text-[#b7102a]" />
                        <span>{project.location}</span>
                      </div>

                      <h3
                        onClick={() => onViewProject(project)}
                        className="text-lg font-bold text-[#000f22] group-hover:text-[#b7102a] transition-colors cursor-pointer"
                      >
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#475569] line-clamp-2 leading-relaxed">
                        {project.summary}
                      </p>

                      <div className="flex items-center gap-3 py-2 border-y border-[#E2E8F0] text-xs text-[#475569] mt-1">
                        {project.propertyType === 'plots' ? (
                          <>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.area}</strong></span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.landType || '100% Dry Table Land'}</strong></span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.titleType || 'Governor’s Consent'}</strong></span>
                          </>
                        ) : project.specs.beds ? (
                          <>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.beds}</strong> Beds</span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.baths || 5}</strong> Baths</span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.area}</strong></span>
                          </>
                        ) : (
                          <>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.area || 'Development'}</strong></span>
                            <span>•</span>
                            <span><strong className="text-[#000f22] font-bold">{project.specs.titleType || 'Certified Title'}</strong></span>
                          </>
                        )}
                      </div>
                      {project.unitsOrPlots && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="text-[10px] uppercase font-bold text-[#94A3B8]">
                            {project.propertyType === 'plots' ? 'SQM Prices:' : 'Units:'}
                          </span>
                          {project.unitsOrPlots.map((u) => (
                            <span
                              key={u.id}
                              className="text-[10px] font-bold text-[#000f22] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs"
                            >
                              <span className="font-semibold text-[#475569]">{u.size || u.name}:</span>
                              <span className="font-extrabold text-[#b7102a]">{u.priceDisplay}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-base sm:text-lg font-extrabold text-[#b7102a] block">
                        {project.priceDisplay}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 block">
                        Direct Allocation
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {project.id !== 'appleton-haven' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewProject(project);
                          }}
                          className={`px-3 py-2 rounded border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            project.videoComingSoon
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-[#FFF1F2] hover:bg-[#b7102a] text-[#b7102a] hover:text-white border-[#FFE4E6]'
                          }`}
                          title={project.videoComingSoon ? 'Video Walkthrough Coming Soon' : 'Watch Project Video Tour'}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{project.videoComingSoon ? 'Video (Soon)' : 'Video Tour'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => onViewProject(project)}
                        className="px-4 py-2 rounded bg-[#000f22] hover:bg-[#b7102a] text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        {project.propertyType === 'plots' ? 'View Plots & Plans' : 'View Details & Plans'}
                      </button>
                    </div>
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
