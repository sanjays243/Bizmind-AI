import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Menu, X, ArrowRight, Play, Sparkles, User, LogOut, Shield } from 'lucide-react';

export default function Navbar({
  onAuth,
  onLogin,
  onSignUp,
  onLiveDemo,
  onNavigate,
  activeSection: propActiveSection,
  currentUser: propUser,
  onLogout: propLogout,
}) {
  const navigate = useNavigate();
  const { currentUser: authUser, logout: authLogout } = useAuth();
  const currentUser = propUser || authUser;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('why-bizmind');

  // Navigation Items with properly assigned section IDs & alias support
  const navLinks = [
    { 
      label: 'Why BizMind', 
      href: '#problem', 
      aliases: ['#problem', '#why-bizmind'],
      id: 'problem' 
    },
    { 
      label: 'Solutions', 
      href: '#solutions', 
      aliases: ['#solutions'],
      id: 'solutions' 
    },
    { 
      label: 'How It Works', 
      href: '#how-it-works', 
      aliases: ['#how-it-works'],
      id: 'how-it-works' 
    },
    { 
      label: 'Explore Businesses', 
      href: '#explore-businesses', 
      aliases: ['#explore-businesses', '#businesses'],
      id: 'explore-businesses' 
    },
    { 
      label: 'Features', 
      href: '#features', 
      aliases: ['#features'],
      id: 'features' 
    },
    { 
      label: 'AI Advisor', 
      href: '#ai-advisor', 
      aliases: ['#ai-advisor', '#advisor'],
      id: 'ai-advisor' 
    },
    { 
      label: 'Business Calculator', 
      href: '#calculator', 
      aliases: ['#calculator'],
      id: 'calculator' 
    },
  ];

  // Detect scroll for border/elevation & active section spy
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Automatic Scroll Spy: detect which section heading is currently in viewport
      const scrollPosition = window.scrollY + 120; // 120px offset for navbar

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const item = navLinks[i];
        const el = 
          document.getElementById(item.id) || 
          (item.aliases[1] && document.getElementById(item.aliases[1].replace('#', '')));

        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            return;
          }
        }
      }

      // If at top of page, don't force active or default to first
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active section if prop is passed
  useEffect(() => {
    if (propActiveSection) {
      setActiveSection(propActiveSection.replace('#', ''));
    }
  }, [propActiveSection]);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Handle navigation to target page/section
  const handleScrollToSection = (e, item) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setActiveSection(item.id);

    if (onNavigate) {
      onNavigate(item.id);
    }

    window.location.hash = item.href;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setActiveSection('');

    if (onNavigate) {
      onNavigate('home');
    }

    window.history.pushState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAction = (callback, defaultHref) => {
    setIsMenuOpen(false);
    if (callback) {
      callback();
    } else if (defaultHref) {
      window.location.href = defaultHref;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#FFFFFF] transition-all duration-200 ${
        isScrolled
          ? 'border-b border-[#F4F4F5] shadow-[0_4px_20px_rgba(13,13,13,0.05)] bg-[#FFFFFF]/95 backdrop-blur-md'
          : 'border-b border-[#F4F4F5] bg-[#FFFFFF]'
      }`}
    >
      {/* Full width container with generous responsive padding so logo is firmly on the left */}
      <nav
        role="navigation"
        aria-label="Main Navigation"
        className="w-full px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 h-20 flex items-center justify-between gap-2 lg:gap-4"
      >
        {/* ─── 1. Brand Logo (Moved firmly to Left Side) ─── */}
        <div className="flex items-center flex-shrink-0">
          <a
            href="#"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] rounded-lg py-1 select-none"
            aria-label="BizMind AI Home"
          >
            {/* Official Logo Icon */}
            <div className="w-11 h-11 rounded-xl bg-white border border-gray-200/90 flex items-center justify-center p-1 transition-all duration-300 group-hover:scale-105 group-hover:border-[#FF6B00] group-hover:shadow-[0_0_15px_rgba(255,107,0,0.25)] shadow-sm flex-shrink-0">
              <img
                src="/images/logo_transparent.png"
                alt="BizMind AI Official Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Logo Text: BizMind in #0D0D0D, AI in #FF6B00 */}
            <span className="font-extrabold text-xl lg:text-2xl tracking-tight text-[#0D0D0D] whitespace-nowrap">
              BizMind <span className="text-[#FF6B00]">AI</span>
            </span>
          </a>
        </div>

        {/* ─── 2. Main Navigation Links (Center / Bolder Assigned Headings) ─── */}
        <ul className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1.5 2xl:gap-2.5 flex-1 max-w-4xl mx-2">
          {navLinks.map((item) => {
            const isCurrent = activeSection === item.id;

            return (
              <li key={item.id} className="relative">
                <a
                  href={item.href}
                  onClick={(e) => handleScrollToSection(e, item)}
                  className={`text-xs xl:text-[13px] 2xl:text-sm font-bold tracking-tight px-2.5 xl:px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap flex items-center ${
                    isCurrent
                      ? 'text-[#FF6B00] font-extrabold bg-[#FFF7ED]'
                      : 'text-[#0D0D0D] hover:text-[#FF6B00] hover:bg-[#F4F4F5]'
                  }`}
                >
                  {item.label}
                  {isCurrent && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-[2.5px] bg-[#FF6B00] rounded-full" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* ─── 3. Action Buttons & Authentication (Right Side) ─── */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
          {/* Live Demo: Ghost / Outline button (Black border, text switches to Orange on hover) */}
          <button
            type="button"
            onClick={() => handleAction(onLiveDemo, '#demo')}
            className="inline-flex items-center gap-1.5 px-3 xl:px-3.5 py-2 text-xs xl:text-sm font-semibold rounded-lg text-[#0D0D0D] border border-[#0D0D0D] bg-transparent hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-[#FFF7ED] transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Live Demo</span>
          </button>

          {/* Authentication Action: Unified Login / Dashboard */}
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <Link
                to={currentUser.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D0D0D] hover:bg-black text-white transition-colors cursor-pointer border border-[#1F1F1F]"
                title={currentUser.role === 'admin' ? 'Open Admin Console' : 'Open Dashboard'}
              >
                <div className="w-6 h-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.avatarInitial || currentUser.firstName?.charAt(0) || currentUser.name?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-bold text-white max-w-[130px] truncate">
                  {currentUser.role === 'admin' ? 'Admin Console' : (currentUser.firstName || currentUser.name || 'Dashboard')}
                </span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await authLogout();
                  if (propLogout) propLogout();
                  navigate('/login');
                }}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-[#F4F4F5] rounded-lg transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 xl:gap-2 px-3.5 xl:px-4 py-2 text-xs xl:text-sm font-bold text-white bg-[#FF6B00] hover:bg-[#E05300] rounded-lg shadow-md hover:shadow-[0_4px_18px_rgba(255,107,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              <span>Login / Sign Up</span>
            </Link>
          )}
        </div>

        {/* ─── 4. Mobile Controls (Hamburger & Quick Demo) ─── */}
        <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => handleAction(onLiveDemo, '#demo')}
            className="sm:inline-flex hidden items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md text-[#0D0D0D] border border-[#0D0D0D] hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-[#FFF7ED] transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Demo</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 rounded-xl text-[#0D0D0D] hover:text-[#FF6B00] hover:bg-[#F4F4F5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
            aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* ─── 5. Mobile Drawer Backdrop & Menu ─── */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-20 z-40 bg-[#0D0D0D]/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-20 right-0 bottom-0 w-full max-w-sm bg-[#FFFFFF] border-l border-[#F4F4F5] shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out flex flex-col ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Section Headings in Mobile Menu */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-3">
              Menu Sections
            </p>
            <ul className="space-y-1">
              {navLinks.map((item, index) => {
                const isCurrent = activeSection === item.id;

                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => handleScrollToSection(e, item)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-bold transition-all ${
                        isCurrent
                          ? 'bg-[#FFF7ED] text-[#FF6B00] font-extrabold border-l-4 border-[#FF6B00]'
                          : 'text-[#0D0D0D] hover:text-[#FF6B00] hover:bg-[#F4F4F5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-400 w-4">
                          0{index + 1}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <span className="text-xs text-gray-400">→</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Action Buttons in Mobile Menu */}
          <div className="border-t border-gray-100 pt-6 space-y-3">
            <button
              type="button"
              onClick={() => handleAction(onLiveDemo, '#demo')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-[#0D0D0D] border border-[#0D0D0D] hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-[#FFF7ED] transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Live Demo</span>
            </button>

            {currentUser ? (
              <div className="space-y-3">
                <div className="p-3 bg-[#F4F4F5] rounded-xl flex items-center justify-between border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-sm font-bold">
                      {currentUser.avatarInitial || currentUser?.firstName?.charAt(0) || currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0D0D0D]">
                        {currentUser?.firstName
                          ? `${currentUser.firstName}${currentUser.lastName ? ' ' + currentUser.lastName : ''}`
                          : (currentUser?.name || currentUser?.email || 'User')}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate max-w-[150px]">
                        {currentUser?.businessProfile?.businessName || currentUser?.businessName || currentUser?.email || ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await authLogout();
                      if (propLogout) propLogout();
                      navigate('/login');
                    }}
                    className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(currentUser.role === 'admin' ? '/admin/dashboard' : '/dashboard');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#0D0D0D] hover:bg-black transition-colors"
                >
                  <span>{currentUser.role === 'admin' ? 'Open Admin Console' : 'My Workspace Dashboard'}</span>
                  <ArrowRight className="w-4 h-4 text-[#FF6B00]" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#FF6B00] hover:bg-[#E05E00] shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Login / Sign Up</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Drawer Footer */}
        <div className="p-4 border-t border-gray-100 bg-[#F4F4F5]/50 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>AI-Powered Financial Intelligence</span>
          </div>
        </div>
      </div>
    </header>
  );
}
