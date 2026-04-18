import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span className="product-image-placeholder">📷</span>
        )}
        {product.sku && <span className="product-sku">{product.sku}</span>}
        {product.usage && <span className="product-usage">{product.usage}</span>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">
          {product.description ? product.description.substring(0, 90) + '...' : ''}
        </p>
        <div className="product-bottom">
          {product.price ? (
            <span className="product-price">R {product.price.toLocaleString('en-ZA')}</span>
          ) : (
            <span className="product-price-tbc">Price on request</span>
          )}
          <span className="btn-more-details">
            More Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
