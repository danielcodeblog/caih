import React, { useState } from 'react';
import {
  Award,
  Users,
  ShieldCheck,
  TrendingUp,
  FileText,
  Phone,
  CheckCircle,
  QrCode,
  Building2,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { BRAND_ASSETS } from '../data/mockData';

interface RealtorRegistrationScreenProps {
  onNavigateToProjects: () => void;
  onBookInspection: () => void;
}

export const RealtorRegistrationScreen: React.FC<RealtorRegistrationScreenProps> = ({
  onNavigateToProjects,
  onBookInspection
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    agencyName: '',
    email: '',
    phone: '',
    experience: '3-5 years',
    corridor: 'Lekki Phase 2',
    licenseNumber: '',
    agreeTerms: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields.');
      return;
    }
    const randomId = 'CAIH-RTL-' + Math.floor(1000 + Math.random() * 9000);
    setGeneratedId(randomId);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative w-full bg-[#000f22] text-white pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b7102a]/20 border border-[#b7102a]/30 text-[#ff4d6d] text-xs font-bold uppercase tracking-wider mb-6">
            <Award className="w-4 h-4" /> Official Caih Properties Realtor Partner Network
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Partner With <span className="text-[#ff4d6d]">Caih Properties</span> & Earn Elite Commissions
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Join Nigeria’s most trusted real estate developer network. Sell certified Governor’s Consent properties in Lekki Phase 2, Ajah, and Epe Corridor with industry-leading payouts and real-time deal tracking.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('realtor-form-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white font-bold text-sm transition-all shadow-lg shadow-[#b7102a]/30 flex items-center gap-2 cursor-pointer"
            >
              Register as a Realtor <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToProjects}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/20 flex items-center gap-2"
            >
              View Active Projects <Building2 className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 max-w-[1200px] mx-auto px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl font-extrabold text-[#000f22] tracking-tight mb-3">
            Why Top Realtors Choose Caih Group
          </h2>
          <p className="text-sm text-slate-600">
            We empower real estate professionals and agencies with unmatched developer support, marketing kits, and prompt commission settlements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#000f22]/5 text-[#000f22] flex items-center justify-center mb-6">
              <DollarSign className="w-8 h-8 text-[#b7102a]" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#000f22] mb-2">
              Industry-Leading Commissions
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Earn up to 5% to 10% commission on every successful deal closure, with direct milestone payouts disbursed within 48 hours.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#000f22]/5 text-[#000f22] flex items-center justify-center mb-6">
              <QrCode className="w-8 h-8 text-[#000f22]" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#000f22] mb-2">
              Instant Referral & QR Codes
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Get a unique Realtor ID and dedicated client tracking links. Whenever your clients inspect or buy, your commission is locked instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#000f22]/5 text-[#000f22] flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#000f22] mb-2">
              100% Verified Titles
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sell with absolute confidence. All Caih Group properties feature clean Governor’s Consent or Gazette titles with zero litigation risk.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="realtor-form-section" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-[800px] mx-auto px-6">
          {!submitted ? (
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-[#b7102a] uppercase tracking-wider">Secure Portal</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#000f22] mt-1">
                  Realtor Registration Form
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  Complete the credentials below to receive your official Caih Group Realtor ID and access partner marketing assets.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#000f22] uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Adebayo Ogunlesi"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-[#000f22] focus:outline-none focus:border-[#b7102a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000f22] uppercase tracking-wider mb-2">
                      Agency Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Prime Shelter Realtors"
                      value={formData.agencyName}
                      onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-[#000f22] focus:outline-none focus:border-[#b7102a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#000f22] uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="realtor@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-[#000f22] focus:outline-none focus:border-[#b7102a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000f22] uppercase tracking-wider mb-2">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 800 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-[#000f22] focus:outline-none focus:border-[#b7102a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#000f22] uppercase tracking-wider mb-2">
                      Real Estate Experience
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-[#000f22] focus:outline-none focus:border-[#b7102a]"
                    >
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years (Elite Broker)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#000f22] uppercase tracking-wider mb-2">
                      Primary Operating Corridor
                    </label>
                    <select
                      value={formData.corridor}
                      onChange={(e) => setFormData({ ...formData, corridor: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-[#000f22] focus:outline-none focus:border-[#b7102a]"
                    >
                      <option value="Lekki Phase 2">Lekki Phase 2</option>
                      <option value="Ajah">Ajah</option>
                      <option value="Epe Corridor">Epe Corridor</option>
                      <option value="Victoria Island">Victoria Island</option>
                      <option value="Abuja FCT">Abuja FCT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#000f22] uppercase tracking-wider mb-2">
                    Professional License / NIN / RC Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. REDAN/Lagos/2024/9921"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-[#000f22] focus:outline-none focus:border-[#b7102a]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-[#b7102a] focus:ring-[#b7102a]"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600">
                    I agree to the Caih Group Realtor Partner Terms of Engagement and Code of Professional Conduct.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#000f22] hover:bg-[#001a38] text-white font-bold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  Complete Registration & Get Realtor ID <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-emerald-200 rounded-2xl p-8 sm:p-12 text-center shadow-lg animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Registration Successful</span>
              <h2 className="font-display text-3xl font-extrabold text-[#000f22] mt-2 mb-3">
                Welcome to the Partner Network!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-8">
                Your realtor account has been created successfully. Your official partner credentials and marketing kits are ready.
              </p>

              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 max-w-md mx-auto mb-8 text-left space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Realtor Name:</span>
                  <span className="font-bold text-[#000f22]">{formData.fullName}</span>
                </div>
                {formData.agencyName && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Agency:</span>
                    <span className="font-bold text-[#000f22]">{formData.agencyName}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Assigned Realtor ID:</span>
                  <span className="font-mono font-bold text-[#b7102a] bg-[#b7102a]/10 px-2 py-1 rounded">
                    {generatedId}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Commission Tier:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                    Gold Partner (5% - 10%)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      agencyName: '',
                      email: '',
                      phone: '',
                      experience: '3-5 years',
                      corridor: 'Lekki Phase 2',
                      licenseNumber: '',
                      agreeTerms: false
                    });
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-[#000f22] font-bold text-xs transition-all"
                >
                  Register Another Realtor
                </button>
                <button
                  onClick={onNavigateToProjects}
                  className="px-6 py-3 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white font-bold text-xs transition-all"
                >
                  Explore Properties to Sell
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
