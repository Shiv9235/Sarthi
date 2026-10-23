"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  History,
  FileText,
  Pill,
  TestTube,
  Share2,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { DoctorAppShell } from "../../../../../components/layout/DoctorAppShell";
import { Button } from "../../../../../components/ui/Button";
import { useAuth } from "../../../../../lib/context/AuthContext";
import { StorageService } from "../../../../../lib/data/storage";
import { ClinicalAuditLog, UserProfile } from "../../../../../lib/types";

export default function PatientHistoryAuditPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<ClinicalAuditLog[]>([]);

  useEffect(() => {
    setPatient(StorageService.getUser());
    setLogs(StorageService.getClinicalAuditLogs(patientId));
  }, [patientId]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "encounter_finalized":
        return { label: "Consultation Finalized", color: "bg-primary-100 text-primary-800" };
      case "prescription_issued":
        return { label: "Prescription Issued", color: "bg-blue-100 text-blue-800" };
      case "investigation_ordered":
        return { label: "Diagnostic Order", color: "bg-purple-100 text-purple-800" };
      case "referral_created":
        return { label: "Specialist Referral", color: "bg-emerald-100 text-emerald-800" };
      case "report_reviewed":
        return { label: "Report Approved", color: "bg-teal-100 text-teal-800" };
      case "medication_problem_resolved":
        return { label: "Medication Issue Resolved", color: "bg-amber-100 text-amber-800" };
      default:
        return { label: "Record Accessed", color: "bg-slate-100 text-slate-800" };
    }
  };

  return (
    <DoctorAppShell>
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
          <div>
            <Link
              href={`/doctor/patients/${patientId}`}
              className="text-xs font-semibold text-primary-800 hover:underline mb-1 inline-block"
            >
              ← Back to Medical Record
            </Link>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-primary-700" />
              Clinical Audit & Historical Event Timeline
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Patient: <strong className="text-slate-800">{patient?.fullName || "Sunita Sharma"}</strong> • All actions are cryptographically traceable and attributable to authorized medical staff.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-surface-ground px-3 py-1.5 rounded-xl border border-surface-border">
            Total Logged Events: {logs.length}
          </span>
        </div>

        {/* Timeline */}
        <div className="pt-6">
          <div className="relative border-l-2 border-primary-200 ml-4 space-y-6">
            {logs.map((log) => {
              const badge = getActionBadge(log.action);
              return (
                <div key={log.id} className="relative pl-6">
                  {/* Timeline dot */}
                  <div className="absolute -left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-primary-600 ring-4 ring-white" />
                  <div className="p-4 rounded-xl bg-surface-ground border border-surface-border">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badge.color}`}>
                          {badge.label}
                        </span>
                        <strong className="text-xs font-bold text-slate-900">
                          {log.doctorName}
                        </strong>
                      </div>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(log.timestamp).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {log.details}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-200/70 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Audit ID: {log.id}</span>
                      <span>Entity: {log.entityType} #{log.entityId}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DoctorAppShell>
  );
}
