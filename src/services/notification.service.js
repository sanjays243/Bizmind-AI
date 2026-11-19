import { apiRequest } from './api';

export const notificationService = {
  async getNotifications() {
    const res = await apiRequest('/v1/notifications');
    return res.data || [];
  },

  async markAsRead(id) {
    const res = await apiRequest(`/v1/notifications/${id}/read`, { method: 'PUT' });
    return res.data;
  },

  async markAllAsRead() {
    const res = await apiRequest('/v1/notifications/read-all', { method: 'PUT' });
    return res.data;
  },

  async getWeeklyDigest(businessId) {
    const res = await apiRequest(`/v1/notifications/digest/${businessId}`);
    return res.data;
  },

  async deleteNotification(id) {
    const res = await apiRequest(`/v1/notifications/${id}`, { method: 'DELETE' });
    return res.data;
  },
};

