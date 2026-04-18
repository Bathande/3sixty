import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <main className="confirmation-page">
        <div className="container" style={{ textAlign: 'center', padding: '64px 0' }}>
          <h1>No order found</h1>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="confirmation-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p className="confirmation-id">Order Reference: <strong>{order.id}</strong></p>
          <p className="confirmation-msg">
            Thank you, {order.customer.firstName}! We've received your order and will send a confirmation email to <strong>{order.customer.email}</strong>.
          </p>

          {order.payment.id === 'eft' && (
            <div className="eft-details">
              <h3>Banking Details for EFT Payment</h3>
              <table>
                <tbody>
                  <tr><td>Bank</td><td>FNB (First National Bank)</td></tr>
                  <tr><td>Account Name</td><td>3Sixty Branding (Pty) Ltd</td></tr>
                  <tr><td>Account Number</td><td>62000000000</td></tr>
                  <tr><td>Branch Code</td><td>250655</td></tr>
                  <tr><td>Reference</td><td>{order.id}</td></tr>
                </tbody>
              </table>
              <p className="eft-note">Please use your order reference as the payment reference. Your order will be processed once payment is confirmed.</p>
            </div>
          )}

          <div className="order-summary-final">
            <h3>Order Summary</h3>
            {order.items.map((item, i) => (
              <div key={i} className="order-line">
                <span>{item.name} × {item.qty}</span>
                <span>R {(item.price * item.qty).toLocaleString('en-ZA')}</span>
              </div>
            ))}
            <div className="order-line"><span>Shipping ({order.shipping.name})</span><span>{order.shippingCost === 0 ? 'Free' : `R ${order.shippingCost}`}</span></div>
            <div className="order-line order-total"><span>Total</span><span>R {order.total.toLocaleString('en-ZA')}</span></div>
          </div>

          <div className="confirmation-delivery">
            <h3>Delivery To</h3>
            <p>
              {order.customer.firstName} {order.customer.lastName}<br />
              {order.customer.company && <>{order.customer.company}<br /></>}
              {order.customer.address}{order.customer.address2 && `, ${order.customer.address2}`}<br />
              {order.customer.city}, {order.customer.province} {order.customer.postalCode}
            </p>
          </div>

          <div className="confirmation-actions">
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
            <Link to="/" className="btn btn-outline-dark">Back to Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderConfirmation;
