"use client";
import { useState, useEffect, useCallback } from "react";

/* ── Campaign type mirrors app/page.tsx ─────────────────────── */
type Campaign = {
  month: string;
  navSubLabel: string;
  barBg: string;
  barEmoji: string;
  barLabel: string;
  barHighlight: string;
  barCta: string;
  heroBadge: string;
  heroGradient: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroBody: string;
  chips: string[];
  heroCta: string;
  heroFine: string;
  benefits: string[];
};

const DEFAULT_CAMPAIGNS: Campaign[] = [
  { month:"January",   navSubLabel:"50% off your 1st $50+ order 🎉",        barBg:"#c8102e", barEmoji:"🎉", barLabel:"New Year offer:",           barHighlight:"50% OFF your first order of $50+",                         barCta:"Claim Now",         heroBadge:"🌐 International Shoppers Club — New Year Special",      heroGradient:"linear-gradient(135deg,#003580 0%,#0052a5 50%,#c8102e 100%)",  heroTitle:"New Year, New Savings —",        heroTitleHighlight:"50% Off Your First Order",         heroBody:"Spend $50 or more on your first order this January and we'll cut the bill in half — automatically. No promo code needed. Cancel anytime.", chips:["🎁 50% off first $50+ order","🔓 No credit card to join","📦 500+ stores, 1 membership","⚡ Instant flash-deal access","🚫 Cancel anytime, no fees"], heroCta:"Join Free — Claim 50% Off Now 🎉",        heroFine:"New members only · First month only · $50 minimum order",        benefits:["🎁  50% off when you spend $50+ on your 1st order","✅  Save up to 40% at 500+ stores every month","✅  Exclusive member-only flash deals","✅  Free worldwide price alerts","✅  Priority customer support"] },
  { month:"February",  navSubLabel:"Refer a friend — both save 30% 💝",      barBg:"#a0003a", barEmoji:"💝", barLabel:"Valentine's offer:",         barHighlight:"Bring a friend — you both save 30% this month",            barCta:"Share the Love",    heroBadge:"💝 Valentine's Day — Members & Their Plus-Ones",          heroGradient:"linear-gradient(135deg,#7b0030 0%,#c8102e 50%,#ff6b9d 100%)", heroTitle:"Share the Love,",                heroTitleHighlight:"Share the Savings 💕",             heroBody:"Join this February and invite a friend or partner. You both unlock 30% off sitewide — the perfect gift that keeps giving all month long.",  chips:["💝 Refer 1 friend, you both save 30%","🔓 Free to join","🎁 Perfect as a gift","📦 500+ stores covered","🚫 Cancel anytime"],                    heroCta:"Join Free — Share 30% Off 💕",            heroFine:"Both members must join in February · Offer ends Feb 28",         benefits:["💝  Refer a friend — you both save 30% this month","✅  Save up to 40% at 500+ stores","✅  Exclusive member-only flash deals","✅  Free worldwide price alerts","✅  Priority customer support"] },
  { month:"March",     navSubLabel:"$15 bonus credit on first purchase 🌱",  barBg:"#005a1e", barEmoji:"🌱", barLabel:"Spring Kickoff:",            barHighlight:"$15 bonus credit added to your first purchase",            barCta:"Claim $15 Credit",  heroBadge:"🌱 Spring Kickoff — Members Get More",                    heroGradient:"linear-gradient(135deg,#003a00 0%,#228b22 55%,#005082 100%)", heroTitle:"Spring Into Savings —",          heroTitleHighlight:"$15 Bonus Credit, Free",           heroBody:"Join this month and we'll drop a $15 bonus credit straight into your account — use it on any purchase across 500+ stores. No strings attached.", chips:["💵 $15 bonus credit on 1st purchase","🔓 Completely free to join","🌱 Fresh deals every week","📦 500+ partner stores","🚫 Cancel anytime"],  heroCta:"Join Free — Get $15 Credit 🌱",           heroFine:"New members only · Credit applied automatically · March",        benefits:["💵  $15 bonus credit on your very first purchase","✅  Save up to 40% at 500+ stores every month","✅  Exclusive member-only flash deals","✅  Free worldwide price alerts","✅  Priority customer support"] },
  { month:"April",     navSubLabel:"48-hr early access to flash deals ⚡",   barBg:"#4b0082", barEmoji:"⚡", barLabel:"Flash Deal Insider:",        barHighlight:"Members see deals 48 hrs before the public",              barCta:"Get Early Access",  heroBadge:"⚡ Flash Deal Insider — April Exclusive",                 heroGradient:"linear-gradient(135deg,#1a0050 0%,#4b0082 50%,#003580 100%)", heroTitle:"Shop Before",                    heroTitleHighlight:"Everyone Else Does ⚡",             heroBody:"Join this April and get insider access to flash deals a full 48 hours before they go public. While others wait, you save. Spots are limited per deal.", chips:["⚡ 48-hr early deal access","🔓 Free membership","🔔 Instant deal alerts","📦 500+ stores","🚫 No commitment"],                              heroCta:"Join Free — Get Early Access ⚡",          heroFine:"Early access applies to flash deals only · April",               benefits:["⚡  48-hour early access to all flash sales","🔔  Deal alerts before public announcement","✅  Save up to 40% at 500+ stores","✅  Exclusive member-only flash deals","✅  Priority customer support"] },
  { month:"May",       navSubLabel:"2× cashback — Member Appreciation 🥇",   barBg:"#8b5a00", barEmoji:"🥇", barLabel:"Member Appreciation:",       barHighlight:"Double cashback on every purchase all May",               barCta:"Double My Savings", heroBadge:"🥇 Member Appreciation Month — May Rewards",              heroGradient:"linear-gradient(135deg,#003580 0%,#8b5a00 50%,#ffd700 100%)", heroTitle:"Earn Double —",                  heroTitleHighlight:"2× Cashback All Month 🥇",         heroBody:"May is member appreciation month. Join now and every purchase earns twice the cashback — automatically stacked on top of already-discounted prices.", chips:["🥇 2× cashback all May","💰 Stacks on store discounts","🔓 Free to join","📦 500+ stores","🚫 Cancel anytime"],                               heroCta:"Join Free — Start Earning 2× 🥇",         heroFine:"Double cashback applies to May purchases only · New members",    benefits:["🥇  2× cashback on every purchase this month","💰  Stacks on top of existing store discounts","✅  Save up to 40% at 500+ stores","✅  Exclusive member-only flash deals","✅  Priority customer support"] },
  { month:"June",      navSubLabel:"Free 3-month VIP upgrade — $30 value 🌊",barBg:"#006994", barEmoji:"🌊", barLabel:"Summer VIP Upgrade:",        barHighlight:"Join now, get 3 months of VIP free — $30 value",          barCta:"Upgrade Free",      heroBadge:"🌊 Summer VIP Club — June Exclusive",                     heroGradient:"linear-gradient(135deg,#003f5e 0%,#0077a8 50%,#00bcd4 100%)", heroTitle:"Join Free, Get",                 heroTitleHighlight:"3 Months of VIP Free 🌊",          heroBody:"Join the International Shoppers Club this June and receive a complimentary 3-month VIP upgrade. VIP members unlock bonus deals, priority support, and exclusive cashback tiers.", chips:["🌊 3-month VIP free ($30 value)","🎯 Bonus VIP-only deals","🔓 No credit card to join","📦 500+ stores","🚫 Cancel anytime"],                  heroCta:"Join Free — Get 3 Months VIP 🌊",         heroFine:"VIP upgrade auto-applied for June joiners · No card required",   benefits:["🌊  Free 3-month VIP upgrade — $30 value","🎯  Bonus VIP-exclusive deal tiers","✅  Save up to 40% at 500+ stores","✅  Exclusive member-only flash deals","✅  Priority customer support"] },
  { month:"July",      navSubLabel:"Spin to win — up to 60% off 🎰",         barBg:"#b83200", barEmoji:"🎰", barLabel:"Mid-Year Blowout:",          barHighlight:"Spin the wheel — win up to 60% off your first order",     barCta:"Spin Now",          heroBadge:"🎰 Mid-Year Mystery Blowout — July Only",                 heroGradient:"linear-gradient(135deg,#003580 0%,#8b0000 40%,#b83200 100%)", heroTitle:"Spin to Win —",                  heroTitleHighlight:"Up to 60% Off Your First Order 🎰",heroBody:"July's mystery discount wheel is live! Every new member spins and reveals their personal discount — anywhere from 20% to 60% off their first order. Join free to spin.", chips:["🎰 Spin for 20–60% off","🎁 Every member wins","🔓 Free to join & spin","📦 500+ stores","🚫 No obligation"],                                 heroCta:"Join Free — Spin the Wheel 🎰",            heroFine:"One spin per new member · Minimum 20% guaranteed · July only",   benefits:["🎰  Spin the wheel — win 20% to 60% off your 1st order","🎁  Every member wins a guaranteed discount","✅  Save up to 40% at 500+ stores","✅  Exclusive member-only flash deals","✅  Priority customer support"] },
  { month:"August",    navSubLabel:"40% off tech & school supplies 🎒",       barBg:"#004d1a", barEmoji:"🎒", barLabel:"Back to School:",            barHighlight:"Members save 40% on tech & school supplies this August",  barCta:"Shop School Deals", heroBadge:"🎒 Back to School — August Members Only",                 heroGradient:"linear-gradient(135deg,#00270d 0%,#004d1a 50%,#003580 100%)", heroTitle:"Back to School —",               heroTitleHighlight:"40% Off Tech & Supplies 🎒",       heroBody:"August is the biggest back-to-school month. Members get exclusive 40% off on electronics, stationery, and school essentials across 500+ partner stores.", chips:["🎒 40% off tech & school gear","💻 Laptops, tablets, supplies","🔓 Free to join","📦 500+ stores","🚫 Cancel anytime"],                       heroCta:"Join Free — Save 40% on School Gear 🎒",   heroFine:"40% discount on eligible school categories · August only",       benefits:["🎒  40% off tech, school & office supplies","💻  Covers laptops, tablets, stationery & more","✅  Save up to 40% at 500+ stores all year","✅  Exclusive member-only flash deals","✅  Priority customer support"] },
  { month:"September", navSubLabel:"Preview fall deals 24 hrs early 🍂",     barBg:"#6b3300", barEmoji:"🍂", barLabel:"Fall Preview:",              barHighlight:"Members unlock fall deals 24 hours before the public",    barCta:"Preview Deals",     heroBadge:"🍂 Fall Deals Preview — September Members",               heroGradient:"linear-gradient(135deg,#4a1a00 0%,#8b4513 50%,#003580 100%)", heroTitle:"First Look at",                  heroTitleHighlight:"Fall's Best Deals 🍂",             heroBody:"As a member you get a 24-hour head start on all fall promotions before they go public. Grab the best products at the best prices before they sell out.", chips:["🍂 24-hr early fall deal access","🔔 Priority deal alerts","🔓 Free to join","📦 500+ stores","🚫 Cancel anytime"],                             heroCta:"Join Free — Preview Fall Deals 🍂",        heroFine:"Early access applies to Fall promotion events · September",      benefits:["🍂  24-hour early access to all fall promotions","🔔  Priority alerts before deals go public","✅  Save up to 40% at 500+ stores all year","✅  Exclusive member-only flash deals","✅  Priority customer support"] },
  { month:"October",   navSubLabel:"Mystery savings — up to 60% off 🎃",     barBg:"#4a0080", barEmoji:"🎃", barLabel:"Spooky Savings:",            barHighlight:"Reveal your mystery discount — up to 60% off",            barCta:"Reveal My Deal",    heroBadge:"🎃 Spooky Savings Event — October Members",               heroGradient:"linear-gradient(135deg,#1a0030 0%,#4a0080 40%,#b84800 100%)", heroTitle:"Spooky Good Savings —",          heroTitleHighlight:"Your Discount Is a Mystery 👻",    heroBody:"Join in October and unbox a mystery savings amount — 20%, 40%, or a jaw-dropping 60% off your first order. You won't know until you join! Everyone wins something.", chips:["🎃 Mystery discount: 20–60% off","👻 Every member wins","🔓 Free to join","📦 500+ stores","🚫 No tricks, just treats"],                        heroCta:"Join Free — Reveal Your Discount 🎃",      heroFine:"Mystery discount revealed at sign-up · October members only",    benefits:["🎃  Mystery discount revealed at join — up to 60% off","👻  Everyone wins — minimum 20% guaranteed","✅  Save up to 40% at 500+ stores all year","✅  Exclusive member-only flash deals","✅  Priority customer support"] },
  { month:"November",  navSubLabel:"Shop Black Friday 48 hrs early 🛒",       barBg:"#0d0d0d", barEmoji:"🛒", barLabel:"Black Friday Early Access:", barHighlight:"Members shop Black Friday 48 hrs before everyone else",   barCta:"Get Early Access",  heroBadge:"🛒 Black Friday Early Access — November Members",          heroGradient:"linear-gradient(135deg,#0d0d0d 0%,#1a0000 40%,#003580 100%)", heroTitle:"Beat the Rush —",                heroTitleHighlight:"Shop Black Friday 48 Hrs Early 🛒",heroBody:"Members get exclusive access to all Black Friday deals a full 48 hours before the public. The best products sell out fast — get in before the crowd.", chips:["🛒 48-hr early Black Friday access","⚡ Best deals before sell-out","🔓 Free to join","📦 500+ stores","🚫 Cancel anytime"],                    heroCta:"Join Free — Shop Black Friday Early 🛒",   heroFine:"Early access for November members · Black Friday deals only",    benefits:["🛒  Shop Black Friday deals 48 hours early","⚡  Best items before they sell out","✅  Save up to 40% at 500+ stores all year","✅  Exclusive member-only flash deals","✅  Priority customer support"] },
  { month:"December",  navSubLabel:"50% off + free gift wrap 🎄",             barBg:"#006400", barEmoji:"🎄", barLabel:"Holiday VIP Package:",       barHighlight:"50% off first $50+ order + free gift wrapping this December",barCta:"Unwrap Savings",  heroBadge:"🎄 Holiday VIP Package — December Exclusive",              heroGradient:"linear-gradient(135deg,#003580 0%,#006400 50%,#8b0000 100%)", heroTitle:"Holiday Savings —",              heroTitleHighlight:"50% Off + Free Gift Wrapping 🎁",  heroBody:"Join free this December and receive 50% off your first $50+ order, plus complimentary gift wrapping on every item. Give more, spend less.", chips:["🎄 50% off first $50+ order","🎁 Free gift wrapping","🔓 No credit card to join","📦 500+ stores","🚫 Cancel anytime"],                        heroCta:"Join Free — Claim Holiday Savings 🎄",     heroFine:"Holiday offer for new members · 50% off on $50+ · December",    benefits:["🎄  50% off your first $50+ holiday order","🎁  Free gift wrapping on every item","✅  Save up to 40% at 500+ stores all year","✅  Exclusive member-only flash deals","✅  Priority customer support"] },
];

const LS_KEY = "isc_campaigns_override";
const CURRENT_MONTH = new Date().getMonth();

/* ── Helpers ─────────────────────────────────────────────────── */
function loadCampaigns(): Campaign[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as Campaign[];
  } catch { /* ignore */ }
  return DEFAULT_CAMPAIGNS;
}

function saveCampaigns(c: Campaign[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(c));
}

function statusLabel(i: number): { label: string; bg: string; color: string } {
  if (i === CURRENT_MONTH)           return { label: "● Active",   bg: "#e8f5e9", color: "#2e7d32" };
  if (i > CURRENT_MONTH)             return { label: "Upcoming",   bg: "#e3f2fd", color: "#1565c0" };
  return                                     { label: "Past",      bg: "#f5f5f5", color: "#888"    };
}

type Field = { key: keyof Campaign; label: string; type: "text" | "textarea" | "color" | "chips" | "benefits" };
const FIELDS: Field[] = [
  { key: "barBg",               label: "Bar background color", type: "color"    },
  { key: "barLabel",            label: "Bar label",            type: "text"     },
  { key: "barHighlight",        label: "Bar highlight text",   type: "text"     },
  { key: "barCta",              label: "Bar CTA button text",  type: "text"     },
  { key: "navSubLabel",         label: "Nav sub-label",        type: "text"     },
  { key: "heroBadge",           label: "Hero badge",           type: "text"     },
  { key: "heroTitle",           label: "Hero title",           type: "text"     },
  { key: "heroTitleHighlight",  label: "Hero title highlight", type: "text"     },
  { key: "heroBody",            label: "Hero body copy",       type: "textarea" },
  { key: "heroCta",             label: "Hero CTA button",      type: "text"     },
  { key: "heroFine",            label: "Hero fine print",      type: "text"     },
  { key: "chips",               label: "Feature chips",        type: "chips"    },
  { key: "benefits",            label: "Benefit bullets",      type: "benefits" },
];

/* ── Campaign Preview mini-card ─────────────────────────────── */
function CampaignPreview({ c }: { c: Campaign }) {
  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#003580", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Preview
      </h3>
      {/* Announcement bar */}
      <div style={{ background: c.barBg, color: "#fff", padding: "7px 16px", fontSize: "0.82rem", fontWeight: 600, borderRadius: "6px 6px 0 0", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span>{c.barEmoji}</span>
        <strong>{c.barLabel}</strong>
        <span style={{ color: "#ffd700" }}>{c.barHighlight}</span>
        <span style={{ background: "#ffd700", color: c.barBg, borderRadius: 4, padding: "1px 8px", fontWeight: 800, fontSize: "0.78rem" }}>{c.barCta}</span>
      </div>
      {/* Hero mini */}
      <div style={{ background: c.heroGradient, color: "#fff", padding: "20px 18px", borderRadius: "0 0 6px 6px" }}>
        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>{c.heroBadge}</div>
        <div style={{ fontSize: "1.05rem", fontWeight: 800, lineHeight: 1.3 }}>
          {c.heroTitle} <span style={{ color: "#ffd700" }}>{c.heroTitleHighlight}</span>
        </div>
        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.82)", marginTop: 8, lineHeight: 1.5 }}>{c.heroBody}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {c.chips.map((chip, i) => (
            <span key={i} style={{ background: "rgba(255,255,255,0.18)", padding: "3px 9px", borderRadius: 20, fontSize: "0.7rem" }}>{chip}</span>
          ))}
        </div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 4 }}>
          {c.benefits.map((b, i) => (
            <div key={i} style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.88)" }}>{b}</div>
          ))}
        </div>
        <button style={{ marginTop: 14, padding: "7px 18px", background: "#ffd700", border: "none", borderRadius: 6, fontWeight: 800, fontSize: "0.8rem", cursor: "default" }}>
          {c.heroCta}
        </button>
        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.55)", marginTop: 6 }}>{c.heroFine}</div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function CampaignsPage() {
  const [campaigns, setCampaigns]   = useState<Campaign[]>(DEFAULT_CAMPAIGNS);
  const [editing, setEditing]       = useState<number | null>(null);
  const [draft, setDraft]           = useState<Campaign | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved]           = useState(false);

  useEffect(() => { setCampaigns(loadCampaigns()); }, []);

  const openEditor = useCallback((i: number) => {
    setEditing(i);
    setDraft({ ...campaigns[i] });
    setShowPreview(false);
    setSaved(false);
  }, [campaigns]);

  const closeEditor = useCallback(() => {
    setEditing(null);
    setDraft(null);
    setShowPreview(false);
  }, []);

  function updateDraftField(key: keyof Campaign, value: string) {
    setDraft(d => d ? { ...d, [key]: value } : d);
  }

  function updateDraftArray(key: "chips" | "benefits", idx: number, value: string) {
    setDraft(d => {
      if (!d) return d;
      const arr = [...(d[key] as string[])];
      arr[idx] = value;
      return { ...d, [key]: arr };
    });
  }

  function addArrayItem(key: "chips" | "benefits") {
    setDraft(d => d ? { ...d, [key]: [...(d[key] as string[]), ""] } : d);
  }

  function removeArrayItem(key: "chips" | "benefits", idx: number) {
    setDraft(d => {
      if (!d) return d;
      const arr = (d[key] as string[]).filter((_, i) => i !== idx);
      return { ...d, [key]: arr };
    });
  }

  function handleSave() {
    if (editing === null || !draft) return;
    const updated = campaigns.map((c, i) => (i === editing ? draft : c));
    setCampaigns(updated);
    saveCampaigns(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset(i: number) {
    if (!confirm(`Reset ${campaigns[i].month} campaign to default?`)) return;
    const updated = campaigns.map((c, idx) => (idx === i ? DEFAULT_CAMPAIGNS[i] : c));
    setCampaigns(updated);
    saveCampaigns(updated);
    if (editing === i) setDraft({ ...DEFAULT_CAMPAIGNS[i] });
  }

  return (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>

      {/* ── Campaign table ── */}
      <div style={{ flex: editing !== null ? "0 0 340px" : "1" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#003580", marginBottom: 6 }}>
          Campaigns
        </h1>
        <p style={{ color: "#666", fontSize: "0.88rem", marginBottom: 20 }}>
          12 monthly rotating campaigns. Click a row to edit its copy, colors, and CTAs.
        </p>

        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.87rem" }}>
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                {["#","Month","Hook","Status",""].map(h => (
                  <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: "#555", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #eee" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c, i) => {
                const st = statusLabel(i);
                const isActive = editing === i;
                return (
                  <tr
                    key={c.month}
                    onClick={() => openEditor(i)}
                    style={{
                      cursor: "pointer",
                      background: isActive ? "#f0f4ff" : "transparent",
                      borderBottom: "1px solid #f2f2f2",
                      transition: "background 0.12s",
                    }}
                  >
                    <td style={{ padding: "10px 14px", color: "#aaa", fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ marginRight: 6 }}>{c.barEmoji}</span>
                      <strong>{c.month}</strong>
                    </td>
                    <td style={{ padding: "10px 14px", color: "#555", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.barHighlight}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ background: st.bg, color: st.color, padding: "3px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700 }}>{st.label}</span>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <button
                        onClick={e => { e.stopPropagation(); handleReset(i); }}
                        style={{ background: "none", border: "1px solid #ddd", borderRadius: 5, padding: "3px 10px", fontSize: "0.75rem", cursor: "pointer", color: "#888" }}
                        title="Reset to default"
                      >
                        Reset
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Editor panel ── */}
      {editing !== null && draft && (
        <div style={{
          flex: 1,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
          padding: "24px 28px",
          maxHeight: "calc(100vh - 80px)",
          overflowY: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#003580", margin: 0 }}>
              {draft.barEmoji} Edit — {draft.month}
            </h2>
            <button onClick={closeEditor} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#aaa" }}>✕</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {FIELDS.map(f => {
              if (f.type === "color") return (
                <label key={f.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#555" }}>{f.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                      type="color"
                      value={draft[f.key] as string}
                      onChange={e => updateDraftField(f.key, e.target.value)}
                      style={{ width: 44, height: 32, border: "none", cursor: "pointer", borderRadius: 4 }}
                    />
                    <input
                      type="text"
                      value={draft[f.key] as string}
                      onChange={e => updateDraftField(f.key, e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </label>
              );
              if (f.type === "textarea") return (
                <label key={f.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#555" }}>{f.label}</span>
                  <textarea
                    value={draft[f.key] as string}
                    onChange={e => updateDraftField(f.key, e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </label>
              );
              if (f.type === "chips" || f.type === "benefits") {
                const arr = draft[f.key] as string[];
                return (
                  <div key={f.key}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#555", marginBottom: 6 }}>{f.label}</div>
                    {arr.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                        <input
                          type="text"
                          value={item}
                          onChange={e => updateDraftArray(f.key as "chips" | "benefits", idx, e.target.value)}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        <button
                          onClick={() => removeArrayItem(f.key as "chips" | "benefits", idx)}
                          style={{ padding: "0 10px", background: "#fee", border: "1px solid #fcc", borderRadius: 6, color: "#c33", cursor: "pointer", fontWeight: 700 }}
                        >✕</button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem(f.key as "chips" | "benefits")}
                      style={{ background: "none", border: "1px dashed #bbb", borderRadius: 6, padding: "5px 12px", fontSize: "0.78rem", cursor: "pointer", color: "#666", marginTop: 2 }}
                    >
                      + Add item
                    </button>
                  </div>
                );
              }
              return (
                <label key={f.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#555" }}>{f.label}</span>
                  <input
                    type="text"
                    value={draft[f.key] as string}
                    onChange={e => updateDraftField(f.key, e.target.value)}
                    style={inputStyle}
                  />
                </label>
              );
            })}
          </div>

          {/* Save / Preview actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: "10px",
                background: "#003580",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              {saved ? "✅ Saved!" : "Save Changes"}
            </button>
            <button
              onClick={() => setShowPreview(v => !v)}
              style={{
                padding: "10px 18px",
                background: "#f0f0f0",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                color: "#333",
              }}
            >
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
          </div>

          {showPreview && <CampaignPreview c={draft} />}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  fontSize: "0.85rem",
  border: "1px solid #ddd",
  borderRadius: 6,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
