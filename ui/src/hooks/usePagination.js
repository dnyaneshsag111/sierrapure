import { useState, useMemo } from 'react';

/**
 * Simple client-side pagination hook.
 * @param {Array} items  - full array to paginate
 * @param {number} pageSize - rows per page (default 10)
 */
export function usePagination(items = [], pageSize = 10) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(items.length / pageSize);
  const paged      = useMemo(
    () => items.slice(page * pageSize, page * pageSize + pageSize),
    [items, page, pageSize]
  );

  // Reset to page 0 when items change length (e.g. after filter)
  const reset = () => setPage(0);

  return { paged, page, setPage, totalPages, reset };
}
