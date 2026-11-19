import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  FolderTree,
  Activity,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import AdminStatCard from '../../components/admin/AdminStatCard';
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

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, growthRes, catRes, usersRes] = await Promise.all([
          adminService.getDashboardSummary(),
          adminService.getUserGrowth(6),
          adminService.getBusinessCategories(),
          adminService.getUsers({ limit: 5 }),
        ]);

        if (isMounted) {
          setSummaryData(summaryRes);
          setUserGrowth(growthRes?.growth || []);
          setCategoryData(catRes?.categories || []);
          setRecentUsers(usersRes?.users || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        if (isMounted) setError(err.message || 'Error connecting to analytics services');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  const summary = summaryData?.summary || {
    totalUsers: 0,
    totalBusinessIdeas: 0,
    totalBusinessCategories: 0,
    totalActiveBusinesses: 0,
    newUsersThisMonth: 0,
  };

  const recentlyAdded = summaryData?.recentlyAddedBusinesses || [];
  const recentActivity = summaryData?.recentActivity || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] border border-gray-200/80 rounded-2xl p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Live Operations Monitoring
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
            Administrative Command Intelligence
          </h2>
          <p className="text-xs text-gray-500">
            Real-time platform metrics, catalog state, audit events, and user adoption.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/businesses/add"
            className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>Add New Business</span>
          </Link>
          <Link
            to="/admin/businesses"
            className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#0D0D0D] hover:bg-black text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <span>Manage Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#FF6B00]" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
          ⚠️ Operational Notice: {error}. Showing cached or initial server metrics.
        </div>
      )}

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AdminStatCard
          title="Registered Users"
          value={loading ? '...' : summary.totalUsers}
          icon={Users}
          subtitle="Platform accounts"
          trend="+12% MoM"
          trendPositive={true}
        />
        <AdminStatCard
          title="Business Ideas"
          value={loading ? '...' : summary.totalBusinessIdeas}
          icon={Briefcase}
          subtitle="Catalog models"
          trend="Dynamic sync"
          trendPositive={true}
        />
        <AdminStatCard
          title="Categories"
          value={loading ? '...' : (summary.totalBusinessCategories || 14)}
          icon={FolderTree}
          subtitle="Industry sectors"
        />
        <AdminStatCard
          title="Active Live"
          value={loading ? '...' : summary.totalActiveBusinesses}
          icon={Activity}
          subtitle="Published publicly"
        />
        <AdminStatCard
          title="New This Month"
          value={loading ? '...' : summary.newUsersThisMonth}
          icon={UserPlus}
          subtitle="Current calendar cycle"
          trend="+8 this week"
          trendPositive={true}
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Growth Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0D0D0D]">Registered User Growth</h3>
              <p className="text-xs text-gray-400">Account registrations tracked securely over time</p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#F4F4F5] text-gray-700">
              6 Months
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.25} />
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
                  name="Total Users"
                  stroke="#FF6B00"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#userGrowthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Catalog by Category (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0D0D0D]">Business Catalog</h3>
              <p className="text-xs text-gray-400">Distribution across active categories</p>
            </div>
            <Link to="/admin/categories" className="text-xs font-bold text-[#FF6B00] hover:underline">
              View All
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData.slice(0, 5)}
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
                <Bar dataKey="count" name="Businesses" fill="#0D0D0D" radius={[0, 6, 6, 0]}>
                  {categoryData.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#FF6B00' : '#0D0D0D'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLES ROW: Recently Added Businesses & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recently Added Businesses (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0D0D0D]">Recently Added Businesses</h3>
              <p className="text-xs text-gray-400">Latest business models created dynamically in MongoDB</p>
            </div>
            <Link
              to="/admin/businesses"
              className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1"
            >
              <span>Catalog Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentlyAdded.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No business ideas added yet.</p>
            ) : (
              recentlyAdded.map((biz) => (
                <div key={biz._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={biz.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80'}
                      alt={biz.name}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0D0D0D] truncate">
                        {biz.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{biz.category}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-700">
                          ${biz.investmentMin?.toLocaleString()} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        biz.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {biz.status}
                    </span>
                    <Link
                      to={`/admin/businesses/edit/${biz._id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#0D0D0D] hover:bg-gray-100 transition-colors"
                      title="Edit"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Log Activity (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0D0D0D]">Recent Admin Activity</h3>
              <p className="text-xs text-gray-400">Audit trail of verified administrative events</p>
            </div>
            <Link
              to="/admin/analytics"
              className="text-xs font-bold text-[#FF6B00] hover:underline"
            >
              Full Log
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No recorded activity yet.</p>
            ) : (
              recentActivity.map((log) => (
                <div key={log._id} className="p-3 rounded-xl bg-[#F4F4F5] border border-gray-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#0D0D0D] text-[#FF6B00] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    ●
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0D0D0D] truncate">
                        {log.action?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate mt-0.5">
                      {log.resourceType}: <strong className="text-[#0D0D0D]">{log.resourceName || log.resourceId}</strong>
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      by {log.adminEmail || 'admin'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RECENT USERS STRIP */}
      <div className="bg-[#FFFFFF] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#0D0D0D]">Recently Registered Users</h3>
            <p className="text-xs text-gray-400">Regular platform accounts assigned the standard "user" role</p>
          </div>
          <Link
            to="/admin/users"
            className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-1"
          >
            <span>All Users</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F4F4F5] text-xs font-bold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-semibold text-[#0D0D0D]">
                    {user.fullName || `${user.firstName} ${user.lastName}`}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-gray-600">{user.email}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800 uppercase">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
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
