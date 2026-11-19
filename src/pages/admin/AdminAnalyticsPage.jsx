import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, Users, Shield, Calendar, Filter, Loader2 } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function AdminAnalyticsPage() {
  const [months, setMonths] = useState(6);
  const [growthData, setGrowthData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [growthRes, catRes, logsRes] = await Promise.all([
          adminService.getUserGrowth(months),
          adminService.getBusinessCategories(),
          adminService.getActivityLogs(1, 25),
        ]);

        if (isMounted) {
          setGrowthData(growthRes?.growth || []);
          setCatData(catRes?.categories || []);
          setActivityLogs(logsRes?.logs || []);
        }
      } catch (err) {
        console.error('Analytics loading error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAnalytics();
    return () => { isMounted = false; };
  }, [months]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
          Platform Analytics & Audit Intelligence
        </h2>
        <p className="text-xs text-gray-400">
          In-depth user adoption metrics, category saturation graphs, and immutable administrative audit logs.
        </p>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Growth */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0D0D0D]">Registered User Growth</h3>
              <p className="text-xs text-gray-400">Trend of verified user accounts</p>
            </div>
            <div className="flex items-center gap-1.5">
              {[3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    months === m
                      ? 'bg-[#0D0D0D] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {m}M
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGradFull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" />
                <XAxis dataKey="period" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D0D0D',
                    borderRadius: '12px',
                    border: '1px solid #1F1F1F',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke="#FF6B00"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#growthGradFull)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Category distribution */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-[#0D0D0D]">Category Distribution</h3>
            <p className="text-xs text-gray-400">Total models indexed per industry vertical</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={catData.slice(0, 6)}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F4F4F5" />
                <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis
                  dataKey="category"
                  type="category"
                  stroke="#4B5563"
                  fontSize={10}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D0D0D',
                    borderRadius: '12px',
                    border: '1px solid #1F1F1F',
                    color: '#FFFFFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Total Ideas" fill="#0D0D0D" radius={[0, 6, 6, 0]}>
                  {catData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#FF6B00' : '#0D0D0D'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comprehensive Audit Trail Log Table */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0D0D0D]">Audit Event Trail</h3>
            <p className="text-xs text-gray-400">Chronological history of administrator operations and state changes</p>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#F4F4F5] text-gray-700">
            {activityLogs.length} Events Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F4F4F5] text-xs font-bold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Admin</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Resource Type</th>
                <th className="py-2.5 px-3">Target Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activityLogs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 text-xs">
                  <td className="py-2.5 px-3 text-gray-400 whitespace-nowrap font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#0D0D0D]">
                    {log.adminEmail || 'admin'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0D0D0D] text-white">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-gray-600">
                    {log.resourceType}
                  </td>
                  <td className="py-2.5 px-3 text-gray-700 font-mono text-[11px]">
                    {log.resourceName || log.resourceId || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
