"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Filter,
  ShieldCheck,
  User,
} from "lucide-react";
import { DoctorAppShell } from "../../../components/layout/DoctorAppShell";
import { Button } from "../../../components/ui/Button";
import { StorageService } from "../../../lib/data/storage";
import { MedicalReport } from "../../../lib/types";

export default function DoctorReportsQueuePage() {
  const router = useRouter();
  const [reports, setReports] = useState<MedicalReport[]>([]);

  useEffect(() => {
    const list = StorageService.getReports();
    setReports(list);
  }, []);

  return (
    <DoctorAppShell>
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-700" />
            Patient Diagnostic Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review structured pathology lab tests, radiological imaging scans, and attach doctor clinical notes for patients.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-600 bg-surface-ground px-3 py-1.5 rounded-xl border border-surface-border">
          Total Reports on File: {reports.length}
        </span>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs hover:border-primary-300 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    {report.title}
                  </h2>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      report.status === "doctor_approved"
                        ? "bg-primary-100 text-primary-800"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {report.status === "doctor_approved" ? "✓ Doctor Approved" : "⏳ Pending Doctor Sign-off"}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-surface-ground px-2 py-0.5 rounded-md border border-surface-border">
                    {report.reportType.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Facility: <strong>{report.facilityName}</strong> • Date: <strong>{report.reportDate}</strong>
                </p>

                <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
                  {report.plainLanguageExplanation}
                </p>

                {report.doctorNotes && (
                  <div className="mt-2 p-3 rounded-xl bg-primary-50/60 border border-primary-200 text-xs text-primary-950">
                    <strong className="block font-semibold mb-0.5">Doctor Interpretation:</strong>
                    <p>{report.doctorNotes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => router.push(`/doctor/reports/${report.id}`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {report.status === "doctor_approved" ? "View Measurements" : "Review & Sign Off"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DoctorAppShell>
  );
}
