import type { Metadata } from "next";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your VisaSwitch account.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--background)" }}>
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse, rgba(180,200,255,1) 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
              <Globe className="w-5 h-5" style={{ color: "var(--muted-foreground)" }} />
            </div>
            <span className="font-bold text-xl tracking-tight" style={{ color: "var(--foreground)" }}>
              Visa<span style={{ color: "var(--muted-foreground)" }}>Switch</span>
            </span>
          </Link>
        </div>

        <div className="glass rounded-2xl p-8" style={{ border: "1px solid var(--border)" }}>
          <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: "var(--foreground)" }}>Welcome back</h1>
          <p className="text-zinc-500 text-sm text-center mb-7">Sync your progress across devices</p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>Email address</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                style={{ border: "1px solid var(--border)", background: "var(--muted)", color: "var(--foreground)" }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>Password</label>
                <Link href="/forgot-password" className="text-xs text-zinc-500 hover:opacity-80 transition-opacity">Forgot password?</Link>
              </div>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                style={{ border: "1px solid var(--border)", background: "var(--muted)", color: "var(--foreground)" }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: "var(--foreground)" }}>Create one free</Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-6">
          No account needed —{" "}
          <Link href="/au/guide" className="hover:opacity-80 transition-opacity" style={{ color: "var(--muted-foreground)" }}>start the free guide</Link>
        </p>
      </div>
    </div>
  );
}
