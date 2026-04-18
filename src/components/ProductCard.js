import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span className="product-image-placeholder">📷</span>
        )}
        <span className="product-sku">{product.sku}</span>
        {product.usage && <span className="product-usage">{product.usage}</span>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description.substring(0, 80)}...</p>
        <div className="product-bottom">
          <span className="product-price">R {product.price?.toLocaleString('en-ZA')}</span>
          <button className="btn-add-cart" onClick={handleAdd} aria-label={`Add ${product.name} to cart`}>
            + Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
