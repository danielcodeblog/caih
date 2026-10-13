import React from 'react';
import { EXECUTIVES, BRAND_ASSETS } from '../data/mockData';
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
  ExternalLink
} from 'lucide-react';

interface AboutScreenProps {
  onContactDesk: () => void;
  onNavigateToProjects: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({
  onContactDesk,
  onNavigateToProjects
}) => {
  return (
    <div className="flex flex-col w-full bg-white">
      {/* 2. HERO SECTION */}
      <section className="relative w-full bg-white pt-28 sm:pt-32 pb-20 lg:pb-28 border-b border-[#E2E8F0] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000f22_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-[64px] lg:leading-[1.12] text-[#000f22] tracking-tight mb-6">
              Building Modern Nigeria with <span className="text-[#b7102a]">Integrity & Craftsmanship</span>
            </h1>
            <p className="text-lg md:text-xl text-[#475569] max-w-3xl leading-relaxed mb-8">
              Delivering institutional-grade EPC engineering, certified Governor’s Consent titles, and sustainable master-planned communities across West Africa.
            </p>
          </div>

          {/* Credibility Metric Box */}
          <div className="w-full max-w-4xl mx-auto bg-[#F8FAFC] rounded-2xl shadow-sm p-8 border border-[#E2E8F0]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
              <div className="flex flex-col items-center px-4 pt-4 md:pt-0">
                <span className="text-3xl lg:text-4xl text-[#000f22] font-extrabold tracking-tight">
                  20+ Years
                </span>
                <span className="text-xs sm:text-sm text-[#475569] mt-1 font-medium">
                  Industry Experience
                </span>
              </div>
              <div className="flex flex-col items-center px-4 pt-4 md:pt-0">
                <span className="text-3xl lg:text-4xl text-[#b7102a] font-extrabold tracking-tight">
                  100%
                </span>
                <span className="text-xs sm:text-sm text-[#475569] mt-1 font-medium">
                  Verified Titles
                </span>
              </div>
              <div className="flex flex-col items-center px-4 pt-4 md:pt-0">
                <span className="text-3xl lg:text-4xl text-[#000f22] font-extrabold tracking-tight">
                  ₦3.2B+
                </span>
                <span className="text-xs sm:text-sm text-[#475569] mt-1 font-medium">
                  Portfolio Delivered
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHO WE ARE & ARCHITECTURAL FOUNDATION */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-[#F1F5F9] border border-[#E2E8F0]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3LOiHzMVhO4lCrKEDjGJWkyXK5t0UYDfjxWi5sOcY5WY1HfoIJCu8vKWjnMc8NEgdoLhPZBqysSQ7TLnnOH_RQVofnnvAt22ljf6K6hJWX-hMouTQ2IPwGKIm-o0XYoHpjmVYNk4Un59madpARowFZpnNpfLu-h-ilJSxy2HpDKJEMrkG49cqWmU9R8ZMTFHD2MN2p1NITvAcskjd9sk2kuuMXqsYkVP5HMZZwqrz7_Cdjb3Qgv2bZQ"
                  alt="Caih Group Modernist Architecture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-white/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-[#b7102a]" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#000f22] font-extrabold block">
                        CAIH HEADQUARTERS
                      </span>
                      <span className="text-xs text-[#475569]">
                        Lekki-Epe Axis, Lagos
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <span className="font-medium tracking-wide uppercase text-[10px]">
                      Operational Site
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="flex items-center gap-2 text-[#b7102a] mb-3">
                <span className="text-[11px] uppercase tracking-wider font-bold">
                  Who We Are
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#000f22] font-extrabold tracking-tight mb-6 leading-tight">
                Engineering Reliability & Quality Spaces for Nigeria
              </h2>
              <p className="text-base md:text-lg text-[#475569] leading-relaxed mb-6">
                Caih Group unites master-planned residential property developments, turnkey civil engineering, and heavy industrial building resources into a cohesive powerhouse.
              </p>
              <p className="text-sm md:text-base text-[#475569] leading-relaxed mb-6">
                From premium family communities in Lekki Phase 2 to high-capacity structural foundation piling and road engineering along the Epe economic corridor, our hallmark is unwavering precision, verifiable title authenticity, and lasting craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE THREE CONGLOMERATE SECTORS */}
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
              Integrating master-planned real estate, turnkey civil construction, and heavy industrial building resources into a unified sovereign powerhouse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#E2E8F0]">
              <div className="relative h-56 bg-[#F1F5F9] overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpC47bcbE54rAaCiLNXn7XfkPu0Nipp9jOyIxTI5sQZ2I_JwWekuN-ThsRaiv3Cb1F7Q9-1CWxei5URI_nq5mJP_wNI8sI-3LcqSmvvnPoyxvpaUJzI4y7-6zoUtdBESR5ita26AJhkObPsB9vs1GSTHPIfD2yNNyzF4iOunfFnbXKgRs0Ue1k8lmTKAFWdD_obvPTxq8xnyRJM8Xcrhc5YlaVcQBABN9ZZcJU3j-01NmBmHBizgqwuw"
                  alt="Caih Properties"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-[#b7102a]" />
                  <h3 className="text-lg font-bold text-[#000f22]">Caih Properties</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed flex-1">
                  Master-planned residential estates and luxury serviced duplexes with 24/7 security.
                </p>
              </div>
            </div>

            <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#E2E8F0]">
              <div className="relative h-56 bg-[#F1F5F9] overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH98qz3hJJWxr6Cvud_k8b-BNisFlBDXwgOqw9ioesdnfBm5EtGgnDsDrerr5fv2fzJlz5PwSFijZGx5VzG28EeZAqYdc6SDAr5I4LZXt2mioYWWcSNC0EaNccQuJE7VECSLsGd8MUoKzBqGmRJwpxmZ-iMEwjYzZyL0rLcoCyxtJbGLzuUF_6sDY2QSdrxlmt6i6HtSFkF05rK7_0Zwtd6-o59CEPjWiGhD596zh4XauzNEln8VxVDA"
                  alt="Caih Construction"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <HardHat className="w-5 h-5 text-[#b7102a]" />
                  <h3 className="text-lg font-bold text-[#000f22]">Caih Construction</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed flex-1">
                  Turnkey building contracting, deep civil foundation piling, and road paving infrastructure.
                </p>
              </div>
            </div>

            <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#E2E8F0]">
              <div className="relative h-56 bg-[#F1F5F9] overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzFRpyIeLl7ogQtifHFeUSAtsbvv_RPJ1yEeAbDuPtIHdJEGVW4stbhGuTxfe_8wiEOOdKSAkBSAAOy4Mqj7urOF1NMrlFr3WHW4xTdhW0o__vJDXiVW1x3rh1PBzr7hJZ5dHq3xJUg_-AF_oCNhsjh4YZnfVme_KSBZuTFKZ1wDWCChSx5x1OXG9Hm1rsYHY2TvmAMpL6LWA4GC9sF82dAOISCIHDZ2D0nEziCKCyeXyNV0j-M5qvPA"
                  alt="Caih Resources"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-[#b7102a]" />
                  <h3 className="text-lg font-bold text-[#000f22]">Caih Resources</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed flex-1">
                  Heavy equipment leasing, quarry granite logistics, and certified ready-mix concrete supply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXECUTIVE LEADERSHIP (CRITICAL - USING EXACT USER IMAGES) */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#E2E8F0]" id="leadership">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center gap-2 text-[#b7102a] mb-3">
              <span className="text-[11px] uppercase tracking-wider font-bold">
                Executive Leadership
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#000f22] font-extrabold tracking-tight mb-4">
              The Team Leading Caih Group
            </h2>
            <p className="text-sm md:text-base text-[#475569] leading-relaxed">
              Experienced engineers, corporate strategists, and international operations executives driving excellence across every milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {EXECUTIVES.map((exec, idx) => (
              <div
                key={idx}
                className="bg-[#F8FAFC] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col border border-[#E2E8F0]"
              >
                <div className="aspect-[4/5] bg-[#F1F5F9] overflow-hidden relative">
                  <img
                    src={exec.image}
                    alt={exec.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-102"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-base sm:text-lg font-bold text-[#000f22]">
                    {exec.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#b7102a] font-semibold mt-0.5">
                    {exec.role}
                  </p>
                  <span className="text-[11px] text-[#475569] mt-1 block">
                    {exec.credentials}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CORPORATE CALL TO ACTION BANNER */}
      <section className="py-20 bg-white" id="consultation">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="bg-[#0a2540] text-white rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl text-white font-extrabold tracking-tight mb-2">
                Ready to Discuss Your Next Project?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect with our corporate advisory and engineering desk for properties, civil contracts, and building logistics.
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
    </div>
  );
};
