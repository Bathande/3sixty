import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
  const { items, updateQty, removeItem } = useCart();

  const subtotal = items.reduce((sum, i) => sum + (i.product.price * i.qty), 0);
  const vat = subtotal * 0.15;
  const total = subtotal;

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="container">
          <h1>Your Cart</h1>
          <div className="cart-empty">
            <span style={{ fontSize: '4rem' }}>🛒</span>
            <h2>Your cart is empty</h2>
            <p>Browse our products and add items to get started.</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container">
        <h1>Your Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-header-row">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>
            {items.map(item => (
              <div key={item.key} className="cart-item">
                <div className="cart-item-product">
                  <Link to={`/product/${item.product.id}`} className="cart-item-img">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} />
                    ) : (
                      <span>📷</span>
                    )}
                  </Link>
                  <div>
                    <Link to={`/product/${item.product.id}`} className="cart-item-name">{item.product.name}</Link>
                    <span className="cart-item-sku">{item.product.sku}</span>
                  </div>
                </div>
                <div className="cart-item-price">R {item.product.price.toLocaleString('en-ZA')}</div>
                <div className="cart-item-qty">
                  <div className="qty-sm">
                    <button onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-total">R {(item.product.price * item.qty).toLocaleString('en-ZA')}</div>
                <button className="cart-item-remove" onClick={() => removeItem(item.key)} aria-label={`Remove ${item.product.name}`}>✕</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal (incl. VAT)</span>
              <span>R {subtotal.toLocaleString('en-ZA')}</span>
            </div>
            <div className="summary-row summary-vat">
              <span>VAT (15% included)</span>
              <span>R {vat.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-row summary-shipping">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>R {total.toLocaleString('en-ZA')}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-lg btn-block">
              Proceed to Checkout
            </Link>
            <Link to="/products" className="btn-continue">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;
