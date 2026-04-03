"use client";
import { useState, useEffect } from "react";

/* ── Types ──────────────────────────────────────────────────── */
type ContractStatus = "Not Sent" | "Pending" | "Signed";

type LibraryDoc = {
  id: string;
  title: string;
  version: string;
  effectiveDate: string;
  body: string;
};

/* ── Mock member data (mirrors Members page) ─────────────────── */
const CAMPAIGNS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const FIRST_NAMES = ["Alice","Bob","Carol","David","Elena","Frank","Grace","Hiro","Isabel","James","Karen","Liam","Mia","Noah","Olivia","Paul","Quinn","Rosa","Sam","Tina","Uma","Victor","Wendy","Xavier","Yara","Zoe"];
const LAST_NAMES  = ["Smith","Jones","Williams","Brown","Taylor","Davies","Evans","Wilson","Thomas","Roberts","Johnson","Lewis","Walker","Robinson","White","Thompson","Harris","Martin","Garcia","Martinez"];

function pick<T>(arr: T[], seed: number): T { return arr[Math.abs(seed) % arr.length]; }
function fakeDate(i: number): string {
  const d = new Date(2025, Math.floor(i / 8) % 12, (i % 28) + 1);
  return d.toISOString().slice(0, 10);
}

const MOCK_MEMBERS = Array.from({ length: 60 }, (_, i) => {
  const name = `${pick(FIRST_NAMES, i * 7 + 3)} ${pick(LAST_NAMES, i * 13 + 1)}`;
  return {
    id: i + 1,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    joinDate: fakeDate(i),
    plan: (i % 5 === 0 ? "VIP" : "Free") as "VIP" | "Free",
    campaign: pick(CAMPAIGNS, i * 3 + 2),
  };
});

/* ── Default contract template ───────────────────────────────── */
const DEFAULT_TEMPLATE = `MEMBERSHIP AGREEMENT
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
   This Agreement is governed by the laws of the State of Delaware, USA.

By signing below, the Member acknowledges that they have read, understood, and
agree to be bound by the terms of this Agreement.

Member Name:   [MEMBER_NAME]
Date Signed:   [JOIN_DATE]
Member Email:  ___________________________

ISC Representative: _____________________
Title:              _____________________
Date:               _____________________`;

/* ── Default library documents ───────────────────────────────── */
const DEFAULT_LIBRARY_DOCS: LibraryDoc[] = [
  {
    id: "membership-agreement",
    title: "Membership Agreement",
    version: "2.0",
    effectiveDate: "2026-01-01",
    body: DEFAULT_TEMPLATE,
  },
  {
    id: "nda",
    title: "Non-Disclosure Agreement",
    version: "1.2",
    effectiveDate: "2026-01-01",
    body: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("NDA") is entered into between International Shoppers Club ("ISC") and the undersigned party ("Recipient").

1. CONFIDENTIAL INFORMATION
   "Confidential Information" means any non-public information disclosed by ISC, including but not limited to business strategies, member data, pricing models, marketing plans, and technical systems.

2. OBLIGATIONS
   The Recipient agrees to:
   (a) Hold all Confidential Information in strict confidence;
   (b) Not disclose Confidential Information to any third party;
   (c) Use Confidential Information solely for the purpose authorised by ISC.

3. EXCLUSIONS
   Obligations do not apply to information that is publicly available, independently developed, or required to be disclosed by law.

4. TERM
   This NDA remains in effect for five (5) years from the date of signing.

5. REMEDIES
   A breach of this NDA may cause irreparable harm. ISC is entitled to seek injunctive relief in addition to all other remedies.

Signed: _________________________ Date: _____________`,
  },
  {
    id: "affiliate-agreement",
    title: "Affiliate / Referral Agreement",
    version: "1.0",
    effectiveDate: "2026-01-01",
    body: `AFFILIATE & REFERRAL AGREEMENT

This Affiliate Agreement is between International Shoppers Club ("ISC") and the Affiliate named below.

1. PROGRAM OVERVIEW
   The ISC Affiliate Program allows approved affiliates to earn commissions by referring new members to ISC.

2. COMMISSION STRUCTURE
   Affiliates earn $3.00 USD for each new Free member and $9.99 USD for each new VIP member successfully referred and verified.

3. PAYMENT
   Commissions are paid monthly via the affiliate's nominated payout method, subject to a minimum payout threshold of $10.00.

4. PROHIBITED PRACTICES
   Affiliates may not use spam, misleading advertising, cookie stuffing, or any deceptive practice. Violations result in immediate termination and forfeiture of unpaid commissions.

5. INTELLECTUAL PROPERTY
   Affiliates may use ISC-provided marketing materials only. No modifications to ISC branding are permitted without written approval.

6. TERMINATION
   Either party may terminate this Agreement with 14 days written notice.

Affiliate Name:   ___________________________
Affiliate Email:  ___________________________
Date:             ___________________________`,
  },
  {
    id: "refund-policy",
    title: "Refund Policy",
    version: "1.1",
    effectiveDate: "2026-01-01",
    body: `REFUND POLICY
International Shoppers Club

Effective Date: January 1, 2026

1. FREE MEMBERSHIPS
   There are no charges associated with Free memberships; therefore no refunds are applicable.

2. VIP MEMBERSHIPS
   VIP membership fees are non-refundable for the current billing period. You may cancel at any time to prevent future charges. Cancellation takes effect at the end of the current billing cycle.

3. FIRST-MONTH GUARANTEE
   New VIP members who are not satisfied within the first 7 days of their initial subscription may request a full refund by contacting support@internationalshoppersclub.com.

4. PROMOTIONAL CREDITS
   Promotional credits, discounts, and referral bonuses have no cash value and are non-refundable.

5. HOW TO REQUEST A REFUND
   Email support@internationalshoppersclub.com with your name, email address, membership ID, and the reason for your refund request. We will respond within 3 business days.

6. EXCEPTIONS
   Refunds may be granted at ISC's sole discretion for extenuating circumstances.`,
  },
];

/* ── localStorage helpers ─────────────────────────────────────── */
const LS_STATUSES = "isc_contract_statuses";
const LS_TEMPLATE = "isc_contract_template";
const LS_LIBRARY  = "isc_library_docs";

function loadStatuses(): Record<number, ContractStatus> {
  try { const r = localStorage.getItem(LS_STATUSES); if (r) return JSON.parse(r); } catch { /* ignore */ }
  return {};
}
function saveStatuses(s: Record<number, ContractStatus>) { localStorage.setItem(LS_STATUSES, JSON.stringify(s)); }

function loadTemplate(): string {
  try { const r = localStorage.getItem(LS_TEMPLATE); if (r) return r; } catch { /* ignore */ }
  return DEFAULT_TEMPLATE;
}
function saveTemplate(t: string) { localStorage.setItem(LS_TEMPLATE, t); }

function loadLibrary(): LibraryDoc[] {
  try { const r = localStorage.getItem(LS_LIBRARY); if (r) return JSON.parse(r) as LibraryDoc[]; } catch { /* ignore */ }
  return DEFAULT_LIBRARY_DOCS.map(d => ({ ...d }));
}
function saveLibrary(docs: LibraryDoc[]) { localStorage.setItem(LS_LIBRARY, JSON.stringify(docs)); }

/* ── Print helper ─────────────────────────────────────────────── */
function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function printText(title: string, body: string) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(
    `<html><head><title>${escapeHtml(title)}</title><style>body{font-family:Georgia,serif;font-size:13px;line-height:1.7;padding:48px 64px;max-width:760px;margin:auto;color:#111}pre{white-space:pre-wrap;font-family:inherit}h1{font-size:18px;text-align:center;margin-bottom:28px}@media print{body{padding:20px}}</style></head>` +
    `<body><pre>${escapeHtml(body)}</pre><script>window.onload=()=>{window.print();}<\/script></body></html>`
  );
  win.document.close();
}

/* ── Contract status badge ───────────────────────────────────── */
function ContractBadge({ status }: { status: ContractStatus }) {
  const cfg: Record<ContractStatus, { bg: string; color: string; icon: string }> = {
    "Signed":   { bg: "#e8f5e9", color: "#2e7d32", icon: "✅" },
    "Pending":  { bg: "#fff3e0", color: "#e65100", icon: "⏳" },
    "Not Sent": { bg: "#f5f5f5", color: "#888",    icon: "—"  },
  };
  const c = cfg[status];
  return (
    <span style={{ background: c.bg, color: c.color, padding: "3px 10px", borderRadius: 20, fontSize: "0.74rem", fontWeight: 700 }}>
      {c.icon} {status}
    </span>
  );
}

/* ── Tab button ───────────────────────────────────────────────── */
function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 22px",
        border: "none",
        borderBottom: active ? "3px solid #003580" : "3px solid transparent",
        background: "none",
        fontWeight: active ? 700 : 500,
        color: active ? "#003580" : "#888",
        fontSize: "0.9rem",
        cursor: "pointer",
        transition: "color 0.15s",
      }}
    >
      {children}
    </button>
  );
}

/* ── Input style ──────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", fontSize: "0.86rem",
  border: "1px solid #ddd", borderRadius: 7, outline: "none", boxSizing: "border-box",
};

/* ── Component ────────────────────────────────────────────────── */
export default function DocumentsPage() {
  const [tab, setTab]               = useState<"contracts" | "library">("contracts");
  const [statuses, setStatuses]     = useState<Record<number, ContractStatus>>({});
  const [template, setTemplate]     = useState(DEFAULT_TEMPLATE);
  const [templateDraft, setTemplateDraft] = useState(DEFAULT_TEMPLATE);
  const [templateEditing, setTemplateEditing] = useState(false);
  const [templateSaved, setTemplateSaved]     = useState(false);
  const [libDocs, setLibDocs]       = useState<LibraryDoc[]>(DEFAULT_LIBRARY_DOCS.map(d => ({ ...d })));
  const [editingDoc, setEditingDoc] = useState<LibraryDoc | null>(null);
  const [previewMember, setPreviewMember] = useState<typeof MOCK_MEMBERS[0] | null>(null);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "All">("All");
  const [loaded, setLoaded]         = useState(false);

  useEffect(() => {
    setStatuses(loadStatuses());
    const t = loadTemplate();
    setTemplate(t);
    setTemplateDraft(t);
    setLibDocs(loadLibrary());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  /* ── helpers ── */
  function getStatus(id: number): ContractStatus {
    return statuses[id] ?? "Not Sent";
  }

  function updateStatus(id: number, status: ContractStatus) {
    const next = { ...statuses, [id]: status };
    setStatuses(next);
    saveStatuses(next);
  }

  function saveTemplateHandler() {
    setTemplate(templateDraft);
    saveTemplate(templateDraft);
    // also update the membership-agreement library doc
    const nextDocs = libDocs.map(d =>
      d.id === "membership-agreement" ? { ...d, body: templateDraft } : d
    );
    setLibDocs(nextDocs);
    saveLibrary(nextDocs);
    setTemplateEditing(false);
    setTemplateSaved(true);
    setTimeout(() => setTemplateSaved(false), 2500);
  }

  function stampContract(member: typeof MOCK_MEMBERS[0]): string {
    return template
      .replace(/\[MEMBER_NAME\]/g, member.name)
      .replace(/\[JOIN_DATE\]/g, member.joinDate);
  }

  /* ── filtered members ── */
  const filteredMembers = MOCK_MEMBERS.filter(m => {
    const q = search.toLowerCase();
    if (q && !m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
    if (statusFilter !== "All" && getStatus(m.id) !== statusFilter) return false;
    return true;
  });

  const statusCounts: Record<ContractStatus, number> = {
    "Signed":   MOCK_MEMBERS.filter(m => getStatus(m.id) === "Signed").length,
    "Pending":  MOCK_MEMBERS.filter(m => getStatus(m.id) === "Pending").length,
    "Not Sent": MOCK_MEMBERS.filter(m => getStatus(m.id) === "Not Sent").length,
  };

  /* ── library doc save ── */
  function saveDoc() {
    if (!editingDoc) return;
    const nextDocs = libDocs.map(d => d.id === editingDoc.id ? editingDoc : d);
    setLibDocs(nextDocs);
    saveLibrary(nextDocs);
    // if editing membership agreement, sync contract template
    if (editingDoc.id === "membership-agreement") {
      setTemplate(editingDoc.body);
      setTemplateDraft(editingDoc.body);
      saveTemplate(editingDoc.body);
    }
    setEditingDoc(null);
  }

  /* ── send all not-sent ── */
  function markAllPending() {
    const next = { ...statuses };
    MOCK_MEMBERS.forEach(m => {
      if ((next[m.id] ?? "Not Sent") === "Not Sent") next[m.id] = "Pending";
    });
    setStatuses(next);
    saveStatuses(next);
  }

  return (
    <div style={{ maxWidth: 940 }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#003580", marginBottom: 4 }}>
        Documents &amp; Contracts
      </h1>
      <p style={{ color: "#666", fontSize: "0.88rem", marginBottom: 20 }}>
        Manage member contracts and the legal documents library.
      </p>

      {/* ── Tabs ── */}
      <div style={{ borderBottom: "1px solid #e8e8e8", marginBottom: 24, display: "flex", gap: 0 }}>
        <Tab active={tab === "contracts"} onClick={() => setTab("contracts")}>📋 Member Contracts</Tab>
        <Tab active={tab === "library"}   onClick={() => setTab("library")}>📚 Documents Library</Tab>
      </div>

      {/* ══════════════════════ CONTRACTS TAB ══════════════════════ */}
      {tab === "contracts" && (
        <div>
          {/* ── KPI strip ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
            {(["Signed","Pending","Not Sent"] as ContractStatus[]).map(s => {
              const colors: Record<ContractStatus, string> = { Signed: "#2e7d32", Pending: "#e65100", "Not Sent": "#888" };
              return (
                <div key={s} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", borderTop: `4px solid ${colors[s]}` }}>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: colors[s] }}>{statusCounts[s]}</div>
                  <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 2 }}>{s}</div>
                </div>
              );
            })}
          </div>

          {/* ── Template editor ── */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "22px 26px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#003580", margin: 0 }}>Contract Template</h2>
                <p style={{ fontSize: "0.78rem", color: "#aaa", margin: "3px 0 0" }}>
                  Use <code>[MEMBER_NAME]</code> and <code>[JOIN_DATE]</code> as placeholders — they are replaced per member.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {!templateEditing ? (
                  <button onClick={() => setTemplateEditing(true)} style={btnOutline}>✏️ Edit Template</button>
                ) : (
                  <>
                    <button onClick={() => { setTemplateDraft(template); setTemplateEditing(false); }} style={btnOutline}>Cancel</button>
                    <button onClick={saveTemplateHandler} style={btnPrimary}>
                      {templateSaved ? "✅ Saved!" : "Save Template"}
                    </button>
                  </>
                )}
              </div>
            </div>
            {templateEditing ? (
              <textarea
                value={templateDraft}
                onChange={e => setTemplateDraft(e.target.value)}
                rows={14}
                style={{ ...inputStyle, fontFamily: "monospace", fontSize: "0.82rem", resize: "vertical" }}
              />
            ) : (
              <pre style={{ margin: 0, padding: "14px 16px", background: "#f8f9fc", borderRadius: 8, fontSize: "0.78rem", color: "#444", whiteSpace: "pre-wrap", maxHeight: 220, overflow: "auto" }}>
                {template}
              </pre>
            )}
          </div>

          {/* ── Filters & actions ── */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="search"
              placeholder="Search name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: "1 1 200px", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 7, fontSize: "0.85rem", outline: "none" }}
            />
            {(["All","Signed","Pending","Not Sent"] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: "8px 14px", borderRadius: 7, border: "1px solid #ddd",
                background: statusFilter === s ? "#003580" : "#fff",
                color: statusFilter === s ? "#fff" : "#555",
                fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
              }}>{s}</button>
            ))}
            <button onClick={markAllPending} style={{ ...btnOutline, marginLeft: "auto" }}>📤 Mark All Not-Sent → Pending</button>
          </div>

          {/* ── Members table ── */}
          <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
              <thead>
                <tr style={{ background: "#f8f9fc" }}>
                  {["Name","Email","Joined","Plan","Contract Status","Actions"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: "#555", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #eee" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.slice(0, 30).map(m => (
                  <tr key={m.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                    <td style={{ padding: "9px 14px", fontWeight: 600 }}>{m.name}</td>
                    <td style={{ padding: "9px 14px", color: "#666" }}>{m.email}</td>
                    <td style={{ padding: "9px 14px", color: "#888" }}>{m.joinDate}</td>
                    <td style={{ padding: "9px 14px" }}>
                      <span style={{ background: m.plan === "VIP" ? "#fff3e0" : "#f5f5f5", color: m.plan === "VIP" ? "#e65100" : "#888", padding: "3px 10px", borderRadius: 20, fontSize: "0.74rem", fontWeight: 700 }}>
                        {m.plan === "VIP" ? "🥇 VIP" : "Free"}
                      </span>
                    </td>
                    <td style={{ padding: "9px 14px" }}>
                      <ContractBadge status={getStatus(m.id)} />
                    </td>
                    <td style={{ padding: "9px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <select
                          value={getStatus(m.id)}
                          onChange={e => updateStatus(m.id, e.target.value as ContractStatus)}
                          style={{ padding: "4px 8px", fontSize: "0.78rem", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", outline: "none" }}
                        >
                          <option>Not Sent</option>
                          <option>Pending</option>
                          <option>Signed</option>
                        </select>
                        <button
                          onClick={() => setPreviewMember(m)}
                          style={{ padding: "4px 10px", fontSize: "0.78rem", background: "#003580", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 28, textAlign: "center", color: "#bbb" }}>No members match your filters.</td></tr>
                )}
              </tbody>
            </table>
            {filteredMembers.length > 30 && (
              <div style={{ padding: "10px 14px", fontSize: "0.78rem", color: "#aaa", borderTop: "1px solid #f0f0f0" }}>
                Showing first 30 of {filteredMembers.length} results. Use the search filter to narrow down.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════ LIBRARY TAB ══════════════════════ */}
      {tab === "library" && (
        <div>
          <p style={{ color: "#888", fontSize: "0.84rem", marginBottom: 18 }}>
            Manage your organisation&apos;s legal and operational documents. Edit body text, version numbers, and print/download as PDF.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {libDocs.map(doc => (
              <div key={doc.id} style={{ background: "#fff", borderRadius: 12, padding: "22px 26px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "#003580" }}>{doc.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#aaa", marginTop: 3 }}>
                      Version {doc.version} &nbsp;·&nbsp; Effective {doc.effectiveDate}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => printText(doc.title, doc.body)} style={btnOutline}>🖨️ Print / Save PDF</button>
                    <button onClick={() => setEditingDoc({ ...doc })} style={btnPrimary}>✏️ Edit</button>
                  </div>
                </div>
                <pre style={{ margin: 0, padding: "12px 14px", background: "#f8f9fc", borderRadius: 8, fontSize: "0.76rem", color: "#555", whiteSpace: "pre-wrap", maxHeight: 120, overflow: "auto" }}>
                  {doc.body.slice(0, 400)}{doc.body.length > 400 ? "…" : ""}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════ CONTRACT PREVIEW MODAL ══════════════════════ */}
      {previewMember && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) setPreviewMember(null); }}
        >
          <div style={{ background: "#fff", borderRadius: 14, padding: "28px 32px", maxWidth: 680, width: "90%", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#003580" }}>Contract — {previewMember.name}</div>
                <div style={{ fontSize: "0.78rem", color: "#aaa", marginTop: 2 }}>Joined {previewMember.joinDate}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => printText(`Contract — ${previewMember.name}`, stampContract(previewMember))} style={btnPrimary}>🖨️ Print / Save PDF</button>
                <button onClick={() => setPreviewMember(null)} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#bbb" }}>✕</button>
              </div>
            </div>
            <pre style={{ flex: 1, overflow: "auto", fontSize: "0.78rem", lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#333", margin: 0, padding: "16px", background: "#f8f9fc", borderRadius: 8 }}>
              {stampContract(previewMember)}
            </pre>
          </div>
        </div>
      )}

      {/* ══════════════════════ LIBRARY EDIT MODAL ══════════════════════ */}
      {editingDoc && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) setEditingDoc(null); }}
        >
          <div style={{ background: "#fff", borderRadius: 14, padding: "28px 32px", maxWidth: 740, width: "95%", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#003580" }}>Edit Document</div>
              <button onClick={() => setEditingDoc(null)} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#bbb" }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input value={editingDoc.title} onChange={e => setEditingDoc(d => d && ({ ...d, title: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Version</label>
                <input value={editingDoc.version} onChange={e => setEditingDoc(d => d && ({ ...d, version: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Effective Date</label>
                <input type="date" value={editingDoc.effectiveDate} onChange={e => setEditingDoc(d => d && ({ ...d, effectiveDate: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <label style={{ ...labelStyle, marginBottom: 6 }}>Document Body</label>
            <textarea
              value={editingDoc.body}
              onChange={e => setEditingDoc(d => d && ({ ...d, body: e.target.value }))}
              rows={16}
              style={{ ...inputStyle, fontFamily: "monospace", fontSize: "0.8rem", resize: "vertical", flex: 1 }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
              <button onClick={() => setEditingDoc(null)} style={btnOutline}>Cancel</button>
              <button onClick={saveDoc} style={btnPrimary}>Save Document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared button styles ─────────────────────────────────────── */
const btnPrimary: React.CSSProperties = {
  padding: "8px 16px", background: "#003580", color: "#fff",
  border: "none", borderRadius: 7, fontWeight: 700, fontSize: "0.84rem", cursor: "pointer",
};
const btnOutline: React.CSSProperties = {
  padding: "8px 16px", background: "#fff", color: "#555",
  border: "1px solid #ddd", borderRadius: 7, fontWeight: 600, fontSize: "0.84rem", cursor: "pointer",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#555", marginBottom: 4,
};
