"use client";
import { useState, useEffect } from "react";

const LS_KEY = "isc_admin_settings";

const MONTHS = ["Auto (calendar month)","January","February","March","April","May","June","July","August","September","October","November","December"];

type Settings = {
  showAnnouncementBar: boolean;
  campaignOverride: string;
  freePlanLabel: string;
  vipPlanLabel: string;
  vipMonthlyPrice: string;
  supportEmail: string;
  siteName: string;
  adminPin: string;
};

const DEFAULTS: Settings = {
  showAnnouncementBar: true,
  campaignOverride: "Auto (calendar month)",
  freePlanLabel: "Free",
  vipPlanLabel: "VIP",
  vipMonthlyPrice: "9.99",
  supportEmail: "support@internationalshoppersclub.com",
  siteName: "International Shoppers Club",
  adminPin: "1234",
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

function save(s: Settings) { localStorage.setItem(LS_KEY, JSON.stringify(s)); }

/* ── Section wrapper ──────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "24px 28px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: 20 }}>
      <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#003580", marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ── Toggle ───────────────────────────────────────────────────── */
function Toggle({ value, onChange, label, description }: { value: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, padding: "4px 0" }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#333" }}>{label}</div>
        {description && <div style={{ fontSize: "0.78rem", color: "#aaa", marginTop: 2 }}>{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: "none",
          background: value ? "#003580" : "#ccc",
          cursor: "pointer",
          position: "relative",
          flexShrink: 0,
          transition: "background 0.2s",
        }}
      >
        <span style={{
          position: "absolute",
          top: 3,
          left: value ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>
  );
}

/* ── Field row ────────────────────────────────────────────────── */
function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, padding: "4px 0" }}>
      <div style={{ minWidth: 180 }}>
        <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#333" }}>{label}</div>
        {description && <div style={{ fontSize: "0.78rem", color: "#aaa", marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{ flex: 1, maxWidth: 320 }}>{children}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  fontSize: "0.86rem",
  border: "1px solid #ddd",
  borderRadius: 7,
  outline: "none",
  boxSizing: "border-box",
};

/* ── Component ───────────────────────────────────────────────── */
export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saved, setSaved]       = useState(false);
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => { setSettings(load()); setLoaded(true); }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings(s => ({ ...s, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    save(settings);
    // If admin PIN changed, keep session alive (PIN applies to next login)
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    if (!confirm("Reset all settings to defaults?")) return;
    setSettings({ ...DEFAULTS });
    save({ ...DEFAULTS });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!loaded) return null;

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#003580", marginBottom: 6 }}>
        Settings
      </h1>
      <p style={{ color: "#666", fontSize: "0.88rem", marginBottom: 24 }}>
        Platform configuration. Changes are saved locally and applied on next page load.
      </p>

      {/* ── Display ── */}
      <Section title="🎨 Display">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Toggle
            value={settings.showAnnouncementBar}
            onChange={v => update("showAnnouncementBar", v)}
            label="Show Announcement Bar"
            description="The colored promo strip at the top of every page"
          />
        </div>
      </Section>

      {/* ── Campaigns ── */}
      <Section title="📅 Campaign Override">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Active Campaign" description="Override auto-rotation and pin a specific campaign">
            <select
              value={settings.campaignOverride}
              onChange={e => update("campaignOverride", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <p style={{ fontSize: "0.78rem", color: "#aaa", margin: 0 }}>
            When set to &quot;Auto (calendar month)&quot; the campaign rotates automatically on the 1st of each month.
          </p>
        </div>
      </Section>

      {/* ── Membership ── */}
      <Section title="💳 Membership Plans">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Free Plan Label">
            <input type="text" value={settings.freePlanLabel} onChange={e => update("freePlanLabel", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="VIP Plan Label">
            <input type="text" value={settings.vipPlanLabel} onChange={e => update("vipPlanLabel", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="VIP Monthly Price ($)" description="Shown on upgrade prompts">
            <input type="number" min="0" step="0.01" value={settings.vipMonthlyPrice} onChange={e => update("vipMonthlyPrice", e.target.value)} style={inputStyle} />
          </Field>
        </div>
      </Section>

      {/* ── Site info ── */}
      <Section title="🌐 Site Information">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Site Name">
            <input type="text" value={settings.siteName} onChange={e => update("siteName", e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Support Email">
            <input type="email" value={settings.supportEmail} onChange={e => update("supportEmail", e.target.value)} style={inputStyle} />
          </Field>
        </div>
      </Section>

      {/* ── Security ── */}
      <Section title="🔐 Security">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Admin PIN" description="4-digit PIN used to access this back office. Applies on next login.">
            <input
              type="password"
              inputMode="numeric"
              maxLength={20}
              value={settings.adminPin}
              onChange={e => update("adminPin", e.target.value)}
              style={{ ...inputStyle, letterSpacing: "0.25em" }}
              placeholder="Enter new PIN"
            />
          </Field>
          <p style={{ fontSize: "0.75rem", color: "#f0a030", margin: 0 }}>
            ⚠️ This is client-side only. For production, replace with server-side authentication.
          </p>
        </div>
      </Section>

      {/* ── Save bar ── */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: "12px",
            background: "#003580",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          {saved ? "✅ Settings Saved!" : "Save Settings"}
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: "12px 20px",
            background: "#fff",
            color: "#888",
            border: "1px solid #ddd",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          Reset Defaults
        </button>
      </div>
    </div>
  );
}
