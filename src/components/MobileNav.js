import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './MobileNav.css';

function MobileNav({ onQuoteOpen }) {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <NavLink to="/" end className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
        <span>Home</span>
      </NavLink>

      <NavLink to="/products" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="3" width="7" height="7" rx="1" />
          <rect x="15" y="3" width="7" height="7" rx="1" />
          <rect x="2" y="14" width="7" height="7" rx="1" />
          <rect x="15" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>Products</span>
      </NavLink>

      <button className="mobile-nav-item mobile-nav-quote" onClick={onQuoteOpen} aria-label="Get a quote">
        <div className="quote-fab">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <span>Quote</span>
      </button>

      <NavLink to="/cart" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
        <div className="mobile-nav-cart-wrap">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 20a1 1 0 1 0 2 0 1 1 0 0 0-2 0M20 20a1 1 0 1 0 2 0 1 1 0 0 0-2 0M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {totalItems > 0 && <span className="mobile-cart-badge">{totalItems}</span>}
        </div>
        <span>Cart</span>
      </NavLink>

      <NavLink to="/contact" className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
        </svg>
        <span>Contact</span>
      </NavLink>
    </nav>
  );
}

export default MobileNav;
