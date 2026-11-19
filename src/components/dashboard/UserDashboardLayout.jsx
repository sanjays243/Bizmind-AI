import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Receipt,
  User,
  Sparkles,
  FileText,
  LogOut,
  Brain,
  Menu,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboardLayout() {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Advisor', to: '/dashboard/advisor', icon: Sparkles },
    { label: 'Invoices & A/R', to: '/dashboard/invoices', icon: FileText },
    { label: 'My Businesses', to: '/dashboard/businesses', icon: Briefcase },
    { label: 'Transactions', to: '/dashboard/transactions', icon: Receipt },
    { label: 'Profile Settings', to: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F5] font-sans selection:bg-[#FF6B00]/20 selection:text-[#FF6B00]">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* User Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0D0D0D] border-r border-[#1F1F1F] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#1F1F1F]">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#E05300] flex items-center justify-center text-white shadow-md">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base">BizMind</span>
              <span className="text-[#FF6B00] font-black text-base ml-1">AI</span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-300">
            Founder Workspace
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20 font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-[#1F1F1F]/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-300">
            Intelligence Hub
          </div>

          <Link
            to="/businesses"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1F1F1F]/60 transition-colors"
          >
            <span className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" />
              <span>Explore Business Ideas</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
          </Link>
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#1F1F1F] bg-[#0D0D0D]/60">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1F1F1F]/70 border border-[#1F1F1F]">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/20 text-[#FF6B00] font-black flex items-center justify-center text-xs shrink-0">
              {currentUser?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {currentUser?.fullName || currentUser?.firstName || 'Founder'}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF] border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#0D0D0D] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="text-xs font-bold text-gray-500 hover:text-[#FF6B00] transition-colors hidden sm:block">
              ← Return to Main Website
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FF6B00]/10 text-[#FF6B00] uppercase">
              Founder Edition
            </span>
            <div className="w-8 h-8 rounded-full bg-[#0D0D0D] text-[#FF6B00] font-bold flex items-center justify-center text-xs">
              {currentUser?.firstName?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
