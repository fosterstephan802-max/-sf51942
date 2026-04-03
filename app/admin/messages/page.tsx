"use client";
import { useState, useEffect, useCallback } from "react";

/* ─── Types ────────────────────────────────────────────────────── */
type Message = {
  id: string;
  direction: "incoming" | "outgoing";
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
};

/* ─── Seed inbox data ──────────────────────────────────────────── */
const SEED_INBOX: Message[] = [
  {
    id: "seed-1",
    direction: "incoming",
    from: "Alice Johnson",
    fromEmail: "alice.johnson@example.com",
    to: "Admin",
    toEmail: "admin@isc.com",
    subject: "Question about VIP membership",
    body: "Hi there,\n\nI just signed up for the VIP plan and wanted to know how long it takes to get access to the full deal list.\n\nThanks,\nAlice",
    date: "2026-03-28T10:14:00.000Z",
    read: false,
  },
  {
    id: "seed-2",
    direction: "incoming",
    from: "Bob Martinez",
    fromEmail: "bob.martinez@example.com",
    to: "Admin",
    toEmail: "admin@isc.com",
    subject: "Referral link not working",
    body: "Hello,\n\nMy referral link doesn't seem to be tracking clicks. I've shared it 10 times but still see 0 referrals in my dashboard.\n\nBob",
    date: "2026-03-29T14:52:00.000Z",
    read: false,
  },
  {
    id: "seed-3",
    direction: "incoming",
    from: "Carol Williams",
    fromEmail: "carol.williams@example.com",
    to: "Admin",
    toEmail: "admin@isc.com",
    subject: "Deal request – outdoor furniture",
    body: "Hey team,\n\nAny chance you could add more outdoor furniture deals for the spring campaign? I know a few friends who would love that.\n\nCarol",
    date: "2026-03-30T09:03:00.000Z",
    read: true,
  },
  {
    id: "seed-4",
    direction: "incoming",
    from: "David Brown",
    fromEmail: "david.brown@example.com",
    to: "Admin",
    toEmail: "admin@isc.com",
    subject: "Cancellation – feedback",
    body: "Hi,\n\nI've cancelled my subscription. The deals weren't in my area but overall the platform is well-made. I might return for the holiday season.\n\nDavid",
    date: "2026-04-01T17:30:00.000Z",
    read: false,
  },
  {
    id: "seed-5",
    direction: "incoming",
    from: "Elena Torres",
    fromEmail: "elena.torres@example.com",
    to: "Admin",
    toEmail: "admin@isc.com",
    subject: "Billing issue – charged twice",
    body: "Hello,\n\nI noticed I was charged twice in March. Could you please investigate and issue a refund for the duplicate charge?\n\nThank you,\nElena",
    date: "2026-04-02T11:20:00.000Z",
    read: false,
  },
];

const LS_KEY = "isc_messages_v1";

function loadMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as Message[];
  } catch {
    // ignore
  }
  localStorage.setItem(LS_KEY, JSON.stringify(SEED_INBOX));
  return SEED_INBOX;
}

function saveMessages(msgs: Message[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY, JSON.stringify(msgs));
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

type Tab = "inbox" | "sent" | "compose";
const ACCENT = "#003580";

const labelStyle: React.CSSProperties = {
  display: "block", marginBottom: 5, fontWeight: 600, fontSize: "0.83rem", color: "#333",
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: 6,
  fontSize: "0.9rem", outline: "none", boxSizing: "border-box", background: "#fafafa",
};
const card: React.CSSProperties = {
  background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden",
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [tab, setTab]           = useState<Tab>("inbox");
  const [selected, setSelected] = useState<Message | null>(null);

  const [cTo,      setCTo]      = useState("");
  const [cToEmail, setCToEmail] = useState("");
  const [cSubject, setCSubject] = useState("");
  const [cBody,    setCBody]    = useState("");
  const [sent,     setSent]     = useState(false);

  useEffect(() => { setMessages(loadMessages()); }, []);

  const inbox    = messages.filter(m => m.direction === "incoming");
  const sentMsgs = messages.filter(m => m.direction === "outgoing");
  const unread   = inbox.filter(m => !m.read).length;

  const openMessage = useCallback((msg: Message) => {
    if (!msg.read) {
      const updated = messages.map(m => m.id === msg.id ? { ...m, read: true } : m);
      setMessages(updated);
      saveMessages(updated);
    }
    setSelected({ ...msg, read: true });
  }, [messages]);

  const deleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    saveMessages(updated);
    if (selected?.id === id) setSelected(null);
  };

  const handleSend = () => {
    if (!cTo.trim() || !cToEmail.trim() || !cSubject.trim() || !cBody.trim()) return;
    const msg: Message = {
      id: `out-${Date.now()}`,
      direction: "outgoing",
      from: "Admin",
      fromEmail: "admin@isc.com",
      to: cTo.trim(),
      toEmail: cToEmail.trim(),
      subject: cSubject.trim(),
      body: cBody.trim(),
      date: new Date().toISOString(),
      read: true,
    };
    const updated = [msg, ...messages];
    setMessages(updated);
    saveMessages(updated);
    setCTo(""); setCToEmail(""); setCSubject(""); setCBody("");
    setSent(true);
    setTimeout(() => { setSent(false); setTab("sent"); }, 1400);
  };

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: "9px 20px",
    border: "none",
    borderBottom: active ? "3px solid #ffd700" : "3px solid transparent",
    background: "transparent",
    cursor: "pointer",
    fontWeight: active ? 700 : 500,
    fontSize: "0.9rem",
    color: active ? ACCENT : "#555",
    transition: "all 0.15s",
  });

  const rowStyle = (unreadRow: boolean, id: string): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "12px 16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
    background: selected?.id === id ? "#eef2ff" : (unreadRow ? "#fffbea" : "#fff"),
    transition: "background 0.12s",
  });

  return (
    <div style={{ padding: "28px 32px", fontFamily: "Arial, Helvetica, sans-serif", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: "1.55rem", fontWeight: 800, color: ACCENT }}>💬 Messages</h1>
        <p style={{ margin: "4px 0 0", color: "#666", fontSize: "0.88rem" }}>
          Incoming member messages &amp; outgoing admin replies
        </p>
      </div>

      {/* Main card */}
      <div style={{ ...card, marginBottom: 20 }}>
        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: "1px solid #e8e8e8", padding: "0 8px" }}>
          <button style={tabBtn(tab === "inbox")} onClick={() => { setTab("inbox"); setSelected(null); }}>
            📥 Inbox{unread > 0 && (
              <span style={{ marginLeft: 6, background: "#e53e3e", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: "0.75rem", fontWeight: 700 }}>
                {unread}
              </span>
            )}
          </button>
          <button style={tabBtn(tab === "sent")} onClick={() => { setTab("sent"); setSelected(null); }}>
            📤 Sent ({sentMsgs.length})
          </button>
          <button style={tabBtn(tab === "compose")} onClick={() => { setTab("compose"); setSelected(null); }}>
            ✏️ Compose
          </button>
        </div>

        {/* ── INBOX ── */}
        {tab === "inbox" && (
          <div style={{ display: "flex", minHeight: 420 }}>
            <div style={{ width: 340, borderRight: "1px solid #e8e8e8", overflowY: "auto", flexShrink: 0 }}>
              {inbox.length === 0 && <p style={{ padding: 24, color: "#999", fontSize: "0.88rem" }}>No incoming messages.</p>}
              {inbox.map(msg => (
                <div key={msg.id} style={rowStyle(!msg.read, msg.id)} onClick={() => openMessage(msg)}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: msg.read ? "transparent" : "#e53e3e", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: msg.read ? 500 : 700, fontSize: "0.88rem", color: "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {msg.from}
                      </span>
                      <span style={{ fontSize: "0.73rem", color: "#999", flexShrink: 0, marginLeft: 8 }}>
                        {new Date(msg.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.83rem", color: "#444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: msg.read ? 400 : 600 }}>
                      {msg.subject}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {msg.body.slice(0, 60)}…
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
              {!selected
                ? <div style={{ color: "#bbb", marginTop: 60, textAlign: "center", fontSize: "0.95rem" }}>← Select a message to read it</div>
                : (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                      <div>
                        <h2 style={{ margin: "0 0 6px", fontSize: "1.15rem", color: "#111" }}>{selected.subject}</h2>
                        <div style={{ fontSize: "0.83rem", color: "#555" }}><strong>From:</strong> {selected.from} &lt;{selected.fromEmail}&gt;</div>
                        <div style={{ fontSize: "0.83rem", color: "#555" }}><strong>Date:</strong> {formatDate(selected.date)}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => { setTab("compose"); setCTo(selected.from); setCToEmail(selected.fromEmail); setCSubject(`Re: ${selected.subject}`); setCBody(""); setSelected(null); }}
                          style={{ padding: "7px 14px", background: ACCENT, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.83rem", fontWeight: 600 }}
                        >↩ Reply</button>
                        <button
                          onClick={() => deleteMessage(selected.id)}
                          style={{ padding: "7px 14px", background: "#fee2e2", color: "#c53030", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.83rem", fontWeight: 600 }}
                        >🗑 Delete</button>
                      </div>
                    </div>
                    <div style={{ background: "#f9f9f9", borderRadius: 8, padding: "18px 20px", fontSize: "0.9rem", color: "#333", lineHeight: 1.7, whiteSpace: "pre-wrap", border: "1px solid #ebebeb" }}>
                      {selected.body}
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        )}

        {/* ── SENT ── */}
        {tab === "sent" && (
          <div style={{ display: "flex", minHeight: 420 }}>
            <div style={{ width: 340, borderRight: "1px solid #e8e8e8", overflowY: "auto", flexShrink: 0 }}>
              {sentMsgs.length === 0 && <p style={{ padding: 24, color: "#999", fontSize: "0.88rem" }}>No sent messages yet.</p>}
              {sentMsgs.map(msg => (
                <div key={msg.id} style={rowStyle(false, msg.id)} onClick={() => setSelected(msg)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 500, fontSize: "0.88rem", color: "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        To: {msg.to}
                      </span>
                      <span style={{ fontSize: "0.73rem", color: "#999", flexShrink: 0, marginLeft: 8 }}>
                        {new Date(msg.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.83rem", color: "#444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.subject}</div>
                    <div style={{ fontSize: "0.78rem", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.body.slice(0, 60)}…</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
              {!selected
                ? <div style={{ color: "#bbb", marginTop: 60, textAlign: "center", fontSize: "0.95rem" }}>← Select a sent message to view it</div>
                : (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                      <div>
                        <h2 style={{ margin: "0 0 6px", fontSize: "1.15rem", color: "#111" }}>{selected.subject}</h2>
                        <div style={{ fontSize: "0.83rem", color: "#555" }}><strong>To:</strong> {selected.to} &lt;{selected.toEmail}&gt;</div>
                        <div style={{ fontSize: "0.83rem", color: "#555" }}><strong>Sent:</strong> {formatDate(selected.date)}</div>
                      </div>
                      <button
                        onClick={() => deleteMessage(selected.id)}
                        style={{ padding: "7px 14px", background: "#fee2e2", color: "#c53030", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.83rem", fontWeight: 600 }}
                      >🗑 Delete</button>
                    </div>
                    <div style={{ background: "#f9f9f9", borderRadius: 8, padding: "18px 20px", fontSize: "0.9rem", color: "#333", lineHeight: 1.7, whiteSpace: "pre-wrap", border: "1px solid #ebebeb" }}>
                      {selected.body}
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        )}

        {/* ── COMPOSE ── */}
        {tab === "compose" && (
          <div style={{ padding: 32, maxWidth: 660 }}>
            {sent && (
              <div style={{ background: "#f0fff4", border: "1px solid #68d391", borderRadius: 8, padding: "12px 18px", marginBottom: 20, color: "#276749", fontWeight: 600, fontSize: "0.9rem" }}>
                ✅ Message sent! Redirecting to Sent…
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>To (Name)</label>
                  <input style={inputStyle} value={cTo} onChange={e => setCTo(e.target.value)} placeholder="Recipient name" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>To (Email)</label>
                  <input style={inputStyle} type="email" value={cToEmail} onChange={e => setCToEmail(e.target.value)} placeholder="recipient@email.com" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Subject</label>
                <input style={inputStyle} value={cSubject} onChange={e => setCSubject(e.target.value)} placeholder="Subject line" />
              </div>
              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  style={{ ...inputStyle, height: 200, resize: "vertical", fontFamily: "Arial, Helvetica, sans-serif", lineHeight: 1.6 }}
                  value={cBody}
                  onChange={e => setCBody(e.target.value)}
                  placeholder="Write your message here…"
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleSend}
                  disabled={!cTo || !cToEmail || !cSubject || !cBody}
                  style={{
                    padding: "10px 26px",
                    background: (!cTo || !cToEmail || !cSubject || !cBody) ? "#ccc" : ACCENT,
                    color: "#fff", border: "none", borderRadius: 7,
                    cursor: (!cTo || !cToEmail || !cSubject || !cBody) ? "not-allowed" : "pointer",
                    fontWeight: 700, fontSize: "0.9rem",
                  }}
                >📤 Send Message</button>
                <button
                  onClick={() => { setCTo(""); setCToEmail(""); setCSubject(""); setCBody(""); }}
                  style={{ padding: "10px 20px", background: "#f0f0f0", color: "#444", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
                >Clear</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 14 }}>
        {[
          { label: "Total Inbox", value: inbox.length,    icon: "📥", hi: false },
          { label: "Unread",      value: unread,          icon: "🔴", hi: unread > 0 },
          { label: "Sent",        value: sentMsgs.length, icon: "📤", hi: false },
          { label: "Total",       value: messages.length, icon: "💬", hi: false },
        ].map(s => (
          <div key={s.label} style={{ ...card, flex: 1, padding: "14px 18px", borderLeft: `4px solid ${s.hi ? "#e53e3e" : ACCENT}` }}>
            <div style={{ fontSize: "1.4rem" }}>{s.icon}</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: s.hi ? "#e53e3e" : ACCENT, margin: "4px 0 2px" }}>{s.value}</div>
            <div style={{ fontSize: "0.78rem", color: "#777", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
