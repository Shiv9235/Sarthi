"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Pill,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  Stethoscope,
  Send,
} from "lucide-react";
import { DoctorAppShell } from "../../../../components/layout/DoctorAppShell";
import { Button } from "../../../../components/ui/Button";
import { Alert } from "../../../../components/ui/Alert";
import { useAuth } from "../../../../lib/context/AuthContext";
import { StorageService } from "../../../../lib/data/storage";
import { MedicationProblemReport } from "../../../../lib/types";

export default function DoctorMedicationProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.problemId as string;
  const { doctorProfile } = useAuth();

  const [problem, setProblem] = useState<MedicationProblemReport | null>(null);
  const [responseNotes, setResponseNotes] = useState(
    "Postural dizziness can occur early during ARB treatment. Please take Telma with breakfast and rise slowly from sitting/lying positions. Continue weekly home BP recording. If systolic BP drops below 105 mmHg, contact clinic."
  );
  const [actionCategory, setActionCategory] = useState("continue_with_monitoring");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const list = StorageService.getMedicationProblems();
    const item = list.find((p) => p.id === problemId) || list[0];
    if (item) {
      setProblem(item);
      if (item.doctorResponseNotes) {
        setResponseNotes(item.doctorResponseNotes);
      }
    }
  }, [problemId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseNotes.trim()) return;

    setIsLoading(true);
    StorageService.respondToMedicationProblem(problemId, responseNotes);
    setIsLoading(false);
    setSuccessMessage("Clinical advice and instructions successfully dispatched to patient.");
    setTimeout(() => {
      router.push("/doctor/medication-problems");
    }, 1500);
  };

  if (!problem) {
    return (
      <DoctorAppShell>
        <div className="p-8 text-center bg-white rounded-2xl border border-surface-border">
          <p className="text-sm text-slate-500">Medication issue record not found.</p>
        </div>
      </DoctorAppShell>
    );
  }

  return (
    <DoctorAppShell>
      <div className="flex items-center justify-between">
        <Link
          href="/doctor/medication-problems"
          className="text-xs font-semibold text-primary-800 hover:underline"
        >
          ← Back to Medication Issues
        </Link>
        <span className="text-xs font-semibold text-slate-500">
          Reviewer: <strong className="text-slate-800">{doctorProfile?.name || "Dr. Arvind Mehta"}</strong>
        </span>
      </div>

      {successMessage && <Alert type="success">{successMessage}</Alert>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Issue Details and Clinical Response Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">{problem.medicineName}</h1>
                  <p className="text-xs text-slate-500">
                    Category: {problem.problemType.replace(/_/g, " ")} • Onset: {problem.onsetDate}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  problem.severity === "severe" || problem.severity === "urgent"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {problem.severity} Severity
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-ground border border-surface-border">
              <strong className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                Patient's Self-Reported Symptoms
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">{problem.description}</p>
            </div>
          </div>

          {/* Doctor Response Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-surface-border">
              <Stethoscope className="w-4 h-4 text-primary-700" />
              Doctor Triage Assessment & Clinical Instructions
            </h2>

            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1">Recommended Clinical Action *</label>
              <select
                value={actionCategory}
                onChange={(e) => setActionCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-primary-500"
              >
                <option value="continue_with_monitoring">Continue medication with home monitoring & dietary adjustments</option>
                <option value="dose_modification">Schedule dose reduction at upcoming OPD visit</option>
                <option value="temporary_pause">Temporarily hold medicine pending laboratory review</option>
                <option value="urgent_consult">Request in-person hospital OPD evaluation</option>
              </select>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1">
                Clinical Guidance & Directions for Patient *
              </label>
              <textarea
                rows={4}
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                placeholder="Provide direct, reassuring instructions for the patient..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none leading-relaxed"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/doctor/medication-problems")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={isLoading}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Dispatch Response to Patient
              </Button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Patient Health & Allergy Context */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-primary-700" />
              Patient Health Context
            </h3>
            <div>
              <span className="text-slate-500 block">Patient Name:</span>
              <strong className="text-slate-900 text-sm">Sunita Sharma (44y F)</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Chronic Conditions:</span>
              <p className="text-slate-700">Type 2 Diabetes Mellitus, Essential Hypertension</p>
            </div>
            <div>
              <span className="text-slate-500 block">Current Regimen:</span>
              <p className="text-slate-700 mt-0.5">
                • Glycomet 500 BD<br />
                • Telma 40 OD (Reported item)<br />
                • Atorva 10 OD
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-[11px]">
              <strong>Documented Allergies:</strong><br />
              Penicillin (Severe), Sulfa drugs
            </div>
          </div>
        </div>
      </div>
    </DoctorAppShell>
  );
}
