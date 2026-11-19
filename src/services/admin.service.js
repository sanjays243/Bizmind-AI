import { apiRequest } from './api';

export const adminService = {
  // 1. Overview Dashboard Summary
  async getDashboardSummary() {
    const res = await apiRequest('/admin/dashboard/summary');
    return res.data;
  },

  // 2. Analytics
  async getUserGrowth(months = 6) {
    const res = await apiRequest(`/admin/analytics/user-growth?months=${months}`);
    return res.data;
  },

  async getBusinessCategories() {
    const res = await apiRequest('/admin/analytics/business-categories');
    return res.data;
  },

  async getActivityLogs(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    const res = await apiRequest(`/admin/analytics/activity?${params.toString()}`);
    return res.data;
  },

  // 3. Business Management
  async getBusinesses(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiRequest(`/admin/businesses?${query}`);
    return res.data;
  },

  async getBusinessById(id) {
    const res = await apiRequest(`/admin/businesses/${id}`);
    return res.data;
  },

  async createBusiness(businessData) {
    const res = await apiRequest('/admin/businesses', {
      method: 'POST',
      body: businessData,
    });
    return res.data;
  },

  async updateBusiness(id, businessData) {
    const res = await apiRequest(`/admin/businesses/${id}`, {
      method: 'PUT',
      body: businessData,
    });
    return res.data;
  },

  async updateBusinessStatus(id, { status, isFeatured }) {
    const res = await apiRequest(`/admin/businesses/${id}/status`, {
      method: 'PATCH',
      body: { status, isFeatured },
    });
    return res.data;
  },

  async deleteBusiness(id) {
    const res = await apiRequest(`/admin/businesses/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  // 4. User Management
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiRequest(`/admin/users?${query}`);
    return res.data;
  },

  async getUserById(id) {
    const res = await apiRequest(`/admin/users/${id}`);
    return res.data;
  },

  async updateUserStatus(id, isActive) {
    const res = await apiRequest(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: { isActive },
    });
    return res.data;
  },

  async updateUserRole(id, role) {
    const res = await apiRequest(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: { role },
    });
    return res.data;
  },

  // 5. Categories Management
  async getCategories() {
    const res = await apiRequest('/admin/categories');
    return res.data;
  },

  async createCategory(categoryData) {
    const res = await apiRequest('/admin/categories', {
      method: 'POST',
      body: categoryData,
    });
    return res.data;
  },
};
