import { useQuery } from '@tanstack/react-query';
import { labReportService } from '../services/labReportService';

export function useLabReports(page = 0, size = 10) {
  return useQuery({
    queryKey: ['lab-reports', page, size],
    queryFn: () => labReportService.getAll(page, size),
    keepPreviousData: true,
  });
}

export function useLatestLabReport() {
  return useQuery({
    queryKey: ['latest-lab-report'],
    queryFn: labReportService.getLatest,
    retry: 1,
  });
}

export function useLabReport(id) {
  return useQuery({
    queryKey: ['lab-report', id],
    queryFn: () => labReportService.getById(id),
    enabled: !!id,
  });
}

export function useLabReportByBatch(batchNumber) {
  return useQuery({
    queryKey: ['lab-report-batch', batchNumber],
    queryFn: () => labReportService.getByBatch(batchNumber),
    enabled: !!batchNumber,
  });
}
