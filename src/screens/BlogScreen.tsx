import React, { useState, useMemo, useEffect } from 'react';
import { Article, VideoDispatch } from '../types';
import { ARTICLES } from '../data/articles';
import { VIDEO_DISPATCHES } from '../data/mockData';
import {
  Search,
  ArrowRight,
  ArrowLeft,
  Play,
  CheckCircle2,
  Clock,
  Calendar,
  Share2,
  Building2,
  ShieldCheck,
  Check
} from 'lucide-react';

interface BlogScreenProps {
  selectedArticleId: string | null;
  onSelectArticle: (articleId: string | null) => void;
  onViewVideo: (video: VideoDispatch) => void;
  onNavigateToProjects: () => void;
}

export const BlogScreen: React.FC<BlogScreenProps> = ({
  selectedArticleId,
  onSelectArticle,
  onViewVideo,
  onNavigateToProjects
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Scroll to top whenever viewing a specific article
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedArticleId]);

  const featuredStory = ARTICLES.find((a) => a.featured) || ARTICLES[0];
  const gridArticles = ARTICLES.filter((a) => a.id !== featuredStory.id);

  const currentArticle = useMemo(() => {
    if (!selectedArticleId) return null;
    return ARTICLES.find((a) => a.id === selectedArticleId) || null;
  }, [selectedArticleId]);

  const filteredArticles = useMemo(() => {
    return gridArticles.filter((article) => {
      const matchCat = activeCategory === 'all' || article.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [gridArticles, activeCategory, searchQuery]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubscribed(false);
    }, 5000);
  };

  const handleShareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: currentArticle?.title || 'Caih Group Research & Insights',
        text: currentArticle?.excerpt || '',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const blogVideos = [
    {
      id: 'tour-appleton',
      title: 'Tour of Appleton Court Terraces (Akachukwu Street)',
      tag: 'INTERIOR WALKTHROUGH',
      duration: '04:18',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfK_XFMiv77ZI8nglGQHi5DqWgtce0IrHG9tEhVnCc9rAIbEVEQx4uaNw97HPlJFgeNxgtRUTF92qUpPmdgQ_b-fCigBU2xsrQvD_bm_CB1aCKjPVdAfbPD4-DmAy3I_soyG9ilc-Dm42X4kdYGav6UzETnjDRaESm_3GF5uh-NduAajGydqXZ2XCs5OdadJgMhVnsDWxxQhZOsu-2V4s0CsD_7EBt99gmREAAaKpwACWmdoNppvemsg',
      description: 'Walk through finished living rooms and see the modern finishes at Akachukwu Street.',
      speaker: 'Engr. Babatunde'
    },
    {
      id: 'testimonial-abroad',
      title: 'Meet One of Our Homeowners',
      tag: 'HOMEOWNER INTERVIEW',
      duration: '02:45',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQCcnxECEPj1W_Mf_hFYoqAZ0e-7U1qzrxFW9pYS3vtnry1k09UYZXaBeuaTv1QLS2J1SBOc_W6fUU32mbQgXmcRrFCDviIOv6plQ3AZMofDbsh_r-aWwcplFZaWY2avXc8I24RiNRl4XxXsiQE_ETu5AsfSHTUh7HH-DE7-QHSw04PuUlq9w1I8PdziQB0wI-pDhnX5Oqzkd8zQPwkvuL_-GAk22ePUsJ4io9d60ndVzcj1n6Be_SQQ',
      description: 'Hear why buying from abroad was smooth and stress-free.',
      speaker: 'Folashade Balogun & Client'
    }
  ];

  /* -------------------------------------------------------------
   * IF AN ARTICLE IS SELECTED: NORMAL FULL-PAGE ARTICLE DISPLAY
   * (NO POP-UP!)
   * ------------------------------------------------------------- */
  if (currentArticle) {
    const otherArticles = ARTICLES.filter((a) => a.id !== currentArticle.id);

    return (
      <div className="flex flex-col w-full bg-white animate-fadeIn">
        {/* Breadcrumb / Top Bar */}
        <div className="w-full bg-[#F8FAFC] border-b border-[#E2E8F0] pt-28 pb-5">
          <div className="max-w-[1000px] mx-auto px-6 sm:px-8 flex items-center justify-between">
            <button
              onClick={() => onSelectArticle(null)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#000f22] hover:text-[#b7102a] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Helpful Guides</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#b7102a] bg-white px-2.5 py-1 rounded border border-[#E2E8F0]">
                {currentArticle.categoryLabel}
              </span>
              <button
                onClick={handleShareArticle}
                className="inline-flex items-center gap-1.5 text-xs text-[#475569] hover:text-[#000f22] bg-white px-3 py-1 rounded border border-[#E2E8F0] transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Normal Full Article Page Article Header */}
        <article className="w-full max-w-[1000px] mx-auto px-6 sm:px-8 py-10 sm:py-14">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-3">
              <span className="text-[#b7102a] font-bold uppercase tracking-wider text-[11px]">
                {currentArticle.categoryLabel}
              </span>
              <span>•</span>
              <span className="text-[#475569]">{currentArticle.date}</span>
              <span>•</span>
              <span className="text-[#475569] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {currentArticle.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] lg:leading-[1.18] font-extrabold text-[#000f22] tracking-tight mb-6">
              {currentArticle.title}
            </h1>

            {/* Author Byline */}
            <div className="flex items-center gap-3.5 pb-6 border-b border-[#E2E8F0]">
              <div className="w-11 h-11 rounded-full bg-[#0a2540] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {currentArticle.author.avatarInitials}
              </div>
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">
                  {currentArticle.author.name}
                </span>
                <span className="text-xs text-[#64748B] block">
                  {currentArticle.author.role || 'Caih Group Research & Engineering Desk'}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Article Image Frame */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 border border-[#E2E8F0] shadow-sm">
            <img
              src={currentArticle.image}
              alt={currentArticle.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Editorial Content Prose */}
          <div className="space-y-6 text-base sm:text-lg text-[#334155] leading-relaxed">
            {/* Standout Pullquote Box */}
            <div className="border-l-4 border-[#b7102a] bg-[#F8FAFC] p-6 rounded-r-xl border border-y-[#E2E8F0] border-r-[#E2E8F0]">
              <p className="font-semibold text-[#0F172A] text-lg sm:text-xl leading-snug italic">
                “{currentArticle.excerpt}”
              </p>
            </div>

            {/* Paragraphs */}
            {currentArticle.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] my-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#000f22] mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#b7102a]" />
                Institutional Takeaway for Investors
              </h4>
              <p className="text-sm text-[#475569] leading-relaxed">
                Property transactions conducted through Caih Group guarantee verified Lagos State Governor’s Consent titles, independent structural engineer milestone certifications, and dedicated utility infrastructure.
              </p>
            </div>
          </div>

          {/* Author Card Footer */}
          <div className="mt-12 pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F8FAFC] p-6 rounded-2xl border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0a2540] text-white flex items-center justify-center font-bold text-base">
                {currentArticle.author.avatarInitials}
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-[#94A3B8] block">Written By</span>
                <span className="text-base font-bold text-[#000f22]">{currentArticle.author.name}</span>
                <span className="text-xs text-[#475569] block">{currentArticle.author.role || 'Caih Group Senior Consultant'}</span>
              </div>
            </div>

            <button
              onClick={onNavigateToProjects}
              className="px-5 py-2.5 rounded-lg bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Explore Active Developments</span>
            </button>
          </div>

          {/* More Articles to Read */}
          <div className="mt-16 pt-10 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-[#000f22]">
                More Helpful Guides & Research
              </h3>
              <button
                onClick={() => onSelectArticle(null)}
                className="text-xs font-bold text-[#b7102a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherArticles.slice(0, 3).map((art) => (
                <div
                  key={art.id}
                  onClick={() => onSelectArticle(art.id)}
                  className="group bg-white rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#000f22] text-white text-[10px] font-semibold">
                        {art.categoryLabel}
                      </span>
                    </div>
                    <div className="p-5">
                      <span className="text-[11px] text-[#94A3B8] block mb-1">
                        {art.readTime}
                      </span>
                      <h4 className="text-sm font-bold text-[#000f22] group-hover:text-[#b7102a] transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <span className="text-xs font-bold text-[#b7102a] flex items-center gap-1">
                      Read Guide <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Weekly Updates Newsletter Banner */}
        <section className="w-full bg-[#0a2540] text-white py-14 px-6 sm:px-8 border-t border-slate-800">
          <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-white mb-2">
                Get Weekly Property Intelligence
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Receive verified market valuations, infrastructure timelines, and off-plan releases directly in your inbox.
              </p>
            </div>
            <div className="w-full md:w-auto flex-1 max-w-md">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 h-11 rounded bg-white text-[#000f22] placeholder:text-[#94A3B8] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]"
                />
                <button
                  type="submit"
                  className="px-6 h-11 rounded bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold flex items-center justify-center transition-colors whitespace-nowrap shadow-sm cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
              {newsletterSubscribed && (
                <p className="text-xs text-emerald-300 font-bold mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Thank you for subscribing!
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * DEFAULT VIEW: NORMAL BLOG INDEX PAGE (SCREEN 3)
   * ------------------------------------------------------------- */
  return (
    <div className="flex flex-col w-full bg-white animate-fadeIn">
      {/* Section 1: Header / Page Banner & Filter Suite */}
      <section className="w-full bg-[#F8FAFC] pt-28 sm:pt-32 pb-16 lg:pb-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-[#b7102a] text-xs uppercase tracking-wider mb-2.5 inline-block">
              Latest Updates
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] text-[#000f22] tracking-tight mb-3">
              Latest News & Helpful Guides
            </h1>
            <p className="text-base md:text-lg text-[#475569] leading-relaxed">
              Helpful guides, property tips, and building updates from our team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'buying-tips', label: 'Buying Tips' },
                { id: 'building-news', label: 'Building News' },
                { id: 'property-market', label: 'Property Market' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-[#000f22] text-white shadow-sm'
                      : 'text-[#475569] hover:bg-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 h-11 bg-white border border-[#E2E8F0] rounded text-[#000f22] text-xs placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#000f22]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Featured Lead Analysis (Hero Editorial Bento, 2-Column Split) */}
      <section className="w-full bg-white py-12 lg:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="group bg-[#F8FAFC] rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#E2E8F0]">
            <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-[420px] overflow-hidden">
              <img
                src={featuredStory.image}
                alt={featuredStory.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded bg-[#b7102a] text-white text-xs font-semibold shadow">
                  Featured Story
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-12 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-2">
                  <span className="text-[#b7102a] font-semibold uppercase tracking-wider text-[11px]">
                    {featuredStory.categoryLabel}
                  </span>
                  <span>•</span>
                  <span>{featuredStory.readTime}</span>
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-[#000f22] tracking-tight mb-3 group-hover:text-[#b7102a] transition-colors leading-snug">
                  {featuredStory.title}
                </h2>

                <p className="text-sm text-[#475569] leading-relaxed mb-6">
                  {featuredStory.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#0a2540] text-white flex items-center justify-center font-bold text-xs">
                    {featuredStory.author.avatarInitials}
                  </div>
                  <span className="text-xs font-semibold text-[#000f22]">
                    {featuredStory.author.name}
                  </span>
                </div>

                <button
                  onClick={() => onSelectArticle(featuredStory.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#000f22] text-white text-xs font-bold hover:bg-[#0a2540] transition-all cursor-pointer"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Curated Article Grid */}
      <section className="w-full bg-[#F8FAFC] py-12 lg:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#000f22]">
                Helpful Articles & Guides
              </h2>
              <p className="text-xs text-[#475569] mt-1">
                Clear, honest advice for home seekers and property owners.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden border border-[#E2E8F0]"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#000f22] text-white text-[10px] font-semibold">
                    {article.categoryLabel}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[#94A3B8] text-xs mb-1.5 flex items-center gap-2">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#000f22] group-hover:text-[#b7102a] transition-colors mb-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-[#475569] leading-relaxed mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectArticle(article.id)}
                    className="text-[#000f22] group-hover:text-[#b7102a] text-xs font-bold flex items-center gap-1 pt-2 transition-colors cursor-pointer text-left"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Signature Multimedia & Field Dispatches (Video Walkthrough Gallery) */}
      <section className="w-full bg-white py-12 lg:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#000f22]">
              Video Tours & Walkthroughs
            </h2>
            <p className="text-xs text-[#475569] mt-1">
              Watch our latest building progress and property tours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => onViewVideo(vid)}
                className="group bg-[#F8FAFC] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-[#E2E8F0] cursor-pointer"
              >
                <div className="relative h-60 w-full overflow-hidden bg-black">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#b7102a] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-xs flex items-center gap-1 backdrop-blur-sm">
                    <span>{vid.duration}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-[#000f22] group-hover:text-[#b7102a] transition-colors mb-1">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-[#475569]">
                    {vid.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Advisory & Research Newsletter Card (Deep Navy Architectural Block) */}
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8">
          <div className="bg-[#0a2540] rounded-2xl p-8 lg:p-12 shadow-md text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold text-white mb-2">
                Get Our Weekly Updates
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Sign up with your email to get property tips, building updates, and new homes sent to your inbox.
              </p>
            </div>

            <div className="w-full md:w-auto flex-1 max-w-md">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 h-11 rounded bg-white text-[#000f22] placeholder:text-[#94A3B8] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]"
                />
                <button
                  type="submit"
                  className="px-6 h-11 rounded bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold flex items-center justify-center transition-colors whitespace-nowrap shadow-sm cursor-pointer"
                >
                  Subscribe
                </button>
              </form>

              {newsletterSubscribed && (
                <p className="text-xs text-emerald-300 font-bold mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Thank you for subscribing! Weekly property digest active.
                </p>
              )}

              <p className="text-[11px] text-slate-400 mt-2">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
