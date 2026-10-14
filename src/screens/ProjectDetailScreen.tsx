import React, { useState, useEffect } from 'react';
import { Project, PageId } from '../types';
import { PROJECTS, BRAND_ASSETS, VIDEO_DISPATCHES } from '../data/mockData';
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Share2,
  Check,
  Phone,
  ArrowRight,
  Video,
  Plus,
  Trash2,
  Edit3,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight
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
const DEFAULT_PROJECT_VIDEOS: Record<string, { url: string; title: string }> = {
  'appleton-enclave': {
    url: 'https://vimeo.com/1235852176?fl=ip&fe=ec',
    title: 'Appleton Enclave: Property Video Tour'
  },
  'appleton-court': {
    url: 'https://vimeo.com/1235839354?fl=ip&fe=ec',
    title: 'Appleton Court: Property Video Tour'
  },
  'appleton-commercial-residential': {
    url: 'https://vimeo.com/1235840039?fl=ip&fe=ec',
    title: 'Appleton Commercial & Residential: Property Video Tour'
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
  // Video management state
  const storageKey = `caih_property_video_${project.id}`;
  const [customVideo, setCustomVideo] = useState<VideoEntry | null>(null);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [videoInputUrl, setVideoInputUrl] = useState('');
  const [videoInputTitle, setVideoInputTitle] = useState('');
  const [inputError, setInputError] = useState('');

  // Load custom video from localStorage or default
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePhotoIndex(0);

    if (project.unitsOrPlots && project.unitsOrPlots.length > 0) {
      setSelectedUnitId(project.unitsOrPlots[0].id);
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.url) {
          const entry = parseVideoUrl(parsed.url, parsed.title);
          setCustomVideo(entry);
          return;
        }
      }
    } catch {
      // ignore JSON errors
    }

    // Default if no custom video stored
    const defaultData = DEFAULT_PROJECT_VIDEOS[project.id] || {
      url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      title: `${project.title} Virtual Tour`
    };
    setCustomVideo(parseVideoUrl(defaultData.url, defaultData.title));
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

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError('');

    if (!videoInputUrl.trim()) {
      setInputError('Please enter a valid video link.');
      return;
    }

    const parsed = parseVideoUrl(videoInputUrl, videoInputTitle || `${project.title} Video Tour`);
    if (!parsed) {
      setInputError('Please enter a valid YouTube, Vimeo, or MP4 link.');
      return;
    }

    setCustomVideo(parsed);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ url: parsed.url, title: parsed.title }));
    } catch {
      // storage unavailable
    }

    setIsAddVideoModalOpen(false);
    setVideoInputUrl('');
    setVideoInputTitle('');
  };

  const handleRemoveCustomVideo = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    const defaultData = DEFAULT_PROJECT_VIDEOS[project.id] || {
      url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      title: `${project.title} Virtual Tour`
    };
    setCustomVideo(parseVideoUrl(defaultData.url, defaultData.title));
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

          {/* Quick Action to Contact Desk */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => leadToContact(currentUnit?.name)}
              className="py-3 px-5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Site Visit</span>
            </button>
            <a
              href={`tel:${BRAND_ASSETS.phoneClean}`}
              className="py-3 px-4 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#000f22] text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-[#b7102a]" />
              <span className="hidden sm:inline">Call</span>
            </a>
          </div>
        </div>

        {/* Media & Key Specs Grid (Simple, high visual impact) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Media Viewport */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {project.galleryImages && project.galleryImages.length > 0 ? (
              <>
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#E2E8F0] bg-slate-900 shadow-sm flex items-center justify-center group cursor-pointer" onClick={() => setIsFullScreenPhotoOpen(true)}>
                  <img
                    src={project.galleryImages[activePhotoIndex] || project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded bg-[#b7102a] text-white text-[10px] uppercase font-bold tracking-wider shadow">
                      {project.statusLabel}
                    </span>
                  </div>
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
                  <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center justify-between text-white text-xs">
                    <span className="font-semibold truncate">
                      {project.title} - Photo {activePhotoIndex + 1}
                    </span>
                    <span className="text-slate-300 shrink-0 text-[11px] ml-2">
                      {activePhotoIndex + 1} / {project.galleryImages.length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {project.galleryImages.map((photoUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activePhotoIndex === idx
                          ? 'border-[#b7102a] ring-2 ring-[#b7102a]/20 shadow-xs'
                          : 'border-[#E2E8F0] opacity-80 hover:opacity-100 hover:border-[#CBD5E1]'
                      }`}
                    >
                      <img src={photoUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full relative bg-black flex flex-col justify-center rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm aspect-[16/10]">
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
                    <h4 className="text-base font-bold">No Video Added Yet</h4>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Clean Pricing, Specs & Booking Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Price Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#64748B] block mb-1">
                  {currentUnit ? `${currentUnit.name} Price` : 'Official Pricing'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#b7102a] tracking-tight">
                    {currentUnit ? currentUnit.priceDisplay : project.priceDisplay}
                  </span>
                  <span className="text-xs font-medium text-[#64748B]">
                    {currentUnit?.priceSub || project.priceSub}
                  </span>
                </div>
                <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded inline-flex items-center gap-1 border border-emerald-100">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Immediate Allocation & Legal Title Guarantee</span>
                </div>
              </div>

              {/* Unit / Plot Option Selector if multiple exist */}
              {project.unitsOrPlots && project.unitsOrPlots.length > 0 && (
                <div className="flex flex-col gap-2 pt-2 border-t border-[#F1F5F9]">
                  <span className="text-xs font-bold text-[#000f22]">
                    Choose {isLand ? 'Plot Dimension' : 'Configuration'}:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {project.unitsOrPlots.map((u) => {
                      const isSelected = selectedUnitId === u.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => setSelectedUnitId(u.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col ${
                            isSelected
                              ? 'border-[#b7102a] bg-[#FFF8F8] ring-1 ring-[#b7102a]/20'
                              : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                          }`}
                        >
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#b7102a]' : 'text-[#000f22]'}`}>
                            {u.size || u.name}
                          </span>
                          <span className={`text-[11px] font-extrabold mt-0.5 ${isSelected ? 'text-[#b7102a]' : 'text-[#64748B]'}`}>
                            {u.priceDisplay}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Simple 4-Card Quick Specs (Concise, no heavy text) */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#F1F5F9]">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Dimension / Size</span>
                  <span className="text-xs font-bold text-[#000f22] block mt-0.5">
                    {currentUnit?.size || project.specs.area || 'Standard Plot'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Title & Deed</span>
                  <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                    {currentUnit?.titleType || project.specs.titleType || "Governor's Consent"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                    {isLand ? 'Topography' : 'Layout'}
                  </span>
                  <span className="text-xs font-bold text-[#000f22] block mt-0.5">
                    {isLand
                      ? (currentUnit?.landType || project.specs.landType || '100% Dry Land')
                      : currentUnit?.beds
                      ? `${currentUnit.beds} Bed Terrace`
                      : 'Residential'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Allocation</span>
                  <span className="text-xs font-bold text-[#000f22] block mt-0.5">
                    {isLand ? 'Instant Beacon Pegging' : 'Immediate Allocation'}
                  </span>
                </div>
              </div>

              {/* Primary Call to Action Button */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => leadToContact(currentUnit?.name)}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book On-Site Inspection (Free)</span>
                </button>
                <p className="text-[11px] text-center text-[#64748B]">
                  Walk the land in person, inspect beacon boundaries, and review Governor’s Consent deeds.
                </p>
              </div>
            </div>

            {/* Quick Contact & Verified Title Box */}
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-[#000f22] block">Verified Legal Title</span>
                  <span className="text-[#64748B] text-[11px]">Certified with Lagos State Lands Bureau</span>
                </div>
              </div>
              <button
                onClick={() => leadToContact(currentUnit?.name)}
                className="text-xs font-bold text-[#b7102a] hover:underline shrink-0"
              >
                Inquire &rarr;
              </button>
            </div>

          </div>
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

      {/* MODAL: ADD / EMBED PROPERTY VIDEO */}
      {isAddVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 sm:p-7 relative">
            <button
              onClick={() => {
                setIsAddVideoModalOpen(false);
                setInputError('');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-[#000f22] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#b7102a] mb-1">
              <Video className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-wider">Property Video Tour</span>
            </div>

            <h3 className="text-xl font-bold text-[#000f22]">
              Add or Change Video
            </h3>
            <p className="text-xs text-[#64748B] mt-1 mb-5">
              Paste a link from YouTube, Vimeo, or a direct MP4 file. It will embed directly into this property's video tour.
            </p>

            <form onSubmit={handleSaveVideo} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#000f22] mb-1">
                  Video URL *
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/watch?v=... or .mp4"
                  value={videoInputUrl}
                  onChange={(e) => {
                    setVideoInputUrl(e.target.value);
                    if (inputError) setInputError('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#000f22] focus:outline-hidden focus:border-[#b7102a] focus:ring-1 focus:ring-[#b7102a]"
                  autoFocus
                />
                {inputError && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{inputError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000f22] mb-1">
                  Video Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. On-Site Drone Walkthrough"
                  value={videoInputTitle}
                  onChange={(e) => setVideoInputTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#000f22] focus:outline-hidden focus:border-[#b7102a] focus:ring-1 focus:ring-[#b7102a]"
                />
              </div>

              {/* Sample Quick Links */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#64748B] block mb-2">
                  Or pick a sample site video:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoInputUrl('https://www.youtube.com/watch?v=ScMzIvxBSi4');
                      setVideoInputTitle(`${project.title} Drone Flyover`);
                    }}
                    className="px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-slate-200 text-[#000f22] text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Site Drone Tour
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoInputUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                      setVideoInputTitle(`${project.title} Architectural 3D Walkthrough`);
                    }}
                    className="px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-slate-200 text-[#000f22] text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    3D Virtual Tour
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F5F9] mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVideoModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#000f22] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Save & Play Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
