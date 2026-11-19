import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  trendPositive,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#FFFFFF] border border-gray-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#FF6B00]/40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] tracking-tight">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center shrink-0 border border-[#1F1F1F] shadow-sm">
            <Icon className="w-5 h-5 text-[#FF6B00]" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-gray-500 font-medium truncate">
              {subtitle}
            </span>
          )}

          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                trendPositive !== false ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {trendPositive !== false ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
