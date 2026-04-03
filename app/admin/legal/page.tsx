"use client";
import { useState, useEffect } from "react";

/* ─── Types ─────────────────────────────────────────────────── */
type Policy = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  updatedAt: string;
};

/* ─── Default policy text ────────────────────────────────────── */
const DEFAULT_NATIONAL: Policy[] = [
  {
    id: "tos",
    title: "Terms of Service",
    subtitle: "Governs use of International Shoppers Club (United States)",
    updatedAt: "2026-01-01",
    body: `TERMS OF SERVICE – International Shoppers Club

Effective Date: January 1, 2026

1. ACCEPTANCE OF TERMS
By accessing or using the International Shoppers Club ("ISC") platform, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use this service.

2. ELIGIBILITY
You must be at least 18 years old and a resident of the United States to subscribe to a paid plan.

3. MEMBERSHIP PLANS
ISC offers a Free plan and a VIP membership plan. VIP members pay a monthly subscription fee as stated on the pricing page. Fees are billed in advance and are non-refundable except as required by applicable law.

4. DEAL REFERRALS & AFFILIATE DISCLOSURE
ISC may earn commissions from purchases made through links provided on our platform. All affiliate relationships are disclosed in accordance with FTC guidelines (16 C.F.R. Part 255).

5. PROHIBITED CONDUCT
You agree not to: (a) violate any applicable law; (b) share your account credentials; (c) reproduce or redistribute ISC content without permission; (d) use automated tools to scrape or harvest data.

6. INTELLECTUAL PROPERTY
All content on ISC is owned by or licensed to ISC. You are granted a limited, non-exclusive license to access and use the platform for personal, non-commercial purposes.

7. DISCLAIMER OF WARRANTIES
THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.

8. LIMITATION OF LIABILITY
TO THE FULLEST EXTENT PERMITTED BY LAW, ISC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.

9. GOVERNING LAW
These Terms are governed by the laws of the State of [Your State], United States.

10. CONTACT
Questions? Email: legal@internationalshoppersclub.com`,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    subtitle: "How ISC collects, uses, and protects your data (United States)",
    updatedAt: "2026-01-01",
    body: `PRIVACY POLICY – International Shoppers Club

Effective Date: January 1, 2026

1. INFORMATION WE COLLECT
We collect: (a) Registration data (name, email, billing info); (b) Usage data (pages visited, clicks, deal interactions); (c) Device & browser data; (d) Cookies and tracking pixels.

2. HOW WE USE YOUR INFORMATION
We use your data to: provide and improve the service; process payments; send transactional and promotional emails; comply with legal obligations.

3. DATA SHARING
We do not sell your personal information. We may share data with: payment processors; email marketing platforms; analytics providers; and as required by law.

4. CALIFORNIA CONSUMER PRIVACY ACT (CCPA)
California residents have the right to: know what personal information is collected; delete personal information; opt out of the sale of personal information (we do not sell data); non-discrimination for exercising CCPA rights.
To submit a request, email: privacy@internationalshoppersclub.com

5. CAN-SPAM COMPLIANCE
All commercial emails sent by ISC include: a clear subject line; our physical mailing address; an easy opt-out mechanism. We honor opt-out requests within 10 business days.

6. DATA RETENTION
We retain personal data for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements.

7. SECURITY
We use industry-standard encryption (TLS) and access controls to protect your data. No method of transmission is 100% secure.

8. CONTACT
privacy@internationalshoppersclub.com`,
  },
  {
    id: "ftc",
    title: "FTC Affiliate Disclosure",
    subtitle: "Required disclosure under 16 C.F.R. Part 255",
    updatedAt: "2026-01-01",
    body: `FTC AFFILIATE DISCLOSURE – International Shoppers Club

In accordance with the Federal Trade Commission's guidelines concerning the use of endorsements and testimonials in advertising (16 C.F.R. Part 255), International Shoppers Club discloses the following:

MATERIAL CONNECTIONS
Some links and deals featured on ISC are affiliate links. This means ISC may earn a commission if you click on a link and make a qualifying purchase, at no additional cost to you.

PARTNER RELATIONSHIPS
ISC has affiliate relationships with online retailers including but not limited to Amazon, eBay, Walmart, Target, and others. These relationships help fund the platform and keep the VIP subscription price low.

HONEST REVIEWS
ISC only promotes deals that are verified and considered genuinely valuable. Affiliate commissions do not influence our editorial independence.

QUESTIONS
For questions about our affiliate relationships, contact: legal@internationalshoppersclub.com`,
  },
  {
    id: "canspam",
    title: "CAN-SPAM & Email Policy",
    subtitle: "Compliance with the CAN-SPAM Act of 2003",
    updatedAt: "2026-01-01",
    body: `CAN-SPAM COMPLIANCE POLICY – International Shoppers Club

International Shoppers Club complies fully with the CAN-SPAM Act of 2003 (15 U.S.C. § 7701 et seq.).

OUR COMMITMENTS
1. We do not use false or misleading header information.
2. We do not use deceptive subject lines.
3. We identify all commercial messages as advertisements where required.
4. We include our valid physical postal address in every commercial email.
5. We provide a clear and conspicuous opt-out mechanism in every email.
6. We honor opt-out requests promptly (within 10 business days).
7. We monitor what third-party mailers do on our behalf.

OPT-OUT
To unsubscribe from ISC marketing emails, click the "Unsubscribe" link at the bottom of any email, or email: unsubscribe@internationalshoppersclub.com

PHYSICAL ADDRESS
International Shoppers Club
[Company Address]
[City, State, ZIP]`,
  },
];

const DEFAULT_INTERNATIONAL: Policy[] = [
  {
    id: "gdpr",
    title: "GDPR Compliance Policy",
    subtitle: "General Data Protection Regulation – European Union (EU) 2016/679",
    updatedAt: "2026-01-01",
    body: `GDPR COMPLIANCE POLICY – International Shoppers Club

Effective Date: January 1, 2026

1. DATA CONTROLLER
International Shoppers Club acts as the Data Controller for personal data processed on this platform. Contact: dpo@internationalshoppersclub.com

2. LAWFUL BASIS FOR PROCESSING
We process personal data under the following lawful bases:
- Contractual necessity (account creation, billing)
- Legitimate interests (platform analytics, fraud prevention)
- Consent (marketing emails)
- Legal obligation (tax, compliance records)

3. YOUR RIGHTS UNDER GDPR
EU/EEA residents have the right to:
- Access their personal data (Art. 15)
- Rectify inaccurate data (Art. 16)
- Erasure ("right to be forgotten") (Art. 17)
- Restrict processing (Art. 18)
- Data portability (Art. 20)
- Object to processing (Art. 21)
- Not be subject to solely automated decision-making (Art. 22)

To exercise any right, email: dpo@internationalshoppersclub.com. We respond within 30 days.

4. DATA TRANSFERS
Where personal data is transferred outside the EEA, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission to ensure adequate protection.

5. DATA RETENTION
Personal data is retained only as long as necessary for the stated purpose or as required by law. Upon account deletion, data is purged within 30 days except where retention is legally required.

6. COOKIES
We use cookies for session management and analytics. A cookie consent banner is displayed to EU visitors. Cookies can be managed through your browser settings.

7. SUPERVISORY AUTHORITY
You have the right to lodge a complaint with your local Data Protection Authority (DPA).

8. DATA PROTECTION OFFICER
DPO: dpo@internationalshoppersclub.com`,
  },
  {
    id: "casl",
    title: "CASL Compliance Policy",
    subtitle: "Canada's Anti-Spam Legislation (S.C. 2010, c. 23)",
    updatedAt: "2026-01-01",
    body: `CASL COMPLIANCE POLICY – International Shoppers Club

Canada's Anti-Spam Legislation (CASL) applies to all commercial electronic messages (CEMs) sent to or from Canadian residents.

CONSENT
We send commercial emails to Canadian subscribers only with:
- Express consent (opt-in at signup), or
- Implied consent (existing business relationship within the last 2 years)

MESSAGE REQUIREMENTS
Every CEM sent to Canadian recipients includes:
1. Clear identification of ISC as the sender
2. Our mailing address and contact information
3. A functioning unsubscribe mechanism
4. We process unsubscribe requests within 10 business days

RECORDS OF CONSENT
ISC maintains records of consent for Canadian subscribers including: date, method, and scope of consent obtained.

PENALTIES
Non-compliance with CASL can result in penalties up to $10 million CAD per violation. ISC takes CASL compliance seriously.

CONTACT FOR CANADIAN PRIVACY MATTERS
privacy@internationalshoppersclub.com`,
  },
  {
    id: "pecr",
    title: "PECR / UK GDPR Policy",
    subtitle: "Privacy and Electronic Communications Regulations (UK) & UK GDPR",
    updatedAt: "2026-01-01",
    body: `UK PRIVACY & ELECTRONIC COMMUNICATIONS POLICY – International Shoppers Club

This policy covers ISC's compliance with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations 2003 (PECR).

UK DATA RIGHTS
UK residents have the same rights as EU residents under UK GDPR, including rights of access, rectification, erasure, portability, and objection.

ELECTRONIC MARKETING (PECR)
Under PECR, ISC will only send marketing emails to UK individuals with prior consent. Unsubscribe links are included in all marketing communications.

ICO REGISTRATION
ISC is registered with the Information Commissioner's Office (ICO) as required under the Data Protection Act 2018. Registration number: [ICO Registration Number]

COOKIES (PECR)
ISC's cookie banner complies with PECR requirements for UK visitors, requiring opt-in consent for non-essential cookies.

SUPERVISORY AUTHORITY
UK residents may raise complaints with: Information Commissioner's Office (ICO) — https://ico.org.uk

CONTACT
For UK data rights requests: privacy@internationalshoppersclub.com`,
  },
  {
    id: "intl-antispam",
    title: "International Anti-Spam Overview",
    subtitle: "Global email marketing compliance summary",
    updatedAt: "2026-01-01",
    body: `INTERNATIONAL ANTI-SPAM COMPLIANCE OVERVIEW – International Shoppers Club

ISC is committed to complying with anti-spam laws in all jurisdictions where we operate.

AUSTRALIA – Spam Act 2003
- Consent required before sending commercial messages
- Clear identification of sender required
- Functional unsubscribe mechanism required
- Unsubscribes honored within 5 business days

EUROPEAN UNION – GDPR + ePrivacy Directive
- Opt-in consent required for marketing emails
- Double opt-in recommended best practice
- Right to withdraw consent at any time

CANADA – CASL
- Express or implied consent required
- 10-business-day unsubscribe processing window

UNITED KINGDOM – PECR + UK GDPR
- Opt-in consent for marketing to individuals
- Soft opt-in allowed for existing customers

JAPAN – Act on Regulation of Transmission of Specified Electronic Mail
- Consent required; opt-out must be honored within 30 days

BRAZIL – LGPD (Lei Geral de Proteção de Dados)
- Consent or legitimate interest basis required
- Data subject rights similar to GDPR apply

GENERAL BEST PRACTICES
1. Always obtain clear, documented consent before adding someone to a mailing list.
2. Never purchase email lists.
3. Provide an easy, always-working unsubscribe link.
4. Honor opt-outs promptly.
5. Keep records of consent.
6. Review this policy at least annually.

CONTACT
legal@internationalshoppersclub.com`,
  },
];

/* ─── localStorage helpers ───────────────────────────────────── */
const LS_KEY = "isc_legal_v1";

function loadPolicies(): { national: Policy[]; international: Policy[] } {
  if (typeof window === "undefined") return { national: DEFAULT_NATIONAL, international: DEFAULT_INTERNATIONAL };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  const init = { national: DEFAULT_NATIONAL, international: DEFAULT_INTERNATIONAL };
  localStorage.setItem(LS_KEY, JSON.stringify(init));
  return init;
}

function savePolicies(data: { national: Policy[]; international: Policy[] }) {
  if (typeof window !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(data));
}

/* ─── Helpers ────────────────────────────────────────────────── */
const ACCENT = "#003580";
const card: React.CSSProperties = {
  background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

function copyText(text: string, setCopied: (id: string) => void, id: string) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(id);
    setTimeout(() => setCopied(""), 1800);
  });
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ─── Policy Card ────────────────────────────────────────────── */
function PolicyCard({
  policy,
  onUpdate,
}: {
  policy: Policy;
  onUpdate: (updated: Policy) => void;
}) {
  const [editing, setEditing]   = useState(false);
  const [draft,   setDraft]     = useState(policy.body);
  const [copied,  setCopied]    = useState("");

  const save = () => {
    onUpdate({ ...policy, body: draft, updatedAt: new Date().toISOString().slice(0, 10) });
    setEditing(false);
  };

  const cancel = () => { setDraft(policy.body); setEditing(false); };

  return (
    <div style={{ ...card, marginBottom: 20, overflow: "visible" }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px 14px",
        borderBottom: "1px solid #f0f0f0",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: ACCENT }}>{policy.title}</div>
          <div style={{ fontSize: "0.8rem", color: "#666", marginTop: 2 }}>{policy.subtitle}</div>
          <div style={{ fontSize: "0.75rem", color: "#999", marginTop: 3 }}>Last updated: {policy.updatedAt}</div>
        </div>
        <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
          <button
            onClick={() => copyText(policy.body, setCopied, policy.id)}
            style={{ padding: "5px 12px", background: copied === policy.id ? "#68d391" : "#f0f0f0", color: copied === policy.id ? "#fff" : "#444", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}
          >{copied === policy.id ? "✓ Copied" : "📋 Copy"}</button>
          <button
            onClick={() => downloadText(`${policy.id}.txt`, policy.body)}
            style={{ padding: "5px 12px", background: "#f0f0f0", color: "#444", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}
          >⬇ Download</button>
          {!editing && (
            <button
              onClick={() => { setDraft(policy.body); setEditing(true); }}
              style={{ padding: "5px 12px", background: ACCENT, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}
            >✏️ Edit</button>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 20px" }}>
        {editing ? (
          <>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              style={{
                width: "100%", height: 320, resize: "vertical", fontFamily: "monospace",
                fontSize: "0.82rem", lineHeight: 1.65, padding: "10px 12px",
                border: "1px solid #ccc", borderRadius: 6, boxSizing: "border-box",
                background: "#fafafa",
              }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={save}   style={{ padding: "7px 18px", background: ACCENT, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: "0.85rem" }}>💾 Save</button>
              <button onClick={cancel} style={{ padding: "7px 14px", background: "#f0f0f0", color: "#444", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}>Cancel</button>
            </div>
          </>
        ) : (
          <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.65, color: "#333", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {policy.body}
          </pre>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
type Tab = "national" | "international";

export default function LegalPage() {
  const [data,   setData]  = useState<{ national: Policy[]; international: Policy[] }>({ national: DEFAULT_NATIONAL, international: DEFAULT_INTERNATIONAL });
  const [tab,    setTab]   = useState<Tab>("national");
  const [copied, setCopied] = useState("");

  useEffect(() => { setData(loadPolicies()); }, []);

  const updatePolicy = (scope: Tab, updated: Policy) => {
    const next = {
      ...data,
      [scope]: data[scope].map(p => p.id === updated.id ? updated : p),
    };
    setData(next);
    savePolicies(next);
  };

  const policies = tab === "national" ? data.national : data.international;

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: "9px 22px",
    border: "none",
    borderBottom: active ? "3px solid #ffd700" : "3px solid transparent",
    background: "transparent",
    cursor: "pointer",
    fontWeight: active ? 700 : 500,
    fontSize: "0.9rem",
    color: active ? ACCENT : "#555",
    transition: "all 0.15s",
  });

  const exportAll = () => {
    const text = policies.map(p => `${"=".repeat(60)}\n${p.title.toUpperCase()}\n${"=".repeat(60)}\n${p.body}`).join("\n\n");
    downloadText(`isc-legal-${tab}-${new Date().toISOString().slice(0,10)}.txt`, text);
  };

  const copyAll = () => {
    const text = policies.map(p => `${"=".repeat(60)}\n${p.title.toUpperCase()}\n${"=".repeat(60)}\n${p.body}`).join("\n\n");
    navigator.clipboard.writeText(text).then(() => { setCopied("all"); setTimeout(() => setCopied(""), 1800); });
  };

  return (
    <div style={{ padding: "28px 32px", fontFamily: "Arial, Helvetica, sans-serif", maxWidth: 960 }}>
      {/* Header */}
      <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.55rem", fontWeight: 800, color: ACCENT }}>⚖️ Legal</h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: "0.88rem" }}>
            National &amp; International compliance policies — editable, copyable, and downloadable
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={copyAll}
            style={{ padding: "8px 16px", background: copied === "all" ? "#68d391" : "#f0f0f0", color: copied === "all" ? "#fff" : "#444", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: "0.83rem" }}
          >{copied === "all" ? "✓ Copied all" : `📋 Copy all (${tab})`}</button>
          <button
            onClick={exportAll}
            style={{ padding: "8px 16px", background: ACCENT, color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: "0.83rem" }}
          >⬇ Export all ({tab})</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ ...card, marginBottom: 24 }}>
        <div style={{ display: "flex", borderBottom: "1px solid #e8e8e8", padding: "0 8px" }}>
          <button style={tabBtn(tab === "national")}      onClick={() => setTab("national")}>
            🇺🇸 National (US)
          </button>
          <button style={tabBtn(tab === "international")} onClick={() => setTab("international")}>
            🌐 International
          </button>
        </div>

        {/* Summary bar */}
        <div style={{ padding: "12px 20px", background: tab === "national" ? "#eff6ff" : "#f0fdf4", borderBottom: "1px solid #e8e8e8", fontSize: "0.83rem", color: "#444" }}>
          {tab === "national" ? (
            <>
              <strong>US Compliance covered:</strong> Terms of Service · Privacy Policy (CCPA) · FTC Affiliate Disclosure · CAN-SPAM Act
            </>
          ) : (
            <>
              <strong>International frameworks covered:</strong> GDPR (EU) · CASL (Canada) · PECR / UK GDPR · Global Anti-Spam Overview
            </>
          )}
        </div>
      </div>

      {/* Policy cards */}
      {policies.map(p => (
        <PolicyCard
          key={p.id}
          policy={p}
          onUpdate={updated => updatePolicy(tab, updated)}
        />
      ))}
    </div>
  );
}
