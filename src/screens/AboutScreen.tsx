import React, { useState, useEffect } from 'react';
import { EXECUTIVES, BRAND_ASSETS, TESTIMONIALS } from '../data/mockData';
import { Executive } from '../types';
import {
  ShieldCheck,
  Building2,
  HardHat,
  Truck,
  Phone,
  ArrowRight,
  Award,
  Users,
  CheckCircle,
  ExternalLink,
  MapPin,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  Download,
  Compass,
  CheckCircle2,
  Globe2
} from 'lucide-react';

interface AboutScreenProps {
  onContactDesk: () => void;
  onNavigateToProjects: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({
  onContactDesk,
  onNavigateToProjects
}) => {
  const [testimonialSlideIndex, setTestimonialSlideIndex] = useState(0);
  const [isTestimonialAutoPlaying, setIsTestimonialAutoPlaying] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxVideo, setLightboxVideo] = useState<{ url: string; title: string } | null>(null);
  const [showCompanyProfileModal, setShowCompanyProfileModal] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);

  useEffect(() => {
    let timer: any;
    if (isTestimonialAutoPlaying) {
      timer = setInterval(() => {
        setTestimonialSlideIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isTestimonialAutoPlaying]);

  const handlePrevTestimonial = () => {
    setTestimonialSlideIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setTestimonialSlideIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const managingDirector = EXECUTIVES[0];
  const boardLeaders = EXECUTIVES.slice(1);

  return (
    <div className="flex flex-col w-full bg-white">
      {/* CORPORATE OVERVIEW: CAIH PROPERTIES & REAL ESTATE MISSION */}
      <section className="pt-28 sm:pt-32 pb-20 lg:pb-28 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="max-w-4xl mx-auto flex flex-col items-start">
              <div className="flex items-center gap-2 text-[#b7102a] mb-3">
                <Building2 className="w-4 h-4 text-[#b7102a]" />
                <span className="text-[11px] uppercase tracking-wider font-bold">
                  About Caih Properties · Real Estate Excellence
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#000f22] font-extrabold tracking-tight mb-5 leading-tight">
                Crafting Master-Planned Communities &amp; High-Yield Property Investments
              </h2>

              <div className="space-y-4 text-[#475569] text-sm sm:text-base leading-relaxed">
                <p className="font-semibold text-[#000f22] text-base sm:text-lg border-l-4 border-[#b7102a] pl-4 py-0.5">
                  CAIH Properties is a premier real estate development and investment company duly registered with the Corporate Affairs Commission (CAC) Nigeria.
                </p>

                <p>
                  Increasing urbanization, changing demographics, and the demand for high-integrity housing in Nigeria are defining megatrends. At CAIH Properties, we transform these dynamics into exceptional opportunities, delivering architecturally refined estates, fully serviced residential plots, and solid, high-appreciating real estate assets to our homeowners and global diaspora investors.
                </p>

                <p>
                  Our landmark developments including Appleton Court, Appleton Enclave, Appleton Gardens, and Appleton Haven stand as benchmarks along Lagos’s prime growth corridors. Every single property is backed by 100% dry table land, verified sovereign title documentation (Governor’s Consent, C of O, Gazette), and fully integrated modern infrastructure including 24/7 security, potable water, and interlocked road networks.
                </p>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <p className="text-base sm:text-lg font-bold text-[#b7102a] tracking-tight">
                    &ldquo;By looking into the future, we give our property investors and homeowners a definitive, competitive head start.&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onNavigateToProjects}
                  className="px-5 py-3 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-white" />
                  <span>Explore All Properties</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompanyProfileModal(true)}
                  className="px-5 py-3 rounded-xl bg-[#000f22] hover:bg-[#0a2540] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#ffb3b1]" />
                  <span>View Company Profile</span>
                </button>
                <button
                  type="button"
                  onClick={onContactDesk}
                  className="px-5 py-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#000f22] text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#b7102a]" />
                  <span>Consult Advisory Desk</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      {/* 3. THE THREE CONGLOMERATE SECTORS */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-[#E2E8F0]" id="conglomerate-sectors">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#b7102a] mb-3">
                <span className="text-[11px] uppercase tracking-wider font-bold">
                  Conglomerate Synergy
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#000f22] font-extrabold tracking-tight">
                The Three Structural Pillars of Caih Group
              </h2>
            </div>
            <p className="text-sm text-[#475569] max-w-md leading-relaxed">
              Integrating master-planned real estate (Caih Properties), turnkey contracting (Caih Contractors), and heavy industrial building resources (Caih Resources) into a unified sovereign powerhouse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#E2E8F0]">
              <div className="relative h-56 bg-black overflow-hidden group">
                <iframe
                  src="https://www.youtube.com/embed/qa550kq6gc8?autoplay=1&mute=1&loop=1&playlist=qa550kq6gc8&controls=0&showinfo=0&rel=0"
                  title="Caih Properties Video Tour"
                  className="w-full h-full border-0 pointer-events-none scale-125"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-xs z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb3b1] animate-pulse"></span>
                  <span>VIDEO TOUR</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxVideo({
                    url: 'https://www.youtube.com/embed/qa550kq6gc8?autoplay=1',
                    title: 'Caih Properties Video Tour'
                  })}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer z-20"
                >
                  <Maximize2 className="w-5 h-5 text-[#ffb3b1]" />
                  <span>Expand Video</span>
                </button>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-[#b7102a]" />
                  <h3 className="text-lg font-bold text-[#000f22]">Caih Properties</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed flex-1">
                  Master-planned residential estates, site &amp; serviced plots, and luxury duplexes with 24/7 security and verified documentation.
                </p>
              </div>
            </div>

            <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#E2E8F0]">
              <div className="relative h-56 bg-black overflow-hidden group">
                <iframe
                  src="https://www.youtube.com/embed/ihEzpBhqRjY?autoplay=1&mute=1&loop=1&playlist=ihEzpBhqRjY&controls=0&showinfo=0&rel=0"
                  title="Caih Contractors Video Tour"
                  className="w-full h-full border-0 pointer-events-none scale-125"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-xs z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb3b1] animate-pulse"></span>
                  <span>VIDEO TOUR</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxVideo({
                    url: 'https://www.youtube.com/embed/ihEzpBhqRjY?autoplay=1',
                    title: 'Caih Contractors Video Tour'
                  })}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer z-20"
                >
                  <Maximize2 className="w-5 h-5 text-[#ffb3b1]" />
                  <span>Expand Video</span>
                </button>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <HardHat className="w-5 h-5 text-[#b7102a]" />
                  <h3 className="text-lg font-bold text-[#000f22]">Caih Contractors</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed flex-1">
                  Turnkey general contracting, civil infrastructure across green and brown fields, tailored structural designs, and foundation engineering.
                </p>
              </div>
            </div>

            <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#E2E8F0]">
              <div className="relative h-56 bg-black overflow-hidden group">
                <iframe
                  src="https://player.vimeo.com/video/1237939360?autoplay=1&muted=1&loop=1&background=1"
                  title="Caih Resources Video Tour"
                  className="w-full h-full border-0 pointer-events-none scale-125"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-xs z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb3b1] animate-pulse"></span>
                  <span>VIDEO TOUR</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxVideo({
                    url: 'https://player.vimeo.com/video/1237939360?autoplay=1',
                    title: 'Caih Resources Video Tour'
                  })}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs cursor-pointer z-20"
                >
                  <Maximize2 className="w-5 h-5 text-[#ffb3b1]" />
                  <span>Expand Video</span>
                </button>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-[#b7102a]" />
                  <h3 className="text-lg font-bold text-[#000f22]">Caih Resources</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed flex-1">
                  Preventive and curative maintenance services, heavy infrastructure equipment leasing, and integrated building resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE PEOPLE / EXECUTIVE LEADERSHIP */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#E2E8F0]" id="leadership">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center gap-2 text-[#b7102a] mb-3">
              <span className="text-[11px] uppercase tracking-wider font-bold">
                The People
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#000f22] font-extrabold tracking-tight mb-4">
              The People Behind Caih Group
            </h2>
            <p className="text-sm md:text-base text-[#475569] leading-relaxed">
              Distinguished engineers, clinicians, and global enterprise leaders bringing over four decades of collective EPC turnkey execution and corporate governance to Nigeria.
            </p>
          </div>

          {/* MANAGING DIRECTOR SPOTLIGHT: Engr. Kayode Olorunfemi */}
          {managingDirector && (
            <div className="mb-16 bg-[#F8FAFC] rounded-3xl border border-[#CBD5E1] p-6 sm:p-10 lg:p-12 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[3/4] w-full max-w-sm bg-[#F1F5F9] border-2 border-white">
                    <img
                      src={managingDirector.image}
                      alt={managingDirector.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-4 left-4 bg-[#000f22]/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-wider uppercase border border-white/20">
                      Managing Director
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase font-extrabold text-[#b7102a] tracking-widest">
                      The People · Executive Directorate
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#000f22] tracking-tight">
                    Meet our Managing Director — {managingDirector.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono font-bold text-[#b7102a] mt-1 mb-6">
                    ({managingDirector.credentials})
                  </p>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 rounded-full bg-white border border-[#CBD5E1] text-[11px] font-bold text-[#000f22] flex items-center gap-1.5 shadow-2xs">
                      <Award className="w-3.5 h-3.5 text-[#b7102a]" />
                      20+ Years EPC Turnkey Projects
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white border border-[#CBD5E1] text-[11px] font-bold text-[#000f22] flex items-center gap-1.5 shadow-2xs">
                      <GraduationCap className="w-3.5 h-3.5 text-[#b7102a]" />
                      London School of Economics · Wharton · Aston
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white border border-[#CBD5E1] text-[11px] font-bold text-[#000f22] flex items-center gap-1.5 shadow-2xs">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                      COREN Registered &amp; MNSE
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white border border-[#CBD5E1] text-[11px] font-bold text-[#000f22] flex items-center gap-1.5 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Certified Green Building Expert
                    </span>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm text-[#475569] leading-relaxed">
                    <p>
                      Kayode Olorunfemi is a seasoned Engineer, Project Manager and a Philanthropist with over two decades of post-graduation work experience in EPC Turnkey Projects across the world. He has a First Degree and Masters Degree in Engineering from Birmingham in the United Kingdom where he began his career.
                    </p>
                    <p>
                      He has attended several business management and leadership courses in institutions of high repute including London School of Economics, Aston Business School and The Wharton School of the University of Pennsylvania, USA.
                    </p>
                    <p>
                      He is a COREN Registered Engineer and also a Member of the Nigeria Society of Engineers, NSE. He is a Certified Cost Professional and a Certified Green Building Expert. Kayode is a resource person to institutions, religious organizations and a consultant to several others.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOARD LEADERS: Dr Paul Olorunfemi & Mr. John Obafaiye */}
          <div className="text-center mb-8">
            <span className="text-xs uppercase font-extrabold text-[#b7102a] tracking-widest block mb-1">
              The People
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#000f22]">
              Board of Directors &amp; Executive Leadership
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {boardLeaders.map((exec, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-[#CBD5E1] shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#E2E8F0]">
                    <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden shrink-0 bg-slate-200 border-2 border-white shadow-md">
                      <img
                        src={exec.image}
                        alt={exec.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex flex-col text-center sm:text-left">
                      <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#b7102a] mb-1">
                        The People · Director
                      </span>
                      <h4 className="text-xl sm:text-2xl font-extrabold text-[#000f22]">
                        {exec.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#64748B] mt-0.5 mb-3">
                        {exec.credentials}
                      </p>
                      <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                        {idx === 0 ? (
                          <>
                            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[10px] font-bold text-slate-700">
                              Univ. of Illinois Alumnus
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[10px] font-bold text-slate-700">
                              Univ. of Miami Fellow
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[10px] font-bold text-slate-700">
                              Clinical Medicine &amp; Policy
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[10px] font-bold text-slate-700">
                              25+ Yrs Oil &amp; Gas Leadership
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[10px] font-bold text-slate-700">
                              Kenan-Flagler Business School
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[10px] font-bold text-slate-700">
                              COREN · NSE · SPE · PMP
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[10px] font-bold text-slate-700">
                              Licensed Texas Realtor
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 space-y-3.5 text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {exec.bio?.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified Board Governance
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedExecutive(exec)}
                    className="text-[#b7102a] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read Full Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLIENT & INSTITUTIONAL ENDORSEMENTS (MATCHING HOME TESTIMONIALS CAROUSEL) */}
      <section className="py-20 lg:py-28 bg-[#FAFAFA] border-b border-[#E2E8F0]" id="client-endorsements">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
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

      {/* EXECUTIVE FULL PROFILE MODAL */}
      {selectedExecutive && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedExecutive(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedExecutive(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
              <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border">
                <img
                  src={selectedExecutive.image}
                  alt={selectedExecutive.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#b7102a] uppercase tracking-wider block">
                  The People · Executive Profile
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#000f22]">
                  {selectedExecutive.name}
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  {selectedExecutive.role} • {selectedExecutive.credentials}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              {selectedExecutive.bio?.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedExecutive(null)}
                className="px-5 py-2.5 rounded-xl bg-[#000f22] text-white text-xs font-bold hover:bg-[#0a2540] transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPANY PROFILE MODAL */}
      {showCompanyProfileModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setShowCompanyProfileModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowCompanyProfileModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-[#000f22] text-white flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-[#b7102a]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#b7102a] uppercase tracking-wider block">
                  Official Corporate Dossier
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#000f22]">
                  CAIH Properties
                </h3>
                <p className="text-xs text-slate-500">
                  Premier Real Estate Division of Caih Group · CAC Registered
                </p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#000f22] mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Legal Registration &amp; Title Sanctity
                </h4>
                <p>
                  CAIH Properties is a premier real estate development arm duly registered with the Nigerian Corporate Affairs Commission (CAC). Every property project in our portfolio is secured with verifiable statutory titles including Governor’s Consent, Certificate of Occupancy (C of O), and approved layouts.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#000f22] mb-2">
                  Addressing Housing &amp; Wealth Megatrends
                </h4>
                <p>
                  Accelerated urbanization and demographic shifts along the Lekki-Epe expressway corridor demand reliable, master-planned living environments. CAIH Properties capitalizes on these dynamics by delivering turnkey luxury homes and fully-serviced residential plots that guarantee substantial capital appreciation and enduring peace of mind.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#000f22] mb-2">
                  Core Property Capabilities &amp; Estate Infrastructure
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>100% dry table land along high-growth Lekki &amp; Ajah corridors.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Perimeter fencing, interlocked road networks &amp; covered drainage.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Armed security personnel, CCTV coverage &amp; 24/7 power infrastructure.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Instant physical allocation with verified documentation.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#000f22] text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffb3b1] block mb-1">
                  Corporate Philosophy
                </span>
                <p className="text-base font-bold text-white">
                  &ldquo;By looking into the future, we give our property investors and subscribers a definitive competitive head start.&rdquo;
                </p>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#000f22] mb-2">
                  Head Office &amp; Contact Desk
                </h4>
                <p className="text-xs text-slate-600">
                  📍 {BRAND_ASSETS.address}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  📞 {BRAND_ASSETS.phone} • ✉️ {BRAND_ASSETS.email} • 🌐 www.caihgroup.com
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <a
                href="https://caihgroup.com/wp-content/uploads/2024/11/APPLETON-FORM-FAQ.pdf"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#b7102a]" />
                <span>Download Corporate FAQ Form (PDF)</span>
              </a>
              <button
                type="button"
                onClick={() => setShowCompanyProfileModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#000f22] text-white text-xs font-bold hover:bg-[#0a2540] transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CORPORATE CALL TO ACTION BANNER */}
      <section className="py-20 bg-white" id="consultation">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="bg-[#0a2540] text-white rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl text-white font-extrabold tracking-tight mb-2">
                Ready to Discuss Your Next Project?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect with our corporate advisory and engineering desk for properties, civil contracts, site serviced plots, and building maintenance.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <a
                href={`tel:${BRAND_ASSETS.phoneClean}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#b7102a] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#db313f] transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>{BRAND_ASSETS.phone}</span>
              </a>
              <button
                onClick={onContactDesk}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#000f22] text-xs sm:text-sm font-bold hover:bg-slate-100 transition-all cursor-pointer"
              >
                <span>Contact Consultation Desk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO LIGHTBOX MODAL */}
      {lightboxVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#000f22] border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-white font-bold text-base">{lightboxVideo.title}</h3>
              <button
                type="button"
                onClick={() => setLightboxVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={lightboxVideo.url}
                title={lightboxVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
