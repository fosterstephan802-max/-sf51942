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

/* ─────────────────────────────────────────────────────────────
   Monthly Rotating Campaign System
   One strategy auto-activates each calendar month (index 0-11).
   Change campaigns here; everything else updates automatically.
───────────────────────────────────────────────────────────── */
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

const MONTHLY_CAMPAIGNS: Campaign[] = [
  /* 0 – January ─ New Year, New Savings */
  {
    month: "January",
    navSubLabel: "50% off your 1st $50+ order 🎉",
    barBg: "#c8102e", barEmoji: "🎉", barLabel: "New Year offer:",
    barHighlight: "50% OFF your first order of $50+",
    barCta: "Claim Now",
    heroBadge: "🌐 International Shoppers Club — New Year Special",
    heroGradient: "linear-gradient(135deg,#003580 0%,#0052a5 50%,#c8102e 100%)",
    heroTitle: "New Year, New Savings —",
    heroTitleHighlight: "50% Off Your First Order",
    heroBody: "Spend $50 or more on your first order this January and we'll cut the bill in half — automatically. No promo code needed. Cancel anytime.",
    chips: ["🎁 50% off first $50+ order", "🔓 No credit card to join", "📦 500+ stores, 1 membership", "⚡ Instant flash-deal access", "🚫 Cancel anytime, no fees"],
    heroCta: "Join Free — Claim 50% Off Now 🎉",
    heroFine: "New members only · First month only · $50 minimum order",
    benefits: [
      "🎁  50% off when you spend $50+ on your 1st order",
      "✅  Save up to 40% at 500+ stores every month",
      "✅  Exclusive member-only flash deals",
      "✅  Free worldwide price alerts",
      "✅  Priority customer support",
    ],
  },
  /* 1 – February ─ Valentine's Referral */
  {
    month: "February",
    navSubLabel: "Refer a friend — both save 30% 💝",
    barBg: "#a0003a", barEmoji: "💝", barLabel: "Valentine's offer:",
    barHighlight: "Bring a friend — you both save 30% this month",
    barCta: "Share the Love",
    heroBadge: "💝 Valentine's Day — Members & Their Plus-Ones",
    heroGradient: "linear-gradient(135deg,#7b0030 0%,#c8102e 50%,#ff6b9d 100%)",
    heroTitle: "Share the Love,",
    heroTitleHighlight: "Share the Savings 💕",
    heroBody: "Join this February and invite a friend or partner. You both unlock 30% off sitewide — the perfect gift that keeps giving all month long.",
    chips: ["💝 Refer 1 friend, you both save 30%", "🔓 Free to join", "🎁 Perfect as a gift", "📦 500+ stores covered", "🚫 Cancel anytime"],
    heroCta: "Join Free — Share 30% Off 💕",
    heroFine: "Both members must join in February · Offer ends Feb 28",
    benefits: [
      "💝  Refer a friend — you both save 30% this month",
      "✅  Save up to 40% at 500+ stores",
      "✅  Exclusive member-only flash deals",
      "✅  Free worldwide price alerts",
      "✅  Priority customer support",
    ],
  },
  /* 2 – March ─ Spring $15 Bonus Credit */
  {
    month: "March",
    navSubLabel: "$15 bonus credit on first purchase 🌱",
    barBg: "#005a1e", barEmoji: "🌱", barLabel: "Spring Kickoff:",
    barHighlight: "$15 bonus credit added to your first purchase",
    barCta: "Claim $15 Credit",
    heroBadge: "🌱 Spring Kickoff — Members Get More",
    heroGradient: "linear-gradient(135deg,#003a00 0%,#228b22 55%,#005082 100%)",
    heroTitle: "Spring Into Savings —",
    heroTitleHighlight: "$15 Bonus Credit, Free",
    heroBody: "Join this month and we'll drop a $15 bonus credit straight into your account — use it on any purchase across 500+ stores. No strings attached.",
    chips: ["💵 $15 bonus credit on 1st purchase", "🔓 Completely free to join", "🌱 Fresh deals every week", "📦 500+ partner stores", "🚫 Cancel anytime"],
    heroCta: "Join Free — Get $15 Credit 🌱",
    heroFine: "New members only · Credit applied automatically · March",
    benefits: [
      "💵  $15 bonus credit on your very first purchase",
      "✅  Save up to 40% at 500+ stores every month",
      "✅  Exclusive member-only flash deals",
      "✅  Free worldwide price alerts",
      "✅  Priority customer support",
    ],
  },
  /* 3 – April ─ Flash Deal Early Access */
  {
    month: "April",
    navSubLabel: "48-hr early access to flash deals ⚡",
    barBg: "#4b0082", barEmoji: "⚡", barLabel: "Flash Deal Insider:",
    barHighlight: "Members see deals 48 hrs before the public",
    barCta: "Get Early Access",
    heroBadge: "⚡ Flash Deal Insider — April Exclusive",
    heroGradient: "linear-gradient(135deg,#1a0050 0%,#4b0082 50%,#003580 100%)",
    heroTitle: "Shop Before",
    heroTitleHighlight: "Everyone Else Does ⚡",
    heroBody: "Join this April and get insider access to flash deals a full 48 hours before they go public. While others wait, you save. Spots are limited per deal.",
    chips: ["⚡ 48-hr early deal access", "🔓 Free membership", "🔔 Instant deal alerts", "📦 500+ stores", "🚫 No commitment"],
    heroCta: "Join Free — Get Early Access ⚡",
    heroFine: "Early access applies to flash deals only · April",
    benefits: [
      "⚡  48-hour early access to all flash sales",
      "🔔  Deal alerts before public announcement",
      "✅  Save up to 40% at 500+ stores",
      "✅  Exclusive member-only flash deals",
      "✅  Priority customer support",
    ],
  },
  /* 4 – May ─ Member Appreciation 2× Cashback */
  {
    month: "May",
    navSubLabel: "2× cashback — Member Appreciation 🥇",
    barBg: "#8b5a00", barEmoji: "🥇", barLabel: "Member Appreciation:",
    barHighlight: "Double cashback on every purchase all May",
    barCta: "Double My Savings",
    heroBadge: "🥇 Member Appreciation Month — May Rewards",
    heroGradient: "linear-gradient(135deg,#003580 0%,#8b5a00 50%,#ffd700 100%)",
    heroTitle: "Earn Double —",
    heroTitleHighlight: "2× Cashback All Month 🥇",
    heroBody: "May is member appreciation month. Join now and every purchase earns twice the cashback — automatically stacked on top of already-discounted prices.",
    chips: ["🥇 2× cashback all May", "💰 Stacks on store discounts", "🔓 Free to join", "📦 500+ stores", "🚫 Cancel anytime"],
    heroCta: "Join Free — Start Earning 2× 🥇",
    heroFine: "Double cashback applies to May purchases only · New members",
    benefits: [
      "🥇  2× cashback on every purchase this month",
      "💰  Stacks on top of existing store discounts",
      "✅  Save up to 40% at 500+ stores",
      "✅  Exclusive member-only flash deals",
      "✅  Priority customer support",
    ],
  },
  /* 5 – June ─ Summer VIP Upgrade */
  {
    month: "June",
    navSubLabel: "Free 3-month VIP upgrade — $30 value 🌊",
    barBg: "#006994", barEmoji: "🌊", barLabel: "Summer VIP Upgrade:",
    barHighlight: "Join now, get 3 months of VIP free — $30 value",
    barCta: "Upgrade Free",
    heroBadge: "🌊 Summer VIP Club — June Exclusive",
    heroGradient: "linear-gradient(135deg,#003f5e 0%,#0077a8 50%,#00bcd4 100%)",
    heroTitle: "Join Free, Get",
    heroTitleHighlight: "3 Months of VIP Free 🌊",
    heroBody: "Join the International Shoppers Club this June and receive a complimentary 3-month VIP upgrade. VIP members unlock bonus deals, priority support, and exclusive cashback tiers.",
    chips: ["🌊 3-month VIP free ($30 value)", "🎯 Bonus VIP-only deals", "🔓 No credit card to join", "📦 500+ stores", "🚫 Cancel anytime"],
    heroCta: "Join Free — Get 3 Months VIP 🌊",
    heroFine: "VIP upgrade auto-applied for June joiners · No card required",
    benefits: [
      "🌊  Free 3-month VIP upgrade — $30 value",
      "🎯  Bonus VIP-exclusive deal tiers",
      "✅  Save up to 40% at 500+ stores",
      "✅  Exclusive member-only flash deals",
      "✅  Priority customer support",
    ],
  },
  /* 6 – July ─ Mid-Year Spin-to-Win Mystery Discount */
  {
    month: "July",
    navSubLabel: "Spin to win — up to 60% off 🎰",
    barBg: "#b83200", barEmoji: "🎰", barLabel: "Mid-Year Blowout:",
    barHighlight: "Spin the wheel — win up to 60% off your first order",
    barCta: "Spin Now",
    heroBadge: "🎰 Mid-Year Mystery Blowout — July Only",
    heroGradient: "linear-gradient(135deg,#003580 0%,#8b0000 40%,#b83200 100%)",
    heroTitle: "Spin to Win —",
    heroTitleHighlight: "Up to 60% Off Your First Order 🎰",
    heroBody: "July's mystery discount wheel is live! Every new member spins and reveals their personal discount — anywhere from 20% to 60% off their first order. Join free to spin.",
    chips: ["🎰 Spin for 20–60% off", "🎁 Every member wins", "🔓 Free to join & spin", "📦 500+ stores", "🚫 No obligation"],
    heroCta: "Join Free — Spin the Wheel 🎰",
    heroFine: "One spin per new member · Minimum 20% guaranteed · July only",
    benefits: [
      "🎰  Spin the wheel — win 20% to 60% off your 1st order",
      "🎁  Every member wins a guaranteed discount",
      "✅  Save up to 40% at 500+ stores",
      "✅  Exclusive member-only flash deals",
      "✅  Priority customer support",
    ],
  },
  /* 7 – August ─ Back to School 40% Off */
  {
    month: "August",
    navSubLabel: "40% off tech & school supplies 🎒",
    barBg: "#004d1a", barEmoji: "🎒", barLabel: "Back to School:",
    barHighlight: "Members save 40% on tech & school supplies this August",
    barCta: "Shop School Deals",
    heroBadge: "🎒 Back to School — August Members Only",
    heroGradient: "linear-gradient(135deg,#00270d 0%,#004d1a 50%,#003580 100%)",
    heroTitle: "Back to School —",
    heroTitleHighlight: "40% Off Tech & Supplies 🎒",
    heroBody: "August is the biggest back-to-school month. Members get exclusive 40% off on electronics, stationery, and school essentials across 500+ partner stores.",
    chips: ["🎒 40% off tech & school gear", "💻 Laptops, tablets, supplies", "🔓 Free to join", "📦 500+ stores", "🚫 Cancel anytime"],
    heroCta: "Join Free — Save 40% on School Gear 🎒",
    heroFine: "40% discount on eligible school categories · August only",
    benefits: [
      "🎒  40% off tech, school & office supplies",
      "💻  Covers laptops, tablets, stationery & more",
      "✅  Save up to 40% at 500+ stores all year",
      "✅  Exclusive member-only flash deals",
      "✅  Priority customer support",
    ],
  },
  /* 8 – September ─ Fall Deals 24-Hr Preview */
  {
    month: "September",
    navSubLabel: "Preview fall deals 24 hrs early 🍂",
    barBg: "#6b3300", barEmoji: "🍂", barLabel: "Fall Preview:",
    barHighlight: "Members unlock fall deals 24 hours before the public",
    barCta: "Preview Deals",
    heroBadge: "🍂 Fall Deals Preview — September Members",
    heroGradient: "linear-gradient(135deg,#4a1a00 0%,#8b4513 50%,#003580 100%)",
    heroTitle: "First Look at",
    heroTitleHighlight: "Fall's Best Deals 🍂",
    heroBody: "As a member you get a 24-hour head start on all fall promotions before they go public. Grab the best products at the best prices before they sell out.",
    chips: ["🍂 24-hr early fall deal access", "🔔 Priority deal alerts", "🔓 Free to join", "📦 500+ stores", "🚫 Cancel anytime"],
    heroCta: "Join Free — Preview Fall Deals 🍂",
    heroFine: "Early access applies to Fall promotion events · September",
    benefits: [
      "🍂  24-hour early access to all fall promotions",
      "🔔  Priority alerts before deals go public",
      "✅  Save up to 40% at 500+ stores all year",
      "✅  Exclusive member-only flash deals",
      "✅  Priority customer support",
    ],
  },
  /* 9 – October ─ Halloween Mystery Savings */
  {
    month: "October",
    navSubLabel: "Mystery savings — up to 60% off 🎃",
    barBg: "#4a0080", barEmoji: "🎃", barLabel: "Spooky Savings:",
    barHighlight: "Reveal your mystery discount — up to 60% off",
    barCta: "Reveal My Deal",
    heroBadge: "🎃 Spooky Savings Event — October Members",
    heroGradient: "linear-gradient(135deg,#1a0030 0%,#4a0080 40%,#b84800 100%)",
    heroTitle: "Spooky Good Savings —",
    heroTitleHighlight: "Your Discount Is a Mystery 👻",
    heroBody: "Join in October and unbox a mystery savings amount — 20%, 40%, or a jaw-dropping 60% off your first order. You won't know until you join! Everyone wins something.",
    chips: ["🎃 Mystery discount: 20–60% off", "👻 Every member wins", "🔓 Free to join", "📦 500+ stores", "🚫 No tricks, just treats"],
    heroCta: "Join Free — Reveal Your Discount 🎃",
    heroFine: "Mystery discount revealed at sign-up · October members only",
    benefits: [
      "🎃  Mystery discount revealed at join — up to 60% off",
      "👻  Everyone wins — minimum 20% guaranteed",
      "✅  Save up to 40% at 500+ stores all year",
      "✅  Exclusive member-only flash deals",
      "✅  Priority customer support",
    ],
  },
  /* 10 – November ─ Black Friday 48-Hr Early Access */
  {
    month: "November",
    navSubLabel: "Shop Black Friday 48 hrs early 🛒",
    barBg: "#0d0d0d", barEmoji: "🛒", barLabel: "Black Friday Early Access:",
    barHighlight: "Members shop Black Friday 48 hrs before everyone else",
    barCta: "Get Early Access",
    heroBadge: "🛒 Black Friday Early Access — November Members",
    heroGradient: "linear-gradient(135deg,#0d0d0d 0%,#1a0000 40%,#003580 100%)",
    heroTitle: "Beat the Rush —",
    heroTitleHighlight: "Shop Black Friday 48 Hrs Early 🛒",
    heroBody: "Members get exclusive access to all Black Friday deals a full 48 hours before the public. The best products sell out fast — get in before the crowd.",
    chips: ["🛒 48-hr early Black Friday access", "⚡ Best deals before sell-out", "🔓 Free to join", "📦 500+ stores", "🚫 Cancel anytime"],
    heroCta: "Join Free — Shop Black Friday Early 🛒",
    heroFine: "Early access for November members · Black Friday deals only",
    benefits: [
      "🛒  Shop Black Friday deals 48 hours early",
      "⚡  Best items before they sell out",
      "✅  Save up to 40% at 500+ stores all year",
      "✅  Exclusive member-only flash deals",
      "✅  Priority customer support",
    ],
  },
  /* 11 – December ─ Holiday VIP: 50% Off + Free Gift Wrap */
  {
    month: "December",
    navSubLabel: "50% off + free gift wrap 🎄",
    barBg: "#006400", barEmoji: "🎄", barLabel: "Holiday VIP Package:",
    barHighlight: "50% off first $50+ order + free gift wrapping this December",
    barCta: "Unwrap Savings",
    heroBadge: "🎄 Holiday VIP Package — December Exclusive",
    heroGradient: "linear-gradient(135deg,#003580 0%,#006400 50%,#8b0000 100%)",
    heroTitle: "Holiday Savings —",
    heroTitleHighlight: "50% Off + Free Gift Wrapping 🎁",
    heroBody: "Join free this December and receive 50% off your first $50+ order, plus complimentary gift wrapping on every item. Give more, spend less.",
    chips: ["🎄 50% off first $50+ order", "🎁 Free gift wrapping", "🔓 No credit card to join", "📦 500+ stores", "🚫 Cancel anytime"],
    heroCta: "Join Free — Claim Holiday Savings 🎄",
    heroFine: "Holiday offer for new members · 50% off on $50+ · December",
    benefits: [
      "🎄  50% off your first $50+ holiday order",
      "🎁  Free gift wrapping on every item",
      "✅  Save up to 40% at 500+ stores all year",
      "✅  Exclusive member-only flash deals",
      "✅  Priority customer support",
    ],
  },
];

function MembershipWelcomeAd({ onClose, benefits }: { onClose: () => void; benefits: string[] }) {
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
              {benefits.map((b, i) => (
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
  const activeCampaign = MONTHLY_CAMPAIGNS[new Date().getMonth()];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      {showAd && <MembershipWelcomeAd onClose={() => setShowAd(false)} benefits={activeCampaign.benefits} />}

      {/* ── ANNOUNCEMENT BAR ── monthly rotating campaign */}
      <div style={{
        backgroundColor: activeCampaign.barBg,
        color: "#fff",
        textAlign: "center",
        padding: "8px 16px",
        fontSize: "0.88rem",
        fontWeight: 600,
        letterSpacing: "0.01em",
      }}>
        {activeCampaign.barEmoji} <strong>{activeCampaign.barLabel}</strong>&nbsp;
        <span style={{ color: "#ffd700" }}>{activeCampaign.barHighlight}</span>
        &nbsp;·&nbsp;
        <button
          onClick={() => setShowAd(true)}
          style={{
            background: "#ffd700", color: activeCampaign.barBg, border: "none",
            borderRadius: 4, padding: "2px 10px", fontWeight: 800,
            cursor: "pointer", fontSize: "0.85rem",
          }}
        >{activeCampaign.barCta}</button>
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
                {activeCampaign.navSubLabel}
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

      {/* ── HERO MEMBERSHIP BANNER ── monthly rotating campaign */}
      <div style={{
        background: activeCampaign.heroGradient,
        color: "#fff",
        padding: "28px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ margin: "0 0 4px", fontSize: "0.8rem", fontWeight: 600, color: "#ffd700", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {activeCampaign.heroBadge}
          </p>
          <h2 style={{ margin: "0 0 8px", fontSize: "1.5rem", fontWeight: 800, lineHeight: 1.25 }}>
            {activeCampaign.heroTitle}{" "}
            <span style={{ color: "#ffd700" }}>{activeCampaign.heroTitleHighlight}</span>
          </h2>
          <p style={{ margin: "0 0 18px", fontSize: "0.95rem", color: "#cde", lineHeight: 1.5 }}>
            {activeCampaign.heroBody}
          </p>
          {/* Benefit chips */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 20 }}>
            {activeCampaign.chips.map((chip) => (
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
            {activeCampaign.heroCta}
          </button>
          <p style={{ margin: "10px 0 0", fontSize: "0.75rem", color: "#aac" }}>
            {activeCampaign.heroFine}
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
