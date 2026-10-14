import React, { useState } from 'react';
import { PageId } from '../types';
import { BRAND_ASSETS } from '../data/mockData';
import { MapPin, Phone, Mail, Globe, Share2, Newspaper, Check, Info } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContact }) => {
  const [footerNotice, setFooterNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setFooterNotice(msg);
    setTimeout(() => {
      setFooterNotice(null);
    }, 4000);
  };

  return (
    <footer className="bg-[#0A1A2F] text-slate-300 py-16 px-6 sm:px-8 border-t border-slate-800 relative">
      {/* Toast Notice */}
      {footerNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000f22] text-white px-5 py-3 rounded-xl border border-slate-700 shadow-2xl flex items-center gap-3 text-xs animate-fadeIn max-w-md">
          <Info className="w-4 h-4 text-[#b7102a] shrink-0" />
          <span className="flex-1">{footerNotice}</span>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand Column */}
        <div>
          <div className="bg-white/95 p-3 rounded-xl border border-slate-800 inline-block mb-5 shadow-sm">
            <img
              src="/images/Caih-group.png"
              alt="Caih Group"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Pioneering monumental infrastructure, sustainable residential developments, and strategic industrial building resources across West Africa with uncompromising institutional dignity.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {/* Instagram */}
            <a
              href="https://instagram.com/caihproperties"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center hover:bg-[#b7102a] text-slate-300 hover:text-white transition-colors"
              title="Instagram: @caihproperties"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com/@caihproperties"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center hover:bg-[#b7102a] text-slate-300 hover:text-white transition-colors"
              title="TikTok: @caihproperties"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/caihproperties"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center hover:bg-[#b7102a] text-slate-300 hover:text-white transition-colors"
              title="Facebook: caihproperties"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.581 9 4.615V8z"/>
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com/caihproperties"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center hover:bg-[#b7102a] text-slate-300 hover:text-white transition-colors"
              title="X: @caihproperties"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation Column */}
        <div>
          <h4 className="text-white font-bold mb-4 tracking-wider text-xs uppercase">
            Navigation
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <button
                onClick={() => {
                  onNavigate('about-us');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onNavigate('projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Projects
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onNavigate('blog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Blogs & Insights
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onNavigate('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Conglomerate Sectors Column */}
        <div>
          <h4 className="text-white font-bold mb-4 tracking-wider text-xs uppercase">
            Conglomerate Sectors
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <button
                onClick={() => {
                  onNavigate('projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Caih Properties
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onNavigate('about-us');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Caih Construction
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onNavigate('projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Caih Building Resources
              </button>
            </li>
          </ul>
        </div>

        {/* Headquarters Column */}
        <div>
          <h4 className="text-white font-bold mb-4 tracking-wider text-xs uppercase">
            Headquarters
          </h4>
          <p className="text-sm text-slate-400 mb-3 flex items-start gap-2.5 leading-relaxed">
            <MapPin className="w-4 h-4 text-red-500 mt-1 shrink-0" />
            <span>{BRAND_ASSETS.address}</span>
          </p>
          <p className="text-sm text-slate-400 mb-3 flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-red-500 shrink-0" />
            <a href={`tel:${BRAND_ASSETS.phoneClean}`} className="hover:text-white transition-colors">
              {BRAND_ASSETS.phone}
            </a>
          </p>
          <p className="text-sm text-slate-400 flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-red-500 shrink-0" />
            <a href={`mailto:${BRAND_ASSETS.email}`} className="hover:text-white transition-colors">
              {BRAND_ASSETS.email}
            </a>
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2026 Caih Group. All rights reserved. Engineering excellence across West Africa.</p>
        <div className="flex gap-6">
          <button
            onClick={() => showNotice('Privacy Policy: Caih Group handles all investor and prospective buyer records under the NDPR and strict fiduciary confidentiality.')}
            className="hover:text-slate-400 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => showNotice('Terms of Service: All property acquisition agreements are backed by verified Lagos State Governor Consent and milestone-linked payment schedules.')}
            className="hover:text-slate-400 transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={() => {
              onNavigate('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-slate-400 transition-colors cursor-pointer"
          >
            Corporate Desk
          </button>
        </div>
      </div>
    </footer>
  );
};
