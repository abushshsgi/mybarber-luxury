import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_NOTIFICATIONS } from "../mock/comms";
import type { Notification } from "../types";

type State = {
  items: Notification[];
  markAllRead: () => void;
  toggleRead: (id: string) => void;
  unreadCount: () => number;
};

export const useNotificationsStore = create<State>()(
  persist(
    (set, get) => ({
      items: MOCK_NOTIFICATIONS,
      markAllRead: () => set({ items: get().items.map((i) => ({ ...i, read: true })) }),
      toggleRead: (id) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, read: !i.read } : i)) }),
      unreadCount: () => get().items.filter((i) => !i.read).length,
    }),
    { name: "mybarber-notifications" },
  ),
);
