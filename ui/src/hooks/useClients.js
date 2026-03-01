import { useQuery } from '@tanstack/react-query';
import { clientService } from '../services/clientService';

export function useClients(segment) {
  return useQuery({
    queryKey: ['clients', segment],
    queryFn: () => clientService.getAll(segment),
    staleTime: 10 * 60 * 1000,
  });
}

export function useFeaturedClients() {
  return useQuery({
    queryKey: ['clients-featured'],
    queryFn: clientService.getFeatured,
    staleTime: 10 * 60 * 1000,
  });
}
