import type { Metadata } from "next";
import Link from "next/link";
import { Globe, ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free VisaSwitch account.",
};

export default function SignUpPage() {
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
          <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: "var(--foreground)" }}>Create your account</h1>
          <p className="text-zinc-500 text-sm text-center mb-5">Free forever — no credit card required</p>

          <div className="flex flex-wrap gap-3 justify-center mb-7">
            {["Free pathway check", "Save results", "Build checklists"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500/70" />
                {item}
              </div>
            ))}
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>Full name</label>
              <input
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                style={{ border: "1px solid var(--border)", background: "var(--muted)", color: "var(--foreground)" }}
              />
            </div>
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
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>Password</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                style={{ border: "1px solid var(--border)", background: "var(--muted)", color: "var(--foreground)" }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Create free account
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-4">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="hover:opacity-80 transition-opacity" style={{ color: "var(--muted-foreground)" }}>Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="hover:opacity-80 transition-opacity" style={{ color: "var(--muted-foreground)" }}>Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm text-zinc-500 mt-4">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: "var(--foreground)" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
