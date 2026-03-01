import { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { labReportService } from '../services/labReportService';
import { clientService } from '../services/clientService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { data: latestReport, isLoading: reportLoading } = useQuery({
    queryKey: ['latest-lab-report'],
    queryFn: labReportService.getLatest,
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });

  const { data: featuredClients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients-featured'],
    queryFn: clientService.getFeatured,
    staleTime: 10 * 60 * 1000,
  });

  const value = useMemo(() => ({
    latestReport,
    featuredClients,
    isLoading: reportLoading || clientsLoading,
  }), [latestReport, featuredClients, reportLoading, clientsLoading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
