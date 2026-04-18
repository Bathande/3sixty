import { useState, useEffect, useRef } from 'react';
import { useProducts } from './useProducts';

/**
 * useSearch — searches Firestore products in real time.
 * Returns { results, loading } based on the query string.
 */
export function useSearch(query, category = 'All Categories') {
  const { products, loading: productsLoading } = useProducts();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    let filtered = products.filter((p) => {
      const matchesQuery =
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.features?.some((f) => f.toLowerCase().includes(q));

      const matchesCategory =
        category === 'All Categories' ||
        p.category?.toLowerCase().replace(/-/g, ' ') === category.toLowerCase();

      return matchesQuery && matchesCategory;
    });

    // Sort: exact name matches first
    filtered.sort((a, b) => {
      const aExact = a.name?.toLowerCase().startsWith(q) ? 0 : 1;
      const bExact = b.name?.toLowerCase().startsWith(q) ? 0 : 1;
      return aExact - bExact;
    });

    setResults(filtered.slice(0, 8));
  }, [query, category, products]);

  return { results, loading: productsLoading && products.length === 0 };
}
