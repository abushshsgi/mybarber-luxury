import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Bell, MapPin, Scissors, Sparkles, Crown, Baby } from "lucide-react";
import { LuxurySearchBar } from "@/components/luxury/LuxurySearchBar";
import { SectionHeader, LoadingSkeleton, EmptyStateLuxury } from "@/components/luxury/States";
import { SalonCardPremium } from "@/components/luxury/SalonCardPremium";
import { BarberCardPremium } from "@/components/luxury/BarberCardPremium";
import { listSalons, listBarbers } from "@/lib/api/catalog";
import { useGeoStore } from "@/lib/stores/geo";
import { useAuthStore } from "@/lib/stores/auth";
import { useNotificationsStore } from "@/lib/stores/notifications";

export const Route = createFileRoute("/_app/")({
  component: DiscoverPage,
});

const CATEGORIES = [
  { id: "haircut", label: "Soch", Icon: Scissors },
  { id: "beard", label: "Soqol", Icon: Sparkles },
  { id: "premium", label: "Premium", Icon: Crown },
  { id: "kids", label: "Bola", Icon: Baby },
] as const;

function DiscoverPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const navigate = useNavigate();
  const coords = useGeoStore((s) => s.coords);
  const requestGeo = useGeoStore((s) => s.request);
  const user = useAuthStore((s) => s.user);
  const unread = useNotificationsStore((s) => s.unreadCount());

  useEffect(() => { if (!coords) requestGeo(); }, [coords, requestGeo]);

  const salonsQ = useQuery({
    queryKey: ["salons", q, coords],
    queryFn: () => listSalons({ origin: coords, q }),
  });
  const barbersQ = useQuery({
    queryKey: ["barbers", coords],
    queryFn: () => listBarbers({ origin: coords }),
  });

  const filtered = (salonsQ.data ?? []).filter((s) =>
    cat ? s.services.some((sv) => sv.category === cat) : true,
  );

  const greeting = user ? `Salom, ${user.name}` : "Premium tajriba";

  return (
    <div className="px-4 pt-safe">
      <header className="flex items-start justify-between pb-4 pt-6">
        <div>
          <p className="label-eyebrow">MyBarber</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-balance">
            {greeting}<span className="text-gold">.</span>
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Sevimli barberingizni toping.</p>
        </div>
        <Link
          to="/notifications"
          aria-label="Xabarlar"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-surface shadow-soft"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-surface" />}
        </Link>
      </header>

      <LuxurySearchBar value={q} onChange={setQ} />

      <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => navigate({ to: "/map" })}
          className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft"
        >
          <MapPin className="h-3.5 w-3.5" /> Yaqin atrofda
        </button>
        {CATEGORIES.map(({ id, label, Icon }) => {
          const active = cat === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCat(active ? null : id)}
              className={[
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-foreground hover:border-foreground/40",
              ].join(" ")}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          );
        })}
      </div>

      <section className="mt-6">
        <SectionHeader eyebrow="Tavsiya" title="Yaqin atrofdagi salonlar" action={
          <Link to="/map" className="text-xs font-semibold text-foreground underline-offset-4 hover:underline">Xaritada ko'rish</Link>
        } />
        {salonsQ.isLoading ? (
          <div className="flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-none">
            {[0, 1, 2].map((i) => <LoadingSkeleton key={i} className="h-48 w-64 shrink-0" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyStateLuxury title="Hech narsa topilmadi" body="Boshqa kalit so'z yoki kategoriya tanlang." />
        ) : (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
            {filtered.slice(0, 8).map((s) => <SalonCardPremium key={s.id} salon={s} />)}
          </div>
        )}
      </section>

      <section className="mt-8">
        <SectionHeader eyebrow="Trending" title="Premium barberlar" />
        {barbersQ.isLoading ? (
          <div className="flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-none">
            {[0, 1, 2].map((i) => <LoadingSkeleton key={i} className="h-56 w-44 shrink-0" />)}
          </div>
        ) : (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
            {(barbersQ.data ?? []).slice(0, 8).map((b) => <BarberCardPremium key={b.id} barber={b} />)}
          </div>
        )}
      </section>

      <section className="mt-8">
        <SectionHeader eyebrow="Top reyting" title="Eng yaxshi baholangan" />
        <div className="space-y-3">
          {(salonsQ.data ?? [])
            .slice()
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4)
            .map((s) => <SalonCardPremium key={s.id} salon={s} layout="horizontal" />)}
        </div>
      </section>

      <div className="mt-10 rounded-3xl bg-gradient-to-br from-foreground to-foreground/80 p-6 text-background">
        <p className="label-eyebrow text-background/60">Yangi</p>
        <h3 className="mt-1 text-lg font-bold">Premium a'zolik tez orada</h3>
        <p className="mt-1 text-sm text-background/70">Eksklyuziv chegirmalar va prioritet bandlash.</p>
      </div>
    </div>
  );
}
