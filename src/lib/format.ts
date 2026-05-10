export function formatSom(n: number): string {
  return new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
}

export function formatKm(n?: number): string {
  if (n == null) return "";
  return n < 1 ? `${Math.round(n * 1000)} m` : `${n.toFixed(1)} km`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
