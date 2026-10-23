import Link from "next/link";
import {
  Heart,
  HeartHandshake,
  CalendarDays,
  FileText,
  Pill,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-ground text-slate-800 flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between border-b border-surface-border bg-white shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 border border-primary-200 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-primary-600 text-primary-600" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
              SARTHI
            </span>
            <span className="text-[11px] font-semibold text-primary-700 tracking-wider">
              Your Healthcare Companion
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-primary-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-xs transition-all"
          >
            Open Portal
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-primary-600" />
          Simple, Reliable Healthcare Services for You and Your Family
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
          Caring for your health,{" "}
          <span className="text-primary-700">every step of the way</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Book trusted home nursing care, consult experienced doctors, organize your pathology and scan reports, and manage daily prescriptions with ease.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/appointments"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-surface-border bg-white hover:bg-surface-muted text-slate-800 font-semibold text-base transition-colors"
          >
            Doctor Appointments
          </Link>
        </div>

        {/* 4 Clean Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-10 text-left">
          <Link
            href="/nursing"
            className="p-6 rounded-2xl bg-white border border-surface-border hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-primary-700 transition-colors">
              Nursing Services
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Post-operative care, elderly assistance, and home nursing visits.
            </p>
          </Link>

          <Link
            href="/appointments"
            className="p-6 rounded-2xl bg-white border border-surface-border hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-primary-700 transition-colors">
              Doctor Appointments
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Symptom guidance and scheduled clinic or video consultations.
            </p>
          </Link>

          <Link
            href="/reports"
            className="p-6 rounded-2xl bg-white border border-surface-border hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-primary-700 transition-colors">
              Medical Reports
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Pathology lab records, radiological scans, and test tracking.
            </p>
          </Link>

          <Link
            href="/prescriptions"
            className="p-6 rounded-2xl bg-white border border-surface-border hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
              <Pill className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-primary-700 transition-colors">
              Prescriptions
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Active medicines, dosing schedule, and pharmacy price check.
            </p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-5 border-t border-surface-border bg-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>SARTHI • Designed for Simple & Accessible Healthcare</p>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-primary-700 hover:underline font-medium">
            Open Patient Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}
