import api from './api';

const BASE = '/images';

export const imageService = {
  // ── Upload ───────────────────────────────────────────────────────────
  uploadBottle: (file, label) => {
    const form = new FormData();
    form.append('file', file);
    form.append('label', label);
    return api.post(`${BASE}/bottles`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data);
  },

  uploadClientLogo: (file, clientName) => {
    const form = new FormData();
    form.append('file', file);
    form.append('clientName', clientName);
    return api.post(`${BASE}/clients/logo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data);
  },

  uploadSierraLogo: (file, label = 'primary') => {
    const form = new FormData();
    form.append('file', file);
    form.append('label', label);
    return api.post(`${BASE}/sierra-logo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data);
  },

  // Upload hero section bottle (separate from product bottles)
  uploadHeroBottle: (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('label', 'hero-bottle');
    return api.post(`${BASE}/hero`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data);
  },

  upload: (file, category, label) => {
    const form = new FormData();
    form.append('file', file);
    form.append('category', category);
    form.append('label', label);
    return api.post(`${BASE}/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data);
  },

  // ── List — all use generic ?category= endpoint ────────────────────────
  listByCategory: (category) =>
    api.get(BASE, { params: { category } }).then((r) => r.data.data),

  // ── Delete ───────────────────────────────────────────────────────────
  delete: (id) => api.delete(`${BASE}/${id}`).then((r) => r.data),
};
