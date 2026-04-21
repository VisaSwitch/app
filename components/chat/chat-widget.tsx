"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  MessageCircle, X, Send, Bot, User, Loader2, AlertTriangle, RotateCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { countryList } from "@/data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const SUGGESTIONS = [
  "What visa do I need to work in Australia?",
  "How long does a UK Skilled Worker visa take?",
  "What is Canada Express Entry points score?",
  "Can I study in Japan on a working holiday?",
];

function parseMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code class='bg-black/10 dark:bg-white/10 px-1 rounded text-xs font-mono'>$1</code>")
    // Bullet points
    .replace(/^[•\-] (.+)$/gm, "<li class='ml-3 list-disc'>$1</li>")
    // Numbered list
    .replace(/^\d+\. (.+)$/gm, "<li class='ml-3 list-decimal'>$1</li>")
    // Line breaks
    .replace(/\n{2,}/g, "</p><p class='mt-2'>")
    .replace(/\n/g, "<br/>");
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pathname = usePathname();

  // Detect country context from current pathname
  const countryCode = pathname.split("/")[1];
  const currentCountry = countryList.find((c) => c.code === countryCode);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true;
    setIsPWA(standalone);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || streaming) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content };
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setStreaming(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content },
          ],
          countryCode: countryCode || undefined,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m))
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Something went wrong. Please try again.", error: true }
            : m
        )
      );
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setStreaming(false);
  }

  const showSuggestions = messages.length === 0;

  return (
    <>
      {/* ── Floating toggle button ─────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed z-40 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95",
          isPWA ? "bottom-[calc(72px+env(safe-area-inset-bottom,0px)+12px)] right-4" : "bottom-6 right-4",
          "w-13 h-13"
        )}
        style={{ background: "var(--primary)", color: "var(--primary-foreground)", width: 52, height: 52 }}
        aria-label={open ? "Close chat" : "Open visa assistant"}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* ── Chat panel ─────────────────────────────────────────────── */}
      {open && (
        <div
          className={cn(
            "fixed z-40 flex flex-col rounded-2xl border shadow-2xl overflow-hidden",
            // Mobile: full-width bottom sheet above the button
            "bottom-[calc(72px+env(safe-area-inset-bottom,0px)+12px)] inset-x-3",
            // Desktop: compact side panel
            "sm:inset-x-auto sm:right-4 sm:w-[380px]",
            isPWA
              ? "sm:bottom-[calc(72px+env(safe-area-inset-bottom,0px)+12px)]"
              : "sm:bottom-20"
          )}
          style={{
            background: "var(--background)",
            borderColor: "var(--border)",
            maxHeight: "min(560px, calc(100dvh - 180px))",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b flex-shrink-0"
            style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--primary)" }}>
              <Bot className="w-4 h-4" style={{ color: "var(--primary-foreground)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-none" style={{ color: "var(--foreground)" }}>Visa Assistant</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {currentCountry ? `${currentCountry.name} context active` : "AU · UK · CA · JP"}
              </p>
            </div>
            {messages.length > 0 && (
              <button onClick={clearChat} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" title="Clear chat">
                <RotateCw className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
              </button>
            )}
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity">
              <X className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">

            {/* Welcome */}
            {showSuggestions && (
              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "var(--primary)" }}>
                    <Bot className="w-3.5 h-3.5" style={{ color: "var(--primary-foreground)" }} />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm px-3 py-2.5 text-sm leading-relaxed"
                    style={{ background: "var(--muted)", color: "var(--foreground)" }}>
                    Hi! Ask me anything about visas for Australia, UK, Canada or Japan — processing times, eligibility, fees, and more.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pl-8">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => sendMessage(s)}
                      className="text-[11px] px-2.5 py-1.5 rounded-full border hover:opacity-80 transition-opacity text-left"
                      style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", background: "var(--muted)" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-2.5", msg.role === "user" && "flex-row-reverse")}>
                {/* Avatar */}
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                  msg.role === "user" ? "bg-zinc-200 dark:bg-zinc-700" : ""
                )}
                  style={msg.role === "assistant" ? { background: "var(--primary)" } : undefined}>
                  {msg.role === "assistant"
                    ? <Bot className="w-3.5 h-3.5" style={{ color: "var(--primary-foreground)" }} />
                    : <User className="w-3.5 h-3.5" style={{ color: "var(--foreground)" }} />}
                </div>

                {/* Bubble */}
                <div className={cn(
                  "rounded-2xl px-3 py-2.5 text-sm leading-relaxed max-w-[82%]",
                  msg.role === "user"
                    ? "rounded-tr-sm"
                    : "rounded-tl-sm",
                  msg.error && "border border-red-500/30"
                )}
                  style={{
                    background: msg.role === "user" ? "var(--primary)" : "var(--muted)",
                    color: msg.role === "user" ? "var(--primary-foreground)" : "var(--foreground)",
                  }}>
                  {msg.role === "assistant" && msg.content === "" ? (
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--muted-foreground)" }} />
                  ) : msg.error ? (
                    <span className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {msg.content}
                    </span>
                  ) : (
                    <div
                      className="prose-sm"
                      dangerouslySetInnerHTML={{ __html: `<p class='mt-0'>${parseMarkdown(msg.content)}</p>` }}
                    />
                  )}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* Disclaimer */}
          <div className="px-3 py-1.5 border-t flex-shrink-0" style={{ borderColor: "var(--border)" }}>
            <p className="text-[10px] text-center" style={{ color: "var(--muted-foreground)" }}>
              Not legal advice · Always verify with official government sources
            </p>
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-1.5 flex-shrink-0">
            <div className="flex items-end gap-2 rounded-xl border px-3 py-2"
              style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about visas…"
                rows={1}
                className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed"
                style={{
                  color: "var(--foreground)",
                  maxHeight: 96,
                  overflow: input.split("\n").length > 3 ? "auto" : "hidden",
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || streaming}
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 hover:opacity-80"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                {streaming
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
