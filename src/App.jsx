import './App.css';
import { useState, useEffect } from 'react';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// ─── WOOCOMMERCE CLIENT ───
const api = new WooCommerceRestApi({
  url: import.meta.env.VITE_WC_URL,
  consumerKey: import.meta.env.VITE_WC_KEY,
  consumerSecret: import.meta.env.VITE_WC_SECRET,
  version: "wc/v3",
});

// ─── ICONS ───
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
const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// ─── FEATURES DATA ───
const FEATURES = [
  { icon: <IconFlask />, title: 'Research Driven',      desc: 'Every peptide backed by peer-reviewed science and rigorous in-house validation.' },
  { icon: <IconShield />, title: 'Quality Tested',      desc: '3rd-party HPLC and mass-spec testing on every batch. COAs available on request.' },
  { icon: <IconLink />,   title: 'Peptide Experts',     desc: 'Our team has decades of combined biochemistry and formulation experience.' },
  { icon: <IconChart />,  title: 'Performance Focused', desc: 'Formulated for researchers who demand precision and reproducibility.' },
];

// ─── PRODUCT MODAL ───
function ProductModal({ product, onClose, onAddToCart }) {
  const isVariable = product.type === 'variable';
  const variants = product.variation_data || [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const [added, setAdded] = useState(false);

  const image = product.images?.[0]?.src || '/placeholder.png';
  const badge = product.tags?.[0]?.name || 'Research';

  const displayPrice = isVariable
    ? selectedVariant ? `$${parseFloat(selectedVariant.price).toFixed(2)}` : '—'
    : `$${parseFloat(product.price).toFixed(2)}`;

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || '';
  };

  const description = stripHtml(product.description || product.short_description || 'No description available.');

  const handleAdd = () => {
    const itemId = isVariable && selectedVariant ? selectedVariant.id : product.id;
    const variantLabel = isVariable && selectedVariant
      ? selectedVariant.attributes?.map(a => a.option).join(', ')
      : null;
    const price = isVariable && selectedVariant
      ? parseFloat(selectedVariant.price)
      : parseFloat(product.price);
    const img = isVariable && selectedVariant
      ? selectedVariant.image?.src || image
      : image;

    onAddToCart({ id: itemId, name: product.name, variant: variantLabel, price, image: img });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <button className="modal-close" onClick={onClose}><IconX /></button>
        <div className="modal-body">
          <div className="modal-image-wrap">
            <span className="product-badge">{badge}</span>
            <img
              src={isVariable && selectedVariant ? (selectedVariant.image?.src || image) : image}
              alt={product.name}
              className="modal-image"
            />
          </div>
          <div className="modal-details">
            <p className="modal-label">Research Peptide</p>
            <h2 className="modal-title">{product.name}</h2>
            <p className="modal-price">{displayPrice}</p>
            {isVariable && variants.length > 0 && (
              <div className="modal-variants">
                <p className="modal-variants-label">Select Dosage</p>
                <div className="variant-selector">
                  {variants.map((v) => {
                    const label = v.attributes?.map(a => a.option).join(' / ') || v.id;
                    return (
                      <button
                        key={v.id}
                        className={`variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                        onClick={() => setSelectedVariant(v)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="modal-description">
              <p className="modal-desc-label">About this compound</p>
              <p className="modal-desc-text">{description}</p>
            </div>
            <p className="research-note">For research use only · Not for human consumption</p>
            <button
              className={`add-btn modal-add-btn ${added ? 'added' : ''}`}
              onClick={handleAdd}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── CART DRAWER ───
function CartDrawer({ cart, onClose, onRemove, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h3>Your Cart</h3>
          <button className="cart-close" onClick={onClose}><IconX /></button>
        </div>
        {cart.length === 0 ? (
          <div className="cart-empty">
            <IconCart />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.cartKey}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    {item.variant && <p className="cart-item-variant">{item.variant}</p>}
                    <p className="cart-item-price">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                  <div className="cart-item-qty">
                    <span>x{item.qty}</span>
                    <button onClick={() => onRemove(item.cartKey)}><IconTrash /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="btn-checkout" onClick={onCheckout}>Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── NAVBAR ───
function Navbar({ cartCount, onCartOpen }) {
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
      <div className="nav-right">
        <button className="nav-cart" onClick={onCartOpen}>
          <IconCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
        <button className="nav-cta">Shop Now</button>
      </div>
    </nav>
  );
}

// ─── HERO ───
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

// ─── TRUST BAR ───
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

// ─── PRODUCT CARD ───
function ProductCard({ product, onAddToCart, onOpenModal }) {
  const isVariable = product.type === 'variable';
  const variants = product.variation_data || [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);

  const image = product.images?.[0]?.src || '/placeholder.png';
  const badge = product.tags?.[0]?.name || 'Research';

  const displayPrice = isVariable
    ? selectedVariant ? `$${parseFloat(selectedVariant.price).toFixed(2)}` : '—'
    : `$${parseFloat(product.price).toFixed(2)}`;

  const handleAdd = () => {
    const itemId = isVariable && selectedVariant ? selectedVariant.id : product.id;
    const variantLabel = isVariable && selectedVariant
      ? selectedVariant.attributes?.map(a => a.option).join(', ')
      : null;
    const price = isVariable && selectedVariant
      ? parseFloat(selectedVariant.price)
      : parseFloat(product.price);
    const img = isVariable && selectedVariant
      ? selectedVariant.image?.src || image
      : image;
    onAddToCart({ id: itemId, name: product.name, variant: variantLabel, price, image: img });
  };

  return (
    <div className="product-card">
      <span className="product-badge">{badge}</span>
      <button className="product-zoom-btn" onClick={() => onOpenModal(product)} title="View details">
        <IconSearch />
      </button>
      <img
        src={isVariable && selectedVariant ? (selectedVariant.image?.src || image) : image}
        alt={product.name}
        className="product-img"
      />
      <div>
        <p className="product-name">{product.name}</p>
        {isVariable && variants.length > 0 && (
          <div className="variant-selector">
            {variants.map((v) => {
              const label = v.attributes?.map(a => a.option).join(' / ') || v.id;
              return (
                <button
                  key={v.id}
                  className={`variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                  onClick={() => setSelectedVariant(v)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
        {!isVariable && (
          <p className="product-dose">{product.weight ? `${product.weight}mg / vial` : ''}</p>
        )}
      </div>
      <p className="research-note">For research use only · Not for human consumption</p>
      <div className="product-footer">
        <span className="product-price">{displayPrice}</span>
        <button className="add-btn" onClick={handleAdd}>Add to Cart</button>
      </div>
    </div>
  );
}

// ─── PRODUCTS SECTION ───
function Products({ onAddToCart }) {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await api.get('products', { per_page: 50, status: 'publish' });
        const hydrated = await Promise.all(
          data.map(async (product) => {
            if (product.type === 'variable' && product.variations?.length > 0) {
              const { data: varData } = await api.get(`products/${product.id}/variations`, { per_page: 100 });
              return { ...product, variation_data: varData };
            }
            return { ...product, variation_data: [] };
          })
        );
        setProducts(hydrated);
      } catch (err) {
        console.error('WooCommerce fetch error:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="section" id="products">
      <div className="section-inner">
        <p className="section-label">Our Catalog</p>
        <h2 className="section-title">Research <span>Peptides</span></h2>
        <p className="section-sub">
          Every compound is rigorously tested for purity and potency before it reaches your lab.
        </p>
        {loading && <p className="products-status">Loading products…</p>}
        {error   && <p className="products-status products-error">{error}</p>}
        {!loading && !error && (
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={onAddToCart}
                onOpenModal={setModalProduct}
              />
            ))}
          </div>
        )}
      </div>
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
}

// ─── FEATURES ───
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

// ─── BANNER ───
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

// ─── FOOTER ───
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
  const [cart, setCart]         = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handleAddToCart = (item) => {
    const cartKey = `${item.id}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (existing) {
        return prev.map((i) => i.cartKey === cartKey ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, cartKey, qty: 1 }];
    });
    setCartOpen(true);
  };

  const handleRemove = (cartKey) => {
    setCart((prev) => prev.filter((i) => i.cartKey !== cartKey));
  };

  const handleCheckout = () => {
    window.location.href = `${import.meta.env.VITE_WC_URL}/checkout`;
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <>
      <div className="noise-overlay" />
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={handleRemove}
          onCheckout={handleCheckout}
        />
      )}
      <main>
        <Hero />
        <TrustBar />
        <Products onAddToCart={handleAddToCart} />
        <Features />
        <Banner />
      </main>
      <Footer />
    </>
  );
}
