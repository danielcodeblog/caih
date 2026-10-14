import React, { useState } from 'react';
import { PageId } from '../types';
import { BRAND_ASSETS } from '../data/mockData';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenInspection?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenInspection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setPropertyDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSpeakToAgent = () => {
    if (onOpenInspection) {
      onOpenInspection();
    } else {
      window.location.href = `tel:${BRAND_ASSETS.phoneClean}`;
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1440px] mx-auto px-6 sm:px-8 flex items-center justify-between gap-6">
        {/* Logo Zone */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            aria-label="Caih Group Home"
          >
            <img
              src="/images/Caih-group.png"
              alt="Caih Group"
              className="h-11 w-auto object-contain"
            />
          </button>
        </div>

        {/* Desktop Navigation Links - Exact style from Screenshot 1 */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          <button
            onClick={() => handleNavClick('home')}
            className={`text-sm font-semibold transition-colors cursor-pointer relative py-2 ${
              currentPage === 'home'
                ? 'text-[#000f22] font-bold after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2.5px] after:bg-[#000f22]'
                : 'text-[#475569] hover:text-[#000f22]'
            }`}
          >
            Home
          </button>

          {/* About Us with Subtle Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleNavClick('about-us')}
              onMouseEnter={() => setAboutDropdownOpen(true)}
              className={`text-sm font-semibold transition-colors cursor-pointer relative py-2 flex items-center gap-1 ${
                currentPage === 'about-us'
                  ? 'text-[#000f22] font-bold after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2.5px] after:bg-[#000f22]'
                  : 'text-[#475569] hover:text-[#000f22]'
              }`}
            >
              <span>About Us</span>
              <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
            </button>

            {aboutDropdownOpen && (
              <div
                onMouseLeave={() => setAboutDropdownOpen(false)}
                className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-2 flex flex-col z-50 animate-fadeIn"
              >
                <button
                  onClick={() => handleNavClick('about-us')}
                  className="px-4 py-2 text-left text-xs font-semibold text-[#000f22] hover:bg-[#F8FAFC]"
                >
                  Our Conglomerate
                </button>
                <button
                  onClick={() => {
                    handleNavClick('about-us');
                    setTimeout(() => {
                      document.getElementById('leadership')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }}
                  className="px-4 py-2 text-left text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#000f22]"
                >
                  Executive Leadership
                </button>
                <button
                  onClick={() => {
                    handleNavClick('about-us');
                    setTimeout(() => {
                      document.getElementById('conglomerate-sectors')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }}
                  className="px-4 py-2 text-left text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#000f22]"
                >
                  Three Structural Pillars
                </button>
              </div>
            )}
          </div>


          {/* Properties with Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleNavClick('projects')}
              onMouseEnter={() => setPropertyDropdownOpen(true)}
              className={`text-sm font-semibold transition-colors cursor-pointer relative py-2 flex items-center gap-1 ${
                currentPage === 'projects' || currentPage === 'project-detail' || currentPage === 'realtor-registration'
                  ? 'text-[#000f22] font-bold after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2.5px] after:bg-[#000f22]'
                  : 'text-[#475569] hover:text-[#000f22]'
              }`}
            >
              <span>Property</span>
              <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
            </button>

            {propertyDropdownOpen && (
              <div
                onMouseLeave={() => setPropertyDropdownOpen(false)}
                className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-2 flex flex-col z-50 animate-fadeIn"
              >
                <button
                  onClick={() => handleNavClick('projects')}
                  className="px-4 py-2 text-left text-xs font-semibold text-[#000f22] hover:bg-[#F8FAFC]"
                >
                  All Properties & Inventory
                </button>
                <button
                  onClick={() => handleNavClick('realtor-registration')}
                  className="px-4 py-2 text-left text-xs font-semibold text-[#b7102a] hover:bg-[#F8FAFC] flex items-center justify-between"
                >
                  <span>Realtor Registration</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('blog')}
            className={`text-sm font-semibold transition-colors cursor-pointer relative py-2 ${
              currentPage === 'blog' || currentPage === 'video-detail'
                ? 'text-[#000f22] font-bold after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2.5px] after:bg-[#000f22]'
                : 'text-[#475569] hover:text-[#000f22]'
            }`}
          >
            Blog
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`text-sm font-semibold transition-colors cursor-pointer relative py-2 ${
              currentPage === 'contact'
                ? 'text-[#000f22] font-bold after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2.5px] after:bg-[#000f22]'
                : 'text-[#475569] hover:text-[#000f22]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Section: Book Visit CTA */}
        <div className="flex items-center gap-4">

          {onOpenInspection && (
            <button
              onClick={onOpenInspection}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#b7102a] hover:bg-[#db313f] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Book Inspection
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#0F172A] hover:bg-[#F1F5F9] focus:outline-none cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-6 py-4 shadow-xl flex flex-col gap-3 animate-fadeIn">
          <button
            onClick={() => handleNavClick('home')}
            className={`text-left py-2 px-3 rounded-lg text-sm font-bold transition-colors ${
              currentPage === 'home' ? 'bg-[#F1F5F9] text-[#b7102a]' : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            Home
          </button>

          <div className="text-xs font-bold text-[#b7102a] uppercase tracking-wider mt-3 mb-1 px-3">Property</div>
          <button
            onClick={() => handleNavClick('projects')}
            className={`text-left py-2 px-3 rounded-lg text-sm font-bold transition-colors ${
              currentPage === 'projects' || currentPage === 'project-detail'
                ? 'bg-[#F1F5F9] text-[#b7102a]'
                : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            All Properties & Inventory
          </button>
          <button
            onClick={() => handleNavClick('realtor-registration')}
            className={`text-left py-2 px-3 rounded-lg text-sm font-bold transition-colors ${
              currentPage === 'realtor-registration'
                ? 'bg-[#F1F5F9] text-[#b7102a]'
                : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            Realtor Registration
          </button>

          <button
            onClick={() => handleNavClick('blog')}
            className={`text-left py-2 px-3 rounded-lg text-sm font-bold transition-colors ${
              currentPage === 'blog' ? 'bg-[#F1F5F9] text-[#b7102a]' : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            Blog
          </button>

          <div className="text-xs font-bold text-[#b7102a] uppercase tracking-wider mt-3 mb-1 px-3">About Us</div>
          <button
            onClick={() => handleNavClick('about-us')}
            className={`text-left py-2 px-3 rounded-lg text-sm font-bold transition-colors ${
              currentPage === 'about-us' ? 'bg-[#F1F5F9] text-[#b7102a]' : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            Our Conglomerate
          </button>
          <button
            onClick={() => {
              handleNavClick('about-us');
              setTimeout(() => { document.getElementById('leadership')?.scrollIntoView({ behavior: 'smooth' }); }, 150);
            }}
            className="text-left py-2 px-3 rounded-lg text-sm font-bold transition-colors text-[#475569] hover:bg-[#F8FAFC]"
          >
            Executive Leadership
          </button>
          <button
            onClick={() => {
              handleNavClick('about-us');
              setTimeout(() => { document.getElementById('conglomerate-sectors')?.scrollIntoView({ behavior: 'smooth' }); }, 150);
            }}
            className="text-left py-2 px-3 rounded-lg text-sm font-bold transition-colors text-[#475569] hover:bg-[#F8FAFC]"
          >
            Three Structural Pillars
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`text-left py-2 px-3 rounded-lg text-sm font-bold transition-colors ${
              currentPage === 'contact' ? 'bg-[#F1F5F9] text-[#b7102a]' : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            Contact & Inspection Desk
          </button>

          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-[#475569]">
              <Phone className="w-4 h-4 text-[#b7102a]" />
              <a href={`tel:${BRAND_ASSETS.phoneClean}`} className="font-bold text-[#000f22]">
                {BRAND_ASSETS.phone}
              </a>
            </div>
            {onOpenInspection && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInspection();
                }}
                className="w-full py-2.5 rounded-lg bg-[#b7102a] text-white text-xs font-bold text-center mt-1"
              >
                Schedule Private Site Visit
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
