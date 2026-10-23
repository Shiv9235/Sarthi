"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TestTube,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  Info,
} from "lucide-react";
import { DoctorAppShell } from "../../../../components/layout/DoctorAppShell";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Alert } from "../../../../components/ui/Alert";
import { useAuth } from "../../../../lib/context/AuthContext";
import { StorageService } from "../../../../lib/data/storage";
import {
  InvestigationCategory,
  InvestigationUrgency,
  InvestigationRequest,
} from "../../../../lib/types";

export default function NewInvestigationOrderPage() {
  return (
    <Suspense
      fallback={
        <DoctorAppShell>
          <div className="p-8 text-center text-xs text-slate-500">Loading diagnostic form...</div>
        </DoctorAppShell>
      }
    >
      <NewInvestigationOrderContent />
    </Suspense>
  );
}

function NewInvestigationOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { doctorProfile } = useAuth();

  const [patientName, setPatientName] = useState("Sunita Sharma");
  const [patientId, setPatientId] = useState(searchParams.get("patientId") || "patient_001");
  const [category, setCategory] = useState<InvestigationCategory>("pathology_lab");
  const [testName, setTestName] = useState("Fasting Lipid Profile & Glycated Hemoglobin (HbA1c)");
  const [indication, setIndication] = useState(
    "3-month follow-up evaluation of glycemic control and statin response in Type 2 Diabetes with mild dyslipidemia."
  );
  const [instructions, setInstructions] = useState(
    "Strict 10-12 hours overnight fasting required. Plain water allowed. Take morning medications only after blood draw."
  );
  const [urgency, setUrgency] = useState<InvestigationUrgency>("routine");
  const [facility, setFacility] = useState("Dr. Lal PathLabs");
  const [estimatedCost, setEstimatedCost] = useState("1150");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApplyTemplate = (
    cat: InvestigationCategory,
    name: string,
    ind: string,
    inst: string,
    fac: string,
    cost: string
  ) => {
    setCategory(cat);
    setTestName(name);
    setIndication(ind);
    setInstructions(inst);
    setFacility(fac);
    setEstimatedCost(cost);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!testName || !indication) {
      setError("Please specify the test name and clinical indication.");
      return;
    }

    setIsLoading(true);

    const newInv: InvestigationRequest = {
      id: `inv_${Date.now()}`,
      patientId,
      patientName,
      doctorId: doctorProfile?.id || "doc_1",
      doctorName: doctorProfile?.name || "Dr. Arvind Mehta, MD",
      category,
      testName,
      clinicalIndication: indication,
      instructions,
      urgency,
      status: "recommended", // Initial state: patient must confirm Yes / No!
      estimatedCost: parseInt(estimatedCost) || 900,
      recommendedFacility: facility,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveInvestigationRequest(newInv);
    setIsLoading(false);
    router.push("/doctor/investigations");
  };

  return (
    <DoctorAppShell>
      <div className="flex items-center justify-between">
        <Link
          href="/doctor/investigations"
          className="text-xs font-semibold text-primary-800 hover:underline"
        >
          ← Back to Diagnostic Orders
        </Link>
        <span className="text-xs font-semibold text-slate-500">
          Ordering Physician: <strong className="text-slate-800">{doctorProfile?.name || "Dr. Arvind Mehta"}</strong>
        </span>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Patient Confirmation Policy Alert */}
      <div className="bg-primary-50/70 border border-primary-200/80 p-4 rounded-2xl flex items-start gap-3 text-xs text-primary-950">
        <Info className="w-5 h-5 text-primary-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-0.5 uppercase tracking-wider text-primary-950">
            SARTHI Patient Confirmation Protocol
          </strong>
          <p className="leading-relaxed text-primary-900">
            When you submit this diagnostic request, patient <strong>{patientName}</strong> will receive an interactive notification containing an explicit <strong>Yes / No</strong> choice. The booking will only proceed after the patient confirms. Zero silent or unwanted bookings are ever initiated.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-surface-border">
            <TestTube className="w-5 h-5 text-primary-700" />
            Order Laboratory or Radiological Investigation
          </h1>

          {/* Quick Order Templates */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Common Diagnostic Order Templates
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleApplyTemplate(
                    "pathology_lab",
                    "Fasting Lipid Profile & Glycated Hemoglobin (HbA1c)",
                    "Quarterly diabetic metabolic monitoring and dyslipidemia reassessment.",
                    "10-12 hours strict fasting required. Water allowed.",
                    "Dr. Lal PathLabs",
                    "1150"
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-surface-ground border border-surface-border hover:border-primary-500 font-semibold text-slate-800"
              >
                🔬 Fasting Lipids & HbA1c
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyTemplate(
                    "pathology_lab",
                    "Kidney Function Test (KFT) & Serum Electrolytes",
                    "Routine monitoring of renal parameters on ACEi/ARB therapy.",
                    "Fasting not mandatory. Morning sample preferred.",
                    "Dr. Lal PathLabs",
                    "850"
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-surface-ground border border-surface-border hover:border-primary-500 font-semibold text-slate-800"
              >
                🧪 Renal Panel & Electrolytes
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyTemplate(
                    "radiology_scan",
                    "Digital Chest X-Ray PA View",
                    "Baseline cardiopulmonary silhouette and pulmonary evaluation.",
                    "Remove metal jewelry and metallic buttons.",
                    "Mahajan Imaging & Diagnostics",
                    "800"
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-surface-ground border border-surface-border hover:border-primary-500 font-semibold text-slate-800"
              >
                🩻 Digital Chest X-Ray
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyTemplate(
                    "radiology_scan",
                    "2D Echocardiogram with Color Doppler",
                    "Preventive assessment of left ventricular ejection fraction and cardiac valve function.",
                    "No fasting required. Wear comfortable two-piece clothing.",
                    "Fortis Escorts Heart Institute",
                    "2400"
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-surface-ground border border-surface-border hover:border-primary-500 font-semibold text-slate-800"
              >
                ❤️ 2D Echocardiogram
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Patient Name *</label>
              <input
                type="text"
                value={patientName}
                readOnly
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-surface-ground font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Investigation Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InvestigationCategory)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-primary-500 focus:outline-none"
              >
                <option value="pathology_lab">Pathology Lab Records (Blood / Urine / Bio)</option>
                <option value="radiology_scan">Radiological Scans (X-Ray / Echo / USG / MRI)</option>
              </select>
            </div>
          </div>

          <div className="text-xs">
            <Input
              label="Test Name / Investigation Title *"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g. Glycated Hemoglobin (HbA1c)"
              required
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Clinical Indication / Reason *</label>
            <textarea
              rows={2}
              value={indication}
              onChange={(e) => setIndication(e.target.value)}
              placeholder="Specify medical reason for this investigation..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Urgency Level *</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as InvestigationUrgency)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-primary-500"
              >
                <option value="routine">Routine (Within 1-2 weeks)</option>
                <option value="urgent">Urgent (Within 48 hours)</option>
                <option value="immediate">Immediate (Same day priority)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recommended Facility</label>
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                placeholder="e.g. Dr. Lal PathLabs"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Cost (₹)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="1150"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-primary-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Patient Preparation Instructions (Fasting, medication timing, etc.)
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. 10 hours overnight fasting required..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/doctor/investigations")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Dispatch Recommendation to Patient
          </Button>
        </div>
      </form>
    </DoctorAppShell>
  );
}
