import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Key,
  Globe,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  Server,
  FileCode2,
  Activity
} from 'lucide-react';
import {
  getSupabaseConfig,
  isSupabaseConfigured,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection
} from '../lib/supabase';
import { ADMIN_AUTH_SQL } from '../data/adminAuthSql';
import { SUPABASE_SCHEMA_SQL } from '../data/supabaseSchema';

interface DatabaseConnectorProps {
  onConnectionChange?: (connected: boolean) => void;
  compact?: boolean;
}

export const DatabaseConnector: React.FC<DatabaseConnectorProps> = ({
  onConnectionChange,
  compact = false
}) => {
  const [config, setConfig] = useState(getSupabaseConfig());
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    tables?: {
      adminUsers: boolean;
      inspections: boolean;
      subscribers: boolean;
      projects: boolean;
      contactMessages: boolean;
    };
  } | null>(null);

  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeSqlTab, setActiveSqlTab] = useState<'auth' | 'full'>('auth');

  // Load existing configuration on mount & listen to changes
  useEffect(() => {
    const refreshConfig = () => {
      const cfg = getSupabaseConfig();
      setConfig(cfg);
      if (cfg.url && !urlInput) setUrlInput(cfg.url);
      if (cfg.anonKey && !keyInput) setKeyInput(cfg.anonKey);
    };

    refreshConfig();

    const handleConfigChange = () => {
      refreshConfig();
      if (onConnectionChange) {
        onConnectionChange(isSupabaseConfigured());
      }
    };

    window.addEventListener('caih_supabase_config_changed', handleConfigChange);
    return () => {
      window.removeEventListener('caih_supabase_config_changed', handleConfigChange);
    };
  }, [onConnectionChange, urlInput, keyInput]);

  const handleTest = async () => {
    const testUrl = urlInput.trim() || config.url;
    const testKey = keyInput.trim() || config.anonKey;

    if (!testUrl || !testKey) {
      setTestResult({
        success: false,
        message: 'Please provide both the Supabase Project URL and Anon Public Key.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testSupabaseConnection(testUrl, testKey);
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAndConnect = async () => {
    const cleanUrl = urlInput.trim();
    const cleanKey = keyInput.trim();

    if (!cleanUrl || !cleanKey) {
      setTestResult({
        success: false,
        message: 'Project URL and Anon Key cannot be empty.'
      });
      return;
    }

    // Run a test first
    setIsTesting(true);
    const testRes = await testSupabaseConnection(cleanUrl, cleanKey);
    setIsTesting(false);
    setTestResult(testRes);

    if (testRes.success) {
      const saveRes = saveSupabaseCredentials(cleanUrl, cleanKey);
      if (saveRes.success) {
        setConfig(getSupabaseConfig());
        setSavedNotice('Database credentials saved & connected successfully!');
        setTimeout(() => setSavedNotice(null), 4000);
        if (onConnectionChange) {
          onConnectionChange(true);
        }
      } else {
        setSavedNotice(`Error saving: ${saveRes.error}`);
      }
    }
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect from Supabase? The app will operate in local offline mode.')) {
      clearSupabaseCredentials();
      setUrlInput('');
      setKeyInput('');
      setTestResult(null);
      setConfig(getSupabaseConfig());
      setSavedNotice('Database disconnected. Using local browser state.');
      setTimeout(() => setSavedNotice(null), 3000);
      if (onConnectionChange) {
        onConnectionChange(false);
      }
    }
  };

  const handleCopySql = () => {
    const sql = activeSqlTab === 'auth' ? ADMIN_AUTH_SQL : SUPABASE_SCHEMA_SQL;
    navigator.clipboard.writeText(sql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const isConfigured = config.isValid;

  return (
    <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Banner & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isConfigured
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                PostgreSQL Connection Manager
              </span>
              {isConfigured ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Connected ({config.source === 'local' ? 'Custom Session' : 'Vite Env'})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  Disconnected (Offline Storage Active)
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#000f22]">
              Connect App to Supabase Database
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Enter your Supabase project credentials below to enable live cloud persistence for admin accounts, client bookings, property listings, and newsletters.
            </p>
          </div>
        </div>

        {/* Dashboard Link & Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#000f22] text-xs font-bold transition-all border border-[#CBD5E1] flex items-center gap-1.5 cursor-pointer"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {isConfigured && (
            <button
              onClick={handleDisconnect}
              className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all border border-red-200 flex items-center gap-1.5 cursor-pointer"
              title="Disconnect Database"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Connection Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#F8FAFC] p-5 sm:p-6 rounded-2xl border border-[#E2E8F0]">
        {/* Project URL */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#b7102a]" />
              <span>Supabase Project URL</span>
            </label>
            <span className="text-[10px] text-slate-500 font-mono">https://[project-ref].supabase.co</span>
          </div>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://xyzabcdefghijklmnop.supabase.co"
            className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
          />
          <p className="text-[11px] text-slate-500">
            Find in Supabase: <span className="font-semibold text-slate-700">Project Settings &rarr; API &rarr; Project URL</span>
          </p>
        </div>

        {/* Anon Public Key */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#000f22] uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#b7102a]" />
              <span>Project API Key (Anon / Public)</span>
            </label>
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showKey ? 'Hide' : 'Show'}</span>
            </button>
          </div>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#CBD5E1] bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#b7102a]/30"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Find in Supabase: <span className="font-semibold text-slate-700">Project Settings &rarr; API &rarr; Project API Keys (anon public)</span>
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleTest}
          disabled={isTesting}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Activity className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
          <span>{isTesting ? 'Testing Connection...' : 'Test Connection'}</span>
        </button>

        <button
          type="button"
          onClick={handleSaveAndConnect}
          disabled={isTesting}
          className="px-6 py-2.5 rounded-xl bg-[#b7102a] hover:bg-[#960d22] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Save &amp; Connect to Database</span>
        </button>

        {isConfigured && (
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 ml-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Active: {config.url.replace('https://', '')}</span>
          </span>
        )}
      </div>

      {/* Test Diagnostic Result */}
      {testResult && (
        <div
          className={`p-4 rounded-xl border text-xs space-y-3 animate-fadeIn ${
            testResult.success
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-red-50/70 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>{testResult.message}</span>
            </div>
            {testResult.latencyMs !== undefined && (
              <span className="px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 text-[10px] font-mono font-bold">
                Latency: {testResult.latencyMs}ms
              </span>
            )}
          </div>

          {/* Table Verification Badges */}
          {testResult.tables && (
            <div className="pt-2 border-t border-emerald-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
                Schema Table Diagnostics:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 ${
                    testResult.tables.adminUsers
                      ? 'bg-emerald-100/60 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100/60 text-amber-800 border-amber-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${testResult.tables.adminUsers ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                  <span>admin_users</span>
                </div>

                <div
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 ${
                    testResult.tables.inspections
                      ? 'bg-emerald-100/60 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100/60 text-amber-800 border-amber-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${testResult.tables.inspections ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                  <span>inspections</span>
                </div>

                <div
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 ${
                    testResult.tables.subscribers
                      ? 'bg-emerald-100/60 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100/60 text-amber-800 border-amber-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${testResult.tables.subscribers ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                  <span>newsletter</span>
                </div>

                <div
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 ${
                    testResult.tables.projects
                      ? 'bg-emerald-100/60 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100/60 text-amber-800 border-amber-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${testResult.tables.projects ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                  <span>projects</span>
                </div>

                <div
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 ${
                    testResult.tables.contactMessages
                      ? 'bg-emerald-100/60 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100/60 text-amber-800 border-amber-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${testResult.tables.contactMessages ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                  <span>contact_msgs</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Setup Guide Steps */}
      {!compact && (
        <div className="pt-4 border-t border-[#E2E8F0]">
          <h4 className="text-xs font-bold text-[#000f22] uppercase tracking-wider mb-3">
            Quick 4-Step Setup Guide
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="w-5 h-5 rounded-full bg-[#000f22] text-white text-[10px] font-bold flex items-center justify-center mb-1.5">1</span>
              <p className="font-bold text-[#000f22]">Log in to Supabase</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Go to <span className="font-mono text-[#b7102a]">supabase.com</span> &amp; open your project.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="w-5 h-5 rounded-full bg-[#000f22] text-white text-[10px] font-bold flex items-center justify-center mb-1.5">2</span>
              <p className="font-bold text-[#000f22]">Copy API Credentials</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Click <span className="font-semibold text-slate-700">Project Settings &rarr; API</span> and copy URL + anon key.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="w-5 h-5 rounded-full bg-[#000f22] text-white text-[10px] font-bold flex items-center justify-center mb-1.5">3</span>
              <p className="font-bold text-[#000f22]">Paste &amp; Connect</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Paste above &amp; click <span className="font-semibold text-slate-700">Save &amp; Connect</span>.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center mb-1.5">4</span>
              <p className="font-bold text-[#000f22]">Execute SQL Schema</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Open SQL Editor in Supabase, paste our schema, and click Run.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
