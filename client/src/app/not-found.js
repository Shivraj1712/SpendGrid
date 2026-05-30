import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
        <div className="bg-slate-50 text-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
          <Compass className="h-8 w-8 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            The page you are looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Back to Safety</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
