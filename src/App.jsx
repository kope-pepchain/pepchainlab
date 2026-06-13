import "./App.css";
import { useState, useEffect } from "react";
const WC_URL = import.meta.env.VITE_WC_URL;

const wcFetch = (endpoint) => {
  return fetch(
    `${import.meta.env.VITE_WC_URL}/wp-content/themes/storefront-child/proxy.php?endpoint=${encodeURIComponent(endpoint)}`,
  ).then((r) => r.json());
};
const checkLoggedIn = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_WC_URL}/wp-json/pepchain/v1/me`,
      {
        credentials: "include",
      },
    );
    const data = await res.json();
    return data.logged_in === true;
  } catch {
    return false;
  }
};

// ─── ICONS (inline SVG so no extra packages needed) ───

const IconFlask = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 3h6M9 3v6l-4 9a1 1 0 0 0 .9 1.4h12.2A1 1 0 0 0 19 18l-4-9V3" />
    <line x1="6.2" y1="15" x2="17.8" y2="15" />
  </svg>
);

const IconShield = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const IconLink = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconChart = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const IconVial = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 3h6M9 3v6l-4 9a1 1 0 0 0 .9 1.4h12.2A1 1 0 0 0 19 18l-4-9V3" />
    <line x1="6.2" y1="15" x2="17.8" y2="15" />
  </svg>
);
const IconUser = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── DATA ───
const FEATURES = [
  {
    icon: <IconFlask />,
    title: "Research Driven",
    desc: "Every peptide backed by peer-reviewed science and rigorous in-house validation.",
  },
  {
    icon: <IconShield />,
    title: "Quality Tested",
    desc: "3rd-party HPLC and mass-spec testing on every batch. COAs available on request.",
  },
  {
    icon: <IconLink />,
    title: "Peptide Experts",
    desc: "Our team has decades of combined biochemistry and formulation experience.",
  },
  {
    icon: <IconChart />,
    title: "Precision Formulated",
    desc: "Formulated for researchers who demand precision and reproducibility.",
  },
];

// ─── COMPONENTS ───

function AgeGate({ onConfirm }) {
  return (
    <>
      <div className="modal-overlay" />
      <div className="age-gate">
        <img src="/logo.png" alt="Pep-Chain" className="age-gate-logo" />
        <h2 className="age-gate-title">Age Verification</h2>
        <p className="age-gate-text">
          This website contains research compounds intended for qualified
          professionals only. You must be 21 or older to enter.
        </p>
        <div className="age-gate-buttons">
          <button className="btn-primary" onClick={onConfirm}>
            I am 21 or older
          </button>
          <button
            className="btn-secondary"
            onClick={() => (window.location.href = "https://google.com")}
          >
            I am under 21
          </button>
        </div>
        <p className="age-gate-disclaimer">
          By entering you confirm you are a qualified research professional and
          agree to our terms.
        </p>
      </div>
    </>
  );
}
function CartDrawer({ cart, onClose, onQtyChange }) {
  const total = cart.reduce((sum, i) => {
    const price = parseFloat(i.price.replace("$", ""));
    return sum + price * i.qty;
  }, 0);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h3>Your Cart</h3>
          <button className="cart-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.key}>
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-dose">{item.dose}</p>
                    <p className="cart-item-price">{item.price}</p>
                  </div>
                  <div className="cart-item-qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => onQtyChange(item.key, -1)}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onQtyChange(item.key, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                className="btn-primary"
                style={{ width: "100%" }}
                onClick={async () => {
                  try {
                    // Step 1: Reuse our persistent cart key, or get one from CoCart
                    let cartKey = localStorage.getItem("wcCartKey");
                    if (!cartKey) {
                      const createRes = await fetch(
                        `${import.meta.env.VITE_WC_URL}/wp-json/cocart/v2/cart`,
                        {
                          method: "GET",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                        },
                      );
                      if (!createRes.ok)
                        throw new Error("Could not start checkout session.");
                      const cartData = await createRes.json();
                      cartKey = cartData.cart_key;
                      if (!cartKey)
                        throw new Error("Could not start checkout session.");
                    }
                    localStorage.setItem("wcCartKey", cartKey);

                    // Step 2: Clear any existing items in that cart
                    const clearRes = await fetch(
                      `${import.meta.env.VITE_WC_URL}/wp-json/cocart/v2/cart/clear?cart_key=${cartKey}`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                      },
                    );
                    if (!clearRes.ok)
                      throw new Error(
                        "Could not prepare your cart. Please try again.",
                      );

                    // Step 3: Add items, verifying each one succeeded
                    for (const item of cart) {
                      const res = await fetch(
                        `${import.meta.env.VITE_WC_URL}/wp-json/cocart/v2/cart/add-item?cart_key=${cartKey}`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({
                            id: String(
                              item.variation_id || item.key.split("-")[0],
                            ),
                            quantity: String(item.qty),
                            ...(item.variation_id && {
                              variation_id: item.variation_id,
                              variation: item.variation,
                            }),
                          }),
                        },
                      );
                      if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        throw new Error(
                          err.message ||
                            `"${item.name.split("|")[0].trim()} ${item.dose}" couldn't be added — it may be out of stock.`,
                        );
                      }
                    }

                    // Step 4: Redirect only after every item confirmed
                    window.location.href = `${import.meta.env.VITE_WC_URL}/checkout/?cocart-load-cart=${cartKey}&keep-cart=false`;
                  } catch (err) {
                    console.error("Cart sync failed", err);
                    alert(
                      err.message || "Something went wrong. Please try again.",
                    );
                  }
                }}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
function Navbar({ cartCount, onCartOpen }) {
  return (
    <nav className="navbar">
      <a href="/" className="nav-logo">
        <img src="/logo.png" alt="Pep-Chain" className="nav-logo-img" />
      </a>
      <ul className="nav-links">
        <li>
          <a href="/products">Products</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="/coa-library">COA Library</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
      <div className="nav-right">
        <a href="/my-account" className="nav-icon-btn" title="My Account">
          <IconUser />
        </a>
        <button className="nav-cta" onClick={onCartOpen}>
          Cart{" "}
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
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
        <img
          src="/pep-chain-banner.png"
          alt="Pep-Chain"
          className="hero-banner-img"
        />
        <p className="hero-desc">
          Research-grade peptides for qualified professionals. Every compound
          independently tested, verified, and supplied strictly for scientific
          research purposes.
        </p>
        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => {
              const el = document.getElementById("products");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Browse Products
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              window.location.href = "/products";
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <div className="trust-bar">
      {[
        { num: "99%", label: "Purity Guaranteed" },
        { num: "50+", label: "Peptide Compounds" },
        { num: "3rd", label: "Party Lab Tested" },
        { num: "48hr", label: "Fast Shipping" },
      ].map((item) => (
        <div className="trust-item" key={item.label}>
          <span className="trust-num">{item.num}</span>
          <span className="trust-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product, addToCart, full = false }) {
  const image = product.images?.[0]?.src || "/placeholder.png";
  const badge = product.tags?.[0]?.name || "Research";
  const shortName = product.name.split("|")[0].trim();
  const isVariable = product.type === "variable";
  const variants = product.variation_data || [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const inStock =
    isVariable && selectedVariant
      ? selectedVariant.stock_status === "instock"
      : product.stock_status === "instock";

  const price = isVariable
    ? selectedVariant
      ? `$${parseFloat(selectedVariant.price).toFixed(2)}`
      : `$${parseFloat(product.price).toFixed(2)}`
    : `$${parseFloat(product.price).toFixed(2)}`;

  const handleAdd = () => {
    const variantLabel =
      isVariable && selectedVariant
        ? selectedVariant.attributes?.map((a) => a.option).join(", ")
        : "";

    const variation =
      isVariable && selectedVariant
        ? selectedVariant.attributes?.reduce((acc, a) => {
            acc[`attribute_pa_${a.name.toLowerCase().replace(/\s+/g, "_")}`] =
              a.option;
            return acc;
          }, {})
        : null;

    addToCart(product, {
      dose: variantLabel,
      price,
      variation_id: isVariable && selectedVariant ? selectedVariant.id : null,
      variation,
    });
  };

  return (
    <div className="product-card">
      <span className="product-badge">{badge}</span>
      <img src={image} alt={shortName} className="product-img" />
      <div>
        <p className="product-name">{shortName}</p>
        {isVariable && variants.length > 0 && (
          <div className="variant-selector">
            {variants.map((v) => {
              const label =
                v.attributes?.map((a) => a.option).join(" / ") || v.id;
              return (
                <button
                  key={v.id}
                  className={`variant-btn ${selectedVariant?.id === v.id ? "active" : ""}`}
                  onClick={() => setSelectedVariant(v)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="product-footer">
        <span className="product-price">{price}</span>
        {full ? (
          <button
            className={`add-btn ${!inStock ? "out-of-stock-btn" : ""}`}
            onClick={handleAdd}
            disabled={!inStock}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        ) : (
          <a
            href={`/product/${product.slug}`}
            className="add-btn"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            View Details
          </a>
        )}
      </div>
    </div>
  );
}

function ProductGrid({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wcFetch("products?per_page=50&status=publish")
      .then(async (data) => {
        const hydrated = await Promise.all(
          data.map(async (product) => {
            if (product.type === "variable" && product.variations.length > 0) {
              const vars = await wcFetch(
                `products/${product.id}/variations?per_page=100`,
              );
              vars.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
              return { ...product, variation_data: vars };
            }
            return { ...product, variation_data: [] };
          }),
        );
        setProducts(hydrated.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p style={{ color: "var(--white-dim)", padding: "4rem 0" }}>Loading…</p>
    );

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
}
function Features() {
  return (
    <section className="section features-bg" id="about">
      <div className="section-inner">
        <p className="section-label">Why Pep-Chain</p>
        <h2 className="section-title">
          Built on <span>Science</span>
        </h2>
        <p className="section-sub">
          We hold every batch to the highest standards so your research never
          has to compromise.
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
function Disclaimer() {
  return (
    <section className="disclaimer-section">
      <div className="disclaimer-inner">
        <div className="disclaimer-icon">⚠</div>
        <div className="disclaimer-content">
          <p className="disclaimer-title">
            FDA Disclaimer & Research Use Notice
          </p>
          <p className="disclaimer-body">
            All products sold by Pep-Chain are intended for research purposes
            only. These products are not intended for human or animal
            consumption, diagnosis, treatment, or prevention of any disease or
            condition. Products are not FDA approved and have not been evaluated
            by the Food and Drug Administration. By purchasing, you confirm you
            are a qualified research professional and will use these compounds
            in a controlled laboratory setting in compliance with all applicable
            local, state, and federal laws and regulations. Pep-Chain makes no
            claims regarding the safety or efficacy of any compound sold on this
            site.
          </p>
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
          Browse our full catalog of research-grade peptides — independently
          tested, purity verified, for qualified researchers only.
        </p>
        <button
          className="btn-white"
          onClick={() => {
            window.location.href = "/products";
          }}
        >
          Shop the Catalog
        </button>
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
            <p className="footer-logo">
              PEP-<span>CHAIN</span>
            </p>
            <p>
              PepChain LLC is a chemical supplier of research-grade peptides
              intended solely for laboratory and scientific research use by
              qualified professionals.
            </p>
            <p>
              2108 N St, Ste N · Sacramento, CA 95816 ·
              compliance@pepchainlab.com
            </p>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="/ruo-policy">RUO Policy</a>
              </li>
              <li>
                <a href="/coa-library">COA Library</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="/terms">Terms of Use</a>
              </li>
              <li>
                <a href="/shipping-policy">Shipping Policy</a>
              </li>
              <li>
                <a href="/returns">Returns</a>
              </li>
              <li>
                <a href="/privacy-policy">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-legal">
          <p>
            PepChain LLC is not a 503A compounding pharmacy or a 503B
            outsourcing facility as defined under Section 503A and 503B of the
            Federal Food, Drug, and Cosmetic Act (FD&amp;C Act). All products
            are sold as research chemicals only. These products are not drugs
            and have not been approved by the U.S. Food and Drug Administration
            (FDA). They are not intended for human or animal consumption,
            diagnosis, treatment, mitigation, or prevention of any disease or
            condition. By purchasing, you represent that you are a qualified
            research professional and that all use will occur in a controlled
            laboratory environment in full compliance with applicable federal,
            state, and local laws.
          </p>
          <p className="footer-copy">
            © 2026 PepChain LLC. All rights reserved. For research use only. Not
            for human consumption.
          </p>
        </div>
      </div>
    </footer>
  );
}
function RUOPolicy() {
  return (
    <div className="policy-page">
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img src="/logo.png" alt="Pep-Chain" className="nav-logo-img" />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/#products">Products</a>
          </li>
          <li>
            <a href="/coa-library">COA Library</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <div className="nav-right">
          <a href="/my-account" className="nav-icon-btn" title="My Account">
            <IconUser />
          </a>
          <a href="/" className="nav-cta">
            Back to Shop
          </a>
        </div>
      </nav>
      <div className="policy-content">
        <p className="section-label">Legal</p>
        <h1 className="policy-title">Research Use Only Policy</h1>
        <div className="policy-body">
          <p>
            All products sold by Pep-Chain LLC are intended exclusively for in
            vitro laboratory research and scientific study by qualified research
            professionals. These products are research chemicals only.
          </p>

          <h3>Not for Human or Animal Use</h3>
          <p>
            No product sold by Pep-Chain LLC is intended for human or animal
            consumption, injection, or any form of in vivo use. These products
            are not drugs, supplements, or medications. They have not been
            evaluated or approved by the U.S. Food and Drug Administration (FDA)
            or any other regulatory body for use in humans or animals.
          </p>

          <h3>Qualified Purchasers Only</h3>
          <p>
            By placing an order with Pep-Chain LLC, you represent and warrant
            that you are a qualified research professional operating within a
            controlled laboratory environment, and that all purchased compounds
            will be used solely for lawful scientific research purposes in full
            compliance with all applicable federal, state, and local laws and
            regulations.
          </p>

          <h3>Not a Pharmacy or Compounding Facility</h3>
          <p>
            Pep-Chain LLC is not a 503A compounding pharmacy or a 503B
            outsourcing facility as defined under Sections 503A and 503B of the
            Federal Food, Drug, and Cosmetic Act (FD&C Act). We do not compound,
            dispense, or manufacture drugs intended for human use.
          </p>

          <h3>No Medical Claims</h3>
          <p>
            Pep-Chain LLC makes no claims regarding the therapeutic, diagnostic,
            or preventive properties of any product. Nothing on this website
            constitutes medical advice. Any research findings referenced are
            provided for informational purposes only and do not imply efficacy
            or safety in humans.
          </p>

          <h3>Compliance</h3>
          <p>
            It is the sole responsibility of the purchaser to ensure that the
            acquisition, possession, and use of any product complies with all
            applicable laws in their jurisdiction. Pep-Chain LLC reserves the
            right to refuse service to any individual or entity that cannot
            demonstrate legitimate research intent.
          </p>

          <h3>Contact</h3>
          <p>
            For questions regarding this policy please contact us at{" "}
            <a href="mailto:compliance@pepchainlab.com">
              compliance@pepchainlab.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
function COALibrary() {
  const [activePdf, setActivePdf] = useState(null);

  const coas = [
    {
      name: "Retatrutide 10mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_r10.pdf",
    },
    {
      name: "Retatrutide 20mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_r20.pdf",
    },
    {
      name: "Retatrutide 30mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_r30.pdf",
    },
    {
      name: "GHK-Cu 50mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_ghkcu50.pdf",
    },
    {
      name: "MOTS-c 10mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_motsc10.pdf",
    },
    {
      name: "Glow Blend 50mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_glow50.pdf",
    },
    {
      name: "Bacteriostatic Water",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_bacwater3.pdf",
    },
    { name: "Wolverine Blend 10mg", detail: "Coming Soon", pdf: null },
  ];

  return (
    <div className="policy-page">
      {activePdf && (
        <div className="pdf-modal-overlay" onClick={() => setActivePdf(null)}>
          <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="pdf-modal-close"
              onClick={() => setActivePdf(null)}
            >
              ✕
            </button>
            <iframe
              src={activePdf}
              className="pdf-iframe"
              title="Certificate of Analysis"
            />
          </div>
        </div>
      )}
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img src="/logo.png" alt="Pep-Chain" className="nav-logo-img" />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/#products">Products</a>
          </li>
          <li>
            <a href="/ruo-policy">RUO Policy</a>
          </li>
          <li>
            <a href="/#contact">Contact</a>
          </li>
        </ul>
        <div className="nav-right">
          <a href="/my-account" className="nav-icon-btn" title="My Account">
            <IconUser />
          </a>
          <a href="/" className="nav-cta">
            Back to Shop
          </a>
        </div>
      </nav>
      <div className="policy-content">
        <p className="section-label">Transparency</p>
        <h1 className="policy-title">Certificate of Analysis Library</h1>
        <p className="policy-intro">
          All PepChain LLC products are independently tested by accredited
          third-party laboratories. Certificates of Analysis are available below
          for each product batch, confirming identity, purity, and concentration
          via HPLC and mass spectrometry.
        </p>
        <div className="coa-grid">
          {coas.map((coa) => (
            <div className="coa-card" key={coa.name}>
              <p className="coa-product">{coa.name}</p>
              <p className="coa-detail">{coa.detail}</p>
              {coa.pdf ? (
                <button
                  className="coa-link"
                  onClick={() => setActivePdf(coa.pdf)}
                >
                  View COA
                </button>
              ) : (
                <p className="coa-detail">Available Soon</p>
              )}
            </div>
          ))}
        </div>
        <p className="coa-note">
          COA documents are updated with each new batch. For COA requests
          contact{" "}
          <a href="mailto:compliance@pepchainlab.com">
            compliance@pepchainlab.com
          </a>
        </p>
      </div>
    </div>
  );
}
function TermsOfUse() {
  return (
    <div className="policy-page">
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img src="/logo.png" alt="Pep-Chain" className="nav-logo-img" />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/#products">Products</a>
          </li>
          <li>
            <a href="/ruo-policy">RUO Policy</a>
          </li>
          <li>
            <a href="/coa-library">COA Library</a>
          </li>
        </ul>
        <div className="nav-right">
          <a href="/my-account" className="nav-icon-btn" title="My Account">
            <IconUser />
          </a>
          <a href="/" className="nav-cta">
            Back to Shop
          </a>
        </div>
      </nav>
      <div className="policy-content">
        <p className="section-label">Legal</p>
        <h1 className="policy-title">Terms of Use</h1>
        <div className="policy-body">
          <p>
            By accessing or using pepchainlab.com, you agree to be bound by
            these Terms of Use. If you do not agree, do not use this site.
          </p>

          <h3>Eligibility</h3>
          <p>
            You must be at least 21 years of age and a qualified research
            professional to purchase from PepChain LLC. By placing an order you
            represent that you meet these requirements.
          </p>

          <h3>Research Use Only</h3>
          <p>
            All products sold by PepChain LLC are strictly for in vitro
            laboratory and scientific research use only. They are not intended
            for human or animal consumption, clinical use, or any other purpose.
            See our full RUO Policy at pepchainlab.com/ruo-policy.
          </p>

          <h3>Intellectual Property</h3>
          <p>
            All content on this site including text, images, logos, and design
            is the property of PepChain LLC and may not be reproduced without
            written permission.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            PepChain LLC shall not be liable for any direct, indirect,
            incidental, or consequential damages arising from the use or
            inability to use our products or website. All products are sold
            as-is for research purposes only.
          </p>

          <h3>Governing Law</h3>
          <p>
            These terms are governed by the laws of the State of California. Any
            disputes shall be resolved in the courts of Sacramento County,
            California.
          </p>

          <h3>Changes to Terms</h3>
          <p>
            PepChain LLC reserves the right to update these Terms of Use at any
            time. Continued use of the site after changes constitutes acceptance
            of the new terms.
          </p>

          <h3>Contact</h3>
          <p>
            For questions contact us at{" "}
            <a href="mailto:compliance@pepchainlab.com">
              compliance@pepchainlab.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function ShippingPolicy() {
  return (
    <div className="policy-page">
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img src="/logo.png" alt="Pep-Chain" className="nav-logo-img" />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/#products">Products</a>
          </li>
          <li>
            <a href="/ruo-policy">RUO Policy</a>
          </li>
          <li>
            <a href="/coa-library">COA Library</a>
          </li>
        </ul>
        <div className="nav-right">
          <a href="/my-account" className="nav-icon-btn" title="My Account">
            <IconUser />
          </a>
          <a href="/" className="nav-cta">
            Back to Shop
          </a>
        </div>
      </nav>
      <div className="policy-content">
        <p className="section-label">Shipping</p>
        <h1 className="policy-title">Shipping Policy</h1>
        <div className="policy-body">
          <p>
            PepChain LLC ships all orders within the continental United States
            only. We do not ship internationally at this time.
          </p>

          <h3>Processing Time</h3>
          <p>
            Orders are processed within 1-2 business days of payment
            confirmation. Orders placed on weekends or federal holidays will
            begin processing the next business day.
          </p>

          <h3>Carrier</h3>
          <p>
            All orders are shipped via USPS. Tracking information will be
            provided via email once your order has shipped.
          </p>

          <h3>Shipping Rates</h3>
          <p>
            Shipping rates are calculated at checkout based on order weight and
            destination.
          </p>

          <h3>Delivery Times</h3>
          <p>
            Delivery times vary by destination and are estimated by USPS.
            PepChain LLC is not responsible for delays caused by the carrier,
            weather, or other circumstances outside our control.
          </p>

          <h3>Address Accuracy</h3>
          <p>
            It is the customer's responsibility to provide an accurate shipping
            address. PepChain LLC is not responsible for orders shipped to an
            incorrect address provided by the customer.
          </p>

          <h3>Lost or Stolen Packages</h3>
          <p>
            If your tracking shows delivered but you have not received your
            package, please contact your local USPS facility. PepChain LLC is
            not responsible for packages that are lost or stolen after confirmed
            delivery.
          </p>

          <h3>Contact</h3>
          <p>
            For shipping questions contact us at{" "}
            <a href="mailto:compliance@pepchainlab.com">
              compliance@pepchainlab.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function ReturnsPolicy() {
  return (
    <div className="policy-page">
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img src="/logo.png" alt="Pep-Chain" className="nav-logo-img" />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/#products">Products</a>
          </li>
          <li>
            <a href="/ruo-policy">RUO Policy</a>
          </li>
          <li>
            <a href="/coa-library">COA Library</a>
          </li>
        </ul>
        <div className="nav-right">
          <a href="/my-account" className="nav-icon-btn" title="My Account">
            <IconUser />
          </a>
          <a href="/" className="nav-cta">
            Back to Shop
          </a>
        </div>
      </nav>
      <div className="policy-content">
        <p className="section-label">Returns</p>
        <h1 className="policy-title">Returns & Replacements</h1>
        <div className="policy-body">
          <p>
            Due to the nature of research chemicals, PepChain LLC does not
            accept returns. All sales are final.
          </p>

          <h3>Damaged or Incorrect Items</h3>
          <p>
            If you receive a damaged or incorrect item, we will ship you a
            replacement at no charge. To qualify for a replacement you must
            contact us within 7 days of delivery and provide the following:
          </p>
          <p>— Photographic evidence of the damaged or incorrect item</p>
          <p>— Your order number</p>
          <p>— A brief description of the issue</p>

          <h3>How to Request a Replacement</h3>
          <p>
            Email us at{" "}
            <a href="mailto:compliance@pepchainlab.com">
              compliance@pepchainlab.com
            </a>{" "}
            with the subject line "Replacement Request — Order #[your order
            number]" and include the required documentation. We will review your
            request and respond within 2 business days.
          </p>

          <h3>Non-Qualifying Claims</h3>
          <p>
            Replacements will not be issued for orders where the incorrect
            shipping address was provided by the customer, orders that show as
            delivered by the carrier, or claims submitted more than 7 days after
            the delivery date.
          </p>

          <h3>No Refunds</h3>
          <p>
            PepChain LLC does not issue monetary refunds under any
            circumstances. Our commitment is to ensure you receive the correct
            product in good condition — if we fall short of that, we will make
            it right with a replacement.
          </p>
        </div>
      </div>
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <div className="policy-page">
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img src="/logo.png" alt="Pep-Chain" className="nav-logo-img" />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/#products">Products</a>
          </li>
          <li>
            <a href="/ruo-policy">RUO Policy</a>
          </li>
          <li>
            <a href="/coa-library">COA Library</a>
          </li>
        </ul>
        <div className="nav-right">
          <a href="/my-account" className="nav-icon-btn" title="My Account">
            <IconUser />
          </a>
          <a href="/" className="nav-cta">
            Back to Shop
          </a>
        </div>
      </nav>
      <div className="policy-content">
        <p className="section-label">Privacy</p>
        <h1 className="policy-title">Privacy Policy</h1>
        <div className="policy-body">
          <p>
            PepChain LLC ("we", "us", "our") is committed to protecting your
            privacy. This policy explains how we collect, use, and protect your
            information when you use pepchainlab.com.
          </p>

          <h3>Information We Collect</h3>
          <p>
            We collect information you provide when placing an order including
            your name, email address, shipping address, and payment information.
            Payment information is processed securely by our payment processor
            and is not stored by PepChain LLC.
          </p>

          <h3>How We Use Your Information</h3>
          <p>
            We use your information solely to process and fulfill your orders,
            communicate with you about your orders, and comply with legal
            obligations. We do not sell, rent, or share your personal
            information with third parties for marketing purposes.
          </p>

          <h3>Cookies</h3>
          <p>
            Our site uses cookies to maintain your session and improve your
            browsing experience. By using our site you consent to the use of
            cookies. You may disable cookies in your browser settings but this
            may affect site functionality.
          </p>

          <h3>Data Security</h3>
          <p>
            We implement reasonable security measures to protect your personal
            information. However no method of transmission over the internet is
            100% secure and we cannot guarantee absolute security.
          </p>

          <h3>California Privacy Rights</h3>
          <p>
            As a California-based LLC, we comply with the California Consumer
            Privacy Act (CCPA). California residents have the right to request
            access to, deletion of, or information about the personal data we
            hold about them. To exercise these rights contact us at
            compliance@pepchainlab.com.
          </p>

          <h3>Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated date.
          </p>

          <h3>Contact</h3>
          <p>
            For privacy questions contact us at{" "}
            <a href="mailto:compliance@pepchainlab.com">
              compliance@pepchainlab.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
function NotFound() {
  return (
    <div className="policy-page">
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img src="/logo.png" alt="Pep-Chain" className="nav-logo-img" />
        </a>
        <div className="nav-right">
          <a href="/my-account" className="nav-icon-btn" title="My Account">
            <IconUser />
          </a>
          <a href="/" className="nav-cta">
            Back to Shop
          </a>
        </div>
      </nav>
      <div
        className="policy-content"
        style={{ textAlign: "center", paddingTop: "8rem" }}
      >
        <p className="section-label">404</p>
        <h1 className="policy-title">Page Not Found</h1>
        <p style={{ color: "var(--white-muted)", marginBottom: "2rem" }}>
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="btn-primary"
          style={{ textDecoration: "none", padding: "0.85rem 2.2rem" }}
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
function NotifyModal({ product, variationId, onClose }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");
  const shortName = product.name.split("|")[0].trim();

  const handleSubmit = async () => {
    if (!email) return;
    setStatus("submitting");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_WC_URL}/wp-json/wc-instocknotifier/v3/create_subscriber`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: product.id,
            variation_id: variationId || 0,
            email: email,
            subscriber_name: name || "Subscriber",
            status: "subscribe",
            subscriber_phone: "0000000000",
            custom_quantity: "1",
          }),
        },
      );
      if (res.ok) {
        setStatus("success");
        setTimeout(() => onClose(), 1500);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="notify-modal">
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        {status === "success" ? (
          <div className="notify-success">
            <p className="notify-success-icon">✓</p>
            <p className="notify-success-text">You're on the list!</p>
            <p className="notify-success-sub">
              We'll email you when {shortName} is back in stock.
            </p>
          </div>
        ) : (
          <>
            <p className="section-label">Back in Stock Notification</p>
            <h3 className="notify-title">{shortName}</h3>
            <p className="notify-desc">
              Enter your email and we'll notify you when this product is
              available again.
            </p>
            <input
              type="email"
              placeholder="Email address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="notify-input"
            />
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="notify-input"
            />
            <button
              className="btn-primary"
              style={{ width: "100%" }}
              onClick={handleSubmit}
              disabled={status === "submitting" || !email}
            >
              {status === "submitting"
                ? "Subscribing…"
                : status === "error"
                  ? "Try Again"
                  : "Notify Me"}
            </button>
          </>
        )}
      </div>
    </>
  );
}

function ProductPage({ slug, addToCart }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showNotify, setShowNotify] = useState(false);

  useEffect(() => {
    checkLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        window.location.href = `${import.meta.env.VITE_WC_URL}/my-account/?redirect_to=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    wcFetch(`products?slug=${slug}`)
      .then(async (data) => {
        const p = data[0];
        if (!p) {
          setLoading(false);
          return;
        }
        if (p.type === "variable" && p.variations.length > 0) {
          const vars = await wcFetch(
            `products/${p.id}/variations?per_page=100`,
          );
          vars.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          setProduct({ ...p, variation_data: vars });
          setSelectedVariant(vars[0] || null);
        } else {
          setProduct({ ...p, variation_data: [] });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, authChecked]);

  if (!authChecked || loading)
    return (
      <div className="policy-page">
        <p
          style={{
            color: "var(--white-dim)",
            textAlign: "center",
            padding: "6rem 0",
          }}
        >
          Loading…
        </p>
      </div>
    );
  if (!product) return <NotFound />;

  const image = product.images?.[0]?.src || "/placeholder.png";
  const badge = product.tags?.[0]?.name || "Research";
  const shortName = product.name.split("|")[0].trim();
  const isVariable = product.type === "variable";
  const variants = product.variation_data || [];
  const inStock =
    isVariable && selectedVariant
      ? selectedVariant.stock_status === "instock"
      : product.stock_status === "instock";
  const price = isVariable
    ? selectedVariant
      ? `$${parseFloat(selectedVariant.price).toFixed(2)}`
      : `$${parseFloat(product.price).toFixed(2)}`
    : `$${parseFloat(product.price).toFixed(2)}`;

  const handleAdd = () => {
    const variantLabel =
      isVariable && selectedVariant
        ? selectedVariant.attributes?.map((a) => a.option).join(", ")
        : "";
    const variation =
      isVariable && selectedVariant
        ? selectedVariant.attributes?.reduce((acc, a) => {
            acc[`attribute_pa_${a.name.toLowerCase().replace(/\s+/g, "_")}`] =
              a.option;
            return acc;
          }, {})
        : null;
    addToCart(product, {
      dose: variantLabel,
      price,
      variation_id: isVariable && selectedVariant ? selectedVariant.id : null,
      variation,
    });
  };

  // Find COA link if one exists
  const coaMap = {
    retatrutide: "janoshik_r10.pdf",
    "ghk-cu": "janoshik_ghkcu50.pdf",
    "mots-c": "janoshik_motsc10.pdf",
    glow: "janoshik_glow50.pdf",
    "bacteriostatic-water": "janoshik_bacwater3.pdf",
  };
  const coaFile = Object.entries(coaMap).find(([key]) =>
    slug.toLowerCase().includes(key),
  );
  const coaUrl = coaFile
    ? `https://pepchainlab.com/wp-content/uploads/${coaFile[1]}`
    : null;

  return (
    <div className="product-page">
      <div className="product-page-inner">
        <div className="product-page-media">
          <span className="product-badge">{badge}</span>
          <img src={image} alt={shortName} className="product-page-img" />
        </div>
        <div className="product-page-details">
          <p className="section-label">Research Peptide</p>
          <h1 className="product-page-title">{shortName}</h1>
          {product.short_description && (
            <div
              className="product-page-desc"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}
          {isVariable && variants.length > 0 && (
            <>
              <p className="product-page-variant-label">Select Variant:</p>
              <div className="variant-selector">
                {variants.map((v) => {
                  const label =
                    v.attributes?.map((a) => a.option).join(" / ") || v.id;
                  return (
                    <button
                      key={v.id}
                      className={`variant-btn ${selectedVariant?.id === v.id ? "active" : ""}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          <div className="product-page-buy">
            <span className="product-price">{price}</span>
            <button
              className={`add-btn ${!inStock ? "out-of-stock-btn" : ""}`}
              onClick={handleAdd}
              disabled={!inStock}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
          {!inStock && (
            <button
              className="btn-secondary"
              style={{ marginTop: "0.75rem", width: "100%" }}
              onClick={() => setShowNotify(true)}
            >
              Notify Me When Available
            </button>
          )}

          <p className="research-note">
            For research use only · Not for human consumption
          </p>
          {coaUrl && (
            <a href="/coa-library" className="product-page-coa-link">
              View Certificate of Analysis →
            </a>
          )}
        </div>
      </div>

      {/* Full-width content sections below the hero */}
      <div className="product-page-content">
        {product.description && (
          <div className="product-page-section">
            <div
              className="product-page-section-body"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        <div className="product-page-section">
          <h2 className="product-page-section-title">Research Use</h2>
          <div className="product-page-section-body">
            <p>
              {shortName} is commonly studied in controlled laboratory and
              research settings. This product is supplied strictly for in vitro
              research purposes by qualified professionals.
            </p>
            <p>
              No medical, clinical, therapeutic, cosmetic, veterinary, dietary,
              weight-loss, appetite-control, metabolic, wellness, performance,
              or personal-use claims are made for this product.
            </p>
          </div>
        </div>

        <div className="product-page-section">
          <h2 className="product-page-section-title">Handling & Storage</h2>
          <div className="product-page-section-body">
            <p>
              {shortName} is supplied as a lyophilised powder in a sealed glass
              vial for controlled handling, storage, and analytical use in
              appropriate research environments.
            </p>
            <p>
              Store in a cool, dry place away from direct sunlight. For
              long-term storage, keep refrigerated at 2–8°C. Once reconstituted,
              use within a reasonable timeframe and store refrigerated. Avoid
              repeated freeze-thaw cycles.
            </p>
          </div>
        </div>

        <div className="product-page-disclaimer">
          <div className="disclaimer-icon">⚠</div>
          <div className="disclaimer-content">
            <p className="disclaimer-title">Research Use Only</p>
            <p className="disclaimer-body">
              This product is not intended for human or animal consumption. It
              has not been evaluated or approved by the FDA. By purchasing, you
              confirm you are a qualified research professional and will use
              this compound in compliance with all applicable laws.
            </p>
          </div>
        </div>
      </div>
      {showNotify && (
        <NotifyModal
          product={product}
          variationId={
            isVariable && selectedVariant ? selectedVariant.id : null
          }
          onClose={() => setShowNotify(false)}
        />
      )}
    </div>
  );
}
function CatalogPage({ addToCart }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <section className="section" style={{ paddingTop: "8rem" }}>
        <div className="section-inner">
          <p className="section-label">Our Catalog</p>
          <h1 className="section-title">
            Research <span>Peptides</span>
          </h1>
          <p className="section-sub">
            Every compound is rigorously tested for purity and potency before it
            reaches your lab.
          </p>
          <ProductGrid addToCart={addToCart} />
        </div>
      </section>
    </div>
  );
}

// ─── APP ───
export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [ageVerified, setAgeVerified] = useState(
    () => sessionStorage.getItem("ageVerified") === "true",
  );

  const handleAgeConfirm = () => {
    sessionStorage.setItem("ageVerified", "true");
    setAgeVerified(true);
  };

  const addToCart = (product, variant) => {
    const key = `${product.id}-${variant.dose}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing)
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [
        ...prev,
        {
          key,
          name: product.name,
          dose: variant.dose,
          price: variant.price,
          qty: 1,
          variation_id: variant.variation_id || null,
          variation: variant.variation || null,
        },
      ];
    });

    // Background sync to WooCommerce — fire and forget, don't block the UI
    (async () => {
      try {
        let cartKey = localStorage.getItem("wcCartKey");
        if (!cartKey) {
          const res = await fetch(
            `${import.meta.env.VITE_WC_URL}/wp-json/cocart/v2/cart`,
            { method: "GET", credentials: "include" },
          );
          const data = await res.json();
          cartKey = data.cart_key;
          localStorage.setItem("wcCartKey", cartKey);
        }

        await fetch(
          `${import.meta.env.VITE_WC_URL}/wp-json/cocart/v2/cart/add-item?cart_key=${cartKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              id: String(variant.variation_id || product.id),
              quantity: "1",
              ...(variant.variation_id && {
                variation_id: variant.variation_id,
                variation: variant.variation,
              }),
            }),
          },
        );
      } catch (e) {
        console.warn("Background cart sync failed:", e);
      }
    })();
  };
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const path = window.location.pathname;

  if (path === "/ruo-policy") return <RUOPolicy />;
  if (path === "/coa-library") return <COALibrary />;
  if (path === "/terms") return <TermsOfUse />;
  if (path === "/shipping-policy") return <ShippingPolicy />;
  if (path === "/returns") return <ReturnsPolicy />;
  if (path === "/privacy-policy") return <PrivacyPolicy />;
  if (path === "/products") {
    return (
      <>
        <div className="noise-overlay" />
        {!ageVerified && <AgeGate onConfirm={handleAgeConfirm} />}
        <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
        {cartOpen && (
          <CartDrawer
            cart={cart}
            onClose={() => setCartOpen(false)}
            onQtyChange={handleQtyChange}
          />
        )}
        <CatalogPage addToCart={addToCart} />
        <Footer />
      </>
    );
  }
  if (path.startsWith("/product/")) {
    return (
      <>
        <div className="noise-overlay" />
        {!ageVerified && <AgeGate onConfirm={handleAgeConfirm} />}
        <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
        {cartOpen && (
          <CartDrawer
            cart={cart}
            onClose={() => setCartOpen(false)}
            onQtyChange={handleQtyChange}
          />
        )}
        <ProductPage
          slug={path.replace("/product/", "")}
          addToCart={addToCart}
        />
        <Footer />
      </>
    );
  }
  if (path !== "/" && path !== "") return <NotFound />;

  return (
    <>
      <div className="noise-overlay" />
      {!ageVerified && <AgeGate onConfirm={handleAgeConfirm} />}
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onQtyChange={handleQtyChange}
        />
      )}
      <main>
        <Hero />
        <TrustBar />
        <Features />
        <Disclaimer />
        <Banner />
      </main>
      <Footer />
    </>
  );
}
