import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();

  // PayFast returns with ?status=success&order=ORD-xxx
  const payfastStatus = searchParams.get('status');
  const payfastOrderId = searchParams.get('order');
  const fromPayfast = !!payfastStatus;

  const order = state?.order;

  // PayFast return — no state available (page was redirected externally)
  if (fromPayfast && !order) {
    return (
      <main className="confirmation-page">
        <div className="container">
          <div className="confirmation-card">
            {payfastStatus === 'success' ? (
              <>
                <div className="confirmation-icon">✅</div>
                <h1>Payment Successful!</h1>
                <p className="confirmation-id">Order Reference: <strong>{payfastOrderId}</strong></p>
                <p className="confirmation-msg">
                  Your payment has been received. We'll start production and send you a confirmation email shortly.
                </p>
                <div className="confirmation-actions">
                  <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
                  <Link to="/" className="btn btn-outline-dark">Back to Home</Link>
                </div>
              </>
            ) : (
              <>
                <div className="confirmation-icon">❌</div>
                <h1>Payment Cancelled</h1>
                <p className="confirmation-msg">Your payment was cancelled. Your cart has been cleared — please start a new order if you'd like to try again.</p>
                <div className="confirmation-actions">
                  <Link to="/products" className="btn btn-primary">Browse Products</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    );
  }

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

  const isPayfast = order.payment?.id === 'payfast';
  const isEft     = order.payment?.id === 'eft';

  return (
    <main className="confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="confirmation-icon">✅</div>
          <h1>{isPayfast ? 'Payment Successful!' : 'Order Placed Successfully!'}</h1>
          <p className="confirmation-id">Order Reference: <strong>{order.orderId}</strong></p>
          <p className="confirmation-msg">
            Thank you, {order.customer.firstName}! {isPayfast
              ? 'Your payment has been received. We\'ll start production shortly.'
              : `We've received your order and will send confirmation to `}
            {!isPayfast && <strong>{order.customer.email}</strong>}
            {!isPayfast && '.'}
          </p>

          {isEft && (
            <div className="eft-details">
              <h3>Banking Details for EFT Payment</h3>
              <table>
                <tbody>
                  <tr><td>Bank</td><td>FNB (First National Bank)</td></tr>
                  <tr><td>Account Name</td><td>3Sixty Branding (Pty) Ltd</td></tr>
                  <tr><td>Account Number</td><td>62000000000</td></tr>
                  <tr><td>Branch Code</td><td>250655</td></tr>
                  <tr><td>Reference</td><td><strong>{order.orderId}</strong></td></tr>
                </tbody>
              </table>
              <p className="eft-note">Use your order reference as the payment reference. Production starts once payment is confirmed.</p>
            </div>
          )}

          <div className="order-summary-final">
            <h3>Order Summary</h3>
            {order.items.map((item, i) => (
              <div key={i} className="order-line">
                <span>{item.name}{item.variant ? ` (${item.variant})` : ''} × {item.qty}</span>
                <span>R {(item.price * item.qty).toLocaleString('en-ZA')}</span>
              </div>
            ))}
            <div className="order-line">
              <span>Shipping ({order.shipping?.name})</span>
              <span>{order.shippingCost === 0 ? 'Free' : `R ${order.shippingCost}`}</span>
            </div>
            <div className="order-line order-total">
              <span>Total</span>
              <span>R {order.total.toLocaleString('en-ZA')}</span>
            </div>
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
