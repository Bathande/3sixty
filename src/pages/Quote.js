import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { sendQuoteEmail } from '../services/emailService';
import './Quote.css';

function Quote() {
  const [searchParams] = useSearchParams();
  const { products, loading: productsLoading } = useProducts();

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: searchParams.get('product') || '',
    quantity: searchParams.get('qty') || '',
    brandingMethod: '',
    message: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await sendQuoteEmail(form);
      setSubmitted(true);
    } catch (err) {
      console.error('EmailJS error:', err);
      setError('Failed to send your request. Please try again or call us on 031 001 6467.');
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <main className="quote-page">
        <div className="container">
          <div className="quote-success">
            <span style={{ fontSize: '4rem' }}>✅</span>
            <h1>Quote Request Sent!</h1>
            <p>Thank you, <strong>{form.name}</strong>. We'll get back to you within 24 hours.</p>
            <p style={{ marginTop: 8, color: '#888', fontSize: '0.9rem' }}>
              A copy has been sent to <strong>admin@3sixtybranding.co.za</strong>
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Build product options grouped by category
  const grouped = products.reduce((acc, p) => {
    const cat = p.category?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <main className="quote-page">
      <div className="container">
        <div className="quote-header">
          <h1>Request a Quote</h1>
          <p>Fill in the form below and our team will get back to you within 24 hours.</p>
        </div>

        <form className="quote-form" onSubmit={handleSubmit}>
          {error && <div className="quote-error">{error}</div>}

          <div className="form-grid">
            {/* Contact details */}
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="e.g. 082 555 0000" />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company Name</label>
              <input id="company" name="company" type="text" value={form.company} onChange={handleChange} placeholder="Company / organisation" />
            </div>

            {/* Product dropdown */}
            <div className="form-group form-full-grid">
              <label htmlFor="product">Product *</label>
              <select id="product" name="product" required value={form.product} onChange={handleChange} disabled={productsLoading}>
                <option value="">{productsLoading ? 'Loading products...' : '— Select a product —'}</option>
                {Object.entries(grouped).map(([cat, prods]) => (
                  <optgroup key={cat} label={cat}>
                    {prods.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}{p.sku ? ` (${p.sku})` : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Quantity & branding */}
            <div className="form-group">
              <label htmlFor="quantity">Quantity Required</label>
              <input id="quantity" name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} placeholder="e.g. 50" />
            </div>
            <div className="form-group">
              <label htmlFor="brandingMethod">Branding Method</label>
              <select id="brandingMethod" name="brandingMethod" value={form.brandingMethod} onChange={handleChange}>
                <option value="">Select branding method</option>
                <option value="Screen Printing">Screen Printing</option>
                <option value="Embroidery">Embroidery</option>
                <option value="DTF (Direct to Film)">DTF (Direct to Film)</option>
                <option value="Sublimation">Sublimation</option>
                <option value="Laser Engraving">Laser Engraving</option>
                <option value="Full Colour Digital Print">Full Colour Digital Print</option>
                <option value="Not Sure - Advise Me">Not Sure — Advise Me</option>
              </select>
            </div>
          </div>

          <div className="form-group form-full">
            <label htmlFor="message">Additional Notes</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your project, deadline, artwork status, or any special requirements..."
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>
            {sending ? 'Sending...' : 'Submit Quote Request'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Quote;
