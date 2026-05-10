import { createFileRoute } from "@tanstack/react-router";
import { Bell, Calendar, MessageCircle, Tag } from "lucide-react";
import { useNotificationsStore } from "@/lib/stores/notifications";
import { EmptyStateLuxury } from "@/components/luxury/States";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

const ICON = { booking: Calendar, chat: MessageCircle, promo: Tag };

function NotificationsPage() {
  const items = useNotificationsStore((s) => s.items);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const toggleRead = useNotificationsStore((s) => s.toggleRead);

  return (
    <div className="px-4 pt-safe">
      <header className="flex items-end justify-between pb-4 pt-6">
        <div>
          <p className="label-eyebrow">Bildirishnomalar</p>
          <h1 className="text-2xl font-bold tracking-tight">Xabarlar</h1>
        </div>
        <button onClick={markAllRead} className="rounded-full border border-border bg-surface px-3 py-2 text-xs font-semibold">
          Hammasini o'qildi
        </button>
      </header>

      {items.length === 0 ? (
        <EmptyStateLuxury icon={Bell} title="Bo'sh" />
      ) : (
        <ul className="space-y-2">
          {items.map((n) => {
            const Icon = ICON[n.kind];
            return (
              <li key={n.id}>
                <button
                  onClick={() => toggleRead(n.id)}
                  className={[
                    "flex w-full items-start gap-3 rounded-2xl border p-3 text-left shadow-soft transition",
                    n.read ? "border-border bg-surface" : "border-gold/40 bg-gold/5",
                  ].join(" ")}
                >
                  <span className={[
                    "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                    n.read ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground",
                  ].join(" ")}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold">{n.title}</h3>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                  </div>
                  {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
