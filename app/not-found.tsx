import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, rgba(180,200,255,1) 0%, transparent 70%)" }} />
      </div>
      <div className="relative text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <Globe className="w-8 h-8" style={{ color: "var(--muted-foreground)" }} />
        </div>
        <h1 className="text-6xl font-bold mb-3" style={{ color: "var(--foreground)" }}>404</h1>
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--muted-foreground)" }}>Page not found</h2>
        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
          The page you are looking for does not exist. It may have moved or been removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all group"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Go home <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/au/pathways"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-xl border transition-all"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            Pathway Checker
          </Link>
        </div>
      </div>
    </div>
  );
}
