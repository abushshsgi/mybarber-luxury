import { createFileRoute, Link } from "@tanstack/react-router";
import { MOCK_CONVERSATIONS } from "@/lib/mock/comms";
import { MessageCircle } from "lucide-react";
import { EmptyStateLuxury } from "@/components/luxury/States";

export const Route = createFileRoute("/_app/chat")({
  component: ChatListPage,
});

function ChatListPage() {
  const items = MOCK_CONVERSATIONS;
  return (
    <div className="px-4 pt-safe">
      <header className="pb-4 pt-6">
        <p className="label-eyebrow">Suhbatlar</p>
        <h1 className="text-2xl font-bold tracking-tight">Chat</h1>
      </header>

      {items.length === 0 ? (
        <EmptyStateLuxury icon={MessageCircle} title="Hali suhbatlar yo'q" body="Salon yoki barber bilan band qilgandan keyin chat ochiladi." />
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li key={c.id}>
              <Link
                to="/chat/$id"
                params={{ id: c.id }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-soft transition hover:shadow-card"
              >
                <img src={c.peerAvatar} alt={c.peerName} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate text-sm font-semibold">{c.peerName}</h3>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{c.lastTime}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[10px] font-bold text-gold-foreground">
                    {c.unread}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
