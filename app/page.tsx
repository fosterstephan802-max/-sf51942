"use client";
import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────
   Membership Welcome Ad  (5-8 second animated sequence)
   Scene 1 (0-1.5 s) : envelope slides in
   Scene 2 (1.5-3 s) : card opens, name / welcome text appears
   Scene 3 (3-5.5 s) : benefit bullets count in one-by-one
   Scene 4 (5.5-8 s) : confetti burst + pulsing CTA button
───────────────────────────────────────────────────────────── */
const SCENE_DURATIONS = [1500, 1500, 2500, 2500]; // ms per scene

const BENEFITS = [
  "🎁  50% off when you spend $50+ on your 1st order",
  "✅  Save up to 40% at 500+ stores every month",
  "✅  Exclusive member-only flash deals",
  "✅  Free worldwide price alerts",
  "✅  Priority customer support",
];

function MembershipWelcomeAd({ onClose }: { onClose: () => void }) {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    SCENE_DURATIONS.forEach((dur, i) => {
      elapsed += dur;
      const t = setTimeout(() => setScene(i + 1), elapsed);
      timers.push(t);
    });
    // Auto-close after total duration
    const total = SCENE_DURATIONS.reduce((a, b) => a + b, 0);
    const closeTimer = setTimeout(onClose, total);
    timers.push(closeTimer);
    return () => timers.forEach(clearTimeout);
  }, [onClose]);

  const confetti = ["🎉", "🌟", "🎊", "💛", "🏆", "🎁", "✨", "🥳"];

  return (
    <>
      <style>{`
        @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
        @keyframes slideDown{ from { transform:translateY(-120px); opacity:0 }
                               to   { transform:translateY(0);     opacity:1 } }
        @keyframes popIn    { from { transform:scale(0.4); opacity:0 }
                               to   { transform:scale(1);   opacity:1 } }
        @keyframes pulse    { 0%,100%{ transform:scale(1)   }
                               50%   { transform:scale(1.06) } }
        @keyframes floatUp  { 0%  { transform:translateY(0)   opacity:1 }
                               100%{ transform:translateY(-220px); opacity:0 } }
        @keyframes spin     { to { transform:rotate(360deg) } }
        .isc-confetti-piece {
          position:absolute;
          bottom: 20%;
          animation: floatUp 2.5s ease-out forwards;
          font-size: 2rem;
          pointer-events:none;
        }
        .isc-benefit {
          animation: slideDown 0.5s ease both;
        }
        .isc-cta-btn {
          animation: pulse 1.2s ease-in-out infinite;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9000,
          background: "rgba(0,20,60,0.82)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.4s ease",
        }}
      >
        {/* Card container – stop click propagation so only backdrop closes */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            background: "linear-gradient(145deg,#003580 0%,#0052a5 60%,#1a1a2e 100%)",
            borderRadius: 20,
            padding: "40px 48px 36px",
            maxWidth: 480,
            width: "90%",
            color: "#fff",
            boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
            textAlign: "center",
            overflow: "hidden",
            animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Close × */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 18,
              background: "none", border: "none", color: "#aac",
              fontSize: "1.4rem", cursor: "pointer", lineHeight: 1,
            }}
          >✕</button>

          {/* ── Scene 0: envelope ── */}
          {scene === 0 && (
            <div style={{ animation: "slideDown 0.6s ease" }}>
              <div style={{ fontSize: 80, marginBottom: 12 }}>📩</div>
              <p style={{ color: "#ffd700", fontWeight: 700, fontSize: "1.1rem" }}>
                Your membership is on its way…
              </p>
            </div>
          )}

          {/* ── Scene 1: welcome card opens ── */}
          {scene === 1 && (
            <div style={{ animation: "popIn 0.5s ease" }}>
              <div style={{ fontSize: 72, marginBottom: 8 }}>🌐🎉</div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffd700", margin: "0 0 8px" }}>
                Welcome to the Club!
              </h2>
              <p style={{ color: "#cde", fontSize: "1rem", lineHeight: 1.5 }}>
                You're now a member of<br />
                <strong style={{ color: "#fff" }}>International Shoppers Club</strong>
              </p>
            </div>
          )}

          {/* ── Scene 2: benefits ── */}
          {scene === 2 && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
              <h3 style={{ color: "#ffd700", fontWeight: 700, fontSize: "1.15rem", marginBottom: 16 }}>
                Your Member Perks
              </h3>
              {BENEFITS.map((b, i) => (
                <div
                  key={b}
                  className="isc-benefit"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    padding: "8px 14px",
                    marginBottom: 8,
                    textAlign: "left",
                    fontSize: "0.9rem",
                    animationDelay: `${i * 0.35}s`,
                  }}
                >
                  {b}
                </div>
              ))}
            </div>
          )}

          {/* ── Scene 3: confetti + CTA ── */}
          {scene >= 3 && (
            <div style={{ animation: "fadeIn 0.5s ease" }}>
              {/* Confetti pieces */}
              {confetti.map((emoji, i) => (
                <span
                  key={i}
                  className="isc-confetti-piece"
                  style={{
                    left: `${8 + i * 11}%`,
                    animationDelay: `${i * 0.18}s`,
                  }}
                >
                  {emoji}
                </span>
              ))}

              <div style={{ fontSize: 64, marginBottom: 8 }}>🥳</div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffd700", margin: "0 0 6px" }}>
                You&apos;re In!
              </h2>
              <p style={{ color: "#cde", fontSize: "0.95rem", marginBottom: 22 }}>
                Start saving on your first order today.
              </p>
              <button
                className="isc-cta-btn"
                onClick={onClose}
                style={{
                  background: "#ffd700",
                  color: "#003580",
                  border: "none",
                  borderRadius: 10,
                  padding: "13px 32px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Start Shopping →
              </button>
            </div>
          )}

          {/* Progress bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, height: 4,
            background: "#ffd700",
            width: `${((scene + 1) / (SCENE_DURATIONS.length + 1)) * 100}%`,
            transition: "width 0.5s ease",
            borderRadius: "0 0 0 20px",
          }} />
        </div>
      </div>
    </>
  );
}

const categories = [
  "All", "Electronics", "Clothing", "Home & Garden", "Sports", "Toys", "Beauty", "Books", "Automotive",
];

const products = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Headphones",
    image: "🎧",
    category: "Electronics",
    prices: [
      { store: "Amazon", price: 279.99, url: "#" },
      { store: "Best Buy", price: 299.99, url: "#" },
      { store: "Walmart", price: 289.00, url: "#" },
      { store: "Target", price: 295.00, url: "#" },
    ],
  },
  {
    id: 2,
    name: "Nike Air Max 270 Running Shoes",
    image: "👟",
    category: "Clothing",
    prices: [
      { store: "Nike.com", price: 150.00, url: "#" },
      { store: "Amazon", price: 139.95, url: "#" },
      { store: "Foot Locker", price: 149.99, url: "#" },
      { store: "eBay", price: 125.00, url: "#" },
    ],
  },
  {
    id: 3,
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    image: "🍲",
    category: "Home & Garden",
    prices: [
      { store: "Amazon", price: 79.95, url: "#" },
      { store: "Walmart", price: 84.00, url: "#" },
      { store: "Target", price: 89.99, url: "#" },
      { store: "Costco", price: 74.99, url: "#" },
    ],
  },
  {
    id: 4,
    name: "Apple AirPods Pro (2nd Generation)",
    image: "🎵",
    category: "Electronics",
    prices: [
      { store: "Apple Store", price: 249.00, url: "#" },
      { store: "Amazon", price: 234.99, url: "#" },
      { store: "Best Buy", price: 249.99, url: "#" },
      { store: "Walmart", price: 239.00, url: "#" },
    ],
  },
  {
    id: 5,
    name: "Lego Star Wars Millennium Falcon",
    image: "🚀",
    category: "Toys",
    prices: [
      { store: "Lego.com", price: 849.99, url: "#" },
      { store: "Amazon", price: 799.99, url: "#" },
      { store: "Target", price: 849.99, url: "#" },
      { store: "eBay", price: 720.00, url: "#" },
    ],
  },
  {
    id: 6,
    name: "Dyson V15 Detect Cordless Vacuum",
    image: "🌀",
    category: "Home & Garden",
    prices: [
      { store: "Dyson", price: 699.99, url: "#" },
      { store: "Best Buy", price: 649.99, url: "#" },
      { store: "Amazon", price: 629.95, url: "#" },
      { store: "Costco", price: 599.99, url: "#" },
    ],
  },
];

function getBestPrice(prices: { store: string; price: number; url: string }[]) {
  return prices.reduce((min, p) => (p.price < min.price ? p : min), prices[0]);
}

export default function Home() {
  const [showAd, setShowAd] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      {showAd && <MembershipWelcomeAd onClose={() => setShowAd(false)} />}

      {/* ── ANNOUNCEMENT BAR ── urgency + first-order offer */}
      <div style={{
        backgroundColor: "#c8102e",
        color: "#fff",
        textAlign: "center",
        padding: "8px 16px",
        fontSize: "0.88rem",
        fontWeight: 600,
        letterSpacing: "0.01em",
      }}>
        🔥 <strong>Limited-time offer:</strong> Join Free today &amp; get&nbsp;
        <span style={{ color: "#ffd700" }}>50% OFF your first order of $50+</span>
        &nbsp;·&nbsp;
        <button
          onClick={() => setShowAd(true)}
          style={{
            background: "#ffd700", color: "#c8102e", border: "none",
            borderRadius: 4, padding: "2px 10px", fontWeight: 800,
            cursor: "pointer", fontSize: "0.85rem",
          }}
        >Claim Now</button>
      </div>

      {/* ── HEADER / NAVBAR ── */}
      <header style={{
        backgroundColor: "#003580",
        color: "#fff",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 24,
          height: 64,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: 28 }}>🌐</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.1 }}>
                International
              </div>
              <div style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.1, color: "#ffd700" }}>
                Shoppers Club
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ flex: 1, display: "flex", gap: 0, maxWidth: 640 }}>
            <input
              type="text"
              placeholder="Search for products, brands, or stores…"
              style={{
                flex: 1,
                padding: "10px 16px",
                fontSize: "0.95rem",
                border: "none",
                borderRadius: "4px 0 0 4px",
                outline: "none",
                color: "#1a1a1a",
              }}
            />
            <button style={{
              backgroundColor: "#ffd700",
              color: "#003580",
              border: "none",
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: "0.95rem",
              borderRadius: "0 4px 4px 0",
              cursor: "pointer",
            }}>
              Search
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: 20, marginLeft: "auto", flexShrink: 0 }}>
            <a href="#" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
              Sign In
            </a>
            <a href="#" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
              Deals
            </a>
            {/* Membership CTA */}
            <button
              onClick={() => setShowAd(true)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#ffd700",
                color: "#003580",
                border: "none",
                padding: "6px 16px",
                borderRadius: 6,
                whiteSpace: "nowrap",
                lineHeight: 1.2,
                cursor: "pointer",
              }}
            >
              <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>Join Free 🎁</span>
              <span style={{ fontWeight: 500, fontSize: "0.72rem", opacity: 0.85 }}>
                50% off your 1st $50+ order
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* ── CATEGORY NAVIGATION ── */}
      <nav style={{
        backgroundColor: "#0052a5",
        color: "#fff",
        overflowX: "auto",
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          padding: "0 24px",
        }}>
          {categories.map((cat) => (
            <a key={cat} href="#" style={{
              color: "#fff",
              textDecoration: "none",
              padding: "10px 16px",
              fontSize: "0.88rem",
              fontWeight: cat === "All" ? 700 : 400,
              whiteSpace: "nowrap",
              borderBottom: cat === "All" ? "3px solid #ffd700" : "3px solid transparent",
              transition: "border-color 0.2s",
            }}>
              {cat}
            </a>
          ))}
        </div>
      </nav>

      {/* ── SOCIAL PROOF STRIP ── */}
      <div style={{
        background: "#f0f4ff",
        borderBottom: "1px solid #dce6ff",
        padding: "10px 24px",
        display: "flex",
        justifyContent: "center",
        gap: 40,
        flexWrap: "wrap",
        fontSize: "0.85rem",
        color: "#003580",
        fontWeight: 600,
      }}>
        {[
          { icon: "👥", text: "2.4M+ Members worldwide" },
          { icon: "💰", text: "Avg. $312 saved per year" },
          { icon: "⭐", text: "4.9 / 5 member rating" },
          { icon: "🏪", text: "500+ partner stores" },
        ].map(({ icon, text }) => (
          <span key={text} style={{ whiteSpace: "nowrap" }}>{icon} {text}</span>
        ))}
      </div>

      {/* ── HERO MEMBERSHIP BANNER ── */}
      <div style={{
        background: "linear-gradient(135deg,#003580 0%,#0052a5 50%,#c8102e 100%)",
        color: "#fff",
        padding: "28px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ margin: "0 0 4px", fontSize: "0.8rem", fontWeight: 600, color: "#ffd700", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            🌐 International Shoppers Club — Exclusive Offer
          </p>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.25 }}>
            Join Free &amp; Save <span style={{ color: "#ffd700" }}>50% on Your First Order</span>
          </h2>
          <p style={{ margin: "0 0 18px", fontSize: "0.95rem", color: "#cde", lineHeight: 1.5 }}>
            Spend $50 or more on your first order this month and we&apos;ll cut the bill in half — automatically.
            No promo code needed. Cancel anytime.
          </p>
          {/* Benefit chips */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 20 }}>
            {[
              "🎁 50% off first $50+ order",
              "🔓 No credit card to join",
              "📦 500+ stores, 1 membership",
              "⚡ Instant flash-deal access",
              "🚫 Cancel anytime, no fees",
            ].map((chip) => (
              <span key={chip} style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: 20,
                padding: "5px 14px",
                fontSize: "0.82rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}>{chip}</span>
            ))}
          </div>
          <button
            onClick={() => setShowAd(true)}
            style={{
              background: "#ffd700",
              color: "#003580",
              border: "none",
              borderRadius: 8,
              padding: "14px 36px",
              fontWeight: 800,
              fontSize: "1.05rem",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
            }}
          >
            Join Free — Claim 50% Off Now 🎉
          </button>
          <p style={{ margin: "10px 0 0", fontSize: "0.75rem", color: "#aac" }}>
            Offer valid for new members · First month only · $50 minimum order
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "24px" }}>

        {/* Page heading */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 4 }}>
            Compare Prices Across Top Stores
          </h1>
          <p style={{ color: "#555", fontSize: "0.95rem" }}>
            Showing {products.length} products · Find the best deal in seconds
          </p>
        </div>

        {/* Product grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 20,
        }}>
          {products.map((product) => {
            const best = getBestPrice(product.prices);
            return (
              <div key={product.id} style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}>
                {/* Product image area */}
                <div style={{
                  backgroundColor: "#f0f4ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 120,
                  fontSize: 64,
                }}>
                  {product.image}
                </div>

                {/* Product info */}
                <div style={{ padding: "16px 16px 0" }}>
                  <span style={{
                    backgroundColor: "#e8f0fe",
                    color: "#003580",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}>
                    {product.category}
                  </span>
                  <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: "8px 0 4px", lineHeight: 1.3 }}>
                    {product.name}
                  </h2>
                  <p style={{ color: "#1a7a1a", fontWeight: 700, fontSize: "0.9rem" }}>
                    Best price: ${best.price.toFixed(2)} at {best.store}
                  </p>
                </div>

                {/* Price comparison table */}
                <div style={{ padding: "12px 16px 16px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                        <th style={{ textAlign: "left", padding: "4px 0", color: "#555" }}>Store</th>
                        <th style={{ textAlign: "right", padding: "4px 0", color: "#555" }}>Price</th>
                        <th style={{ textAlign: "right", padding: "4px 0", color: "#555" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.prices
                        .slice()
                        .sort((a, b) => a.price - b.price)
                        .map((p, i) => (
                          <tr key={p.store} style={{
                            borderBottom: "1px solid #f0f0f0",
                            backgroundColor: i === 0 ? "#f0fff0" : "transparent",
                          }}>
                            <td style={{ padding: "6px 0", fontWeight: i === 0 ? 700 : 400 }}>
                              {i === 0 && <span style={{ marginRight: 4 }}>🏆</span>}
                              {p.store}
                            </td>
                            <td style={{
                              textAlign: "right",
                              fontWeight: i === 0 ? 700 : 400,
                              color: i === 0 ? "#1a7a1a" : "#1a1a1a",
                            }}>
                              ${p.price.toFixed(2)}
                            </td>
                            <td style={{ textAlign: "right", paddingLeft: 8 }}>
                              <a href={p.url} style={{
                                backgroundColor: i === 0 ? "#003580" : "#f0f4ff",
                                color: i === 0 ? "#fff" : "#003580",
                                textDecoration: "none",
                                padding: "3px 10px",
                                borderRadius: 4,
                                fontSize: "0.8rem",
                                fontWeight: 600,
                              }}>
                                Buy
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        backgroundColor: "#1a1a2e",
        color: "#ccc",
        padding: "40px 24px 20px",
        marginTop: 40,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 32,
          marginBottom: 32,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🌐</span>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>
                International Shoppers Club
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
              Compare prices from hundreds of international and local stores to find the best deals instantly.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 style={{ color: "#fff", fontWeight: 700, marginBottom: 12, fontSize: "0.95rem" }}>Shop</h3>
            {["Electronics", "Clothing", "Home & Garden", "Sports", "Toys", "Beauty"].map((c) => (
              <a key={c} href="#" style={{ display: "block", color: "#aaa", textDecoration: "none", fontSize: "0.85rem", marginBottom: 6 }}>
                {c}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <h3 style={{ color: "#fff", fontWeight: 700, marginBottom: 12, fontSize: "0.95rem" }}>Company</h3>
            {["About Us", "Careers", "Press", "Blog", "Partners"].map((l) => (
              <a key={l} href="#" style={{ display: "block", color: "#aaa", textDecoration: "none", fontSize: "0.85rem", marginBottom: 6 }}>
                {l}
              </a>
            ))}
          </div>

          {/* Support */}
          <div>
            <h3 style={{ color: "#fff", fontWeight: 700, marginBottom: 12, fontSize: "0.95rem" }}>Support</h3>
            {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "Cookie Settings"].map((l) => (
              <a key={l} href="#" style={{ display: "block", color: "#aaa", textDecoration: "none", fontSize: "0.85rem", marginBottom: 6 }}>
                {l}
              </a>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: "1px solid #333",
          paddingTop: 20,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          fontSize: "0.82rem",
          color: "#888",
        }}>
          <span>© 2026 International Shoppers Club. All rights reserved.</span>
          <div style={{ display: "flex", gap: 16 }}>
            {["🇺🇸 USD", "🌍 Global", "English"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
