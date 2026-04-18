import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import { QuotePanel } from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import SubcategoryPage from './pages/SubcategoryPage';
import Quote from './pages/Quote';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import { seedAll } from './scripts/seedProducts';
import './App.css';

function App() {
  const [seedStatus, setSeedStatus] = useState('');
  const [quoteOpen, setQuoteOpen] = useState(false);

  // Lock body scroll when quote panel is open
  React.useEffect(() => {
    document.body.style.overflow = quoteOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [quoteOpen]);

  const handleSeed = async () => {
    setSeedStatus('⏳ Seeding...');
    try {
      const result = await seedAll();
      if (result.products.skipped) {
        setSeedStatus('⚠️ Already seeded — data exists in Firestore.');
      } else {
        setSeedStatus(`✅ Done! ${result.products.count} products + ${result.categories.count} categories added.`);
      }
    } catch (err) {
      setSeedStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <CartProvider>
      <Router>
        <div className="App">
          {/* ── TEMPORARY SEED BUTTON — REMOVE AFTER USE ── */}
          <div style={{ background: '#1a1a2e', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={handleSeed}
              style={{ background: '#C8102E', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
            >
              🌱 Seed Firestore Database
            </button>
            {seedStatus && <span style={{ color: '#fff', fontSize: 13 }}>{seedStatus}</span>}
          </div>
          {/* ── END SEED BUTTON ── */}
          <Header onQuoteOpen={() => setQuoteOpen(true)} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:subcategoryId" element={<SubcategoryPage />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Routes>
          <Footer />
          <MobileNav onQuoteOpen={() => setQuoteOpen(true)} />
          {quoteOpen && <QuotePanel onClose={() => setQuoteOpen(false)} />}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
