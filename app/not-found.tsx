import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-3">Page not found</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          The page you are looking for does not exist. It may have moved or been removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            Go home <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/au/pathways"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
          >
            Pathway Checker
          </Link>
        </div>
      </div>
    </div>
  );
}
