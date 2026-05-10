import { Link, useLocation } from "@tanstack/react-router";
import { Bell, Calendar, Compass, MapPin, MessageCircle, User } from "lucide-react";
import { useNotificationsStore } from "@/lib/stores/notifications";

const TABS = [
  { to: "/", label: "Asosiy", icon: Compass },
  { to: "/map", label: "Xarita", icon: MapPin },
  { to: "/bookings", label: "Bandlar", icon: Calendar },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/notifications", label: "Xabar", icon: Bell },
  { to: "/profile", label: "Profil", icon: User },
] as const;

export function FloatingBottomDock() {
  const loc = useLocation();
  const unread = useNotificationsStore((s) => s.unreadCount());

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-safe"
      aria-label="Asosiy navigatsiya"
    >
      <div className="pointer-events-auto mx-3 mb-2 flex w-full max-w-md items-center justify-between rounded-[24px] border border-border bg-surface/95 p-1.5 shadow-dock backdrop-blur-2xl">
        {TABS.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="group relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl py-1 text-[10px] font-medium transition"
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={[
                  "relative grid h-9 w-9 place-items-center rounded-2xl transition",
                  active
                    ? "bg-foreground text-background shadow-soft"
                    : "text-muted-foreground group-hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden />
                {to === "/notifications" && unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-foreground ring-2 ring-surface" />
                )}
              </span>
              <span
                className={[
                  "text-[9px] tracking-wide transition",
                  active ? "text-foreground font-semibold" : "text-muted-foreground",
                ].join(" ")}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
