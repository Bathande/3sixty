import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct, useProducts } from '../hooks/useProducts';
import { categories } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id);
  const { products: allProducts } = useProducts();
  const { addItem } = useCart();
  const { showToast } = useToast();

  // ── Webprinter-style state ──
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [artworkOption, setArtworkOption] = useState('upload'); // upload | design | later
  const [artworkNote, setArtworkNote] = useState('');
  const [added, setAdded] = useState(false);

  if (loading) {
    return (
      <main className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="loading-spinner" aria-label="Loading product" />
        <p>Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <h1>Product not found</h1>
        <Link to="/products" className="btn btn-primary">Back to Products</Link>
      </main>
    );
  }

  const category = categories.find((c) => c.id === product.category);
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  // ── Determine if this product has variants (indoor branding workflow) ──
  const hasVariants = product.variants && product.variants.length > 0;
  const isIndoorBranding = product.category === 'indoor-branding';

  // Auto-select first variant if not selected
  if (hasVariants && !selectedVariant) {
    setSelectedVariant(product.variants[0]);
  }

  // Price is normalised to top-level by useProducts hook
  const displayPrice = selectedVariant?.price ?? product.price ?? 0;
  const lineTotal = displayPrice * qty;

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      alert('Please select a size/variant');
      return;
    }
    addItem(product, qty, { variant: selectedVariant, artworkOption, artworkNote });
    showToast(`✓ ${product.name} added to cart!`, 'success');
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (hasVariants && !selectedVariant) {
      alert('Please select a size/variant');
      return;
    }
    addItem(product, qty, { variant: selectedVariant, artworkOption, artworkNote });
    navigate('/checkout');
  };

  return (
    <main className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <Link to={`/products?category=${product.category}`}>{category?.name}</Link> / <span>{product.name}</span>
        </nav>

        <div className="product-detail-layout">
          {/* ── Left: Image ── */}
          <div className="product-detail-image">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <span style={{ fontSize: '6rem', opacity: 0.2 }}>📷</span>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div className="product-detail-info">
            {product.sku && <span className="product-detail-sku">SKU: {product.sku}</span>}
            {product.usage && <span className="product-detail-usage">{product.usage}</span>}
            <h1>{product.name}</h1>
            <p className="product-detail-desc">{product.description}</p>

            {/* ── Webprinter-style Customize & Estimate Panel ── */}
            {isIndoorBranding && hasVariants ? (
              <div className="customize-panel">
                <h3 className="panel-title">📦 Customize & Estimate</h3>

                {/* Size dropdown */}
                <div className="form-group">
                  <label htmlFor="size-select">Size</label>
                  <select
                    id="size-select"
                    value={selectedVariant?.label || ''}
                    onChange={(e) => {
                      const variant = product.variants.find((v) => v.label === e.target.value);
                      setSelectedVariant(variant);
                    }}
                  >
                    {product.variants.map((v) => (
                      <option key={v.label} value={v.label}>{v.label}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="form-group">
                  <label htmlFor="qty-input">Quantity</label>
                  <div className="qty-control">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                    <input
                      id="qty-input"
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                      aria-label="Quantity"
                    />
                    <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
                  </div>
                </div>

                {/* Production time */}
                {product.leadTime && (
                  <div className="form-group">
                    <label>Production Time</label>
                    <div className="info-box">{product.leadTime} + courier (2–3 days)</div>
                  </div>
                )}

                {/* Price table */}
                <div className="price-table">
                  <div className="price-row price-header">
                    <span>Quantity</span>
                    <span>Price</span>
                  </div>
                  <div className="price-row">
                    <span>{qty}</span>
                    <span>R {displayPrice.toLocaleString('en-ZA')}</span>
                  </div>
                  {qty >= 10 && (
                    <div className="price-row">
                      <span>Up to 10</span>
                      <span>R {(displayPrice * 10).toLocaleString('en-ZA')}</span>
                    </div>
                  )}
                </div>

                {/* Printing cost */}
                <div className="cost-summary">
                  <strong>Printing Cost:</strong> <span className="cost-value">R {lineTotal.toLocaleString('en-ZA')}</span>
                </div>

                {/* Artwork options */}
                <div className="form-group">
                  <label>Artwork Options</label>
                  <div className="artwork-options">
                    <button
                      className={`artwork-btn ${artworkOption === 'upload' ? 'active' : ''}`}
                      onClick={() => setArtworkOption('upload')}
                    >
                      📤 Upload Design
                    </button>
                    <button
                      className={`artwork-btn ${artworkOption === 'design' ? 'active' : ''}`}
                      onClick={() => setArtworkOption('design')}
                    >
                      🖥 Design Online
                    </button>
                    <button
                      className={`artwork-btn ${artworkOption === 'later' ? 'active' : ''}`}
                      onClick={() => setArtworkOption('later')}
                    >
                      🎨 Upload Later
                    </button>
                  </div>
                  {artworkOption === 'later' && (
                    <textarea
                      className="artwork-note"
                      placeholder="Add any notes about your artwork (optional)"
                      value={artworkNote}
                      onChange={(e) => setArtworkNote(e.target.value)}
                    />
                  )}
                </div>

                {/* Add to cart buttons */}
                <div className="action-buttons">
                  <button className="btn btn-primary btn-add" onClick={handleAddToCart}>
                    {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                  </button>
                  <button className="btn btn-buy-now" onClick={handleBuyNow}>
                    ⚡ Buy Now
                  </button>
                </div>
              </div>
            ) : (
              /* ── Standard product (no variants) ── */
              <div className="standard-buy-section">
                <p className="product-detail-price">R {displayPrice.toLocaleString('en-ZA')}</p>
                <p className="product-detail-price-note">Incl. VAT | Branding quoted separately</p>
                <div className="product-buy-section">
                  <div className="qty-control">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                    <input type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))} />
                    <button onClick={() => setQty((q) => q + 1)}>+</button>
                  </div>
                  <button className="btn btn-primary btn-add" onClick={handleAddToCart}>
                    {added ? '✓ Added!' : '🛒 Add to Cart'}
                  </button>
                  <button className="btn btn-buy-now" onClick={handleBuyNow}>⚡ Buy Now</button>
                </div>
              </div>
            )}

            {/* ── Features & Specs (collapsible sections) ── */}
            {product.features && product.features.length > 0 && (
              <details className="product-detail-section" open>
                <summary>Key Features</summary>
                <ul className="features-list">
                  {product.features.map((f, i) => (
                    <li key={i}>✔ {f}</li>
                  ))}
                </ul>
              </details>
            )}

            {product.specs && Object.keys(product.specs).length > 0 && (
              <details className="product-detail-section">
                <summary>Specifications</summary>
                <table className="detail-table">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key}>
                        <td>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</td>
                        <td>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="related-section">
            <h2>Related Products</h2>
            <div className="products-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default ProductDetail;
