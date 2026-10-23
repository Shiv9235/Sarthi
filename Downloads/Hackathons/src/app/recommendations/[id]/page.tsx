"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  TestTube,
  Share2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Building,
  Calendar,
  HelpCircle,
  Hospital,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";
import { StorageService } from "../../../lib/data/storage";
import { InvestigationRequest, ReferralOrder } from "../../../lib/types";

export default function PatientRecommendationDecisionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [investigation, setInvestigation] = useState<InvestigationRequest | null>(null);
  const [referral, setReferral] = useState<ReferralOrder | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "info"; msg: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const inv = StorageService.getInvestigationRequestById(id);
    if (inv) {
      setInvestigation(inv);
      return;
    }

    const ref = StorageService.getReferralOrderById(id);
    if (ref) {
      setReferral(ref);
      return;
    }

    // Fallback: check if id matches default seed
    const defaultInvs = StorageService.getInvestigationRequests();
    const matchInv = defaultInvs.find((i) => i.id === id) || defaultInvs[0];
    if (matchInv) setInvestigation(matchInv);
  }, [id]);

  const isInvestigation = !!investigation;
  const item = investigation || referral;
  const status = item?.status;

  const handleAccept = () => {
    setIsLoading(true);
    if (isInvestigation && investigation) {
      StorageService.respondToInvestigationRecommendation(investigation.id, "accepted");
      setFeedback({
        type: "success",
        msg: "You have accepted your doctor's diagnostic recommendation. Routing to appointment booking...",
      });
      setTimeout(() => {
        router.push("/appointments/symptoms?recommended=investigation");
      }, 1500);
    } else if (referral) {
      StorageService.respondToReferralRecommendation(referral.id, "accepted");
      setFeedback({
        type: "success",
        msg: "You have accepted the specialist referral. Routing to specialist consultation booking...",
      });
      setTimeout(() => {
        router.push("/appointments/doctor/doc_2");
      }, 1500);
    }
  };

  const handleDecline = () => {
    setIsLoading(true);
    const reasonText = declineReason.trim() || "Patient deferred testing at this time.";

    if (isInvestigation && investigation) {
      StorageService.respondToInvestigationRecommendation(investigation.id, "declined", reasonText);
      setFeedback({
        type: "info",
        msg: "Your choice to decline this investigation has been recorded. Your doctor will be notified.",
      });
      setShowDeclineModal(false);
      setInvestigation({
        ...investigation,
        status: "declined_by_patient",
        declineReason: reasonText,
      });
    } else if (referral) {
      StorageService.respondToReferralRecommendation(referral.id, "declined", reasonText);
      setFeedback({
        type: "info",
        msg: "Your choice to decline this specialist referral has been recorded.",
      });
      setShowDeclineModal(false);
      setReferral({
        ...referral,
        status: "declined_by_patient",
        declineReason: reasonText,
      });
    }
    setIsLoading(false);
  };

  if (!item) {
    return (
      <AppShell>
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h1 className="text-base font-bold text-slate-900">Recommendation Not Found</h1>
          <p className="text-xs text-slate-500 mt-1">
            This recommendation may have been archived or removed.
          </p>
          <Button className="mt-4" onClick={() => router.push("/notifications")}>
            Return to Notifications
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/notifications"
          className="text-xs font-semibold text-primary-800 hover:underline flex items-center gap-1"
        >
          ← Return to Notifications
        </Link>

        {feedback && (
          <Alert type={feedback.type === "success" ? "success" : "info"}>
            {feedback.msg}
          </Alert>
        )}

        {/* Doctor Recommendation Header Card */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 border border-primary-200 flex items-center justify-center shrink-0">
                {isInvestigation ? (
                  <TestTube className="w-6 h-6 text-primary-700" />
                ) : (
                  <Share2 className="w-6 h-6 text-primary-700" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-primary-800 uppercase tracking-wider block mb-1">
                  Doctor Recommendation
                </span>
                <h1 className="text-xl font-bold text-slate-900">
                  {isInvestigation ? investigation?.testName : `Specialist Referral: ${referral?.targetSpecialty}`}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recommended by <strong>{isInvestigation ? investigation?.doctorName : referral?.referringDoctorName}</strong>
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              {status === "recommended" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  Awaiting Your Decision
                </span>
              )}
              {status === "accepted_by_patient" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Accepted by You
                </span>
              )}
              {status === "declined_by_patient" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                  <XCircle className="w-3.5 h-3.5 text-slate-500" />
                  Declined for Now
                </span>
              )}
            </div>
          </div>

          {/* Clinical Context & Details */}
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-surface-ground border border-surface-border space-y-2">
              <strong className="block text-slate-900 font-semibold text-sm">
                Why has your doctor recommended this?
              </strong>
              <p className="text-slate-700 leading-relaxed">
                {isInvestigation ? investigation?.clinicalIndication : referral?.reasonForReferral}
              </p>
            </div>

            {referral?.clinicalSummary && (
              <div className="p-4 rounded-xl bg-white border border-surface-border space-y-1">
                <strong className="block text-slate-800 font-semibold">
                  Clinical Summary Shared by Doctor:
                </strong>
                <p className="text-slate-600 leading-relaxed">{referral.clinicalSummary}</p>
              </div>
            )}

            {isInvestigation && investigation?.instructions && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1 text-blue-950">
                <strong className="block font-semibold">Patient Preparation Instructions:</strong>
                <p className="text-blue-900 leading-relaxed">{investigation.instructions}</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-surface-ground border border-surface-border">
                <span className="text-slate-500 block text-[11px]">Recommended Facility:</span>
                <strong className="text-slate-900">
                  {isInvestigation ? investigation?.recommendedFacility || "Dr. Lal PathLabs" : referral?.targetHospital || "Fortis Escorts Heart Institute"}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-surface-ground border border-surface-border">
                <span className="text-slate-500 block text-[11px]">Urgency:</span>
                <strong className="text-slate-900 uppercase">{item.urgency}</strong>
              </div>
              <div className="p-3 rounded-xl bg-surface-ground border border-surface-border">
                <span className="text-slate-500 block text-[11px]">Estimated Cost:</span>
                <strong className="text-slate-900">
                  ₹{isInvestigation ? investigation?.estimatedCost || 1150 : 1200}
                </strong>
              </div>
            </div>
          </div>

          {/* Interactive Decision Box */}
          {status === "recommended" ? (
            <div className="pt-6 border-t border-surface-border space-y-4">
              <div className="p-5 rounded-2xl bg-primary-50/70 border border-primary-200">
                <h2 className="text-sm font-bold text-slate-900 mb-1">
                  Would you like to proceed with this {isInvestigation ? "investigation" : "referral"}?
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  SARTHI protects patient autonomy. No appointment or payment will ever be made without your explicit confirmation.
                </p>

                <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    onClick={handleAccept}
                    isLoading={isLoading}
                    className="w-full sm:w-auto"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Yes, Proceed with Booking
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeclineModal(true)}
                    className="w-full sm:w-auto text-slate-700"
                  >
                    No, Decline for Now
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-surface-border">
              <div className="p-4 rounded-xl bg-surface-ground border border-surface-border text-xs flex items-center justify-between">
                <div>
                  <strong className="text-slate-800 block">Your Decision is Recorded</strong>
                  <span className="text-slate-500">
                    Decision logged on {item.decisionAt ? new Date(item.decisionAt).toLocaleDateString("en-IN") : "Today"}
                  </span>
                  {item.declineReason && (
                    <p className="text-slate-600 mt-1 italic">
                      Decline reason: "{item.declineReason}"
                    </p>
                  )}
                </div>
                {status === "accepted_by_patient" && (
                  <Button
                    size="sm"
                    onClick={() => router.push("/appointments")}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View Appointment
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Decline Modal */}
        {showDeclineModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-surface-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Decline Recommendation
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                You can decline this recommendation. Optional: Let your doctor know the reason so they can adapt your care plan.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason (Optional)
                </label>
                <textarea
                  rows={3}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g. Recently completed this test elsewhere, scheduling constraints, or will discuss at next review..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDeclineModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleDecline}
                  className="bg-slate-800 hover:bg-slate-900 text-white"
                >
                  Confirm Decline
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
