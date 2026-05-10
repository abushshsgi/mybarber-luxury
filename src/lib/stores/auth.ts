import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

type AuthState = {
  user: User | null;
  pendingPhone: string | null;
  setPendingPhone: (p: string | null) => void;
  loginWithOtp: (phone: string, code: string) => Promise<boolean>;
  logout: () => void;
  switchRoleDemo: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      pendingPhone: null,
      setPendingPhone: (p) => set({ pendingPhone: p }),
      loginWithOtp: async (phone, code) => {
        await new Promise((r) => setTimeout(r, 600));
        if (code.length !== 4) return false;
        const name = "Mehmon";
        set({
          user: { id: "u-self", name, phone, role: "customer" },
          pendingPhone: null,
        });
        return true;
      },
      logout: () => set({ user: null }),
      switchRoleDemo: () => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, role: u.role === "barber" ? "customer" : "barber" } });
      },
    }),
    { name: "mybarber-auth" },
  ),
);
