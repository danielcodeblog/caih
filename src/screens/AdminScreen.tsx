import React, { useState, useEffect } from 'react';
import { Project, Article } from '../types';
import { subscribeClient } from '../services/newsletterService';
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
  LogOut,
  Database,
  Copy,
  ExternalLink,
  RefreshCw,
  Code2,
  EyeOff,
  UserCheck,
  KeyRound
} from 'lucide-react';
import {
  isSupabaseConfigured,
  fetchInspectionsFromSupabase,
  fetchSubscribersFromSupabase,
  fetchPropertiesFromSupabase,
  fetchArticlesFromSupabase,
  upsertPropertyToSupabase,
  upsertArticleToSupabase,
  deletePropertyFromSupabase,
  deleteArticleFromSupabase,
  deleteSubscriberFromSupabase,
  deleteInspectionFromSupabase,
  seedDatabase,
  signInAdmin,
  signUpAdmin,
  fetchAdminUsersFromSupabase,
  deleteAdminUserFromSupabase,
  supabase
} from '../lib/supabase';
import { DatabaseConnector } from '../components/DatabaseConnector';
import { SUPABASE_SCHEMA_SQL } from '../data/supabaseSchema';
import { ADMIN_AUTH_SQL } from '../data/adminAuthSql';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

const DEFAULT_ADMIN_USERS: AdminUser[] = [];

interface AdminScreenProps {
  onViewProject: (project: Project) => void;
  onNavigate: (page: any) => void;
  initialMode?: 'login' | 'signup';
  forceAuthScreen?: boolean;
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

export const AdminScreen: React.FC<AdminScreenProps> = ({
  onViewProject,
  onNavigate,
  initialMode,
  forceAuthScreen = false
}) => {
  // Admin Accounts Storage
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('caih_admin_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_ADMIN_USERS;
  });

  useEffect(() => {
    localStorage.setItem('caih_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  // Current Logged-in Admin Session
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('caih_current_admin');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (forceAuthScreen) return false;
    return localStorage.getItem('caih_admin_logged_in') === 'true';
  });

  // Auth Mode: login vs signup
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(() => {
    if (initialMode) return initialMode;
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'signup' ? 'signup' : 'login';
  });

  // Force Auth screen open if specifically requested
  const [showAuthModal, setShowAuthModal] = useState<boolean>(() => {
    if (forceAuthScreen) return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'login' || params.get('mode') === 'signup') return true;
    return localStorage.getItem('caih_admin_logged_in') !== 'true';
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState('Managing Director');

  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [showSqlAuthModal, setShowSqlAuthModal] = useState(false);
  const [showDbConnectModal, setShowDbConnectModal] = useState(false);
  const [copiedAuthSql, setCopiedAuthSql] = useState(false);
  const [authBackendNotice, setAuthBackendNotice] = useState<string | null>(null);

  // Sync Supabase data on mount & when config changes
  useEffect(() => {
    const syncAll = async () => {
      if (isSupabaseConfigured()) {
        try {
          const [dbAdmins, dbProps, dbArticles, dbInqs, dbSubs] = await Promise.all([
            fetchAdminUsersFromSupabase(),
            fetchPropertiesFromSupabase(),
            fetchArticlesFromSupabase(),
            fetchInspectionsFromSupabase(),
            fetchSubscribersFromSupabase()
          ]);

          if (dbAdmins && dbAdmins.length > 0) {
            setAdminUsers((prev) => {
              const map = new Map<string, AdminUser>();
              prev.forEach((u) => map.set(u.email?.toLowerCase() || '', u));
              dbAdmins.forEach((u) => {
                map.set(u.email?.toLowerCase() || '', {
                  id: u.id,
                  name: u.name,
                  email: u.email,
                  password: '••••••••',
                  role: u.role,
                  createdAt: u.createdAt,
                });
              });
              return Array.from(map.values());
            });
          }

          if (dbProps && dbProps.length > 0) {
            setProjectsList(dbProps);
          }

          if (dbArticles && dbArticles.length > 0) {
            setArticlesList(dbArticles);
          }

          if (dbInqs && dbInqs.length > 0) {
            setInquiries(dbInqs.map((r) => ({
              id: r.id || 'INQ-' + Math.random().toString().slice(2, 6),
              fullName: r.full_name,
              phone: r.phone_number,
              email: r.email,
              project: r.target_project,
              date: r.preferred_date,
              status: (r.status as any) || 'Pending'
            })));
          }

          if (dbSubs && dbSubs.length > 0) {
            setSubscribers(dbSubs.map(s => ({
              email: s.email,
              joinedDate: (s.subscribedAt || '').split('T')[0] || new Date().toISOString().split('T')[0],
              source: s.source || 'Database'
            })));
          }
        } catch (e) {
          console.warn('Supabase initial sync note:', e);
        }
      }
    };

    syncAll();
    window.addEventListener('caih_supabase_config_changed', syncAll);
    return () => {
      window.removeEventListener('caih_supabase_config_changed', syncAll);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMessage(null);
    setIsSubmittingAuth(true);

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail || !loginPassword) {
      setAuthError('Please enter both your administrative email and password.');
      setIsSubmittingAuth(false);
      return;
    }

    // If not configured, block login
    if (!isSupabaseConfigured()) {
      setAuthError('Database not connected. Please configure Supabase in settings.');
      setIsSubmittingAuth(false);
      return;
    }

    try {
      const result = await signInAdmin(cleanEmail, loginPassword);
      if (result.success && result.admin) {
        const authenticatedAdmin: AdminUser = {
          id: result.admin.id,
          name: result.admin.name,
          email: result.admin.email,
          password: '••••••••',
          role: result.admin.role,
          createdAt: result.admin.createdAt || new Date().toISOString().split('T')[0],
        };

        localStorage.setItem('caih_admin_logged_in', 'true');
        localStorage.setItem('caih_current_admin', JSON.stringify(authenticatedAdmin));
        setCurrentAdmin(authenticatedAdmin);
        setIsAdminLoggedIn(true);
        setShowAuthModal(false);
        setIsSubmittingAuth(false);
        setAuthBackendNotice('Authenticated via Supabase PostgreSQL');
        return;
      }
      setAuthError(result.error || 'Authentication failed. Check your credentials.');
    } catch (err: any) {
      setAuthError('Authentication service unavailable.');
    }
    setIsSubmittingAuth(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMessage(null);

    const cleanEmail = signupEmail.trim().toLowerCase();

    if (!signupName.trim() || !cleanEmail || !signupPassword) {
      setAuthError('Please fill in all required registration fields.');
      return;
    }

    if (signupPassword.length < 6) {
      setAuthError('Password must be at least 6 characters in length.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match. Please re-enter your password.');
      return;
    }

    const existing = adminUsers.find(u => u.email?.toLowerCase() === cleanEmail);
    if (existing) {
      setAuthError(`An administrator account with email ${signupEmail} already exists. Please log in instead.`);
      return;
    }

    setIsSubmittingAuth(true);

    let createdId = 'adm-' + Date.now();

    // Try Supabase registration if configured
    if (!isSupabaseConfigured()) {
      setAuthError('Database not connected. Please configure Supabase in settings.');
      setIsSubmittingAuth(false);
      return;
    }
    
    try {
      const result = await signUpAdmin(signupName.trim(), cleanEmail, signupPassword, signupRole);
      if (result.success && result.admin) {
        const newAdmin: AdminUser = {
          id: result.admin.id,
          name: result.admin.name,
          email: result.admin.email,
          password: '••••••••',
          role: result.admin.role,
          createdAt: result.admin.createdAt || new Date().toISOString().split('T')[0]
        };

        localStorage.setItem('caih_admin_logged_in', 'true');
        localStorage.setItem('caih_current_admin', JSON.stringify(newAdmin));
        
        setCurrentAdmin(newAdmin);
        setIsAdminLoggedIn(true);
        setShowAuthModal(false);
        setAuthError(null);
        setAuthBackendNotice('Registered and authenticated via Supabase');
      } else {
        setAuthError(result.error || 'Registration failed.');
      }
    } catch (err: any) {
      setAuthError('Registration service unavailable.');
    }
    setIsSubmittingAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('caih_admin_logged_in');
    setIsAdminLoggedIn(false);
    setShowAuthModal(true);
    setAuthMode('login');
  };

  const handleSelectDemoCredentials = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setAuthError(null);
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'blog' | 'newsletter' | 'inquiries' | 'database' | 'admins'>('dashboard');
  const [activeSqlTab, setActiveSqlTab] = useState<'auth' | 'full'>('auth');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [supabaseSyncResult, setSupabaseSyncResult] = useState<string | null>(null);

  const handleCopySchema = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 3000);
    } catch (e) {
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 3000);
    }
  };

  const handleCopyAuthSql = async () => {
    try {
      await navigator.clipboard.writeText(ADMIN_AUTH_SQL);
      setCopiedAuthSql(true);
      setTimeout(() => setCopiedAuthSql(false), 3000);
    } catch (e) {
      setCopiedAuthSql(true);
      setTimeout(() => setCopiedAuthSql(false), 3000);
    }
  };

  const handleSyncFromSupabase = async () => {
    setSyncingSupabase(true);
    setSupabaseSyncResult(null);
    try {
      if (!isSupabaseConfigured()) {
        setSupabaseSyncResult('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
        setSyncingSupabase(false);
        return;
      }
      const [remoteInquiries, remoteSubs] = await Promise.all([
        fetchInspectionsFromSupabase(),
        fetchSubscribersFromSupabase()
      ]);

      if (remoteInquiries.length > 0) {
        const formattedInquiries: Inquiry[] = remoteInquiries.map((r) => ({
          id: r.id || 'INQ-' + Math.random().toString().slice(2, 6),
          fullName: r.full_name,
          phone: r.phone_number,
          email: r.email,
          project: r.target_project,
          date: r.preferred_date,
          status: (r.status as any) || 'Pending'
        }));
        setInquiries(formattedInquiries);
      }

      if (remoteSubs.length > 0) {
        setSubscribers(remoteSubs.map(s => ({
          email: s.email,
          joinedDate: s.subscribedAt.split('T')[0],
          source: s.source
        })));
      }

      setSupabaseSyncResult(`Successfully synced with Supabase! Found ${remoteInquiries.length} inspections and ${remoteSubs.length} subscribers.`);
    } catch (err: any) {
      setSupabaseSyncResult(`Sync error: ${err.message || 'Unable to connect to Supabase.'}`);
    } finally {
      setSyncingSupabase(false);
    }
  };

  // Editable Projects state initialized from localStorage
  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    const saved = localStorage.getItem('caih_admin_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Articles state initialized empty
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);

  // Subscribers state initialized empty
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('caih_admin_inquiries');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Newsletter Broadcast state


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

  const handleSaveProjectEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setProjectsList(prev => prev.map(p => p.id === editingProject.id ? editingProject : p));
    if (isSupabaseConfigured()) {
      await upsertPropertyToSupabase(editingProject, currentAdmin?.id);
    }
    setEditingProject(null);
  };

  const handleDeleteProperty = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this property listing? This will permanently remove it from the catalog and database.')) {
      setProjectsList(prev => {
        const updated = prev.filter(p => p.id !== projectId);
        localStorage.setItem('caih_admin_projects', JSON.stringify(updated));
        return updated;
      });
      if (isSupabaseConfigured()) {
        await deletePropertyFromSupabase(projectId);
      }
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
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
    if (isSupabaseConfigured()) {
      await upsertArticleToSupabase(editingArticle, currentAdmin?.id);
    }
    setEditingArticle(null);
    setIsCreatingArticle(false);
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (confirm('Are you sure you want to delete this blog post? This action will permanently remove it from the website and database.')) {
      setArticlesList(prev => {
        const updated = prev.filter(a => a.id !== articleId);
        return updated;
      });
      if (isSupabaseConfigured()) {
        await deleteArticleFromSupabase(articleId);
      }
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
    const res = subscribeClient(newSubEmail.trim(), '', 'all', 'manual');
    setSubscribers(prev => [...prev, { email: newSubEmail.trim(), joinedDate: new Date().toISOString().split('T')[0], source: 'manual' }]);
    setNewSubEmail('');
    alert(res.message);
  };

  const handleDeleteSubscriber = async (email: string) => {
    if (confirm(`Remove ${email} from subscriber list? This will remove the contact from your database.`)) {
      setSubscribers(prev => {
        const updated = prev.filter(s => s.email !== email);
        localStorage.setItem('caih_admin_subscribers', JSON.stringify(updated));
        return updated;
      });
      if (isSupabaseConfigured()) {
        await deleteSubscriberFromSupabase(email);
      }
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (confirm('Are you sure you want to remove this inspection inquiry?')) {
      setInquiries(prev => {
        const updated = prev.filter(item => item.id !== id);
        localStorage.setItem('caih_admin_inquiries', JSON.stringify(updated));
        return updated;
      });
      if (isSupabaseConfigured()) {
        await deleteInspectionFromSupabase(id);
      }
    }
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

  // If not logged in or auth modal requested, show Admin Login / Signup portal
  if (!isAdminLoggedIn || showAuthModal) {
    return (
      <div className="min-h-screen bg-[#071324] text-white pt-24 pb-16 flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-lg w-full bg-[#0A1A2F]/95 rounded-3xl p-7 sm:p-10 border border-slate-800 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-[#b7102a] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#b7102a]/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#ffb3b1] text-[10px] font-bold tracking-widest uppercase mb-2">
              <KeyRound className="w-3 h-3" />
              <span>Caih Group Corporate Executive Gateway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Executive Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized personnel sign in to manage estates, inspections, subscribers, and title documents.
            </p>


          </div>

          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccessMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{authSuccessMessage}</span>
            </div>
          )}



            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#b7102a]"
                      placeholder="name@caihgroup.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#b7102a]"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-lg shadow-[#b7102a]/20 cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
                >
                  {isSubmittingAuth ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Access Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Don't have an admin account? Register Admin
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Full Name</label>
                  <input type="text" required value={signupName} onChange={e => setSignupName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Admin Email</label>
                  <input type="email" required value={signupEmail} onChange={e => setSignupEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Password</label>
                  <input type="password" required value={signupPassword} onChange={e => setSignupPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Confirm Password</label>
                  <input type="password" required value={signupConfirmPassword} onChange={e => setSignupConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
                >
                  {isSubmittingAuth ? 'Registering...' : 'Register Administrator'}
                </button>
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              </form>
            )}


          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            {isAdminLoggedIn && (
              <button
                onClick={() => setShowAuthModal(false)}
                className="hover:text-white transition-colors cursor-pointer text-emerald-400 font-bold"
              >
                ← Return to Admin Dashboard
              </button>
            )}
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ← Return to Caih Group Main Website
            </button>
          </div>
        </div>

        {/* Modal: SQL for Admin Signup and Login */}
        {showSqlAuthModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A1A2F] text-white border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#b7102a] flex items-center justify-center text-white shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
                      SQL for Admin Signup and Login
                    </h3>
                    <p className="text-xs text-slate-400">
                      PostgreSQL schema with pgcrypto Blowfish hashing, RPC functions, and Supabase auth sync trigger.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSqlAuthModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="font-bold text-white block mb-1">Quick Instructions:</span>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[11px]">
                    <li>Open your Supabase project dashboard at <span className="font-mono text-emerald-400">supabase.com</span>.</li>
                    <li>Navigate to the <span className="font-bold text-white">SQL Editor</span> in the left sidebar.</li>
                    <li>Click <span className="font-bold text-white">&quot;Copy SQL Script&quot;</span> below, paste into the editor, and click <span className="font-bold text-white">&quot;Run&quot;</span>.</li>
                    <li>It creates <code className="text-[#ffb3b1] font-mono">public.admin_users</code>, stored procedures <code className="text-[#ffb3b1] font-mono">admin_signup()</code> &amp; <code className="text-[#ffb3b1] font-mono">admin_login()</code>, and default seed accounts.</li>
                  </ol>
                </div>

                <div className="relative rounded-xl bg-[#030712] border border-slate-800 p-4 font-mono text-[11px] text-emerald-400 max-h-72 overflow-y-auto leading-relaxed">
                  <pre>{ADMIN_AUTH_SQL}</pre>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCopyAuthSql}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                    copiedAuthSql
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#b7102a] hover:bg-[#db313f] text-white'
                  }`}
                >
                  {copiedAuthSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAuthSql ? 'SQL Copied to Clipboard!' : 'Copy SQL for Admin Signup and Login'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSqlAuthModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Connect Database */}
        {showDbConnectModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-3xl w-full my-8 relative">
              <button
                type="button"
                onClick={() => setShowDbConnectModal(false)}
                className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center shadow-lg border border-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <DatabaseConnector
                onConnectionChange={(connected) => {
                  if (connected) {
                    setShowDbConnectModal(false);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#000f22] pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8">
        
        {/* Admin Header Banner */}
        <div className="bg-[#000f22] text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#b7102a] flex items-center justify-center shadow-lg shrink-0">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-white/10 text-[#ffb3b1] text-[10px] font-bold tracking-widest uppercase mb-1">
                <span>Executive Management Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Caih Group Admin Portal
              </h1>
              
              {/* Logged in admin profile badge */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs text-slate-300">Signed in as:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{currentAdmin?.name || 'Administrator'}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#b7102a]/30 text-[#ffb3b1] border border-[#b7102a]/40 text-[10px] font-bold uppercase tracking-wider">
                  {currentAdmin?.role || 'Director'}
                </span>
                <span className="text-xs text-slate-400">({currentAdmin?.email})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setShowAuthModal(true);
                setAuthMode('login');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              title="Switch administrator account or log in with another profile"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch Admin Account</span>
            </button>
            <button
              onClick={() => {
                setShowAuthModal(true);
                setAuthMode('signup');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              title="Register a new administrator"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>New Admin Signup</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer"
            >
              Website
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
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

          <button
            onClick={() => setActiveTab('admins')}
            className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'admins'
                ? 'bg-[#000f22] text-white shadow-sm'
                : 'bg-white text-[#64748B] hover:bg-slate-100 hover:text-[#000f22] border border-[#E2E8F0]'
            }`}
          >
            <Users className="w-4 h-4 text-[#b7102a]" />
            <span>Admin Accounts ({adminUsers.length})</span>
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
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(p.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold transition-colors flex items-center justify-center cursor-pointer"
                      title="Delete Property"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onViewProject(p)}
                      className="px-3 py-2 rounded-xl bg-[#000f22] hover:bg-[#b7102a] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
                          onClick={async () => {
                            setInquiries(prev => prev.map(item => item.id === inq.id ? { ...item, status: 'Confirmed' } : item));
                            if (isSupabaseConfigured()) {
                              await updateInspectionStatusInSupabase(inq.id, 'Confirmed');
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold hover:bg-emerald-200 cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={async () => {
                            setInquiries(prev => prev.map(item => item.id === inq.id ? { ...item, status: 'Completed' } : item));
                            if (isSupabaseConfigured()) {
                              await updateInspectionStatusInSupabase(inq.id, 'Completed');
                            }
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

        {/* TAB 5: SUPABASE & SQL DATABASE */}
        {activeTab === 'database' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Interactive Database Connector */}
            <DatabaseConnector />

            <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-xs">
              <h3 className="font-extrabold text-sm text-[#000f22] mb-2">Seed Database</h3>
              <p className="text-xs text-slate-600 mb-4">
                Push all property and article content from the app to the database.
              </p>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to seed the database with mock content? This will overwrite existing records.')) {
                    const res = await seedDatabase();
                    alert(res.message);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Database className="w-4 h-4" />
                <span>Seed Properties & Articles</span>
              </button>
            </div>

            {/* SQL Schema Script Box with One-Click Copy */}
            <div className="bg-[#000f22] text-white rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
              {/* Tab Selector for SQL Script */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveSqlTab('auth')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      activeSqlTab === 'auth'
                        ? 'bg-[#b7102a] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Admin Signup &amp; Login SQL</span>
                  </button>
                  <button
                    onClick={() => setActiveSqlTab('full')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      activeSqlTab === 'full'
                        ? 'bg-[#b7102a] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Complete Estate Schema SQL</span>
                  </button>
                </div>

                {activeSqlTab === 'auth' ? (
                  <button
                    onClick={handleCopyAuthSql}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                      copiedAuthSql
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#b7102a] hover:bg-[#db313f] text-white'
                    }`}
                  >
                    {copiedAuthSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedAuthSql ? 'Auth SQL Copied!' : 'Copy Admin Auth SQL'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCopySchema}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                      copiedSchema
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#b7102a] hover:bg-[#db313f] text-white'
                    }`}
                  >
                    {copiedSchema ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSchema ? 'Full SQL Copied!' : 'Copy Full Schema SQL'}</span>
                  </button>
                )}
              </div>

              {activeSqlTab === 'auth' ? (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#b7102a] text-white flex items-center justify-center shrink-0">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold uppercase tracking-wide">
                        Admin Signup &amp; Login SQL Schema (src/data/adminAuthSql.ts)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Creates <code className="text-emerald-400 font-mono">public.admin_users</code>, pgcrypto bcrypt password hashing, stored procedures <code className="text-emerald-400 font-mono">admin_signup()</code> &amp; <code className="text-emerald-400 font-mono">admin_login()</code>, and auth sync triggers.
                      </p>
                    </div>
                  </div>
                  <div className="relative rounded-xl bg-[#030712] border border-slate-800 p-4 font-mono text-[11px] text-emerald-400 max-h-96 overflow-y-auto leading-relaxed">
                    <pre>{ADMIN_AUTH_SQL}</pre>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#b7102a] text-white flex items-center justify-center shrink-0">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold uppercase tracking-wide">
                        Complete Drop-in Relational Schema (supabase/schema.sql)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Creates all 8 relational tables (properties, articles, inspections, subscribers, broadcasts, realtors, inquiries, admin_users), RLS, and seed data.
                      </p>
                    </div>
                  </div>
                  <div className="relative rounded-xl bg-[#030712] border border-slate-800 p-4 font-mono text-[11px] text-emerald-400 max-h-96 overflow-y-auto leading-relaxed">
                    <pre>{SUPABASE_SCHEMA_SQL}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Database Tables Overview Cards */}
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs">
              <h4 className="text-base font-extrabold text-[#000f22] mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#b7102a]" />
                <span>Supabase Schema Entity Directory</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#b7102a]">public.properties</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Table</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Estates and developments catalog (Appleton Enclave, Appleton Court, Appleton Haven) including pricing, payment milestones, and specifications.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#b7102a]">public.inspections</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Table</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Prospective investor site walkthrough bookings submitted via the web app with phone, date, status, and target project.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#b7102a]">public.newsletter_subscribers</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Table</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Client newsletter subscriber emails with interest tags (all, diaspora, residential, plots) and acquisition sources.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#b7102a]">public.articles</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Table</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Real estate intelligence dispatches, C of O verification updates, market analyses, and infrastructure reports.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#b7102a]">public.realtor_registrations</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Table</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Realtor network partner registration applications, agency details, experience, and commission verification.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#b7102a]">public.contact_messages</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">Table</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    General corporate desk inquiries, investment proposals, and customer service requests with status tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ADMIN ACCOUNTS & ACCESS */}
        {activeTab === 'admins' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#b7102a]">
                      Governance & Security
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {adminUsers.length} Active Accounts
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#000f22]">
                    Executive Administrators Directory
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                    Authorized personnel with executive access to property management, inspection schedules, and client communications.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setShowSqlAuthModal(true)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Code2 className="w-3.5 h-3.5 text-[#b7102a]" />
                    <span>Admin Auth SQL</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setAuthMode('signup');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Register New Admin</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setAuthMode('login');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#000f22] text-xs font-bold transition-all border border-[#CBD5E1] flex items-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Switch Sign In</span>
                  </button>
                </div>
              </div>

              {/* Database & Sync Status Banner */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#b7102a] shrink-0" />
                  <span className="text-slate-700">
                    {isSupabaseConfigured()
                      ? 'Admins directory synced with Supabase PostgreSQL (public.admin_users)'
                      : 'Running in Standalone mode with local storage and built-in demo credentials. To sync to PostgreSQL, run the Admin Auth SQL.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAuthSql}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#b7102a] text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {copiedAuthSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedAuthSql ? 'Copied SQL!' : 'Copy Auth SQL'}</span>
                </button>
              </div>

              {/* Admins Table */}
              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] mt-6">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#000f22] text-white">
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Administrator</th>
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Executive Role</th>
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Email Address</th>
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Account Created</th>
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {adminUsers.map((admin) => {
                      const isCurrent = currentAdmin?.email?.toLowerCase() === admin.email?.toLowerCase();
                      const initials = admin.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <tr key={admin.id} className={`hover:bg-[#F8FAFC] transition-colors ${isCurrent ? 'bg-amber-50/40' : ''}`}>
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#000f22] text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {initials}
                              </div>
                              <div>
                                <div className="font-bold text-[#000f22] flex items-center gap-2">
                                  <span>{admin.name}</span>
                                  {isCurrent && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      Active Session
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-500">Authorized Officer</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 sm:px-6">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#b7102a]/10 text-[#b7102a] border border-[#b7102a]/20">
                              {admin.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 font-mono text-xs text-slate-700">
                            {admin.email}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-slate-600">
                            {admin.createdAt}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            {!isCurrent ? (
                              <button
                                onClick={() => {
                                  setCurrentAdmin(admin);
                                  localStorage.setItem('caih_current_admin', JSON.stringify(admin));
                                  alert(`Switched active session to ${admin.name} (${admin.role})`);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#000f22] hover:text-white text-[#000f22] text-xs font-bold transition-all cursor-pointer"
                              >
                                Switch To This Admin
                              </button>
                            ) : (
                              <span className="text-xs text-emerald-700 font-bold flex items-center justify-end gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Current</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Featured Video URL</label>
                <input
                  type="url"
                  placeholder="Optional YouTube/Vimeo URL"
                  value={editingArticle.videoUrl || ''}
                  onChange={e => setEditingArticle({ ...editingArticle, videoUrl: e.target.value })}
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
