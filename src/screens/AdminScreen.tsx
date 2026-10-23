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
  KeyRound,
  UserPlus,
  Star,
  Layers,
  Video,
  MapPin,
  Tag,
  SlidersHorizontal,
  Image as ImageIcon
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
  updateInspectionStatusInSupabase,
  supabase
} from '../lib/supabase';
import { DatabaseConnector } from '../components/DatabaseConnector';
import { SUPABASE_SCHEMA_SQL } from '../data/supabaseSchema';
import { ADMIN_AUTH_SQL } from '../data/adminAuthSql';
import { APPLETON_GARDENS_PROPERTY_SQL } from '../data/appletonGardensSql';
import { AdminPropertyModal } from '../components/AdminPropertyModal';
import { AdminArticleModal } from '../components/AdminArticleModal';
import {
  getStoredProjects,
  saveStoredProjects,
  addOrUpdateProject,
  deleteStoredProject
} from '../utils/projectsStore';
import { sortProjectsByCanonicalOrder } from '../utils/propertyOrdering';
import {
  getStoredArticles,
  saveStoredArticles,
  addOrUpdateArticle,
  deleteStoredArticle
} from '../utils/articlesStore';

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
  projects: Project[];
  articles?: Article[];
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
  projects: passedProjects,
  articles: passedArticles,
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
  const [isRefreshingDb, setIsRefreshingDb] = useState(false);

  const handleRefreshFromDatabase = async () => {
    setIsRefreshingDb(true);
    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured yet. Please configure Supabase in settings.');
      setIsRefreshingDb(false);
      return;
    }
    try {
      const [dbAdmins, dbProps, dbArticles, dbInqs, dbSubs] = await Promise.all([
        fetchAdminUsersFromSupabase(),
        fetchPropertiesFromSupabase(),
        fetchArticlesFromSupabase(),
        fetchInspectionsFromSupabase(),
        fetchSubscribersFromSupabase()
      ]);

      if (dbAdmins && dbAdmins.length > 0) {
        setAdminUsers(dbAdmins.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          password: '••••••••',
          role: u.role,
          createdAt: u.createdAt || new Date().toISOString().split('T')[0],
        })));
      }
      if (dbProps && dbProps.length > 0) setProjectsList(dbProps);
      if (dbArticles && dbArticles.length > 0) setArticlesList(dbArticles);
      if (dbInqs && dbInqs.length > 0) {
        setInquiries(dbInqs.map((r: any) => ({
          id: r.id || 'INQ-' + Math.random().toString().slice(2, 6),
          fullName: r.full_name,
          phone: r.phone_number,
          email: r.email,
          project: r.target_project,
          date: r.preferred_date,
          status: r.status || 'Pending'
        })));
      }
      if (dbSubs && dbSubs.length > 0) {
        setSubscribers(dbSubs.map((s: any) => ({
          email: s.email,
          joinedDate: (s.subscribedAt || '').split('T')[0] || new Date().toISOString().split('T')[0],
          source: s.source || 'Database'
        })));
      }
      alert('Dashboard successfully fetched fresh records from Supabase PostgreSQL database!');
    } catch (err: any) {
      alert('Error fetching from database: ' + (err?.message || err));
    } finally {
      setIsRefreshingDb(false);
    }
  };

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Content Manager');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) {
      alert('Please fill in all password fields.');
      return;
    }
    if (newPasswordInput !== confirmNewPasswordInput) {
      alert('New passwords do not match.');
      return;
    }
    if (newPasswordInput.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    setAdminUsers(prev => prev.map(u => {
      if (u.email?.toLowerCase() === currentAdmin?.email?.toLowerCase()) {
        return { ...u, password: newPasswordInput };
      }
      return u;
    }));

    if (currentAdmin) {
      const updated = { ...currentAdmin, password: newPasswordInput };
      setCurrentAdmin(updated);
      localStorage.setItem('caih_current_admin', JSON.stringify(updated));
    }

    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmNewPasswordInput('');
    setShowChangePasswordModal(false);
    alert('Password updated successfully!');
  };

  const handleAddDashboardAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    const newAdmin: AdminUser = {
      id: 'admin_' + Date.now(),
      name: newAdminName.trim(),
      email: newAdminEmail.trim().toLowerCase(),
      password: newAdminPassword,
      role: newAdminRole,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAdminUsers(prev => [newAdmin, ...prev]);
    if (isSupabaseConfigured()) {
      await signUpAdmin(newAdmin.name, newAdmin.email, newAdmin.password, newAdmin.role);
    }

    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPassword('');
    setShowAddAdminModal(false);
    alert(`Successfully added new administrator / content manager: ${newAdmin.name} (${newAdmin.role})`);
  };

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

  const handleLoginSubmit = async (cleanEmail: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setAuthSuccessMessage(null);
    setIsSubmittingAuth(true);

    const email = cleanEmail.trim().toLowerCase();
    if (!email || !pass) {
      setIsSubmittingAuth(false);
      return { success: false, error: 'Please enter both your administrative email and password.' };
    }

    try {
      const result = await signInAdmin(email, pass);
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
        return { success: true };
      }
      setIsSubmittingAuth(false);
      return { success: false, error: result.error || 'Authentication failed. Check your credentials.' };
    } catch (err: any) {
      setIsSubmittingAuth(false);
      return { success: false, error: 'Authentication service unavailable.' };
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await handleLoginSubmit(loginEmail, loginPassword);
    if (!res.success) {
      setAuthError(res.error || 'Authentication failed.');
    }
  };

  const handleSignupSubmit = async (cleanName: string, cleanEmail: string, pass: string, role: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setAuthSuccessMessage(null);
    setIsSubmittingAuth(true);

    const email = cleanEmail.trim().toLowerCase();
    const name = cleanName.trim();

    if (!name || !email || !pass) {
      setIsSubmittingAuth(false);
      return { success: false, error: 'Please fill in all required registration fields.' };
    }

    if (pass.length < 6) {
      setIsSubmittingAuth(false);
      return { success: false, error: 'Password must be at least 6 characters in length.' };
    }

    try {
      const result = await signUpAdmin(name, email, pass, role);
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
        setIsSubmittingAuth(false);
        setAuthBackendNotice('Registered and authenticated via Supabase');
        return { success: true };
      }
      setIsSubmittingAuth(false);
      return { success: false, error: result.error || 'Registration failed.' };
    } catch (err: any) {
      setIsSubmittingAuth(false);
      return { success: false, error: 'Registration service unavailable.' };
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match. Please re-enter.');
      return;
    }
    const res = await handleSignupSubmit(signupName, signupEmail, signupPassword, signupRole);
    if (!res.success) {
      setAuthError(res.error || 'Registration failed.');
    }
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

  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'blog' | 'newsletter' | 'inquiries' | 'admins'>('dashboard');
  const [activeSqlTab, setActiveSqlTab] = useState<'auth' | 'full' | 'appleton'>('appleton');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedAppletonSql, setCopiedAppletonSql] = useState(false);
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

  const handleCopyAppletonSql = async () => {
    try {
      await navigator.clipboard.writeText(APPLETON_GARDENS_PROPERTY_SQL);
      setCopiedAppletonSql(true);
      setTimeout(() => setCopiedAppletonSql(false), 3000);
    } catch (e) {
      setCopiedAppletonSql(true);
      setTimeout(() => setCopiedAppletonSql(false), 3000);
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
  const [projectsList, setProjectsList] = useState<Project[]>(() =>
    Array.isArray(passedProjects) && passedProjects.length > 0 ? passedProjects : getStoredProjects()
  );

  useEffect(() => {
    if (!passedProjects || passedProjects.length === 0) {
      const projects = getStoredProjects();
      setProjectsList(projects);
    }
  }, [passedProjects]);

  // Articles state initialized from localStorage
  const [articlesList, setArticlesList] = useState<Article[]>(() => {
    return passedArticles && passedArticles.length > 0 ? passedArticles : getStoredArticles();
  });

  useEffect(() => {
    if (passedProjects && passedProjects.length > 0) {
      setProjectsList(passedProjects);
    }
  }, [passedProjects]);

  useEffect(() => {
    if (passedArticles && passedArticles.length > 0) {
      setArticlesList(passedArticles);
    }
  }, [passedArticles]);

  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [propertyFilterStatus, setPropertyFilterStatus] = useState('all');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [articleFilterCategory, setArticleFilterCategory] = useState('all');

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

  // New Subscriber manual input
  const [newSubEmail, setNewSubEmail] = useState('');

  // Editing Project Modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  useEffect(() => {
    localStorage.setItem('caih_admin_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem('caih_admin_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const handleCreateNewProject = () => {
    const newProj: Project = {
      id: 'prop-' + Date.now(),
      title: '',
      location: '',
      corridor: 'Idera / Lekki-Epe Expressway',
      propertyType: 'residential',
      priceCategory: 'mid',
      status: 'ongoing',
      statusLabel: 'Selling Fast',
      badge: 'Featured',
      secondaryBadge: 'Governor’s Consent',
      image: '/images/appleton_court_exterior_real.jpg',
      galleryImages: [
        '/images/appleton_court_exterior_real.jpg',
        '/images/appleton_court_interior_living.jpg'
      ],
      priceDisplay: '',
      priceSub: '12 Months Flexible Milestone Spread',
      paymentType: 'Flexible Milestone Spread',
      handoverDate: 'December 2026',
      startingDeposit: '₦10,000,000',
      specs: {
        beds: 4,
        baths: 4,
        area: '320 sqm',
        units: 12,
        landType: '100% Dry Table Land',
        titleType: 'Governor’s Consent'
      },
      summary: '',
      detailedDescription: '',
      keyFeatures: [
        '24/7 Solar & Grid Power',
        'Smart Home Automation',
        'Armed Security Personnel',
        'Treated Potable Water Supply',
        'Paved Interlocked Roads & Drainage'
      ],
      neighbourhood: [
        'Alaro City & Free Trade Zone Axis',
        'Pan-Atlantic University',
        'Proposed Lekki Airport'
      ]
    };
    setEditingProject(newProj);
    setIsCreatingProject(true);
  };

  const handleSaveProjectModal = async (savedProject: Project) => {
    const updated = await addOrUpdateProject(savedProject);
    setProjectsList(updated);
    if (isSupabaseConfigured()) {
      await upsertPropertyToSupabase(savedProject, currentAdmin?.id);
      setDeleteNotice(`Property "${savedProject.title}" saved and synced to Supabase database!`);
    } else {
      setDeleteNotice(`Property "${savedProject.title}" saved locally. (Database not connected - configure in Database tab to sync).`);
    }
    setEditingProject(null);
    setIsCreatingProject(false);
  };

  // In-app Delete Confirmation Modal State
  interface DeleteTarget {
    type: 'property' | 'article' | 'subscriber' | 'inquiry' | 'admin';
    id: string;
    name: string;
  }
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'property') {
        const updated = await deleteStoredProject(deleteTarget.id);
        setProjectsList(updated);
        if (isSupabaseConfigured()) {
          await deletePropertyFromSupabase(deleteTarget.id);
        }
        setDeleteNotice(`Successfully deleted property: "${deleteTarget.name}"`);
      } else if (deleteTarget.type === 'article') {
        const updated = deleteStoredArticle(deleteTarget.id);
        setArticlesList(updated);
        if (isSupabaseConfigured()) {
          await deleteArticleFromSupabase(deleteTarget.id);
        }
        setDeleteNotice(`Successfully deleted article: "${deleteTarget.name}"`);
      } else if (deleteTarget.type === 'subscriber') {
        const updated = subscribers.filter(s => s.email !== deleteTarget.id);
        setSubscribers(updated);
        localStorage.setItem('caih_admin_subscribers', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          await deleteSubscriberFromSupabase(deleteTarget.id);
        }
        setDeleteNotice(`Removed ${deleteTarget.name} from subscriber list`);
      } else if (deleteTarget.type === 'inquiry') {
        const updated = inquiries.filter(item => item.id !== deleteTarget.id);
        setInquiries(updated);
        localStorage.setItem('caih_admin_inquiries', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          await deleteInspectionFromSupabase(deleteTarget.id);
        }
        setDeleteNotice(`Removed inspection inquiry for ${deleteTarget.name}`);
      } else if (deleteTarget.type === 'admin') {
        const updated = adminUsers.filter(u => u.id !== deleteTarget.id);
        setAdminUsers(updated);
        localStorage.setItem('caih_admin_users', JSON.stringify(updated));
        if (isSupabaseConfigured()) {
          await deleteAdminUserFromSupabase(deleteTarget.id);
        }
        setDeleteNotice(`Removed team account: ${deleteTarget.name}`);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      setDeleteNotice(`Delete operation encountered an issue: ${err.message || 'Error'}`);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
      if (editingProject && editingProject.id === deleteTarget?.id) {
        setEditingProject(null);
        setIsCreatingProject(false);
      }
      if (editingArticle && editingArticle.id === deleteTarget?.id) {
        setEditingArticle(null);
        setIsCreatingArticle(false);
      }
      setTimeout(() => setDeleteNotice(null), 4500);
    }
  };

  const handleDeleteProperty = (projectId: string) => {
    const p = projectsList.find(item => item.id === projectId);
    setDeleteTarget({
      type: 'property',
      id: projectId,
      name: p?.title || 'Property Listing'
    });
  };

  const handleCreateNewArticle = () => {
    const newArt: Article = {
      id: 'article-' + Date.now(),
      title: '',
      category: 'property-market',
      categoryLabel: 'Property Market',
      readTime: '5 min read',
      date: 'April 2026',
      author: {
        name: currentAdmin?.name || 'Caih Group',
        avatarInitials: 'CG',
        role: currentAdmin?.role || 'Research & Advisory Desk'
      },
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      excerpt: '',
      content: [
        'The Lagos real estate landscape continues to experience transformative infrastructure-driven capital appreciation along the Lekki-Epe expressway.'
      ],
      sections: [],
      keyTakeaways: ['High capital appreciation potential', 'Verified title documentation (Governor’s Consent / C of O)'],
      featured: true
    };
    setEditingArticle(newArt);
    setIsCreatingArticle(true);
  };

  const handleSaveArticleModal = async (savedArticle: Article) => {
    const updated = addOrUpdateArticle(savedArticle);
    setArticlesList(updated);
    if (isSupabaseConfigured()) {
      await upsertArticleToSupabase(savedArticle, currentAdmin?.id);
    }
    setEditingArticle(null);
    setIsCreatingArticle(false);
  };

  const handleDeleteArticle = (articleId: string) => {
    const a = articlesList.find(item => item.id === articleId);
    setDeleteTarget({
      type: 'article',
      id: articleId,
      name: a?.title || 'Blog Article'
    });
  };

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim() || !newSubEmail.includes('@')) return;
    const res = subscribeClient(newSubEmail.trim(), '', 'all', 'manual');
    setSubscribers(prev => [...prev, { email: newSubEmail.trim(), joinedDate: new Date().toISOString().split('T')[0], source: 'manual' }]);
    setNewSubEmail('');
    setDeleteNotice(res.message);
    setTimeout(() => setDeleteNotice(null), 4500);
  };

  const handleDeleteSubscriber = (email: string) => {
    setDeleteTarget({
      type: 'subscriber',
      id: email,
      name: email
    });
  };

  const handleDeleteInquiry = (id: string) => {
    const inq = inquiries.find(item => item.id === id);
    setDeleteTarget({
      type: 'inquiry',
      id: id,
      name: inq ? `${inq.fullName} (${inq.project})` : 'Inspection Inquiry'
    });
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

  // If not logged in or auth modal requested, show Executive Admin Login / Signup portal
  if (!isAdminLoggedIn || showAuthModal) {
    return (
      <div className="min-h-screen bg-[#000f22] text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient subtle glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#b7102a]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with Return to website & close if already logged in */}
        <div className="w-full max-w-xl flex items-center justify-between mb-6 z-10">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>Return to Caih Group Website</span>
          </button>

          {isAdminLoggedIn && (
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            >
              <X className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          )}
        </div>

        {/* Main Admin Card */}
        <div className="w-full max-w-xl bg-[#0A1A2F]/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-black/20 mb-3 border border-slate-700/30">
              <img src="/images/cropped-Caih-icon-270x270.png" alt="Caih Group Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Caih Group Admin Console
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Restricted access for authorized personnel.
            </p>
          </div>



          {/* Error & Success Messages */}
          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{authError}</span>
              </div>
            </div>
          )}

          {authSuccessMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{authSuccessMessage}</span>
              </div>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Administrative Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@caihgroup.com"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#b7102a] focus:ring-1 focus:ring-[#b7102a] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#b7102a] focus:ring-1 focus:ring-[#b7102a] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>



              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full py-3.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white font-bold text-sm transition-all shadow-lg shadow-[#b7102a]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingAuth ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Database Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Access Executive Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}




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
            <div className="h-14 px-3.5 rounded-2xl bg-white flex items-center justify-center shadow-lg shrink-0">
              <img src="/images/cropped-Caih-icon-270x270.png" alt="Caih Group Logo" className="h-9 w-auto object-contain" />
            </div>
            <div>
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
            <span>Dashboard</span>
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
            <span>Properties ({projectsList.length})</span>
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
            <span>Blog &amp; Content ({articlesList.length})</span>
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
            <span>Subscribers ({subscribers.length})</span>
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
            <span>Inquiries ({inquiries.length})</span>
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
            <span>Team Accounts ({adminUsers.length})</span>
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
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">Subscribers</span>
                  <div className="text-3xl font-black text-[#000f22] mt-1">{subscribers.length}</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#b7102a] flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">Bookings & Inquiries</span>
                  <div className="text-3xl font-black text-[#000f22] mt-1">{inquiries.length}</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">System Status</span>
                  <div className={`text-3xl font-black mt-1 ${isSupabaseConfigured() ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {isSupabaseConfigured() ? 'Live' : 'Demo Mode'}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSupabaseConfigured() ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 shadow-xs">
                <h3 className="font-extrabold text-base text-[#000f22] mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#b7102a]" />
                  <span>Manage Properties</span>
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
                    <span>Send Newsletter</span>
                  </h3>
                  <p className="text-xs text-[#64748B] mb-4">
                    Send updates or announcements to all {subscribers.length} subscribers.
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
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCreateNewProject}
                  className="px-4 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Property</span>
                </button>
                <div className="text-xs font-bold text-[#b7102a] bg-[#FFF1F2] px-3 py-2.5 rounded-xl border border-[#FFE4E6]">
                  Total Listings: {projectsList.length}
                </div>
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



        {/* TAB 6: ADMIN ACCOUNTS & ACCESS */}
        {activeTab === 'admins' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#b7102a]">
                      Team Access
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {adminUsers.length} Active Accounts
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#000f22]">
                    Team Members
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                    Manage admin accounts, content managers, and team permissions.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Change Password</span>
                  </button>
                  <button
                    onClick={() => setShowAddAdminModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Team Member</span>
                  </button>
                </div>


              </div>



              {/* Admins Table */}
              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] mt-6">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#000f22] text-white">
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Name</th>
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Role</th>
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Email Address</th>
                      <th className="py-3.5 px-4 sm:px-6 font-bold uppercase tracking-wider">Joined</th>
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
                                <span className="text-[11px] text-slate-500">Authorized User</span>
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
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setCurrentAdmin(admin);
                                    localStorage.setItem('caih_current_admin', JSON.stringify(admin));
                                    setDeleteNotice(`Switched active session to ${admin.name} (${admin.role})`);
                                    setTimeout(() => setDeleteNotice(null), 3500);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#000f22] hover:text-white text-[#000f22] text-xs font-bold transition-all cursor-pointer"
                                >
                                  Switch Account
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ type: 'admin', id: admin.id, name: `${admin.name} (${admin.email})` })}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                                  title="Remove Team Account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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

      {/* Executive Property Creation & Editing Modal */}
      <AdminPropertyModal
        isOpen={Boolean(editingProject)}
        isCreating={isCreatingProject}
        project={editingProject}
        onClose={() => {
          setEditingProject(null);
          setIsCreatingProject(false);
        }}
        onSave={handleSaveProjectModal}
        onDelete={handleDeleteProperty}
      />

      {/* Executive Blog Post & Article Creation / Editing Modal */}
      <AdminArticleModal
        isOpen={Boolean(editingArticle)}
        isCreating={isCreatingArticle}
        article={editingArticle}
        onClose={() => {
          setEditingArticle(null);
          setIsCreatingArticle(false);
        }}
        onSave={handleSaveArticleModal}
        onDelete={handleDeleteArticle}
      />

      {/* Add Administrator / Content Manager Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b7102a] text-white flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#000f22]">Add New Administrator</h3>
                  <p className="text-xs text-slate-500">Grant admin or content manager access to the platform</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDashboardAdmin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={e => setNewAdminName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  placeholder="manager@caihgroup.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Role / Access Title</label>
                <select
                  value={newAdminRole}
                  onChange={e => setNewAdminRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30 bg-white"
                >
                  <option value="Content Manager">Content Manager</option>
                  <option value="Managing Director">Managing Director</option>
                  <option value="Investment Director">Investment Director</option>
                  <option value="Senior Asset Manager">Senior Asset Manager</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Chief Technology Officer">Chief Technology Officer</option>
                  <option value="General Legal Counsel">General Legal Counsel</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={newAdminPassword}
                  onChange={e => setNewAdminPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#000f22] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#000f22]">Change Password</h3>
                  <p className="text-xs text-slate-500">Update your account login password</p>
                </div>
              </div>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPasswordInput}
                  onChange={e => setCurrentPasswordInput(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={e => setNewPasswordInput(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmNewPasswordInput}
                  onChange={e => setConfirmNewPasswordInput(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#000f22] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal In-App Delete Confirmation Modal (Guaranteed to work in iframe & mobile) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-red-100">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#000f22]">Confirm Deletion</h3>
                <span className="text-xs uppercase tracking-wider font-bold text-red-600">
                  {deleteTarget.type === 'property' && 'Property Listing'}
                  {deleteTarget.type === 'article' && 'Blog Article'}
                  {deleteTarget.type === 'subscriber' && 'Newsletter Contact'}
                  {deleteTarget.type === 'inquiry' && 'Inspection Inquiry'}
                  {deleteTarget.type === 'admin' && 'Team Member Account'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6">
              Are you sure you want to permanently delete <strong className="text-[#000f22]">"{deleteTarget.name}"</strong>?
              This will remove it from the website catalog, local storage, and database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#000f22] text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Dashboard Feedback Notification Toast */}
      {deleteNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000f22] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{deleteNotice}</span>
          <button
            onClick={() => setDeleteNotice(null)}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
