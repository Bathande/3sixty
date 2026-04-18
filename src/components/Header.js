import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const NAV_ITEMS = [
  {
    id: 'nav-paper',
    label: 'Paper Printing',
    type: 'dropdown',
    sections: [
      {
        label: 'Flat Print',
        links: [
          { text: 'Flyers (A6 / A5 / A4)', to: '/products?category=paper-printing' },
          { text: 'Business Cards', to: '/products?category=paper-printing' },
          { text: 'Posters (A0 – A3)', to: '/products?category=paper-printing' },
          { text: 'Letterheads', to: '/products?category=paper-printing' },
          { text: 'Certificates', to: '/products?category=paper-printing' },
          { text: 'Presentation Folders', to: '/products?category=paper-printing' },
        ],
      },
    ],
  },
  {
    id: 'nav-indoor',
    label: 'Indoor Branding',
    type: 'dropdown',
    sections: [
      {
        links: [
          { text: 'Pull-Up Banners', to: '/category/pull-up-banners' },
          { text: 'Wall Banners', to: '/category/wall-banners' },
          { text: 'Pop-Up & Tables', to: '/category/popup-tables' },
        ],
      },
    ],
  },
  {
    id: 'nav-outdoor',
    label: 'Outdoor Branding',
    type: 'dropdown',
    sections: [
      {
        links: [
          { text: 'Flag Banners', to: '/category/flag-banners' },
          { text: 'A-Frames & Accessories', to: '/category/aframes-accessories' },
          { text: 'Gazebos', to: '/category/gazebos' },
        ],
      },
    ],
  },
  {
    id: 'nav-tshirt',
    label: 'T-Shirt Printing',
    type: 'dropdown',
    sections: [
      {
        links: [
          { text: 'Flex & Flock', to: '/category/flex-flock' },
          { text: 'DTF & Screen Print', to: '/category/dtf-screen' },
          { text: 'Embroidery', to: '/category/embroidery' },
        ],
      },
    ],
  },
  {
    id: 'nav-design',
    label: 'Graphic Design',
    type: 'dropdown',
    sections: [
      {
        links: [
          { text: 'Design Packages', to: '/category/design-packages' },
          { text: 'Individual Services', to: '/category/individual-design' },
        ],
      },
    ],
  },
];

const SEARCH_PRODUCTS = [
  { n: 'Flyers A5 / A6 / A4', c: 'Paper Printing', to: '/products?category=paper-printing' },
  { n: 'Business Cards', c: 'Paper Printing', to: '/products?category=paper-printing' },
  { n: 'Economy PVC Pull-Up Banner', c: 'Indoor Branding', to: '/products?category=indoor-branding' },
  { n: 'Executive PVC Pull-Up', c: 'Indoor Branding', to: '/products?category=indoor-branding' },
  { n: 'Curved Banner Wall', c: 'Indoor Branding', to: '/products?category=indoor-branding' },
  { n: 'Branded Tablecloth', c: 'Indoor Branding', to: '/products?category=indoor-branding' },
  { n: 'Telescopic Banner', c: 'Outdoor Branding', to: '/products?category=outdoor-branding' },
  { n: 'Teardrop Banner', c: 'Outdoor Branding', to: '/products?category=outdoor-branding' },
  { n: 'Sandwich Board A1', c: 'Outdoor Branding', to: '/products?category=outdoor-branding' },
  { n: 'Gazebo 3m × 3m', c: 'Outdoor Branding', to: '/products?category=outdoor-branding' },
  { n: 'DTF T-Shirt Print', c: 'T-Shirt Printing', to: '/services' },
  { n: 'Embroidery (min. 6)', c: 'T-Shirt Printing', to: '/services' },
  { n: 'Logo Design', c: 'Graphic Design', to: '/services' },
  { n: 'Flyer / Banner Design', c: 'Graphic Design', to: '/services' },
  { n: 'Vehicle Branding / Car Wrap', c: 'Request a Quote', to: '/quote', q: true },
  { n: 'Shop Front Signage', c: 'Request a Quote', to: '/quote', q: true },
  { n: 'Illuminated Signage', c: 'Request a Quote', to: '/quote', q: true },
  { n: 'Window Graphics', c: 'Request a Quote', to: '/quote', q: true },
];

const CaretIcon = () => (
  <svg className="caret" viewBox="0 0 12 8" aria-hidden="true">
    <polyline points="1,1 6,7 11,1" />
  </svg>
);

function DropdownMenu({ sections, onClose }) {
  return (
    <div className="dropdown">
      {sections.map((section, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div className="sep-line" />}
          {section.label && <div className="sub-label">{section.label}</div>}
          {section.links.map((link) => (
            <Link key={link.text} to={link.to} onClick={onClose}>{link.text}</Link>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

function MegaMenu({ columns, onClose }) {
  return (
    <div className="mega">
      {columns.map((col) => (
        <div className="mega-col" key={col.title}>
          {col.titleLink ? (
            <Link to={col.titleLink} className="col-title col-title-link" onClick={onClose}>
              {col.title}
            </Link>
          ) : (
            <div className="col-title">{col.title}</div>
          )}
          {col.links.map((link) => (
            <Link
              key={link.text}
              to={link.to}
              onClick={onClose}
              className={link.badge ? 'new-badge' : ''}
            >
              {link.text}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

function Header({ onQuoteOpen }) {
  const [openNav, setOpenNav] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCat, setSearchCat] = useState('All Categories');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const searchRef = useRef(null);
  const navRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenNav(null);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowResults(false);
      setMobileOpen(false);
    }
  };

  const handleSearchInput = (val) => {
    setSearchQuery(val);
    if (val.trim().length >= 3) {
      const q = val.toLowerCase();
      let filtered = SEARCH_PRODUCTS.filter(
        (p) => p.n.toLowerCase().includes(q) || p.c.toLowerCase().includes(q)
      );
      if (searchCat !== 'All Categories') filtered = filtered.filter((p) => p.c === searchCat);
      setSearchResults(filtered.slice(0, 8));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const toggleNav = (id) => setOpenNav((prev) => (prev === id ? null : id));
  const closeNav = () => { setOpenNav(null); setMobileOpen(false); };

  return (
    <>
      {/* Top bar */}
      <div className="top-bar">
        <a href="tel:0310016467">031 001 6467</a>
        <span className="top-sep">|</span>
        <a href="mailto:info@3sixtybranding.co.za">info@3sixtybranding.co.za</a>
        <span className="top-sep">|</span>
        <a href="/contact">127 Victoria Embankment, Durban</a>
        <span className="top-sep">|</span>
        <Link to="/orders">Track My Order</Link>
      </div>

      {/* Main header */}
      <div className="header-main">
        <div className="logo-wrap">
          <Link to="/" className="logo-link">
            <span className="logo-name">3SIXTY</span>
            <span className="logo-name logo-teal">BRANDING</span>
            <span className="logo-tag">Print • Brand • Create</span>
          </Link>
        </div>

        <div className="search-wrap" ref={searchRef}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search by product name, category or keyword (min. 3 characters)"
              autoComplete="off"
              aria-label="Search products"
            />
            <select
              className="cat-select"
              value={searchCat}
              onChange={(e) => setSearchCat(e.target.value)}
              aria-label="Filter by category"
            >
              <option>All Categories</option>
              <option>Paper Printing</option>
              <option>Indoor Branding</option>
              <option>Outdoor Branding</option>
              <option>T-Shirt Printing</option>
              <option>Graphic Design</option>
              <option>Request a Quote</option>
            </select>
            <button type="submit" className="search-btn" aria-label="Search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </button>
          </form>
          {showResults && (
            <div className="search-results">
              {searchResults.length === 0 ? (
                <div className="sr-no-results">
                  No results — <button onClick={() => { onQuoteOpen(); setShowResults(false); }}>request a custom quote</button>
                </div>
              ) : (
                searchResults.map((p) => (
                  <div
                    key={p.n}
                    className="sr-item"
                    onClick={() => { navigate(p.to); setShowResults(false); setSearchQuery(''); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(p.to)}
                  >
                    <div className="sr-text">
                      {p.n}
                      {p.q && <span className="sr-quote-tag">QUOTE</span>}
                    </div>
                    <div className="sr-cat">{p.c}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="header-actions">
          <Link to="/cart" className="h-btn" aria-label={`Cart with ${totalItems} items`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 20a1 1 0 1 0 2 0 1 1 0 0 0-2 0M20 20a1 1 0 1 0 2 0 1 1 0 0 0-2 0M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>Cart ({totalItems})</span>
          </Link>
          <Link to="/quote" className="h-btn">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>Quote</span>
          </Link>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Nav bar */}
      <nav className={`nav-bar${mobileOpen ? ' nav-open' : ''}`} aria-label="Main navigation" ref={navRef}>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className={openNav === item.id ? 'open' : ''}>
              <button onClick={() => toggleNav(item.id)} aria-expanded={openNav === item.id}>
                {item.label} <CaretIcon />
              </button>
              {item.type === 'dropdown' && openNav === item.id && (
                <DropdownMenu sections={item.sections} onClose={closeNav} />
              )}
              {item.type === 'mega' && openNav === item.id && (
                <MegaMenu columns={item.columns} onClose={closeNav} />
              )}
            </li>
          ))}
          <li className="quote-tab">
            <button onClick={() => { onQuoteOpen(); closeNav(); }}>
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 14, height: 14 }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Request a Quote
            </button>
          </li>
          <li><Link to="/contact" onClick={closeNav}>Contact Us</Link></li>
        </ul>
      </nav>

      {/* Quote panel is rendered in App.js */}
    </>
  );
}

export function QuotePanel({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', desc: '', qty: '', turnaround: '', location: '' });
  const [jobTypes, setJobTypes] = useState([]);
  const [artwork, setArtwork] = useState('');
  const [materials, setMaterials] = useState([]);

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone || !form.desc) {
      alert('Please fill in your name, email, phone, and project description.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="quote-panel open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="qcard">
        <div className="qcard-head">
          <div>
            <h2>Request a Quote</h2>
            <p>Complex jobs, signage, car branding &amp; custom work — we'll get back to you within 24 hours</p>
          </div>
          <button className="qclose" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {submitted ? (
          <div className="q-success">
            <div className="tick">✓</div>
            <h3>Quote request received!</h3>
            <p>
              Thanks — we'll review your job details and get back to you within <strong>24 hours</strong> on business days.<br /><br />
              <strong>031 001 6467</strong> | <strong>info@3sixtybranding.co.za</strong><br /><br />
              You can also WhatsApp us directly for urgent jobs.
            </p>
            <button onClick={onClose} className="q-close-btn">Close</button>
          </div>
        ) : (
          <div className="qbody">
            <div className="q-note">
              <strong>Why a quote?</strong> Some jobs depend on material type, surface size, substrate, quantity, and finishing. Prices for signage, car branding, and custom work are calculated per job — this form lets us give you an accurate number.
            </div>

            <div className="q-section">
              <label>What type of job is this? <span className="req">*</span></label>
              <div className="q-chips">
                {['Vehicle Branding','Car Wrap (full / partial)','Signage (shop front)','Illuminated Signage','3D Lettering','Window Graphics','Billboard / Hoarding','Floor Graphics','Wallpaper / Wall Mural','Trailer / Truck Branding','Event / Exhibition Build','Bulk Garment Order (50+)','Other / Custom'].map((t) => (
                  <button key={t} className={`chip${jobTypes.includes(t) ? ' active' : ''}`} onClick={() => toggleArr(jobTypes, setJobTypes, t)} type="button">{t}</button>
                ))}
              </div>
            </div>

            <div className="q-section">
              <label>Describe your project <span className="req">*</span></label>
              <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="E.g. Full vehicle wrap on a Toyota Hilux, white base, branded with company logo and contact details on both sides and tailgate." />
            </div>

            <div className="q-row">
              <div className="q-section">
                <label>Quantity / Number of units</label>
                <input type="text" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} placeholder="E.g. 3 vehicles, 2 signs" />
              </div>
              <div className="q-section">
                <label>Preferred turnaround</label>
                <select value={form.turnaround} onChange={(e) => setForm({ ...form, turnaround: e.target.value })}>
                  <option value="">Select timeframe</option>
                  <option>ASAP / Rush</option>
                  <option>Within 1 week</option>
                  <option>Within 2 weeks</option>
                  <option>Within 1 month</option>
                  <option>Flexible / No rush</option>
                </select>
              </div>
            </div>

            <div className="q-section">
              <label>Do you have artwork / design ready?</label>
              <div className="q-chips">
                {['Yes — print-ready file','Yes — but needs some work','No — need full design','No — just a brief / idea'].map((t) => (
                  <button key={t} className={`chip${artwork === t ? ' active' : ''}`} onClick={() => setArtwork(t)} type="button">{t}</button>
                ))}
              </div>
            </div>

            <div className="q-section">
              <label>Material / substrate preference <span className="opt">(if known)</span></label>
              <div className="q-chips">
                {['Cast Vinyl','Calendered Vinyl','Aluminium Composite (ACM)','Acrylic','Dibond','Corrugated Plastic (Corflute)','PVC Board','Fabric','Not sure — advise me'].map((t) => (
                  <button key={t} className={`chip${materials.includes(t) ? ' active' : ''}`} onClick={() => toggleArr(materials, setMaterials, t)} type="button">{t}</button>
                ))}
              </div>
            </div>

            <div className="q-row">
              <div className="q-section">
                <label>Your name <span className="req">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
              </div>
              <div className="q-section">
                <label>Company name <span className="opt">(optional)</span></label>
                <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company / organisation" />
              </div>
            </div>

            <div className="q-row">
              <div className="q-section">
                <label>Email address <span className="req">*</span></label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </div>
              <div className="q-section">
                <label>WhatsApp / Phone <span className="req">*</span></label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 082 555 0000" />
              </div>
            </div>

            <div className="q-section">
              <label>Delivery / installation location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, province or full address" />
            </div>

            <button className="qsubmit" onClick={handleSubmit} type="button">Submit Quote Request</button>
            <p className="q-disclaimer">We respond within 24 hours on business days. No spam — your info is only used to prepare your quote.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
