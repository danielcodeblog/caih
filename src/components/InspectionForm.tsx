import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Phone, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BRAND_ASSETS, PROJECTS } from '../data/mockData';
import { gsap, attachMagneticEffect } from '../utils/gsapAnimations';

interface InspectionFormProps {
  initialProject?: string;
  onSuccess?: () => void;
}

export const InspectionForm: React.FC<InspectionFormProps> = ({
  initialProject,
  onSuccess
}) => {
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [targetProject, setTargetProject] = useState(
    initialProject || 'Appleton Enclave Phase I & II (Lekki Phase 2)'
  );
  const [preferredDate, setPreferredDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialProject) {
      setTargetProject(initialProject);
    }
  }, [initialProject]);

  useEffect(() => {
    const cleanup = attachMagneticEffect(submitBtnRef.current);
    return () => cleanup();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();

      // Aggressive GSAP celebration pop
      setTimeout(() => {
        const banner = document.getElementById('inspection-success-banner');
        if (banner) {
          gsap.fromTo(banner, { scale: 0.85, y: 10, opacity: 0 }, { scale: 1, y: 0, opacity: 1, ease: 'back.out(2)', duration: 0.5 });
        }
      }, 50);

      // Clear after 6 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 6000);
    }, 500);
  };

  return (
    <section className="w-full bg-[#F8FAFC] py-16 lg:py-20 border-t border-[#E2E8F0]" id="inspection-form-section">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Guarantees & Hotline Desk */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#b7102a] text-[11px] uppercase tracking-[0.2em] mb-3 font-bold shadow-sm">
                <span>Direct Developer Desk</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-[#000f22] mt-1">
                Book an On-Site Project Inspection
              </h2>
              <p className="text-sm md:text-base text-[#475569] mt-3 leading-relaxed font-normal">
                Experience our verified construction quality firsthand. Reserve an accompanied private walkthrough across any of our Lekki, Epe, or Abuja developments with an accredited senior project engineer.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#b7102a]/10 text-[#b7102a] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div className="flex flex-col">
                  <span className="font-bold text-[#000f22] text-sm">
                    Verified Walkthrough Guarantees
                  </span>
                  <span className="text-xs text-[#475569]">
                    Direct title documentation inspection & engineering telemetry.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-[#E2E8F0] pt-4">
                <span className="w-10 h-10 rounded-full bg-[#000f22]/10 text-[#000f22] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </span>
                <div className="flex flex-col">
                  <span className="font-bold text-[#000f22] text-sm">
                    Developer Contact Hotline
                  </span>
                  <a
                    href={`tel:${BRAND_ASSETS.phoneClean}`}
                    className="text-xs text-[#b7102a] font-bold hover:underline"
                  >
                    {BRAND_ASSETS.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-[#E2E8F0] pt-4">
                <span className="w-10 h-10 rounded-full bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </span>
                <div className="flex flex-col">
                  <span className="font-bold text-[#000f22] text-sm">
                    Official Opening Hours
                  </span>
                  <span className="text-xs text-[#475569]">
                    Mon – Sat | 9:00 AM – 4:30 PM WAT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[#000f22]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Babatunde Adeyemi"
                    className="h-12 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[#000f22] text-sm focus:outline-none focus:ring-2 focus:ring-[#000f22] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[#000f22]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="h-12 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[#000f22] text-sm focus:outline-none focus:ring-2 focus:ring-[#000f22] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[#000f22]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@example.com"
                    className="h-12 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[#000f22] text-sm focus:outline-none focus:ring-2 focus:ring-[#000f22] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[#000f22]">
                    Target Project *
                  </label>
                  <select
                    value={targetProject}
                    onChange={(e) => setTargetProject(e.target.value)}
                    className="h-12 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[#000f22] text-sm focus:outline-none focus:ring-2 focus:ring-[#000f22] cursor-pointer"
                  >
                    <option value="Appleton Enclave Phase I & II (Lekki Phase 2)">
                      Appleton Enclave Phase I & II (Lekki Phase 2)
                    </option>
                    <option value="Appleton Court Terraces (Lekki Phase 2)">
                      Appleton Court Terraces (Lekki Phase 2)
                    </option>
                    <option value="Epe Gateway Industrial Plots (Epe Expressway)">
                      Epe Gateway Industrial Plots (Epe Expressway)
                    </option>
                    <option value="Guzape Ridge Enclave (Guzape Hills, Abuja)">
                      Guzape Ridge Enclave (Guzape Hills, Abuja)
                    </option>
                    <option value="Eleganza Commercial Arcade (Lekki)">
                      Eleganza Commercial Arcade (Lekki)
                    </option>
                    <option value="Ahmadu Bello Commercial Plaza (Victoria Island)">
                      Ahmadu Bello Commercial Plaza (Victoria Island)
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#000f22]">
                  Preferred Inspection Date *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="h-12 px-4 rounded-lg border border-[#E2E8F0] bg-white text-[#000f22] text-sm focus:outline-none focus:ring-2 focus:ring-[#000f22] cursor-pointer"
                />
              </div>

              {isSubmitted && (
                <div
                  id="inspection-success-banner"
                  className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm text-center font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    ✓ Inspection Request Received! Our project desk will contact you within 2 hours with gate clearance and directions for {targetProject}.
                  </span>
                </div>
              )}

              <button
                ref={submitBtnRef}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-lg bg-[#b7102a] hover:bg-[#db313f] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 mt-2 shadow-md cursor-pointer disabled:opacity-75"
              >
                <span>{isSubmitting ? 'Registering Booking...' : 'Submit Inspection Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
