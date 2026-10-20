import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import {
  X,
  FileText,
  Clock,
  Calendar,
  Star,
  Check,
  Plus,
  Trash2,
  Eye,
  User,
  Image as ImageIcon,
  Film,
  ArrowRight
} from 'lucide-react';

interface AdminArticleModalProps {
  isOpen: boolean;
  isCreating: boolean;
  article: Article | null;
  onClose: () => void;
  onSave: (article: Article) => void;
  onDelete?: (articleId: string) => void;
}

const ARTICLE_IMAGE_PRESETS = [
  { label: 'Lagos Modern Residences', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Infrastructure & Roads', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Appleton Court Aerial', url: '/images/appleton_court_aerial_clean.jpg' },
  { label: 'Interior Living Architecture', url: '/images/appleton_court_interior_living.jpg' },
  { label: 'Commercial Developments', url: '/images/commercial-e1770636774756.jpeg' },
  { label: 'Luxury Residence Facade', url: '/images/caih_luxury_residence_1791879278290.jpg' },
];

export const AdminArticleModal: React.FC<AdminArticleModalProps> = ({
  isOpen,
  isCreating,
  article,
  onClose,
  onSave,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'content' | 'media'>('details');
  const [formData, setFormData] = useState<Article | null>(null);
  const [paragraphsText, setParagraphsText] = useState('');
  const [newTakeawayText, setNewTakeawayText] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        ...article,
        author: article.author || { name: 'Caih Group', avatarInitials: 'CG', role: 'Research & Advisory Desk' },
        keyTakeaways: article.keyTakeaways || [],
        content: article.content || []
      });
      setParagraphsText(article.content ? article.content.join('\n\n') : '');
    }
  }, [article]);

  if (!isOpen || !formData) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTakeaway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTakeawayText.trim()) return;
    const current = formData.keyTakeaways || [];
    setFormData({ ...formData, keyTakeaways: [...current, newTakeawayText.trim()] });
    setNewTakeawayText('');
  };

  const handleRemoveTakeaway = (indexToRemove: number) => {
    const current = formData.keyTakeaways || [];
    setFormData({
      ...formData,
      keyTakeaways: current.filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter an article title');
      return;
    }
    if (!formData.excerpt.trim()) {
      alert('Please provide an excerpt summary');
      return;
    }

    const paragraphs = paragraphsText
      .split('\n\n')
      .map(p => p.trim())
      .filter(Boolean);

    const finalArticle: Article = {
      ...formData,
      image: formData.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      content: paragraphs.length > 0 ? paragraphs : [formData.excerpt],
      author: {
        ...formData.author,
        avatarInitials: formData.author.name
          ? formData.author.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
          : 'CG'
      }
    };

    onSave(finalArticle);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#CBD5E1] my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#000f22] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b7102a] text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  {isCreating ? 'Blog Post Creator' : 'Article Editor'}
                </span>
                {formData.featured && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>Home Featured</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white line-clamp-1">
                {isCreating ? 'Write Real Estate Intelligence Article' : formData.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showLivePreview ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showLivePreview ? 'Hide Preview' : 'Live Card Preview'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2 overflow-x-auto shrink-0 py-2">
          {[
            { id: 'details', label: '1. Metadata & Author', icon: User },
            { id: 'media', label: '2. Featured Visuals', icon: ImageIcon },
            { id: 'content', label: '3. Excerpt & Content Body', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#000f22] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#000f22] hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ffb3b1]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
            {/* TAB 1: DETAILS & AUTHOR */}
            {activeTab === 'details' && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Article Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Navigating Land Title Verification in Lekki-Epe Growth Corridor"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Category Topic
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => {
                        const cat = e.target.value as any;
                        const labelMap: Record<string, string> = {
                          'property-market': 'Property Market',
                          'buying-tips': 'Buying Tips',
                          'building-news': 'Building News'
                        };
                        setFormData({
                          ...formData,
                          category: cat,
                          categoryLabel: labelMap[cat] || 'Property Market'
                        });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30 bg-white"
                    >
                      <option value="property-market">Property Market Analysis</option>
                      <option value="buying-tips">Homeowner &amp; Buying Tips</option>
                      <option value="building-news">Building &amp; Construction News</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Category Pill Display
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.categoryLabel}
                      onChange={e => setFormData({ ...formData, categoryLabel: e.target.value })}
                      placeholder="e.g. Property Market"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Estimated Read Time
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.readTime}
                      onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="e.g. 5 min read"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Publication Date
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      placeholder="e.g. April 2026"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.author.name}
                      onChange={e => setFormData({
                        ...formData,
                        author: { ...formData.author, name: e.target.value }
                      })}
                      placeholder="e.g. Caih Group Research Desk"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Author Role / Title
                    </label>
                    <input
                      type="text"
                      value={formData.author.role || ''}
                      onChange={e => setFormData({
                        ...formData,
                        author: { ...formData.author, role: e.target.value }
                      })}
                      placeholder="e.g. Senior Real Estate Analyst"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>
                </div>

                {/* Homepage Featured Toggle */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      id="blog-featured-checkbox"
                      checked={Boolean(formData.featured)}
                      onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-[#b7102a] rounded cursor-pointer"
                    />
                  </div>
                  <label htmlFor="blog-featured-checkbox" className="cursor-pointer">
                    <span className="text-xs font-black text-[#000f22] block">
                      Feature in Homepage "Latest News &amp; Insights" Section
                    </span>
                    <span className="text-[11px] text-[#475569] leading-relaxed block mt-0.5">
                      Highlights this blog post as a priority lead story on the front page of the website for visitors and investors.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: VISUALS */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1.5">
                    Featured Cover Photo URL <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      required
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Paste image URL (HTTPS) or pick a preset below"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#000f22] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0">
                      <ImageIcon className="w-4 h-4 text-[#b7102a]" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {/* Preset Buttons */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      Quick Visual Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {ARTICLE_IMAGE_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: preset.url })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border cursor-pointer ${
                            formData.image === preset.url
                              ? 'bg-[#000f22] text-white border-[#000f22]'
                              : 'bg-[#F8FAFC] text-slate-700 border-[#E2E8F0] hover:bg-slate-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="mt-3 relative h-48 rounded-xl overflow-hidden border border-[#CBD5E1] bg-slate-900 max-w-md">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                        Cover Photo Preview
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Video Walkthrough / Interview URL (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <Film className="w-5 h-5 text-[#b7102a] shrink-0" />
                    <input
                      type="url"
                      value={formData.videoUrl || ''}
                      onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="e.g. YouTube or Vimeo video link"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONTENT & EXCERPT */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Catchy Excerpt Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.excerpt}
                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Short 2-3 sentence overview displayed on blog cards, search engines, and the Homepage..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Full Article Content (Separate paragraphs with double Enter / blank lines)
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={paragraphsText}
                    onChange={e => setParagraphsText(e.target.value)}
                    placeholder="Write your in-depth analysis, market trends, infrastructure progress, and investment advisory..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30 font-sans leading-relaxed"
                  />
                </div>

                {/* Key Takeaways Builder */}
                <div className="border-t border-[#E2E8F0] pt-4">
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-2">
                    Key Takeaways &amp; Bullet Highlights
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTakeawayText}
                      onChange={e => setNewTakeawayText(e.target.value)}
                      placeholder="Add key takeaway (e.g. 25% Expected Annual Appreciation)..."
                      className="flex-1 px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                    <button
                      type="button"
                      onClick={handleAddTakeaway}
                      className="px-4 py-2 rounded-xl bg-[#000f22] text-white text-xs font-bold hover:bg-[#b7102a] transition-colors cursor-pointer"
                    >
                      Add Point
                    </button>
                  </div>

                  {formData.keyTakeaways && formData.keyTakeaways.length > 0 && (
                    <ul className="space-y-2">
                      {formData.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                          <span className="font-semibold text-slate-800 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#b7102a]" />
                            <span>{point}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTakeaway(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* LIVE CARD PREVIEW DRAWER */}
            {showLivePreview && (
              <div className="mt-6 p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#000f22] flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-[#b7102a]" />
                    <span>Real-Time Live Card Appearance</span>
                  </span>
                  <span className="text-[11px] text-slate-500">How it renders in the Blog page &amp; Homepage</span>
                </div>

                <div className="max-w-sm mx-auto bg-white rounded-xl border border-[#E2E8F0] shadow-lg overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <img
                        src={formData.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'}
                        alt={formData.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded bg-[#b7102a] text-white text-[10px] uppercase font-bold tracking-wider shadow-sm">
                          {formData.categoryLabel || 'Property Market'}
                        </span>
                        {formData.featured && (
                          <span className="px-2.5 py-1 rounded bg-amber-500 text-white text-[10px] uppercase font-bold tracking-wider shadow-sm flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
                        {formData.readTime || '5 min read'}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] mb-1">
                        <span className="text-[#b7102a] font-bold uppercase tracking-wider text-[10px]">
                          Market Advisory
                        </span>
                        <span>•</span>
                        <span>{formData.date || 'April 2026'}</span>
                      </div>
                      <h4 className="text-base font-bold text-[#000f22] line-clamp-2 leading-snug">
                        {formData.title || 'Untitled Blog Post'}
                      </h4>
                      <p className="text-xs text-[#64748B] mt-2 line-clamp-2">
                        {formData.excerpt || 'No excerpt summary provided.'}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-4 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#64748B] font-semibold">
                      By {formData.author?.name || 'Caih Group'}
                    </span>
                    <span className="text-[#b7102a] font-bold flex items-center gap-1">
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#000f22] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                {!isCreating && onDelete && formData && (
                  <button
                    type="button"
                    onClick={() => onDelete(formData.id)}
                    className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-red-200 hover:border-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Post</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreating ? 'Publish Blog Post' : 'Save Article Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
