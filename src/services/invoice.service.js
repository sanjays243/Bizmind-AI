import { apiRequest } from './api';

export const invoiceService = {
  async getInvoices(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiRequest(`/v1/invoices?${query}`);
    return res.data;
  },

  async getInvoiceStats(businessId) {
    const res = await apiRequest(`/v1/invoices/stats/${businessId}`);
    return res.data;
  },

  async getInvoiceById(id) {
    const res = await apiRequest(`/v1/invoices/${id}`);
    return res.data;
  },

  async createInvoice(invoiceData) {
    const res = await apiRequest('/v1/invoices', {
      method: 'POST',
      body: invoiceData,
    });
    return res.data;
  },

  async updateInvoice(id, invoiceData) {
    const res = await apiRequest(`/v1/invoices/${id}`, {
      method: 'PUT',
      body: invoiceData,
    });
    return res.data;
  },

  async markAsPaid(id, paymentData = {}) {
    const res = await apiRequest(`/v1/invoices/${id}/pay`, {
      method: 'POST',
      body: paymentData,
    });
    return res.data;
  },

  async deleteInvoice(id) {
    const res = await apiRequest(`/v1/invoices/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  async checkoutInvoice(id, paymentData) {
    const res = await apiRequest(`/v1/invoices/${id}/checkout`, {
      method: 'POST',
      body: paymentData,
    });
    return res.data;
  },

  async getPublicInvoice(id) {
    const res = await apiRequest(`/v1/invoices/${id}/public`);
    return res.data;
  },
};

