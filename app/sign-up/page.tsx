import type { Metadata } from "next";
import Link from "next/link";
import { Globe, ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free VisaSwitch account.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">
              Visa<span className="text-blue-600">Switch</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">Create your account</h1>
          <p className="text-slate-500 text-sm text-center mb-6">Free forever — no credit card required</p>

          <div className="flex gap-4 justify-center mb-7">
            {["Free pathway check", "Save results", "Build checklists"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-slate-600">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Full name</label>
              <input
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Email address</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Create free account
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 font-semibold hover:text-blue-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
