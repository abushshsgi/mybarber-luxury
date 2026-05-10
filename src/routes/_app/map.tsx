import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Crosshair, Locate, MapPin } from "lucide-react";
import { useGeoStore } from "@/lib/stores/geo";
import { nearbySalons, nearbyBarbers } from "@/lib/api/catalog";
import { RadiusSelector } from "@/components/luxury/RadiusSelector";
import { SalonCardPremium } from "@/components/luxury/SalonCardPremium";
import { BarberCardPremium } from "@/components/luxury/BarberCardPremium";
import { EmptyStateLuxury, LoadingSkeleton } from "@/components/luxury/States";

const MapView = lazy(() => import("@/components/luxury/MapView").then((m) => ({ default: m.MapView })));

export const Route = createFileRoute("/_app/map")({
  component: MapPage,
});

function MapPage() {
  const { coords, status, radiusKm, request } = useGeoStore();
  const [tab, setTab] = useState<"salons" | "barbers">("salons");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => { if (!coords) request(); }, [coords, request]);

  const salonsQ = useQuery({
    queryKey: ["nearby-salons", coords, radiusKm],
    queryFn: () => coords ? nearbySalons(coords, radiusKm) : Promise.resolve([]),
    enabled: !!coords,
  });
  const barbersQ = useQuery({
    queryKey: ["nearby-barbers", coords, radiusKm],
    queryFn: () => coords ? nearbyBarbers(coords, radiusKm) : Promise.resolve([]),
    enabled: !!coords,
  });

  const markers = useMemo(() => {
    if (tab === "salons") return (salonsQ.data ?? []).map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, label: s.name }));
    return (barbersQ.data ?? []).map((b) => ({ id: b.id, lat: b.lat, lng: b.lng, label: b.name }));
  }, [tab, salonsQ.data, barbersQ.data]);

  return (
    <div className="flex h-[calc(100dvh-5.5rem)] flex-col">
      <header className="px-4 pb-3 pt-safe">
        <div className="flex items-center justify-between pt-4">
          <div>
            <p className="label-eyebrow">Yaqin atrofingiz</p>
            <h1 className="text-xl font-bold tracking-tight">
              {status === "loading" && "Joylashuv aniqlanmoqda..."}
              {status === "granted" && "Joylashuv aniqlandi"}
              {status === "fallback" && "Toshkent markazi"}
              {status === "denied" && "Ruxsat berilmadi"}
              {status === "idle" && "Joylashuv kerak"}
            </h1>
          </div>
          <button
            type="button"
            onClick={request}
            className="rounded-full border border-border bg-surface px-3 py-2 text-xs font-semibold shadow-soft"
          >
            <Locate className="inline h-3.5 w-3.5" /> Qayta
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <RadiusSelector />
          <span className="text-xs text-muted-foreground">{markers.length} ta natija</span>
        </div>
      </header>

      <div className="relative mx-4 flex-1 overflow-hidden rounded-3xl border border-border bg-muted shadow-card">
        <Suspense fallback={<div className="grid h-full place-items-center text-muted-foreground"><MapPin className="h-6 w-6 animate-pulse" /></div>}>
          <MapView center={coords} markers={markers} activeId={activeId} onMarkerClick={setActiveId} radiusKm={radiusKm} />
        </Suspense>
        <button
          type="button"
          onClick={request}
          aria-label="Mening joylashuvim"
          className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-luxury"
        >
          <Crosshair className="h-5 w-5" />
        </button>
      </div>

      <section className="px-4 pt-3">
        <div className="inline-flex rounded-full border border-border bg-surface p-1 shadow-soft">
          {(["salons", "barbers"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={[
                "rounded-full px-4 py-1.5 text-xs font-semibold transition",
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              ].join(" ")}
            >
              {t === "salons" ? "Salonlar" : "Barberlar"}
            </button>
          ))}
        </div>
        <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pb-2 scrollbar-none">
          {tab === "salons" ? (
            salonsQ.isLoading ? (
              <LoadingSkeleton className="h-20" />
            ) : (salonsQ.data ?? []).length === 0 ? (
              <EmptyStateLuxury title="Bo'sh" body="Radiusni kattalashtiring." />
            ) : (
              (salonsQ.data ?? []).map((s) => (
                <div key={s.id} onMouseEnter={() => setActiveId(s.id)} className={activeId === s.id ? "ring-2 ring-gold rounded-2xl" : undefined}>
                  <SalonCardPremium salon={s} layout="horizontal" />
                </div>
              ))
            )
          ) : barbersQ.isLoading ? (
            <LoadingSkeleton className="h-20" />
          ) : (barbersQ.data ?? []).length === 0 ? (
            <EmptyStateLuxury title="Bo'sh" body="Radiusni kattalashtiring." />
          ) : (
            (barbersQ.data ?? []).map((b) => (
              <div key={b.id} onMouseEnter={() => setActiveId(b.id)} className={activeId === b.id ? "ring-2 ring-gold rounded-2xl" : undefined}>
                <BarberCardPremium barber={b} layout="horizontal" />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
