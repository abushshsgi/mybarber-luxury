import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Booking } from "../types";

type State = {
  bookings: Booking[];
  add: (b: Booking) => void;
  cancel: (id: string) => void;
};

export const useBookingsStore = create<State>()(
  persist(
    (set) => ({
      bookings: [],
      add: (b) => set((s) => ({ bookings: [b, ...s.bookings] })),
      cancel: (id) =>
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
        })),
    }),
    { name: "mybarber-bookings" },
  ),
);
