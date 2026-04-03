"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "📊 Dashboard",  href: "/admin/dashboard" },
  { label: "📅 Campaigns",  href: "/admin/campaigns" },
  { label: "👥 Members",    href: "/admin/members"   },
  { label: "📈 Analytics",  href: "/admin/analytics" },
  { label: "💬 Messages",   href: "/admin/messages"  },
  { label: "⚙️  Settings",   href: "/admin/settings"  },
];

const SIDEBAR_W = 220;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed]     = useState(false);
  const [checked, setChecked]   = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const ok = typeof window !== "undefined" && localStorage.getItem("isc_admin_auth") === "1";
    setAuthed(ok);
    setChecked(true);
    if (!ok && pathname !== "/admin") router.replace("/admin");
  }, [pathname, router]);

  if (!checked) return null;

  // On the login page (/admin) render without the shell
  if (pathname === "/admin") return <>{children}</>;

  if (!authed) return null;

  const sidebarW = collapsed ? 56 : SIDEBAR_W;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, Helvetica, sans-serif", background: "#f0f2f5" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarW,
        background: "#003580",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        flexShrink: 0,
      }}>
        {/* Logo / toggle row */}
        <div style={{
          padding: "18px 12px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 8,
        }}>
          {!collapsed && (
            <span style={{ fontWeight: 800, fontSize: "0.88rem", letterSpacing: "0.03em", color: "#ffd700", whiteSpace: "nowrap" }}>
              🌐 ISC Admin
            </span>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{
              background: "none", border: "none", color: "#ffd700",
              fontSize: "1.1rem", cursor: "pointer", lineHeight: 1, flexShrink: 0,
            }}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "▶" : "◀"}
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, paddingTop: 10 }}>
          {NAV_ITEMS.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                title={collapsed ? item.label.replace(/^[^\w]*/, "") : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: collapsed ? "12px 0" : "12px 18px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  textDecoration: "none",
                  color: active ? "#ffd700" : "rgba(255,255,255,0.82)",
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.88rem",
                  background: active ? "rgba(255,215,0,0.12)" : "transparent",
                  borderLeft: active ? "3px solid #ffd700" : "3px solid transparent",
                  transition: "background 0.15s",
                }}
              >
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>
                  {item.label.split(" ")[0]}
                </span>
                {!collapsed && (
                  <span style={{ whiteSpace: "nowrap" }}>
                    {item.label.split(" ").slice(1).join(" ")}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Sign out */}
        <button
          onClick={() => {
            localStorage.removeItem("isc_admin_auth");
            router.replace("/admin");
          }}
          title={collapsed ? "Sign out" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 10,
            margin: "0 0 18px",
            padding: collapsed ? "10px 0" : "10px 18px",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.82rem",
            cursor: "pointer",
            width: "100%",
            transition: "color 0.15s",
          }}
        >
          <span style={{ fontSize: "1rem" }}>🚪</span>
          {!collapsed && <span>Sign out</span>}
        </button>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
