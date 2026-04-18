import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, categories } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <h1>Product not found</h1>
        <Link to="/products" className="btn btn-primary">Back to Products</Link>
      </main>
    );
  }

  const category = categories.find(c => c.id === product.category);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    navigate('/checkout');
  };

  return (
    <main className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <Link to={`/products?category=${product.category}`}>{category?.name}</Link> / <span>{product.name}</span>
        </nav>
        <div className="product-detail-layout">
          <div className="product-detail-image">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <span style={{ fontSize: '6rem', opacity: 0.2 }}>📷</span>
            )}
          </div>
          <div className="product-detail-info">
            <span className="product-detail-sku">SKU: {product.sku}</span>
            {product.usage && <span className="product-detail-usage">{product.usage}</span>}
            <h1>{product.name}</h1>
            <p className="product-detail-price">R {product.price?.toLocaleString('en-ZA')}</p>
            <p className="product-detail-price-note">Incl. VAT | Branding quoted separately</p>
            <p className="product-detail-desc">{product.description}</p>

            {/* Quantity & Add to Cart */}
            <div className="product-buy-section">
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <input type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} aria-label="Quantity" />
                <button onClick={() => setQty(q => q + 1)} aria-label="Increase quantity">+</button>
              </div>
              <button className="btn btn-primary btn-add" onClick={handleAddToCart}>
                {added ? '✓ Added!' : '🛒 Add to Cart'}
              </button>
              <button className="btn btn-buy-now" onClick={handleBuyNow}>
                ⚡ Buy Now
              </button>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="product-detail-section">
                <h3>Key Features</h3>
                <ul className="features-list">
                  {product.features.map((f, i) => <li key={i}>✔ {f}</li>)}
                </ul>
              </div>
            )}

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="product-detail-section">
                <h3>Specifications</h3>
                <table className="detail-table">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key}>
                        <td>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</td>
                        <td>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="related-section">
            <h2>Related Products</h2>
            <div className="products-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default ProductDetail;
