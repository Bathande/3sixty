import { useState, useEffect } from 'react';
import { getProducts, getProductsByCategory, getProductById } from '../services/productsService';

// ── Cache version ──────────────────────────────────────────────────────────
// Bump CACHE_VERSION whenever you update products in Firestore.
// This invalidates the in-memory cache so all users get fresh data on next load.
// Format: 'YYYY-MM-DD.N' — e.g. '2026-04-25.1'
const CACHE_VERSION = '2026-04-24.1777015357655';

const _store = {
  version: null,
  all: null,
  byCategory: {},
  byId: {},
};

function getCache() {
  // If the stored version doesn't match, wipe everything
  if (_store.version !== CACHE_VERSION) {
    _store.version = CACHE_VERSION;
    _store.all = null;
    _store.byCategory = {};
    _store.byId = {};
  }
  return _store;
}

/** Bust the full cache — call after any Firestore write */
export function clearProductCache() {
  _store.all = null;
  _store.byCategory = {};
  _store.byId = {};
}

/**
 * Normalise a product from Firestore so price is always at the top level.
 * Handles both old format (price in variants[0].price) and new format (price at root).
 */
function normalise(product) {
  // If top-level price is missing/null, try to pull from first variant
  const price =
    product.price != null
      ? product.price
      : product.variants?.[0]?.price ?? null;

  return { ...product, price };
}

/**
 * Fetch all products from Firestore.
 * Returns { products, loading, error }
 */
export function useProducts() {
  const cache = getCache();
  const [products, setProducts] = useState(cache.all ? cache.all : []);
  const [loading, setLoading] = useState(!cache.all);
  const [error, setError] = useState(null);

  useEffect(() => {
    const c = getCache();
    if (c.all) return;
    setLoading(true);
    getProducts()
      .then((data) => {
        const normalised = data.map(normalise);
        getCache().all = normalised;
        setProducts(normalised);
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
  const cache = getCache();
  const [products, setProducts] = useState(cache.byCategory[category] || []);
  const [loading, setLoading] = useState(!cache.byCategory[category]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;
    const c = getCache();
    if (c.byCategory[category]) return;
    setLoading(true);
    getProductsByCategory(category)
      .then((data) => {
        const normalised = data.map(normalise);
        getCache().byCategory[category] = normalised;
        setProducts(normalised);
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
  const cache = getCache();
  const [product, setProduct] = useState(cache.byId[id] ? cache.byId[id] : null);
  const [loading, setLoading] = useState(!cache.byId[id]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const c = getCache();
    if (c.byId[id]) return;
    setLoading(true);
    getProductById(id)
      .then((data) => {
        const normalised = normalise(data);
        getCache().byId[id] = normalised;
        setProduct(normalised);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}
