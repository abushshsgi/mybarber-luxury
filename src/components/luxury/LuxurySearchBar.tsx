import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export function LuxurySearchBar({
  value,
  onChange,
  placeholder = "Salon yoki barber qidirish...",
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 300);
    return () => clearTimeout(t);
  }, [local, onChange, value]);

  return (
    <label className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 shadow-luxury transition focus-within:ring-2 focus-within:ring-gold">
      <Search className="h-5 w-5 text-muted-foreground" aria-hidden />
      <input
        autoFocus={autoFocus}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        aria-label={placeholder}
      />
      {local && (
        <button
          type="button"
          onClick={() => setLocal("")}
          className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          aria-label="Tozalash"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </label>
  );
}
