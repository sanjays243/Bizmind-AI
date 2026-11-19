import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FolderTree,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Brain,
  ExternalLink,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ isOpen, onClose }) {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Business Management', to: '/admin/businesses', icon: Briefcase },
    { label: 'Add Business', to: '/admin/businesses/add', icon: PlusCircle },
    { label: 'Categories', to: '/admin/categories', icon: FolderTree },
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0D0D0D] border-r border-[#1F1F1F] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#1F1F1F]">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#E05300] flex items-center justify-center text-white shadow-lg shadow-[#FF6B00]/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">BizMind</span>
                <span className="text-[#FF6B00] font-black text-base">AI</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block -mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-300">
            Platform Operations
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
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
            Quick Portals
          </div>

          <Link
            to="/businesses"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1F1F1F]/60 transition-colors"
          >
            <span className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-[#FF6B00]" />
              <span>Public Business Ideas</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1F1F1F]/60 transition-colors"
          >
            <span className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 text-gray-400" />
              <span>User Dashboard</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
          </Link>
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-[#1F1F1F] bg-[#0D0D0D]/50">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1F1F1F]/60 border border-[#1F1F1F]">
            <div className="w-9 h-9 rounded-lg bg-[#FF6B00]/20 text-[#FF6B00] font-black flex items-center justify-center text-sm border border-[#FF6B00]/30 shrink-0">
              {currentUser?.firstName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {currentUser?.fullName || currentUser?.email || 'Administrator'}
              </p>
              <p className="text-[11px] text-[#FF6B00] font-semibold truncate capitalize">
                ● Super Admin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
