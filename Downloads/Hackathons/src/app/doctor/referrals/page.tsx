"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Share2,
  PlusCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Hospital,
} from "lucide-react";
import { DoctorAppShell } from "../../../components/layout/DoctorAppShell";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../lib/context/AuthContext";
import { StorageService } from "../../../lib/data/storage";
import { ReferralOrder } from "../../../lib/types";

export default function DoctorReferralsPage() {
  const router = useRouter();
  const { doctorProfile } = useAuth();
  const [referrals, setReferrals] = useState<ReferralOrder[]>([]);

  const doctorId = doctorProfile?.id || "doc_1";

  useEffect(() => {
    const list = StorageService.getReferralOrders(undefined, doctorId);
    setReferrals(list);
  }, [doctorId]);

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
      case "booked":
        return {
          label: "Appointment Scheduled",
          color: "bg-emerald-100 text-emerald-900 border-emerald-200",
        };
      default:
        return {
          label: status,
          color: "bg-slate-100 text-slate-800 border-slate-200",
        };
    }
  };

  return (
    <DoctorAppShell>
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Share2 className="w-6 h-6 text-primary-700" />
            Specialist Referrals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Refer patients to trusted specialists with structured clinical summaries. Referrals require explicit patient confirmation before booking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/doctor/referrals/new")}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create Specialist Referral
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {referrals.map((ref) => {
          const badge = getStatusBadge(ref.status);
          return (
            <div
              key={ref.id}
              className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs hover:border-primary-300 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      Referral to {ref.targetSpecialty}
                    </h2>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                      Urgency: {ref.urgency}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Target Specialist: <strong>{ref.targetDoctorName || "Consultant"}</strong> • {ref.targetHospital || "Speciality Hospital"}
                  </p>

                  <p className="text-xs text-slate-600">
                    Reason: <strong>{ref.reasonForReferral}</strong>
                  </p>

                  <div className="p-3 bg-surface-ground rounded-xl border border-surface-border text-xs text-slate-700">
                    <strong className="block text-slate-800 font-semibold mb-0.5">Clinical Summary Shared:</strong>
                    <p className="line-clamp-2">{ref.clinicalSummary}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mt-1">
                    <span>Patient: <strong className="text-slate-800">{ref.patientName}</strong></span>
                    <span>•</span>
                    <span>Referred by: <strong>{ref.referringDoctorName}</strong></span>
                    <span>•</span>
                    <span>Date: {new Date(ref.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>

                  {ref.declineReason && (
                    <p className="text-[11px] text-red-800 bg-red-50 p-2 rounded-lg border border-red-200 mt-1">
                      Patient Decline Reason: {ref.declineReason}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-500">
                    Ref #{ref.id}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DoctorAppShell>
  );
}
