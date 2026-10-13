import React, { useState, useEffect } from 'react';
import { Project, PageId } from '../types';
import { PROJECTS, BRAND_ASSETS } from '../data/mockData';
import { InspectionForm } from '../components/InspectionForm';
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Download,
  Calendar,
  Share2,
  Check,
  Building2,
  Sparkles,
  Layers,
  Phone,
  Clock,
  ArrowRight,
  Maximize2,
  FileText,
  Sun
} from 'lucide-react';

interface ProjectDetailScreenProps {
  project: Project;
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  onBookInspection: (projectTitle: string) => void;
  onNavigate: (page: PageId) => void;
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  project,
  onBack,
  onSelectProject,
  onBookInspection,
  onNavigate
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
  }, [project.id]);

  // Gallery items using high-res contextual architecture assets
  const galleryImages = [
    {
      url: project.image,
      title: 'Main Architectural Elevation',
      category: 'Exterior Facade'
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnF4eRdgMSNwDQXWuKOV8p8HTqOZaT_qv295jhmf9Vd51c0jfYkvrMiSfKJHrbkG40HA5JPIT0FnJnrk-5IwiZxz8rI48vdlrFdOX3EaXNG8GkQ9qhTQiF2aUbmjJTareJwfyD7qT-qd9crRjbSVGNC4ZM920eYyiabYTrXetv-Ro0ble4Ca3HC9AmrdbqQfgpTcgfd8i40y4jAW1K9kxd08GnuXV4qEcaoaEma8jWXJxL5MBYvsnSIw',
      title: 'Interior Executive Living & Finishes',
      category: 'Interior Architecture'
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3LOiHzMVhO4lCrKEDjGJWkyXK5t0UYDfjxWi5sOcY5WY1HfoIJCu8vKWjnMc8NEgdoLhPZBqysSQ7TLnnOH_RQVofnnvAt22ljf6K6hJWX-hMouTQ2IPwGKIm-o0XYoHpjmVYNk4Un59madpARowFZpnNpfLu-h-ilJSxy2HpDKJEMrkG49cqWmU9R8ZMTFHD2MN2p1NITvAcskjd9sk2kuuMXqsYkVP5HMZZwqrz7_Cdjb3Qgv2bZQ',
      title: 'Master Community Enclave & Landscaping',
      category: 'Estate Planning'
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpC47bcbE54rAaCiLNXn7XfkPu0Nipp9jOyIxTI5sQZ2I_JwWekuN-ThsRaiv3Cb1F7Q9-1CWxei5URI_nq5mJP_wNI8sI-3LcqSmvvnPoyxvpaUJzI4y7-6zoUtdBESR5ita26AJhkObPsB9vs1GSTHPIfD2yNNyzF4iOunfFnbXKgRs0Ue1k8lmTKAFWdD_obvPTxq8xnyRJM8Xcrhc5YlaVcQBABN9ZZcJU3j-01NmBmHBizgqwuw',
      title: 'Site Engineering & Concrete Structure',
      category: 'Engineering Telemetry'
    }
  ];

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
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDownloadBrochure = () => {
    setDownloadSuccess(true);
    // Simulate real file receipt
    const element = document.createElement('a');
    const file = new Blob(
      [
        `CAIH GROUP OFFICIAL PROPERTY BRIEF & ARCHITECTURAL SUMMARY\n` +
        `============================================================\n` +
        `Property: ${project.title}\n` +
        `Location: ${project.location} (${project.corridor})\n` +
        `Legal Title: ${project.specs.titleType || "Governor's Consent & Verified C of O"}\n` +
        `Price / Initial Deposit: ${project.priceDisplay}\n` +
        `Specifications: ${project.specs.beds ? `${project.specs.beds} Beds | ${project.specs.baths || 5} Baths` : project.specs.area}\n` +
        `Status: ${project.statusLabel}\n\n` +
        `Architectural Description:\n${project.detailedDescription}\n\n` +
        `Key Features:\n` +
        project.keyFeatures.map((f) => `- ${f}`).join('\n') +
        `\n\nContact Corporate Advisory: ${BRAND_ASSETS.phone} (${BRAND_ASSETS.email})\n`
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${project.id}-official-brochure.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4500);
  };

  const otherProjects = PROJECTS.filter((p) => p.id !== project.id);

  const scrollToInspection = () => {
    const el = document.getElementById('project-inspection-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full bg-white animate-fadeIn">
      {/* Top Breadcrumb Navigation Bar */}
      <div className="w-full bg-[#F8FAFC] border-b border-[#E2E8F0] pt-28 pb-5">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#000f22] hover:text-[#b7102a] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Developments</span>
            </button>
            <span className="text-[#CBD5E1] hidden sm:inline">•</span>
            <span className="text-xs text-[#94A3B8] hidden sm:inline font-medium truncate max-w-xs md:max-w-md">
              {project.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a] bg-white px-3 py-1 rounded border border-[#E2E8F0]">
              {project.statusLabel}
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

      {/* Main Project Hero Section */}
      <section className="w-full bg-white pt-8 pb-12 border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Imagery & Interactive Gallery */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-slate-900 group">
                <img
                  src={galleryImages[activeImageIndex].url}
                  alt={galleryImages[activeImageIndex].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {project.badge && (
                    <span className="px-3 py-1 rounded bg-[#b7102a] text-white text-[11px] uppercase font-bold tracking-wider shadow">
                      {project.badge}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold">
                    {galleryImages[activeImageIndex].category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-xl flex items-center justify-between text-white text-xs">
                  <span className="font-semibold drop-shadow">{galleryImages[activeImageIndex].title}</span>
                  <span className="text-slate-300 drop-shadow">Photo {activeImageIndex + 1} of {galleryImages.length}</span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#b7102a] shadow-md ring-2 ring-[#b7102a]/20 scale-[1.02]'
                        : 'border-[#E2E8F0] opacity-75 hover:opacity-100 hover:border-[#CBD5E1]'
                    }`}
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Title, Metadata, Pricing, Primary CTAs */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a]">
                    Caih Development Portfolio
                  </span>
                  <span className="text-[#CBD5E1]">•</span>
                  <span className="text-xs font-semibold text-[#000f22] bg-[#F1F5F9] px-2 py-0.5 rounded">
                    {project.corridor}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#000f22] tracking-tight leading-tight">
                  {project.title}
                </h1>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#475569] mt-2">
                  <MapPin className="w-4 h-4 text-[#b7102a] shrink-0" />
                  <span>{project.location}</span>
                </div>
              </div>

              {/* Price & Deposit Spotlight Box */}
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase font-bold text-[#94A3B8] tracking-wider">
                    Official Pricing / Allocation
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Escrow Protected
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#b7102a] tracking-tight">
                    {project.priceDisplay}
                  </span>
                  <span className="text-xs text-[#475569] font-medium">
                    {project.priceSub}
                  </span>
                </div>
                {project.startingDeposit && (
                  <p className="text-xs text-[#475569] border-t border-[#E2E8F0] pt-3">
                    Flexible payment options available: Initial deposit followed by verified milestone-linked construction tranches.
                  </p>
                )}
              </div>

              {/* Quick Specs 4-cell Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Configuration</span>
                  <span className="text-xs sm:text-sm font-bold text-[#000f22] block mt-0.5">
                    {project.specs.beds ? `${project.specs.beds} Beds | ${project.specs.baths || 5} Baths` : project.specs.landType || 'Commercial Asset'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Floorage / Area</span>
                  <span className="text-xs sm:text-sm font-bold text-[#000f22] block mt-0.5">
                    {project.specs.area || 'Master Serviced'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Sovereign Title</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-700 block mt-0.5">
                    {project.specs.titleType || 'Governor’s Consent'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Delivery Window</span>
                  <span className="text-xs sm:text-sm font-bold text-[#000f22] block mt-0.5">
                    {project.handoverDate || 'Immediate Allocation'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={scrollToInspection}
                  className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Private On-Site Visit</span>
                </button>
                <button
                  onClick={handleDownloadBrochure}
                  className="w-full sm:w-auto py-4 px-6 rounded-xl border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#000f22] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Plans & Brochure</span>
                </button>
              </div>

              {downloadSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official brochure and architectural brief downloaded successfully.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Architectural & Engineering Deep Dive Section */}
      <section className="w-full bg-[#F8FAFC] py-14 lg:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Narrative Column */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a] block mb-1">
                  Architectural & Structural Specifications
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#000f22] tracking-tight">
                  Engineered for Longevity & Modern Living
                </h2>
                <p className="text-base text-[#475569] mt-4 leading-relaxed">
                  {project.detailedDescription}
                </p>
              </div>

              {/* Key Features & Estate Provisions */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#000f22] mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#b7102a]" />
                  Key Development Provisions & Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {project.keyFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#0F172A] font-medium">
                      <CheckCircle className="w-4 h-4 text-[#b7102a] mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engineering Standards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-white border border-[#E2E8F0]">
                  <Layers className="w-5 h-5 text-[#b7102a] mb-2" />
                  <h4 className="text-xs font-bold text-[#000f22] uppercase tracking-wider">Foundation Piling</h4>
                  <p className="text-xs text-[#475569] mt-1">Deep bore concrete piling executed with Caih Resources equipment.</p>
                </div>
                <div className="p-5 rounded-xl bg-white border border-[#E2E8F0]">
                  <Sun className="w-5 h-5 text-[#b7102a] mb-2" />
                  <h4 className="text-xs font-bold text-[#000f22] uppercase tracking-wider">Solar Hybrid Backup</h4>
                  <p className="text-xs text-[#475569] mt-1">Central solar reticulation guaranteeing 24/7 power for critical services.</p>
                </div>
                <div className="p-5 rounded-xl bg-white border border-[#E2E8F0]">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                  <h4 className="text-xs font-bold text-[#000f22] uppercase tracking-wider">Perimeter Security</h4>
                  <p className="text-xs text-[#475569] mt-1">Monitored biometric access gates, CCTV network, and armed response.</p>
                </div>
              </div>
            </div>

            {/* Right Sticky Sidebar: Trust & Title Verification */}
            <div className="lg:col-span-4 flex flex-col gap-5 sticky top-28">
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#000f22]">Verified Legal Title</h4>
                    <span className="text-xs text-emerald-700 font-semibold">{project.specs.titleType || "Governor's Consent Certified"}</span>
                  </div>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed border-t border-[#E2E8F0] pt-3">
                  All title records for {project.title} are fully certified with the Lagos State Lands Bureau in Alausa and backed by independent legal warranties.
                </p>
                <div className="space-y-2 text-xs text-[#000f22] font-medium pt-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free from any government acquisition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Approved building layout & survey coordinates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Independent milestone engineer sign-off</span>
                  </div>
                </div>
              </div>

              {/* Developer Desk Quick Hotline */}
              <div className="bg-[#0a2540] text-white p-6 rounded-2xl flex flex-col gap-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffb3b1]">Direct Developer Advisory</span>
                <h4 className="text-base font-bold">Speak with our senior project manager today</h4>
                <p className="text-xs text-slate-300">Get private pricing breakdown, bespoke installment schedules, or CAD drawings.</p>
                <a
                  href={`tel:${BRAND_ASSETS.phoneClean}`}
                  className="mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white text-[#000f22] text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#b7102a]" />
                  <span>Call {BRAND_ASSETS.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded In-Page Inspection Booking Anchor */}
      <div id="project-inspection-anchor">
        <InspectionForm
          initialProject={`${project.title} (${project.location})`}
          onSuccess={() => {}}
        />
      </div>

      {/* Related Developments Section */}
      <section className="w-full bg-white py-16 border-t border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a]">
                More Opportunities
              </span>
              <h2 className="text-2xl font-bold text-[#000f22] mt-0.5">
                Related Caih Group Developments
              </h2>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-bold text-[#b7102a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherProjects.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectProject(item)}
                className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold">
                      {item.corridor}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-xs text-[#94A3B8] mb-1">
                      <MapPin className="w-3 h-3 text-[#b7102a]" />
                      <span>{item.location}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#000f22] group-hover:text-[#b7102a] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#475569] mt-1 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#E2E8F0]/50 mt-3 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Price</span>
                    <span className="text-sm font-extrabold text-[#b7102a]">{item.priceDisplay}</span>
                  </div>
                  <span className="text-xs font-bold text-[#000f22] group-hover:text-[#b7102a] flex items-center gap-1">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
