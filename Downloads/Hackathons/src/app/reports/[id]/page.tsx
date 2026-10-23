"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FileText,
  Clock,
  Hospital,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  GitCompare,
  Download,
  Edit2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Badge, StatusBadge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { StorageService } from "../../../lib/data/storage";
import { ReportMeasurement } from "../../../lib/types";

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const report = StorageService.getReportById(resolvedParams.id);

  if (!report) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/reports" className="hover:text-emerald-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Reports
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{report.title}</span>
        </div>

        {/* Report Overview Card */}
        <Card className="border-slate-200">
          <CardHeader className="py-4 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900">{report.title}</h1>
                  <StatusBadge status={report.status} />
                  {report.isDoctorShared && (
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                      Doctor Shared
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span>Facility: {report.facilityName}</span>
                  <span>•</span>
                  <span>Date: {report.reportDate}</span>
                  <span>•</span>
                  <span>Reference ID: #{report.id}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/reports/compare?id1=${report.id}`}>
                  <Button variant="outline" size="sm" leftIcon={<GitCompare className="w-3.5 h-3.5" />}>
                    Compare
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => alert(`Simulating download of ${report.sourceFileName}`)}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Doctor's Notes (if present) */}
            {report.doctorNotes && (
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                <strong className="text-amber-950 block font-bold uppercase tracking-wider">
                  Attending Physician's Notes ({report.doctorName || "Dr. Arvind Mehta"}):
                </strong>
                <p className="text-slate-800 italic leading-relaxed">
                  "{report.doctorNotes}"
                </p>
              </div>
            )}

            {/* Plain-Language Clinical Synthesis */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Plain-Language Synthesis</span>
              </h2>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                {report.plainLanguageExplanation || report.aiGeneratedSummary}
              </div>
            </div>

            {/* Test Measurements Table */}
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Detailed Test Measurements ({report.measurements.length})
              </h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                      <th className="py-3 px-4">Test Name</th>
                      <th className="py-3 px-4">Result</th>
                      <th className="py-3 px-4">Unit</th>
                      <th className="py-3 px-4">Stated Reference Range</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report.measurements.map((m) => (
                      <tr
                        key={m.id}
                        className={`hover:bg-slate-50/60 transition-colors ${
                          m.isAbnormal ? "bg-amber-50/20" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {m.testName}
                          {m.patientCorrected && (
                            <span className="ml-2 text-[10px] text-teal-700 font-semibold">
                              (Patient Verified)
                            </span>
                          )}
                          <span className="block text-[11px] text-slate-500 font-normal">
                            {m.plainExplanation}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                          {m.valueText}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">{m.unit}</td>
                        <td className="py-3 px-4 text-slate-500">{m.referenceText}</td>
                        <td className="py-3 px-4">
                          {m.isAbnormal ? (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                              {m.flag || "HIGH"}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Questions to Discuss with Physician */}
            {report.suggestedDoctorQuestions && report.suggestedDoctorQuestions.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>Discussion Guide for Your Next Consultation</span>
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                  {report.suggestedDoctorQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
