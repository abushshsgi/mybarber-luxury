import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Globe, LogOut, Moon, Scissors, Settings, Shield, Sparkles, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth";
import { initials } from "@/lib/format";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const switchRole = useAuthStore((s) => s.switchRoleDemo);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="px-4 pt-safe">
        <header className="pb-4 pt-6">
          <p className="label-eyebrow">Profil</p>
          <h1 className="text-2xl font-bold tracking-tight">Kirish</h1>
        </header>
        <div className="rounded-3xl border border-border bg-surface p-6 text-center shadow-card">
          <UserIcon className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-3 text-base font-semibold">Hisobingizga kiring</h3>
          <p className="mt-1 text-sm text-muted-foreground">Telefon raqamingiz bilan tezda kiring va bandlovlaringizni saqlang.</p>
          <Link to="/auth" className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Kirish / Ro'yxatdan o'tish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-safe">
      <header className="pb-4 pt-6">
        <div className="flex items-center gap-4 rounded-3xl border border-border bg-gradient-to-br from-surface to-secondary p-4 shadow-card">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
            {initials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="label-eyebrow">{user.role === "barber" ? "Barber" : "Mijoz"}</p>
            <h1 className="truncate text-xl font-bold">{user.name}</h1>
            <p className="truncate text-xs text-muted-foreground">{user.phone}</p>
          </div>
        </div>
      </header>

      {user.role === "barber" && (
        <a
          href="#"
          className="mb-3 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-foreground to-foreground/85 p-4 text-background shadow-card"
        >
          <Scissors className="h-5 w-5 text-gold" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Barber panelini ochish</p>
            <p className="text-xs text-background/70">Mijoz va boshqaruv ekranlari</p>
          </div>
          <ChevronRight className="h-4 w-4" />
        </a>
      )}

      <section className="space-y-2">
        <Row icon={Settings} label="Sozlamalar" />
        <Row icon={Moon} label="Tashqi ko'rinish" hint="Light" />
        <Row icon={Globe} label="Til" hint="O'zbek" />
        <Row icon={Shield} label="Maxfiylik" />
        <Row icon={Sparkles} label="Premium a'zolik" hint="Tez orada" />
      </section>

      <button
        type="button"
        onClick={switchRole}
        className="mt-3 w-full rounded-2xl border border-dashed border-border bg-surface/50 px-4 py-3 text-xs font-semibold text-muted-foreground"
      >
        Demo: Rolni almashtirish ({user.role})
      </button>

      <button
        type="button"
        onClick={() => { logout(); navigate({ to: "/" }); }}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold text-destructive shadow-soft"
      >
        <LogOut className="h-4 w-4" /> Chiqish
      </button>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">MyBarber · v1.0</p>
    </div>
  );
}

function Row({ icon: Icon, label, hint }: { icon: typeof Settings; label: string; hint?: string }) {
  return (
    <button type="button" className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 text-left shadow-soft">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
