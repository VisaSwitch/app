import type { Metadata } from "next";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your VisaSwitch account.",
};

export default function SignInPage() {
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
          <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">Welcome back</h1>
          <p className="text-slate-500 text-sm text-center mb-7">Sign in to your VisaSwitch account</p>

          <form className="space-y-4">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-800">Password</label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">Forgot password?</Link>
              </div>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 font-semibold hover:text-blue-700">Create one free</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Continue without an account —{" "}
          <Link href="/au/pathways" className="text-blue-600 hover:text-blue-700">free pathway check</Link>
        </p>
      </div>
    </div>
  );
}
