import React from 'react';
import { Menu, Search, Plus, Bell, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader({ onMenuClick, title, subtitle }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF] border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Page Headings */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-[#0D0D0D] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0D0D0D] tracking-tight">
            {title || 'Admin Operations'}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-400 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Add Business Button */}
        <Link
          to="/admin/businesses/add"
          className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Business Idea</span>
        </Link>

        {/* Security Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F4F4F5] border border-gray-200 text-xs font-semibold text-[#0D0D0D]">
          <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
          <span>Role: <strong className="text-[#FF6B00]">Admin</strong></span>
        </div>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#0D0D0D] text-[#FF6B00] font-black flex items-center justify-center text-xs border border-[#1F1F1F]">
            {currentUser?.firstName?.charAt(0) || 'A'}
          </div>
          <span className="text-xs font-bold text-[#0D0D0D] hidden lg:block">
            {currentUser?.firstName || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
}
