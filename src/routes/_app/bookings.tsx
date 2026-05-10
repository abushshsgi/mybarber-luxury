import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar as CalendarIcon, Repeat } from "lucide-react";
import { useBookingsStore } from "@/lib/stores/bookings";
import { EmptyStateLuxury, SectionHeader } from "@/components/luxury/States";
import { format } from "date-fns";
import { formatSom } from "@/lib/format";

export const Route = createFileRoute("/_app/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const bookings = useBookingsStore((s) => s.bookings);
  const cancel = useBookingsStore((s) => s.cancel);
  const items = bookings.filter((b) => b.status === tab);

  return (
    <div className="px-4 pt-safe">
      <header className="pb-3 pt-6">
        <p className="label-eyebrow">Sizning bandlovlaringiz</p>
        <h1 className="text-2xl font-bold tracking-tight">Bandlar</h1>
      </header>

      <div className="inline-flex rounded-full border border-border bg-surface p-1 shadow-soft">
        {([
          { id: "upcoming", label: "Kutilmoqda" },
          { id: "completed", label: "Yakunlangan" },
          { id: "cancelled", label: "Bekor" },
        ] as const).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={[
              "rounded-full px-4 py-1.5 text-xs font-semibold transition",
              tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyStateLuxury
            icon={CalendarIcon}
            title={tab === "upcoming" ? "Hozircha bandlovlar yo'q" : "Bo'sh"}
            body="Sevimli salonni topib, bir necha tap bilan band qiling."
            action={
              <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                Salonlarni ko'rish
              </Link>
            }
          />
        ) : (
          items.map((b) => (
            <article key={b.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
              <div className="flex items-start gap-3 p-3">
                <img src={b.salonCover} alt={b.salonName} className="h-20 w-20 shrink-0 rounded-xl object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">{b.salonName}</h3>
                  <p className="truncate text-xs text-muted-foreground">{b.barberName} · {b.service.name}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{format(new Date(b.date), "d MMM, HH:mm")}</span>
                    <span className="ml-auto font-semibold">{formatSom(b.service.price)}</span>
                  </div>
                </div>
              </div>
              <div className="flex border-t border-border">
                {tab === "upcoming" ? (
                  <>
                    <button onClick={() => cancel(b.id)} className="flex-1 py-3 text-xs font-semibold text-destructive">Bekor qilish</button>
                    <Link to="/chat" className="flex-1 border-l border-border py-3 text-center text-xs font-semibold text-foreground">Chat</Link>
                  </>
                ) : (
                  <Link to="/salon/$id" params={{ id: b.salonId }} className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold text-foreground">
                    <Repeat className="h-3.5 w-3.5" /> Qayta band qilish
                  </Link>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
