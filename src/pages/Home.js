import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories, products, services } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Home.css';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { image: '/images/slides/slide1.jpg', title: 'Branded Display Solutions', subtitle: 'Banners, gazebos, flags & more for your next event' },
    { image: '/images/slides/slide2.jpg', title: 'Make Your Brand Stand Out', subtitle: 'Indoor & outdoor branding that gets noticed' },
    { image: '/images/slides/car-branding.jpg', title: 'Vehicle Branding', subtitle: 'Turn your fleet into mobile billboards' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const featuredProducts = products.filter(p => [1, 4, 8, 9, 11, 13].includes(p.id));

  return (
    <main>
      {/* Hero Carousel */}
      <section className="hero-carousel">
        {slides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === currentSlide ? 'active' : ''}`}>
            <img src={slide.image} alt={slide.title} className="hero-slide-img" />
            <div className="hero-slide-overlay">
              <div className="container hero-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <div className="hero-actions">
                  <Link to="/products" className="btn btn-primary">Browse Products</Link>
                  <Link to="/quote" className="btn btn-outline">Request a Quote</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container trust-grid">
          <div className="trust-item"><span className="trust-icon">🚚</span><div><strong>Nationwide Delivery</strong><br /><small>Across South Africa</small></div></div>
          <div className="trust-item"><span className="trust-icon">🏷️</span><div><strong>Custom Branding</strong><br /><small>Sublimation, print, embroidery</small></div></div>
          <div className="trust-item"><span className="trust-icon">⚡</span><div><strong>Fast Turnaround</strong><br /><small>Quick production times</small></div></div>
          <div className="trust-item"><span className="trust-icon">✅</span><div><strong>Quality Guaranteed</strong><br /><small>Premium materials & finishes</small></div></div>
        </div>
      </section>

      {/* Shop Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.filter(c => ['outdoor-branding', 'indoor-branding', 'expo-events', 'custom-branded', 'signage'].includes(c.id)).map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className="category-card">
                <div className="category-img-wrap">
                  <img src={cat.image} alt={cat.name} className="category-img" />
                </div>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-grey">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/products" className="btn btn-primary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            {services.slice(0, 6).map(svc => (
              <Link key={svc.id} to={`/services`} className="service-card">
                <img src={svc.image} alt={svc.name} className="service-img" />
                <div className="service-info">
                  <h3>{svc.name}</h3>
                  <p>{svc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-content">
          <h2>Need a Custom Branding Solution?</h2>
          <p>From concept to delivery – we handle everything. Tell us what you need and we'll make it happen.</p>
          <Link to="/contact" className="btn btn-primary btn-lg">Get in Touch</Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
