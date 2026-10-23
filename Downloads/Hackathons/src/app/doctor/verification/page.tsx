"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building,
  Award,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";
import { useAuth } from "../../../lib/context/AuthContext";
import { StorageService } from "../../../lib/data/storage";
import { VerificationStatus } from "../../../lib/types";

export default function DoctorVerificationPage() {
  const router = useRouter();
  const { doctorProfile, updateDoctorProfile } = useAuth();
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const profile = doctorProfile || StorageService.getDoctorProfiles()[0];
  const currentStatus: VerificationStatus = profile?.verificationStatus || "under_review";

  const handleSimulateStatus = (newStatus: VerificationStatus, note: string) => {
    StorageService.updateDoctorVerification(profile.id, newStatus, note);
    updateDoctorProfile({
      verificationStatus: newStatus,
      reviewerNotes: note,
      verifiedAt: newStatus === "verified" ? new Date().toISOString() : undefined,
    });
    setFeedbackMessage(`Status updated to: ${newStatus.toUpperCase()}`);
    setTimeout(() => setFeedbackMessage(""), 4000);
  };

  const getStatusBadge = () => {
    switch (currentStatus) {
      case "verified":
        return {
          label: "Verified Practitioner",
          color: "bg-primary-100 text-primary-900 border-primary-200",
          icon: CheckCircle2,
          desc: "Your credentials have been successfully authenticated with the State Medical Council. Full clinical access is active.",
        };
      case "under_review":
        return {
          label: "Under Administrative Review",
          color: "bg-amber-100 text-amber-900 border-amber-200",
          icon: Clock,
          desc: "Your medical council registration and degree certificates are currently being reviewed by platform verification officers.",
        };
      case "additional_info_required":
        return {
          label: "Additional Information Required",
          color: "bg-blue-100 text-blue-900 border-blue-200",
          icon: HelpCircle,
          desc: "Verification officer requested clear scanned copy of your Medical Council Renewal Certificate.",
        };
      case "rejected":
        return {
          label: "Verification Rejected",
          color: "bg-red-100 text-red-900 border-red-200",
          icon: XCircle,
          desc: "The council registration number provided could not be matched with State Medical Council records.",
        };
      default:
        return {
          label: "Application Submitted",
          color: "bg-slate-100 text-slate-900 border-slate-200",
          icon: Clock,
          desc: "Your application is in queue for credential check.",
        };
    }
  };

  const badgeInfo = getStatusBadge();
  const StatusIcon = badgeInfo.icon;

  return (
    <div className="min-h-screen bg-surface-ground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/doctor/dashboard"
            className="text-xs font-semibold text-primary-800 hover:underline flex items-center gap-1"
          >
            ← Return to Doctor Dashboard
          </Link>
          <span className="text-xs text-slate-500">
            Registration ID: <strong className="text-slate-800">{profile?.regNumber || "DMC/R/14290"}</strong>
          </span>
        </div>

        {feedbackMessage && (
          <Alert type="success">
            {feedbackMessage}
          </Alert>
        )}

        {/* Main Status Card */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 border border-primary-200 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-primary-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{profile?.name || "Dr. Arvind Mehta"}</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {profile?.specialty} • {profile?.hospitalName}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Council: {profile?.councilName} • Reg #{profile?.regNumber} (Year {profile?.regYear})
                </p>
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border ${badgeInfo.color}`}>
              <StatusIcon className="w-4 h-4 shrink-0" />
              <span>{badgeInfo.label}</span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="py-6 border-b border-surface-border">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Verification Lifecycle Stages
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-primary-50 border border-primary-200">
                <span className="text-[10px] font-bold text-primary-800 block">Stage 1</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-700" /> Account Created
                </span>
              </div>
              <div className="p-3 rounded-xl bg-primary-50 border border-primary-200">
                <span className="text-[10px] font-bold text-primary-800 block">Stage 2</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-700" /> Documents Uploaded
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${currentStatus !== "draft" && currentStatus !== "submitted" ? "bg-primary-50 border-primary-200" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-[10px] font-bold text-slate-500 block">Stage 3</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                  {currentStatus === "verified" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-700" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  Council Cross-Check
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${currentStatus === "verified" ? "bg-primary-100/60 border-primary-300 text-primary-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                <span className="text-[10px] font-bold block">Stage 4</span>
                <span className="font-semibold flex items-center gap-1 mt-0.5">
                  {currentStatus === "verified" ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-700" />
                  ) : (
                    <LockIcon className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  Clinical Privileges
                </span>
              </div>
            </div>
          </div>

          {/* Description & Reviewer Notes */}
          <div className="py-6 space-y-4">
            <div className="p-4 rounded-xl bg-surface-ground border border-surface-border text-xs">
              <strong className="text-slate-900 block font-semibold mb-1">Status Summary</strong>
              <p className="text-slate-600 leading-relaxed">{badgeInfo.desc}</p>
            </div>

            {profile?.reviewerNotes && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <strong className="text-amber-950 block font-semibold mb-1">
                  Verification Officer Log & Notes
                </strong>
                <p className="text-amber-900">{profile.reviewerNotes}</p>
                {profile.verifiedAt && (
                  <p className="text-[10px] text-amber-700 mt-1">
                    Timestamp: {new Date(profile.verifiedAt).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Supporting Documents List */}
          <div className="py-4 border-t border-surface-border">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Submitted Credentials & Supporting Documents
            </h3>
            <div className="space-y-2">
              {profile?.supportingDocs && profile.supportingDocs.length > 0 ? (
                profile.supportingDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-ground border border-surface-border text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-primary-700" />
                      <div>
                        <p className="font-semibold text-slate-900">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {doc.type.replace("_", " ").toUpperCase()} • {doc.size || "1.8 MB"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-primary-800 bg-white border border-primary-100 px-2.5 py-1 rounded-md">
                      File Archived
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No supporting documents on file.</p>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3">
            {currentStatus === "verified" ? (
              <Button
                className="w-full sm:w-auto"
                onClick={() => router.push("/doctor/dashboard")}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Access Doctor Dashboard
              </Button>
            ) : (
              <div className="text-xs text-slate-500">
                🔒 Clinical actions (prescribing, ordering investigations, accessing patient records)
                are locked until verification completes.
              </div>
            )}

            <Button
              variant="outline"
              className="w-full sm:w-auto text-xs"
              onClick={() => router.push("/doctor/profile")}
            >
              Edit Submitted Details
            </Button>
          </div>
        </div>

        {/* Administrative Simulation Sandbox */}
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-amber-800" />
            <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Verification Testing Sandbox (Platform Admin Simulation)
            </h3>
          </div>
          <p className="text-xs text-amber-900 mb-4">
            Simulate administrative decisions to verify role-based enforcement and unlocked doctor features.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                handleSimulateStatus(
                  "verified",
                  "Verified through State Medical Council Registry. Registration active in good standing."
                )
              }
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-700 text-white hover:bg-primary-800 shadow-2xs transition-colors"
            >
              ✓ Approve & Set to Verified
            </button>
            <button
              onClick={() =>
                handleSimulateStatus(
                  "under_review",
                  "Review in progress. Awaiting online council response."
                )
              }
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors"
            >
              ⏳ Set to Under Review
            </button>
            <button
              onClick={() =>
                handleSimulateStatus(
                  "additional_info_required",
                  "Council renewal receipt required for current calendar year."
                )
              }
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-200 transition-colors"
            >
              ❓ Request Additional Documents
            </button>
            <button
              onClick={() =>
                handleSimulateStatus(
                  "rejected",
                  "Registration number not found in Delhi Medical Council database."
                )
              }
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-900 border border-red-300 hover:bg-red-200 transition-colors"
            >
              ✕ Reject Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
