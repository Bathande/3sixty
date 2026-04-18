import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="contact-page">
      <section className="about-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We would love to hear from you</p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-layout">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <strong>Address</strong>
                <p>Johannesburg, Gauteng<br />South Africa</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <strong>Phone</strong>
                <p>+27 (0) 11 000 0000</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>info@3sixty.co.za</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🕐</span>
              <div>
                <strong>Business Hours</strong>
                <p>Mon - Fri: 08:00 - 17:00<br />Sat - Sun: Closed</p>
              </div>
            </div>
          </div>
          <div className="contact-form-wrap">
            {submitted ? (
              <div className="quote-success">
                <span style={{ fontSize: '3rem' }}>✅</span>
                <h2>Message Sent</h2>
                <p>Thank you for reaching out. We will respond within 24 hours.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Send us a Message</h2>
                <div className="form-group">
                  <label htmlFor="c-name">Full Name *</label>
                  <input id="c-name" type="text" required />
                </div>
                <div className="form-group">
                  <label htmlFor="c-email">Email Address *</label>
                  <input id="c-email" type="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="c-phone">Phone Number</label>
                  <input id="c-phone" type="tel" />
                </div>
                <div className="form-group">
                  <label htmlFor="c-subject">Subject *</label>
                  <input id="c-subject" type="text" required />
                </div>
                <div className="form-group">
                  <label htmlFor="c-message">Message *</label>
                  <textarea id="c-message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
