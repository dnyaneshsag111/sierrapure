import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAll(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}
