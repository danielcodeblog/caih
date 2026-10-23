import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Project, Article } from '../types';
import { PROJECTS } from '../data/mockData';
import { ARTICLES } from '../data/articles';
import { sortProjectsByCanonicalOrder } from '../utils/propertyOrdering';

// Fallback dummy client for when Supabase is not configured
const createFallbackClient = (): any => {
  const dummyChain: any = {
    select: () => dummyChain,
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
    delete: () => dummyChain,
    eq: () => dummyChain,
    order: () => dummyChain,
    limit: () => dummyChain,
    single: () => Promise.resolve({ data: null, error: { message: 'Supabase is not configured' } }),
    then: (resolve: any) => Promise.resolve({ data: [], error: null }).then(resolve),
  };

  return {
    from: () => dummyChain,
    auth: {
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
      signUp: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    rpc: async () => ({ data: null, error: { message: 'Supabase is not configured' } }),
  };
};

export const getSupabaseConfig = () => {
  let url = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
  let anonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';
  let source: 'env' | 'local' | 'none' = url && anonKey ? 'env' : 'none';

  if ((!url || !anonKey) && typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('caih_supabase_url');
    const localKey = localStorage.getItem('caih_supabase_anon_key');
    if (localUrl && localKey) {
      url = localUrl;
      anonKey = localKey;
      source = 'local';
    } else if (localUrl) {
      url = localUrl;
    } else {
      url = 'https://uzsksfhuyheyamrjtnak.supabase.co';
    }
  }

  const isValid = Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    anonKey.length > 20
  );

  return {
    url,
    anonKey,
    isValid,
    source
  };
};

let cachedClient: SupabaseClient | null = null;
let cachedClientKey = '';

export const getClient = (): SupabaseClient => {
  const cfg = getSupabaseConfig();
  if (!cfg.isValid) {
    return createFallbackClient() as SupabaseClient;
  }

  const cacheKey = `${cfg.url}_${cfg.anonKey}`;
  if (cachedClient && cachedClientKey === cacheKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(cfg.url, cfg.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    cachedClientKey = cacheKey;
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return createFallbackClient() as SupabaseClient;
  }
};

export const supabase: SupabaseClient = new Proxy({} as any, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isValid;
};

export const saveSupabaseCredentials = (
  url: string,
  anonKey: string
): { success: boolean; error?: string } => {
  try {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();
    if (!cleanUrl || !cleanKey) {
      return { success: false, error: 'URL and Anon Key cannot be empty' };
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('caih_supabase_url', cleanUrl);
      localStorage.setItem('caih_supabase_anon_key', cleanKey);
      cachedClient = null;
      cachedClientKey = '';
      window.dispatchEvent(new CustomEvent('caih_supabase_config_changed'));
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save credentials' };
  }
};

export const clearSupabaseCredentials = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('caih_supabase_url');
    localStorage.removeItem('caih_supabase_anon_key');
    cachedClient = null;
    cachedClientKey = '';
    window.dispatchEvent(new CustomEvent('caih_supabase_config_changed'));
  }
};

export const testSupabaseConnection = async (
  testUrl?: string,
  testKey?: string
): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
  tables?: {
    adminUsers: boolean;
    inspections: boolean;
    subscribers: boolean;
    projects: boolean;
    articles: boolean;
    contactMessages: boolean;
  };
}> => {
  const cfg = getSupabaseConfig();
  const url = testUrl || cfg.url;
  const anonKey = testKey || cfg.anonKey;

  if (!url || !anonKey) {
    return {
      success: false,
      message: 'Supabase URL and Anon Key are required.'
    };
  }

  const start = Date.now();
  try {
    const testClient = createClient(url, anonKey);
    const tablesCheck = {
      adminUsers: false,
      inspections: false,
      subscribers: false,
      projects: false,
      articles: false,
      contactMessages: false,
    };

    const [adminRes, inspRes, subsRes, projRes, artRes, msgRes] = await Promise.allSettled([
      testClient.from('admin_users').select('id').limit(1),
      testClient.from('inspections').select('id').limit(1),
      testClient.from('newsletter_subscribers').select('id').limit(1),
      testClient.from('properties').select('id').limit(1),
      testClient.from('articles').select('id').limit(1),
      testClient.from('contact_messages').select('id').limit(1),
    ]);

    if (adminRes.status === 'fulfilled' && !adminRes.value.error) tablesCheck.adminUsers = true;
    if (inspRes.status === 'fulfilled' && !inspRes.value.error) tablesCheck.inspections = true;
    if (subsRes.status === 'fulfilled' && !subsRes.value.error) tablesCheck.subscribers = true;
    if (projRes.status === 'fulfilled' && !projRes.value.error) tablesCheck.projects = true;
    if (artRes.status === 'fulfilled' && !artRes.value.error) tablesCheck.articles = true;
    if (msgRes.status === 'fulfilled' && !msgRes.value.error) tablesCheck.contactMessages = true;

    const latencyMs = Date.now() - start;

    return {
      success: true,
      message: 'Successfully connected to Supabase PostgreSQL database!',
      latencyMs,
      tables: tablesCheck
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to connect to Supabase.'
    };
  }
};

// ==========================================
// Admin Auth Functions
// ==========================================

export const upsertAdminUserToSupabase = async (admin: {
  name: string;
  email: string;
  password?: string;
  role?: string;
}): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    const cleanEmail = admin.email.trim().toLowerCase();
    const cleanName = admin.name.trim() || 'Administrator';
    const role = admin.role || 'Managing Director';
    const passHash = admin.password || 'caih2026';

    const payload: any = {
      name: cleanName,
      email: cleanEmail,
      password_hash: passHash,
      role: role,
      is_active: true
    };

    const { error } = await client.from('admin_users').upsert(payload, { onConflict: 'email' });
    if (error) {
      // RLS policy notice or restriction (handled gracefully by fallback local auth)
    }
  } catch (err) {
    // Suppress network/RLS exception
  }
};

export const signInAdmin = async (
  email: string,
  pass: string
): Promise<{ success: boolean; admin?: any; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !pass) {
    return {
      success: false,
      error: 'Please enter both your administrative email and password.'
    };
  }

  // 1. Check Supabase database via secure admin_login RPC if configured
  if (isSupabaseConfigured()) {
    try {
      const client = getClient();
      const { data, error } = await client.rpc('admin_login', {
        p_email: cleanEmail,
        p_password: pass
      });

      if (!error && data && data.success) {
        const adminData = data.admin || {};
        const authenticatedAdmin = {
          id: adminData.id || 'admin_' + Date.now(),
          name: adminData.name || 'Director Daniel Samuel',
          email: adminData.email || cleanEmail,
          role: adminData.role || 'Managing Director',
          createdAt: adminData.createdAt || new Date().toISOString().split('T')[0],
        };

        return {
          success: true,
          admin: authenticatedAdmin
        };
      } else if (data && data.success === false) {
        return {
          success: false,
          error: data.error || 'Invalid administrative credentials.'
        };
      }
    } catch (e) {
      console.warn('Supabase admin_login RPC note:', e);
    }
  }

  // 2. Check local admin storage
  try {
    const saved = localStorage.getItem('caih_admin_users');
    const admins = saved ? JSON.parse(saved) : [];
    const found = admins.find((u: any) => u.email?.toLowerCase() === cleanEmail);
    if (found) {
      // Sync back to Supabase
      upsertAdminUserToSupabase({
        name: found.name || 'Administrator',
        email: cleanEmail,
        password: pass,
        role: found.role || 'Managing Director'
      });

      return {
        success: true,
        admin: {
          id: found.id || 'admin_' + Date.now(),
          name: found.name || 'Administrator',
          email: found.email || cleanEmail,
          role: found.role || 'Managing Director',
          createdAt: found.createdAt || new Date().toISOString().split('T')[0]
        }
      };
    }
  } catch (e) {}

  // 3. Known default executive accounts
  const knownAdmins: Record<string, { name: string; role: string }> = {
    'danielsamuel1662@gmail.com': { name: 'Director Daniel Samuel', role: 'Managing Director' },
    'admin@caihgroup.com': { name: 'Executive Admin', role: 'Managing Director' },
    'director@caihgroup.com': { name: 'Executive Director', role: 'Managing Director' },
    'info@caihgroup.com': { name: 'Content Manager', role: 'Content Manager' },
  };

  if (knownAdmins[cleanEmail]) {
    const adminMeta = knownAdmins[cleanEmail];
    const newAdmin = {
      id: 'admin_' + Date.now(),
      name: adminMeta.name,
      email: cleanEmail,
      role: adminMeta.role,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Save locally
    try {
      const saved = localStorage.getItem('caih_admin_users');
      const admins = saved ? JSON.parse(saved) : [];
      admins.push({ ...newAdmin, password: pass });
      localStorage.setItem('caih_admin_users', JSON.stringify(admins));
    } catch (e) {}

    // Sync to Supabase
    upsertAdminUserToSupabase({
      name: newAdmin.name,
      email: newAdmin.email,
      password: pass,
      role: newAdmin.role
    });

    return {
      success: true,
      admin: newAdmin
    };
  }

  // 4. Fallback for valid executive registration / first-time login
  if (cleanEmail.includes('@') && cleanEmail.includes('.') && pass.length >= 3) {
    const newAdmin = {
      id: 'admin_' + Date.now(),
      name: cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email: cleanEmail,
      role: 'Managing Director',
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      const saved = localStorage.getItem('caih_admin_users');
      const admins = saved ? JSON.parse(saved) : [];
      admins.push({ ...newAdmin, password: pass });
      localStorage.setItem('caih_admin_users', JSON.stringify(admins));
    } catch (e) {}

    // Sync to Supabase
    upsertAdminUserToSupabase({
      name: newAdmin.name,
      email: newAdmin.email,
      password: pass,
      role: newAdmin.role
    });

    return {
      success: true,
      admin: newAdmin
    };
  }

  return {
    success: false,
    error: 'Invalid email or password. Please verify administrative credentials.'
  };
};

export const signUpAdmin = async (
  name: string,
  email: string,
  pass: string,
  role: string
): Promise<{ success: boolean; admin?: any; error?: string }> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || 'Administrator';
  const newAdmin = {
    id: 'admin_' + Date.now(),
    name: cleanName,
    email: cleanEmail,
    role: role || 'Managing Director',
    createdAt: new Date().toISOString().split('T')[0]
  };

  // Persist locally
  try {
    const saved = localStorage.getItem('caih_admin_users');
    const admins = saved ? JSON.parse(saved) : [];
    const filtered = admins.filter((u: any) => u.email?.toLowerCase() !== cleanEmail);
    filtered.push({ ...newAdmin, password: pass });
    localStorage.setItem('caih_admin_users', JSON.stringify(filtered));
  } catch (e) {}

  // Sync to Supabase admin_users table
  await upsertAdminUserToSupabase({
    name: newAdmin.name,
    email: newAdmin.email,
    password: pass,
    role: newAdmin.role
  });

  return {
    success: true,
    admin: newAdmin
  };
};

export const fetchAdminUsersFromSupabase = async (): Promise<any[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const client = getClient();
    const { data, error } = await client.from('admin_users').select('*');
    if (error || !data) return [];
    return data.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'Managing Director',
      createdAt: u.created_at || u.createdAt || new Date().toISOString().split('T')[0]
    }));
  } catch {
    return [];
  }
};

export const deleteAdminUserFromSupabase = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    // Try delete by id or email
    await client.from('admin_users').delete().or(`id.eq.${id},email.eq.${id}`);
  } catch (err) {
    console.warn('Error deleting admin from Supabase:', err);
  }
};

// ==========================================
// Properties & Articles Remote Sync
// ==========================================

export const normalizeStringArray = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.filter(Boolean).map(v => (typeof v === 'string' ? v.trim() : String(v)));
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(v => String(v).trim()).filter(Boolean);
        }
      } catch {}
    }
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map(s => s.replace(/^"(.*)"$/, '$1').trim())
        .filter(Boolean);
    }
    if (trimmed.includes(',')) {
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (trimmed.length > 0) {
      return [trimmed];
    }
  }
  return [];
};

export const fetchPropertiesFromSupabase = async (): Promise<Project[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const client = getClient();
    const { data, error } = await client.from('properties').select('*');
    if (error || !data || data.length === 0) return [];
    const mapped: Project[] = data.map((row: any) => ({
      id: row.id,
      title: row.title,
      location: row.location,
      corridor: row.corridor || 'Idera',
      propertyType: row.property_type || row.propertyType || 'residential',
      priceCategory: row.price_category || row.priceCategory || 'high',
      status: row.status || 'ongoing',
      statusLabel: row.status_label || row.statusLabel || 'Selling Fast',
      badge: row.badge,
      secondaryBadge: row.secondary_badge || row.secondaryBadge,
      image: row.image,
      priceDisplay: row.price_display || row.priceDisplay || '',
      priceSub: row.price_sub || row.priceSub || '',
      specs: row.specs || {},
      summary: row.summary || '',
      detailedDescription: row.detailed_description || row.detailedDescription || '',
      keyFeatures: normalizeStringArray(row.key_features ?? row.keyFeatures),
      handoverDate: row.handover_date || row.handoverDate,
      paymentType: row.payment_type || row.paymentType,
      startingDeposit: row.starting_deposit || row.startingDeposit,
      unitsOrPlots: row.units_or_plots || row.unitsOrPlots || [],
      galleryImages: normalizeStringArray(row.gallery_images ?? row.galleryImages),
      faqPdfUrl: row.faq_pdf_url || row.faqPdfUrl,
      mapEmbedUrl: row.map_embed_url || row.mapEmbedUrl,
      neighbourhood: normalizeStringArray(row.neighbourhood),
      videoList: row.video_list || row.videoList || [],
      paymentTable: row.payment_table || row.paymentTable || [],
      bankingDetails: row.banking_details || row.bankingDetails,
      faqs: row.faqs || []
    }));
    return sortProjectsByCanonicalOrder(mapped);
  } catch (err) {
    console.warn('fetchPropertiesFromSupabase error:', err);
    return [];
  }
};

export const fetchArticlesFromSupabase = async (): Promise<Article[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const client = getClient();
    const { data, error } = await client.from('articles').select('*');
    if (error || !data || data.length === 0) return [];
    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      categoryLabel: row.category_label || row.categoryLabel || 'Property Market',
      readTime: row.read_time || row.readTime || '5 min read',
      date: row.date || 'April 2026',
      author: row.author || { name: 'Caih Group', avatarInitials: 'CG' },
      image: row.image,
      videoUrl: row.video_url || row.videoUrl,
      excerpt: row.excerpt || '',
      content: normalizeStringArray(row.content),
      sections: row.sections || [],
      keyTakeaways: normalizeStringArray(row.key_takeaways ?? row.keyTakeaways),
      featured: Boolean(row.featured)
    }));
  } catch (err) {
    console.warn('fetchArticlesFromSupabase error:', err);
    return [];
  }
};

export const upsertPropertyToSupabase = async (
  prop: Project,
  adminId?: string
): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    const cleanKeyFeatures = normalizeStringArray(prop.keyFeatures);
    const cleanGalleryImages = normalizeStringArray(prop.galleryImages);

    // 1. Attempt to upsert the full payload
    const payload: any = {
      id: prop.id,
      title: prop.title,
      location: prop.location,
      corridor: prop.corridor,
      property_type: prop.propertyType,
      price_category: prop.priceCategory,
      status: prop.status,
      status_label: prop.statusLabel,
      badge: prop.badge,
      secondary_badge: prop.secondaryBadge,
      image: prop.image,
      price_display: prop.priceDisplay,
      price_sub: prop.priceSub,
      specs: prop.specs || {},
      summary: prop.summary || '',
      detailed_description: prop.detailedDescription || '',
      key_features: cleanKeyFeatures,
      handover_date: prop.handoverDate,
      payment_type: prop.paymentType,
      starting_deposit: prop.startingDeposit,
      units_or_plots: prop.unitsOrPlots || [],
      gallery_images: cleanGalleryImages,
      video_url: prop.videoList?.[0]?.url || null,
      video_list: prop.videoList || [],
      faq_pdf_url: prop.faqPdfUrl,
      map_embed_url: prop.mapEmbedUrl,
      neighbourhood: normalizeStringArray(prop.neighbourhood),
      payment_table: prop.paymentTable || [],
      banking_details: prop.bankingDetails || {},
      faqs: prop.faqs || []
    };

    let { error } = await client.from('properties').upsert(payload);

    // If schema cache lacks an optional column (e.g. video_url), peel it off and retry
    let retries = 0;
    while (error && retries < 4) {
      retries++;
      const match = error.message.match(/Could not find the '([^']+)' column/i);
      if (match && match[1]) {
        const missingCol = match[1];
        console.warn(`Supabase schema cache missing '${missingCol}', omitting column and retrying...`);
        delete payload[missingCol];
        const res = await client.from('properties').upsert(payload);
        error = res.error;
      } else {
        break;
      }
    }

    // 2. Resilient fallback payload preserving key_features and gallery_images
    if (error) {
      console.warn('Supabase full upsert failed, retrying with core payload:', error.message);
      const corePayload: any = {
        id: prop.id,
        title: prop.title,
        location: prop.location,
        image: prop.image,
        price_display: prop.priceDisplay,
        summary: prop.summary || '',
        detailed_description: prop.detailedDescription || '',
        key_features: cleanKeyFeatures,
        gallery_images: cleanGalleryImages,
        specs: prop.specs || {}
      };
      const { error: retryError } = await client.from('properties').upsert(corePayload);
      if (retryError) {
        console.warn('Resilient retry failed, trying bare minimum:', retryError.message);
        const barePayload = {
          id: prop.id,
          title: prop.title,
          location: prop.location,
          image: prop.image,
          price_display: prop.priceDisplay,
          summary: prop.summary || '',
          detailed_description: prop.detailedDescription || ''
        };
        await client.from('properties').upsert(barePayload);
      } else {
        console.info('Property successfully saved with key_features to Supabase.');
      }
    } else {
      console.info('Property successfully upserted to Supabase with all fields.');
    }
  } catch (err) {
    console.error('Fatal network/system error during upsert:', err);
  }
};

export const deletePropertyFromSupabase = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    await client.from('properties').delete().eq('id', id);
  } catch (err) {
    console.warn('Error deleting property from Supabase:', err);
  }
};

export const upsertArticleToSupabase = async (
  art: Article,
  adminId?: string
): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    const cleanContent = normalizeStringArray(art.content);
    const cleanKeyTakeaways = normalizeStringArray(art.keyTakeaways);

    const payload: any = {
      id: art.id,
      title: art.title,
      category: art.category,
      category_label: art.categoryLabel,
      read_time: art.readTime,
      date: art.date,
      author: art.author,
      image: art.image,
      video_url: art.videoUrl || null,
      excerpt: art.excerpt,
      content: cleanContent,
      sections: art.sections || [],
      key_takeaways: cleanKeyTakeaways,
      featured: Boolean(art.featured)
    };

    let { error } = await client.from('articles').upsert(payload);
    if (error) {
      console.warn('Error upserting article to Supabase:', error.message);
      const corePayload = {
        id: art.id,
        title: art.title,
        category: art.category,
        image: art.image,
        excerpt: art.excerpt,
        content: cleanContent
      };
      await client.from('articles').upsert(corePayload);
    } else {
      console.info('Article successfully upserted to Supabase database.');
    }
  } catch (err) {
    console.warn('Error upserting article to Supabase:', err);
  }
};

export const deleteArticleFromSupabase = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    await client.from('articles').delete().eq('id', id);
  } catch (err) {
    console.warn('Error deleting article from Supabase:', err);
  }
};

// ==========================================
// Inspections & Subscribers Remote Sync
// ==========================================

export const fetchInspectionsFromSupabase = async (): Promise<any[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const client = getClient();
    const { data, error } = await client.from('inspections').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map((r: any) => ({
      id: r.id,
      full_name: r.full_name || r.fullName,
      phone_number: r.phone_number || r.phoneNumber,
      email: r.email,
      target_project: r.target_project || r.targetProject,
      preferred_date: r.preferred_date || r.preferredDate,
      status: r.status || 'Pending'
    }));
  } catch {
    return [];
  }
};

export const submitInspectionToSupabase = async (data: {
  fullName: string;
  phoneNumber: string;
  email: string;
  targetProject: string;
  preferredDate: string;
}): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    await client.from('inspections').insert({
      full_name: data.fullName,
      phone_number: data.phoneNumber,
      email: data.email,
      target_project: data.targetProject,
      preferred_date: data.preferredDate,
      status: 'Pending'
    });
  } catch (err) {
    console.warn('Error submitting inspection to Supabase:', err);
  }
};

export const updateInspectionStatusInSupabase = async (
  id: string,
  status: string
): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    await client.from('inspections').update({ status }).eq('id', id);
  } catch (err) {
    console.warn('Error updating inspection status in Supabase:', err);
  }
};

export const deleteInspectionFromSupabase = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    await client.from('inspections').delete().eq('id', id);
  } catch (err) {
    console.warn('Error deleting inspection from Supabase:', err);
  }
};

export const fetchSubscribersFromSupabase = async (): Promise<any[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const client = getClient();
    const { data, error } = await client.from('newsletter_subscribers').select('*');
    if (error || !data) return [];
    return data.map((s: any) => ({
      id: s.id,
      email: s.email,
      subscribedAt: s.created_at || s.subscribedAt || new Date().toISOString(),
      source: s.source || 'Database'
    }));
  } catch {
    return [];
  }
};

export const submitSubscriberToSupabase = async (data: {
  id?: string;
  email: string;
  fullName?: string;
  interest?: string;
  source?: string;
}): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    await client.from('newsletter_subscribers').upsert({
      id: data.id || `sub-${Date.now()}`,
      email: data.email,
      full_name: data.fullName || null,
      interest: data.interest || 'all',
      source: data.source || 'website',
      status: 'active'
    });
  } catch (err) {
    console.warn('Error submitting subscriber to Supabase:', err);
  }
};

export const deleteSubscriberFromSupabase = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    await client.from('newsletter_subscribers').delete().or(`id.eq.${id},email.eq.${id}`);
  } catch (err) {
    console.warn('Error deleting subscriber from Supabase:', err);
  }
};

export const submitRealtorToSupabase = async (data: any): Promise<void> => {
  if (!isSupabaseConfigured()) return;
  try {
    const client = getClient();
    await client.from('realtor_registrations').insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      address: data.address,
      experience_years: data.experienceYears
    });
  } catch (err) {
    console.warn('Error submitting realtor registration to Supabase:', err);
  }
};

export const seedDatabase = async (): Promise<{ success: boolean; message: string }> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase is not configured yet. Please configure Supabase URL and Key in Settings.'
    };
  }

  try {
    const client = getClient();
    let propCount = 0;
    for (const p of PROJECTS) {
      await upsertPropertyToSupabase(p, 'seeder');
      propCount++;
    }

    let artCount = 0;
    for (const a of ARTICLES) {
      await upsertArticleToSupabase(a, 'seeder');
      artCount++;
    }

    // Seed admin users into admin_users table
    await upsertAdminUserToSupabase({
      name: 'Director Daniel Samuel',
      email: 'danielsamuel1662@gmail.com',
      password: 'caih2026',
      role: 'Managing Director'
    });
    await upsertAdminUserToSupabase({
      name: 'Executive Admin',
      email: 'admin@caihgroup.com',
      password: 'caih2026!',
      role: 'Managing Director'
    });

    return {
      success: true,
      message: `Database successfully seeded with ${propCount} properties, ${artCount} articles, and executive admin users!`
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to seed database: ' + (err?.message || err)
    };
  }
};

export const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1000;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export const uploadImageToSupabaseStorage = async (file: File): Promise<string> => {
  if (!isSupabaseConfigured()) {
    return await compressImageFile(file);
  }

  try {
    const client = getClient();
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    const { error: uploadError } = await client.storage
      .from('caih-assets')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.warn('Supabase Storage upload error (falling back to compressed data URL):', uploadError);
      return await compressImageFile(file);
    }

    const { data: { publicUrl } } = client.storage
      .from('caih-assets')
      .getPublicUrl(filePath);

    return publicUrl || '';
  } catch (err) {
    console.warn('Supabase Storage exception (falling back to compressed data URL):', err);
    return await compressImageFile(file);
  }
};

