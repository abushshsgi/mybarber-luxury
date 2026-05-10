import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Paperclip, Send } from "lucide-react";
import { MOCK_CONVERSATIONS } from "@/lib/mock/comms";
import type { ChatMessage } from "@/lib/types";

export const Route = createFileRoute("/chat/$id")({
  component: ChatThread,
  loader: ({ params }) => {
    const c = MOCK_CONVERSATIONS.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return c;
  },
  notFoundComponent: () => <div className="p-6 text-center">Chat topilmadi</div>,
  errorComponent: ({ error }) => <div className="p-6">{error.message}</div>,
});

function ChatThread() {
  const conv = Route.useLoaderData();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(conv.messages);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    if (!text.trim()) return;
    const t = text.trim();
    setMessages((m) => [...m, { id: `m-${Date.now()}`, from: "me", text: t, time: now() }]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: `m-${Date.now()}-r`, from: "them", text: "Xabaringiz uchun rahmat! Tez orada javob beraman.", time: now() }]);
    }, 1500);
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pt-safe">
      <header className="flex items-center gap-3 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate({ to: "/chat" })} className="grid h-10 w-10 place-items-center rounded-full bg-muted" aria-label="Orqaga">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <img src={conv.peerAvatar} alt={conv.peerName} className="h-10 w-10 rounded-full object-cover" />
        <div className="flex-1">
          <h1 className="truncate text-sm font-semibold">{conv.peerName}</h1>
          <p className="truncate text-[11px] text-muted-foreground">{conv.salonName}</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={["flex", m.from === "me" ? "justify-end" : "justify-start"].join(" ")}>
            <div className={[
              "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-soft",
              m.from === "me" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-surface text-foreground rounded-bl-sm border border-border",
            ].join(" ")}>
              <p>{m.text}</p>
              <p className={m.from === "me" ? "mt-1 text-[10px] text-primary-foreground/60" : "mt-1 text-[10px] text-muted-foreground"}>{m.time}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-border bg-surface px-4 py-3">
              <span className="inline-flex gap-1">
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:120ms]" />
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:240ms]" />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-surface/95 px-3 pb-safe pt-2 backdrop-blur">
        <div className="flex items-end gap-2">
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-muted" aria-label="Biriktirish"><Paperclip className="h-4 w-4" /></button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1}
            placeholder="Xabar yozing..."
            className="max-h-32 flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-soft focus:border-gold focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button onClick={send} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-luxury" aria-label="Yuborish">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function now() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
