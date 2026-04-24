import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addOrder } from '../services/ordersService';
import { sendOrderEmail, sendEftEmail } from '../services/emailService';
import { redirectToPayfast } from '../services/payfastService';
import './Checkout.css';

const SHIPPING_OPTIONS = [
  { id: 'eco', name: 'ECO Road (2–3 business days)', price: 100 },
  { id: 'overnight', name: 'Overnight (next business day)', price: 146 },
  { id: 'collect', name: 'Collect from Durban CBD (Free)', price: 0 },
];

const PAYMENT_METHODS = [
  { id: 'payfast', name: 'Pay Online (Card / EFT / SnapScan / Zapper)', icon: '💳', desc: 'Secure payment via PayFast — all major cards, instant EFT, SnapScan & Zapper accepted.' },
  { id: 'eft',     name: 'Manual EFT / Bank Transfer',                  icon: '🏦', desc: 'We will email you our banking details. Production starts once payment clears.' },
];

function Checkout() {
  const { items, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState('eco');
  const [payment, setPayment] = useState('payfast');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', company: '',
    address: '', address2: '', city: '', province: '', postalCode: '', notes: '',
  });

  // Pre-fill form from profile when user is logged in
  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        company: profile.company || '',
        address: profile.address || '',
        city: profile.city || '',
        province: profile.province || '',
        postalCode: profile.postalCode || '',
      }));
    }
  }, [profile, user]);

  const itemPrice = (item) => item.options?.variant?.price || item.product.price || 0;
  const subtotal = items.reduce((sum, i) => sum + itemPrice(i) * i.qty, 0);
  const shippingCost = SHIPPING_OPTIONS.find((s) => s.id === shipping)?.price || 0;
  const total = subtotal + shippingCost;

  if (items.length === 0 && !submitting) {
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

  const handleChange = (e) => {
    const value = e.target.value.replace(/<[^>]*>/g, '');
    setForm({ ...form, [e.target.name]: value });
    // Clear error on change
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim())  e.lastName  = 'Last name is required';
    if (!form.email.trim())     e.email     = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.phone.trim())     e.phone     = 'Phone number is required';
    else if (form.phone.replace(/\D/g, '').length < 9) e.phone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    if (shipping === 'collect') return true;
    const e = {};
    if (!form.address.trim())    e.address    = 'Street address is required';
    if (!form.city.trim())       e.city       = 'City is required';
    if (!form.province)          e.province   = 'Please select a province';
    if (!form.postalCode.trim()) e.postalCode = 'Postal code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const orderNumber = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit e.g. "483921"

    const order = {
      orderId:     `ORD-${orderNumber}`,
      orderNumber: orderNumber,
      date: new Date().toISOString(),
      userId: user?.uid || null,
      isGuest: !user,
      items: items.map((i) => ({
        name: i.product.name,
        sku: i.product.sku,
        qty: i.qty,
        price: itemPrice(i),
        variant: i.options?.variant?.label || null,
        artworkOption: i.options?.artworkOption || null,
      })),
      customer: form,
      shipping: SHIPPING_OPTIONS.find((s) => s.id === shipping),
      payment: PAYMENT_METHODS.find((p) => p.id === payment),
      subtotal,
      shippingCost,
      total,
      paymentStatus: payment === 'payfast' ? 'pending_payfast' : 'pending_eft',
    };

    // Save to Firestore — non-blocking
    addOrder(order).catch((err) => console.error('[Order] Firestore save failed:', err));

    // Send admin notification email
    try {
      await sendOrderEmail(order);
    } catch (emailErr) {
      console.error('[Order] Email failed:', emailErr);
    }

    // Send EFT banking details to customer if they chose EFT
    if (payment === 'eft') {
      sendEftEmail(order).catch((err) => console.error('[EFT] Customer email failed:', err));
    }

    if (payment === 'payfast') {
      clearCart();
      redirectToPayfast(order);
    } else {
      clearCart();
      navigate('/order-confirmation', { state: { order } });
    }
  };

  return (
    <main className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        {/* Auth banner for guests */}
        {!user && (
          <div className="checkout-auth-banner">
            <div className="auth-banner-text">
              <strong>Have an account?</strong> Sign in to auto-fill your details and track your orders.
            </div>
            <Link
              to="/auth"
              state={{ returnTo: '/checkout', mode: 'login' }}
              className="btn-auth-banner"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Logged in greeting */}
        {user && profile && (
          <div className="checkout-user-banner">
            👋 Welcome back, <strong>{profile.firstName}</strong>! Your details have been pre-filled.
          </div>
        )}

        <div className="checkout-steps">
          <span className={step >= 1 ? 'step active' : 'step'}>1. Details</span>
          <span className="step-sep">›</span>
          <span className={step >= 2 ? 'step active' : 'step'}>2. Shipping</span>
          <span className="step-sep">›</span>
          <span className={step >= 3 ? 'step active' : 'step'}>3. Payment</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            <div className="checkout-form">

              {/* ── Step 1: Customer Details ── */}
              {step === 1 && (
                <div className="checkout-section">
                  <h2>Your Details</h2>
                  {!user && (
                    <p className="checkout-note">
                      Checking out as guest.{' '}
                      <Link to="/auth" state={{ returnTo: '/checkout', mode: 'register' }}>
                        Create an account
                      </Link>{' '}
                      to save your details for next time.
                    </p>
                  )}
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input id="firstName" name="firstName" required value={form.firstName} onChange={handleChange} placeholder="First name" className={errors.firstName ? 'input-error' : ''} />
                      {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input id="lastName" name="lastName" required value={form.lastName} onChange={handleChange} placeholder="Last name" className={errors.lastName ? 'input-error' : ''} />
                      {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" readOnly={!!user} className={`${user ? 'input-readonly' : ''} ${errors.email ? 'input-error' : ''}`} />
                      {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="e.g. 082 555 0000" className={errors.phone ? 'input-error' : ''} />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>
                    <div className="form-group form-full">
                      <label htmlFor="company">Company Name (optional)</label>
                      <input id="company" name="company" value={form.company} onChange={handleChange} placeholder="Company / organisation" />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => { if (validateStep1()) setStep(2); }}
                  >
                    Continue to Shipping →
                  </button>
                </div>
              )}

              {/* ── Step 2: Shipping ── */}
              {step === 2 && (
                <div className="checkout-section">
                  <h2>Delivery Address</h2>
                  <div className="form-grid">
                    <div className="form-group form-full">
                      <label htmlFor="address">Street Address *</label>
                      <input id="address" name="address" required value={form.address} onChange={handleChange} placeholder="123 Main Street" className={errors.address ? 'input-error' : ''} />
                      {errors.address && <span className="field-error">{errors.address}</span>}
                    </div>
                    <div className="form-group form-full">
                      <label htmlFor="address2">Apartment / Unit (optional)</label>
                      <input id="address2" name="address2" value={form.address2} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input id="city" name="city" required value={form.city} onChange={handleChange} placeholder="City" className={errors.city ? 'input-error' : ''} />
                      {errors.city && <span className="field-error">{errors.city}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="province">Province *</label>
                      <select id="province" name="province" required value={form.province} onChange={handleChange} className={errors.province ? 'input-error' : ''}>
                        <option value="">Select province</option>
                        <option>Gauteng</option>
                        <option>Western Cape</option>
                        <option>KwaZulu-Natal</option>
                        <option>Eastern Cape</option>
                        <option>Free State</option>
                        <option>Limpopo</option>
                        <option>Mpumalanga</option>
                        <option>North West</option>
                        <option>Northern Cape</option>
                      </select>
                      {errors.province && <span className="field-error">{errors.province}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="postalCode">Postal Code *</label>
                      <input id="postalCode" name="postalCode" required value={form.postalCode} onChange={handleChange} placeholder="4001" className={errors.postalCode ? 'input-error' : ''} />
                      {errors.postalCode && <span className="field-error">{errors.postalCode}</span>}
                    </div>
                  </div>

                  <h3 className="mt-24">Shipping Method</h3>
                  <div className="shipping-options">
                    {SHIPPING_OPTIONS.map((opt) => (
                      <label key={opt.id} className={`shipping-option ${shipping === opt.id ? 'selected' : ''}`}>
                        <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} />
                        <span className="shipping-name">{opt.name}</span>
                        <span className="shipping-price">{opt.price === 0 ? 'Free' : `R ${opt.price}`}</span>
                      </label>
                    ))}
                  </div>

                  <div className="checkout-nav">
                    <button type="button" className="btn btn-outline-dark" onClick={() => setStep(1)}>← Back</button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => { if (validateStep2()) setStep(3); }}
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Payment ── */}
              {step === 3 && (
                <div className="checkout-section">
                  <h2>Payment Method</h2>
                  <div className="payment-options">
                    {PAYMENT_METHODS.map((pm) => (
                      <label key={pm.id} className={`payment-option ${payment === pm.id ? 'selected' : ''}`}>
                        <input type="radio" name="payment" value={pm.id} checked={payment === pm.id} onChange={() => setPayment(pm.id)} />
                        <span className="payment-icon">{pm.icon}</span>
                        <div className="payment-label">
                          <span className="payment-name">{pm.name}</span>
                          {pm.desc && <span className="payment-desc">{pm.desc}</span>}
                        </div>
                      </label>
                    ))}
                  </div>

                  {payment === 'payfast' && (
                    <div className="payment-info payment-info-payfast">
                      <p>🔒 You will be securely redirected to PayFast to complete your payment. Accepted: Visa, Mastercard, Instant EFT, SnapScan, Zapper, Mobicred.</p>
                      <div className="payfast-badges">
                        <span>VISA</span>
                        <span>Mastercard</span>
                        <span>Instant EFT</span>
                        <span>SnapScan</span>
                        <span>Zapper</span>
                      </div>
                    </div>
                  )}
                  {payment === 'eft' && (
                    <div className="payment-info">
                      <p>You will receive our banking details via email after placing your order. Production starts once payment is confirmed.</p>
                    </div>
                  )}

                  <div className="form-group form-full" style={{ marginBottom: 24 }}>
                    <label htmlFor="notes">Order Notes (optional)</label>
                    <textarea id="notes" name="notes" rows="3" value={form.notes} onChange={handleChange} placeholder="Special instructions, branding requirements, artwork notes, etc." />
                  </div>

                  <div className="checkout-nav">
                    <button type="button" className="btn btn-outline-dark" onClick={() => setStep(2)}>← Back</button>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                      {submitting
                        ? 'Processing...'
                        : payment === 'payfast'
                          ? `Pay R ${total.toLocaleString('en-ZA')} via PayFast →`
                          : `Place Order — R ${total.toLocaleString('en-ZA')}`
                      }
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Order Summary Sidebar ── */}
            <div className="checkout-summary">
              <h3>Order Summary</h3>
              <div className="checkout-items">
                {items.map((item) => (
                  <div key={item.key} className="checkout-item">
                    <div className="checkout-item-img">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} />
                      ) : (
                        <span>📷</span>
                      )}
                      <span className="checkout-item-qty">{item.qty}</span>
                    </div>
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.product.name}</span>
                      {item.options?.variant && (
                        <span className="checkout-item-variant">{item.options.variant.label}</span>
                      )}
                      <span className="checkout-item-sku">{item.product.sku}</span>
                    </div>
                    <span className="checkout-item-price">
                      R {(itemPrice(item) * item.qty).toLocaleString('en-ZA')}
                    </span>
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
