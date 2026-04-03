"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PIN = "1234";

export default function AdminLoginPage() {
  const router  = useRouter();
  const [pin, setPin]       = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Already authed? go straight in
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("isc_admin_auth") === "1") {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (pin === ADMIN_PIN) {
        localStorage.setItem("isc_admin_auth", "1");
        router.push("/admin/dashboard");
      } else {
        setError("Incorrect PIN. Try again.");
        setPin("");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#003580 0%,#0052a5 50%,#1a1a2e 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, Helvetica, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: "44px 48px 40px",
        width: "100%",
        maxWidth: 380,
        boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🌐</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#003580", margin: "0 0 4px" }}>
          ISC Admin
        </h1>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: 28 }}>
          International Shoppers Club — Back Office
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input
            type="password"
            inputMode="numeric"
            placeholder="Enter admin PIN"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(""); }}
            autoFocus
            style={{
              padding: "12px 16px",
              fontSize: "1rem",
              border: error ? "2px solid #c8102e" : "2px solid #dde",
              borderRadius: 8,
              outline: "none",
              textAlign: "center",
              letterSpacing: "0.3em",
            }}
          />

          {error && (
            <p style={{ color: "#c8102e", fontSize: "0.85rem", margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || pin.length === 0}
            style={{
              padding: "12px",
              background: loading || pin.length === 0 ? "#aaa" : "#003580",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: "1rem",
              fontWeight: 700,
              cursor: loading || pin.length === 0 ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Verifying…" : "Sign In →"}
          </button>
        </form>

        <p style={{ color: "#bbb", fontSize: "0.75rem", marginTop: 20 }}>
          Default PIN: <code style={{ color: "#003580" }}>1234</code>
        </p>
      </div>
    </div>
  );
}
