import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { categories } from '../data/products'; // categories stay local (static list)
import ProductCard from '../components/ProductCard';
import './Products.css';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('name');

  const { products, loading, error } = useProducts();

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'price-asc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price-desc') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const activeCategoryName =
    categories.find((c) => c.id === activeCategory)?.name || 'All Products';

  return (
    <main className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>{searchQuery ? `Search: "${searchQuery}"` : activeCategoryName}</h1>
          {!loading && (
            <p>
              {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        <div className="products-layout">
          <aside className="products-sidebar">
            <h3>Categories</h3>
            <ul className="category-filter">
              <li>
                <button
                  className={!activeCategory ? 'active' : ''}
                  onClick={() => setSearchParams({})}
                >
                  All Products ({products.length})
                </button>
              </li>
              {categories
                .filter((c) => products.some((p) => p.category === c.id))
                .map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  return (
                    <li key={cat.id}>
                      <button
                        className={activeCategory === cat.id ? 'active' : ''}
                        onClick={() => setSearchParams({ category: cat.id })}
                      >
                        {cat.name} ({count})
                      </button>
                    </li>
                  );
                })}
            </ul>
          </aside>

          <div className="products-main">
            <div className="products-toolbar">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name A–Z</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {loading && (
              <div className="products-loading">
                <div className="loading-spinner" aria-label="Loading products" />
                <p>Loading products...</p>
              </div>
            )}

            {error && (
              <div className="products-error">
                <p>⚠️ Could not load products: {error}</p>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="no-results">
                <p>No products found. Try a different search or category.</p>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="products-grid">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Products;
