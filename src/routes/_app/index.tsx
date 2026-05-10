import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Bell, MapPin, Scissors, Sparkles, Crown, Baby, ArrowRight, Flame } from "lucide-react";
import { LuxurySearchBar } from "@/components/luxury/LuxurySearchBar";
import { SectionHeader, LoadingSkeleton, EmptyStateLuxury } from "@/components/luxury/States";
import { SalonCardPremium } from "@/components/luxury/SalonCardPremium";
import { BarberCardPremium } from "@/components/luxury/BarberCardPremium";
import { listSalons, listBarbers } from "@/lib/api/catalog";
import { useGeoStore } from "@/lib/stores/geo";
import { useAuthStore } from "@/lib/stores/auth";
import { useNotificationsStore } from "@/lib/stores/notifications";
import { initials } from "@/lib/format";

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

  return (
    <div className="pb-4">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-foreground via-foreground to-foreground/85 px-5 pb-8 pt-safe text-background">
        <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
        <div aria-hidden className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />

        <header className="relative flex items-center justify-between pt-5">
          <Link
            to={user ? "/profile" : "/auth"}
            className="flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3.5 backdrop-blur"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-[11px] font-bold text-gold-foreground">
              {user ? initials(user.name) : "MB"}
            </span>
            <span className="text-xs font-medium text-background/90">
              {user ? user.name : "Kirish"}
            </span>
          </Link>
          <Link
            to="/notifications"
            aria-label="Xabarlar"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur"
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-gold-foreground ring-2 ring-foreground">
                {unread}
              </span>
            )}
          </Link>
        </header>

        <div className="relative mt-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">MyBarber</p>
          <h1 className="mt-2 text-[28px] font-bold leading-[1.1] tracking-tight text-balance">
            Premium tajribangizni
            <br />
            <span className="text-gold">sevimli barberingiz</span> bilan
            boshlang.
          </h1>
        </div>

        <div className="relative mt-6">
          <LuxurySearchBar value={q} onChange={setQ} />
        </div>

        <div className="relative mt-4 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => navigate({ to: "/map" })}
            className="flex shrink-0 items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-semibold text-gold-foreground shadow-luxury"
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
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-xs font-semibold transition",
                  active
                    ? "border-background bg-background text-foreground"
                    : "border-white/20 bg-white/5 text-background/90",
                ].join(" ")}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stat strip */}
      <div className="-mt-6 mx-4 grid grid-cols-3 overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
        <Stat n="120+" l="Salonlar" />
        <Stat n="450+" l="Barberlar" divider />
        <Stat n="4.9★" l="O'rtacha" divider />
      </div>

      <section className="mt-8 px-4">
        <SectionHeader eyebrow="Tavsiya" title="Yaqin atrofdagi salonlar" action={
          <Link to="/map" className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
            Xaritada <ArrowRight className="h-3 w-3" />
          </Link>
        } />
        {salonsQ.isLoading ? (
          <div className="flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-none">
            {[0, 1, 2].map((i) => <LoadingSkeleton key={i} className="h-56 w-[260px] shrink-0" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyStateLuxury title="Hech narsa topilmadi" body="Boshqa kalit so'z yoki kategoriya tanlang." />
        ) : (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
            {filtered.slice(0, 8).map((s) => <SalonCardPremium key={s.id} salon={s} />)}
          </div>
        )}
      </section>

      <section className="mt-8 px-4">
        <SectionHeader
          eyebrow="Trending"
          title="Premium barberlar"
          action={<Flame className="h-4 w-4 text-gold" />}
        />
        {barbersQ.isLoading ? (
          <div className="flex gap-3 overflow-x-auto px-1 pb-1 scrollbar-none">
            {[0, 1, 2].map((i) => <LoadingSkeleton key={i} className="h-60 w-44 shrink-0" />)}
          </div>
        ) : (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
            {(barbersQ.data ?? []).slice(0, 8).map((b) => <BarberCardPremium key={b.id} barber={b} />)}
          </div>
        )}
      </section>

      <section className="mt-8 px-4">
        <SectionHeader eyebrow="Top reyting" title="Eng yaxshi baholangan" />
        <div className="space-y-2.5">
          {(salonsQ.data ?? [])
            .slice()
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map((s) => <SalonCardPremium key={s.id} salon={s} layout="horizontal" />)}
        </div>
      </section>

      <div className="mx-4 mt-10 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-surface to-surface p-5 shadow-card">
        <p className="label-eyebrow text-gold-foreground/80">Yangi</p>
        <h3 className="mt-1 text-lg font-bold text-foreground">Premium a'zolik tez orada</h3>
        <p className="mt-1 text-sm text-muted-foreground">Eksklyuziv chegirmalar va prioritet bandlash imkoniyati.</p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-semibold text-background">
          Kutish ro'yxatiga qo'shilish <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function Stat({ n, l, divider }: { n: string; l: string; divider?: boolean }) {
  return (
    <div className={["py-3 text-center", divider ? "border-l border-border" : ""].join(" ")}>
      <p className="text-base font-bold text-foreground">{n}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</p>
    </div>
  );
}
