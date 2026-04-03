"use client";

/* ── Mock analytics data ──────────────────────────────────────── */
const CAMPAIGN_STATS = [
  { month: "January",   emoji: "🎉", signups: 312, conversion: 7.2, revenue: 1890 },
  { month: "February",  emoji: "💝", signups: 278, conversion: 6.8, revenue: 1640 },
  { month: "March",     emoji: "🌱", signups: 294, conversion: 6.5, revenue: 1720 },
  { month: "April",     emoji: "⚡", signups: 330, conversion: 7.8, revenue: 2010 },
  { month: "May",       emoji: "🥇", signups: 356, conversion: 8.1, revenue: 2210 },
  { month: "June",      emoji: "🌊", signups: 298, conversion: 6.9, revenue: 1780 },
  { month: "July",      emoji: "🎰", signups: 412, conversion: 9.4, revenue: 2580 },
  { month: "August",    emoji: "🎒", signups: 387, conversion: 8.8, revenue: 2330 },
  { month: "September", emoji: "🍂", signups: 261, conversion: 5.9, revenue: 1540 },
  { month: "October",   emoji: "🎃", signups: 445, conversion: 10.1, revenue: 2780 },
  { month: "November",  emoji: "🛒", signups: 502, conversion: 11.4, revenue: 3120 },
  { month: "December",  emoji: "🎄", signups: 388, conversion: 8.7, revenue: 2350 },
];

const REFERRAL_STATS = [
  { name: "Emma Johnson",    email: "emma.johnson@example.com",   referrals: 8, bonus: "$24.00" },
  { name: "Lucas Martinez",  email: "lucas.martinez@example.com", referrals: 6, bonus: "$18.00" },
  { name: "Sophia Williams", email: "sophia.williams@example.com",referrals: 5, bonus: "$15.00" },
  { name: "James Brown",     email: "james.brown@example.com",    referrals: 4, bonus: "$12.00" },
  { name: "Ava Davis",       email: "ava.davis@example.com",      referrals: 3, bonus: "$9.00"  },
  { name: "Ethan Wilson",    email: "ethan.wilson@example.com",   referrals: 3, bonus: "$9.00"  },
  { name: "Isabella Moore",  email: "isabella.moore@example.com", referrals: 2, bonus: "$6.00"  },
];

const TRAFFIC_SOURCES = [
  { source: "Organic Search",  sessions: 14320, pct: 38 },
  { source: "Direct",          sessions: 9870,  pct: 26 },
  { source: "Social Media",    sessions: 7650,  pct: 20 },
  { source: "Email Campaign",  sessions: 3820,  pct: 10 },
  { source: "Referral Links",  sessions: 2280,  pct: 6  },
];

const CURRENT_MONTH = new Date().getMonth();
const MAX_SIGNUPS   = Math.max(...CAMPAIGN_STATS.map(c => c.signups));

/* ── Bar chart row ────────────────────────────────────────────── */
function BarRow({ stat, isActive }: { stat: typeof CAMPAIGN_STATS[0]; isActive: boolean }) {
  const pct = (stat.signups / MAX_SIGNUPS) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <div style={{ width: 90, fontSize: "0.8rem", color: isActive ? "#003580" : "#555", fontWeight: isActive ? 700 : 400, flexShrink: 0 }}>
        {stat.emoji} {stat.month}
      </div>
      <div style={{ flex: 1, background: "#f0f2f5", borderRadius: 4, overflow: "hidden", height: 20 }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: isActive ? "#003580" : "#9bb8e0",
          borderRadius: 4,
          transition: "width 0.4s ease",
          display: "flex",
          alignItems: "center",
          paddingLeft: 8,
        }}>
          {pct > 20 && <span style={{ fontSize: "0.7rem", color: "#fff", fontWeight: 700 }}>{stat.signups}</span>}
        </div>
      </div>
      {pct <= 20 && <span style={{ fontSize: "0.75rem", color: "#555", fontWeight: 600, width: 32 }}>{stat.signups}</span>}
      <div style={{ width: 50, fontSize: "0.78rem", color: "#888", textAlign: "right", flexShrink: 0 }}>
        {stat.conversion}%
      </div>
      <div style={{ width: 64, fontSize: "0.78rem", color: "#2e7d32", fontWeight: 600, textAlign: "right", flexShrink: 0 }}>
        ${stat.revenue.toLocaleString()}
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const totalSignups = CAMPAIGN_STATS.reduce((s, c) => s + c.signups, 0);
  const totalRevenue = CAMPAIGN_STATS.reduce((s, c) => s + c.revenue, 0);
  const bestCampaign = CAMPAIGN_STATS.reduce((best, c) => c.signups > best.signups ? c : best, CAMPAIGN_STATS[0]);

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#003580", marginBottom: 6 }}>
        Analytics
      </h1>
      <p style={{ color: "#666", fontSize: "0.88rem", marginBottom: 24 }}>
        Marketing performance across all 12 monthly campaigns.
      </p>

      {/* ── Summary KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Signups (YTD)",  value: totalSignups.toLocaleString(), icon: "👥", color: "#003580" },
          { label: "Best Campaign",         value: `${bestCampaign.emoji} ${bestCampaign.month}`, icon: "🏆", color: "#8b5a00" },
          { label: "Best Conversion Rate",  value: `${bestCampaign.conversion}%`, icon: "📈", color: "#4b0082" },
          { label: "Total Revenue (YTD)",   value: `$${totalRevenue.toLocaleString()}`, icon: "💰", color: "#005a1e" },
        ].map(k => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", borderTop: `4px solid ${k.color}` }}>
            <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Campaign signup chart ── */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "24px 26px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: 24 }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#003580", marginBottom: 4 }}>
          Signups by Campaign
        </h2>
        <p style={{ color: "#888", fontSize: "0.8rem", marginBottom: 18 }}>
          Per-campaign new-member signups · conversion rate · revenue
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 24, marginBottom: 8, fontSize: "0.72rem", color: "#aaa", fontWeight: 600 }}>
          <span style={{ width: 50, textAlign: "right" }}>Conv.</span>
          <span style={{ width: 64, textAlign: "right" }}>Revenue</span>
        </div>
        {CAMPAIGN_STATS.map((stat, i) => (
          <BarRow key={stat.month} stat={stat} isActive={i === CURRENT_MONTH} />
        ))}
        <p style={{ fontSize: "0.72rem", color: "#ccc", marginTop: 10 }}>
          ■ Highlighted bar = current active campaign
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* ── Referral tracking ── */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "22px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#003580", marginBottom: 14 }}>
            💝 Referral Leaderboard
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
            <thead>
              <tr>
                {["Member","Referrals","Bonus"].map(h => (
                  <th key={h} style={{ padding: "6px 10px", textAlign: "left", color: "#888", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #f0f0f0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REFERRAL_STATS.map((r, i) => (
                <tr key={r.email} style={{ borderBottom: "1px solid #f8f8f8" }}>
                  <td style={{ padding: "8px 10px" }}>
                    <div style={{ fontWeight: 600 }}>{i === 0 ? "🥇 " : i === 1 ? "🥈 " : i === 2 ? "🥉 " : ""}{r.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#aaa" }}>{r.email}</div>
                  </td>
                  <td style={{ padding: "8px 10px", fontWeight: 700, color: "#4b0082" }}>{r.referrals}</td>
                  <td style={{ padding: "8px 10px", fontWeight: 700, color: "#2e7d32" }}>{r.bonus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Traffic sources ── */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "22px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#003580", marginBottom: 14 }}>
            🌐 Traffic Sources
          </h2>
          {TRAFFIC_SOURCES.map(t => (
            <div key={t.source} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.83rem" }}>
                <span style={{ fontWeight: 600, color: "#333" }}>{t.source}</span>
                <span style={{ color: "#888" }}>{t.sessions.toLocaleString()} sessions</span>
              </div>
              <div style={{ background: "#f0f2f5", borderRadius: 4, height: 8, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${t.pct}%`,
                  background: "linear-gradient(90deg,#003580,#0052a5)",
                  borderRadius: 4,
                }} />
              </div>
              <div style={{ fontSize: "0.72rem", color: "#aaa", marginTop: 3 }}>{t.pct}% of traffic</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
