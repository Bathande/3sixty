import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'Standard Delivery (5-7 business days)', price: 150 },
  { id: 'express', name: 'Express Delivery (2-3 business days)', price: 350 },
  { id: 'collect', name: 'Collect from Warehouse (Free)', price: 0 },
];

const PAYMENT_METHODS = [
  { id: 'eft', name: 'EFT / Bank Transfer', icon: '🏦' },
  { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
];

function Checkout() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('eft');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', company: '',
    address: '', address2: '', city: '', province: '', postalCode: '',
    notes: '',
  });

  const subtotal = items.reduce((sum, i) => sum + (i.product.price * i.qty), 0);
  const shippingCost = SHIPPING_OPTIONS.find(s => s.id === shipping)?.price || 0;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="container">
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </main>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const order = {
      id: 'ORD-' + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      items: items.map(i => ({ name: i.product.name, sku: i.product.sku, qty: i.qty, price: i.product.price })),
      customer: form,
      shipping: SHIPPING_OPTIONS.find(s => s.id === shipping),
      payment: PAYMENT_METHODS.find(p => p.id === payment),
      subtotal, shippingCost, total,
    };
    // In production, this would POST to your backend/payment gateway
    console.log('Order placed:', order);
    clearCart();
    navigate('/order-confirmation', { state: { order } });
  };

  return (
    <main className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <span className={step >= 1 ? 'step active' : 'step'}>1. Details</span>
          <span className={step >= 2 ? 'step active' : 'step'}>2. Shipping</span>
          <span className={step >= 3 ? 'step active' : 'step'}>3. Payment</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            <div className="checkout-form">
              {/* Step 1: Customer Details */}
              {step === 1 && (
                <div className="checkout-section">
                  <h2>Your Details</h2>
                  <p className="checkout-note">No account needed — just fill in your details below.</p>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input id="firstName" name="firstName" required value={form.firstName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input id="lastName" name="lastName" required value={form.lastName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group form-full">
                      <label htmlFor="company">Company Name (optional)</label>
                      <input id="company" name="company" value={form.company} onChange={handleChange} />
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={() => {
                    if (form.firstName && form.lastName && form.email && form.phone) setStep(2);
                  }}>Continue to Shipping →</button>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div className="checkout-section">
                  <h2>Delivery Address</h2>
                  <div className="form-grid">
                    <div className="form-group form-full">
                      <label htmlFor="address">Street Address *</label>
                      <input id="address" name="address" required value={form.address} onChange={handleChange} />
                    </div>
                    <div className="form-group form-full">
                      <label htmlFor="address2">Apartment / Suite / Unit (optional)</label>
                      <input id="address2" name="address2" value={form.address2} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input id="city" name="city" required value={form.city} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="province">Province *</label>
                      <select id="province" name="province" required value={form.province} onChange={handleChange}>
                        <option value="">Select province</option>
                        <option>Gauteng</option><option>Western Cape</option><option>KwaZulu-Natal</option>
                        <option>Eastern Cape</option><option>Free State</option><option>Limpopo</option>
                        <option>Mpumalanga</option><option>North West</option><option>Northern Cape</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="postalCode">Postal Code *</label>
                      <input id="postalCode" name="postalCode" required value={form.postalCode} onChange={handleChange} />
                    </div>
                  </div>
                  <h3 className="mt-24">Shipping Method</h3>
                  <div className="shipping-options">
                    {SHIPPING_OPTIONS.map(opt => (
                      <label key={opt.id} className={`shipping-option ${shipping === opt.id ? 'selected' : ''}`}>
                        <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} />
                        <span className="shipping-name">{opt.name}</span>
                        <span className="shipping-price">{opt.price === 0 ? 'Free' : `R ${opt.price}`}</span>
                      </label>
                    ))}
                  </div>
                  <div className="checkout-nav">
                    <button type="button" className="btn btn-outline-dark" onClick={() => setStep(1)}>← Back</button>
                    <button type="button" className="btn btn-primary" onClick={() => {
                      if (shipping === 'collect' || (form.address && form.city && form.province && form.postalCode)) setStep(3);
                    }}>Continue to Payment →</button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="checkout-section">
                  <h2>Payment Method</h2>
                  <div className="payment-options">
                    {PAYMENT_METHODS.map(pm => (
                      <label key={pm.id} className={`payment-option ${payment === pm.id ? 'selected' : ''}`}>
                        <input type="radio" name="payment" value={pm.id} checked={payment === pm.id} onChange={() => setPayment(pm.id)} />
                        <span className="payment-icon">{pm.icon}</span>
                        <span>{pm.name}</span>
                      </label>
                    ))}
                  </div>
                  {payment === 'eft' && (
                    <div className="payment-info">
                      <p>You will receive our banking details via email after placing your order. Your order will be processed once payment is confirmed.</p>
                    </div>
                  )}
                  {payment === 'card' && (
                    <div className="payment-info">
                      <p>You will be redirected to our secure payment gateway after placing your order.</p>
                    </div>
                  )}
                  <div className="form-group form-full">
                    <label htmlFor="notes">Order Notes (optional)</label>
                    <textarea id="notes" name="notes" rows="3" value={form.notes} onChange={handleChange} placeholder="Special instructions, branding requirements, etc."></textarea>
                  </div>
                  <div className="checkout-nav">
                    <button type="button" className="btn btn-outline-dark" onClick={() => setStep(2)}>← Back</button>
                    <button type="submit" className="btn btn-primary btn-lg">Place Order — R {total.toLocaleString('en-ZA')}</button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="checkout-summary">
              <h3>Order Summary</h3>
              <div className="checkout-items">
                {items.map(item => (
                  <div key={item.key} className="checkout-item">
                    <div className="checkout-item-img">
                      {item.product.image ? <img src={item.product.image} alt={item.product.name} /> : <span>📷</span>}
                      <span className="checkout-item-qty">{item.qty}</span>
                    </div>
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.product.name}</span>
                      <span className="checkout-item-sku">{item.product.sku}</span>
                    </div>
                    <span className="checkout-item-price">R {(item.product.price * item.qty).toLocaleString('en-ZA')}</span>
                  </div>
                ))}
              </div>
              <div className="summary-row"><span>Subtotal</span><span>R {subtotal.toLocaleString('en-ZA')}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `R ${shippingCost}`}</span></div>
              <div className="summary-row summary-total"><span>Total</span><span>R {total.toLocaleString('en-ZA')}</span></div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
