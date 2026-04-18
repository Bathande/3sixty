import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About 3Sixty</h1>
          <p>Your one-stop branding and display solutions partner</p>
        </div>
      </section>
      <section className="section">
        <div className="container about-content">
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>3Sixty is a full-service branding and display solutions company based in South Africa. We specialise in indoor and outdoor branding, signage, vehicle wraps, digital printing, graphic design, and custom branded products.</p>
            <p>From pull-up banners and gazebos to full exhibition setups and vehicle branding, we handle everything from concept to delivery so you can focus on what matters – growing your business.</p>
          </div>
          <div className="about-stats">
            <div className="stat-card"><span className="stat-number">10+</span><span className="stat-label">Services Offered</span></div>
            <div className="stat-card"><span className="stat-number">100%</span><span className="stat-label">Custom Branded</span></div>
            <div className="stat-card"><span className="stat-number">🇿🇦</span><span className="stat-label">SA Based</span></div>
            <div className="stat-card"><span className="stat-number">⚡</span><span className="stat-label">Fast Turnaround</span></div>
          </div>
        </div>
      </section>
      <section className="section section-grey">
        <div className="container">
          <h2 className="section-title">Why Choose 3Sixty</h2>
          <div className="why-grid">
            {[
              { icon: '🎯', title: 'One-Stop Shop', desc: 'Branding, printing, signage, design, and display solutions all under one roof.' },
              { icon: '🎨', title: 'In-House Design', desc: 'Our graphic design team creates artwork that makes your brand shine on any product.' },
              { icon: '🏗️', title: 'Quality Hardware', desc: 'Durable aluminium and steel frames built for repeated use at events and activations.' },
              { icon: '🖨️', title: 'Premium Print', desc: 'Full-colour dye sublimation, digital print, DTF, and embroidery for vibrant results.' },
              { icon: '🚚', title: 'Nationwide Delivery', desc: 'We deliver across South Africa so your branding arrives wherever you need it.' },
              { icon: '♻️', title: 'Reusable Systems', desc: 'Most of our display hardware is reusable – just reskin for your next campaign.' },
            ].map((item, i) => (
              <div key={i} className="why-card">
                <span className="why-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="container cta-content">
          <h2>Ready to Brand Your Business?</h2>
          <p>Tell us what you need and we'll make it happen.</p>
          <Link to="/quote" className="btn btn-primary btn-lg">Request a Quote</Link>
        </div>
      </section>
    </main>
  );
}

export default About;
