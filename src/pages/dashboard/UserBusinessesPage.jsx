import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, CheckCircle2, Star, Building2, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { businessService } from '../../services/business.service';
import { apiRequest } from '../../services/api';

export default function UserBusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // New business modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('retail');
  const [industry, setIndustry] = useState('');
  const [city, setCity] = useState('');
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const data = await businessService.getMyBusinesses();
      setBusinesses(data?.businesses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      await businessService.createBusiness({
        name: name.trim(),
        type,
        industry: industry.trim(),
        location: { city: city.trim(), country: 'USA' },
      });
      showToast(`Business "${name.trim()}" created successfully!`);
      setName('');
      setIndustry('');
      setCity('');
      setShowModal(false);
      loadBusinesses();
    } catch (err) {
      showToast(err.message || 'Failed to create business.');
    } finally {
      setCreating(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await apiRequest(`/v1/businesses/${id}/set-default`, { method: 'PATCH' });
      showToast('Default active business updated.');
      loadBusinesses();
    } catch (err) {
      showToast(err.message || 'Failed to set default business.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] tracking-tight">
            My Business Profiles
          </h2>
          <p className="text-xs text-gray-400">
            Create and track independent operating companies under your founder workspace account.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF6B00]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Business Profile</span>
        </button>
      </div>

      {/* Grid of Businesses */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
          <p className="text-xs font-semibold text-gray-500">Loading your business ventures...</p>
        </div>
      ) : businesses.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-dashed border-gray-300 rounded-3xl p-12 text-center space-y-4">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-[#0D0D0D]">No Business Ventures Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Create a business profile to start logging revenue, tracking operating overhead, and unlocking health analytics.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="py-2.5 px-6 rounded-xl bg-[#0D0D0D] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Create My First Business
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businesses.map((biz) => (
            <div
              key={biz._id}
              className={`bg-[#FFFFFF] border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6 transition-all ${
                biz.isDefault ? 'border-[#FF6B00] ring-1 ring-[#FF6B00]/30' : 'border-gray-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#0D0D0D]">
                        {biz.name}
                      </h3>
                      {biz.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B00]/10 text-[#FF6B00]">
                          <Star className="w-3 h-3 fill-[#FF6B00]" />
                          <span>Primary Active</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      type: {biz.type} • industry: {biz.industry || 'General'}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-[#0D0D0D] flex items-center justify-center font-bold text-sm border border-gray-200 shrink-0">
                    <Building2 className="w-5 h-5 text-gray-600" />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#F4F4F5] border border-gray-100">
                    <span className="text-gray-400 block font-medium">Health Score</span>
                    <strong className="text-base text-[#0D0D0D] block font-bold mt-0.5">
                      {biz.metrics?.healthScore || 80}/100
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4F4F5] border border-gray-100">
                    <span className="text-gray-400 block font-medium">Recorded Revenue</span>
                    <strong className="text-base text-emerald-700 block font-bold mt-0.5">
                      ${Number(biz.metrics?.totalRevenue || 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                {!biz.isDefault ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(biz._id)}
                    className="font-bold text-gray-500 hover:text-[#0D0D0D] transition-colors cursor-pointer"
                  >
                    Set as Primary
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 font-medium">Active workspace business</span>
                )}

                <Link
                  to="/dashboard/transactions"
                  className="font-bold text-[#FF6B00] hover:underline flex items-center gap-1"
                >
                  <span>Manage Transactions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#0D0D0D]">Establish Business Profile</h3>

            <form onSubmit={handleCreateBusiness} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0D0D0D] uppercase tracking-wider block">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Artisanal Bakery"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0D0D0D] uppercase tracking-wider block">
                  Business Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#FF6B00] outline-hidden"
                >
                  <option value="retail">Retail Store</option>
                  <option value="restaurant">Restaurant / Eatery</option>
                  <option value="cafe">Cafe / Roastery</option>
                  <option value="service">Service Agency</option>
                  <option value="freelance">Freelance / Consulting</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="technology">Technology & SaaS</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0D0D0D] uppercase tracking-wider block">
                  Industry / Sub-sector
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Specialty Baking & Catering"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0D0D0D] uppercase tracking-wider block">
                  Operating City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Austin, TX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#FF6B00] outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2.5 px-4 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="py-2.5 px-5 rounded-xl font-bold text-white bg-[#FF6B00] hover:bg-[#E05300] shadow-md transition-colors cursor-pointer"
                >
                  {creating ? 'Saving...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
