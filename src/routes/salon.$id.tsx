import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, MapPin, Share2 } from "lucide-react";
import { getSalon } from "@/lib/api/catalog";
import { useGeoStore } from "@/lib/stores/geo";
import { RatingStars } from "@/components/luxury/RatingStars";
import { formatKm, formatSom } from "@/lib/format";
import { LoadingSkeleton } from "@/components/luxury/States";

export const Route = createFileRoute("/salon/$id")({
  component: SalonDetail,
  errorComponent: ({ error }) => <div className="p-6">{error.message}</div>,
  notFoundComponent: () => <div className="p-6 text-center">Salon topilmadi</div>,
});

function SalonDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const coords = useGeoStore((s) => s.coords);
  const [tab, setTab] = useState<"about" | "services" | "staff" | "reviews">("about");
  const { data: salon, isLoading } = useQuery({
    queryKey: ["salon", id, coords],
    queryFn: async () => {
      const s = await getSalon(id, coords);
      if (!s) throw notFound();
      return s;
    },
  });

  if (isLoading || !salon) {
    return <div className="p-4 space-y-3"><LoadingSkeleton className="h-64" /><LoadingSkeleton /></div>;
  }

  return (
    <div className="mx-auto w-full max-w-md bg-background pb-32">
      <div className="relative">
        <img src={salon.cover} alt={salon.name} className="h-72 w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-safe">
          <button
            onClick={() => history.length > 1 ? history.back() : navigate({ to: "/" })}
            className="grid h-10 w-10 place-items-center rounded-full bg-surface/90 backdrop-blur shadow-soft"
            aria-label="Orqaga"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-surface/90 backdrop-blur shadow-soft" aria-label="Ulashish"><Share2 className="h-4 w-4" /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-surface/90 backdrop-blur shadow-soft" aria-label="Saqlash"><Heart className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="-mt-10 rounded-t-3xl bg-background px-5 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">{salon.name}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <RatingStars value={salon.rating} count={salon.reviewCount} size="md" />
          <span className="text-muted-foreground">·</span>
          <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{formatKm(salon.distanceKm) || salon.address}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="text-success font-semibold">{salon.open ? "Ochiq" : "Yopiq"}</span> · {salon.hours}
        </p>

        <div className="mt-5 -mx-5 flex gap-1 overflow-x-auto border-b border-border px-5 scrollbar-none">
          {([
            { id: "about", label: "Ma'lumot" },
            { id: "services", label: "Xizmatlar" },
            { id: "staff", label: "Staff" },
            { id: "reviews", label: "Sharhlar" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "shrink-0 px-4 py-3 text-sm font-semibold transition",
                tab === t.id ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {tab === "about" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-foreground/80">{salon.about}</p>
              <div className="grid grid-cols-3 gap-2">
                {salon.gallery.slice(0, 6).map((src, i) => (
                  <img key={i} src={src} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
                ))}
              </div>
            </div>
          )}
          {tab === "services" && (
            <ul className="space-y-2">
              {salon.services.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface p-3 shadow-soft">
                  <div>
                    <h3 className="text-sm font-semibold">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.durationMin} daq</p>
                  </div>
                  <span className="text-sm font-bold">{formatSom(s.price)}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === "staff" && (
            <ul className="space-y-2">
              {salon.staff.map((b) => (
                <li key={b.id}>
                  <Link to="/booking/barber/$barberId" params={{ barberId: b.id }} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-soft">
                    <img src={b.avatar} alt={b.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold">{b.name}</h3>
                      <RatingStars value={b.rating} count={b.reviewCount} />
                    </div>
                    <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Tanlash</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {tab === "reviews" && (
            <ul className="space-y-3">
              {salon.reviews.map((r) => (
                <li key={r.id} className="rounded-2xl border border-border bg-surface p-3 shadow-soft">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{r.author}</h3>
                    <RatingStars value={r.rating} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.date}</p>
                  <p className="mt-2 text-sm text-foreground/80">{r.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-border bg-surface/95 px-5 pb-safe pt-3 backdrop-blur">
        <Link
          to="/booking/$salonId"
          params={{ salonId: salon.id }}
          className="grid h-12 w-full place-items-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-luxury"
        >
          Band qilish
        </Link>
      </div>
    </div>
  );
}
