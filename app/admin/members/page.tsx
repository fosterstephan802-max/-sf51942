"use client";
import { useState, useMemo } from "react";

/* ── Mock member data ─────────────────────────────────────────── */
type Member = {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  plan: "Free" | "VIP";
  status: "Active" | "Cancelled";
  revenue: number;
  campaign: string;
  referrals: number;
  orders: { date: string; store: string; amount: number }[];
};

const CAMPAIGNS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const STORES = ["Amazon","eBay","Walmart","Target","Best Buy","Costco","Nike","Adidas","ASOS","H&M"];
const FIRST_NAMES = ["Alice","Bob","Carol","David","Elena","Frank","Grace","Hiro","Isabel","James","Karen","Liam","Mia","Noah","Olivia","Paul","Quinn","Rosa","Sam","Tina","Uma","Victor","Wendy","Xavier","Yara","Zoe"];
const LAST_NAMES  = ["Smith","Jones","Williams","Brown","Taylor","Davies","Evans","Wilson","Thomas","Roberts","Johnson","Lewis","Walker","Robinson","White","Thompson","Harris","Martin","Garcia","Martinez"];

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function fakeDate(i: number): string {
  const d = new Date(2025, Math.floor(i / 8) % 12, (i % 28) + 1);
  return d.toISOString().slice(0, 10);
}

const MOCK_MEMBERS: Member[] = Array.from({ length: 60 }, (_, i) => {
  const plan: "Free" | "VIP"       = i % 5 === 0 ? "VIP" : "Free";
  const status: "Active" | "Cancelled" = i % 7 === 6 ? "Cancelled" : "Active";
  const rev = plan === "VIP" ? (i % 12 + 1) * 9.99 : 0;
  const name = `${pick(FIRST_NAMES, i * 7 + 3)} ${pick(LAST_NAMES, i * 13 + 1)}`;
  return {
    id: i + 1,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    joinDate: fakeDate(i),
    plan,
    status,
    revenue: parseFloat(rev.toFixed(2)),
    campaign: pick(CAMPAIGNS, i * 3 + 2),
    referrals: i % 9 === 0 ? Math.floor(i / 9) : 0,
    orders: Array.from({ length: (i % 4) + 1 }, (_, j) => ({
      date: fakeDate(i + j * 2 + 1),
      store: pick(STORES, i + j * 5),
      amount: parseFloat(((j + 1) * 17.49 + i * 0.99).toFixed(2)),
    })),
  };
});

/* ── Helpers ──────────────────────────────────────────────────── */
function statusBadge(s: Member["status"]) {
  const active = s === "Active";
  return (
    <span style={{
      background: active ? "#e8f5e9" : "#fce4ec",
      color: active ? "#2e7d32" : "#c62828",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: "0.74rem",
      fontWeight: 700,
    }}>
      {active ? "● Active" : "✕ Cancelled"}
    </span>
  );
}

function planBadge(p: Member["plan"]) {
  return (
    <span style={{
      background: p === "VIP" ? "#fff3e0" : "#f5f5f5",
      color:      p === "VIP" ? "#e65100" : "#888",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: "0.74rem",
      fontWeight: 700,
    }}>
      {p === "VIP" ? "🥇 VIP" : "Free"}
    </span>
  );
}

/* ── Component ───────────────────────────────────────────────── */
export default function MembersPage() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState<"All" | "Active" | "Cancelled">("All");
  const [planFilter, setPlan]       = useState<"All" | "Free" | "VIP">("All");
  const [campaignFilter, setCampaign] = useState("All");
  const [selected, setSelected]     = useState<Member | null>(null);
  const [page, setPage]             = useState(1);
  const PER_PAGE = 12;

  const filtered = useMemo(() => MOCK_MEMBERS.filter(m => {
    const q = search.toLowerCase();
    if (q && !m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
    if (statusFilter !== "All" && m.status !== statusFilter) return false;
    if (planFilter   !== "All" && m.plan   !== planFilter)   return false;
    if (campaignFilter !== "All" && m.campaign !== campaignFilter) return false;
    return true;
  }), [search, statusFilter, planFilter, campaignFilter]);

  const pages    = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function changeFilter() { setPage(1); }

  return (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>

      {/* ── Table section ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#003580", marginBottom: 6 }}>
          Members
        </h1>
        <p style={{ color: "#666", fontSize: "0.88rem", marginBottom: 18 }}>
          {filtered.length} member{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* ── Filter bar ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            type="search"
            placeholder="Search name or email…"
            value={search}
            onChange={e => { setSearch(e.target.value); changeFilter(); }}
            style={{ flex: "1 1 200px", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 7, fontSize: "0.85rem", outline: "none" }}
          />
          {(["All","Active","Cancelled"] as const).map(s => (
            <button key={s} onClick={() => { setStatus(s); changeFilter(); }} style={{
              padding: "8px 14px", borderRadius: 7, border: "1px solid #ddd",
              background: statusFilter === s ? "#003580" : "#fff",
              color: statusFilter === s ? "#fff" : "#555",
              fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
            }}>{s}</button>
          ))}
          {(["All","Free","VIP"] as const).map(p => (
            <button key={p} onClick={() => { setPlan(p); changeFilter(); }} style={{
              padding: "8px 14px", borderRadius: 7, border: "1px solid #ddd",
              background: planFilter === p ? "#8b5a00" : "#fff",
              color: planFilter === p ? "#fff" : "#555",
              fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
            }}>{p}</button>
          ))}
          <select
            value={campaignFilter}
            onChange={e => { setCampaign(e.target.value); changeFilter(); }}
            style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 7, fontSize: "0.82rem", background: "#fff", cursor: "pointer" }}
          >
            <option value="All">All campaigns</option>
            {CAMPAIGNS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* ── Table ── */}
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                {["Name","Email","Joined","Plan","Status","Revenue","Campaign"].map(h => (
                  <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: "#555", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #eee" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map(m => (
                <tr
                  key={m.id}
                  onClick={() => setSelected(selected?.id === m.id ? null : m)}
                  style={{
                    cursor: "pointer",
                    background: selected?.id === m.id ? "#f0f4ff" : "transparent",
                    borderBottom: "1px solid #f2f2f2",
                    transition: "background 0.12s",
                  }}
                >
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: "10px 14px", color: "#666" }}>{m.email}</td>
                  <td style={{ padding: "10px 14px", color: "#888" }}>{m.joinDate}</td>
                  <td style={{ padding: "10px 14px" }}>{planBadge(m.plan)}</td>
                  <td style={{ padding: "10px 14px" }}>{statusBadge(m.status)}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: m.revenue > 0 ? "#2e7d32" : "#aaa" }}>
                    {m.revenue > 0 ? `$${m.revenue.toFixed(2)}` : "—"}
                  </td>
                  <td style={{ padding: "10px 14px", color: "#666" }}>{m.campaign}</td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "28px", textAlign: "center", color: "#bbb" }}>
                    No members match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div style={{ display: "flex", gap: 6, marginTop: 14, justifyContent: "center" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtnStyle}>← Prev</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} style={{ ...pageBtnStyle, background: n === page ? "#003580" : "#fff", color: n === page ? "#fff" : "#555" }}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={pageBtnStyle}>Next →</button>
          </div>
        )}
      </div>

      {/* ── Member detail panel ── */}
      {selected && (
        <div style={{
          width: 300,
          flexShrink: 0,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
          padding: "22px 24px",
          position: "sticky",
          top: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#003580" }}>{selected.name}</div>
              <div style={{ fontSize: "0.8rem", color: "#888", marginTop: 2 }}>{selected.email}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#bbb" }}>✕</button>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {planBadge(selected.plan)}
            {statusBadge(selected.status)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
            {[
              { label: "Joined",    value: selected.joinDate },
              { label: "Campaign",  value: selected.campaign },
              { label: "Revenue",   value: selected.revenue > 0 ? `$${selected.revenue.toFixed(2)}` : "—" },
              { label: "Referrals", value: selected.referrals.toString() },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: "0.7rem", color: "#aaa", fontWeight: 600, textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#333", marginTop: 2 }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Order History</div>
            {selected.orders.map((o, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f5f5f5", fontSize: "0.82rem" }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#333" }}>{o.store}</div>
                  <div style={{ color: "#aaa", fontSize: "0.75rem" }}>{o.date}</div>
                </div>
                <div style={{ fontWeight: 700, color: "#2e7d32" }}>${o.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const pageBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  border: "1px solid #ddd",
  borderRadius: 6,
  background: "#fff",
  color: "#555",
  cursor: "pointer",
  fontSize: "0.8rem",
  fontWeight: 600,
};
