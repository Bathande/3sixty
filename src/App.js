import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import { QuotePanel } from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import SubcategoryPage from './pages/SubcategoryPage';
import Auth from './pages/Auth';
import Quote from './pages/Quote';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import './App.css';

function App() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  // Lock body scroll when quote panel is open
  React.useEffect(() => {
    document.body.style.overflow = quoteOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [quoteOpen]);

  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
        <Router>
          <div className="App">
            <Header onQuoteOpen={() => setQuoteOpen(true)} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:subcategoryId" element={<SubcategoryPage />} />
              <Route path="/auth" element={<Auth />} />
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
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
