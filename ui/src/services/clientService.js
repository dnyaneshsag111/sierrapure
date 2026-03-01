import api from './api';

export const clientService = {
  getAll: (segment) =>
    api.get('/clients', { params: segment ? { segment } : {} }).then((r) => r.data.data),

  getFeatured: () =>
    api.get('/clients/featured').then((r) => r.data.data),

  getById: (id) =>
    api.get(`/clients/${id}`).then((r) => r.data.data),

  create: (data) =>
    api.post('/clients', data).then((r) => r.data.data),

  update: (id, data) =>
    api.put(`/clients/${id}`, data).then((r) => r.data.data),

  uploadLogo: (id, file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`/clients/${id}/logo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data);
  },

  delete: (id) =>
    api.delete(`/clients/${id}`).then((r) => r.data),
};
