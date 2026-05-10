import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TASHKENT_FALLBACK } from "../mock/data";

type GeoStatus = "idle" | "loading" | "granted" | "denied" | "fallback";

type State = {
  coords: { lat: number; lng: number } | null;
  status: GeoStatus;
  radiusKm: 1 | 2 | 3;
  setRadius: (r: 1 | 2 | 3) => void;
  request: () => void;
};

export const useGeoStore = create<State>()(
  persist(
    (set) => ({
      coords: TASHKENT_FALLBACK,
      status: "fallback",
      radiusKm: 2,
      setRadius: (r) => set({ radiusKm: r }),
      request: () => {
        if (typeof navigator === "undefined" || !navigator.geolocation) {
          set({ coords: TASHKENT_FALLBACK, status: "fallback" });
          return;
        }
        set({ status: "loading" });
        const timeout = setTimeout(() => {
          set({ coords: TASHKENT_FALLBACK, status: "fallback" });
        }, 5000);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timeout);
            set({
              coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
              status: "granted",
            });
          },
          () => {
            clearTimeout(timeout);
            set({ coords: TASHKENT_FALLBACK, status: "denied" });
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 },
        );
      },
    }),
    { name: "mybarber-geo", partialize: (s) => ({ radiusKm: s.radiusKm }) },
  ),
);
