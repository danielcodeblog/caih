import React, { useState, useEffect } from 'react';
import {
  Subscriber,
  EmailUpdate,
  getStoredSubscribers,
  saveSubscribers,
  getStoredUpdates,
  dispatchBroadcastUpdate,
  exportSubscribersToCSV,
  subscribeClient,
  unsubscribeClient
} from '../services/newsletterService';
import {
  Mail,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  Trash2,
  X,
  Search,
  Eye,
  Building,
  ShieldCheck,
  AlertCircle,
  Star,
  ArrowRight,
  ExternalLink,
  Filter
} from 'lucide-react';

interface NewsletterBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'compose' | 'subscribers' | 'history';
  onNavigateToProjects?: () => void;
}

export const NewsletterBroadcastModal: React.FC<NewsletterBroadcastModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'compose',
  onNavigateToProjects
}) => {
  const [activeTab, setActiveTab] = useState<'compose' | 'subscribers' | 'history'>(initialTab);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [updates, setUpdates] = useState<EmailUpdate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [interestFilter, setInterestFilter] = useState<string>('all');

  // New Subscriber Quick Add Form
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubInterest, setNewSubInterest] = useState<Subscriber['interest']>('all');

  // Broadcast Composer State
  const [subject, setSubject] = useState('Caih Group Advisory: Lekki-Epe Infrastructure Surge & Title Deed Approvals');
  const [category, setCategory] = useState<EmailUpdate['category']>('Market Advisory');
  const [audience, setAudience] = useState<EmailUpdate['audience']>('all');
  const [spotlightProperty, setSpotlightProperty] = useState('Appleton Enclave (Idera, Eleko Junction)');
  const [message, setMessage] = useState(
    `Dear Valued Investor,\n\nWe are delighted to share our latest infrastructure and title allocation advisory.\n\n• The Lekki-Epe economic corridor has experienced notable acceleration with ongoing works on the Lagos-Calabar Coastal Highway and Lekki Deep Sea Port logistics.\n• Direct allocation for Appleton Enclave Phase 2 has officially opened with fully verified Certificate of Occupancy (C of O) documents.\n• We are offering flexible 3 to 12-month zero-interest payment structures for both residential plots and commercial mega-parcels.\n\nTo reserve your allocation or schedule an escorted inspection, please reply directly or contact our corporate desk in Lagos.\n\nWarm regards,\nCaih Group Advisory & Infrastructure Directorate`
  );

  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  // Email Preview Modal
  const [previewEmail, setPreviewEmail] = useState<EmailUpdate | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubscribers(getStoredSubscribers());
      setUpdates(getStoredUpdates());
      setActiveTab(initialTab);
      setSendSuccessMessage(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const refreshData = () => {
    setSubscribers(getStoredSubscribers());
    setUpdates(getStoredUpdates());
  };

  const activeSubscribers = subscribers.filter((s) => s.status === 'active');
  const targetSubscribers = activeSubscribers.filter((s) => {
    if (audience === 'all') return true;
    return s.interest === 'all' || s.interest === audience;
  });

  const filteredSubscribers = subscribers.filter((s) => {
    const matchSearch =
      !searchQuery ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.fullName && s.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchInterest = interestFilter === 'all' || s.interest === interestFilter;
    return matchSearch && matchInterest;
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      const res = dispatchBroadcastUpdate({
        subject,
        category,
        audience,
        spotlightProperty,
        message
      });

      setIsSending(false);
      refreshData();
      setSendSuccessMessage(
        `Email Update dispatched successfully to ${res.deliveredCount} subscriber${res.deliveredCount === 1 ? '' : 's'}!`
      );
      setPreviewEmail(res.sentUpdate);
    }, 1200);
  };

  const handleAddSubscriberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim()) return;
    subscribeClient(newSubEmail, newSubName, newSubInterest, 'manual');
    setNewSubEmail('');
    setNewSubName('');
    setShowAddSubModal(false);
    refreshData();
  };

  const handleUnsubscribe = (email: string) => {
    unsubscribeClient(email);
    refreshData();
  };

  const quickTemplates = [
    {
      label: 'Title & C of O Allocation Notice',
      subject: 'Urgent Allocation Update: Certified C of O & Governor’s Consent Release',
      category: 'Title & Development Update' as const,
      audience: 'plots' as const,
      spotlight: 'Appleton Enclave (Idera)',
      text: `Dear Investor,\n\nWe are pleased to inform you that the physical allocation schedules and certified title deeds for the current development phase are now active.\n\nAll land boundaries have been surveyed and demarcated with verified coordinates matching Lagos State survey plans.\n\nPlease reach out to our client management desk to finalize your deed documentation.`
    },
    {
      label: 'Diaspora Investment Advisory',
      subject: 'Diaspora Advisory: Remote Property Ownership in Lagos Without Intermediary Risk',
      category: 'Diaspora Investment' as const,
      audience: 'diaspora' as const,
      spotlight: 'Appleton Haven (Victoria Island)',
      text: `Dear Diaspora Partner,\n\nNavigating real estate investment from the UK, North America, or Europe requires absolute title security, escrow protection, and photographic progress verification.\n\nCaih Group guarantees 100% legitimate governor-consented titles with transparent milestone billing.\n\nSchedule a 1-on-1 virtual video appraisal with our Lagos engineering team today.`
    },
    {
      label: 'New Luxury Launch',
      subject: 'Exclusive Release: Appleton Haven Maisonettes in Victoria Island, Lagos',
      category: 'New Property Launch' as const,
      audience: 'residential' as const,
      spotlight: 'Appleton Haven (Victoria Island)',
      text: `Dear Homeowner,\n\nCaih Properties is proud to present Appleton Haven in Victoria Island, Lagos.\n\nSeparate Allocation Pricing:\n🏠 2-Bedroom Luxury Residence: ₦450M\n🏠 3-Bedroom Residence (+ Cinema & BQ): ₦750M\n🏠 4-Bedroom Maisonette (+ BQ): ₦1.4B\n\n📍 Victoria Island, Lagos\n📞 Direct Sales Desk: +234 911 710 2880\n\nFeaturing private acoustic cinema suites, Italian designer kitchens, biometric security, and panoramic Atlantic views. Early allocation pricing is available for limited units with milestone escrow payment options.\n\n#CAIHProperties #AppletonHaven #RealEstate #LagosRealEstate`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#000f22] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b7102a] flex items-center justify-center text-white shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <span>Newsletter & Client Email Center</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-emerald-300">
                  Active System
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Collect client subscriptions and dispatch real-time property intelligence updates.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 text-xs sm:text-sm font-semibold text-[#475569] shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('compose')}
            className={`py-3.5 px-4 border-b-2 font-bold flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'compose'
                ? 'border-[#b7102a] text-[#000f22]'
                : 'border-transparent hover:text-[#000f22]'
            }`}
          >
            <Send className="w-4 h-4 text-[#b7102a]" />
            <span>Compose & Send Update</span>
            <span className="bg-[#b7102a]/10 text-[#b7102a] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {targetSubscribers.length} Recipients
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`py-3.5 px-4 border-b-2 font-bold flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'subscribers'
                ? 'border-[#b7102a] text-[#000f22]'
                : 'border-transparent hover:text-[#000f22]'
            }`}
          >
            <Users className="w-4 h-4 text-[#000f22]" />
            <span>Subscribers Directory</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {subscribers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3.5 px-4 border-b-2 font-bold flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-[#b7102a] text-[#000f22]'
                : 'border-transparent hover:text-[#000f22]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#000f22]" />
            <span>Sent Dispatches</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {updates.length}
            </span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* TAB 1: COMPOSE & SEND BROADCAST */}
          {activeTab === 'compose' && (
            <div className="space-y-6">
              {sendSuccessMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{sendSuccessMessage}</span>
                  </div>
                  <button
                    onClick={() => setSendSuccessMessage(null)}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Quick Template Picker */}
              <div>
                <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                  Quick Load Preset Dispatch Templates:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {quickTemplates.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSubject(tmpl.subject);
                        setCategory(tmpl.category);
                        setAudience(tmpl.audience);
                        setSpotlightProperty(tmpl.spotlight);
                        setMessage(tmpl.text);
                      }}
                      className="text-left p-3 rounded-lg border border-[#E2E8F0] hover:border-[#b7102a] hover:bg-slate-50 transition-all text-xs cursor-pointer group"
                    >
                      <div className="font-bold text-[#000f22] group-hover:text-[#b7102a] flex items-center justify-between">
                        <span>{tmpl.label}</span>
                        <Star className="w-3.5 h-3.5 text-[#b7102a] opacity-70" />
                      </div>
                      <p className="text-[11px] text-[#64748B] line-clamp-1 mt-1">
                        {tmpl.subject}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Broadcast Form */}
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="text-xs font-bold text-[#000f22] block mb-1">
                      Email Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EmailUpdate['category'])}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2.5 text-xs font-semibold text-[#000f22]"
                    >
                      <option value="Market Advisory">Market Advisory</option>
                      <option value="New Property Launch">New Property Launch</option>
                      <option value="Title & Development Update">Title & Development Update</option>
                      <option value="Diaspora Investment">Diaspora Investment</option>
                    </select>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="text-xs font-bold text-[#000f22] block mb-1">
                      Target Audience ({targetSubscribers.length} recipients)
                    </label>
                    <select
                      value={audience}
                      onChange={(e) => setAudience(e.target.value as EmailUpdate['audience'])}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2.5 text-xs font-semibold text-[#000f22]"
                    >
                      <option value="all">All Active Subscribers ({activeSubscribers.length})</option>
                      <option value="diaspora">Diaspora Investors Only</option>
                      <option value="plots">Land & Plot Buyers</option>
                      <option value="residential">Luxury Residential Seekers</option>
                      <option value="commercial">Commercial & Warehouse Investors</option>
                    </select>
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <label className="text-xs font-bold text-[#000f22] block mb-1">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email update subject..."
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#000f22] focus:outline-none focus:ring-2 focus:ring-[#b7102a]"
                  />
                </div>

                {/* Featured Project */}
                <div>
                  <label className="text-xs font-bold text-[#000f22] block mb-1">
                    Featured Project Callout (Optional)
                  </label>
                  <select
                    value={spotlightProperty}
                    onChange={(e) => setSpotlightProperty(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2.5 text-xs font-semibold text-[#000f22]"
                  >
                    <option value="Appleton Enclave (Idera, Eleko Junction)">Appleton Enclave (Idera, Eleko Junction) - 100% C of O Dry Land</option>
                    <option value="Appleton Haven (Victoria Island)">Appleton Haven (Victoria Island) - Luxury Residences + Cinema</option>
                    <option value="Appleton Court (Akachukwu Street, Lekki Scheme 2)">Appleton Court (Akachukwu Street, Lekki Scheme 2) - 4-Bed Terraces</option>
                    <option value="Appleton Commercial Parcels (Origanrigan FTZ)">Appleton Commercial Parcels (Origanrigan FTZ) - Mega Warehousing</option>
                  </select>
                </div>

                {/* Message Body */}
                <div>
                  <label className="text-xs font-bold text-[#000f22] block mb-1">
                    Message Content & Advisory Body
                  </label>
                  <textarea
                    required
                    rows={7}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your email update here..."
                    className="w-full bg-white border border-[#CBD5E1] rounded-lg p-3 text-xs sm:text-sm text-[#000f22] leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-[#b7102a]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewEmail({
                        id: 'preview-sample',
                        subject,
                        preheader: message.slice(0, 100),
                        category,
                        audience,
                        message,
                        spotlightProperty,
                        author: 'Caih Group Advisory Directorate',
                        sentAt: new Date().toISOString(),
                        recipientsCount: targetSubscribers.length,
                        recipientEmails: targetSubscribers.map((s) => s.email),
                        status: 'delivered'
                      });
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#000f22] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Eye className="w-4 h-4 text-[#475569]" />
                    <span>Preview Email Layout</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSending || targetSubscribers.length === 0}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#b7102a] hover:bg-[#db313f] disabled:bg-slate-300 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSending
                        ? 'Dispatching Update...'
                        : `Send Email Update to ${targetSubscribers.length} Client${targetSubscribers.length === 1 ? '' : 's'}`}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SUBSCRIBERS DIRECTORY */}
          {activeTab === 'subscribers' && (
            <div className="space-y-5">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search subscribers by name or email..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#b7102a]"
                  />
                </div>

                {/* Filter */}
                <select
                  value={interestFilter}
                  onChange={(e) => setInterestFilter(e.target.value)}
                  className="bg-white border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs font-semibold text-[#000f22]"
                >
                  <option value="all">All Interests</option>
                  <option value="diaspora">Diaspora</option>
                  <option value="plots">Land & Plots</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>

                {/* Add & Export Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddSubModal(true)}
                    className="px-3 py-2 rounded-lg bg-[#000f22] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#0a2540] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Client</span>
                  </button>
                  <button
                    onClick={exportSubscribersToCSV}
                    className="px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#000f22] text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Export to CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Add Subscriber Quick Modal */}
              {showAddSubModal && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 animate-fadeIn space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#000f22] uppercase tracking-wider">
                      Add Client to Newsletter Broadcast List
                    </h4>
                    <button
                      onClick={() => setShowAddSubModal(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleAddSubscriberSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="email"
                      required
                      placeholder="client.email@example.com"
                      value={newSubEmail}
                      onChange={(e) => setNewSubEmail(e.target.value)}
                      className="px-3 py-2 text-xs rounded border border-[#CBD5E1] bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Client Full Name (Optional)"
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      className="px-3 py-2 text-xs rounded border border-[#CBD5E1] bg-white focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newSubInterest}
                        onChange={(e) => setNewSubInterest(e.target.value as Subscriber['interest'])}
                        className="flex-1 px-3 py-2 text-xs rounded border border-[#CBD5E1] bg-white"
                      >
                        <option value="all">General</option>
                        <option value="diaspora">Diaspora</option>
                        <option value="plots">Plots</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                      </select>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-[#b7102a] text-white text-xs font-bold hover:bg-[#db313f] transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Subscribers Table */}
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Client / Email</th>
                      <th className="py-3 px-4">Interest</th>
                      <th className="py-3 px-4">Date Joined</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {filteredSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-[#94A3B8]">
                          No subscribers found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredSubscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#000f22]">{sub.email}</div>
                            {sub.fullName && (
                              <div className="text-[11px] text-[#64748B]">{sub.fullName}</div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-medium text-[11px]">
                              {sub.interest}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#64748B]">
                            {new Date(sub.subscribedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                sub.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {sub.status === 'active' && (
                              <button
                                onClick={() => handleUnsubscribe(sub.email)}
                                className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold cursor-pointer"
                              >
                                Unsubscribe
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SENT EMAIL HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <h3 className="text-sm font-bold text-[#000f22]">
                  Sent Newsletter Campaigns & Dispatches
                </h3>
                <span className="text-xs text-[#64748B]">
                  {updates.length} total broadcast{updates.length === 1 ? '' : 's'} recorded
                </span>
              </div>

              {updates.length === 0 ? (
                <div className="py-12 text-center text-[#94A3B8] text-xs">
                  No email updates sent yet. Compose and dispatch one in the Compose tab!
                </div>
              ) : (
                <div className="space-y-3">
                  {updates.map((upd) => (
                    <div
                      key={upd.id}
                      className="p-4 sm:p-5 rounded-xl border border-[#E2E8F0] hover:border-slate-300 hover:shadow-sm transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#b7102a]/10 text-[#b7102a] text-[10px] font-bold uppercase tracking-wider">
                            {upd.category}
                          </span>
                          <span className="text-[11px] text-[#94A3B8]">
                            {new Date(upd.sentAt).toLocaleDateString()} at{' '}
                            {new Date(upd.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#000f22] line-clamp-1">
                          {upd.subject}
                        </h4>
                        <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                          {upd.message}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Delivered ({upd.recipientsCount})</span>
                          </div>
                          <span className="text-[10px] text-[#94A3B8] capitalize">
                            Audience: {upd.audience}
                          </span>
                        </div>

                        <button
                          onClick={() => setPreviewEmail(upd)}
                          className="px-3 py-1.5 rounded bg-slate-100 hover:bg-[#000f22] hover:text-white text-[#000f22] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Email</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: LIVE EMAIL PREVIEW */}
      {previewEmail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Window title bar */}
            <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-bold text-slate-700 ml-2">
                  Client Inbox Preview • {previewEmail.subject}
                </span>
              </div>
              <button
                onClick={() => setPreviewEmail(null)}
                className="text-slate-500 hover:text-slate-800 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Meta Info */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-1">
              <div>
                <span className="font-bold text-slate-500">From: </span>
                <span className="font-semibold text-slate-900">
                  Caih Group Advisory &lt;advisory@caihproperties.com&gt;
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-500">To: </span>
                <span className="font-semibold text-slate-900">
                  {previewEmail.recipientEmails && previewEmail.recipientEmails.length > 0
                    ? previewEmail.recipientEmails.join(', ')
                    : 'All Subscribed Clients'}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-500">Subject: </span>
                <span className="font-bold text-slate-900">{previewEmail.subject}</span>
              </div>
            </div>

            {/* Rendered Email Template */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#1E293B]">
              {/* Email Header Banner */}
              <div className="bg-[#000f22] p-6 rounded-xl text-white flex items-center justify-between border-b-4 border-[#b7102a]">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg">
                    <img
                      src="/images/Caih-group.png"
                      alt="Caih Group"
                      className="h-7 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold tracking-wide">CAIH GROUP</h3>
                    <p className="text-[10px] text-slate-300 uppercase tracking-widest">
                      Property Intelligence & Market Advisory
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-1 bg-white/10 rounded text-[#ffb3b1]">
                  {previewEmail.category}
                </span>
              </div>

              {/* Email Content Body */}
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#334155] whitespace-pre-line">
                {previewEmail.message}
              </div>

              {/* Spotlight Project Banner in Email */}
              {previewEmail.spotlightProperty && (
                <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#b7102a] uppercase tracking-wider">
                    <Building className="w-4 h-4" />
                    <span>Featured Asset Allocation</span>
                  </div>
                  <h4 className="font-bold text-base text-[#000f22]">
                    {previewEmail.spotlightProperty}
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    Title guaranteed with Governor Consent & C of O. Same-week on-site inspection visits available.
                  </p>
                </div>
              )}

              {/* Email Footer & Unsubscribe */}
              <div className="pt-6 border-t border-slate-200 text-xs text-slate-400 space-y-2 text-center">
                <p className="font-medium text-slate-600">
                  Caih Group Lagos Corporate Desk • Lekki Peninsula, Lagos, Nigeria
                </p>
                <p className="text-[11px]">
                  You received this email because you subscribed to property updates and title notifications on caihproperties.com.
                </p>
                <div className="text-[11px] text-slate-500 pt-1">
                  <span>Manage Preferences</span> • <span className="underline cursor-pointer">Unsubscribe anytime</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Close */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewEmail(null)}
                className="px-5 py-2 rounded-lg bg-[#000f22] text-white text-xs font-bold hover:bg-[#0a2540] transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
