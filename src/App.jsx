import "./App.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
const WC_URL = import.meta.env.VITE_WC_URL;
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const IMAGE_MAP = {
  retatrutide:
    "https://pepchainlab.com/wp-content/uploads/2026/06/FIXED-NEW-RETA10.png",
  "retatrutide-20":
    "https://pepchainlab.com/wp-content/uploads/2026/06/FIXED-NEW-RETA20.png",
  "retatrutide-30":
    "https://pepchainlab.com/wp-content/uploads/2026/06/FIXED-NEW-RETA30.png",
  "ghk-cu":
    "https://pepchainlab.com/wp-content/uploads/2026/06/ghkcu50mgfixed.png",
  "mots-c": "https://pepchainlab.com/wp-content/uploads/2026/06/motscfixed.png",
  glow: "https://pepchainlab.com/wp-content/uploads/2026/06/glowblend50mgfixed.png",
  "bacteriostatic-water":
    "https://pepchainlab.com/wp-content/uploads/2026/06/FIXED-NEW-CHAINH20-10ML.png",
  "bacteriostatic-water-3ml":
    "https://pepchainlab.com/wp-content/uploads/2026/06/FIXED-NEW-CHAINH20-3ML.png",
  wolverine:
    "https://pepchainlab.com/wp-content/uploads/2026/06/wolverineblend10mgfixed.png",
};

const getLocalImage = (slug) => {
  if (!slug) return null;
  const s = slug.toLowerCase();
  if (s.includes("glp") && s.includes("30"))
    return IMAGE_MAP["retatrutide-30"];
  if (s.includes("glp") && s.includes("20"))
    return IMAGE_MAP["retatrutide-20"];
  if (s.includes("glp")) return IMAGE_MAP["retatrutide"];
  if (s.includes("ghk")) return IMAGE_MAP["ghk-cu"];
  if (s.includes("mots")) return IMAGE_MAP["mots-c"];
  if (s.includes("glow")) return IMAGE_MAP["glow"];
  if (s.includes("h2o") && s.includes("3"))
    return IMAGE_MAP["bacteriostatic-water-3ml"];
  if (s.includes("h2o"))
    return IMAGE_MAP["bacteriostatic-water"];
  if (s.includes("wolverine")) return IMAGE_MAP["wolverine"];
  return null;
};
const wcFetch = (endpoint) => {
  return fetch(
    `${import.meta.env.VITE_WC_URL}/wp-content/themes/storefront-child/proxy.php?endpoint=${encodeURIComponent(endpoint)}`,
  ).then((r) => r.json());
};
const pepFetch = (path) => {
  return fetch(
    `${import.meta.env.VITE_WC_URL}/wp-json/pepchain/v1/${path}`,
  ).then((r) => r.json());
};
const checkLoggedIn = async (signal) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_WC_URL}/wp-json/pepchain/v1/me`,
      {
        credentials: "include",
        signal,
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.logged_in === true;
  } catch {
    return null;
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
function WalletTopupModal({ userId, onSuccess, onClose }) {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState("amount");
  const [errorMsg, setErrorMsg] = useState("");
  const [amountError, setAmountError] = useState("");
  const parsedAmount = parseFloat(amount) || 0;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: "460px" }}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        {step === "amount" && (
          <>
            <p className="section-label">Add Funds</p>
            <h3 className="modal-title">Top Up Your Wallet</h3>
            <p
              style={{
                color: "var(--white-muted)",
                fontSize: "0.88rem",
                marginBottom: "0.5rem",
              }}
            >
              Funds are added instantly and can be used on any order.
            </p>
            <input
              type="number"
              min="20"
              max="5000"
              step="0.01"
              className="notify-input"
              placeholder="Amount in USD (min $50)"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setAmountError("");
              }}
              style={{ marginTop: "0.5rem" }}
            />
            <button
              className="btn-primary"
              style={{ width: "100%", marginTop: "1rem" }}
              onClick={() => {
                if (parsedAmount < 50) {
                  setAmountError("Minimum top-up amount is $50.");
                  return;
                }
                setAmountError("");
                setStep("pay");
              }}
            >
              Continue to Payment
            </button>
            {amountError && (
              <p
                style={{
                  color: "rgba(46, 127, 255, 0.75)",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginTop: "0.75rem",
                  textAlign: "center",
                  borderTop: "1px solid rgba(46, 127, 255, 0.15)",
                  paddingTop: "0.75rem",
                }}
              >
                {amountError}
              </p>
            )}
          </>
        )}
        {step === "pay" && (
          <>
            <p className="section-label">Payment</p>
            <p
              style={{
                color: "var(--white-muted)",
                fontSize: "0.9rem",
                marginBottom: "1.25rem",
              }}
            >
              Adding{" "}
              <strong style={{ color: "var(--blue-bright)" }}>
                ${parsedAmount.toFixed(2)}
              </strong>{" "}
              to your wallet
            </p>
            <PayPalScriptProvider
              options={{
                clientId: PAYPAL_CLIENT_ID,
                currency: "USD",
                intent: "capture",
                components: "buttons",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical", shape: "rect", label: "pay" }}
                forceReRender={[parsedAmount]}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [
                      {
                        amount: { value: parsedAmount.toFixed(2) },
                        description: "Store Credit - PepChain LLC",
                      },
                    ],
                    application_context: { shipping_preference: "NO_SHIPPING" },
                  })
                }
                onApprove={async (data, actions) => {
                  try {
                    const order = await actions.order.capture();
                    const res = await fetch(
                      `${import.meta.env.VITE_WC_URL}/wp-json/pepchain/v1/wallet/topup`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                          paypal_order_id: order.id,
                          amount: parsedAmount,
                        }),
                      },
                    );
                    const result = await res.json();
                    if (result.success) {
                      setStep("success");
                      onSuccess(result.new_balance);
                    } else {
                      setErrorMsg(result.message || "Could not credit wallet.");
                      setStep("error");
                    }
                  } catch {
                    setErrorMsg(
                      "Network error. Contact support with your PayPal receipt.",
                    );
                    setStep("error");
                  }
                }}
                onError={() => {
                  setErrorMsg("PayPal encountered an error.");
                  setStep("error");
                }}
                onCancel={() => setStep("amount")}
              />
            </PayPalScriptProvider>
            <button
              className="btn-secondary"
              style={{ width: "100%", marginTop: "0.75rem" }}
              onClick={() => setStep("amount")}
            >
              ← Change Amount
            </button>
          </>
        )}
        {step === "success" && (
          <div className="notify-success" style={{ padding: "1.5rem 0" }}>
            <p className="notify-success-icon">✓</p>
            <p className="notify-success-text">Funds Added!</p>
            <p className="notify-success-sub">
              ${parsedAmount.toFixed(2)} has been added to your wallet.
            </p>
            <button
              className="btn-primary"
              style={{ marginTop: "1rem", width: "100%" }}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}
        {step === "error" && (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>⚠</p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Something went wrong
            </p>
            <p
              style={{
                color: "var(--white-muted)",
                fontSize: "0.85rem",
                marginBottom: "1.5rem",
              }}
            >
              {errorMsg}
            </p>
            <button
              className="btn-secondary"
              style={{ width: "100%" }}
              onClick={() => {
                setStep("amount");
                setErrorMsg("");
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </>
  );
}
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
  const [isCheckingOut, setIsCheckingOut] = useState(false);
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
          <button className="cart-close-btn" onClick={onClose}>✕</button>
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
                    <button className="qty-btn" onClick={() => onQtyChange(item.key, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button className="qty-btn" onClick={() => onQtyChange(item.key, 1)}>+</button>
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
                disabled={isCheckingOut}
                onClick={async () => {
                  if (isCheckingOut) return;
                  setIsCheckingOut(true);
                  try {
                    // User is logged in → their cart is bound to their account.
                    // credentials:"include" carries the WP login cookie. No cart_key.

                    // 1. Clear their server cart
                    await fetch(`${import.meta.env.VITE_WC_URL}/wp-json/cocart/v2/cart/clear`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                    });

                    // 2. Push every local item
                    for (const item of cart) {
                      const res = await fetch(
                        `${import.meta.env.VITE_WC_URL}/wp-json/cocart/v2/cart/add-item`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({
                            id: String(item.variation_id || item.key.split("-")[0]),
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

                    // 3. Hand off to checkout — session already owns the cart
                    sessionStorage.setItem("returningFromWP", "1");
                    window.location.href = `${import.meta.env.VITE_WC_URL}/checkout/`;
                  } catch (err) {
                    console.error("Cart sync failed", err);
                    alert(err.message || "Something went wrong. Please try again.");
                    setIsCheckingOut(false);
                  }
                }}
              >
                {isCheckingOut ? "Processing…" : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
function Navbar({
  cartCount,
  onCartOpen,
  onWalletOpen,
  walletBalance,
  cartSyncing,
  onNavigate,
}) {
  return (
    <nav className="navbar">
      <a href="/" className="nav-logo">
        <img
          src="/pep-chain-logo-banner.png"
          alt="PepChain"
          className="nav-logo-img"
        />
      </a>
      <ul className="nav-links">
        <li>
          <a
            href="/products"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("/products");
            }}
          >
            Products
          </a>
        </li>
        <li>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("/about");
            }}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="/coa-library"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("/coa-library");
            }}
          >
            COA Library
          </a>
        </li>
        <li>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("/contact");
            }}
          >
            Contact
          </a>
        </li>
      </ul>
      <div className="nav-right">
        <a href="/my-account" className="nav-icon-btn" title="My Account">
          <IconUser />
        </a>
        <button
          className="btn-secondary pep-wallet-btn"
          style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
          onClick={onWalletOpen}
          title="Add funds to wallet"
        >
          {walletBalance !== null ? (
            <>
              <span className="pep-wallet-btn-label">Wallet</span>
              <span className="pep-wallet-btn-amount">
                ${parseFloat(walletBalance).toFixed(2)}
              </span>
            </>
          ) : (
            "Wallet"
          )}
        </button>
        <button className="nav-cta" onClick={onCartOpen}>
          {cartSyncing ? "Syncing…" : "Cart"}
          {!cartSyncing && cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  const [vialImg] = useState(
  "https://pepchainlab.com/wp-content/uploads/2026/06/ghkcu50mgfixed.png",
);
  return (
    <section
      className="hero hero-split"
      style={{
        animation: "heroFadeIn 0.8s ease both",
      }}
    >
      <div className="hero-split-bg" />
      <div className="hero-dots" />

      {/* ── Left ── */}
      <div className="hero-split-left">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Research Grade Peptides
        </div>
        <h1 className="hero-split-title">
          Precision.
          <br />
          <span>Purity.</span>
          <br />
          Verified.
        </h1>
        <div className="hero-title-line" />
        <p className="hero-split-sub">
          Every compound independently tested and supplied strictly for
          scientific research by qualified professionals.
        </p>
        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => {
              window.location.href = "/products";
            }}
          >
            Browse Products
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              const el = document.getElementById("about");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* ── Right: vial showcase ── */}
      <div className="hero-split-right">
        <div className="hero-sep" />
        <div className="hero-vial-grid" />
        <div className="hero-vial-glow" />
        <div className="hero-vial-scene">
          <span className="hero-vial-tag">Research Compound</span>
          <div className="hero-vial-frame">
            <div className="hero-vial-float">
              {vialImg ? (
                <img
                  src={vialImg}
                  alt="GHK-Cu 50mg"
                  className="hero-vial-img"
                  decoding="async"
                  fetchPriority="high"
                />
              ) : (
                <div className="hero-vial-placeholder" />
              )}
            </div>
          </div>
          <div className="hero-vial-shadow" />
          <span className="hero-vial-tag">GHK-Cu · 50mg</span>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    "99% Purity Guaranteed",
    "HPLC Verified",
    "48hr Dispatch",
    "3rd Party Lab Tested",
    "COA on Every Batch",
    "10+ Peptide Compounds",
    "Research Use Only",
    "US Based",
  ];

  return (
    <div className="ticker-wrap">
      <div className="ticker-track ticker-animate">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div className="ticker-item" key={i}>
            <span className="ticker-dot" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
function ProductCard({ product, addToCart, full = false }) {
  const badge = product.tags?.[0]?.name || "Research";
  const shortName = product.name.split("|")[0].trim();
  const isVariable = product.type === "variable";
  const variants = product.variation_data || [];
  const [selectedVariant, setSelectedVariant] = useState(
    variants.find((v) => v.stock_status === "instock") || variants[0] || null,
  );

  const getVariantImage = () => {
    if (!selectedVariant) return product.localImg;
    const attrs =
      selectedVariant.attributes
        ?.map((a) => a.option)
        .join(" ")
        .toLowerCase() || "";
    if (attrs.includes("30")) return IMAGE_MAP["retatrutide-30"];
    if (attrs.includes("20")) return IMAGE_MAP["retatrutide-20"];
    if (attrs.includes("10") && product.slug?.includes("glp"))
      return IMAGE_MAP["retatrutide"];
    if (attrs.includes("10") && product.slug?.includes("h2o"))
      return IMAGE_MAP["bacteriostatic-water"];
    if (attrs.includes("3") && product.slug?.includes("h2o"))
      return IMAGE_MAP["bacteriostatic-water-3ml"];
    return product.localImg;
  };
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
      <img
        src={
          getVariantImage() ||
          selectedVariant?.image?.src ||
          product.images?.[0]?.src ||
          "/placeholder.png"
        }
        alt={shortName}
        className="product-img"
        fetchPriority="high"
        decoding="async"
        onLoad={(e) => e.target.classList.add("loaded")}
      />
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
        {isVariable &&
          selectedVariant &&
          selectedVariant.stock_status !== "instock" && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(140, 160, 190, 0.85)",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: "0.5rem",
              }}
            >
              Out of Stock
            </p>
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
  // Start with cached catalog if we have it — page renders instantly on revisit.
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem("catalogCache");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem("catalogCache");
    } catch {
      return true;
    }
  });

  useEffect(() => {
    pepFetch("catalog")
      .then((response) => {
        const data = response.products || [];
        const withLocalImg = data.map((product) => ({
          ...product,
          localImg: getLocalImage(product.slug),
        }));
        setProducts(withLocalImg);
        setLoading(false);
        try {
          localStorage.setItem("catalogCache", JSON.stringify(withLocalImg));
        } catch (e) {
          console.warn("catalog cache write failed", e);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading && products.length === 0)
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
    <section className="bento-section" id="about">
      <div className="bento-inner">
        <div className="bento-card bento-hero">
          <div className="bento-hero-left">
            <p className="bento-eyebrow">Why PepChain</p>
            <h2 className="bento-hero-title">
              Built for researchers
              <br />
              who demand <span>more</span>
            </h2>
            <p className="bento-hero-body">
              We started PepChain because the research community deserved a
              supplier held to the same standards as the labs it serves. Every
              batch independently verified. Every COA published. No exceptions.
            </p>
            <a className="story-link" href="/coa-library">
              View COA Library →
            </a>
          </div>
          <div className="bento-hero-stats">
            <div className="bento-stat">
              <span className="bento-stat-num">99%</span>
              <span className="bento-stat-lbl">Avg purity</span>
            </div>
            <div className="bento-stat">
              <span className="bento-stat-num">48hr</span>
              <span className="bento-stat-lbl">Dispatch</span>
            </div>
            <div className="bento-stat">
              <span className="bento-stat-num">100%</span>
              <span className="bento-stat-lbl">3rd-party verified</span>
            </div>
          </div>
        </div>

        <div className="bento-card bento-feat">
          <div className="bento-feat-icon">
            <IconFlask />
          </div>
          <p className="bento-feat-label">01</p>
          <p className="bento-feat-title">Research Driven</p>
          <p className="bento-feat-desc">
            Every peptide backed by peer-reviewed science and rigorous in-house
            validation protocols.
          </p>
        </div>

        <div className="bento-card bento-feat">
          <div className="bento-feat-icon">
            <IconShield />
          </div>
          <p className="bento-feat-label">02</p>
          <p className="bento-feat-title">Quality Tested</p>
          <p className="bento-feat-desc">
            3rd-party HPLC and mass-spec testing on every batch. COAs available
            on every order.
          </p>
        </div>

        <div className="bento-card bento-feat">
          <div className="bento-feat-icon">
            <IconLink />
          </div>
          <p className="bento-feat-label">03</p>
          <p className="bento-feat-title">Peptide Experts</p>
          <p className="bento-feat-desc">
            Decades of combined biochemistry and formulation experience behind
            every product.
          </p>
        </div>

        <div className="bento-card bento-feat" style={{ gridColumn: "span 2" }}>
          <div className="bento-feat-icon">
            <IconChart />
          </div>
          <p className="bento-feat-label">04</p>
          <p className="bento-feat-title">Precision Formulated</p>
          <p className="bento-feat-desc">
            Formulated for researchers who demand reproducibility at every
            concentration and every run.
          </p>
        </div>

        <div className="bento-card bento-stats-card">
          <div className="bento-stats-item">
            <span className="bento-stat-num">99%</span>
            <span className="bento-stat-lbl">Avg purity</span>
          </div>
          <div className="bento-stats-divider" />
          <div className="bento-stats-item">
            <span className="bento-stat-num">48hr</span>
            <span className="bento-stat-lbl">Dispatch</span>
          </div>
          <div className="bento-stats-divider" />
          <div className="bento-stats-item">
            <span className="bento-stat-num">100%</span>
            <span className="bento-stat-lbl">3rd-party verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Disclaimer() {
  return (
    <div className="disclaimer-bubble-wrap">
      <div className="disclaimer-bubble">
        <div className="disclaimer-bubble-icon">⚠</div>
        <div className="disclaimer-bubble-content">
          <p className="disclaimer-bubble-title">
            FDA Disclaimer & Research Use Notice
          </p>
          <p className="disclaimer-bubble-body">
            All products sold by Pep-Chain are intended for research purposes
            only. Not for human or animal consumption, diagnosis, treatment, or
            prevention of any disease. Products are not FDA approved. By
            purchasing, you confirm you are a qualified research professional
            using these compounds in a controlled laboratory setting in full
            compliance with all applicable laws.
          </p>
        </div>
      </div>
    </div>
  );
}

function Banner() {
  return (
    <div className="dark-cta">
      <div className="dark-cta-inner">
        <div className="dark-cta-left">
          <p className="dark-cta-eyebrow">Ready to research?</p>
          <h2 className="dark-cta-title">
            Elevate Your
            <br />
            <span>Research</span>
          </h2>
          <p className="dark-cta-sub">
            Browse our full catalog of research-grade peptides — independently
            tested, purity verified, for qualified researchers only.
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              window.location.href = "/products";
            }}
          >
            Shop the Catalog
          </button>
        </div>
        <div className="dark-cta-right dark-cta-trust">
          <div className="trust-badge-item">
            <div className="trust-badge-icon">
              <IconFlask />
            </div>
            <div>
              <p className="trust-badge-title">HPLC Verified</p>
              <p className="trust-badge-sub">Every batch, every compound</p>
            </div>
          </div>
          <div className="trust-badge-item">
            <div className="trust-badge-icon">
              <IconShield />
            </div>
            <div>
              <p className="trust-badge-title">COA on Every Batch</p>
              <p className="trust-badge-sub">
                Published, downloadable, transparent
              </p>
            </div>
          </div>
          <div className="trust-badge-item">
            <div className="trust-badge-icon">
              <IconChart />
            </div>
            <div>
              <p className="trust-badge-title">48hr Dispatch</p>
              <p className="trust-badge-sub">
                USPS tracked, discreet packaging
              </p>
            </div>
          </div>
          <div className="trust-badge-item">
            <div className="trust-badge-icon">
              <IconLink />
            </div>
            <div>
              <p className="trust-badge-title">US-Based & Compliant</p>
              <p className="trust-badge-sub">
                California LLC, RUO policy enforced
              </p>
            </div>
          </div>
        </div>
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
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/ruo-policy">RUO Policy</a>
              </li>
              <li>
                <a href="/coa-library">COA Library</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
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
      <Helmet>
        <title>Research Use Only Policy | PepChain LLC</title>
        <meta
          name="description"
          content="PepChain LLC's Research Use Only policy. All products are intended exclusively for in vitro laboratory research by qualified professionals."
        />
      </Helmet>
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img
            src="/pep-chain-logo-banner.png"
            alt="PepChain"
            className="nav-logo-img"
          />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/products">Products</a>
          </li>
          <li>
            <a href="/coa-library">COA Library</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
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
      name: "GHK-Cu 50mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_ghkcu50.pdf",
    },
    {
      name: "Glow Blend 50mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_glow50.pdf",
    },
    { name: "Wolverine Blend 10mg", detail: "Coming Soon", pdf: null },
    {
      name: "MOTS-c 10mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_motsc10.pdf",
    },
    {
      name: "GLP-3(RT) 10mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_r10.pdf",
    },
    {
      name: "GLP-3(RT) 20mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_r20.pdf",
    },
    {
      name: "GLP-3(RT) 30mg",
      detail: "Janoshik Laboratory · HPLC Verified",
      pdf: "https://pepchainlab.com/wp-content/uploads/janoshik_r30.pdf",
    },
  ];

  return (
    <div className="policy-page">
      <Helmet>
        <title>Certificate of Analysis Library | PepChain LLC</title>
        <meta
          name="description"
          content="View third-party certificates of analysis for all PepChain peptide products. HPLC and mass spectrometry verified by accredited laboratories."
        />
      </Helmet>
      {activePdf && (
        <div className="pdf-modal-overlay" onClick={() => setActivePdf(null)}>
          <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <button
                className="pdf-modal-close"
                onClick={() => setActivePdf(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(activePdf)}&embedded=true`}
              className="pdf-iframe"
              title="Certificate of Analysis"
            />
          </div>
        </div>
      )}
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img
            src="/pep-chain-logo-banner.png"
            alt="PepChain"
            className="nav-logo-img"
          />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/products">Products</a>
          </li>
          <li>
            <a href="/ruo-policy">RUO Policy</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
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
      <Helmet>
        <title>Terms of Use | PepChain LLC</title>
        <meta
          name="description"
          content="Read PepChain LLC's Terms of Use. By accessing pepchainlab.com you agree to these terms governing research chemical purchases."
        />
      </Helmet>
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img
            src="/pep-chain-logo-banner.png"
            alt="PepChain"
            className="nav-logo-img"
          />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/products">Products</a>
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
      <Helmet>
        <title>Shipping Policy | PepChain LLC</title>
        <meta
          name="description"
          content="PepChain LLC ships all orders within the continental United States via USPS. Learn about processing times, delivery estimates, and shipping rates."
        />
      </Helmet>
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img
            src="/pep-chain-logo-banner.png"
            alt="PepChain"
            className="nav-logo-img"
          />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/products">Products</a>
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
      <Helmet>
        <title>Returns & Replacements | PepChain LLC</title>
        <meta
          name="description"
          content="PepChain LLC's returns and replacement policy. All sales are final. Damaged or incorrect items eligible for replacement within 7 days of delivery."
        />
      </Helmet>
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img
            src="/pep-chain-logo-banner.png"
            alt="PepChain"
            className="nav-logo-img"
          />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/products">Products</a>
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
      <Helmet>
        <title>Privacy Policy | PepChain LLC</title>
        <meta
          name="description"
          content="PepChain LLC's privacy policy. Learn how we collect, use, and protect your personal information in compliance with the CCPA."
        />
      </Helmet>
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img
            src="/pep-chain-logo-banner.png"
            alt="PepChain"
            className="nav-logo-img"
          />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/products">Products</a>
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
          <img
            src="/pep-chain-logo-banner.png"
            alt="PepChain"
            className="nav-logo-img"
          />
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
  // Start with cached product if we have one — instant render on revisit.
  const [product, setProduct] = useState(() => {
    try {
      const cached = localStorage.getItem(`productCache:${slug}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem(`productCache:${slug}`);
    } catch {
      return true;
    }
  });
  const [selectedVariant, setSelectedVariant] = useState(() => {
    try {
      const cached = localStorage.getItem(`productCache:${slug}`);
      if (cached) {
        const p = JSON.parse(cached);
        if (p && p.type === "variable") {
          const firstInStock = (p.variation_data || []).find(
            (v) => v.stock_status === "instock",
          );
          return firstInStock || p.variation_data?.[0] || null;
        }
      }
    } catch { }
    return null;
  });
  const [authChecked, setAuthChecked] = useState(false);
  const [showNotify, setShowNotify] = useState(false);

  // Auth + product data fire in parallel, not serial.
  // Product renders as soon as data arrives; auth redirect happens
  // independently if the user turns out to not be logged in.
  useEffect(() => {
    const authController = new AbortController();
    let cancelled = false;

    // Fire auth check (doesn't block render)
    checkLoggedIn(authController.signal).then((loggedIn) => {
      if (cancelled) return;
      if (loggedIn === false) {
        window.location.href = `${import.meta.env.VITE_WC_URL}/my-account/?redirect_to=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      if (loggedIn === true) setAuthChecked(true);
    });

    // Fire product data fetch immediately (doesn't wait for auth)
    pepFetch(`product/${slug}`)
      .then((p) => {
        if (!p || p.code === "not_found") {
          setLoading(false);
          return;
        }
        setProduct(p);
        if (p.type === "variable") {
          setSelectedVariant((current) => {
            if (
              current &&
              (p.variation_data || []).some((v) => v.id === current.id)
            ) {
              return current;
            }
            const firstInStock = (p.variation_data || []).find(
              (v) => v.stock_status === "instock",
            );
            return firstInStock || p.variation_data?.[0] || null;
          });
        }
        setLoading(false);
        try {
          localStorage.setItem(`productCache:${slug}`, JSON.stringify(p));
        } catch (e) {
          console.warn("product cache write failed", e);
        }
      })
      .catch(() => setLoading(false));

    return () => {
      cancelled = true;
      authController.abort();
    };
  }, [slug]);

  if (loading && !product)
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

  const getProductPageImage = () => {
    if (!selectedVariant) return getLocalImage(slug);
    const attrs =
      selectedVariant.attributes
        ?.map((a) => a.option)
        .join(" ")
        .toLowerCase() || "";
    if (slug.includes("glp")) {
      if (attrs.includes("30")) return IMAGE_MAP["retatrutide-30"];
      if (attrs.includes("20")) return IMAGE_MAP["retatrutide-20"];
      return IMAGE_MAP["retatrutide"];
    }
    if (slug.includes("h2o")) {
      if (attrs.includes("3")) return IMAGE_MAP["bacteriostatic-water-3ml"];
      return IMAGE_MAP["bacteriostatic-water"];
    }
    return getLocalImage(slug);
  };

  const image = getProductPageImage();
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
    glp: "janoshik_r10.pdf",
    "ghk-cu": "janoshik_ghkcu50.pdf",
    "mots-c": "janoshik_motsc10.pdf",
    glow: "janoshik_glow50.pdf",
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
          <img
            src={image}
            alt={shortName}
            className="product-page-img"
            fetchPriority="high"
            decoding="async"
            onLoad={(e) => e.target.classList.add("loaded")}
          />
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
function ShippingBanner() {
  return (
    <div className="shipping-banner">
      <span className="shipping-banner-dot" />
      Free shipping on all orders over $100
    </div>
  );
}
function CatalogPage({ addToCart }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Helmet>
        <title>Research Peptides Catalog | PepChain LLC</title>
        <meta
          name="description"
          content="Browse PepChain's full catalog of research-grade peptides. Every compound independently tested, purity verified, for qualified researchers only."
        />
      </Helmet>
      <ShippingBanner />
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
function AboutPage() {
  return (
    <div className="policy-page">
      <Helmet>
        <title>About PepChain | Research Peptide Supplier USA</title>
        <meta
          name="description"
          content="PepChain LLC is a U.S.-based supplier of research-grade peptides. Every batch independently tested with COAs available. Sacramento, CA."
        />
      </Helmet>
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img
            src="/pep-chain-logo-banner.png"
            alt="PepChain"
            className="nav-logo-img"
          />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/products">Products</a>
          </li>
          <li>
            <a href="/coa-library">COA Library</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
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
        <p className="section-label">Company</p>
        <h1 className="policy-title">About PepChain</h1>
        <div className="policy-body">
          <p>
            PepChain LLC is a U.S.-based supplier of research-grade peptides and
            biochemical compounds, founded to meet the growing demand for
            high-purity, reliably sourced materials in the scientific research
            community.
          </p>

          <h3>Our Mission</h3>
          <p>
            We exist to support qualified researchers with compounds they can
            trust. Every product in our catalog is independently tested using
            HPLC and mass spectrometry, with certificates of analysis available
            for every batch. Precision, transparency, and integrity are the
            standards we hold ourselves to.
          </p>

          <h3>Research First</h3>
          <p>
            All products sold by PepChain are intended exclusively for in vitro
            laboratory research and scientific study. We supply researchers,
            institutions, and qualified professionals — not the general public.
            Our catalog is built around compounds that meet the rigorous purity
            requirements serious research demands.
          </p>

          <h3>Quality You Can Verify</h3>
          <p>
            Third-party lab testing is not optional for us — it is the baseline.
            Every batch is verified before it ships. COAs are published and
            available through our COA Library so researchers can review
            documentation independently.
          </p>

          <h3>Get in Touch</h3>
          <p>
            For questions, compliance inquiries, or support, reach us at{" "}
            <a href="mailto:support@pepchainlab.com">support@pepchainlab.com</a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="policy-page">
      <Helmet>
        <title>Contact PepChain | Support & Inquiries</title>
        <meta
          name="description"
          content="Have a question or concern? Contact the PepChain support team at support@pepchainlab.com. We're here to help."
        />
      </Helmet>
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img
            src="/pep-chain-logo-banner.png"
            alt="PepChain"
            className="nav-logo-img"
          />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/products">Products</a>
          </li>
          <li>
            <a href="/about">About</a>
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
        <p className="section-label">Support</p>
        <h1 className="policy-title">Contact Us</h1>
        <div className="policy-body">
          <p>
            If you have any questions, concerns, or need assistance with an
            order, our team is here to help.
          </p>
          <h3>Email Support</h3>
          <p>
            Reach us at{" "}
            <a href="mailto:support@pepchainlab.com">support@pepchainlab.com</a>{" "}
            and we will get back to you as soon as possible.
          </p>
          <h3>Compliance & Legal</h3>
          <p>
            For compliance-related inquiries, contact us at{" "}
            <a href="mailto:compliance@pepchainlab.com">
              compliance@pepchainlab.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function CartToast({ toast, onView, onClose }) {
  if (!toast) return null;
  return (
    <div className="cart-toast" key={toast.id}>
      <div className="cart-toast-check">✓</div>
      <img src={toast.image} alt="" className="cart-toast-img" />
      <div className="cart-toast-info">
        <p className="cart-toast-label">Added to Cart</p>
        <p className="cart-toast-name">{toast.name}</p>
        {toast.dose && <p className="cart-toast-dose">{toast.dose}</p>}
        <p className="cart-toast-price">{toast.price}</p>
      </div>
      <button className="cart-toast-view" onClick={onView}>
        View Cart
      </button>
      <button
        className="cart-toast-close"
        onClick={onClose}
        aria-label="Dismiss"
      >
        ✕
      </button>
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
  const [walletOpen, setWalletOpen] = useState(
    () =>
      new URLSearchParams(window.location.search).get("openWallet") === "true",
  );
  const [currentUserId, setCurrentUserId] = useState(null);
  const [walletBalance, setWalletBalance] = useState(() => {
    const cached = localStorage.getItem("walletBalance");
    return cached !== null ? cached : null;
  });
  const [cartSyncing, setCartSyncing] = useState(false);
  const [toast, setToast] = useState(null);
  const cartKeyFetchRef = useRef(null);
  // reveal the instant the stylesheet is actually loaded (no fixed delay)

  // Validates the stored key looks real (CoCart keys are 32+ char hex strings,
  // not "1"). If missing or invalid, fetches a fresh one. Concurrent callers
  // share the same in-flight promise so we never fire two GET /cart at once.
  const getCartKey = () => {
    const stored = localStorage.getItem("wcCartKey");
    if (stored && stored.length >= 10) return Promise.resolve(stored);
    // Already fetching — share that promise
    if (cartKeyFetchRef.current) return cartKeyFetchRef.current;
    cartKeyFetchRef.current = fetch(
      `${import.meta.env.VITE_WC_URL}/wp-json/cocart/v2/cart`,
      { method: "GET", credentials: "include" },
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data.cart_key) throw new Error("no cart_key in response");
        localStorage.setItem("wcCartKey", data.cart_key);
        cartKeyFetchRef.current = null;
        return data.cart_key;
      })
      .catch((err) => {
        cartKeyFetchRef.current = null;
        localStorage.removeItem("wcCartKey");
        throw err;
      });
    return cartKeyFetchRef.current;
  };

  // Map a CoCart response into our drawer shape. ONE place to fix if fields differ.
  // If prices come out ~100x too big in testing, CoCart returns cents:
  // swap parseFloat(it.price) for (parseInt(it.price,10)/100).
  const mapCoCart = (data) =>
    Object.values(data?.items || {}).map((it) => ({
      key: it.item_key,
      item_key: it.item_key,
      name: it.name,
      dose: it.meta?.variation
        ? Object.values(it.meta.variation).join(", ")
        : "",
      price: `$${(parseFloat(it.price) / 100).toFixed(2)}`,
      qty: it.quantity?.value ?? it.quantity,
      variation_id: it.id,
      variation: it.meta?.variation || null,
    }));

  // cache drawer locally so it paints instantly next load
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // auto-dismiss the "added to cart" toast after a few seconds
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Affiliate referral tracking — fire SliceWP's visit recorder once per session.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const aff = params.get("aff") || params.get("ref");
    if (!aff) return;
    const guardKey = `pcAffTracked_${aff}`;
    if (sessionStorage.getItem(guardKey)) return;
    const body = new URLSearchParams();
    body.set("action", "slicewp_register_visit");
    body.set("aff", aff);
    body.set("url", window.location.href);
    fetch(`${import.meta.env.VITE_WC_URL}/wp-admin/admin-ajax.php`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
      .then(() => sessionStorage.setItem(guardKey, "1"))
      .catch(() => { });
  }, []);

  // wallet balance + user id for navbar/top-up — single /me call (was two)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_WC_URL}/wp-json/pepchain/v1/me`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.logged_in) {
          setCurrentUserId(data.user_id);
          setWalletBalance(data.wallet_balance);
          localStorage.setItem("walletBalance", data.wallet_balance);
        } else {
          setWalletBalance(null);
          localStorage.removeItem("walletBalance");
        }
      })
      .catch(() => { });
  }, []);

  // The cart is now fully local during browsing — no live CoCart sync, so
  // nothing can race or get overwritten. CoCart is only touched once, at
  // checkout (see CartDrawer's onClick), which clears it and pushes the full
  // local cart over right before redirecting.
  //
  // One thing still matters on mount: if the user is coming BACK from
  // WooCommerce checkout, their local cart was already handed off — clear it
  // so old items don't reappear.
  useEffect(() => {
    const cameFromWP = sessionStorage.getItem("returningFromWP") === "1";
    sessionStorage.removeItem("returningFromWP");
    if (cameFromWP) {
      setCart([]);
      localStorage.removeItem("wcCartKey");
    }
  }, []);
  const [ageVerified, setAgeVerified] = useState(
    () => sessionStorage.getItem("ageVerified") === "true",
  );
  const handleAgeConfirm = () => {
    sessionStorage.setItem("ageVerified", "true");
    setAgeVerified(true);
  };

  // Pure local edit — no network call, so spam-clicking +/- is instant and
  // can never race or get overwritten by a server response.
  const handleQtyChange = (key, delta) => {
    setCart((prev) => {
      const item = prev.find((i) => i.key === key);
      if (!item) return prev;
      const nextQty = item.qty + delta;
      if (nextQty <= 0) return prev.filter((i) => i.key !== key);
      return prev.map((i) => (i.key === key ? { ...i, qty: nextQty } : i));
    });
  };

  // Pure local add — no network call, so spamming "Add to Cart" is instant
  // and the count never lags or drops back down. CoCart is only touched
  // once, at checkout.
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
    setToast({
      id: Date.now(),
      name: product.name.split("|")[0].trim(),
      dose: variant.dose,
      price: variant.price,
      image:
        getLocalImage(product.slug) ||
        product.images?.[0]?.src ||
        "/placeholder.png",
    });
  };
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const path = window.location.pathname;

  if (path === "/ruo-policy") return <RUOPolicy />;
  if (path === "/coa-library") return <COALibrary />;
  if (path === "/terms") return <TermsOfUse />;
  if (path === "/shipping-policy") return <ShippingPolicy />;
  if (path === "/returns") return <ReturnsPolicy />;
  if (path === "/privacy-policy") return <PrivacyPolicy />;
  if (path === "/about") return <AboutPage />;
  if (path === "/contact") return <ContactPage />;
  if (path === "/products") {
    return (
      <>
        <div className="noise-overlay" />
        {!ageVerified && <AgeGate onConfirm={handleAgeConfirm} />}
        <Navbar
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
          cartSyncing={cartSyncing}
          walletBalance={walletBalance}
          onNavigate={(url) => {
            window.location.href = url;
          }}
          onWalletOpen={async () => {
            const loggedIn = await checkLoggedIn();
            if (loggedIn === false) {
              window.location.href = `${import.meta.env.VITE_WC_URL}/my-account/?redirect_to=${encodeURIComponent(window.location.pathname)}`;
            } else if (loggedIn === true) {
              setWalletOpen(true);
            }
          }}
        />
        {walletOpen && (
          <WalletTopupModal
            userId={currentUserId}
            onSuccess={(newBalance) => {
              setWalletBalance(newBalance);
              localStorage.setItem("walletBalance", newBalance);
            }}
            onClose={() => setWalletOpen(false)}
          />
        )}
        {cartOpen && (
          <CartDrawer
            cart={cart}
            onClose={() => setCartOpen(false)}
            onQtyChange={handleQtyChange}
            getCartKey={getCartKey}
          />
        )}
        <CartToast
          toast={toast}
          onView={() => {
            setToast(null);
            setCartOpen(true);
          }}
          onClose={() => setToast(null)}
        />
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
        <Navbar
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
          cartSyncing={cartSyncing}
          walletBalance={walletBalance}
          onNavigate={(url) => {
            window.location.href = url;
          }}
          onWalletOpen={async () => {
            const loggedIn = await checkLoggedIn();
            if (loggedIn === false) {
              window.location.href = `${import.meta.env.VITE_WC_URL}/my-account/?redirect_to=${encodeURIComponent(window.location.pathname)}`;
            } else if (loggedIn === true) {
              setWalletOpen(true);
            }
          }}
        />
        {walletOpen && (
          <WalletTopupModal
            userId={currentUserId}
            onSuccess={(newBalance) => {
              setWalletBalance(newBalance);
              localStorage.setItem("walletBalance", newBalance);
            }}
            onClose={() => setWalletOpen(false)}
          />
        )}
        {cartOpen && (
          <CartDrawer
            cart={cart}
            onClose={() => setCartOpen(false)}
            onQtyChange={handleQtyChange}
            getCartKey={getCartKey}
          />
        )}
        <CartToast
          toast={toast}
          onView={() => {
            setToast(null);
            setCartOpen(true);
          }}
          onClose={() => setToast(null)}
        />
        <ShippingBanner />
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
      <Helmet>
        <title>PepChain | Research Grade Peptides | USA</title>
        <meta
          name="description"
          content="PepChain LLC supplies research-grade peptides independently tested for purity and potency. For qualified research professionals only. Based in Sacramento, CA."
        />
      </Helmet>
      <div className="noise-overlay" />
      {!ageVerified && <AgeGate onConfirm={handleAgeConfirm} />}
      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        cartSyncing={cartSyncing}
        walletBalance={walletBalance}
        onNavigate={(url) => {
          window.location.href = url;
        }}
        onWalletOpen={async () => {
          const loggedIn = await checkLoggedIn();
          if (loggedIn === false) {
            window.location.href = `${import.meta.env.VITE_WC_URL}/my-account/?redirect_to=${encodeURIComponent(window.location.pathname)}`;
          } else if (loggedIn === true) {
            setWalletOpen(true);
          }
        }}
      />
      {walletOpen && (
        <WalletTopupModal
          userId={currentUserId}
          onSuccess={(newBalance) => {
            setWalletBalance(newBalance);
            localStorage.setItem("walletBalance", newBalance);
          }}
          onClose={() => setWalletOpen(false)}
        />
      )}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onQtyChange={handleQtyChange}
          getCartKey={getCartKey}
        />
      )}
      <CartToast
        toast={toast}
        onView={() => {
          setToast(null);
          setCartOpen(true);
        }}
        onClose={() => setToast(null)}
      />
      <main>
        <Hero />
        <TrustBar />
        <Features />
        <Banner />
        <Disclaimer />
      </main>
      <Footer />
    </>
  );
}
