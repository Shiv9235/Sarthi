"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TestTube,
  PlusCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Filter,
} from "lucide-react";
import { DoctorAppShell } from "../../../components/layout/DoctorAppShell";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../lib/context/AuthContext";
import { StorageService } from "../../../lib/data/storage";
import { InvestigationRequest } from "../../../lib/types";

export default function DoctorInvestigationsPage() {
  const router = useRouter();
  const { doctorProfile } = useAuth();
  const [investigations, setInvestigations] = useState<InvestigationRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const doctorId = doctorProfile?.id || "doc_1";

  useEffect(() => {
    const list = StorageService.getInvestigationRequests(undefined, doctorId);
    setInvestigations(list);
  }, [doctorId]);

  const filtered = investigations.filter((inv) => {
    if (filterStatus === "all") return true;
    return inv.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "recommended":
        return {
          label: "Recommended (Awaiting Patient Yes/No)",
          color: "bg-amber-100 text-amber-900 border-amber-200",
        };
      case "accepted_by_patient":
        return {
          label: "Accepted by Patient",
          color: "bg-blue-100 text-blue-900 border-blue-200",
        };
      case "declined_by_patient":
        return {
          label: "Declined by Patient",
          color: "bg-red-100 text-red-900 border-red-200",
        };
      case "completed":
        return {
          label: "Completed & Results Extracted",
          color: "bg-primary-100 text-primary-900 border-primary-200",
        };
      default:
        return {
          label: status.replace(/_/g, " "),
          color: "bg-slate-100 text-slate-900 border-slate-200",
        };
    }
  };

  return (
    <DoctorAppShell>
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TestTube className="w-6 h-6 text-primary-700" />
            Diagnostic Investigation Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Order pathology lab tests and radiological scans. Recommendations are dispatched to patients for explicit acceptance before booking proceeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/doctor/investigations/new")}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Order New Test
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 rounded-xl border transition-colors ${
            filterStatus === "all"
              ? "bg-primary-700 text-white border-primary-700"
              : "bg-white text-slate-700 border-surface-border hover:bg-slate-50"
          }`}
        >
          All Tests ({investigations.length})
        </button>
        <button
          onClick={() => setFilterStatus("recommended")}
          className={`px-3 py-1.5 rounded-xl border transition-colors ${
            filterStatus === "recommended"
              ? "bg-amber-600 text-white border-amber-600"
              : "bg-white text-slate-700 border-surface-border hover:bg-slate-50"
          }`}
        >
          Awaiting Patient Decision
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`px-3 py-1.5 rounded-xl border transition-colors ${
            filterStatus === "completed"
              ? "bg-primary-700 text-white border-primary-700"
              : "bg-white text-slate-700 border-surface-border hover:bg-slate-50"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Investigation List */}
      <div className="space-y-4">
        {filtered.map((inv) => {
          const badge = getStatusBadge(inv.status);
          return (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs hover:border-primary-300 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      {inv.testName}
                    </h2>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-surface-ground border border-surface-border text-slate-700">
                      {inv.category === "pathology_lab" ? "Pathology Lab" : "Radiological Scan"}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                      Urgency: {inv.urgency}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Clinical Indication: <strong>{inv.clinicalIndication}</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                    <span>Patient: <strong className="text-slate-800">{inv.patientName}</strong></span>
                    <span>•</span>
                    <span>Facility: <strong className="text-slate-800">{inv.recommendedFacility || "Any NABL Center"}</strong></span>
                    <span>•</span>
                    <span>Est. Fee: ₹{inv.estimatedCost || 900}</span>
                    <span>•</span>
                    <span>Ordered: {new Date(inv.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>

                  {inv.instructions && (
                    <p className="text-[11px] text-slate-600 italic bg-surface-ground p-2 rounded-lg border border-surface-border mt-1">
                      Prep Instructions: {inv.instructions}
                    </p>
                  )}

                  {inv.declineReason && (
                    <p className="text-[11px] text-red-800 bg-red-50 p-2 rounded-lg border border-red-200 mt-1">
                      Patient Decline Reason: {inv.declineReason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {inv.resultReportId ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/doctor/reports/${inv.resultReportId}`)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      View Report Results
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Results Pending</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DoctorAppShell>
  );
}
