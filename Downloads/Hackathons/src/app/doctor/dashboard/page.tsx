"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  CalendarDays,
  FileText,
  Pill,
  TestTube,
  Share2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Activity,
  ChevronRight,
  PlusCircle,
  Search,
} from "lucide-react";
import { DoctorAppShell } from "../../../components/layout/DoctorAppShell";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";
import { useAuth } from "../../../lib/context/AuthContext";
import { StorageService } from "../../../lib/data/storage";
import {
  DoctorPatientRelationship,
  AppointmentBooking,
  MedicationProblemReport,
  InvestigationRequest,
  MedicalReport,
} from "../../../lib/types";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { doctorProfile, isDoctorVerified } = useAuth();

  const [patients, setPatients] = useState<DoctorPatientRelationship[]>([]);
  const [appointments, setAppointments] = useState<AppointmentBooking[]>([]);
  const [medProblems, setMedProblems] = useState<MedicationProblemReport[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationRequest[]>([]);
  const [pendingReports, setPendingReports] = useState<MedicalReport[]>([]);

  const doctorId = doctorProfile?.id || "doc_1";

  useEffect(() => {
    const authorized = StorageService.getAuthorizedPatients(doctorId);
    setPatients(authorized);

    const appts = StorageService.getAppointmentBookings().filter(
      (a) => a.doctorId === doctorId || doctorId === "doc_1"
    );
    setAppointments(appts);

    const problems = StorageService.getMedicationProblems();
    setMedProblems(problems);

    const invs = StorageService.getInvestigationRequests(undefined, doctorId);
    setInvestigations(invs);

    const reports = StorageService.getReports().filter(
      (r) => r.status === "doctor_shared" || r.status === "doctor_approved"
    );
    setPendingReports(reports);
  }, [doctorId]);

  const activeProblemsCount = medProblems.filter((p) => p.status === "submitted").length;
  const isVerified = doctorProfile?.verificationStatus === "verified";

  return (
    <DoctorAppShell>
      {/* Verification Alert Banner if Not Verified */}
      {!isVerified && (
        <Alert type="warning" className="border-amber-300 bg-amber-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-amber-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                Medical Council Verification Pending
              </p>
              <p className="text-xs text-amber-900 mt-0.5">
                Your medical registration ({doctorProfile?.regNumber || "Pending"}) is currently under review.
                Clinical actions such as prescribing and finalized records require active verification.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push("/doctor/verification")}
              className="bg-white text-xs border-amber-300 text-amber-900 shrink-0"
            >
              Check Verification Status
            </Button>
          </div>
        </Alert>
      )}

      {/* Top Welcome Card */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
              {doctorProfile?.specialty || "Internal Medicine & Diabetology"}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-600 font-medium">
              {doctorProfile?.hospitalName || "Max Super Speciality Hospital"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome, {doctorProfile?.name || "Dr. Arvind Mehta"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Council Registration: <strong className="text-slate-800">{doctorProfile?.regNumber || "DMC/R/14290"}</strong> ({doctorProfile?.councilName || "Delhi Medical Council"})
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => router.push("/doctor/prescriptions/new")}
            leftIcon={<Pill className="w-4 h-4" />}
          >
            Issue Prescription
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/doctor/investigations/new")}
            leftIcon={<TestTube className="w-4 h-4" />}
          >
            Order Investigation
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/doctor/referrals/new")}
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            Refer Patient
          </Button>
        </div>
      </div>

      {/* Clinical Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/doctor/patients"
          className="bg-white rounded-2xl border border-surface-border p-4 shadow-xs hover:border-primary-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Authorized Patients</span>
            <Users className="w-4 h-4 text-primary-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{patients.length}</p>
          <p className="text-[11px] text-primary-700 mt-1 flex items-center gap-1 font-medium">
            Active consent granted <ChevronRight className="w-3 h-3" />
          </p>
        </Link>

        <Link
          href="/doctor/appointments"
          className="bg-white rounded-2xl border border-surface-border p-4 shadow-xs hover:border-primary-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Today's Schedule</span>
            <CalendarDays className="w-4 h-4 text-primary-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{appointments.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Confirmed consultations</p>
        </Link>

        <Link
          href="/doctor/medication-problems"
          className="bg-white rounded-2xl border border-surface-border p-4 shadow-xs hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Medication Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-900">{activeProblemsCount}</p>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">
            {activeProblemsCount > 0 ? "Requires doctor triage" : "No active alerts"}
          </p>
        </Link>

        <Link
          href="/doctor/reports"
          className="bg-white rounded-2xl border border-surface-border p-4 shadow-xs hover:border-primary-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Patient Reports</span>
            <FileText className="w-4 h-4 text-primary-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{pendingReports.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Lab & Scan documents</p>
        </Link>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Appointments & Authorized Patients (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Consultations */}
          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary-700" />
                Consultation Schedule
              </h2>
              <Link
                href="/doctor/appointments"
                className="text-xs font-semibold text-primary-800 hover:underline"
              >
                View all schedule →
              </Link>
            </div>

            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 rounded-xl bg-surface-ground border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          Sunita Sharma (Patient)
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 font-semibold">
                          {appt.consultationType === "in_person" ? "In-Person OPD" : "Teleconsultation"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Concern: {appt.symptomsSummary}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Scheduled: {appt.appointmentDate} at {appt.appointmentTime}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/doctor/appointments/${appt.id}`)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Start Consultation Note
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/doctor/patients/${appt.patientId}`)}
                      >
                        View History
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4">No scheduled consultations today.</p>
            )}
          </div>

          {/* Authorized Patients Roster */}
          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-700" />
                Authorized Patients Under Your Care
              </h2>
              <Link
                href="/doctor/patients"
                className="text-xs font-semibold text-primary-800 hover:underline"
              >
                Full patient roster →
              </Link>
            </div>

            <div className="space-y-3">
              {patients.map((pat) => (
                <div
                  key={pat.id}
                  className="p-4 rounded-xl bg-surface-ground border border-surface-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-sm border border-primary-200">
                      {pat.patientName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {pat.patientName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {pat.patientAge}y • {pat.patientSex}
                        </span>
                        <span className="text-[10px] font-semibold text-primary-800 bg-white border border-primary-200 px-2 py-0.5 rounded-full">
                          {pat.accessType} consent
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {pat.patientSummary}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/doctor/patients/${pat.patientId}`)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Medical Record
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Medication Alerts & Investigation Requests (1 col) */}
        <div className="space-y-6">
          {/* Medication Concerns Alert */}
          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Patient Medication Issues
            </h2>

            {medProblems.length > 0 ? (
              <div className="space-y-3">
                {medProblems.slice(0, 3).map((prob) => (
                  <div
                    key={prob.id}
                    className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{prob.medicineName}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          prob.severity === "severe" || prob.severity === "urgent"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {prob.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2">{prob.description}</p>
                    <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        Status: <strong className="text-slate-700">{prob.status}</strong>
                      </span>
                      <Link
                        href={`/doctor/medication-problems/${prob.id}`}
                        className="text-xs font-semibold text-primary-800 hover:underline"
                      >
                        Triage & Respond →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-2">
                No active medication issues reported by your patients.
              </div>
            )}
          </div>

          {/* Investigation Recommendations Tracker */}
          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TestTube className="w-4 h-4 text-primary-700" />
                Investigation Requests
              </h2>
              <Link
                href="/doctor/investigations"
                className="text-xs font-semibold text-primary-800 hover:underline"
              >
                All tests →
              </Link>
            </div>

            <div className="space-y-2.5">
              {investigations.slice(0, 4).map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 rounded-xl bg-surface-ground border border-surface-border text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                      {inv.testName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === "recommended"
                          ? "bg-amber-100 text-amber-800"
                          : inv.status === "accepted_by_patient"
                          ? "bg-blue-100 text-blue-800"
                          : inv.status === "completed"
                          ? "bg-primary-100 text-primary-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {inv.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Patient: {inv.patientName} • Facility: {inv.recommendedFacility || "Any NABL Lab"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DoctorAppShell>
  );
}
