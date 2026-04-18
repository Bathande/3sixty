import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <span>📞 +27 (0) 11 000 0000</span>
          <span>📧 info@3sixty.co.za</span>
        </div>
      </div>
      <div className="header-main">
        <div className="container header-main-inner">
          <Link to="/" className="logo">
            <span className="logo-text">3<span className="logo-accent">SIXTY</span></span>
            <span className="logo-tagline">Branding & Display Solutions</span>
          </Link>
          <form className="search-bar" onSubmit={handleSearch}>
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search products" />
            <button type="submit" aria-label="Search">🔍</button>
          </form>
          <div className="header-actions">
            <Link to="/cart" className="btn-cart" aria-label={`Cart with ${totalItems} items`}>
              🛒
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
            <Link to="/quote" className="btn-quote">📋 Get a Quote</Link>
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
        <div className="container">
          <ul className="nav-list">
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setMenuOpen(false)}>All Products</Link></li>
            <li><Link to="/products?category=outdoor-branding" onClick={() => setMenuOpen(false)}>Outdoor Branding</Link></li>
            <li><Link to="/products?category=indoor-branding" onClick={() => setMenuOpen(false)}>Indoor Branding</Link></li>
            <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
            <li><Link to="/quote" onClick={() => setMenuOpen(false)} className="nav-quote">📋 Get a Quote</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
