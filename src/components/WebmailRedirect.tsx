import React, { useEffect } from 'react';
import { Mail, ArrowRight, ExternalLink } from 'lucide-react';

export const WebmailRedirect: React.FC = () => {
  const WEBMAIL_URL = 'https://webmail.cpanel.net/';

  useEffect(() => {
    // Perform immediate browser redirect to cPanel Webmail
    try {
      window.location.replace(WEBMAIL_URL);
    } catch {
      window.location.href = WEBMAIL_URL;
    }
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#000f22]/5">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-[#000f22] text-[#ffb3b1] flex items-center justify-center mx-auto mb-6 shadow-md">
          <Mail className="w-8 h-8 text-[#b7102a]" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-[#b7102a] block mb-1">
          Caih Group Corporate Email
        </span>

        <h1 className="text-2xl font-black text-[#000f22] mb-3">
          Redirecting to Webmail...
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          Connecting to the secure corporate webmail gateway at <span className="font-semibold text-slate-800">webmail.cpanel.net</span>.
        </p>

        <div className="flex justify-center mb-6">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-[#b7102a] rounded-full animate-spin" />
        </div>

        <a
          href={WEBMAIL_URL}
          className="w-full py-3 px-6 rounded-xl bg-[#b7102a] hover:bg-[#db313f] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Open Webmail Portal</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        <p className="text-[11px] text-slate-400 mt-4">
          Direct link: <a href={WEBMAIL_URL} className="text-[#b7102a] underline">{WEBMAIL_URL}</a>
        </p>
      </div>
    </div>
  );
};
