"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Pill,
  User,
  ShieldAlert,
} from "lucide-react";
import { DoctorAppShell } from "../../../components/layout/DoctorAppShell";
import { Button } from "../../../components/ui/Button";
import { StorageService } from "../../../lib/data/storage";
import { MedicationProblemReport } from "../../../lib/types";

export default function DoctorMedicationProblemsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<MedicationProblemReport[]>([]);

  useEffect(() => {
    // If no reports currently saved in localStorage, provide a sample report from Sunita Sharma
    let list = StorageService.getMedicationProblems();
    if (list.length === 0) {
      const sampleReport: MedicationProblemReport = {
        id: "prob_demo_001",
        patientId: "patient_001",
        medicineName: "Telma 40 Tablet (Telmisartan)",
        problemType: "suspected_side_effect",
        severity: "moderate",
        description:
          "Experiencing mild lightheadedness and feeling dizzy approximately 45 minutes after taking the morning tablet, especially when standing up quickly.",
        onsetDate: "2026-10-21",
        emergencyScreeningTriggered: false,
        status: "submitted",
        isDemo: true,
        createdAt: "2026-10-21T09:30:00Z",
      };
      StorageService.saveMedicationProblem(sampleReport);
      list = [sampleReport];
    }
    setReports(list);
  }, []);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "urgent":
      case "severe":
        return "bg-red-100 text-red-800 border-red-200";
      case "moderate":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <DoctorAppShell>
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            Patient Medication-Problem Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review side effects, adverse drug reactions, and dosage tolerance reported by patients under your care.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-600 bg-surface-ground px-3 py-1.5 rounded-xl border border-surface-border">
          Active Reports: {reports.filter((r) => r.status === "submitted").length}
        </span>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs hover:border-amber-300 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    {report.medicineName}
                  </h2>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getSeverityBadge(
                      report.severity
                    )}`}
                  >
                    {report.severity.toUpperCase()} SEVERITY
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-surface-ground px-2 py-0.5 rounded-md border border-surface-border">
                    Type: {report.problemType.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      report.status === "doctor_responded"
                        ? "bg-primary-100 text-primary-800"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {report.status === "doctor_responded" ? "✓ Responded" : "⏳ Pending Review"}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                  {report.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                  <span>Patient: <strong className="text-slate-800">Sunita Sharma</strong></span>
                  <span>•</span>
                  <span>Onset Date: <strong>{report.onsetDate}</strong></span>
                  <span>•</span>
                  <span>Reported: {new Date(report.createdAt).toLocaleDateString("en-IN")}</span>
                </div>

                {report.doctorResponseNotes && (
                  <div className="mt-2 p-3 rounded-xl bg-primary-50/60 border border-primary-200 text-xs">
                    <strong className="text-primary-950 block font-semibold mb-0.5">Your Clinical Response:</strong>
                    <p className="text-primary-900">{report.doctorResponseNotes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => router.push(`/doctor/medication-problems/${report.id}`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {report.status === "doctor_responded" ? "View Triage Details" : "Triage & Respond"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DoctorAppShell>
  );
}
