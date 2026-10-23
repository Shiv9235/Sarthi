"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AlertCircle, RotateCcw, X, Stethoscope, User, ShieldCheck } from "lucide-react";
import { StorageService } from "../../lib/data/storage";
import { useAuth } from "../../lib/context/AuthContext";

export function DemoBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDoctor, doctorProfile, loginAsDoctor, loginAsPatient } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleReset = () => {
    if (confirm("Reset demo data to default sample patient and doctor records?")) {
      StorageService.resetDemoData();
      window.location.reload();
    }
  };

  const handleSwitchToDoctor = async () => {
    await loginAsDoctor("doc_1");
    router.push("/doctor/dashboard");
  };

  const handleSwitchToPatient = async () => {
    await loginAsPatient();
    router.push("/dashboard");
  };

  return (
    <aside
      aria-label="Demo notice"
      className="bg-amber-50/95 border-b border-amber-200/90 px-3 sm:px-6 py-1.5 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 shrink-0 z-50"
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="text-xs">
          <strong className="font-semibold text-amber-950">Active Role:</strong>{" "}
          {isDoctor ? (
            <span className="inline-flex items-center gap-1 font-semibold text-primary-900 bg-primary-100/70 px-2 py-0.5 rounded-full text-[11px]">
              <ShieldCheck className="w-3 h-3 text-primary-700" />
              Doctor: {doctorProfile?.name || "Dr. Arvind Mehta"} ({doctorProfile?.verificationStatus === "verified" ? "Verified" : "Pending"})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-white/80 px-2 py-0.5 rounded-full text-[11px] border border-amber-200">
              <User className="w-3 h-3 text-slate-700" />
              Patient: Sunita Sharma
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Switcher Pill */}
        {isDoctor ? (
          <button
            onClick={handleSwitchToPatient}
            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 px-2.5 py-1 rounded-md shadow-2xs transition-colors"
            title="Switch to Patient Portal"
          >
            <User className="w-3 h-3 text-primary-700" />
            <span>Switch to Patient Portal</span>
          </button>
        ) : (
          <button
            onClick={handleSwitchToDoctor}
            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary-700 text-white hover:bg-primary-800 px-2.5 py-1 rounded-md shadow-2xs transition-colors"
            title="Switch to Doctor Portal"
          >
            <Stethoscope className="w-3 h-3 text-white" />
            <span>Switch to Doctor Portal</span>
          </button>
        )}

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 hover:text-amber-950 hover:underline px-1.5 py-0.5 rounded transition-colors"
          title="Reset sample data"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset Data</span>
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-amber-700 hover:text-amber-950 p-1"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
