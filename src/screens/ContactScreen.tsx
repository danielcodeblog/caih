import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BRAND_ASSETS, PROJECTS } from '../data/mockData';
import { InspectionForm } from '../components/InspectionForm';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Navigation,
  ExternalLink,
  Building2,
  Award,
  ChevronRight
} from 'lucide-react';

interface ContactScreenProps {
  initialProject?: string;
  onNavigateToProjects?: () => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({
  initialProject,
  onNavigateToProjects
}) => {
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState<string>(initialProject || '');

  useEffect(() => {
    // Read ?project= from query params or location state if provided
    const params = new URLSearchParams(location.search);
    const queryProj = params.get('project');
    const stateProj = (location.state as { project?: string })?.project;

    if (queryProj) {
      const decoded = decodeURIComponent(queryProj);
      setSelectedProject(decoded);
      setTimeout(() => {
        const el = document.getElementById('contact-inspection-form');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (stateProj) {
      setSelectedProject(stateProj);
      setTimeout(() => {
        const el = document.getElementById('contact-inspection-form');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location, initialProject]);

  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. COMPACT HERO SECTION & QUICK DEVELOPER ACTIONS */}
      <section className="relative w-full bg-white pt-20 sm:pt-24 pb-8 sm:pb-10 border-b border-[#E2E8F0] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000f22_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#000f22] tracking-tight font-extrabold mb-3">
              Direct Developer Desk <span className="text-[#b7102a]">&amp; Consultation</span>
            </h1>
            
            <p className="text-sm sm:text-base text-[#475569] max-w-2xl leading-relaxed">
              Book private on-site inspections, verify certified title deeds, or speak immediately with senior Caih Group engineers and property advisors.
            </p>

            {/* Quick One-Touch Action Dock */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              <a
                href={`tel:${BRAND_ASSETS.phoneClean}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#000f22] text-white text-xs font-bold hover:bg-[#b7102a] transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Hotline: {BRAND_ASSETS.phone}</span>
              </a>
              <a
                href={`https://wa.me/${BRAND_ASSETS.phoneClean.replace('+', '')}?text=${encodeURIComponent('Hello Caih Group, I would like to speak with the Developer Desk and schedule an inspection.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DIRECT DEVELOPER DESK & SITE INSPECTION BOOKING (PROMINENT AT TOP) */}
      <div id="contact-inspection-form" className="scroll-mt-20">
        <InspectionForm
          initialProject={selectedProject || 'Appleton Enclave (Idera)'}
        />
      </div>

      {/* 3. DIRECT CONTACT CHANNELS & HEADQUARTERS DETAILS */}
      <section className="w-full bg-[#F8FAFC] py-14 border-t border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#b7102a] block mb-1">
              Physical Location &amp; Channels
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#000f22] tracking-tight">
              Corporate Headquarters &amp; Executive Desks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Lagos Headquarters */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#b7102a]/10 text-[#b7102a] flex items-center justify-center mb-5">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Corporate Headquarters
                </span>
                <h3 className="text-lg font-extrabold text-[#000f22] mb-3">
                  Lagos Executive Office
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-4">
                  {BRAND_ASSETS.address}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#64748B] pt-2 border-t border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                  <span>Mon – Sat: 8:00 AM – 6:00 PM</span>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(BRAND_ASSETS.address)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#000f22] text-xs font-bold hover:bg-[#000f22] hover:text-white transition-all cursor-pointer group"
              >
                <Navigation className="w-3.5 h-3.5 text-[#b7102a] group-hover:text-white transition-colors" />
                <span>Open Google Maps</span>
              </a>
            </div>

            {/* Card 2: Telephone & WhatsApp Hotline */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Direct Line &amp; WhatsApp
                </span>
                <h3 className="text-lg font-extrabold text-[#000f22] mb-3">
                  Developer Hotline
                </h3>
                <p className="text-base sm:text-lg font-bold text-[#b7102a] mb-2">
                  {BRAND_ASSETS.phone}
                </p>
                <p className="text-xs text-[#475569] leading-relaxed mb-4">
                  Immediate consultation with senior project engineers, plot reservation status, and sovereign title verification.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <a
                  href={`tel:${BRAND_ASSETS.phoneClean}`}
                  className="inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#000f22] text-white text-xs font-bold hover:bg-[#1E293B] transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${BRAND_ASSETS.phoneClean.replace('+', '')}?text=${encodeURIComponent('Hello Caih Group, I would like to enquire about your properties and schedule an inspection.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Card 3: Executive Email Desk */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                  Official Inquiries
                </span>
                <h3 className="text-lg font-extrabold text-[#000f22] mb-3">
                  Corporate Advisory Desk
                </h3>
                <p className="text-sm font-bold text-[#000f22] mb-2 truncate">
                  {BRAND_ASSETS.email}
                </p>
                <p className="text-xs text-[#475569] leading-relaxed mb-4">
                  For institutional acquisitions, diaspora client inquiries, EPC joint ventures, and certified surveyor due diligence.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold pt-2 border-t border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Guaranteed response within 2 hours</span>
                </div>
              </div>

              <a
                href={`mailto:${BRAND_ASSETS.email}?subject=Property%20Enquiry%20-%20Caih%20Group`}
                className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#000f22] text-xs font-bold hover:bg-[#b7102a] hover:text-white hover:border-[#b7102a] transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Write to Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS REGARDING INSPECTIONS & VISITS */}
      <section className="w-full bg-white py-16 border-t border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a] block mb-1">
                Transparency &amp; Process
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#000f22] tracking-tight">
                Site Inspection &amp; Acquisition Advisory
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <h4 className="font-bold text-sm text-[#000f22] mb-1.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Are private inspections complimentary?
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  Yes, all site inspections with Caih Group are 100% free of charge. We provide comfortable, air-conditioned executive transport departing from our Lagos office for scheduled visits across Lekki, Idera Scheme, and Epe.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <h4 className="font-bold text-sm text-[#000f22] mb-1.5 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#b7102a] shrink-0" />
                  Can my surveyor or lawyer inspect title documents?
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  Absolutely. We maintain an open-door policy for due diligence. Original certified Governor’s Consent files, survey plans, and layout coordinates are available for physical search at our Lagos office or with the Lagos State Lands Bureau (Alausa).
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <h4 className="font-bold text-sm text-[#000f22] mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  What is the procedure after selecting a plot or home?
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  Upon completion of your inspection and selection, you will receive an official allocation letter, contract of sale, and payment invoice. Physical beacon pegging is executed immediately following payment confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
