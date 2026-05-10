import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { ArrowLeft, Phone, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const loginWithOtp = useAuthStore((s) => s.loginWithOtp);

  useEffect(() => { if (step === "otp") inputs.current[0]?.focus(); }, [step]);

  async function submitPhone(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (phone.replace(/\D/g, "").length < 9) {
      setError("Telefon raqamni to'liq kiriting");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setStep("otp");
  }

  async function verify() {
    const c = code.join("");
    if (c.length !== 4) return;
    setLoading(true);
    setError("");
    const ok = await loginWithOtp(phone, c);
    setLoading(false);
    if (ok) navigate({ to: "/" });
    else setError("Kod noto'g'ri");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-5 pt-safe">
      <header className="flex items-center pt-4">
        <button
          onClick={() => step === "otp" ? setStep("phone") : navigate({ to: "/" })}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface"
          aria-label="Orqaga"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </header>

      <div className="mt-10 flex-1">
        <p className="label-eyebrow">MyBarber</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance">
          {step === "phone" ? "Telefon raqamingiz" : "Tasdiqlash kodi"}
          <span className="text-gold">.</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === "phone"
            ? "SMS orqali 4 xonali kod yuboramiz."
            : `${phone} raqamiga yuborilgan kodni kiriting.`}
        </p>

        {step === "phone" ? (
          <form onSubmit={submitPhone} className="mt-8 space-y-3">
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-4 shadow-soft focus-within:border-gold focus-within:ring-2 focus-within:ring-ring">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">+998</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
                placeholder="90 123 45 67"
                inputMode="tel"
                className="flex-1 bg-transparent text-base font-medium tracking-wide focus:outline-none"
                aria-label="Telefon raqam"
              />
            </label>
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Yuborilmoqda..." : "Kodni yuborish"}
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between gap-3">
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  value={d}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(-1);
                    const next = [...code];
                    next[i] = v;
                    setCode(next);
                    if (v && i < 3) inputs.current[i + 1]?.focus();
                    if (next.every(Boolean)) setTimeout(verify, 100);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-16 w-full rounded-2xl border border-border bg-surface text-center text-2xl font-bold shadow-soft focus:border-gold focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={`Raqam ${i + 1}`}
                />
              ))}
            </div>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Demo rejimida har qanday 4 xonali kod ishlaydi.
            </p>
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
            <button
              onClick={verify}
              disabled={loading || code.join("").length !== 4}
              className="w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Tekshirilmoqda..." : "Tasdiqlash"}
            </button>
          </div>
        )}
      </div>

      <p className="pb-6 pt-4 text-center text-[11px] text-muted-foreground">
        Davom etish orqali siz Foydalanish shartlari va Maxfiylik siyosatiga rozisiz.
      </p>
    </div>
  );
}
