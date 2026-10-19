import React, { useState, useEffect } from 'react';
import { Project, Article } from '../types';
import { PROJECTS } from '../data/mockData';
import { getStoredArticles, saveStoredArticles } from '../utils/articlesStore';
import {
  Shield,
  Users,
  Mail,
  Building2,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Send,
  Download,
  Search,
  FileText,
  Calendar,
  Phone,
  BarChart3,
  Settings,
  ArrowRight,
  X,
  Check,
  Eye,
  AlertCircle,
  Lock,
  User,
  LogOut
} from 'lucide-react';

interface AdminScreenProps {
  onViewProject: (project: Project) => void;
  onNavigate: (page: any) => void;
}

interface Subscriber {
  email: string;
  joinedDate: string;
  source: string;
}

interface Inquiry {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  project: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ onViewProject, onNavigate }) => {
  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('caih_admin_logged_in') === 'true';
  });
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'signup' ? 'signup' : 'login';
  });
  const [loginEmail, setLoginEmail] = useState('admin@caihgroup.com');
  const [loginPassword, setLoginPassword] = useState('caih2026');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError('Please enter both email and password.');
      return;
    }
    localStorage.setItem('caih_admin_logged_in', 'true');
    setIsAdminLoggedIn(true);
    setAuthError(null);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      setAuthError('Please fill in all registration fields.');
      return;
    }
    localStorage.setItem('caih_admin_logged_in', 'true');
    setIsAdminLoggedIn(true);
    setAuthError(null);
    alert(`Admin account created successfully for ${signupName}! Welcome to Caih Group Executive Portal.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('caih_admin_logged_in');
    setIsAdminLoggedIn(false);
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'blog' | 'newsletter' | 'inquiries'>('dashboard');

  // Editable Projects state initialized from localStorage or PROJECTS
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    const saved = localStorage.getItem('caih_admin_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return PROJECTS;
  });

  // Articles state initialized from getStoredArticles
  const [articlesList, setArticlesList] = useState<Article[]>(() => getStoredArticles());
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);

  useEffect(() => {
    saveStoredArticles(articlesList);
  }, [articlesList]);

  // Subscribers state
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    const saved = localStorage.getItem('caih_admin_subscribers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { email: 'dread.investor@gmail.com', joinedDate: '2026-04-12', source: 'Website Footer' },
      { email: 'chinedu.realtor@caihgroup.com', joinedDate: '2026-04-14', source: 'Realtor Form' },
      { email: 'investments@lagocapital.ng', joinedDate: '2026-04-16', source: 'Appleton Enclave Brochure' },
      { email: 'funke.ade@yahoo.com', joinedDate: '2026-04-18', source: 'Homepage Popup' }
    ];
  });

  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('caih_admin_inquiries');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'INQ-101', fullName: 'Dr. Babatunde Adeyemi', phone: '+44 7911 123456', email: 'dread.investor@gmail.com', project: 'Appleton Court', date: '2026-04-18', status: 'Confirmed' },
      { id: 'INQ-102', fullName: 'Mrs. Chinwe Okonkwo', phone: '+1 832 555 0192', email: 'chinwe.o@gmail.com', project: 'Appleton Terraces and Apartments', date: '2026-04-17', status: 'Pending' }
    ];
  });

  // Newsletter Broadcast state
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastSentStatus, setBroadcastSentStatus] = useState(false);

  // New Subscriber manual input
  const [newSubEmail, setNewSubEmail] = useState('');

  // Editing Project Modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    localStorage.setItem('caih_admin_projects', JSON.stringify(projectsList));
  }, [projectsList]);

  useEffect(() => {
    localStorage.setItem('caih_admin_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem('caih_admin_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const handleSaveProjectEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setProjectsList(prev => prev.map(p => p.id === editingProject.id ? editingProject : p));
    setEditingProject(null);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setArticlesList(prev => {
      const exists = prev.some(a => a.id === editingArticle.id);
      if (exists) {
        return prev.map(a => a.id === editingArticle.id ? editingArticle : a);
      } else {
        return [editingArticle, ...prev];
      }
    });
    setEditingArticle(null);
    setIsCreatingArticle(false);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setArticlesList(prev => prev.filter(a => a.id !== articleId));
    }
  };

  const handleCreateNewArticle = () => {
    const newArt: Article = {
      id: 'article-' + Date.now(),
      title: 'New Real Estate Market Insights',
      category: 'property-market',
      categoryLabel: 'Property Market',
      readTime: '5 min read',
      date: 'April 2026',
      author: {
        name: 'Caih Group',
        avatarInitials: 'CG',
        role: 'Caih Group'
      },
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      excerpt: 'Summary of the new property market insights and investment opportunities in Lagos.',
      content: [
        'First paragraph of your new post describing real estate trends in Lagos.',
        'Second paragraph highlighting infrastructural developments.'
      ],
      sections: [],
      keyTakeaways: ['High capital appreciation', 'Secure title documentation']
    };
    setEditingArticle(newArt);
    setIsCreatingArticle(true);
  };

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim() || !newSubEmail.includes('@')) return;
    if (subscribers.some(s => s.email.toLowerCase() === newSubEmail.toLowerCase())) {
      alert('Email is already subscribed.');
      return;
    }
    const updated = [{ email: newSubEmail.trim(), joinedDate: new Date().toISOString().split('T')[0], source: 'Admin Portal' }, ...subscribers];
    setSubscribers(updated);
    setNewSubEmail('');
  };

  const handleDeleteSubscriber = (email: string) => {
    if (confirm(`Remove ${email} from subscriber list?`)) {
      setSubscribers(prev => prev.filter(s => s.email !== email));
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastBody.trim()) {
      alert('Please fill in both subject and message body.');
      return;
    }
    setBroadcastSentStatus(true);
    setTimeout(() => {
      setBroadcastSentStatus(false);
      setBroadcastSubject('');
      setBroadcastBody('');
      alert(`Newsletter successfully broadcasted to ${subscribers.length} verified subscribers!`);
    }, 1200);
  };

  const exportSubscribersCsv = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + ['Email,Joined Date,Source', ...subscribers.map(s => `${s.email},${s.joinedDate},${s.source}`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'caih_group_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If not logged in, show Admin Login / Signup portal
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A1A2F] text-white pt-28 pb-16 flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full bg-slate-900/90 rounded-3xl p-8 border border-slate-800 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#b7102a] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Caih Group Admin</h1>
            <p className="text-xs text-slate-400 mt-1">Secure content & newsletter management portal</p>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-6 p-1 rounded-xl bg-slate-800/80 border border-slate-700">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(null); }}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'login' ? 'bg-[#b7102a] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'signup' ? 'bg-[#b7102a] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Register Admin
              </button>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Admin Email</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#b7102a]"
                    placeholder="admin@caihgroup.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#b7102a]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>Access Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#b7102a]"
                  placeholder="Engr. Obafaiye"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#b7102a]"
                  placeholder="exec@caihgroup.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#b7102a]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>Create Admin Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Return to Caih Group Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#000f22] pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        
        {/* Admin Header Banner */}
        <div className="bg-[#000f22] text-white rounded-3xl p-8 mb-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#b7102a] flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white/10 text-[#ffb3b1] text-[10px] font-bold tracking-widest uppercase mb-1">
                <span>Secure Executive Management Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Caih Group Admin Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Manage property listings, pricing, subscriber database, newsletter broadcasts, and client inspection inquiries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer"
            >
              Website
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-[#000f22] text-white shadow-sm'
                : 'bg-white text-[#64748B] hover:bg-slate-100 hover:text-[#000f22] border border-[#E2E8F0]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'properties'
                ? 'bg-[#000f22] text-white shadow-sm'
                : 'bg-white text-[#64748B] hover:bg-slate-100 hover:text-[#000f22] border border-[#E2E8F0]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Property Manager ({projectsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'blog'
                ? 'bg-[#000f22] text-white shadow-sm'
                : 'bg-white text-[#64748B] hover:bg-slate-100 hover:text-[#000f22] border border-[#E2E8F0]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog Posts & Content ({articlesList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'newsletter'
                ? 'bg-[#000f22] text-white shadow-sm'
                : 'bg-white text-[#64748B] hover:bg-slate-100 hover:text-[#000f22] border border-[#E2E8F0]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Newsletter & Subscribers ({subscribers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'inquiries'
                ? 'bg-[#000f22] text-white shadow-sm'
                : 'bg-white text-[#64748B] hover:bg-slate-100 hover:text-[#000f22] border border-[#E2E8F0]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Inspection Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">Total Properties</span>
                  <div className="text-3xl font-black text-[#000f22] mt-1">{projectsList.length}</div>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">100% Active Listings</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">Newsletter Subscribers</span>
                  <div className="text-3xl font-black text-[#000f22] mt-1">{subscribers.length}</div>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">+4 this week</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#b7102a] flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">Inspection Inquiries</span>
                  <div className="text-3xl font-black text-[#000f22] mt-1">{inquiries.length}</div>
                  <span className="text-[11px] text-amber-700 font-semibold mt-1 inline-block">1 Pending Review</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">System Status</span>
                  <div className="text-3xl font-black text-emerald-700 mt-1">Live</div>
                  <span className="text-[11px] text-slate-500 font-semibold mt-1 inline-block">SSL Secured & Synced</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-xs">
                <h3 className="font-extrabold text-base text-[#000f22] mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#b7102a]" />
                  <span>Quick Property Management</span>
                </h3>
                <div className="space-y-3">
                  {projectsList.slice(0, 4).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div>
                        <div className="font-bold text-xs text-[#000f22]">{p.title}</div>
                        <div className="text-[11px] text-slate-500">{p.location} • <span className="font-semibold text-[#b7102a]">{p.priceDisplay}</span></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProject(p)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-xs font-bold text-[#000f22] hover:bg-slate-100 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onViewProject(p)}
                          className="p-1.5 rounded-lg bg-[#000f22] text-white hover:bg-[#b7102a] cursor-pointer"
                          title="View live page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('properties')}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#000f22] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>View All {projectsList.length} Properties</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-[#000f22] mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#b7102a]" />
                    <span>Quick Newsletter Broadcast</span>
                  </h3>
                  <p className="text-xs text-[#64748B] mb-4">
                    Send updates, price alerts, or milestone notifications instantly to all {subscribers.length} verified newsletter subscribers.
                  </p>
                  <form onSubmit={handleSendBroadcast} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Newsletter Subject (e.g. Appleton Enclave Milestone Update)"
                      value={broadcastSubject}
                      onChange={e => setBroadcastSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                    <textarea
                      rows={3}
                      placeholder="Write your broadcast message here..."
                      value={broadcastBody}
                      onChange={e => setBroadcastBody(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                    />
                    <button
                      type="submit"
                      disabled={broadcastSentStatus}
                      className="w-full py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{broadcastSentStatus ? 'Broadcasting...' : `Send Newsletter to ${subscribers.length} Subscribers`}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTY & CONTENT MANAGER */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#000f22]">Property Content Catalog</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Edit prices, titles, status badges, and descriptions for any estate or building.</p>
              </div>
              <div className="text-xs font-bold text-[#b7102a] bg-[#FFF1F2] px-3 py-1.5 rounded-lg border border-[#FFE4E6]">
                Total Listings: {projectsList.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsList.map(p => (
                <div key={p.id} className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 w-full bg-slate-900">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded bg-[#b7102a] text-white text-[10px] font-bold uppercase tracking-wider shadow">
                          {p.statusLabel}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-[11px] text-slate-500 font-semibold mb-1">{p.location}</div>
                      <h4 className="text-base font-bold text-[#000f22] line-clamp-1">{p.title}</h4>
                      <div className="text-sm font-black text-[#b7102a] mt-2">{p.priceDisplay}</div>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{p.summary}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => setEditingProject(p)}
                      className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#000f22] text-xs font-bold border border-[#CBD5E1] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#b7102a]" />
                      <span>Edit Content</span>
                    </button>
                    <button
                      onClick={() => onViewProject(p)}
                      className="px-4 py-2 rounded-xl bg-[#000f22] hover:bg-[#b7102a] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: BLOG POSTS & CONTENT MANAGER */}
        {activeTab === 'blog' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-xs">
              <div>
                <h3 className="text-xl font-extrabold text-[#000f22]">Blog Posts & Content Manager</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Create, edit, or delete published articles, announcements, and market research reports.</p>
              </div>
              <button
                onClick={handleCreateNewArticle}
                className="px-5 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Blog Post</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articlesList.map(art => (
                <div key={art.id} className="bg-white rounded-2xl border border-[#CBD5E1] overflow-hidden shadow-xs flex flex-col justify-between group">
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#b7102a] text-white text-[10px] font-bold uppercase tracking-wider">
                        {art.categoryLabel}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="text-[11px] text-[#64748B] mb-1">{art.date} • {art.readTime}</div>
                      <h4 className="text-base font-bold text-[#000f22] line-clamp-2 mb-2">{art.title}</h4>
                      <p className="text-xs text-[#64748B] line-clamp-3">{art.excerpt}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0 flex items-center justify-between border-t border-[#F1F5F9] mt-4">
                    <span className="text-[11px] font-semibold text-[#000f22]">By {art.author.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingArticle({ ...art });
                          setIsCreatingArticle(false);
                        }}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-[#000f22] hover:text-white text-[#000f22] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Edit Post"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: NEWSLETTER & SUBSCRIBERS */}
        {activeTab === 'newsletter' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-xl font-extrabold text-[#000f22]">Newsletter Subscribers Database</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Manage subscribed emails, export CSV, and dispatch announcements.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportSubscribersCsv}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV ({subscribers.length})</span>
                  </button>
                </div>
              </div>

              {/* Add Subscriber Form */}
              <form onSubmit={handleAddSubscriber} className="flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <input
                  type="email"
                  placeholder="Enter subscriber email address (e.g. client@domain.com)"
                  value={newSubEmail}
                  onChange={e => setNewSubEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30 bg-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#000f22] hover:bg-[#b7102a] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subscriber</span>
                </button>
              </form>

              {/* Subscribers Table */}
              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#000f22] text-white">
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Email Address</th>
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Joined Date</th>
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Source</th>
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {subscribers.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-[#000f22]">{sub.email}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-slate-600">{sub.joinedDate}</td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                            {sub.source}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <button
                            onClick={() => handleDeleteSubscriber(sub.email)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove subscriber"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Broadcast Form */}
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs">
              <h3 className="text-xl font-extrabold text-[#000f22] mb-1">Compose Newsletter Broadcast</h3>
              <p className="text-xs text-[#64748B] mb-6">Dispatch announcement emails to all {subscribers.length} verified subscribers.</p>

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Subject Line</label>
                  <input
                    type="text"
                    placeholder="e.g. Exclusive Allocation Update: Appleton Enclave C of O Verification"
                    value={broadcastSubject}
                    onChange={e => setBroadcastSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Message Content</label>
                  <textarea
                    rows={6}
                    placeholder="Dear Subscriber, We are pleased to announce..."
                    value={broadcastBody}
                    onChange={e => setBroadcastBody(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={broadcastSentStatus}
                  className="py-3 px-6 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{broadcastSentStatus ? 'Broadcasting Newsletter...' : `Send Broadcast to ${subscribers.length} Subscribers`}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: INSPECTION INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#000f22]">Client Inspection & Booking Inquiries</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Manage inspection requests submitted by prospective investors and homeowners.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#000f22] text-white">
                    <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Client Name</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Contact Phone</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Target Project</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Date</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-[#000f22]">{inq.fullName}</td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-700">{inq.phone}</td>
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#b7102a]">{inq.project}</td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-600">{inq.date}</td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inq.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          inq.status === 'Completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right space-x-2">
                        <button
                          onClick={() => {
                            setInquiries(prev => prev.map(item => item.id === inq.id ? { ...item, status: 'Confirmed' } : item));
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold hover:bg-emerald-200 cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            setInquiries(prev => prev.map(item => item.id === inq.id ? { ...item, status: 'Completed' } : item));
                          }}
                          className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-[11px] font-bold hover:bg-blue-200 cursor-pointer"
                        >
                          Complete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-6">
              <h3 className="text-xl font-black text-[#000f22]">Edit Property: {editingProject.title}</h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Project Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Location / Address</label>
                <input
                  type="text"
                  value={editingProject.location}
                  onChange={e => setEditingProject({ ...editingProject, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Status Label</label>
                  <input
                    type="text"
                    value={editingProject.statusLabel}
                    onChange={e => setEditingProject({ ...editingProject, statusLabel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Price Display</label>
                  <input
                    type="text"
                    value={editingProject.priceDisplay}
                    onChange={e => setEditingProject({ ...editingProject, priceDisplay: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Summary Description</label>
                <textarea
                  rows={3}
                  value={editingProject.summary}
                  onChange={e => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#000f22] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / CREATE ARTICLE MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-[#CBD5E1] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-6">
              <h3 className="text-lg font-bold text-[#000f22]">
                {isCreatingArticle ? 'Create New Blog Post' : 'Edit Blog Post'}
              </h3>
              <button
                onClick={() => setEditingArticle(null)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Category Label</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.categoryLabel}
                    onChange={e => setEditingArticle({ ...editingArticle, categoryLabel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Read Time</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.readTime}
                    onChange={e => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.date}
                    onChange={e => setEditingArticle({ ...editingArticle, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.author.name}
                    onChange={e => setEditingArticle({ ...editingArticle, author: { ...editingArticle.author, name: e.target.value } })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Featured Image URL</label>
                <input
                  type="url"
                  required
                  value={editingArticle.image}
                  onChange={e => setEditingArticle({ ...editingArticle, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Excerpt Summary</label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.excerpt}
                  onChange={e => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Content Paragraphs (separated by blank lines)</label>
                <textarea
                  rows={6}
                  required
                  value={editingArticle.content.join('\n\n')}
                  onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value.split('\n\n').filter(Boolean) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#000f22] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
