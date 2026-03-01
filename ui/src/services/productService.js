import api from './api';

export const productService = {
  getAll: (params) => api.get('/products', { params }).then((r) => r.data.data),
  getById: (id) => api.get(`/products/${id}`).then((r) => r.data.data),
  getBySegment: (segment) =>
    api.get('/products', { params: { segment } }).then((r) => r.data.data),
};
