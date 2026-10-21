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
  Image as ImageIcon,
  Download,
  FileText,
  Map,
  ExternalLink,
  CheckCircle2,
  Bell,
  Film,
  Building2,
  HelpCircle,
  ShieldCheck
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
  'appleton-court': {
    url: 'https://www.youtube.com/embed/qa550kq6gc8',
    title: 'Welcome to Appleton Court',
    duration: '03:15',
    description: 'Official estate tour of Appleton Court on Emmanuel Akachukwu St, Ajah, by Caih Properties.'
  },
  'appleton-haven': {
    url: 'https://player.vimeo.com/video/1051104651',
    title: 'Appleton Haven: Luxury Residential Tour (Victoria Island)',
    duration: '03:45',
    description: 'Ultra-luxurious residential tower on Balarabe Musa Crescent, Victoria Island, featuring swimming pool, concierge, and elevator.'
  },
  'appleton-luxury-apartments': {
    url: 'https://player.vimeo.com/video/1051104651',
    title: 'Appleton Apartments & Maisonette: Lekki Phase 1 Tour',
    duration: '05:12',
    description: 'Executive apartments & maisonettes on Remi Olowude Street, Lekki Phase 1, with rooftop pool and smart home technology.'
  },
  'appleton-terraces-and-apartments': {
    url: '',
    title: 'Appleton Terraces and Apartments: Video Tour Coming Soon',
    duration: 'Coming Soon',
    description: 'Official 4K architectural walkthrough and site tour for Appleton Terraces and Apartments is in production.'
  },
  'appleton-enclave': {
    url: 'https://vimeo.com/1235852176?fl=ip&fe=ec',
    title: 'Appleton Enclave: Aerial Drone Survey & Topography Tour',
    duration: '04:32',
    description: 'Aerial drone inspection of the 100% dry table topography, perimeter fencing, and internal road network in Idera Scheme, Eleko.'
  },
  'appleton-commercial-residential': {
    url: 'https://vimeo.com/1235840039?fl=ip&fe=ec',
    title: 'Appleton Commercial & Residences: Free Trade Zone Corridor Tour',
    duration: '05:15',
    description: 'Strategic corridor inspection by Dangote Refinery Axis and Lekki Free Trade Zone.'
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
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [notifySubscribed, setNotifySubscribed] = useState(false);
  const [isFullScreenPhotoOpen, setIsFullScreenPhotoOpen] = useState(false);
  
  const hasVideo = true;

  // Media tab switcher: 'photos' or 'video'
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>(() => {
    if (typeof window !== 'undefined' && (window.location.search.includes('view=video') || window.location.hash === '#video-walkthrough')) {
      return 'video';
    }
    return 'photos';
  });

  // Video management state
  const [customVideo, setCustomVideo] = useState<VideoEntry | null>(null);

  // Load custom video from default or project.videoList
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePhotoIndex(0);
    setActiveVideoIndex(0);
    setNotifySubscribed(false);

    if (project.unitsOrPlots && project.unitsOrPlots.length > 0) {
      setSelectedUnitId(project.unitsOrPlots[0].id);
    }

    if (typeof window !== 'undefined' && (window.location.search.includes('view=video') || window.location.hash === '#video-walkthrough')) {
      setActiveMediaTab('video');
    }

    if (project.videoList && project.videoList.length > 0) {
      const firstVid = project.videoList[0];
      setCustomVideo(parseVideoUrl(firstVid.url, firstVid.title));
    } else {
      const defaultData = DEFAULT_PROJECT_VIDEOS[project.id];
      if (defaultData && defaultData.url) {
        setCustomVideo(parseVideoUrl(defaultData.url, defaultData.title));
      } else {
        setCustomVideo(null);
      }
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
                  {project.videoComingSoon ? (
                    <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                  )}
                </button>
              )}
            </div>

            {hasVideo && activeMediaTab === 'photos' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className="text-[11px] font-semibold text-[#b7102a] hover:underline flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0]"
                >
                  <Play className="w-3 h-3 fill-[#b7102a]" />
                  <span>{project.videoComingSoon ? 'Video Tour (Coming Soon)' : 'Watch Video Tour'}</span>
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
                    <span>{project.videoComingSoon ? 'Video Walkthrough (Coming Soon)' : 'Watch Site Video'}</span>
                    {project.videoComingSoon && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-0.5" />
                    )}
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
            /* Video Tab View */
            <div className="flex flex-col gap-2.5">
              {project.videoComingSoon ? (
                /* Cinematic Coming Soon View Inspired by User's Uploaded Mobile Screen */
                <div className="w-full relative bg-[#07080a] flex flex-col items-center justify-center text-center p-6 sm:p-12 rounded-2xl overflow-hidden border border-slate-800 shadow-xl h-[380px] sm:h-[480px] md:h-[540px] select-none">
                  {/* Atmospheric radial gradient glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(183,16,42,0.22)_0,transparent_70%)] pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto w-full px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#ffb3b1] text-[11px] font-bold tracking-widest uppercase mb-4 backdrop-blur-xs">
                      <Film className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                      <span>Official 4K Walkthrough • In Production</span>
                    </div>

                    <h3 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-widest text-white uppercase drop-shadow-lg mb-3">
                      COMING SOON
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed max-w-md">
                      The official video walkthrough and architectural tour for <span className="text-white font-semibold">{project.title}</span> ({project.location}) is currently in final editing.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                      <button
                        type="button"
                        onClick={() => leadToContact('Schedule Physical Inspection')}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Schedule Physical Inspection</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNotifySubscribed(true);
                          setTimeout(() => setNotifySubscribed(false), 4000);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                        <span>{notifySubscribed ? 'Subscribed!' : 'Get Notified on Release'}</span>
                      </button>
                    </div>

                    {notifySubscribed && (
                      <div className="mt-3.5 px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5 animate-fade-in">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>You will be notified immediately when the video tour goes live!</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Standard Video Embed Player */
                <>
                  {/* Playlist Tabs if project has multiple videos */}
                  {project.videoList && project.videoList.length > 1 && (
                    <div className="flex items-center gap-2 p-1.5 bg-[#F1F5F9] rounded-xl overflow-x-auto">
                      {project.videoList.map((vid, vIdx) => (
                        <button
                          key={vIdx}
                          type="button"
                          onClick={() => {
                            setActiveVideoIndex(vIdx);
                            setCustomVideo(parseVideoUrl(vid.url, vid.title));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeVideoIndex === vIdx
                              ? 'bg-white text-[#000f22] shadow-xs'
                              : 'text-[#64748B] hover:text-[#000f22]'
                          }`}
                        >
                          <Play className="w-3 h-3 text-[#b7102a] fill-[#b7102a]" />
                          <span>Video {vIdx + 1}: {vid.title.replace(`${project.title}:`, '').trim() || vid.title}</span>
                        </button>
                      ))}
                    </div>
                  )}

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
                </>
              )}

              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Video className="w-4 h-4 text-[#b7102a] shrink-0" />
                  <span className="font-bold text-[#000f22] truncate">
                    {customVideo?.title || (project.videoComingSoon ? `${project.title}: Video Tour Coming Soon` : `${project.title} Video Tour`)}
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

        {/* Estate Overview, Architecture, Key Features & Neighborhood Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Story & Verified Features */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b7102a] mb-1.5">
                <Building2 className="w-4 h-4" />
                <span>Estate Overview & Architecture</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#000f22]">
                About {project.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mt-3 whitespace-pre-line">
                {project.detailedDescription || project.summary}
              </p>
            </div>

            {/* Verified Estate Amenities & Key Infrastructure */}
            {project.keyFeatures && project.keyFeatures.length > 0 && (
              <div className="pt-5 border-t border-[#E2E8F0]">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#000f22] mb-3.5">
                  Verified Estate Amenities & Infrastructure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.keyFeatures.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#1E293B]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Neighbourhood & Surrounding Landmarks */}
            {project.neighbourhood && project.neighbourhood.length > 0 && (
              <div className="pt-5 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[#b7102a]" />
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#000f22]">
                    Key Neighbourhood Landmarks ({project.corridor})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.neighbourhood.map((nh, nIdx) => (
                    <div
                      key={nIdx}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#334155] shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b7102a] shrink-0" />
                      <span className="font-medium">{nh}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Quick Snapshot, Official FAQ/Form Download & Location Map */}
          <div className="flex flex-col gap-5">
            {/* Property Snapshot Card */}
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-4">
                Property Snapshot
              </h3>
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Status:</span>
                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                    project.status === 'completed'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {project.statusLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Title Deed:</span>
                  <span className="font-bold text-[#000f22]">{project.specs.titleType || 'Governor’s Consent'}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Topography:</span>
                  <span className="font-bold text-[#000f22]">{project.specs.landType || '100% Dry Land'}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Allocation:</span>
                  <span className="font-bold text-[#000f22]">{project.paymentType || 'Direct Physical Allocation'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Corridor:</span>
                  <span className="font-bold text-[#000f22]">{project.corridor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full SQM Breakdown & Comparison Cards */}
        {project.unitsOrPlots && project.unitsOrPlots.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#b7102a] block mb-1">
                  DETAILED SQM PRICING BREAKDOWN
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#000f22]">
                  Different Prices for All SQM Sizes ({project.title})
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Direct physical allocation across all parcel configurations. Legitimate sovereign titles with zero dispute risk.
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] font-semibold text-slate-500 block">Sovereign Title Deed</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mt-0.5">
                  {project.specs.titleType || 'Verified Sovereign Title'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {project.unitsOrPlots.map((u) => {
                const isSelected = selectedUnitId === u.id;
                return (
                  <div
                    key={u.id}
                    className={`rounded-2xl p-5 sm:p-6 border flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-[#b7102a] bg-[#FFF1F2]/20 shadow-md ring-2 ring-[#b7102a]/20'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] hover:bg-white hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-xs uppercase font-extrabold tracking-wider bg-[#000f22] text-white px-3 py-1 rounded-md">
                          {u.size || u.name}
                        </span>
                        {u.isPopular ? (
                          <span className="text-[10px] font-bold text-[#b7102a] bg-[#FFF1F2] px-2.5 py-0.5 rounded-full border border-[#FFE4E6]">
                            Popular
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Available
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-base text-[#000f22] mb-1">
                        {u.name}
                      </h4>
                      <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
                        {u.description}
                      </p>

                      <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-2xs mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                            Investment Price
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-700">
                            {u.landType || project.specs.landType || '100% Dry Land'}
                          </span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-[#b7102a] mt-1">
                          {u.priceDisplay}
                        </div>
                        <span className="text-[11px] text-[#475569] font-medium block mt-1">
                          {u.priceSub || u.size} • {u.paymentType || 'Direct Allocation'}
                        </span>
                      </div>

                      {u.features && u.features.length > 0 && (
                        <div className="space-y-2 mb-5">
                          <span className="text-[11px] font-bold text-[#000f22] block uppercase tracking-wider">
                            Parcel Highlights:
                          </span>
                          {u.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-xs text-[#334155]">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUnitId(u.id);
                        leadToContact(u.name);
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#b7102a] hover:bg-[#db313f] text-white shadow-sm'
                          : 'bg-white hover:bg-[#000f22] hover:text-white border border-[#CBD5E1] text-[#000f22]'
                      }`}
                    >
                      <span>Inquire & Reserve {u.size || u.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Official Payment Plan Structure & Designated Bank Account (from Form & FAQ) */}
        {project.paymentTable && project.paymentTable.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#b7102a] block mb-1">
                  OFFICIAL PAYMENT STRUCTURE
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#000f22]">
                  {project.title} Installment Schedule
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Flexible outright and monthly installment plans verified in the official Caih Group Form & FAQ.
                </p>
              </div>
              {project.faqPdfUrl && (
                <a
                  href={project.faqPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#b7102a] hover:underline bg-[#FFF1F2] px-3 py-2 rounded-xl border border-[#FFE4E6]"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Form & FAQ PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Responsive Payment Plan Table */}
            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#000f22] text-white">
                    <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Plot Size</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Initial Deposit</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">0 – 3 Months</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">4 – 6 Months</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {project.paymentTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-extrabold text-[#000f22]">
                        <span className="bg-[#000f22]/5 text-[#000f22] px-2.5 py-1 rounded-md font-bold">
                          {row.plotSize}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-bold text-amber-700">{row.initialDeposit}</td>
                      <td className="py-4 px-4 sm:px-6 font-extrabold text-[#b7102a]">{row.threeMonths}</td>
                      <td className="py-4 px-4 sm:px-6 font-semibold text-[#334155]">{row.sixMonths}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Designated Bank Account Notice */}
            {project.bankingDetails && (
              <div className="mt-6 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#FFF1F2] to-white border border-[#FFE4E6] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#b7102a] text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#000f22] uppercase tracking-wide">
                      Official Designated Account Notice
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      No cash payments are accepted by consultants. All payments must be remitted strictly to:
                    </p>
                  </div>
                </div>
                <div className="bg-white px-4 py-2.5 rounded-lg border border-[#E2E8F0] shadow-2xs text-xs">
                  <div className="font-bold text-[#000f22]">{project.bankingDetails.accountName}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-extrabold text-[#b7102a] text-sm tracking-wider">
                      {project.bankingDetails.accountNumber}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-700">{project.bankingDetails.bankName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Frequently Asked Questions (FAQ) Accordion from Official PDF */}
        {project.faqs && project.faqs.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b7102a] mb-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Verified Estate Guidelines</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#000f22] mb-6">
              Frequently Asked Questions (FAQ)
            </h3>

            <div className="space-y-3">
              {project.faqs.map((faqItem, fIdx) => (
                <details
                  key={fIdx}
                  className="group rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all open:bg-white open:border-[#CBD5E1] open:shadow-xs"
                >
                  <summary className="flex items-center justify-between font-bold text-xs sm:text-sm text-[#000f22] cursor-pointer list-none gap-3">
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#000f22]/5 text-[#b7102a] flex items-center justify-center text-[11px] font-black shrink-0">
                        Q
                      </span>
                      <span>{faqItem.question}</span>
                    </span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform text-sm shrink-0">
                      ▼
                    </span>
                  </summary>
                  <div className="mt-3.5 pl-7 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-[#F1F5F9] pt-3">
                    {faqItem.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
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
