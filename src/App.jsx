import './App.css';
import { useState } from 'react';

// ─── ICONS (inline SVG so no extra packages needed) ───
const IconFlask = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6M9 3v6l-4 9a1 1 0 0 0 .9 1.4h12.2A1 1 0 0 0 19 18l-4-9V3"/>
    <line x1="6.2" y1="15" x2="17.8" y2="15"/>
  </svg>
);

const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const IconLink = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const IconChart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const IconVial = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6M9 3v6l-4 9a1 1 0 0 0 .9 1.4h12.2A1 1 0 0 0 19 18l-4-9V3"/>
    <line x1="6.2" y1="15" x2="17.8" y2="15"/>
  </svg>
);



// ─── DATA ───
const PRODUCTS = [
  { id: 1, name: 'Retatrutide',  variants: [
    { dose: '10mg', price: '$59.99', image: '/retatrutide_10mg.png'}, 
    { dose: '20mg', price: '$89.99', image: '/retatrutide_20mg.png' }, 
    { dose: '30mg', price: '$119.99', image: '/retatrutide_30mg.png' }
  ], badge: 'Best Seller' },
  { id: 2, name: 'GHK-Cu',      variants: [{ dose: '50mg', price: '$24.99', image: '/ghk_cu_50mg.png' }], badge: 'Research' },
  { id: 3, name: 'Wolverine',   variants: [{ dose: '10mg', price: '$99.99', image: '/wolverine_10mg.png' }], badge: 'Best Seller' },
  { id: 4, name: 'Mots-C',      variants: [{ dose: '10mg', price: '$28.99', image: '/mots_c_10mg.png' }], badge: 'Research' },
  { id: 5, name: 'Glow',        variants: [{ dose: '50mg', price: '$99.99', image: '/glow_50mg.png' }], badge: 'Popular' },
  { id: 6, name: 'BAC Water',   variants: [
    { dose: '3ml', price: '$8.99', image: '/bac_water_3ml.png' }, 
    { dose: '10ml', price: '$13.99', image: '/bac_water_10ml.png' }
  ], badge: 'Research' },
];

const FEATURES = [
  { icon: <IconFlask />, title: 'Research Driven',   desc: 'Every peptide backed by peer-reviewed science and rigorous in-house validation.' },
  { icon: <IconShield />, title: 'Quality Tested',   desc: '3rd-party HPLC and mass-spec testing on every batch. COAs available on request.' },
  { icon: <IconLink />,   title: 'Peptide Experts',  desc: 'Our team has decades of combined biochemistry and formulation experience.' },
  { icon: <IconChart />,  title: 'Performance Focused', desc: 'Formulated for researchers who demand precision and reproducibility.' },
];

// ─── COMPONENTS ───
function Navbar() {
  return (
    <nav className="navbar">
      <a href="#" className="nav-logo">
        <img src="/logo.png" alt="Pep-Chain" className="nav-logo-img" />
      </a>
      <ul className="nav-links">
        <li><a href="#products">Products</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#research">Research</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button className="nav-cta">Shop Now</button>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-content">
        <div className="hero-badge">Research Grade Peptides</div>
        <img src="/pep-chain-banner.png" alt="Pep-Chain" className="hero-banner-img" />
        <p className="hero-desc">
          Premium research peptides formulated for precision. Every vial tested,
          verified, and delivered with confidence.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">Browse Products</button>
          <button className="btn-secondary">Learn More</button>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <div className="trust-bar">
      {[
        { num: '99%',  label: 'Purity Guaranteed' },
        { num: '50+',  label: 'Peptide Compounds' },
        { num: '3rd',  label: 'Party Lab Tested' },
        { num: '48hr', label: 'Fast Shipping' },
      ].map((item) => (
        <div className="trust-item" key={item.label}>
          <span className="trust-num">{item.num}</span>
          <span className="trust-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const [selected, setSelected] = useState(0);
  const active = product.variants[selected];

  return (
    <div className="product-card">
      <span className="product-badge">{product.badge}</span>
      <img src={active.image} alt={product.name} className="product-img" />
      <div>
        <p className="product-name">{product.name}</p>
        {product.variants.length > 1 && (
          <div className="variant-selector">
            {product.variants.map((v, i) => (
              <button
                key={i}
                className={`variant-btn ${i === selected ? 'active' : ''}`}
                onClick={() => setSelected(i)}
              >
                {v.dose}
              </button>
            ))}
          </div>
        )}
        {product.variants.length === 1 && (
          <p className="product-dose">{active.dose} / vial</p>
        )}
      </div>
      <p className="research-note">For research use only · Not for human consumption</p>
      <div className="product-footer">
        <span className="product-price">{active.price}</span>
        <button className="add-btn">Add to Cart</button>
      </div>
    </div>
  );
}

function Products() {
  return (
    <section className="section" id="products">
      <div className="section-inner">
        <p className="section-label">Our Catalog</p>
        <h2 className="section-title">Research <span>Peptides</span></h2>
        <p className="section-sub">
          Every compound is rigorously tested for purity and potency before it reaches your lab.
        </p>
        <div className="products-grid">
          {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="section features-bg" id="about">
      <div className="section-inner">
        <p className="section-label">Why Pep-Chain</p>
        <h2 className="section-title">Built on <span>Science</span></h2>
        <p className="section-sub">
          We hold every batch to the highest standards so your research never has to compromise.
        </p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <p className="feature-title">{f.title}</p>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Banner() {
  return (
    <div className="banner">
      <div className="banner-inner">
        <h2 className="banner-title">Ready to Elevate Your Research?</h2>
        <p className="banner-sub">
          Browse our full catalog of research-grade peptides — purity verified, fast shipping, no compromises.
        </p>
        <button className="btn-white">Shop the Catalog</button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-logo">PEP-<span>CHAIN</span></p>
            <p>Premium research peptides for professionals who demand purity, precision, and results.</p>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Research</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">COA Requests</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Pep-Chain. All rights reserved.</p>
          <p className="disclaimer">All products sold for research use only. Not for human consumption.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ───
export default function App() {
  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Products />
        <Features />
        <Banner />
      </main>
      <Footer />
    </>
  );
}
