"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  Info,
  User,
} from "lucide-react";
import { DoctorAppShell } from "../../../../components/layout/DoctorAppShell";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Alert } from "../../../../components/ui/Alert";
import { useAuth } from "../../../../lib/context/AuthContext";
import { StorageService } from "../../../../lib/data/storage";
import { ReferralOrder } from "../../../../lib/types";

export default function NewReferralPage() {
  return (
    <Suspense
      fallback={
        <DoctorAppShell>
          <div className="p-8 text-center text-xs text-slate-500">Loading referral form...</div>
        </DoctorAppShell>
      }
    >
      <NewReferralContent />
    </Suspense>
  );
}

function NewReferralContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { doctorProfile } = useAuth();

  const [patientName, setPatientName] = useState("Sunita Sharma");
  const [patientId, setPatientId] = useState(searchParams.get("patientId") || "patient_001");
  const [targetSpecialty, setTargetSpecialty] = useState("Cardiology");
  const [targetDoctorName, setTargetDoctorName] = useState("Dr. Meenakshi Rao, MD, DM");
  const [targetHospital, setTargetHospital] = useState("Fortis Escorts Heart Institute");
  const [reason, setReason] = useState(
    "Comprehensive annual preventive cardiac evaluation for diabetic hypertensive patient with mild dyslipidemia."
  );
  const [clinicalSummary, setClinicalSummary] = useState(
    "44-year-old female with Type 2 Diabetes (HbA1c 6.8%) and Hypertension for 3 years. On Glycomet 500 BD, Telma 40 OD, and Atorva 10 OD. Blood pressure controlled at 128/82. Resting ECG normal. Recommending preventive echocardiogram and treadmill stress test."
  );
  const [urgency, setUrgency] = useState<"routine" | "priority" | "urgent">("routine");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApplyTemplate = (
    specialty: string,
    doctor: string,
    hospital: string,
    res: string,
    summary: string
  ) => {
    setTargetSpecialty(specialty);
    setTargetDoctorName(doctor);
    setTargetHospital(hospital);
    setReason(res);
    setClinicalSummary(summary);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!targetSpecialty || !reason || !clinicalSummary) {
      setError("Please specify the target specialty, reason, and clinical summary.");
      return;
    }

    setIsLoading(true);

    const newRef: ReferralOrder = {
      id: `ref_${Date.now()}`,
      patientId,
      patientName,
      referringDoctorId: doctorProfile?.id || "doc_1",
      referringDoctorName: doctorProfile?.name || "Dr. Arvind Mehta, MD",
      referringDoctorSpecialty: doctorProfile?.specialty || "Internal Medicine & Diabetology",
      targetSpecialty,
      targetDoctorName,
      targetHospital,
      reasonForReferral: reason,
      clinicalSummary,
      urgency,
      status: "recommended", // Awaiting patient confirmation!
      createdAt: new Date().toISOString(),
    };

    StorageService.saveReferralOrder(newRef);
    setIsLoading(false);
    router.push("/doctor/referrals");
  };

  return (
    <DoctorAppShell>
      <div className="flex items-center justify-between">
        <Link
          href="/doctor/referrals"
          className="text-xs font-semibold text-primary-800 hover:underline"
        >
          ← Back to Specialist Referrals
        </Link>
        <span className="text-xs font-semibold text-slate-500">
          Referring Physician: <strong className="text-slate-800">{doctorProfile?.name || "Dr. Arvind Mehta"}</strong>
        </span>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Patient Confirmation Policy */}
      <div className="bg-primary-50/70 border border-primary-200/80 p-4 rounded-2xl flex items-start gap-3 text-xs text-primary-950">
        <Info className="w-5 h-5 text-primary-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-0.5 uppercase tracking-wider text-primary-950">
            SARTHI Patient-Empowered Referral Protocol
          </strong>
          <p className="leading-relaxed text-primary-900">
            When you create this referral, <strong>{patientName}</strong> receives an interactive notification with an explicit <strong>Yes / No</strong> choice. If the patient clicks <em>Yes</em>, they are seamlessly guided to schedule their consultation with the specialist. The platform never books without explicit patient confirmation.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-surface-border">
            <Share2 className="w-5 h-5 text-primary-700" />
            Create Specialist Referral Order
          </h1>

          {/* Quick Templates */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Common Specialist Referral Templates
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleApplyTemplate(
                    "Cardiology",
                    "Dr. Meenakshi Rao, MD, DM",
                    "Fortis Escorts Heart Institute",
                    "Annual preventive cardiovascular assessment for diabetic hypertensive patient.",
                    "44-year-old female with Type 2 Diabetes and Hypertension for 3 years. Stable on Glycomet, Telma, and Atorva. Routine echocardiogram and lipid consultation advised."
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-surface-ground border border-surface-border hover:border-primary-500 font-semibold text-slate-800"
              >
                ❤️ Cardiology (Dr. Meenakshi Rao)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyTemplate(
                    "Orthopedics & Joint Care",
                    "Dr. Rajeshwar Sen, MS, MCh",
                    "Apollo Hospital",
                    "Evaluation of persistent mild cervical spondylosis and neck stiffness.",
                    "Patient reports cervical discomfort aggravated by posture. No radiculopathy. Requesting orthopedic assessment and structured physiotherapy plan."
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-surface-ground border border-surface-border hover:border-primary-500 font-semibold text-slate-800"
              >
                🦴 Orthopedics (Dr. Rajeshwar Sen)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyTemplate(
                    "Ophthalmology",
                    "Senior Retina Consultant",
                    "Dr. Shroff's Charity Eye Hospital",
                    "Annual diabetic retinopathy screening and dilated fundus examination.",
                    "Type 2 Diabetes duration 3 years. Baseline visual acuity normal. Annual fundus check to rule out early diabetic microvascular changes."
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-surface-ground border border-surface-border hover:border-primary-500 font-semibold text-slate-800"
              >
                👁️ Diabetic Retinopathy Screening
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
              <label className="block font-semibold text-slate-700 mb-1">Target Medical Specialty *</label>
              <select
                value={targetSpecialty}
                onChange={(e) => setTargetSpecialty(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-primary-500 focus:outline-none"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics & Joint Care">Orthopedics & Joint Care</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="Neurology">Neurology</option>
                <option value="Nephrology">Nephrology</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Gastroenterology">Gastroenterology</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input
              label="Target Doctor Name (Optional)"
              value={targetDoctorName}
              onChange={(e) => setTargetDoctorName(e.target.value)}
              placeholder="e.g. Dr. Meenakshi Rao, MD, DM"
            />
            <Input
              label="Target Hospital / Medical Center"
              value={targetHospital}
              onChange={(e) => setTargetHospital(e.target.value)}
              placeholder="e.g. Fortis Escorts Heart Institute"
            />
          </div>

          <div className="text-xs">
            <Input
              label="Reason for Referral *"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Comprehensive annual preventive cardiac evaluation"
              required
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Clinical Summary & Context for Receiving Specialist *
            </label>
            <textarea
              rows={3}
              value={clinicalSummary}
              onChange={(e) => setClinicalSummary(e.target.value)}
              placeholder="Summarize patient's chronic conditions, current medication regimen, vitals, and relevant findings..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Referral Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-primary-500"
              >
                <option value="routine">Routine (Within 2-4 weeks)</option>
                <option value="priority">Priority (Within 1 week)</option>
                <option value="urgent">Urgent (Within 48 hours)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/doctor/referrals")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Dispatch Referral to Patient
          </Button>
        </div>
      </form>
    </DoctorAppShell>
  );
}
