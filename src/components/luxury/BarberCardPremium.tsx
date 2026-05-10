import { Link } from "@tanstack/react-router";
import type { Barber } from "@/lib/types";
import { formatKm } from "@/lib/format";
import { RatingStars } from "./RatingStars";

export function BarberCardPremium({ barber, layout = "vertical" }: { barber: Barber; layout?: "vertical" | "horizontal" }) {
  if (layout === "horizontal") {
    return (
      <Link
        to="/booking/barber/$barberId"
        params={{ barberId: barber.id }}
        className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-soft transition hover:shadow-card"
      >
        <img
          src={barber.avatar}
          alt={barber.name}
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{barber.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{barber.salonName}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <RatingStars value={barber.rating} count={barber.reviewCount} />
            {barber.distanceKm != null && (
              <span className="text-xs text-muted-foreground">· {formatKm(barber.distanceKm)}</span>
            )}
          </div>
        </div>
        <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Band qilish</span>
      </Link>
    );
  }
  return (
    <Link
      to="/booking/barber/$barberId"
      params={{ barberId: barber.id }}
      className="block w-44 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface p-3 shadow-soft transition hover:shadow-card"
    >
      <div className="aspect-square overflow-hidden rounded-xl">
        <img src={barber.avatar} alt={barber.name} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <h3 className="mt-2 truncate text-sm font-semibold">{barber.name}</h3>
      <p className="truncate text-xs text-muted-foreground">{barber.salonName}</p>
      <div className="mt-1.5">
        <RatingStars value={barber.rating} count={barber.reviewCount} />
      </div>
    </Link>
  );
}
