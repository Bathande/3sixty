import { useState, useEffect } from 'react';
import { getProducts, getProductsByCategory, getProductById } from '../services/productsService';

// Simple in-memory cache so we don't re-fetch on every navigation
const cache = {
  all: null,
  byCategory: {},
  byId: {},
};

/**
 * Fetch all products from Firestore.
 * Returns { products, loading, error }
 */
export function useProducts() {
  const [products, setProducts] = useState(cache.all || []);
  const [loading, setLoading] = useState(!cache.all);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache.all) return; // already cached
    setLoading(true);
    getProducts()
      .then((data) => {
        cache.all = data;
        setProducts(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}

/**
 * Fetch products filtered by category from Firestore.
 * Returns { products, loading, error }
 */
export function useProductsByCategory(category) {
  const [products, setProducts] = useState(cache.byCategory[category] || []);
  const [loading, setLoading] = useState(!cache.byCategory[category]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;
    if (cache.byCategory[category]) return;
    setLoading(true);
    getProductsByCategory(category)
      .then((data) => {
        cache.byCategory[category] = data;
        setProducts(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return { products, loading, error };
}

/**
 * Fetch a single product by Firestore document ID.
 * Returns { product, loading, error }
 */
export function useProduct(id) {
  const [product, setProduct] = useState(cache.byId[id] || null);
  const [loading, setLoading] = useState(!cache.byId[id]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    if (cache.byId[id]) return;
    setLoading(true);
    getProductById(id)
      .then((data) => {
        cache.byId[id] = data;
        setProduct(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}

/** Call this after any write operation to bust the cache */
export function clearProductCache() {
  cache.all = null;
  cache.byCategory = {};
  cache.byId = {};
}
