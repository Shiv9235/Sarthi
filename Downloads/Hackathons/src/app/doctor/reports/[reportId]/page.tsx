"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Building,
  Calendar,
} from "lucide-react";
import { DoctorAppShell } from "../../../../components/layout/DoctorAppShell";
import { Button } from "../../../../components/ui/Button";
import { Alert } from "../../../../components/ui/Alert";
import { useAuth } from "../../../../lib/context/AuthContext";
import { StorageService } from "../../../../lib/data/storage";
import { MedicalReport } from "../../../../lib/types";

export default function DoctorReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.reportId as string;
  const { doctorProfile } = useAuth();

  const [report, setReport] = useState<MedicalReport | null>(null);
  const [doctorNotes, setDoctorNotes] = useState(
    "Fasting glucose and HbA1c demonstrate encouraging improvement (down to 6.8%). Kidney filtration remains optimal. Recommend continuing Glycomet 500 BD and adding low-dose statin for LDL management."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const r = StorageService.getReportById(reportId) || StorageService.getReports()[0];
    if (r) {
      setReport(r);
      if (r.doctorNotes) {
        setDoctorNotes(r.doctorNotes);
      }
    }
  }, [reportId]);

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorNotes.trim()) return;

    setIsLoading(true);
    const doctorName = doctorProfile?.name || "Dr. Arvind Mehta, MD";
    StorageService.approveMedicalReport(reportId, doctorName, doctorNotes);
    setIsLoading(false);

    setSuccessMessage("Report approved and clinical interpretation shared with patient.");
    // Refresh report state
    const updated = StorageService.getReportById(reportId);
    if (updated) setReport(updated);
  };

  if (!report) {
    return (
      <DoctorAppShell>
        <div className="p-8 text-center bg-white rounded-2xl border border-surface-border">
          <p className="text-sm text-slate-500">Report not found.</p>
        </div>
      </DoctorAppShell>
    );
  }

  const isApproved = report.status === "doctor_approved";

  return (
    <DoctorAppShell>
      <div className="flex items-center justify-between">
        <Link
          href="/doctor/reports"
          className="text-xs font-semibold text-primary-800 hover:underline"
        >
          ← Back to Report Queue
        </Link>
        <div className="flex items-center gap-2">
          {isApproved ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800 border border-primary-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-700" />
              Doctor Approved & Shared
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Awaiting Doctor Sign-off
            </span>
          )}
        </div>
      </div>

      {successMessage && <Alert type="success">{successMessage}</Alert>}

      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{report.title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Facility: <strong>{report.facilityName}</strong> • Date: <strong>{report.reportDate}</strong>
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono bg-surface-ground px-3 py-1.5 rounded-lg border border-surface-border">
            Source: {report.sourceFileName}
          </span>
        </div>

        {/* Extracted Measurements Table */}
        <div className="pt-6">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Extracted Clinical Measurements ({report.measurements.length} Tests)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-surface-border rounded-xl overflow-hidden">
              <thead className="bg-surface-ground text-slate-600 border-b border-surface-border">
                <tr>
                  <th className="p-3">Test Parameter</th>
                  <th className="p-3">Observed Value</th>
                  <th className="p-3">Reference Range</th>
                  <th className="p-3">Clinical Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {report.measurements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-semibold text-slate-900">{m.testName}</td>
                    <td className="p-3 font-bold text-slate-900">
                      {m.valueText} {m.unit}
                    </td>
                    <td className="p-3 text-slate-500">{m.referenceText}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          m.isAbnormal
                            ? "bg-amber-100 text-amber-800"
                            : "bg-primary-100 text-primary-800"
                        }`}
                      >
                        {m.flag || (m.isAbnormal ? "ELEVATED" : "NORMAL")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Review & Interpretation Form */}
        <form onSubmit={handleApprove} className="mt-8 pt-6 border-t border-surface-border space-y-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-primary-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Doctor Interpretation & Sign-off Notes
            </h2>
          </div>

          <textarea
            rows={3}
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            placeholder="Add your clinical interpretation, reassurance, or guidance for the patient..."
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none leading-relaxed"
            required
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Signed by: <strong className="text-slate-800">{doctorProfile?.name || "Dr. Arvind Mehta"}</strong>
            </span>

            <Button
              type="submit"
              size="sm"
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Approve Report & Share with Patient
            </Button>
          </div>
        </form>
      </div>
    </DoctorAppShell>
  );
}
