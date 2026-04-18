import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { subcategories } from '../data/subcategories';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './SubcategoryPage.css';

function SubcategoryPage() {
  const { subcategoryId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { products: allProducts, loading } = useProducts();

  const sub = subcategories[subcategoryId];

  // ── State ──
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [artworkOption, setArtworkOption] = useState('upload');
  const [artworkNote, setArtworkNote] = useState('');
  const [added, setAdded] = useState(false);

  // Filter products that belong to this subcategory
  const subcatProducts = allProducts.filter((p) =>
    sub?.productNames?.some((name) =>
      p.name?.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(p.name?.toLowerCase())
    )
  );

  // Reset selection when subcategory changes or products load
  useEffect(() => {
    if (subcatProducts.length > 0) {
      const first = subcatProducts[0];
      setSelectedProduct(first);
      setSelectedVariant(first.variants?.[0] || null);
      setQty(1);
    }
  }, [subcategoryId, subcatProducts.length]); // eslint-disable-line

  // When product changes, reset variant
  const handleProductChange = (productId) => {
    const p = subcatProducts.find((p) => p.id === productId);
    if (p) {
      setSelectedProduct(p);
      setSelectedVariant(p.variants?.[0] || null);
      setQty(1);
    }
  };

  if (!sub) {
    return (
      <main className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <h1>Category not found</h1>
        <Link to="/products" className="btn btn-primary">Browse All Products</Link>
      </main>
    );
  }

  const displayPrice = selectedVariant?.price || selectedProduct?.price || null;
  const lineTotal = displayPrice ? displayPrice * qty : null;

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addItem(selectedProduct, qty, { variant: selectedVariant, artworkOption, artworkNote });
    setAdded(true);
    showToast(`✓ ${selectedProduct.name} added to cart!`, 'success');
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;
    addItem(selectedProduct, qty, { variant: selectedVariant, artworkOption, artworkNote });
    navigate('/checkout');
  };

  const categoryLabels = {
    'indoor-branding': 'Indoor Branding',
    'outdoor-branding': 'Outdoor Branding',
    'tshirt-printing': 'T-Shirt Printing',
    'graphic-design': 'Graphic Design',
  };

  return (
    <main className="subcategory-page">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link> /
          <Link to={`/products?category=${sub.category}`}>{categoryLabels[sub.category]}</Link> /
          <span>{sub.label}</span>
        </nav>

        <div className="subcategory-layout">

          {/* ── Left: shared product image ── */}
          <div className="subcategory-image-col">
            <div className="subcategory-image-wrap">
              {selectedProduct?.image ? (
                <img
                  key={selectedProduct.id}
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                />
              ) : sub.image ? (
                <img
                  key="sub-image"
                  src={sub.image}
                  alt={sub.label}
                />
              ) : (
                <span className="img-placeholder">📷</span>
              )}
            </div>

            {/* Product description below image */}
            {selectedProduct && (
              <div className="subcategory-desc">
                <p>{selectedProduct.description}</p>
                {selectedProduct.features?.length > 0 && (
                  <details>
                    <summary>Key Features</summary>
                    <ul className="features-list">
                      {selectedProduct.features.map((f, i) => (
                        <li key={i}>✔ {f}</li>
                      ))}
                    </ul>
                  </details>
                )}
                {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                  <details>
                    <summary>Specifications</summary>
                    <table className="spec-table">
                      <tbody>
                        {Object.entries(selectedProduct.specs).map(([k, v]) => (
                          <tr key={k}>
                            <td>{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</td>
                            <td>{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Customize & Estimate panel ── */}
          <div className="subcategory-config-col">
            <h1>{sub.label}</h1>
            <p className="sub-intro">{sub.description}</p>

            <div className="customize-panel">
              <h3 className="panel-title">📦 Customize & Estimate</h3>

              {/* Step 1: Product name (variant by product) */}
              <div className="form-group">
                <label htmlFor="product-select">Product</label>
                {loading ? (
                  <div className="loading-inline">Loading products...</div>
                ) : subcatProducts.length === 0 ? (
                  <div className="loading-inline">No products found</div>
                ) : (
                  <select
                    id="product-select"
                    value={selectedProduct?.id || ''}
                    onChange={(e) => handleProductChange(e.target.value)}
                  >
                    {subcatProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Step 2: Size / variant (box dims) */}
              {selectedProduct?.variants?.length > 0 && (
                <div className="form-group">
                  <label htmlFor="variant-select">Size / Specification</label>
                  <select
                    id="variant-select"
                    value={selectedVariant?.label || ''}
                    onChange={(e) => {
                      const v = selectedProduct.variants.find(v => v.label === e.target.value);
                      setSelectedVariant(v);
                    }}
                  >
                    {selectedProduct.variants.map((v) => (
                      <option key={v.label} value={v.label}>
                        {v.label}{v.weight ? ` — ${v.weight}` : ''}{v.boxDims ? ` (${v.boxDims})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 3: Quantity */}
              <div className="form-group">
                <label>Quantity</label>
                <div className="qty-control">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    aria-label="Quantity"
                  />
                  <button onClick={() => setQty(q => q + 1)} aria-label="Increase">+</button>
                </div>
              </div>

              {/* Production time */}
              {selectedProduct?.leadTime && (
                <div className="form-group">
                  <label>Production Time</label>
                  <div className="info-box">
                    {selectedProduct.leadTime}
                    {selectedProduct.rushLeadTime && (
                      <span className="rush-note"> · Rush: {selectedProduct.rushLeadTime}</span>
                    )}
                    <span className="courier-note"> + 2–3 days courier</span>
                  </div>
                </div>
              )}

              {/* Price table */}
              {displayPrice ? (
                <>
                  <div className="price-table">
                    <div className="price-row price-header">
                      <span>Quantity</span>
                      <span>Unit Price</span>
                      <span>Total</span>
                    </div>
                    <div className={`price-row ${qty === 1 ? 'price-selected' : ''}`}>
                      <span>1</span>
                      <span>R {displayPrice.toLocaleString('en-ZA')}</span>
                      <span>R {displayPrice.toLocaleString('en-ZA')}</span>
                    </div>
                    {qty > 1 && (
                      <div className="price-row price-selected">
                        <span>{qty}</span>
                        <span>R {displayPrice.toLocaleString('en-ZA')}</span>
                        <span>R {lineTotal.toLocaleString('en-ZA')}</span>
                      </div>
                    )}
                  </div>
                  <div className="cost-summary">
                    <strong>Printing Cost:</strong>
                    <span className="cost-value">R {lineTotal.toLocaleString('en-ZA')}</span>
                  </div>
                </>
              ) : (
                <div className="price-on-request">
                  <span>💬 Price on request — </span>
                  <Link to="/quote">Get a quote</Link>
                </div>
              )}

              {/* Courier cost */}
              {selectedProduct?.courierCost && (
                <div className="courier-info">
                  🚚 Courier: R {selectedProduct.courierCost.toLocaleString('en-ZA')} ({selectedProduct.courierService})
                </div>
              )}
              {selectedProduct?.requiresQuote && (
                <div className="courier-info courier-freight">
                  🚛 Freight / collection only — <Link to="/quote">request a quote</Link>
                </div>
              )}

              {/* Artwork options */}
              <div className="form-group">
                <label>Artwork</label>
                <div className="artwork-options">
                  <button
                    className={`artwork-btn${artworkOption === 'upload' ? ' active' : ''}`}
                    onClick={() => setArtworkOption('upload')}
                    type="button"
                  >
                    📤<span>Upload Design</span>
                  </button>
                  <button
                    className={`artwork-btn${artworkOption === 'design' ? ' active' : ''}`}
                    onClick={() => setArtworkOption('design')}
                    type="button"
                  >
                    🖥<span>Design Online</span>
                  </button>
                  <button
                    className={`artwork-btn${artworkOption === 'later' ? ' active' : ''}`}
                    onClick={() => setArtworkOption('later')}
                    type="button"
                  >
                    🎨<span>Upload Later</span>
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

              {/* Action buttons */}
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  disabled={!selectedProduct}
                >
                  {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                </button>
                <button
                  className="btn btn-buy-now"
                  onClick={handleBuyNow}
                  disabled={!selectedProduct}
                >
                  ⚡ Buy Now
                </button>
              </div>

              {/* Artwork policy note */}
              <p className="artwork-policy">
                <strong>Artwork Policy:</strong> We process one set of artwork per job.
                For multiple artworks, place separate orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SubcategoryPage;
