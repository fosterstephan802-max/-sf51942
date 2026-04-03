"use client";
import { useState, useEffect } from "react";

/* ── Mock data helpers ─────────────────────────────────────── */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function seed(n: number) {
  // Deterministic fake signups per day (0–18)
  return Math.floor(Math.abs(Math.sin(n * 9301 + 49297) * 1000) % 19);
}

const TODAY   = new Date();
const MONTH   = TODAY.getMonth();
const YEAR    = TODAY.getFullYear();

/* Build 30-day sparkline data */
const SPARKLINE: { day: string; count: number }[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(TODAY);
  d.setDate(TODAY.getDate() - (29 - i));
  return { day: `${d.getMonth() + 1}/${d.getDate()}`, count: seed(i + MONTH * 31) };
});

const TOTAL_SIGNUPS = SPARKLINE.reduce((s, d) => s + d.count, 0);

const CAMPAIGNS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* KPI cards */
const KPIs = [
  { label: "Total Members",      value: "2,841",   delta: "+14%",  color: "#003580", icon: "👥" },
  { label: "Active This Month",  value: "1,204",   delta: "+8%",   color: "#005a1e", icon: "✅" },
  { label: "MRR",                value: "$14,380", delta: "+22%",  color: "#8b5a00", icon: "💰" },
  { label: "Conversion Rate",    value: "6.4%",    delta: "+1.1%", color: "#4b0082", icon: "📈" },
];

/* ── SVG sparkline ───────────────────────────────────────────── */
function Sparkline({ data }: { data: { day: string; count: number }[] }) {
  const W = 540, H = 80, PAD = 8;
  const max   = Math.max(...data.map(d => d.count), 1);
  const xs    = data.map((_, i) => PAD + (i / (data.length - 1)) * (W - PAD * 2));
  const ys    = data.map(d => PAD + (1 - d.count / max) * (H - PAD * 2));
  const pts   = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const fillPts = `${xs[0]},${H} ${pts} ${xs[xs.length - 1]},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#003580" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#003580" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill="url(#spark-fill)" />
      <polyline points={pts} fill="none" stroke="#003580" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ── Countdown to next campaign rotation ─────────────────────── */
function useCountdown() {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    function calc() {
      const now  = new Date();
      const next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
      const ms   = next.getTime() - now.getTime();
      const d    = Math.floor(ms / 86400000);
      const h    = Math.floor((ms % 86400000) / 3600000);
      const m    = Math.floor((ms % 3600000)  / 60000);
      const s    = Math.floor((ms % 60000)    / 1000);
      setRemaining(`${d}d ${h}h ${m}m ${s}s`);
    }
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, []);
  return remaining;
}

/* ── Component ───────────────────────────────────────────────── */
export default function DashboardPage() {
  const countdown = useCountdown();

  return (
    <div>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#003580", marginBottom: 6 }}>
        Dashboard
      </h1>
      <p style={{ color: "#666", marginBottom: 28, fontSize: "0.9rem" }}>
        Welcome back — here&apos;s what&apos;s happening at International Shoppers Club.
      </p>

      {/* ── KPI cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 18, marginBottom: 32 }}>
        {KPIs.map(k => (
          <div key={k.label} style={{
            background: "#fff",
            borderRadius: 12,
            padding: "20px 22px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            borderTop: `4px solid ${k.color}`,
          }}>
            <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: "0.8rem", color: "#888", marginTop: 2 }}>{k.label}</div>
            <div style={{
              display: "inline-block",
              marginTop: 8,
              background: "#e8f5e9",
              color: "#2e7d32",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 20,
            }}>
              {k.delta} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* ── Signups sparkline ── */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: "24px 28px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
        marginBottom: 24,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#003580", margin: 0 }}>
              New Signups — Last 30 Days
            </h2>
            <p style={{ color: "#888", fontSize: "0.82rem", margin: "4px 0 0" }}>
              {TOTAL_SIGNUPS} total new members in this window
            </p>
          </div>
        </div>
        <Sparkline data={SPARKLINE} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#bbb", marginTop: 4 }}>
          <span>{SPARKLINE[0].day}</span>
          <span>{SPARKLINE[SPARKLINE.length - 1].day}</span>
        </div>
      </div>

      {/* ── Active campaign + countdown ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 18,
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 12,
          padding: "22px 24px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
        }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#003580", marginBottom: 12 }}>
            🗓️ Active Campaign
          </h2>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {CAMPAIGNS[MONTH]} Campaign
          </div>
          <div style={{ fontSize: "0.82rem", color: "#666" }}>
            Month {MONTH + 1} of 12 · {YEAR}
          </div>
          <a
            href="/admin/campaigns"
            style={{
              display: "inline-block",
              marginTop: 14,
              padding: "8px 16px",
              background: "#003580",
              color: "#fff",
              borderRadius: 6,
              fontSize: "0.82rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Edit Campaign →
          </a>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: 12,
          padding: "22px 24px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
        }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#003580", marginBottom: 12 }}>
            ⏳ Next Rotation In
          </h2>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#4b0082", fontVariantNumeric: "tabular-nums" }}>
            {countdown || "Calculating…"}
          </div>
          <div style={{ fontSize: "0.82rem", color: "#666", marginTop: 4 }}>
            Switches to {CAMPAIGNS[(MONTH + 1) % 12]} campaign on the 1st
          </div>
          <div style={{ marginTop: 14, fontSize: "0.8rem", color: "#999" }}>
            Override auto-rotation in{" "}
            <a href="/admin/settings" style={{ color: "#003580" }}>Settings</a>
          </div>
        </div>
      </div>
    </div>
  );
}
