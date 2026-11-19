import { apiRequest } from './api';

export const businessService = {
  // Public Catalog
  async getPublicBusinesses(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiRequest(`/businesses?${query}`);
    return res.data;
  },

  async getPublicBusinessBySlug(slug) {
    const res = await apiRequest(`/businesses/${slug}`);
    return res.data;
  },

  async getPublicCategories() {
    const res = await apiRequest('/categories');
    return res.data;
  },

  // User-Owned Businesses
  async getMyBusinesses() {
    const res = await apiRequest('/v1/businesses');
    return res.data;
  },

  async getBusinessById(id) {
    const res = await apiRequest(`/v1/businesses/${id}`);
    return res.data;
  },

  async createBusiness(businessData) {
    const res = await apiRequest('/v1/businesses', {
      method: 'POST',
      body: businessData,
    });
    return res.data;
  },

  async updateBusiness(id, businessData) {
    const res = await apiRequest(`/v1/businesses/${id}`, {
      method: 'PUT',
      body: businessData,
    });
    return res.data;
  },

  async getBusinessSummary(id) {
    const res = await apiRequest(`/v1/businesses/${id}/summary`);
    return res.data;
  },

  // User Transactions
  async getTransactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiRequest(`/v1/transactions?${query}`);
    return res.data;
  },

  async createTransaction(txData) {
    const res = await apiRequest('/v1/transactions', {
      method: 'POST',
      body: txData,
    });
    return res.data;
  },

  async deleteTransaction(id) {
    const res = await apiRequest(`/v1/transactions/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  async importTransactions(importData) {
    const res = await apiRequest('/v1/transactions/import', {
      method: 'POST',
      body: importData,
    });
    return res.data;
  },

  // User Analytics Overview & P&L Statement
  async getAnalyticsOverview(businessId) {
    const res = await apiRequest(`/v1/analytics/overview/${businessId}`);
    return res.data;
  },

  async getPLStatement(businessId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiRequest(`/v1/analytics/pl-statement/${businessId}?${query}`);
    return res.data;
  },

  // Budgets & Cash Runway
  async getBudgetsAndRunway(businessId) {
    const res = await apiRequest(`/v1/analytics/budgets-and-runway/${businessId}`);
    return res.data;
  },

  async updateBudgets(businessId, payload) {
    const res = await apiRequest(`/v1/analytics/budgets/${businessId}`, {
      method: 'PUT',
      body: payload,
    });
    return res.data;
  },

  // AI Receipt Scanner
  async scanReceipt(payload) {
    const res = await apiRequest('/v1/advisor/scan-receipt', {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  // AI Financial Advisor
  async askAdvisor(payload) {
    const res = await apiRequest('/v1/advisor/ask', {
      method: 'POST',
      body: payload,
    });
    return res.data;
  },

  // Team & Multi-User Management
  async getTeam(businessId) {
    const res = await apiRequest(`/v1/businesses/${businessId}/team`);
    return res.data;
  },

  async inviteTeamMember(businessId, memberData) {
    const res = await apiRequest(`/v1/businesses/${businessId}/team`, {
      method: 'POST',
      body: memberData,
    });
    return res.data;
  },

  async removeTeamMember(businessId, memberId) {
    const res = await apiRequest(`/v1/businesses/${businessId}/team/${memberId}`, {
      method: 'DELETE',
    });
    return res.data;
  },
};
