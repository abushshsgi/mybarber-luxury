import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calendar as CalendarIcon, Check } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import type { Salon, Barber, Service } from "@/lib/types";
import { generateSlots } from "@/lib/api/catalog";
import { formatSom } from "@/lib/format";
import { useBookingsStore } from "@/lib/stores/bookings";

type Props = {
  salon: Salon;
  initialBarber?: Barber;
  lockBarber?: boolean;
};

export function BookingFlow({ salon, initialBarber, lockBarber }: Props) {
  const navigate = useNavigate();
  const add = useBookingsStore((s) => s.add);
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [service, setService] = useState<Service | null>(null);
  const [barber, setBarber] = useState<Barber | null>(initialBarber ?? null);
  const [date, setDate] = useState<Date>(new Date());
  const [slot, setSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  useEffect(() => { if (step === 2 && lockBarber && barber) setStep(3); }, [step, lockBarber, barber]);

  const days = useMemo(() => Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i)), []);
  const slots = useMemo(() => generateSlots(date), [date]);

  function next() {
    if (step === 1 && service) setStep(lockBarber ? 3 : 2);
    else if (step === 2 && barber) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4 && slot) setStep(5);
  }

  function confirm() {
    if (!service || !barber || !slot) return;
    const [h, m] = slot.split(":").map(Number);
    const dt = new Date(date);
    dt.setHours(h, m, 0, 0);
    const id = `bk-${Date.now()}`;
    add({
      id,
      salonId: salon.id,
      salonName: salon.name,
      salonCover: salon.cover,
      barberId: barber.id,
      barberName: barber.name,
      service,
      date: dt.toISOString(),
      status: "upcoming",
      createdAt: new Date().toISOString(),
    });
    setConfirmed(id);
  }

  if (confirmed) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center bg-background px-6 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-success text-success-foreground shadow-luxury">
          <Check className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Bandlangan!</h1>
        <p className="mt-2 text-sm text-muted-foreground">{salon.name} · {barber?.name}</p>
        <p className="mt-1 text-sm font-medium">{format(date, "d MMM")} · {slot}</p>
        <div className="mt-8 flex w-full flex-col gap-2">
          <Link to="/bookings" className="rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground">Bandlovlarim</Link>
          <Link to="/" className="rounded-2xl border border-border bg-surface py-3.5 text-sm font-semibold">Asosiy</Link>
        </div>
      </div>
    );
  }

  const stepLabel = ["Xizmat", "Barber", "Sana", "Vaqt", "Tasdiqlash"][step - 1];

  return (
    <div className="mx-auto w-full max-w-md bg-background pb-32 pt-safe">
      <header className="flex items-center gap-3 px-5 pt-4">
        <button onClick={() => step > 1 ? setStep((step - 1) as 1 | 2 | 3 | 4 | 5) : navigate({ to: "/" })} className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface" aria-label="Orqaga">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <p className="label-eyebrow">{salon.name}</p>
          <h1 className="text-base font-bold">{stepLabel}</h1>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{step}/5</span>
      </header>

      <div className="mx-5 mt-3 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${(step / 5) * 100}%` }} />
      </div>

      <div className="px-5 pt-6">
        {step === 1 && (
          <ul className="space-y-2">
            {salon.services.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setService(s)}
                  className={[
                    "flex w-full items-center justify-between rounded-2xl border p-3.5 text-left shadow-soft transition",
                    service?.id === s.id ? "border-foreground bg-foreground text-background" : "border-border bg-surface",
                  ].join(" ")}
                >
                  <div>
                    <h3 className="text-sm font-semibold">{s.name}</h3>
                    <p className={service?.id === s.id ? "text-xs text-background/70" : "text-xs text-muted-foreground"}>{s.durationMin} daq</p>
                  </div>
                  <span className="text-sm font-bold">{formatSom(s.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {step === 2 && (
          <ul className="space-y-2">
            {salon.staff.map((b) => (
              <li key={b.id}>
                <button
                  onClick={() => setBarber(b)}
                  className={[
                    "flex w-full items-center gap-3 rounded-2xl border p-3 text-left shadow-soft transition",
                    barber?.id === b.id ? "border-foreground" : "border-border bg-surface",
                  ].join(" ")}
                >
                  <img src={b.avatar} alt={b.name} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <h3 className="text-sm font-semibold">{b.name}</h3>
                    <p className="text-xs text-muted-foreground">{b.specialties.join(" · ")}</p>
                  </div>
                  {barber?.id === b.id && <Check className="ml-auto h-5 w-5 text-foreground" />}
                </button>
              </li>
            ))}
          </ul>
        )}

        {step === 3 && (
          <div>
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none">
              {days.map((d) => {
                const active = isSameDay(d, date);
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => setDate(d)}
                    className={[
                      "flex shrink-0 flex-col items-center rounded-2xl border px-4 py-3 transition",
                      active ? "border-foreground bg-foreground text-background" : "border-border bg-surface",
                    ].join(" ")}
                  >
                    <span className={active ? "text-[10px] uppercase text-background/70" : "text-[10px] uppercase text-muted-foreground"}>{format(d, "EEE")}</span>
                    <span className="mt-0.5 text-lg font-bold">{format(d, "d")}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarIcon className="h-3.5 w-3.5" /> {format(date, "EEEE, d MMM yyyy")}
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={[
                  "rounded-2xl border py-3 text-sm font-semibold transition",
                  slot === s ? "border-foreground bg-foreground text-background" : "border-border bg-surface",
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {step === 5 && service && barber && slot && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
              <img src={salon.cover} alt={salon.name} className="h-32 w-full object-cover" />
              <div className="space-y-2 p-4">
                <h3 className="text-base font-bold">{salon.name}</h3>
                <p className="text-xs text-muted-foreground">{salon.address}</p>
                <hr className="border-border" />
                <Row label="Barber" value={barber.name} />
                <Row label="Xizmat" value={service.name} />
                <Row label="Davomiylik" value={`${service.durationMin} daq`} />
                <Row label="Sana" value={format(date, "d MMM, yyyy")} />
                <Row label="Vaqt" value={slot} />
                <hr className="border-border" />
                <div className="flex items-center justify-between pt-1">
                  <span className="label-eyebrow">Jami</span>
                  <span className="text-lg font-bold">{formatSom(service.price)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-border bg-surface/95 px-5 pb-safe pt-3 backdrop-blur">
        {step < 5 ? (
          <button
            onClick={next}
            disabled={(step === 1 && !service) || (step === 2 && !barber) || (step === 4 && !slot)}
            className="grid h-12 w-full place-items-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            Davom etish
          </button>
        ) : (
          <button onClick={confirm} className="grid h-12 w-full place-items-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
            Tasdiqlash va band qilish
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
