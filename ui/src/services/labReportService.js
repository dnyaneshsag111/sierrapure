import api from './api';

export const labReportService = {
  getAll: (page = 0, size = 10) =>
    api.get('/lab-reports', { params: { page, size } }).then((r) => r.data.data),

  getLatest: () =>
    api.get('/lab-reports/latest').then((r) => r.data.data),

  getById: (id) =>
    api.get(`/lab-reports/${id}`).then((r) => r.data.data),

  getByBatch: (batchNumber) =>
    api.get(`/lab-reports/batch/${batchNumber}`).then((r) => r.data.data),

  getByDate: (date) =>
    api.get(`/lab-reports/date/${date}`).then((r) => r.data.data),

  downloadPDF: async (id, batchNumber) => {
    const response = await api.get(`/lab-reports/${id}/pdf`, {
      responseType: 'blob',
    });
    const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SierraPure-LabReport-${batchNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
