import { ALL_BARBERS, ALL_SALONS } from "../mock/data";
import type { Barber, Salon } from "../types";

const sleep = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function withDistance<T extends { lat: number; lng: number; distanceKm?: number }>(
  items: T[],
  origin?: { lat: number; lng: number } | null,
): T[] {
  if (!origin) return items;
  return items.map((it) => ({ ...it, distanceKm: distanceKm(origin, it) }));
}

export async function listSalons(opts?: { origin?: { lat: number; lng: number } | null; q?: string }): Promise<Salon[]> {
  await sleep();
  let items = withDistance(ALL_SALONS, opts?.origin);
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    items = items.filter((s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
  }
  if (opts?.origin) items.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  return items;
}

export async function nearbySalons(origin: { lat: number; lng: number }, radiusKm: number): Promise<Salon[]> {
  await sleep();
  return withDistance(ALL_SALONS, origin)
    .filter((s) => (s.distanceKm ?? 999) <= radiusKm)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}

export async function nearbyBarbers(origin: { lat: number; lng: number }, radiusKm: number): Promise<Barber[]> {
  await sleep();
  return withDistance(ALL_BARBERS, origin)
    .filter((b) => (b.distanceKm ?? 999) <= radiusKm)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}

export async function getSalon(id: string, origin?: { lat: number; lng: number } | null): Promise<Salon | null> {
  await sleep();
  const found = ALL_SALONS.find((s) => s.id === id);
  if (!found) return null;
  return origin ? { ...found, distanceKm: distanceKm(origin, found) } : found;
}

export async function getBarber(id: string): Promise<Barber | null> {
  await sleep();
  return ALL_BARBERS.find((b) => b.id === id) ?? null;
}

export async function listBarbers(opts?: { origin?: { lat: number; lng: number } | null }): Promise<Barber[]> {
  await sleep();
  const items = withDistance(ALL_BARBERS, opts?.origin);
  if (opts?.origin) items.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  return items;
}

export function generateSlots(date: Date): string[] {
  const slots: string[] = [];
  for (let h = 9; h <= 20; h++) {
    for (const m of [0, 30]) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  // randomly mark some unavailable based on date for realism
  const seed = date.getDate();
  return slots.filter((_, i) => (i + seed) % 5 !== 0);
}
