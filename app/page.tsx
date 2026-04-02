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
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

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
            <a href="#" style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#ffd700",
              color: "#003580",
              textDecoration: "none",
              padding: "6px 16px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              lineHeight: 1.2,
            }}>
              <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>Join — $9.99/mo</span>
              <span style={{ fontWeight: 500, fontSize: "0.72rem", opacity: 0.8 }}>
                Members save up to 40%
              </span>
            </a>
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
