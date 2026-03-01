import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

/**
 * Fetches uploaded image assets by category from the backend.
 * Returns a map of { label -> publicUrl } and falls back gracefully.
 *
 * Categories: BOTTLE | LOGO | CLIENT_LOGO | BROCHURE
 */
export function useImageAssets(category) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['image-assets', category],
    queryFn: () =>
      api.get('/images', { params: { category } }).then((r) => r.data.data),
    staleTime: 2 * 60 * 1000,   // 2 min — refresh after upload
    cacheTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Build label → absolute URL map  e.g. { '200ml': '/api/v1/images/bottles/xxx.png' }
  const byLabel = {};
  for (const img of data) {
    byLabel[img.label] = img.publicUrl;
  }

  // first uploaded image URL — useful when label is unknown (e.g. logo uploaded as 'dark'/'white'/'primary')
  const first = data.length > 0 ? data[0].publicUrl : null;

  return { byLabel, first, images: data, isLoading };
}
