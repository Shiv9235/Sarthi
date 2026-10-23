"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  ShieldAlert,
  AlertTriangle,
  Pill,
  FileText,
  Activity,
  History,
  Calendar,
  Share2,
  TestTube,
  PlusCircle,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Heart,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { DoctorAppShell } from "../../../../components/layout/DoctorAppShell";
import { Button } from "../../../../components/ui/Button";
import { Alert } from "../../../../components/ui/Alert";
import { useAuth } from "../../../../lib/context/AuthContext";
import { StorageService } from "../../../../lib/data/storage";
import {
  UserProfile,
  PatientHealthProfile,
  ClinicalEncounter,
  Prescription,
  MedicalReport,
  InvestigationRequest,
  ReferralOrder,
} from "../../../../lib/types";

export default function DoctorPatientRecordPage() {
  const params = useParams();
  const router = useRouter();
  const { doctorProfile } = useAuth();
  const patientId = params.patientId as string;

  const doctorId = doctorProfile?.id || "doc_1";
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [patient, setPatient] = useState<UserProfile | null>(null);
  const [healthProfile, setHealthProfile] = useState<PatientHealthProfile | null>(null);
  const [encounters, setEncounters] = useState<ClinicalEncounter[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationRequest[]>([]);
  const [referrals, setReferrals] = useState<ReferralOrder[]>([]);

  useEffect(() => {
    // Check authorization
    const authorized = StorageService.isDoctorAuthorizedForPatient(doctorId, patientId);
    // In demo mode, doc_1 is always authorized for patient_001
    const allowed = authorized || patientId === "patient_001";
    setIsAuthorized(allowed);

    if (allowed) {
      setPatient(StorageService.getUser());
      setHealthProfile(StorageService.getHealthProfile());
      setEncounters(StorageService.getClinicalEncounters(patientId));
      setPrescriptions(StorageService.getPrescriptions().filter((p) => p.patientId === patientId));
      setReports(StorageService.getReports().filter((r) => r.patientId === patientId));
      setInvestigations(StorageService.getInvestigationRequests(patientId));
      setReferrals(StorageService.getReferralOrders(patientId));

      // Log access audit
      StorageService.logClinicalAudit({
        id: `audit_${Date.now()}`,
        patientId,
        doctorId,
        doctorName: doctorProfile?.name || "Dr. Arvind Mehta",
        action: "record_viewed",
        entityType: "patient",
        entityId: patientId,
        details: "Doctor accessed authorized complete medical record.",
        timestamp: new Date().toISOString(),
      });
    }
  }, [doctorId, patientId, doctorProfile?.name]);

  if (!isAuthorized) {
    return (
      <DoctorAppShell>
        <div className="bg-white rounded-2xl border border-red-200 p-12 text-center max-w-lg mx-auto">
          <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h1 className="text-lg font-bold text-slate-900">Access Restricted</h1>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            You do not currently possess active clinical authorization to access this patient's medical records.
            Access requires an active appointment, referral, or explicit consent from the patient.
          </p>
          <Button
            className="mt-6"
            variant="outline"
            onClick={() => router.push("/doctor/patients")}
          >
            ← Return to Authorized Patients
          </Button>
        </div>
      </DoctorAppShell>
    );
  }

  return (
    <DoctorAppShell>
      {/* Patient Header Card */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-surface-border">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-xl border border-primary-200 shrink-0">
              {patient?.fullName?.charAt(0) || "S"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {patient?.fullName || "Sunita Sharma"}
                </h1>
                <span className="text-xs font-semibold text-slate-600 bg-surface-ground px-2.5 py-1 rounded-md border border-surface-border">
                  {patient?.age || 44} yrs • {patient?.sex || "Female"}
                </span>
                <span className="text-xs font-semibold text-primary-800 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-700" />
                  Authorized Care Relationship
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {patient?.phone || "+91 98765 43210"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Mayur Vihar, New Delhi (PIN 110091)
                </span>
                <span>•</span>
                <span>
                  Emergency: <strong className="text-slate-800">Rajesh Sharma (Spouse) +91 98111 22334</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => router.push(`/doctor/appointments/ab_001`)}
              leftIcon={<Stethoscope className="w-4 h-4" />}
            >
              Start Consultation Note
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/doctor/prescriptions/new?patientId=${patientId}`)}
              leftIcon={<Pill className="w-4 h-4" />}
            >
              Issue Prescription
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/doctor/investigations/new?patientId=${patientId}`)}
              leftIcon={<TestTube className="w-4 h-4" />}
            >
              Order Lab / Scan
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/doctor/referrals/new?patientId=${patientId}`)}
              leftIcon={<Share2 className="w-4 h-4" />}
            >
              Referral
            </Button>
          </div>
        </div>

        {/* Severe Allergies Alert Banner */}
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <strong className="text-xs font-bold text-red-950 uppercase tracking-wider">
                Documented Drug Allergies & Contraindications
              </strong>
              <span className="text-[10px] font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                CRITICAL WARNING
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
              {healthProfile?.allergies.map((alg) => (
                <span
                  key={alg.id}
                  className="inline-flex items-center gap-1 bg-white border border-red-300 text-red-900 px-2.5 py-1 rounded-lg font-semibold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  {alg.allergen} ({alg.severity.toUpperCase()}): {alg.reaction}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Clinical Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Meds, Chronic Conditions, Clinical Encounters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Medications */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary-700" />
                Active Medication Regimen
              </h2>
              <Link
                href={`/doctor/prescriptions/new?patientId=${patientId}`}
                className="text-xs font-semibold text-primary-800 hover:underline flex items-center gap-1"
              >
                + Update Prescriptions
              </Link>
            </div>

            <div className="space-y-3">
              {healthProfile?.medications.map((med) => (
                <div
                  key={med.id}
                  className="p-3.5 rounded-xl bg-surface-ground border border-surface-border flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{med.name} — {med.dosage}</p>
                    <p className="text-slate-600 mt-0.5">{med.frequency}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Indication: {med.notes} • Prescriber: {med.prescribingDoctor}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-primary-800 bg-primary-100 px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Past Clinical Encounters & Consultation Notes */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-700" />
                Clinical Encounter History & Consultation Notes
              </h2>
              <Link
                href={`/doctor/patients/${patientId}/history`}
                className="text-xs font-semibold text-primary-800 hover:underline flex items-center gap-1"
              >
                Full Audit History <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {encounters.map((enc) => (
                <div
                  key={enc.id}
                  className="p-4 rounded-xl bg-surface-ground border border-surface-border space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        Encounter on {enc.encounterDate}
                      </span>
                      <span className="text-slate-500 text-xs ml-2">
                        by {enc.doctorName} ({enc.doctorSpecialty})
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-800 border border-primary-200">
                      ✓ Finalized & Signed
                    </span>
                  </div>

                  {/* Vitals */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Blood Pressure:</span>
                      <strong className="text-slate-900">{enc.vitals.bloodPressure || "128/82 mmHg"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Pulse Rate:</span>
                      <strong className="text-slate-900">{enc.vitals.pulseRate || 72} bpm</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">SpO2:</span>
                      <strong className="text-slate-900">{enc.vitals.oxygenSaturation || 99}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Weight / BMI:</span>
                      <strong className="text-slate-900">{enc.vitals.weightKg} kg (BMI {enc.vitals.bmi})</strong>
                    </div>
                  </div>

                  <div>
                    <strong className="text-slate-800 block font-semibold mb-0.5">Chief Complaint:</strong>
                    <p className="text-slate-600">{enc.chiefComplaint}</p>
                  </div>

                  <div>
                    <strong className="text-slate-800 block font-semibold mb-0.5">Provisional Assessment & Diagnosis:</strong>
                    <p className="text-slate-700 whitespace-pre-line bg-white p-2.5 rounded-lg border border-slate-200">
                      {enc.provisionalDiagnosis}
                    </p>
                  </div>

                  <div>
                    <strong className="text-slate-800 block font-semibold mb-0.5">Treatment Plan:</strong>
                    <p className="text-slate-700 whitespace-pre-line bg-primary-50/50 p-2.5 rounded-lg border border-primary-100">
                      {enc.treatmentPlan}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-surface-border text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Electronically signed on {enc.finalizedAt ? new Date(enc.finalizedAt).toLocaleDateString("en-IN") : enc.encounterDate}</span>
                    <span className="font-semibold text-slate-700">Follow-up: {enc.followUpDate || "Routine"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Chronic Conditions, Lab Reports & Investigations */}
        <div className="space-y-6">
          {/* Chronic Diagnoses */}
          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary-700" />
              Chronic Conditions & History
            </h2>
            <div className="space-y-2">
              {healthProfile?.conditions.map((cond, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-xl bg-surface-ground border border-surface-border text-xs font-semibold text-slate-800 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-primary-600" />
                  {cond}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-surface-border text-xs text-slate-600">
              <strong className="block text-slate-800 mb-1">Past Surgical Interventions:</strong>
              {healthProfile?.surgeries.map((s) => (
                <p key={s.id} className="text-[11px]">
                  • {s.procedure} ({s.year}) — {s.hospital}
                </p>
              ))}
            </div>
          </div>

          {/* Diagnostic Lab & Radiology Records */}
          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-700" />
                Medical Reports
              </h2>
              <Link
                href="/doctor/reports"
                className="text-xs font-semibold text-primary-800 hover:underline"
              >
                All reports →
              </Link>
            </div>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3 rounded-xl bg-surface-ground border border-surface-border text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate max-w-[170px]">
                      {rep.title}
                    </span>
                    <span className="text-[10px] font-semibold text-primary-800 bg-primary-100 px-2 py-0.5 rounded-full">
                      {rep.reportDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Facility: {rep.facilityName}
                  </p>
                  <div className="mt-2 pt-2 border-t border-surface-border flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {rep.measurements.length} measurements extracted
                    </span>
                    <Link
                      href={`/doctor/reports/${rep.id}`}
                      className="text-xs font-semibold text-primary-800 hover:underline"
                    >
                      Review & Approve →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Nav: Audit History */}
          <Link
            href={`/doctor/patients/${patientId}/history`}
            className="block p-4 rounded-2xl bg-primary-50 border border-primary-200 text-primary-900 hover:bg-primary-100/70 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-xs font-bold block">Complete Audit Timeline</strong>
                <p className="text-[11px] text-primary-800 mt-0.5">
                  View chronological timestamps for every encounter, prescription, lab order, and review.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-primary-700" />
            </div>
          </Link>
        </div>
      </div>
    </DoctorAppShell>
  );
}
