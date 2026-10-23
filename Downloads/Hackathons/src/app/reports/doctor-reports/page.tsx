"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck2,
  FileText,
  UserCheck,
  ShieldCheck,
  Clock,
  Download,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Badge, StatusBadge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { StorageService } from "../../../lib/data/storage";
import { MedicalReport } from "../../../lib/types";

export default function DoctorReportsPage() {
  const [reports, setReports] = useState<MedicalReport[]>([]);

  useEffect(() => {
    // Filter only doctor-shared / doctor-approved reports
    const all = StorageService.getReports();
    setReports(all.filter((r) => r.isDoctorShared || r.status === "doctor_approved"));
  }, []);

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/reports" className="hover:text-emerald-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Reports Hub
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Doctor-Shared Reports</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Doctor's Reports & Approvals
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Diagnostic laboratory reports shared, annotated, and approved by your attending physicians.
            </p>
          </div>
        </div>

        {/* Regulatory & Safety Transparency Callout */}
        <div className="p-4 rounded-xl bg-primary-50 border border-primary-200 text-xs text-primary-950 space-y-1">
          <strong className="block font-bold">
            Clinical Distinction Standard:
          </strong>
          SARTHI strictly separates AI-generated draft text from clinician-authored statements. Only notes and explanations marked with <strong className="text-primary-900">Doctor Approved</strong> have been reviewed and validated by a licensed physician.
        </div>

        {/* Doctor-Shared Reports List */}
        {reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <FileCheck2 className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800">No Doctor-Shared Reports Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When your doctor completes their review of an ordered test, the approved report and clinical notes will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((rep) => (
              <Card key={rep.id} className="border-teal-200/90 shadow-xs">
                <CardHeader className="py-4 bg-teal-50/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-slate-900">
                          {rep.title}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Doctor Approved
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Issuing Facility: {rep.facilityName} • Test Date: {rep.reportDate}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-teal-900">
                        Physician: {rep.doctorName || "Dr. Arvind Mehta"}
                      </p>
                      {rep.doctorApprovedAt && (
                        <p className="text-[11px] text-slate-400">
                          Approved: {new Date(rep.doctorApprovedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  {/* Doctor's Handwritten/Original Notes */}
                  {rep.doctorNotes && (
                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-1">
                      <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                        Physician's Clinical Observations:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic">
                        "{rep.doctorNotes}"
                      </p>
                    </div>
                  )}

                  {/* Doctor-Approved Plain Language Explanation */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Approved Plain-Language Explanation:
                    </span>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                      {rep.plainLanguageExplanation}
                    </div>
                  </div>

                  {/* Test Measurements Summary Preview */}
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                      Key Measurements ({rep.measurements.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {rep.measurements.slice(0, 6).map((m) => (
                        <div
                          key={m.id}
                          className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs flex justify-between items-center"
                        >
                          <span className="text-slate-600 font-medium truncate">
                            {m.testName}
                          </span>
                          <span
                            className={`font-mono font-bold ${
                              m.isAbnormal ? "text-amber-700" : "text-slate-900"
                            }`}
                          >
                            {m.valueText} {m.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      File: {rep.sourceFileName} ({rep.fileSize || "1.2 MB"})
                    </span>

                    <div className="flex items-center gap-2">
                      <Link href={`/reports/${rep.id}`}>
                        <Button variant="outline" size="sm">
                          Inspect Complete Values
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                        onClick={() => alert(`Simulating authorized download of ${rep.sourceFileName}`)}
                      >
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
