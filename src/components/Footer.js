import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <h3>3<span className="logo-accent">SIXTY</span></h3>
          <p>Your trusted partner for quality branded promotional products, corporate gifts and clothing in South Africa.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?category=clothing">Clothing</Link></li>
            <li><Link to="/products?category=drinkware">Drinkware</Link></li>
            <li><Link to="/products?category=tech">Tech & Gadgets</Link></li>
            <li><Link to="/quote">Request a Quote</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Information</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/about">Branding Methods</Link></li>
            <li><Link to="/about">Delivery Info</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p>📞 +27 (0) 11 000 0000</p>
          <p>📧 info@3sixty.co.za</p>
          <p>📍 Johannesburg, South Africa</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} 3Sixty Promotional Products. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
