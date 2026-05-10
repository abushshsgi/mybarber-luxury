import { Link } from "@tanstack/react-router";
import type { Salon } from "@/lib/types";
import { formatKm } from "@/lib/format";
import { RatingStars } from "./RatingStars";
import { MapPin } from "lucide-react";

export function SalonCardPremium({ salon, layout = "vertical" }: { salon: Salon; layout?: "vertical" | "horizontal" }) {
  if (layout === "horizontal") {
    return (
      <Link
        to="/salon/$id"
        params={{ id: salon.id }}
        className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-soft transition hover:shadow-card"
      >
        <img
          src={salon.cover}
          alt={salon.name}
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">{salon.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {salon.address}
            {salon.distanceKm != null && <span>· {formatKm(salon.distanceKm)}</span>}
          </p>
          <div className="mt-1.5">
            <RatingStars value={salon.rating} count={salon.reviewCount} />
          </div>
        </div>
        <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Band qilish</span>
      </Link>
    );
  }
  return (
    <Link
      to="/salon/$id"
      params={{ id: salon.id }}
      className="block w-64 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition hover:shadow-card"
    >
      <div className="relative aspect-[5/3] overflow-hidden">
        <img src={salon.cover} alt={salon.name} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
          {salon.open ? "Ochiq" : "Yopiq"}
        </span>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold">{salon.name}</h3>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{salon.address}</p>
        <div className="mt-2 flex items-center justify-between">
          <RatingStars value={salon.rating} count={salon.reviewCount} />
          {salon.distanceKm != null && (
            <span className="text-xs text-muted-foreground">{formatKm(salon.distanceKm)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
