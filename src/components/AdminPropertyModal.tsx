import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { uploadImageToSupabaseStorage } from '../lib/supabase';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Layers,
  Image as ImageIcon,
  Film,
  Star,
  Check,
  Plus,
  Trash2,
  Eye,
  ShieldCheck,
  Video,
  ArrowRight,
  Edit,
  FileText
} from 'lucide-react';

interface AdminPropertyModalProps {
  isOpen: boolean;
  isCreating: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

const PROPERTY_IMAGE_PRESETS = [
  { label: 'Terrace Real Exterior', url: '/images/appleton_court_exterior_real.jpg' },
  { label: 'Appleton Aerial Drone', url: '/images/appleton_court_aerial_clean.jpg' },
  { label: 'Luxury Living Room', url: '/images/appleton_court_interior_living.jpg' },
  { label: 'Staircase Architecture', url: '/images/appleton_court_interior_stairs.jpg' },
  { label: 'Enclave Gatehouse', url: '/images/appleton_enclave_entrance.jpg' },
  { label: 'Caih Luxury Residence', url: '/images/caih_luxury_residence_1791879278290.jpg' },
  { label: 'Appleton Gardens Gatehouse', url: '/images/appleton_gardens_hero.jpg' },
  { label: 'Appleton Gardens Park & Greenery', url: '/images/appleton_gardens_greenery.jpg' },
  { label: 'Modern Villa (Unsplash)', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200' },
];

const CORRIDOR_OPTIONS = [
  'Idera / Lekki-Epe Expressway',
  'Free Trade Zone / Origanrigan / Dangote Axis',
  'Ibeju-Lekki Coastal Corridor',
  'Victoria Island / Oniru',
  'Akachukwu Street / Ajah',
  'Lekki Phase 2 / Abraham Adesanya',
  'Epe Expressway Corridor',
  'Abuja FCT / Guzape'
];

const COMMON_AMENITIES = [
  '24/7 Solar & Grid Power',
  'Smart Home Automation',
  'Armed Security Personnel',
  'CCTV 24/7 Surveillance',
  'Treated Potable Water Supply',
  'Paved Interlocked Roads & Drainage',
  'Children Playground & Parks',
  'Swimming Pool & Club House',
  'Dedicated Gymnasium',
  'Dedicated Transformer & IPP Linkage',
  'Perimeter Electric Fencing',
  'High Luxury Doors & Lavish Windows',
  'Fitted Contemporary Kitchen',
  'Private Terrace Sit-outs'
];

export const AdminPropertyModal: React.FC<AdminPropertyModalProps> = ({
  isOpen,
  isCreating,
  project,
  onClose,
  onSave,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'specs' | 'media' | 'features' | 'units'>('basic');
  const [formData, setFormData] = useState<Project | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [isFeaturedOnHome, setIsFeaturedOnHome] = useState(false);

  // SQM Pricing Breakdown / Units State
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitSize, setNewUnitSize] = useState('');
  const [newUnitPrice, setNewUnitPrice] = useState('');
  const [newUnitDeposit, setNewUnitDeposit] = useState('');
  const [newUnitDesc, setNewUnitDesc] = useState('');
  const [editingUnitIndex, setEditingUnitIndex] = useState<number | null>(null);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        specs: project.specs || {},
        keyFeatures: project.keyFeatures || [],
        galleryImages: project.galleryImages || [project.image].filter(Boolean),
        neighbourhood: project.neighbourhood || []
      });
      setIsFeaturedOnHome(
        Boolean(
          project.badge?.toLowerCase().includes('featured') ||
          project.secondaryBadge?.toLowerCase().includes('featured')
        )
      );
    }
  }, [project]);

  if (!isOpen || !formData) return null;

  const handleToggleAmenity = (amenity: string) => {
    const current = formData.keyFeatures || [];
    if (current.includes(amenity)) {
      setFormData({ ...formData, keyFeatures: current.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, keyFeatures: [...current, amenity] });
    }
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureText.trim()) return;
    const current = formData.keyFeatures || [];
    if (!current.includes(newFeatureText.trim())) {
      setFormData({ ...formData, keyFeatures: [...current, newFeatureText.trim()] });
    }
    setNewFeatureText('');
  };

  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;
    const current = formData.galleryImages || [];
    setFormData({ ...formData, galleryImages: [...current, newGalleryUrl.trim()] });
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const current = formData.galleryImages || [];
    setFormData({
      ...formData,
      galleryImages: current.filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim() || !newUnitPrice.trim()) {
      alert('Please enter plot/unit name and price display');
      return;
    }
    const current = [...(formData.unitsOrPlots || [])];
    if (editingUnitIndex !== null && editingUnitIndex >= 0 && editingUnitIndex < current.length) {
      current[editingUnitIndex] = {
        ...current[editingUnitIndex],
        name: newUnitName.trim(),
        size: newUnitSize.trim() || '300 sqm',
        priceDisplay: newUnitPrice.trim(),
        deposit: newUnitDeposit.trim(),
        description: newUnitDesc.trim(),
      };
      setEditingUnitIndex(null);
    } else {
      const newUnit = {
        id: 'unit-' + Date.now(),
        name: newUnitName.trim(),
        size: newUnitSize.trim() || '300 sqm',
        priceDisplay: newUnitPrice.trim(),
        deposit: newUnitDeposit.trim(),
        description: newUnitDesc.trim(),
        paymentType: 'Direct Allocation',
        isPopular: current.length === 0,
        features: ['Governor’s Consent', 'Fully Serviced Infrastructure', '100% Dry Land']
      };
      current.push(newUnit);
    }
    setFormData({ ...formData, unitsOrPlots: current });
    setNewUnitName('');
    setNewUnitSize('');
    setNewUnitPrice('');
    setNewUnitDeposit('');
    setNewUnitDesc('');
  };

  const handleStartEditUnit = (index: number) => {
    const unit = formData.unitsOrPlots?.[index];
    if (!unit) return;
    setEditingUnitIndex(index);
    setNewUnitName(unit.name || '');
    setNewUnitSize(unit.size || '');
    setNewUnitPrice(unit.priceDisplay || '');
    setNewUnitDeposit(unit.deposit || '');
    setNewUnitDesc(unit.description || '');
  };

  const handleCancelEditUnit = () => {
    setEditingUnitIndex(null);
    setNewUnitName('');
    setNewUnitSize('');
    setNewUnitPrice('');
    setNewUnitDeposit('');
    setNewUnitDesc('');
  };

  const handleRemoveUnit = (indexToRemove: number) => {
    const current = formData.unitsOrPlots || [];
    setFormData({
      ...formData,
      unitsOrPlots: current.filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const publicUrl = await uploadImageToSupabaseStorage(file);
        if (isGallery) {
          setFormData(prev => prev ? { ...prev, galleryImages: [...(prev.galleryImages || []), publicUrl] } : prev);
        } else {
          setFormData(prev => prev ? { ...prev, image: publicUrl } : prev);
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a property title');
      return;
    }
    if (!formData.priceDisplay.trim()) {
      alert('Please enter a price display (e.g. ₦85,000,000)');
      return;
    }

    // Process featured on home toggle
    let updatedBadge = formData.badge || '';
    if (isFeaturedOnHome) {
      if (!updatedBadge.toLowerCase().includes('featured')) {
        updatedBadge = updatedBadge ? `Featured • ${updatedBadge}` : 'Featured';
      }
    } else if (updatedBadge.toLowerCase() === 'featured') {
      updatedBadge = 'Premier Estate';
    }

    console.log('Saving project:', formData.title, 'with image:', formData.image);
    const finalProject: Project = {
      ...formData,
      badge: updatedBadge || undefined,
      image: formData.image,
      galleryImages: formData.galleryImages?.length > 0
        ? [formData.image, ...formData.galleryImages.filter((img) => img !== formData.image)]
        : [formData.image]
    };

    onSave(finalProject);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-[#CBD5E1] my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#000f22] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b7102a] text-white flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  {isCreating ? 'Catalog Creation' : 'Property Record Editor'}
                </span>
                {isFeaturedOnHome && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>Home Featured</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white line-clamp-1">
                {isCreating ? 'Post New Real Estate Listing' : formData.title}
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

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2 overflow-x-auto shrink-0 py-2">
          {[
            { id: 'basic', label: '1. Core Details & Location', icon: Building2 },
            { id: 'pricing', label: '2. Pricing & Terms', icon: DollarSign },
            { id: 'specs', label: '3. Architecture & Specs', icon: Layers },
            { id: 'media', label: '4. Photos & Video Tour', icon: ImageIcon },
            { id: 'features', label: '5. Amenities & Narrative', icon: Star },
            { id: 'units', label: '6. SQM Pricing Breakdown', icon: Layers }
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

        {/* Modal Body & Forms */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <form id="property-form" onSubmit={handleSubmit} className="space-y-6">
            {/* TAB 1: BASIC DETAILS */}
            {activeTab === 'basic' && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Appleton Grandeur Terraces"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Corridor / Strategic Axis
                    </label>
                    <select
                      value={formData.corridor}
                      onChange={e => setFormData({ ...formData, corridor: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30 bg-white"
                    >
                      {CORRIDOR_OPTIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Other Lagos Corridor">Other Lagos Corridor</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Property Category
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={e => setFormData({ ...formData, propertyType: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30 bg-white"
                    >
                      <option value="residential">Residential Terraces &amp; Apartments</option>
                      <option value="commercial">Commercial Arcades &amp; Malls</option>
                      <option value="plots">Serviced Residential Plots</option>
                      <option value="industrial">Industrial Parks &amp; Logistics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Full Location / Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Emmanuel Akachukwu St, Ajiwe, Abraham Adesanya, Lekki"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Development Stage
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30 bg-white"
                    >
                      <option value="ongoing">Ongoing Construction</option>
                      <option value="upcoming">Upcoming Off-Plan</option>
                      <option value="completed">Completed &amp; Delivered</option>
                      <option value="sites">Sites &amp; Services</option>
                      <option value="civil">Commercial &amp; Civil</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Status Ribbon Label
                    </label>
                    <input
                      type="text"
                      value={formData.statusLabel}
                      onChange={e => setFormData({ ...formData, statusLabel: e.target.value })}
                      placeholder="e.g. Selling Fast, Sold Out, Ready"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Marketing Badge (Pill)
                    </label>
                    <input
                      type="text"
                      value={formData.badge || ''}
                      onChange={e => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. FEATURED, HOT DEAL, OFF PLAN"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      id="home-featured-checkbox"
                      checked={isFeaturedOnHome}
                      onChange={e => setIsFeaturedOnHome(e.target.checked)}
                      className="w-4 h-4 text-[#b7102a] rounded cursor-pointer"
                    />
                  </div>
                  <label htmlFor="home-featured-checkbox" className="cursor-pointer">
                    <span className="text-xs font-black text-[#000f22] block">
                      Feature on Website Homepage
                    </span>
                    <span className="text-[11px] text-[#475569] leading-relaxed block mt-0.5">
                      Prioritizes this property on the Homepage Featured Carousel and search results so prospective buyers see it immediately upon visiting.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: PRICING & TERMS */}
            {activeTab === 'pricing' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Price Display Headline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.priceDisplay}
                      onChange={e => setFormData({ ...formData, priceDisplay: e.target.value })}
                      placeholder="e.g. ₦85,000,000 or From ₦25M"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Initial Deposit Amount
                    </label>
                    <input
                      type="text"
                      value={formData.startingDeposit || ''}
                      onChange={e => setFormData({ ...formData, startingDeposit: e.target.value })}
                      placeholder="e.g. ₦10,000,000"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Price Subtitle / Payment Plan Summary
                  </label>
                  <input
                    type="text"
                    value={formData.priceSub || ''}
                    onChange={e => setFormData({ ...formData, priceSub: e.target.value })}
                    placeholder="e.g. ₦10M Initial Deposit • 12 Months Flexible Milestone Spread"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Price Tier
                    </label>
                    <select
                      value={formData.priceCategory}
                      onChange={e => setFormData({ ...formData, priceCategory: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30 bg-white"
                    >
                      <option value="mid">Mid-Market Accessible (₦20M - ₦90M)</option>
                      <option value="high">High Luxury Executive (₦90M+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Payment Terms
                    </label>
                    <input
                      type="text"
                      value={formData.paymentType || ''}
                      onChange={e => setFormData({ ...formData, paymentType: e.target.value })}
                      placeholder="e.g. Direct Allocation / Installments"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Delivery / Handover Date
                    </label>
                    <input
                      type="text"
                      value={formData.handoverDate || ''}
                      onChange={e => setFormData({ ...formData, handoverDate: e.target.value })}
                      placeholder="e.g. Q4 2026 or Immediate"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ARCHITECTURE & SPECS */}
            {activeTab === 'specs' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.specs?.beds || ''}
                      onChange={e => setFormData({
                        ...formData,
                        specs: { ...formData.specs, beds: e.target.value ? parseInt(e.target.value, 10) : undefined }
                      })}
                      placeholder="e.g. 4"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.specs?.baths || ''}
                      onChange={e => setFormData({
                        ...formData,
                        specs: { ...formData.specs, baths: e.target.value ? parseInt(e.target.value, 10) : undefined }
                      })}
                      placeholder="e.g. 5"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Area / Size
                    </label>
                    <input
                      type="text"
                      value={formData.specs?.area || ''}
                      onChange={e => setFormData({
                        ...formData,
                        specs: { ...formData.specs, area: e.target.value }
                      })}
                      placeholder="e.g. 320 sqm or 500 sqm"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Available Units
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.specs?.units || ''}
                      onChange={e => setFormData({
                        ...formData,
                        specs: { ...formData.specs, units: e.target.value ? parseInt(e.target.value, 10) : undefined }
                      })}
                      placeholder="e.g. 16"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Land &amp; Topography Type
                    </label>
                    <input
                      type="text"
                      value={formData.specs?.landType || ''}
                      onChange={e => setFormData({
                        ...formData,
                        specs: { ...formData.specs, landType: e.target.value }
                      })}
                      placeholder="e.g. 100% Dry Table Land"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                      Title Document
                    </label>
                    <input
                      type="text"
                      value={formData.specs?.titleType || ''}
                      onChange={e => setFormData({
                        ...formData,
                        specs: { ...formData.specs, titleType: e.target.value }
                      })}
                      placeholder="e.g. Governor’s Consent / C of O / Gazette"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Secondary Title Badge
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryBadge || ''}
                    onChange={e => setFormData({ ...formData, secondaryBadge: e.target.value })}
                    placeholder="e.g. GOVERNOR’S CONSENT • DRY TABLE LAND"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: PHOTOS & VIDEO TOUR */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1.5">
                    Main Cover Image URL <span className="text-red-500">*</span>
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
                        onChange={e => handleFileUpload(e, false)}
                      />
                    </label>
                  </div>

                  {/* Cover Image Preview */}
                  {formData.image && (
                    <div className="mt-3 relative h-44 rounded-xl overflow-hidden border border-[#CBD5E1] bg-slate-900 max-w-md">
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

                {/* Video Tour URL */}
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Video Tour URL (YouTube, Vimeo, MP4)
                  </label>
                  <div className="flex items-center gap-2">
                    <Film className="w-5 h-5 text-[#b7102a] shrink-0" />
                    <input
                      type="url"
                      value={formData.videoList?.[0]?.url || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          videoList: val ? [{
                            url: val,
                            title: `${formData.title} Video Tour`,
                            duration: '03:30'
                          }] : []
                        });
                      }}
                      placeholder="e.g. https://www.youtube.com/watch?v=qa550kq6gc8"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>
                </div>

                {/* Forms PDF URL (FAQ / Application Form) */}
                <div className="border-t border-[#E2E8F0] pt-4">
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Forms / FAQ PDF Download URL
                  </label>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#b7102a] shrink-0" />
                    <input
                      type="url"
                      value={formData.faqPdfUrl || ''}
                      onChange={e => setFormData({ ...formData, faqPdfUrl: e.target.value })}
                      placeholder="e.g. https://caihgroup.com/wp-content/uploads/2024/11/APPLETON-FORM-FAQ.pdf"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    Provides the downloadable application form and FAQ PDF link on the property detail page.
                  </p>
                </div>

                {/* Gallery Images */}
                <div className="border-t border-[#E2E8F0] pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider">
                      Photo Gallery ({formData.galleryImages?.length || 0} Images)
                    </label>
                    <label className="text-xs text-[#b7102a] font-bold hover:underline cursor-pointer flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Gallery Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFileUpload(e, true)}
                      />
                    </label>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newGalleryUrl}
                      onChange={e => setNewGalleryUrl(e.target.value)}
                      placeholder="Add image URL to photo gallery"
                      className="flex-1 px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryImage}
                      className="px-4 py-2 rounded-xl bg-[#000f22] text-white text-xs font-bold hover:bg-[#b7102a] transition-colors cursor-pointer"
                    >
                      Add Photo
                    </button>
                  </div>

                  {formData.galleryImages && formData.galleryImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {formData.galleryImages.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#CBD5E1] h-16 bg-slate-900">
                          <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: AMENITIES & NARRATIVE */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Card Summary (Short Synopsis) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.summary}
                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Short 2-sentence hook displayed on property cards and search listings..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">
                    Detailed Estate Description (Full Overview)
                  </label>
                  <textarea
                    rows={5}
                    value={formData.detailedDescription}
                    onChange={e => setFormData({ ...formData, detailedDescription: e.target.value })}
                    placeholder="Comprehensive architectural narrative, structural materials, estate features, neighborhood perks..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>

                {/* Clickable Amenities Chips */}
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-2">
                    Key Features &amp; Infrastructure (Click to toggle)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {COMMON_AMENITIES.map((amenity, idx) => {
                      const isSelected = formData.keyFeatures?.includes(amenity);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleAmenity(amenity)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{amenity}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Amenity Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={e => setNewFeatureText(e.target.value)}
                      placeholder="Add custom feature (e.g. Inverter Ready, Helipad access)..."
                      className="flex-1 px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomFeature}
                      className="px-4 py-2 rounded-xl bg-[#000f22] text-white text-xs font-bold hover:bg-[#b7102a] transition-colors cursor-pointer"
                    >
                      Add Feature
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SQM PRICING BREAKDOWN */}
            {activeTab === 'units' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-black text-[#000f22] mb-1">SQM, Plot & Unit Pricing Breakdown</h4>
                  <p className="text-xs text-slate-600 mb-4">
                    Configure individual plots, apartment types, or SQM tiers for this estate. Buyers will see these pricing breakdowns on the property details page.
                  </p>

                  {/* Add / Edit Unit Form */}
                  <div className={`p-4 rounded-2xl border space-y-3 mb-5 transition-all ${editingUnitIndex !== null ? 'bg-amber-50/80 border-amber-300' : 'bg-[#F8FAFC] border-[#CBD5E1]'}`}>
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[#000f22] uppercase tracking-wider">
                        {editingUnitIndex !== null ? `✏️ Editing Unit / Plot #${editingUnitIndex + 1}` : 'Add New Plot / Unit / SQM Tier'}
                      </h5>
                      {editingUnitIndex !== null && (
                        <button
                          type="button"
                          onClick={handleCancelEditUnit}
                          className="text-[11px] font-bold text-slate-600 hover:text-red-600 underline cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Unit / Plot Name *</label>
                        <input
                          type="text"
                          value={newUnitName}
                          onChange={e => setNewUnitName(e.target.value)}
                          placeholder="e.g. 300 SQM Residential Plot"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Size / Dimensions</label>
                        <input
                          type="text"
                          value={newUnitSize}
                          onChange={e => setNewUnitSize(e.target.value)}
                          placeholder="e.g. 300 sqm or 4-Bed Terrace"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Price Display *</label>
                        <input
                          type="text"
                          value={newUnitPrice}
                          onChange={e => setNewUnitPrice(e.target.value)}
                          placeholder="e.g. ₦45,000,000"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold bg-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Initial Deposit</label>
                        <input
                          type="text"
                          value={newUnitDeposit}
                          onChange={e => setNewUnitDeposit(e.target.value)}
                          placeholder="e.g. ₦5,000,000"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Short Description / Perks</label>
                        <input
                          type="text"
                          value={newUnitDesc}
                          onChange={e => setNewUnitDesc(e.target.value)}
                          placeholder="e.g. 100% dry land, immediate physical allocation"
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1 gap-2">
                      {editingUnitIndex !== null && (
                        <button
                          type="button"
                          onClick={handleCancelEditUnit}
                          className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleSaveUnit}
                        className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          editingUnitIndex !== null ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#000f22] hover:bg-[#b7102a]'
                        }`}
                      >
                        {editingUnitIndex !== null ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{editingUnitIndex !== null ? 'Save Unit Changes' : 'Add Unit / SQM Breakdown'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Units List */}
                  <div>
                    <h5 className="text-xs font-bold text-[#000f22] uppercase tracking-wider mb-2">
                      Configured Breakdown ({formData.unitsOrPlots?.length || 0} Items)
                    </h5>
                    {(!formData.unitsOrPlots || formData.unitsOrPlots.length === 0) ? (
                      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
                        No SQM pricing breakdown or units added yet. Use the form above to add plots or apartment types.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {formData.unitsOrPlots.map((unit, idx) => (
                          <div key={unit.id || idx} className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 shadow-xs ${editingUnitIndex === idx ? 'bg-amber-50/90 border-amber-400' : 'bg-white border-[#CBD5E1]'}`}>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-[#000f22]">{unit.name}</span>
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">{unit.size}</span>
                                {unit.isPopular && (
                                  <span className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black">Popular</span>
                                )}
                              </div>
                              <div className="text-xs font-bold text-[#b7102a] mt-0.5">
                                {unit.priceDisplay} {unit.deposit ? `(Deposit: ${unit.deposit})` : ''}
                              </div>
                              {unit.description && <p className="text-[11px] text-slate-600 mt-0.5">{unit.description}</p>}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditUnit(idx)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-[#000f22] hover:text-white text-slate-700 transition-colors cursor-pointer"
                                title="Edit unit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveUnit(idx)}
                                className="p-2 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                                title="Remove unit"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                  <span className="text-[11px] text-slate-500">How it renders in the Properties page &amp; Homepage</span>
                </div>

                <div className="max-w-sm mx-auto bg-white rounded-xl border border-[#E2E8F0] shadow-lg overflow-hidden flex flex-col justify-between">
                  <div className="relative">
                    <div className="h-52 overflow-hidden relative bg-slate-900">
                      <img
                        src={formData.image || '/images/appleton_court_exterior_real.jpg'}
                        alt={formData.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded bg-[#b7102a] text-white text-[10px] uppercase font-bold tracking-wider shadow-sm">
                          {isFeaturedOnHome ? 'Featured' : (formData.badge || 'Available')}
                        </span>
                        {formData.secondaryBadge && (
                          <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider">
                            {formData.secondaryBadge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 text-[11px] text-[#94A3B8] mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#b7102a]" />
                        <span className="truncate">{formData.location || 'Lagos Corridor'}</span>
                      </div>
                      <h4 className="text-base font-bold text-[#000f22] line-clamp-1">{formData.title || 'Untitled Property'}</h4>
                      <div className="mt-2 text-lg font-black text-[#b7102a]">{formData.priceDisplay || '₦0,000,000'}</div>
                      <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5 truncate">
                        {formData.priceSub || 'Flexible Payment Available'}
                      </span>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{formData.summary || 'No summary provided.'}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <div className="w-full py-2 rounded bg-[#000f22] text-white text-center text-xs font-bold">
                      View Residence &amp; Plans →
                    </div>
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
                    onClick={() => {
                      onDelete(formData.id);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-red-200 hover:border-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Listing</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreating ? 'Publish Property' : 'Save Property Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
