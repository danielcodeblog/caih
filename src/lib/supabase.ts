import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => !!supabaseUrl && !!supabaseAnonKey;
export const fetchPropertiesFromSupabase = async () => [];
export const fetchArticlesFromSupabase = async () => [];
export const submitRealtorToSupabase = async (data: any) => {};
export const fetchInspectionsFromSupabase = async () => [];
export const fetchSubscribersFromSupabase = async () => [];
export const upsertPropertyToSupabase = async (prop: any, adminId: string | undefined) => {};
export const deletePropertyFromSupabase = async (id: string) => {};
export const deleteArticleFromSupabase = async (id: string) => {};
export const upsertArticleToSupabase = async (art: any, adminId: string | undefined) => {};
export const deleteSubscriberFromSupabase = async (id: string) => {};
export const deleteInspectionFromSupabase = async (id: string) => {};
export const seedDatabase = async () => {};
export const signInAdmin = async (email: string, pass: string) => ({ success: true });
export const signUpAdmin = async (name: string, email: string, pass: string, role: string) => ({ success: true });
export const fetchAdminUsersFromSupabase = async () => [];
export const deleteAdminUserFromSupabase = async (id: string) => {};
export const updateInspectionStatusInSupabase = async (id: string, status: string) => {};
export const submitSubscriberToSupabase = async (data: any) => {};
export const submitInspectionToSupabase = async (data: any) => {};
export const getSupabaseConfig = () => ({});
export const saveSupabaseCredentials = () => {};
export const clearSupabaseCredentials = () => {};
export const testSupabaseConnection = async () => true;
