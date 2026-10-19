import React, { useState, useEffect } from 'react';
import { VideoDispatch, Project, PageId } from '../types';
import { VIDEO_DISPATCHES, PROJECTS, BRAND_ASSETS } from '../data/mockData';
import {
  ArrowLeft,
  Play,
  Pause,
  Clock,
  User,
  ShieldCheck,
  Calendar,
  Share2,
  Check,
  Building2,
  Volume2,
  Maximize2,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface VideoDetailScreenProps {
  video: VideoDispatch;
  onBack: () => void;
  onSelectVideo: (video: VideoDispatch) => void;
  onSelectProject: (project: Project) => void;
  onBookInspection: (projectTitle?: string) => void;
  onNavigate: (page: PageId) => void;
}

export const VideoDetailScreen: React.FC<VideoDetailScreenProps> = ({
  video,
  onBack,
  onSelectVideo,
  onSelectProject,
  onBookInspection,
  onNavigate
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsPlaying(false);
  }, [video.id]);

  // Simulate progress when playing
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${video.title} | Caih Group Field Dispatch`,
        text: video.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Find related project if matching title
  const matchedProject =
    PROJECTS.find((p) => video.title.toLowerCase().includes(p.title.toLowerCase().split(' ')[0])) ||
    PROJECTS[0];

  const otherVideos = VIDEO_DISPATCHES.filter((v) => v.id !== video.id);

  return (
    <div className="flex flex-col w-full bg-white animate-fadeIn">
      {/* Top Breadcrumb Navigation */}
      <div className="w-full bg-[#F8FAFC] border-b border-[#E2E8F0] pt-28 pb-5">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#000f22] hover:text-[#b7102a] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Overview</span>
            </button>
            <span className="text-[#CBD5E1] hidden sm:inline">•</span>
            <span className="text-xs text-[#94A3B8] hidden sm:inline font-medium truncate max-w-xs md:max-w-md">
              {video.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a] bg-white px-3 py-1 rounded border border-[#E2E8F0]">
              {video.tag}
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#000f22] bg-white px-3 py-1.5 rounded border border-[#E2E8F0] transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Cinema Experience */}
      <section className="w-full bg-[#000f22] text-white py-10 lg:py-14">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          {/* Simulated Video Player */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800 flex flex-col justify-between group">
            {video.embedUrl && isPlaying ? (
              <iframe
                src={`${video.embedUrl}${video.embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
                title={video.title}
                className="w-full h-full border-0 absolute inset-0 z-20"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <>
                {/* Backdrop / Video Image */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-75 group-hover:opacity-85"
                />

                {/* Top Video Overlay Bar */}
                <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Caih Field Walkthrough Stream
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-xs font-semibold text-slate-300">
                    1080p HD • Verified Audio
                  </span>
                </div>

                {/* Center Big Play/Pause Toggle */}
                <div className="relative z-10 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 rounded-full bg-[#b7102a] hover:bg-[#db313f] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                    aria-label="Play video"
                  >
                    <Play className="w-8 h-8 ml-1 fill-white" />
                  </button>
                </div>
              </>
            )}

            {/* Bottom Controls Bar */}
            <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2">
              {/* Timeline scrubber bar */}
              <div
                className="w-full h-1.5 bg-slate-700/80 rounded-full overflow-hidden cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  setVideoProgress(Math.round((clickX / rect.width) * 100));
                }}
              >
                <div
                  className="h-full bg-[#b7102a] transition-all"
                  style={{ width: `${videoProgress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="font-bold hover:text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {video.duration}
                  </span>
                  <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Stereo Audio</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    {video.tag}
                  </span>
                  <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Content & Deep Field Transcript Section */}
      <section className="w-full bg-white py-12 lg:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Title, Narrative & Key Highlights */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs text-[#94A3B8]">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a]">
                    {video.tag}
                  </span>
                  <span>•</span>
                  <span>Verified On-Site Dispatch</span>
                  <span>•</span>
                  <span>{video.duration}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#000f22] tracking-tight leading-snug">
                  {video.title}
                </h1>
              </div>

              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#000f22] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Presenter / Verified On-Site Lead</span>
                    <span className="text-sm font-bold text-[#000f22]">{video.speaker}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Certified Inspection</span>
                </div>
              </div>

              {/* In-Depth Field Description */}
              <div className="space-y-4 text-base text-[#475569] leading-relaxed">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#000f22]">
                  Field Dispatch Notes & Structural Overview
                </h3>
                <p>{video.description}</p>
                <p>
                  During this on-site recording, our engineering leads explain the exact structural specifications, foundation integrity, and material sourcing standards employed across Caih Group projects. Every construction milestone is backed by independent testing laboratory certificates and verified against international EPC building codes.
                </p>
              </div>

              {/* Key Walkthrough Insights */}
              <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#E2E8F0] space-y-3">
                <h4 className="text-sm font-bold text-[#000f22] uppercase tracking-wider">
                  Key Engineering Milestones In This Video
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-[#0F172A]">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#b7102a] mt-0.5 shrink-0" />
                    <span>Real-time inspection of high-tensile structural rebar and cast concrete curing.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#b7102a] mt-0.5 shrink-0" />
                    <span>Drainage and subterranean water table canalization along the Lekki-Epe axis.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#b7102a] mt-0.5 shrink-0" />
                    <span>Independent milestone verification guarantee for investor escrow disbursements.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Project Link & Direct Booking Card */}
            <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
              {/* Project Card */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col gap-4">
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                  Featured Development
                </span>
                <div className="aspect-[16/10] rounded-xl overflow-hidden border border-[#E2E8F0] relative">
                  <img
                    src={matchedProject.image}
                    alt={matchedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-sm text-white text-[11px] font-bold">
                    {matchedProject.priceDisplay}
                  </span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#000f22]">{matchedProject.title}</h4>
                  <p className="text-xs text-[#475569] mt-1 line-clamp-2">{matchedProject.summary}</p>
                </div>
                <button
                  onClick={() => onSelectProject(matchedProject)}
                  className="w-full py-3 px-4 rounded-xl bg-[#000f22] hover:bg-[#0a2540] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>View Full Property Page</span>
                </button>
              </div>

              {/* Schedule Walkthrough CTA */}
              <div className="bg-[#0a2540] text-white p-6 rounded-2xl flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest text-[#ffb3b1] font-bold">
                  Schedule Your Inspection
                </span>
                <h4 className="text-base font-bold leading-snug">
                  Experience this project in person with our engineering leads
                </h4>
                <p className="text-xs text-slate-300">
                  Private on-site inspections conducted Mondays through Saturdays with full gate clearance.
                </p>
                <button
                  onClick={() => onBookInspection(matchedProject.title)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book In-Person Site Visit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Video Dispatches Grid */}
      <section className="w-full bg-[#F8FAFC] py-16 border-t border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a]">
                More Field Walkthroughs
              </span>
              <h2 className="text-2xl font-bold text-[#000f22] mt-0.5">
                Related Project Videos & Reviews
              </h2>
            </div>
            <button
              onClick={() => onNavigate('blog')}
              className="text-xs font-bold text-[#b7102a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Videos & Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => onSelectVideo(vid)}
                className="group bg-white rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#b7102a] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/75 text-white text-xs font-medium">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[10px] uppercase text-[#b7102a] font-bold">
                    {vid.tag}
                  </span>
                  <h4 className="text-base font-bold text-[#000f22] mt-1 group-hover:text-[#b7102a] transition-colors line-clamp-1">
                    {vid.title}
                  </h4>
                  <p className="text-xs text-[#475569] mt-1 line-clamp-2">
                    {vid.description}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#475569]">
                    <span>{vid.speaker}</span>
                    <span className="text-[#b7102a] font-bold flex items-center gap-1">
                      Watch Video <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
