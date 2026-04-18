import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../data/products';
import './Services.css';

function Services() {
  return (
    <main className="services-page">
      <section className="about-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Complete branding, printing, and display solutions under one roof</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="services-full-grid">
            {services.map(svc => (
              <div key={svc.id} className="service-full-card">
                <img src={svc.image} alt={svc.name} className="service-full-img" />
                <div className="service-full-info">
                  <h2>{svc.name}</h2>
                  <p>{svc.description}</p>
                  <Link to="/quote" className="btn btn-primary">Get a Quote</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="container cta-content">
          <h2>Not Sure What You Need?</h2>
          <p>Our team will help you find the right solution for your brand and budget.</p>
          <Link to="/contact" className="btn btn-primary btn-lg">Contact Us</Link>
        </div>
      </section>
    </main>
  );
}

export default Services;
