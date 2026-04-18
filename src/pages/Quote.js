import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Quote.css';

function Quote() {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: searchParams.get('product') || '',
    sku: searchParams.get('sku') || '',
    color: searchParams.get('color') || '',
    quantity: searchParams.get('qty') || '',
    brandingMethod: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="quote-page">
        <div className="container">
          <div className="quote-success">
            <span style={{ fontSize: '4rem' }}>✅</span>
            <h1>Quote Request Received</h1>
            <p>Thank you, {form.name}. We will get back to you within 24 hours with a detailed quotation.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="quote-page">
      <div className="container">
        <div className="quote-header">
          <h1>Request a Quote</h1>
          <p>Fill in the form below and our team will get back to you with a detailed quotation within 24 hours.</p>
        </div>
        <form className="quote-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company Name</label>
              <input id="company" name="company" type="text" value={form.company} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="product">Product Name</label>
              <input id="product" name="product" type="text" value={form.product} onChange={handleChange} placeholder="e.g. Altitude Hydro Water Bottle" />
            </div>
            <div className="form-group">
              <label htmlFor="sku">Product SKU</label>
              <input id="sku" name="sku" type="text" value={form.sku} onChange={handleChange} placeholder="e.g. 3S-DW-001" />
            </div>
            <div className="form-group">
              <label htmlFor="color">Colour Preference</label>
              <input id="color" name="color" type="text" value={form.color} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity Required</label>
              <input id="quantity" name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="brandingMethod">Branding Method</label>
              <select id="brandingMethod" name="brandingMethod" value={form.brandingMethod} onChange={handleChange}>
                <option value="">Select branding method</option>
                <option value="screen-print">Screen Printing</option>
                <option value="embroidery">Embroidery</option>
                <option value="laser-engrave">Laser Engraving</option>
                <option value="full-colour">Full Colour Print</option>
                <option value="sublimation">Sublimation</option>
                <option value="debossing">Debossing</option>
                <option value="unsure">Not Sure - Advise Me</option>
              </select>
            </div>
          </div>
          <div className="form-group form-full">
            <label htmlFor="message">Additional Notes</label>
            <textarea id="message" name="message" rows="4" value={form.message} onChange={handleChange} placeholder="Tell us about your project, deadline, or any special requirements..."></textarea>
          </div>
          <button type="submit" className="btn btn-primary btn-lg">Submit Quote Request</button>
        </form>
      </div>
    </main>
  );
}

export default Quote;
