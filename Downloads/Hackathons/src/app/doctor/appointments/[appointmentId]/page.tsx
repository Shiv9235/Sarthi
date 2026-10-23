"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Stethoscope,
  Activity,
  AlertTriangle,
  Pill,
  TestTube,
  Share2,
  CheckCircle2,
  Save,
  Lock,
  ArrowRight,
  Clock,
  User,
  ShieldCheck,
} from "lucide-react";
import { DoctorAppShell } from "../../../../components/layout/DoctorAppShell";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Alert } from "../../../../components/ui/Alert";
import { useAuth } from "../../../../lib/context/AuthContext";
import { StorageService } from "../../../../lib/data/storage";
import { ClinicalEncounter, ClinicalVitals, AppointmentBooking } from "../../../../lib/types";

export default function ConsultationEncounterPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;
  const { doctorProfile } = useAuth();

  const [appointment, setAppointment] = useState<AppointmentBooking | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [chiefComplaint, setChiefComplaint] = useState(
    "Routine quarterly follow-up for Type 2 Diabetes and blood pressure monitoring. Occasional post-meal abdominal fullness."
  );
  const [symptomsHistory, setSymptomsHistory] = useState(
    "Known diabetic and hypertensive patient on Glycomet 500 BD, Telma 40 OD, and Atorva 10 OD. Fasting sugar reports stable around 118 mg/dL. Compliant with diet."
  );
  const [bpSystolic, setBpSystolic] = useState("128");
  const [bpDiastolic, setBpDiastolic] = useState("82");
  const [pulseRate, setPulseRate] = useState("74");
  const [tempF, setTempF] = useState("98.4");
  const [respiratoryRate, setRespiratoryRate] = useState("16");
  const [spO2, setSpO2] = useState("99");
  const [weightKg, setWeightKg] = useState("68.5");
  const [heightCm, setHeightCm] = useState("158");

  const [examFindings, setExamFindings] = useState(
    "Conscious, oriented, afebrile. No peripheral pedal edema. Chest clear bilaterally with vesicular breath sounds. S1, S2 audible, no murmurs. Abdomen soft, non-tender, no organomegaly."
  );
  const [diagnosis, setDiagnosis] = useState(
    "1. Type 2 Diabetes Mellitus — Fair glycemic control (HbA1c 6.8%)\n2. Essential Hypertension — Well controlled\n3. Dyslipidemia — Responding to statin therapy"
  );
  const [treatmentPlan, setTreatmentPlan] = useState(
    "1. Continue Glycomet 500 mg: 1 tab twice daily after meals (morning and night).\n2. Continue Telma 40 mg: 1 tab once daily in morning.\n3. Continue Atorva 10 mg: 1 tab once daily at bedtime.\n4. Advised 30 min brisk walk 5 days a week."
  );
  const [followUpDate, setFollowUpDate] = useState("2026-11-20");

  // Compute BMI
  const weight = parseFloat(weightKg) || 0;
  const heightM = (parseFloat(heightCm) || 0) / 100;
  const bmi = heightM > 0 && weight > 0 ? (weight / (heightM * heightM)).toFixed(1) : "27.4";

  useEffect(() => {
    const appts = StorageService.getAppointmentBookings();
    const appt = appts.find((a) => a.id === appointmentId) || appts[0];
    if (appt) setAppointment(appt);

    const existingEnc = StorageService.getClinicalEncounters(appt?.patientId || "patient_001")[0];
    if (existingEnc && existingEnc.appointmentId === appointmentId && existingEnc.status === "finalized") {
      setIsFinalized(true);
    }
  }, [appointmentId]);

  const handleSaveDraft = () => {
    const enc: ClinicalEncounter = {
      id: `enc_${appointmentId || Date.now()}`,
      patientId: appointment?.patientId || "patient_001",
      patientName: "Sunita Sharma",
      doctorId: doctorProfile?.id || "doc_1",
      doctorName: doctorProfile?.name || "Dr. Arvind Mehta, MD",
      doctorSpecialty: doctorProfile?.specialty || "Internal Medicine & Diabetology",
      appointmentId,
      encounterDate: new Date().toLocaleDateString("en-IN"),
      encounterType: appointment?.consultationType || "in_person",
      chiefComplaint,
      symptomsHistory,
      vitals: {
        bloodPressure: `${bpSystolic}/${bpDiastolic} mmHg`,
        pulseRate: parseInt(pulseRate) || 72,
        temperatureF: parseFloat(tempF) || 98.4,
        respiratoryRate: parseInt(respiratoryRate) || 16,
        oxygenSaturation: parseInt(spO2) || 99,
        weightKg: weight,
        heightCm: parseFloat(heightCm) || 158,
        bmi: parseFloat(bmi),
      },
      examinationFindings: examFindings,
      provisionalDiagnosis: diagnosis,
      clinicalNotes: "Encounter draft saved by physician.",
      treatmentPlan,
      followUpDate,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveClinicalEncounter(enc);
    setSuccessMessage("Consultation draft note saved successfully.");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleFinalize = () => {
    const enc: ClinicalEncounter = {
      id: `enc_${appointmentId || Date.now()}`,
      patientId: appointment?.patientId || "patient_001",
      patientName: "Sunita Sharma",
      doctorId: doctorProfile?.id || "doc_1",
      doctorName: doctorProfile?.name || "Dr. Arvind Mehta, MD",
      doctorSpecialty: doctorProfile?.specialty || "Internal Medicine & Diabetology",
      appointmentId,
      encounterDate: new Date().toLocaleDateString("en-IN"),
      encounterType: appointment?.consultationType || "in_person",
      chiefComplaint,
      symptomsHistory,
      vitals: {
        bloodPressure: `${bpSystolic}/${bpDiastolic} mmHg`,
        pulseRate: parseInt(pulseRate) || 72,
        temperatureF: parseFloat(tempF) || 98.4,
        respiratoryRate: parseInt(respiratoryRate) || 16,
        oxygenSaturation: parseInt(spO2) || 99,
        weightKg: weight,
        heightCm: parseFloat(heightCm) || 158,
        bmi: parseFloat(bmi),
      },
      examinationFindings: examFindings,
      provisionalDiagnosis: diagnosis,
      clinicalNotes: `Final consultation summary signed by ${doctorProfile?.name || "Dr. Arvind Mehta"}. Council Reg: ${doctorProfile?.regNumber || "DMC/R/14290"}.`,
      treatmentPlan,
      followUpDate,
      status: "finalized",
      finalizedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveClinicalEncounter(enc);
    setIsFinalized(true);
    setSuccessMessage("Consultation note finalized and electronically signed. Patient record updated.");
  };

  return (
    <DoctorAppShell>
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <Link
          href="/doctor/appointments"
          className="text-xs font-semibold text-primary-800 hover:underline"
        >
          ← Back to Appointment Schedule
        </Link>
        <div className="flex items-center gap-2">
          {isFinalized ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-primary-100 text-primary-800 border border-primary-200">
              <Lock className="w-3 h-3 text-primary-700" />
              Finalized & Electronically Signed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-700" />
              Draft Encounter Note
            </span>
          )}
        </div>
      </div>

      {successMessage && <Alert type="success">{successMessage}</Alert>}

      {/* Patient & Allergy Context Banner */}
      <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-lg border border-primary-200 shrink-0">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">Sunita Sharma</h1>
              <span className="text-xs text-slate-500">44 yrs • Female</span>
              <span className="text-[10px] font-semibold text-primary-800 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                In-Person Consultation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reason: {appointment?.symptomsSummary || "Follow-up metabolic review and blood pressure check."}
            </p>
          </div>
        </div>

        {/* Allergy Warning Pill */}
        <div className="bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 text-red-900 shrink-0">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <div>
            <strong className="block text-[11px] uppercase tracking-wider text-red-950">Severe Allergy Flag</strong>
            <span>Penicillin (Skin hives / swelling) • Sulfa Drugs</span>
          </div>
        </div>
      </div>

      {/* Encounter Note Form */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-6">
        {/* Section 1: Objective Vitals */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-700" />
            1. Clinical Vitals Recorded at OPD
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">BP Systolic</label>
              <div className="relative">
                <input
                  type="text"
                  value={bpSystolic}
                  disabled={isFinalized}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500"
                />
                <span className="text-[10px] text-slate-400 absolute right-2 top-2">mmHg</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">BP Diastolic</label>
              <div className="relative">
                <input
                  type="text"
                  value={bpDiastolic}
                  disabled={isFinalized}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500"
                />
                <span className="text-[10px] text-slate-400 absolute right-2 top-2">mmHg</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pulse Rate</label>
              <div className="relative">
                <input
                  type="text"
                  value={pulseRate}
                  disabled={isFinalized}
                  onChange={(e) => setPulseRate(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500"
                />
                <span className="text-[10px] text-slate-400 absolute right-2 top-2">bpm</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Oxygen SpO2</label>
              <div className="relative">
                <input
                  type="text"
                  value={spO2}
                  disabled={isFinalized}
                  onChange={(e) => setSpO2(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500"
                />
                <span className="text-[10px] text-slate-400 absolute right-2 top-2">%</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="text"
                value={weightKg}
                disabled={isFinalized}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Computed BMI</label>
              <div className="text-xs font-bold text-slate-800 bg-surface-ground px-2.5 py-1.5 rounded-xl border border-surface-border">
                {bmi} kg/m²
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Subjective & History */}
        <div className="pt-4 border-t border-surface-border space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-primary-700" />
            2. Chief Complaint & History of Present Illness
          </h2>
          <div>
            <textarea
              rows={2}
              value={chiefComplaint}
              disabled={isFinalized}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none"
              placeholder="Record patient complaints, onset, duration, and severity..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              History & Medication Adherence Context
            </label>
            <textarea
              rows={2}
              value={symptomsHistory}
              disabled={isFinalized}
              onChange={(e) => setSymptomsHistory(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Physical Examination */}
        <div className="pt-4 border-t border-surface-border">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-700" />
            3. Physical Examination Findings
          </h2>
          <textarea
            rows={2}
            value={examFindings}
            disabled={isFinalized}
            onChange={(e) => setExamFindings(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* Section 4: Assessment & Diagnosis */}
        <div className="pt-4 border-t border-surface-border">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-700" />
            4. Provisional Clinical Diagnosis
          </h2>
          <textarea
            rows={3}
            value={diagnosis}
            disabled={isFinalized}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none font-mono"
          />
        </div>

        {/* Section 5: Treatment Plan */}
        <div className="pt-4 border-t border-surface-border">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary-700" />
            5. Treatment Plan & Patient Instructions
          </h2>
          <textarea
            rows={3}
            value={treatmentPlan}
            disabled={isFinalized}
            onChange={(e) => setTreatmentPlan(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none font-mono"
          />
        </div>

        {/* Quick Linked Clinical Orders */}
        <div className="pt-4 border-t border-surface-border p-4 rounded-xl bg-surface-ground">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
            Link Clinical Orders to this Consultation
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/doctor/prescriptions/new?patientId=patient_001`)}
              leftIcon={<Pill className="w-3.5 h-3.5 text-primary-700" />}
            >
              Write Prescription
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/doctor/investigations/new?patientId=patient_001`)}
              leftIcon={<TestTube className="w-3.5 h-3.5 text-primary-700" />}
            >
              Order Lab / Scan
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/doctor/referrals/new?patientId=patient_001`)}
              leftIcon={<Share2 className="w-3.5 h-3.5 text-primary-700" />}
            >
              Specialist Referral
            </Button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-6 border-t border-surface-border flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Consultant: <strong className="text-slate-800">{doctorProfile?.name || "Dr. Arvind Mehta"}</strong> ({doctorProfile?.regNumber || "DMC/R/14290"})
          </div>

          <div className="flex items-center gap-2">
            {!isFinalized ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Draft Note
                </Button>
                <Button
                  size="sm"
                  onClick={handleFinalize}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Finalize & Sign Electronically
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/doctor/appointments")}
              >
                Return to Appointments
              </Button>
            )}
          </div>
        </div>
      </div>
    </DoctorAppShell>
  );
}
