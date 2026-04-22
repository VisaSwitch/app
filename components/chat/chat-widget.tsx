"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageCircle, X, Send, Globe, User, Loader2, AlertTriangle, RotateCw,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { countryList } from "@/data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

interface Action {
  label: string;
  href: string;
}

const SUGGESTIONS = [
  "What visa do I need to work in Australia?",
  "How long does a UK Skilled Worker visa take?",
  "What is Canada Express Entry points score?",
  "Can I study in Japan on a working holiday?",
];

// ── Suggest actions based on response content + country ────────────────────
function getActions(content: string, countryCode?: string): Action[] {
  const lower = content.toLowerCase();
  const code = countryCode && ["au", "uk", "ca", "jp"].includes(countryCode)
    ? countryCode : null;

  const actions: Action[] = [];

  // Always offer the full guide for the current country
  if (code) {
    if (/work|employ|skill|sponsor|occupation|subclass|482|189|190|485|skilled worker|express entry|engineer/.test(lower))
      actions.push({ label: "Start visa guide", href: `/${code}/guide` });

    if (/pathway|option|visa type|which visa|right visa|compare/.test(lower))
      actions.push({ label: "View all pathways", href: `/${code}/pathways` });

    if (/eligib|qualify|requirement|criteria|age|english|point/.test(lower))
      actions.push({ label: "Check my eligibility", href: `/${code}/guide` });

    if (/risk|refus|reject|denied|chance|success|problem/.test(lower))
      actions.push({ label: "Run risk audit", href: `/${code}/audit` });

    if (/checklist|document|prepare|gather|evidence|proof/.test(lower))
      actions.push({ label: "Build my checklist", href: `/${code}/planner` });

    if (/refusal|refused|appeal|reapply|second|recover/.test(lower))
      actions.push({ label: "Refusal recovery", href: `/${code}/recovery` });
  } else {
    // No country context — suggest country landing pages based on mention
    if (/australia|au\b|subclass/.test(lower))
      actions.push({ label: "Australia guide", href: "/au/guide" });
    if (/uk|united kingdom|britain|skilled worker|graduate route/.test(lower))
      actions.push({ label: "UK guide", href: "/uk/guide" });
    if (/canada|express entry|pnp|pgwp/.test(lower))
      actions.push({ label: "Canada guide", href: "/ca/guide" });
    if (/japan|engineer|hsp|working holiday jp/.test(lower))
      actions.push({ label: "Japan guide", href: "/jp/guide" });
  }

  // Deduplicate by href and limit to 3
  const seen = new Set<string>();
  return actions.filter((a) => {
    if (seen.has(a.href)) return false;
    seen.add(a.href);
    return true;
  }).slice(0, 3);
}

// ── Simple markdown renderer ────────────────────────────────────────────────
function parseMarkdown(text: string): string {
  return text
    .replace(/### (.+)$/gm, "<strong class='block mt-2 mb-0.5'>$1</strong>")
    .replace(/## (.+)$/gm, "<strong class='block mt-2 mb-1 text-base'>$1</strong>")
    .replace(/# (.+)$/gm, "<strong class='block mt-1 mb-1'>$1</strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code class='bg-black/10 dark:bg-white/10 px-1 rounded text-xs font-mono'>$1</code>")
    .replace(/^[•\-\*] (.+)$/gm, "<li class='ml-3 list-disc'>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li class='ml-3 list-decimal'>$1</li>")
    .replace(/\n{2,}/g, "</p><p class='mt-2'>")
    .replace(/\n/g, "<br/>");
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);        // messages container
  const streamingMsgRef = useRef<HTMLDivElement>(null);  // top of streaming message
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const streamingIdRef = useRef<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const countryCode = pathname.split("/")[1];
  const currentCountry = countryList.find((c) => c.code === countryCode);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true;
    setIsPWA(standalone);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // When a new assistant message starts, scroll its top into view so the
  // first line is always visible. During streaming we do NOT force-scroll,
  // letting the user read from the top naturally.
  useEffect(() => {
    if (streaming) {
      // Scroll the top of the new assistant bubble into view
      streamingMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // After streaming ends, scroll the bottom into view so action buttons are visible
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || streaming) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content };
    const assistantId = crypto.randomUUID();
    streamingIdRef.current = assistantId;

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
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

      if (!res.ok || !res.body) {
        const raw = await res.text();
        const isPlain = raw.length < 300 && !raw.trimStart().startsWith("<");
        throw new Error(isPlain ? raw : res.status >= 500
          ? "Something went wrong on our end. Please try again."
          : "Request failed. Please try again."
        );
      }

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
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setMessages((prev) =>
        prev.map((m) => m.id === assistantId ? { ...m, content: msg, error: true } : m)
      );
    } finally {
      setStreaming(false);
      streamingIdRef.current = null;
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setStreaming(false);
  }

  const showSuggestions = messages.length === 0;
  const lastAssistant = !streaming
    ? messages.filter((m) => m.role === "assistant" && !m.error && m.content).at(-1)
    : null;
  const actions = lastAssistant ? getActions(lastAssistant.content, countryCode) : [];

  return (
    <>
      {/* ── Floating toggle button ─────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed z-40 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95",
          isPWA ? "bottom-[calc(72px+env(safe-area-inset-bottom,0px)+12px)] right-4" : "bottom-6 right-4",
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
            "bottom-[calc(72px+env(safe-area-inset-bottom,0px)+12px)] inset-x-3",
            "sm:inset-x-auto sm:right-4 sm:w-[380px]",
            isPWA
              ? "sm:bottom-[calc(72px+env(safe-area-inset-bottom,0px)+12px)]"
              : "sm:bottom-20"
          )}
          style={{
            background: "var(--background)",
            borderColor: "var(--border)",
            maxHeight: "min(580px, calc(100dvh - 160px))",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b flex-shrink-0"
            style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--primary)" }}>
              <Globe className="w-4 h-4" style={{ color: "var(--primary-foreground)" }} />
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

          {/* Messages — scrollable container */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">

            {/* Welcome + suggestions */}
            {showSuggestions && (
              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "var(--primary)" }}>
                    <Globe className="w-3.5 h-3.5" style={{ color: "var(--primary-foreground)" }} />
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
            {messages.map((msg, i) => {
              const isLast = i === messages.length - 1;
              const isLastAssistant = isLast && msg.role === "assistant";
              const isStreamingMsg = isLastAssistant && streaming;
              const showActions = isLastAssistant && !streaming && !msg.error && actions.length > 0;

              return (
                <div key={msg.id} className="space-y-2" ref={isStreamingMsg ? streamingMsgRef : undefined}>
                  <div className={cn("flex gap-2.5", msg.role === "user" && "flex-row-reverse")}>
                    {/* Avatar */}
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={msg.role === "assistant"
                        ? { background: "var(--primary)" }
                        : { background: "var(--muted)" }}>
                      {msg.role === "assistant"
                        ? <Globe className="w-3.5 h-3.5" style={{ color: "var(--primary-foreground)" }} />
                        : <User className="w-3.5 h-3.5" style={{ color: "var(--foreground)" }} />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={cn(
                        "rounded-2xl px-3 py-2.5 text-sm leading-relaxed max-w-[82%]",
                        msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm",
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

                  {/* Action buttons — shown below last assistant message */}
                  {showActions && (
                    <div className="flex flex-wrap gap-2 pl-8">
                      {actions.map((action) => (
                        <button
                          key={action.href}
                          onClick={() => { router.push(action.href); setOpen(false); }}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all hover:opacity-80 active:scale-95"
                          style={{ borderColor: "var(--border)", background: "var(--muted)", color: "var(--foreground)" }}
                        >
                          {action.label}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom anchor */}
            <div style={{ height: 1 }} />
          </div>

          {/* Disclaimer */}
          <div className="px-3 py-1.5 border-t flex-shrink-0" style={{ borderColor: "var(--border)" }}>
            <p className="text-[10px] text-center" style={{ color: "var(--muted-foreground)" }}>
              Not legal advice · Always verify with official government sources
            </p>
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-1.5 flex-shrink-0">
            <div className="relative flex items-end gap-2 rounded-xl border px-3 py-2"
              style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value.slice(0, 1000));
                  // Auto-resize: reset then grow to content
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 96) + "px";
                }}
                onKeyDown={handleKey}
                placeholder="Ask about visas…"
                maxLength={1000}
                rows={1}
                className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed"
                style={{ color: "var(--foreground)", maxHeight: 96, overflowY: "auto" }}
              />
              {input.length > 800 && (
                <span className="absolute bottom-2 right-12 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                  {1000 - input.length}
                </span>
              )}
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
