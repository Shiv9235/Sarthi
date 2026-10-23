"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Pill,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  PhoneCall,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent, CardFooter } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { Alert } from "../../../components/ui/Alert";
import { StorageService } from "../../../lib/data/storage";
import { MedicationProblemReport } from "../../../lib/types";

export default function ReportMedicationProblemPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-8 text-center text-xs text-slate-500">
            Loading issue reporter...
          </div>
        </AppShell>
      }
    >
      <ReportMedicationProblemContent />
    </Suspense>
  );
}

function ReportMedicationProblemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultMed = searchParams.get("med") || "Metformin Hydrochloride (500mg)";

  const [medicineName, setMedicineName] = useState(defaultMed);
  const [problemType, setProblemType] = useState<
    | "suspected_side_effect"
    | "allergy_concern"
    | "medication_error"
    | "incorrect_medicine"
    | "unclear_instructions"
    | "missing_medicine"
    | "other"
  >("suspected_side_effect");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe" | "urgent">("moderate");
  const [onsetDate, setOnsetDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");
  const [submittedReport, setSubmittedReport] = useState<MedicationProblemReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if acute emergency reaction
  const isEmergencySeverity = severity === "urgent";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName || !description) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const report: MedicationProblemReport = {
      id: `med_prob_${Date.now()}`,
      patientId: StorageService.getUser().id || "patient_001",
      medicineName,
      problemType,
      severity,
      description,
      onsetDate,
      emergencyScreeningTriggered: isEmergencySeverity,
      status: "submitted",
      isDemo: true,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveMedicationProblem(report);
    setSubmittedReport(report);
    setIsSubmitting(false);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/prescriptions" className="hover:text-purple-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Prescriptions
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Report Medication Concern</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Report a Medication Problem or Side Effect
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Document adverse reactions, suspected medication errors, or dosage questions directly for physician review.
          </p>
        </div>

        {/* Urgent Emergency Warning Banner if patient marks Urgent */}
        {isEmergencySeverity && (
          <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-6 space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h2 className="text-base font-bold text-rose-950">
                  Potentially Serious Reaction Warning
                </h2>
                <p className="text-xs text-rose-900 leading-relaxed font-medium">
                  If you are experiencing difficulty breathing, throat tightening, facial swelling, or sudden chest pain, do not submit a routine portal request. Call emergency services (112 / 108) or proceed to the nearest emergency center immediately.
                </p>
                <div className="pt-2">
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white font-bold text-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Emergency Services</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {!submittedReport ? (
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Medication Issue Form
                  </h2>
                  <p className="text-xs text-slate-500">
                    Please provide detailed observations of the symptoms and timeline.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Prescription or Medicine Involved"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="e.g. Metformin 500mg, Atorvastatin"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Type of Problem"
                    value={problemType}
                    onChange={(e) => setProblemType(e.target.value as any)}
                    options={[
                      { value: "suspected_side_effect", label: "Suspected Side Effect" },
                      { value: "allergy_concern", label: "Allergy Concern / Skin Reaction" },
                      { value: "medication_error", label: "Medication Error / Incorrect Dose" },
                      { value: "incorrect_medicine", label: "Incorrect Medicine Dispensed" },
                      { value: "unclear_instructions", label: "Unclear Usage Instructions" },
                      { value: "missing_medicine", label: "Missing Medicine / Omission" },
                      { value: "other", label: "Other Medication Issue" },
                    ]}
                  />

                  <Select
                    label="Reported Severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    options={[
                      { value: "mild", label: "Mild (Minor nuisance)" },
                      { value: "moderate", label: "Moderate (Impairs routine tasks)" },
                      { value: "severe", label: "Severe (Significant distress)" },
                      { value: "urgent", label: "Urgent (Potentially life-threatening)" },
                    ]}
                  />
                </div>

                <Input
                  label="When did the reaction or issue start?"
                  type="date"
                  value={onsetDate}
                  onChange={(e) => setOnsetDate(e.target.value)}
                  required
                />

                <Textarea
                  label="Describe what happened"
                  placeholder="Explain symptoms, when you took the dose, how long the reaction lasted, and if any other remedies were taken..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />

                <Alert type="info">
                  <strong>Demo Mode Status:</strong> In this phase, your incident report is saved locally with status <code>submitted</code>. A truth banner will reflect that external clinic delivery has not yet been connected.
                </Alert>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Link href="/prescriptions">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  rightIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Submit Medication Report
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="text-center p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                Status: {submittedReport.status}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
                Medication Issue Logged
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                Your report for {submittedReport.medicineName} has been saved under incident reference #{submittedReport.id}.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left max-w-md mx-auto space-y-2">
              <p className="flex justify-between">
                <span className="text-slate-500">Medicine:</span>
                <span className="font-bold text-slate-900">{submittedReport.medicineName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Problem Type:</span>
                <span className="capitalize text-slate-800 font-medium">
                  {submittedReport.problemType.replace(/_/g, " ")}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Severity:</span>
                <span className="capitalize font-bold text-rose-700">
                  {submittedReport.severity}
                </span>
              </p>
              <div className="pt-2 border-t border-slate-200 text-slate-500">
                <strong>Truthful Integration Notice:</strong> Live doctor messaging is not configured. This record is preserved in local persistence and has not been transmitted to a live clinician.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/prescriptions/latest">
                <Button variant="primary">Return to Prescriptions</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmittedReport(null);
                  setDescription("");
                }}
              >
                Submit Another Report
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
