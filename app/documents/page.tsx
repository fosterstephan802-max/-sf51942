"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const DEFAULT_AGREEMENT = `MEMBERSHIP AGREEMENT
International Shoppers Club

This Membership Agreement ("Agreement") is entered into as of [JOIN_DATE] by and between International Shoppers Club ("ISC", "we", "us") and [MEMBER_NAME] ("Member", "you").

1. MEMBERSHIP BENEFITS
   As a member of the International Shoppers Club, you are entitled to:
   - Exclusive discounts at 500+ partner stores
   - Access to member-only flash deals and promotions
   - Free worldwide price alerts
   - Priority customer support

2. MEMBERSHIP PLANS
   ISC offers Free and VIP membership tiers. VIP members receive enhanced benefits
   including up to 40% off at participating stores. Pricing is as published on the
   ISC website and subject to change with 30 days' notice.

3. PAYMENT & BILLING
   VIP memberships are billed on a monthly basis. You authorise ISC to charge your
   nominated payment method each billing cycle. You may cancel at any time; no
   refunds are issued for partial months.

4. ACCEPTABLE USE
   You agree to use ISC services for personal, non-commercial purposes only. You
   must not share your membership credentials or circumvent any access controls.

5. TERMINATION
   Either party may terminate this Agreement at any time. ISC reserves the right
   to suspend or terminate memberships that violate these terms without refund.

6. LIMITATION OF LIABILITY
   To the fullest extent permitted by law, ISC's liability is limited to the amount
   paid by the Member in the three months preceding the claim.

7. GOVERNING LAW
   This Agreement is governed by the laws of the State of Delaware, USA.`;

type Signature = {
  name: string;
  timestamp: string;
};

const LS_SIG      = "isc_member_sig";
const LS_TEMPLATE = "isc_contract_template";

function loadSig(): Signature | null {
  try { const r = localStorage.getItem(LS_SIG); if (r) return JSON.parse(r) as Signature; } catch { /* ignore */ }
  return null;
}
function saveSig(s: Signature) { localStorage.setItem(LS_SIG, JSON.stringify(s)); }

function loadAgreementText(): string {
  try { const r = localStorage.getItem(LS_TEMPLATE); if (r) return r; } catch { /* ignore */ }
  return DEFAULT_AGREEMENT;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function printDoc(title: string, body: string) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(
    `<html><head><title>${escapeHtml(title)}</title><style>body{font-family:Georgia,serif;font-size:13px;line-height:1.7;padding:48px 64px;max-width:760px;margin:auto;color:#111}pre{white-space:pre-wrap;font-family:inherit}@media print{body{padding:20px}}</style></head>` +
    `<body><pre>${escapeHtml(body)}</pre><script>window.onload=()=>{window.print();}<\/script></body></html>`
  );
  win.document.close();
}

export default function MemberDocumentsPage() {
  const [agreementText, setAgreementText] = useState(DEFAULT_AGREEMENT);
  const [sig, setSig]           = useState<Signature | null>(null);
  const [memberName, setMemberName] = useState("");
  const [agreed, setAgreed]     = useState(false);
  const [signing, setSigning]   = useState(false);
  const [loaded, setLoaded]     = useState(false);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    setAgreementText(loadAgreementText());
    setSig(loadSig());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const today = new Date().toISOString().slice(0, 10);

  const stampedText = agreementText
    .replace(/\[MEMBER_NAME\]/g, memberName || "Member")
    .replace(/\[JOIN_DATE\]/g, today);

  function handleSign() {
    if (!memberName.trim()) { setNameError(true); return; }
    if (!agreed) return;
    const newSig: Signature = { name: memberName.trim(), timestamp: new Date().toISOString() };
    saveSig(newSig);
    setSig(newSig);
    setSigning(false);
    setAgreed(false);
  }

  function handleRevoke() {
    if (!confirm("Are you sure you want to revoke your signature?")) return;
    localStorage.removeItem(LS_SIG);
    setSig(null);
    setMemberName("");
  }

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>
      {/* ── Header ── */}
      <header style={{ background: "#003580", color: "#fff", padding: "16px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/" style={{ color: "#ffd700", fontWeight: 800, fontSize: "1rem", textDecoration: "none" }}>🌐 ISC</Link>
        <span style={{ color: "rgba(255,255,255,0.4)" }}>›</span>
        <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>Member Documents</span>
      </header>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "36px 20px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#003580", marginBottom: 6 }}>
          📄 Member Documents
        </h1>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: 28 }}>
          Review and sign your International Shoppers Club Membership Agreement.
        </p>

        {/* ── Signature status ── */}
        {sig ? (
          <div style={{ background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 12, padding: "18px 22px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: "#2e7d32", fontSize: "1rem" }}>✅ Agreement Signed</div>
              <div style={{ fontSize: "0.82rem", color: "#555", marginTop: 4 }}>
                Signed by <strong>{sig.name}</strong> on {new Date(sig.timestamp).toLocaleString()}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => printDoc("Membership Agreement", agreementText.replace(/\[MEMBER_NAME\]/g, sig.name).replace(/\[JOIN_DATE\]/g, new Date(sig.timestamp).toISOString().slice(0, 10)))}
                style={{ padding: "8px 16px", background: "#fff", color: "#2e7d32", border: "1px solid #a5d6a7", borderRadius: 7, fontWeight: 600, fontSize: "0.84rem", cursor: "pointer" }}
              >
                🖨️ Print / Save PDF
              </button>
              <button
                onClick={handleRevoke}
                style={{ padding: "8px 16px", background: "#fff", color: "#c62828", border: "1px solid #ef9a9a", borderRadius: 7, fontWeight: 600, fontSize: "0.84rem", cursor: "pointer" }}
              >
                Revoke Signature
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff3e0", border: "1px solid #ffcc80", borderRadius: 12, padding: "16px 22px", marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: "#e65100" }}>⏳ Signature Required</div>
            <div style={{ fontSize: "0.82rem", color: "#555", marginTop: 4 }}>
              Please read the Membership Agreement below and sign to activate all member benefits.
            </div>
          </div>
        )}

        {/* ── Agreement text ── */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: 24 }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, color: "#003580", fontSize: "1rem" }}>Membership Agreement</div>
              <div style={{ fontSize: "0.76rem", color: "#aaa", marginTop: 2 }}>Version 2.0 · Effective January 1, 2026</div>
            </div>
            <button
              onClick={() => printDoc("Membership Agreement", stampedText)}
              style={{ padding: "7px 14px", background: "#f0f2f5", color: "#555", border: "1px solid #ddd", borderRadius: 7, fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}
            >
              🖨️ Print
            </button>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <pre style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.75, whiteSpace: "pre-wrap", color: "#333", fontFamily: "Georgia, serif" }}>
              {stampedText}
            </pre>
          </div>
        </div>

        {/* ── Sign section (only if not yet signed) ── */}
        {!sig && (
          <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", padding: "24px 28px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#003580", marginBottom: 18 }}>Sign this Agreement</h2>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 600, color: "#555", marginBottom: 6 }}>
                Your Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full legal name"
                value={memberName}
                onChange={e => { setMemberName(e.target.value); setNameError(false); }}
                style={{
                  width: "100%", maxWidth: 380, padding: "10px 12px",
                  fontSize: "0.9rem", border: nameError ? "1.5px solid #c62828" : "1px solid #ddd",
                  borderRadius: 8, outline: "none", boxSizing: "border-box",
                }}
              />
              {nameError && <div style={{ color: "#c62828", fontSize: "0.78rem", marginTop: 4 }}>Please enter your full name to sign.</div>}
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginBottom: 20 }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: 2, width: 16, height: 16, cursor: "pointer", accentColor: "#003580" }}
              />
              <span style={{ fontSize: "0.86rem", color: "#444", lineHeight: 1.5 }}>
                I have read and understood the Membership Agreement, and I agree to be bound by its terms and conditions.
              </span>
            </label>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                onClick={handleSign}
                disabled={!agreed}
                style={{
                  padding: "12px 28px",
                  background: agreed ? "#003580" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: agreed ? "pointer" : "not-allowed",
                  transition: "background 0.2s",
                }}
              >
                ✍️ Sign Agreement
              </button>
              <span style={{ fontSize: "0.76rem", color: "#aaa" }}>
                Signing date will be recorded as {today}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
