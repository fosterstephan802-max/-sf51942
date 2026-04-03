"use client";
import { useState, useEffect } from "react";

/* ── Campaign / revenue data (mirrors Analytics page) ───────── */
const CAMPAIGN_STATS = [
  { month: "January",   signups: 312, revenue: 1890 },
  { month: "February",  signups: 278, revenue: 1640 },
  { month: "March",     signups: 294, revenue: 1720 },
  { month: "April",     signups: 330, revenue: 2010 },
  { month: "May",       signups: 356, revenue: 2210 },
  { month: "June",      signups: 298, revenue: 1780 },
  { month: "July",      signups: 412, revenue: 2580 },
  { month: "August",    signups: 387, revenue: 2330 },
  { month: "September", signups: 261, revenue: 1540 },
  { month: "October",   signups: 445, revenue: 2780 },
  { month: "November",  signups: 502, revenue: 3120 },
  { month: "December",  signups: 388, revenue: 2350 },
];

/* ── Mock member data (mirrors Members page) ─────────────────── */
const FIRST_NAMES = ["Alice","Bob","Carol","David","Elena","Frank","Grace","Hiro","Isabel","James","Karen","Liam","Mia","Noah","Olivia","Paul","Quinn","Rosa","Sam","Tina","Uma","Victor","Wendy","Xavier","Yara","Zoe"];
const LAST_NAMES  = ["Smith","Jones","Williams","Brown","Taylor","Davies","Evans","Wilson","Thomas","Roberts","Johnson","Lewis","Walker","Robinson","White","Thompson","Harris","Martin","Garcia","Martinez"];
const CAMPAIGNS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function pick<T>(arr: T[], seed: number): T { return arr[Math.abs(seed) % arr.length]; }
function fakeDate(i: number): string {
  const d = new Date(2025, Math.floor(i / 8) % 12, (i % 28) + 1);
  return d.toISOString().slice(0, 10);
}

const MOCK_MEMBERS = Array.from({ length: 60 }, (_, i) => {
  const plan = (i % 5 === 0 ? "VIP" : "Free") as "VIP" | "Free";
  const name = `${pick(FIRST_NAMES, i * 7 + 3)} ${pick(LAST_NAMES, i * 13 + 1)}`;
  return {
    id: i + 1,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    joinDate: fakeDate(i),
    plan,
    referrals: i % 9 === 0 ? Math.floor(i / 9) : 0,
    revenue: plan === "VIP" ? parseFloat(((i % 12 + 1) * 9.99).toFixed(2)) : 0,
    campaign: pick(CAMPAIGNS, i * 3 + 2),
  };
});

/* ── Types ──────────────────────────────────────────────────── */
type PayoutStatus = "Pending" | "Paid" | "On Hold";

type PaymentSettings = {
  processor: "Stripe" | "PayPal";
  stripePublishableKey: string;
  paypalClientId: string;
  currency: string;
  commissionPerReferral: string;
};

/* ── localStorage keys ───────────────────────────────────────── */
const LS_PAYOUTS  = "isc_payout_statuses";
const LS_PAYMENT  = "isc_payment_settings";

const DEFAULT_PAYMENT: PaymentSettings = {
  processor: "Stripe",
  stripePublishableKey: "",
  paypalClientId: "",
  currency: "USD",
  commissionPerReferral: "3.00",
};

function loadPayouts(): Record<number, PayoutStatus> {
  try { const r = localStorage.getItem(LS_PAYOUTS); if (r) return JSON.parse(r); } catch { /* ignore */ }
  return {};
}
function savePayouts(p: Record<number, PayoutStatus>) { localStorage.setItem(LS_PAYOUTS, JSON.stringify(p)); }

function loadPayment(): PaymentSettings {
  try { const r = localStorage.getItem(LS_PAYMENT); if (r) return { ...DEFAULT_PAYMENT, ...(JSON.parse(r) as Partial<PaymentSettings>) }; } catch { /* ignore */ }
  return { ...DEFAULT_PAYMENT };
}
function savePayment(p: PaymentSettings) { localStorage.setItem(LS_PAYMENT, JSON.stringify(p)); }

/* ── CSV download helper ─────────────────────────────────────── */
function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ── Print helper ─────────────────────────────────────────────── */
function escHtml(str: string): string {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function printTable(title: string, headers: string[], rows: string[][]) {
  const win = window.open("", "_blank");
  if (!win) return;
  const thead = `<tr>${headers.map(h => `<th style="padding:8px 12px;text-align:left;background:#003580;color:#fff">${escHtml(h)}</th>`).join("")}</tr>`;
  const tbody = rows.map(r => `<tr>${r.map(c => `<td style="padding:7px 12px;border-bottom:1px solid #eee">${escHtml(c)}</td>`).join("")}</tr>`).join("");
  win.document.write(
    `<html><head><title>${escHtml(title)}</title><style>body{font-family:Arial,sans-serif;font-size:13px;padding:32px}table{width:100%;border-collapse:collapse}h1{font-size:18px;color:#003580;margin-bottom:20px}@media print{body{padding:12px}}</style></head>` +
    `<body><h1>${escHtml(title)}</h1><table><thead>${thead}</thead><tbody>${tbody}</tbody></table><script>window.onload=()=>{window.print();}<\/script></body></html>`
  );
  win.document.close();
}

/* ── Payout status badge ─────────────────────────────────────── */
function PayoutBadge({ status }: { status: PayoutStatus }) {
  const cfg: Record<PayoutStatus, { bg: string; color: string }> = {
    Pending:  { bg: "#fff3e0", color: "#e65100" },
    Paid:     { bg: "#e8f5e9", color: "#2e7d32" },
    "On Hold":{ bg: "#fce4ec", color: "#c62828" },
  };
  const c = cfg[status];
  return <span style={{ background: c.bg, color: c.color, padding: "3px 10px", borderRadius: 20, fontSize: "0.74rem", fontWeight: 700 }}>{status}</span>;
}

/* ── Tab button ───────────────────────────────────────────────── */
function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding: "10px 22px", border: "none",
      borderBottom: active ? "3px solid #003580" : "3px solid transparent",
      background: "none", fontWeight: active ? 700 : 500,
      color: active ? "#003580" : "#888", fontSize: "0.9rem", cursor: "pointer",
    }}>
      {children}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", fontSize: "0.86rem",
  border: "1px solid #ddd", borderRadius: 7, outline: "none", boxSizing: "border-box",
};

const btnPrimary: React.CSSProperties = {
  padding: "8px 16px", background: "#003580", color: "#fff",
  border: "none", borderRadius: 7, fontWeight: 700, fontSize: "0.84rem", cursor: "pointer",
};
const btnOutline: React.CSSProperties = {
  padding: "8px 16px", background: "#fff", color: "#555",
  border: "1px solid #ddd", borderRadius: 7, fontWeight: 600, fontSize: "0.84rem", cursor: "pointer",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#555", marginBottom: 5,
};

/* ── Component ────────────────────────────────────────────────── */
export default function BankingPage() {
  const [tab, setTab]               = useState<"revenue" | "payouts" | "invoices" | "settings">("revenue");
  const [payouts, setPayouts]       = useState<Record<number, PayoutStatus>>({});
  const [payment, setPayment]       = useState<PaymentSettings>(DEFAULT_PAYMENT);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [loaded, setLoaded]         = useState(false);

  useEffect(() => {
    setPayouts(loadPayouts());
    setPayment(loadPayment());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  /* ── Derived data ── */
  const COMMISSION = parseFloat(payment.commissionPerReferral) || 3;

  const referrers = MOCK_MEMBERS
    .filter(m => m.referrals > 0)
    .map(m => ({ ...m, commission: parseFloat((m.referrals * COMMISSION).toFixed(2)) }));

  function getPayoutStatus(id: number): PayoutStatus { return payouts[id] ?? "Pending"; }

  function updatePayout(id: number, status: PayoutStatus) {
    const next = { ...payouts, [id]: status };
    setPayouts(next);
    savePayouts(next);
  }

  function markAllPaid() {
    const next = { ...payouts };
    referrers.forEach(m => { next[m.id] = "Paid"; });
    setPayouts(next);
    savePayouts(next);
  }

  /* ── Revenue KPIs ── */
  const totalRevenue     = CAMPAIGN_STATS.reduce((s, c) => s + c.revenue, 0);
  const currentMonthIdx  = new Date().getMonth();
  const currentRevenue   = CAMPAIGN_STATS[currentMonthIdx].revenue;
  const vipMembers       = MOCK_MEMBERS.filter(m => m.plan === "VIP");
  const mrr              = vipMembers.length * 9.99;
  const arr              = mrr * 12;
  const totalPending     = referrers.filter(m => getPayoutStatus(m.id) === "Pending").reduce((s, m) => s + m.commission, 0);
  const totalPaid        = referrers.filter(m => getPayoutStatus(m.id) === "Paid").reduce((s, m) => s + m.commission, 0);

  /* ── VIP invoices ── */
  const invoiceMonth = CAMPAIGN_STATS[currentMonthIdx].month;
  const invoiceDate  = new Date().toISOString().slice(0, 10);
  const invoices     = vipMembers.map((m, i) => ({
    invoiceId: `INV-${new Date().getFullYear()}-${String(currentMonthIdx + 1).padStart(2, "0")}-${String(i + 1).padStart(3, "0")}`,
    member: m.name,
    email: m.email,
    amount: 9.99,
    billingDate: invoiceDate,
    period: invoiceMonth,
    status: "Issued",
  }));

  /* ── CSV exports ── */
  function exportPayoutsCSV() {
    const headers = ["ID","Name","Email","Referrals","Commission (USD)","Status"];
    const rows = referrers.map(m => [
      String(m.id), m.name, m.email,
      String(m.referrals),
      m.commission.toFixed(2),
      getPayoutStatus(m.id),
    ]);
    downloadCSV([headers, ...rows], "isc_payouts.csv");
  }

  function exportInvoicesCSV() {
    const headers = ["Invoice ID","Member","Email","Amount (USD)","Period","Billing Date","Status"];
    const rows = invoices.map(inv => [
      inv.invoiceId, inv.member, inv.email,
      inv.amount.toFixed(2), inv.period, inv.billingDate, inv.status,
    ]);
    downloadCSV([headers, ...rows], "isc_invoices.csv");
  }

  function saveSettings() {
    savePayment(payment);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  }

  function updatePayment<K extends keyof PaymentSettings>(key: K, value: PaymentSettings[K]) {
    setPayment(p => ({ ...p, [key]: value }));
  }

  return (
    <div style={{ maxWidth: 960 }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#003580", marginBottom: 4 }}>
        Banking &amp; Payments
      </h1>
      <p style={{ color: "#666", fontSize: "0.88rem", marginBottom: 20 }}>
        Revenue overview, referral payouts, member invoices, and payment processor configuration.
      </p>

      {/* ── Tabs ── */}
      <div style={{ borderBottom: "1px solid #e8e8e8", marginBottom: 24, display: "flex", gap: 0 }}>
        <Tab active={tab === "revenue"}  onClick={() => setTab("revenue")}>💰 Revenue</Tab>
        <Tab active={tab === "payouts"}  onClick={() => setTab("payouts")}>💸 Payouts</Tab>
        <Tab active={tab === "invoices"} onClick={() => setTab("invoices")}>🧾 Invoices</Tab>
        <Tab active={tab === "settings"} onClick={() => setTab("settings")}>⚙️ Payment Settings</Tab>
      </div>

      {/* ══════════════════════ REVENUE TAB ══════════════════════ */}
      {tab === "revenue" && (
        <div>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Total Revenue (YTD)",       value: `$${totalRevenue.toLocaleString()}`, icon: "💰", color: "#005a1e" },
              { label: `Revenue — ${invoiceMonth}`, value: `$${currentRevenue.toLocaleString()}`, icon: "📅", color: "#003580" },
              { label: "VIP Subscribers",           value: vipMembers.length.toString(),         icon: "🥇", color: "#8b5a00" },
              { label: "Monthly Recurring Revenue", value: `$${mrr.toFixed(2)}`,                 icon: "🔄", color: "#4b0082" },
              { label: "Annual Run Rate",           value: `$${arr.toFixed(0)}`,                 icon: "📈", color: "#00695c" },
              { label: "Pending Payouts",           value: `$${totalPending.toFixed(2)}`,        icon: "⏳", color: "#c66b00" },
            ].map(k => (
              <div key={k.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", borderTop: `4px solid ${k.color}` }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{k.icon}</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: "0.77rem", color: "#888", marginTop: 3 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Monthly revenue table */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "22px 26px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: 24 }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#003580", marginBottom: 16 }}>Monthly Revenue Breakdown</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "#f8f9fc" }}>
                  {["Month","New Signups","Revenue"].map(h => (
                    <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontWeight: 700, color: "#555", fontSize: "0.76rem", textTransform: "uppercase", borderBottom: "1px solid #eee" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAMPAIGN_STATS.map((c, i) => (
                  <tr key={c.month} style={{ borderBottom: "1px solid #f5f5f5", background: i === currentMonthIdx ? "#f0f4ff" : "transparent" }}>
                    <td style={{ padding: "9px 14px", fontWeight: i === currentMonthIdx ? 700 : 400, color: i === currentMonthIdx ? "#003580" : "#333" }}>
                      {c.month} {i === currentMonthIdx && <span style={{ fontSize: "0.72rem", background: "#003580", color: "#fff", borderRadius: 4, padding: "1px 6px", marginLeft: 6 }}>Current</span>}
                    </td>
                    <td style={{ padding: "9px 14px", color: "#555" }}>{c.signups.toLocaleString()}</td>
                    <td style={{ padding: "9px 14px", fontWeight: 600, color: "#2e7d32" }}>${c.revenue.toLocaleString()}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: "2px solid #eee", background: "#f8f9fc" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 800, color: "#003580" }}>Total</td>
                  <td style={{ padding: "10px 14px", fontWeight: 700 }}>{CAMPAIGN_STATS.reduce((s, c) => s + c.signups, 0).toLocaleString()}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 800, color: "#2e7d32" }}>${totalRevenue.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* External links */}
          <div style={{ display: "flex", gap: 14 }}>
            <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer" style={{ ...btnOutline, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              🔗 Stripe Dashboard ↗
            </a>
            <a href="https://www.paypal.com/businessmanage/summary" target="_blank" rel="noreferrer" style={{ ...btnOutline, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              🔗 PayPal Business ↗
            </a>
          </div>
        </div>
      )}

      {/* ══════════════════════ PAYOUTS TAB ══════════════════════ */}
      {tab === "payouts" && (
        <div>
          {/* Summary bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
            {[
              { label: "Total Pending",  value: `$${totalPending.toFixed(2)}`, color: "#e65100", bg: "#fff3e0" },
              { label: "Total Paid",     value: `$${totalPaid.toFixed(2)}`,    color: "#2e7d32", bg: "#e8f5e9" },
              { label: "Affiliates",     value: referrers.length.toString(),   color: "#003580", bg: "#e8f0fe" },
            ].map(k => (
              <div key={k.label} style={{ background: k.bg, borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 2 }}>{k.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 16, justifyContent: "flex-end" }}>
            <button onClick={markAllPaid} style={btnOutline}>✅ Mark All Paid</button>
            <button onClick={() => {
              const h = ["ID","Name","Email","Referrals","Commission","Status"];
              const r = referrers.map(m => [String(m.id), m.name, m.email, String(m.referrals), `$${m.commission.toFixed(2)}`, getPayoutStatus(m.id)]);
              printTable("Referral Payouts", h, r);
            }} style={btnOutline}>🖨️ Print</button>
            <button onClick={exportPayoutsCSV} style={btnPrimary}>📥 Export CSV</button>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
              <thead>
                <tr style={{ background: "#f8f9fc" }}>
                  {["Member","Email","Referrals",`Commission (${payment.currency})`, "Status","Action"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: "#555", fontSize: "0.76rem", textTransform: "uppercase", borderBottom: "1px solid #eee" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {referrers.map(m => (
                  <tr key={m.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                    <td style={{ padding: "9px 14px", fontWeight: 600 }}>{m.name}</td>
                    <td style={{ padding: "9px 14px", color: "#666" }}>{m.email}</td>
                    <td style={{ padding: "9px 14px" }}>{m.referrals}</td>
                    <td style={{ padding: "9px 14px", fontWeight: 700, color: "#2e7d32" }}>${m.commission.toFixed(2)}</td>
                    <td style={{ padding: "9px 14px" }}><PayoutBadge status={getPayoutStatus(m.id)} /></td>
                    <td style={{ padding: "9px 14px" }}>
                      <select
                        value={getPayoutStatus(m.id)}
                        onChange={e => updatePayout(m.id, e.target.value as PayoutStatus)}
                        style={{ padding: "4px 8px", fontSize: "0.78rem", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", outline: "none" }}
                      >
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>On Hold</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {referrers.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 28, textAlign: "center", color: "#bbb" }}>No referrers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.76rem", color: "#bbb", marginTop: 10 }}>
            Commission rate: ${COMMISSION.toFixed(2)} per referral · Adjust in Payment Settings.
          </p>
        </div>
      )}

      {/* ══════════════════════ INVOICES TAB ══════════════════════ */}
      {tab === "invoices" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <p style={{ color: "#888", fontSize: "0.84rem", margin: 0 }}>
                Auto-generated monthly invoices for all {vipMembers.length} VIP members · {invoiceMonth} {new Date().getFullYear()}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => {
                const h = ["Invoice ID","Member","Email","Amount","Period","Billing Date","Status"];
                const r = invoices.map(inv => [inv.invoiceId, inv.member, inv.email, `$${inv.amount.toFixed(2)}`, inv.period, inv.billingDate, inv.status]);
                printTable("VIP Invoices", h, r);
              }} style={btnOutline}>🖨️ Print All</button>
              <button onClick={exportInvoicesCSV} style={btnPrimary}>📥 Export CSV</button>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
              <thead>
                <tr style={{ background: "#f8f9fc" }}>
                  {["Invoice ID","Member","Email","Amount","Period","Billing Date","Status"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: "#555", fontSize: "0.76rem", textTransform: "uppercase", borderBottom: "1px solid #eee" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 30).map(inv => (
                  <tr key={inv.invoiceId} style={{ borderBottom: "1px solid #f2f2f2" }}>
                    <td style={{ padding: "9px 14px", color: "#666", fontFamily: "monospace", fontSize: "0.8rem" }}>{inv.invoiceId}</td>
                    <td style={{ padding: "9px 14px", fontWeight: 600 }}>{inv.member}</td>
                    <td style={{ padding: "9px 14px", color: "#666" }}>{inv.email}</td>
                    <td style={{ padding: "9px 14px", fontWeight: 700, color: "#2e7d32" }}>${inv.amount.toFixed(2)}</td>
                    <td style={{ padding: "9px 14px", color: "#555" }}>{inv.period}</td>
                    <td style={{ padding: "9px 14px", color: "#888" }}>{inv.billingDate}</td>
                    <td style={{ padding: "9px 14px" }}>
                      <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px", borderRadius: 20, fontSize: "0.74rem", fontWeight: 700 }}>Issued</span>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 28, textAlign: "center", color: "#bbb" }}>No VIP members found.</td></tr>
                )}
              </tbody>
            </table>
            {invoices.length > 30 && (
              <div style={{ padding: "10px 14px", fontSize: "0.78rem", color: "#aaa", borderTop: "1px solid #f0f0f0" }}>
                Showing first 30 of {invoices.length} invoices. Use Export CSV to get the full list.
              </div>
            )}
          </div>
          <p style={{ fontSize: "0.76rem", color: "#bbb", marginTop: 10 }}>
            Total invoice value this month: <strong>${(invoices.length * 9.99).toFixed(2)}</strong>
          </p>
        </div>
      )}

      {/* ══════════════════════ SETTINGS TAB ══════════════════════ */}
      {tab === "settings" && (
        <div style={{ maxWidth: 640 }}>
          <p style={{ color: "#888", fontSize: "0.84rem", marginBottom: 20 }}>
            Configure your payment processor integration. Keys are stored locally — move to environment variables before going live.
          </p>

          {/* Processor toggle */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "22px 26px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: 20 }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#003580", marginBottom: 16 }}>Active Processor</h2>
            <div style={{ display: "flex", gap: 12 }}>
              {(["Stripe","PayPal"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => updatePayment("processor", p)}
                  style={{
                    flex: 1, padding: "16px", borderRadius: 10,
                    border: payment.processor === p ? "2px solid #003580" : "2px solid #e0e0e0",
                    background: payment.processor === p ? "#f0f4ff" : "#fff",
                    cursor: "pointer", fontWeight: 700,
                    color: payment.processor === p ? "#003580" : "#888",
                    fontSize: "1rem",
                  }}
                >
                  {p === "Stripe" ? "💳 Stripe" : "🅿️ PayPal"}
                  {payment.processor === p && <div style={{ fontSize: "0.72rem", color: "#003580", marginTop: 4 }}>Active</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Stripe settings */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "22px 26px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: 20, opacity: payment.processor === "Stripe" ? 1 : 0.5 }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#003580", marginBottom: 16 }}>💳 Stripe Configuration</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Publishable Key</label>
                <input
                  type="text"
                  placeholder="pk_live_…"
                  value={payment.stripePublishableKey}
                  onChange={e => updatePayment("stripePublishableKey", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* PayPal settings */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "22px 26px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: 20, opacity: payment.processor === "PayPal" ? 1 : 0.5 }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#003580", marginBottom: 16 }}>🅿️ PayPal Configuration</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Client ID</label>
                <input
                  type="text"
                  placeholder="AcB1…"
                  value={payment.paypalClientId}
                  onChange={e => updatePayment("paypalClientId", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* General */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "22px 26px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: 20 }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#003580", marginBottom: 16 }}>General</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Currency</label>
                <select
                  value={payment.currency}
                  onChange={e => updatePayment("currency", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {["USD","EUR","GBP","CAD","AUD"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Commission per Referral ($)</label>
                <input
                  type="number" min="0" step="0.01"
                  value={payment.commissionPerReferral}
                  onChange={e => updatePayment("commissionPerReferral", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <p style={{ fontSize: "0.76rem", color: "#f0a030", marginBottom: 16 }}>
            ⚠️ API keys are stored in browser localStorage. For production, use server-side environment variables.
          </p>

          <button onClick={saveSettings} style={{ ...btnPrimary, padding: "12px 32px", fontSize: "0.95rem" }}>
            {settingsSaved ? "✅ Settings Saved!" : "Save Payment Settings"}
          </button>
        </div>
      )}
    </div>
  );
}
