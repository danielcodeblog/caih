import React, { useState, useEffect } from 'react';
import { Project, PageId } from '../types';
import { PROJECTS, BRAND_ASSETS } from '../data/mockData';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Share2,
  Check,
  Phone,
  ArrowRight,
  Video,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon
} from 'lucide-react';

interface ProjectDetailScreenProps {
  project: Project;
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  onBookInspection: (projectTitle: string) => void;
  onNavigate: (page: PageId) => void;
}

interface VideoEntry {
  url: string;
  title: string;
  caption?: string;
  sourceType: 'youtube' | 'vimeo' | 'mp4' | 'other';
  embedUrl: string;
}

// Helper to convert YouTube / Vimeo / MP4 URLs into embeddable format
function parseVideoUrl(rawUrl: string, title: string = 'Property Video Tour'): VideoEntry | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // YouTube match: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      url: trimmed,
      title: title || 'YouTube Video Tour',
      sourceType: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
    };
  }

  // Vimeo match: vimeo.com/ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      url: trimmed,
      title: title || 'Vimeo Video Tour',
      sourceType: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
    };
  }

  // Direct MP4 / WebM
  if (trimmed.match(/\.(mp4|webm|ogg)($|\?)/i)) {
    return {
      url: trimmed,
      title: title || 'Site Video Walkthrough',
      sourceType: 'mp4',
      embedUrl: trimmed
    };
  }

  // Fallback as iframe or generic url
  return {
    url: trimmed,
    title: title || 'Property Video',
    sourceType: 'other',
    embedUrl: trimmed
  };
}

// Default videos for properties if none is added yet
const DEFAULT_PROJECT_VIDEOS: Record<
  string,
  { url: string; title: string; duration: string; description: string }
> = {
  'appleton-enclave': {
    url: 'https://vimeo.com/1235852176?fl=ip&fe=ec',
    title: 'Appleton Enclave: Aerial Drone Survey & Topography Tour',
    duration: '04:32',
    description:
      'Aerial drone inspection of the 100% dry table topography, perimeter fencing, boundary pegs, and internal road network in Idera Scheme, Eleko.'
  },
  'appleton-commercial-residential': {
    url: 'https://vimeo.com/1235840039?fl=ip&fe=ec',
    title: 'Appleton Commercial & Residences: Free Trade Zone Corridor Tour',
    duration: '05:15',
    description:
      'Strategic corridor inspection by Dangote Refinery Axis and Lekki Free Trade Zone, showing mega warehouse access, commercial road frontages, and infrastructure.'
  },
  'appleton-court': {
    url: 'https://vimeo.com/1235839354?fl=ip&fe=ec',
    title: 'Appleton Court Terraces: Live Structural Framing Walkthrough',
    duration: '04:18',
    description:
      'Engr. Babatunde leads a live walkthrough of concrete curing, high-tensile rebar ties, and subsurface drainage at Appleton Court, Akachukwu Street.'
  }
};

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  project,
  onBack,
  onSelectProject,
  onBookInspection,
  onNavigate
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    project.unitsOrPlots?.[0]?.id || ''
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isFullScreenPhotoOpen, setIsFullScreenPhotoOpen] = useState(false);
  
  const hasVideo = project.id !== 'appleton-haven';

  // Media tab switcher: 'photos' or 'video'
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>(() => {
    if (project.id === 'appleton-haven') return 'photos';
    if (typeof window !== 'undefined' && (window.location.search.includes('view=video') || window.location.hash === '#video-walkthrough')) {
      return 'video';
    }
    return 'photos';
  });

  // Video management state
  const [customVideo, setCustomVideo] = useState<VideoEntry | null>(null);

  // Load custom video from default
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePhotoIndex(0);

    if (project.unitsOrPlots && project.unitsOrPlots.length > 0) {
      setSelectedUnitId(project.unitsOrPlots[0].id);
    }

    if (project.id === 'appleton-haven') {
      setActiveMediaTab('photos');
      setCustomVideo(null);
      return;
    }

    if (typeof window !== 'undefined' && (window.location.search.includes('view=video') || window.location.hash === '#video-walkthrough')) {
      setActiveMediaTab('video');
    }

    const defaultData = DEFAULT_PROJECT_VIDEOS[project.id];
    if (defaultData) {
      setCustomVideo(parseVideoUrl(defaultData.url, defaultData.title));
    } else {
      setCustomVideo(null);
    }
  }, [project.id]);

  const currentUnit =
    project.unitsOrPlots?.find((u) => u.id === selectedUnitId) ||
    project.unitsOrPlots?.[0];

  const isLand = project.propertyType === 'plots';



  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${project.title} | Caih Group`,
        text: project.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const leadToContact = (unitName?: string) => {
    const target = unitName
      ? `${project.title} - ${unitName} (${project.location})`
      : `${project.title} (${project.location})`;
    onBookInspection(target);
  };

  const otherProjects = PROJECTS.filter((p) => p.id !== project.id);

  return (
    <div className="flex flex-col w-full bg-[#FAFAFA] min-h-screen text-[#000f22]">
      {/* Clean Top Navigation Bar */}
      <div className="w-full bg-white border-b border-[#E2E8F0] pt-24 pb-4">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#000f22] hover:text-[#b7102a] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Properties</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-[#b7102a] bg-[#FFF1F2] px-3 py-1 rounded-full border border-[#FFE4E6]">
              {project.statusLabel}
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#000f22] bg-white px-3 py-1 rounded-md border border-[#E2E8F0] transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Property Overview Container */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex flex-col gap-8">
        
        {/* Title & Basic Location Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[#b7102a]">
              <span>Caih Portfolio</span>
              <span className="text-[#CBD5E1]">•</span>
              <span className="text-[#64748B]">{project.corridor}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#000f22]">
              {project.title}
            </h1>
            <p className="flex items-center gap-1.5 text-xs sm:text-sm text-[#64748B] mt-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#b7102a] shrink-0" />
              <span>{project.location}</span>
            </p>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Investment Pricing
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#b7102a] block">
              {project.priceDisplay}
            </span>
            <span className="text-xs text-emerald-700 font-semibold block">
              {project.priceSub || 'Guaranteed Direct Allocation'}
            </span>
          </div>
        </div>

        {/* Media Viewport (Increased height, reduced width & centered) */}
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
          {/* Top Media Bar with Photo & Video Tabs */}
          <div className="flex items-center justify-between pb-0.5">
            <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveMediaTab('photos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMediaTab === 'photos'
                    ? 'bg-white text-[#000f22] shadow-xs'
                    : 'text-[#64748B] hover:text-[#000f22]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photo Gallery ({project.galleryImages?.length || 1})</span>
              </button>
              {hasVideo && (
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeMediaTab === 'video'
                      ? 'bg-[#b7102a] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#b7102a]'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Tour</span>
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                </button>
              )}
            </div>

            {hasVideo && activeMediaTab === 'photos' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className="text-[11px] font-semibold text-[#b7102a] hover:underline flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0]"
                >
                  <Play className="w-3 h-3 fill-[#b7102a]" />
                  <span>Watch Video Tour</span>
                </button>
              </div>
            )}
          </div>

          {activeMediaTab === 'photos' ? (
            <>
              {/* Increased height & reduced width photo container */}
              <div
                className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] rounded-2xl overflow-hidden border border-[#E2E8F0] bg-slate-900 shadow-sm flex items-center justify-center group cursor-pointer"
                onClick={() => setIsFullScreenPhotoOpen(true)}
              >
                <img
                  src={project.galleryImages?.[activePhotoIndex] || project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className={`w-full h-full transition-transform duration-500 group-hover:scale-102 ${
                    (project.galleryImages?.[activePhotoIndex] || project.image).includes('commercial')
                      ? 'object-contain'
                      : 'object-cover'
                  }`}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#b7102a] text-white text-[10px] uppercase font-bold tracking-wider shadow">
                    {project.statusLabel}
                  </span>
                </div>

                {/* Switch to video prompt pill - hidden for Appleton Haven */}
                {hasVideo && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMediaTab('video');
                    }}
                    className="absolute bottom-3 left-3 bg-black/75 hover:bg-[#b7102a] text-white px-3 py-1.5 rounded-xl backdrop-blur-md transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold cursor-pointer z-10"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Watch Site Video</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullScreenPhotoOpen(true);
                  }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-xl backdrop-blur-md transition-all shadow-sm flex items-center gap-1.5 text-xs font-medium cursor-pointer z-10"
                  title="View Full Screen Photo"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">View Full</span>
                </button>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center text-white text-xs">
                  <span className="text-slate-300 text-[11px]">
                    {activePhotoIndex + 1} / {project.galleryImages?.length || 1}
                  </span>
                </div>
              </div>

              {project.galleryImages && project.galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                  {project.galleryImages.map((photoUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-20 sm:w-24 aspect-[16/10] shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activePhotoIndex === idx
                          ? 'border-[#b7102a] ring-2 ring-[#b7102a]/20 shadow-xs'
                          : 'border-[#E2E8F0] opacity-80 hover:opacity-100 hover:border-[#CBD5E1]'
                      }`}
                    >
                      <img
                        src={photoUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Video Tab View - Increased height & reduced width */
            <div className="flex flex-col gap-2.5">
              <div className="w-full relative bg-black flex flex-col justify-center rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm h-[380px] sm:h-[480px] md:h-[540px]">
                {customVideo ? (
                  customVideo.sourceType === 'mp4' ? (
                    <video
                      src={customVideo.embedUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={customVideo.embedUrl}
                      title={customVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 text-white gap-3">
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                      <Video className="w-7 h-7 text-[#ffb3b1]" />
                    </div>
                    <h4 className="text-base font-bold">Video Tour Coming Soon</h4>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Video className="w-4 h-4 text-[#b7102a] shrink-0" />
                  <span className="font-bold text-[#000f22] truncate">
                    {customVideo?.title || `${project.title} Video Tour`}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setActiveMediaTab('photos')}
                    className="text-xs text-[#64748B] hover:text-[#000f22] cursor-pointer"
                  >
                    View Photos ({project.galleryImages?.length || 1})
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>



        {/* Lead to Contact Page Banner (Concise, simple UI, leads to contact) */}
        <div id="project-inspection-anchor" className="rounded-2xl bg-gradient-to-r from-[#000f22] to-[#1e293b] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold tracking-wider text-[#ffb3b1] uppercase block mb-1">
              Direct Developer Contact
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Schedule an On-Site Inspection for {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              All physical inspections and inquiries are handled directly by our Corporate Desk on the Contact Page.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => leadToContact(currentUnit?.name)}
              className="py-3 px-6 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Go to Contact Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${BRAND_ASSETS.phoneClean}`}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 border border-white/15"
            >
              <Phone className="w-4 h-4 text-[#ffb3b1]" />
              <span>{BRAND_ASSETS.phone}</span>
            </a>
          </div>
        </div>

        {/* Related Projects (Clean, 3-card minimalist grid) */}
        <div className="pt-4 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#000f22]">Other Developments</h3>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-bold text-[#b7102a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {otherProjects.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProject(item)}
                className="bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group p-3"
              >
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold">
                    {item.corridor}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#000f22] group-hover:text-[#b7102a] transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-[#b7102a] shrink-0" />
                    <span>{item.location}</span>
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#b7102a]">{item.priceDisplay}</span>
                  <span className="text-[11px] font-bold text-[#000f22] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    View &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>


      {/* Fullscreen Photo Lightbox Modal */}
      {isFullScreenPhotoOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 text-white px-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-tight">{project.title}</h3>
              <p className="text-xs text-slate-400">
                Photo {activePhotoIndex + 1} of {project.galleryImages?.length || 1}
              </p>
            </div>
            <button
              onClick={() => setIsFullScreenPhotoOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Close fullscreen view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image Container */}
          <div className="relative w-full h-full max-w-7xl max-h-[80vh] flex items-center justify-center px-12 py-10">
            <img
              src={project.galleryImages?.[activePhotoIndex] || project.image}
              alt={project.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {/* Previous Photo Button */}
            {project.galleryImages && project.galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) => (prev === 0 ? project.galleryImages!.length - 1 : prev - 1));
                }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-12 w-12 h-12 rounded-full bg-black/60 hover:bg-[#b7102a] text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Photo Button */}
            {project.galleryImages && project.galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) => (prev === project.galleryImages!.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-12 w-12 h-12 rounded-full bg-black/60 hover:bg-[#b7102a] text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Thumbnail Strip in Modal */}
          {project.galleryImages && project.galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md p-2 rounded-2xl max-w-full overflow-x-auto border border-white/10">
              {project.galleryImages.map((thumbUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activePhotoIndex === idx
                      ? 'border-[#b7102a] ring-2 ring-[#b7102a]/40 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={thumbUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
