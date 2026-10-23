"use client";

import React, { useState, use, Suspense } from "react";
import Link from "next/link";
import { useRouter, notFound, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Clock,
  MapPin,
  Hospital,
  Video,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "../../../../components/layout/AppShell";
import { Card, CardHeader, CardContent, CardFooter } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { Textarea } from "../../../../components/ui/Textarea";
import { Alert } from "../../../../components/ui/Alert";
import { StorageService } from "../../../../lib/data/storage";
import { useAuth } from "../../../../lib/context/AuthContext";
import { AppointmentBooking } from "../../../../lib/types";

const TIME_SLOTS = [
  "09:30 AM",
  "10:15 AM",
  "11:00 AM",
  "11:45 AM",
  "02:00 PM",
  "02:45 PM",
  "03:30 PM",
  "04:15 PM",
];

export default function BookDoctorAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-8 text-center text-xs text-slate-500">
            Loading slot scheduler...
          </div>
        </AppShell>
      }
    >
      <BookDoctorAppointmentContent params={params} />
    </Suspense>
  );
}

function BookDoctorAppointmentContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const doc = StorageService.getDoctorById(resolvedParams.id);

  if (!doc) {
    notFound();
  }

  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1]);
  const [consultationType, setConsultationType] = useState<"in_person" | "teleconsultation">(
    "in_person"
  );
  const [symptomsSummary, setSymptomsSummary] = useState(
    searchParams.get("symptoms") || "Routine metabolic follow-up and clinical review."
  );

  const [step, setStep] = useState<"select" | "review">("select");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const newAppointment: AppointmentBooking = {
      id: `ab_${Date.now()}`,
      patientId: user?.id || "patient_001",
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      hospitalName: doc.hospitalName,
      appointmentDate,
      appointmentTime: selectedSlot,
      consultationType,
      fee: doc.consultationFee,
      symptomsSummary,
      status: "confirmed",
      isDemo: true,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveAppointmentBooking(newAppointment);
    setIsSubmitting(false);

    router.push(`/appointments/confirmation?id=${newAppointment.id}`);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href={`/appointments/doctor/${doc.id}`} className="hover:text-primary-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Doctor Profile
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Book Appointment</span>
        </div>

        {/* Doctor Summary Banner */}
        <div className="bg-white rounded-xl p-4 border border-surface-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={doc.photoUrl}
              alt={doc.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h2>
              <p className="text-xs text-primary-700 font-medium truncate">
                {doc.specialty} • {doc.hospitalName}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-base font-extrabold text-slate-900">₹{doc.consultationFee.toLocaleString("en-IN")}</span>
            <p className="text-[11px] text-slate-400">Consultation Fee</p>
          </div>
        </div>

        {step === "select" ? (
          <Card>
            <CardHeader>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Select Appointment Slot & Format
                </h1>
                <p className="text-xs text-slate-500">
                  Choose your preferred consultation format, date, and time slot.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Consultation Type Toggle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Consultation Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultationType("in_person")}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      consultationType === "in_person"
                        ? "bg-primary-50 border-primary-600 text-primary-950 ring-2 ring-primary-600/20"
                        : "bg-white border-surface-border text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Hospital className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs sm:text-sm">In-Person Consultation</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Physical visit at {doc.hospitalName}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType("teleconsultation")}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      consultationType === "teleconsultation"
                        ? "bg-primary-50 border-primary-600 text-primary-950 ring-2 ring-primary-600/20"
                        : "bg-white border-surface-border text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Video className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs sm:text-sm">Video Teleconsultation</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Encrypted video call link sent to your phone/email
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <Input
                  label="Select Consultation Date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              {/* Time Slot Grid */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Available Consultation Slots ({appointmentDate})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                          isSelected
                            ? "bg-primary-700 text-white border-primary-800 shadow-sm ring-2 ring-primary-600/30"
                            : "bg-slate-50 text-slate-700 border-surface-border hover:border-primary-400 hover:bg-white"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reason for Visit */}
              <div>
                <Textarea
                  label="Chief Concern / Symptoms for this Consultation"
                  value={symptomsSummary}
                  onChange={(e) => setSymptomsSummary(e.target.value)}
                  rows={3}
                  required
                  helperText="Brief summary shared with the doctor before your visit."
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link href={`/appointments/doctor/${doc.id}`}>
                <Button variant="outline">Back</Button>
              </Link>
              <Button
                variant="primary"
                onClick={() => setStep("review")}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Review Booking Details
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Review & Confirm Appointment
                </h2>
                <p className="text-xs text-slate-500">
                  Verify the clinical details before scheduling.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="divide-y divide-slate-100 rounded-xl border border-surface-border bg-slate-50/60 p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2">
                  <span className="text-slate-500">Doctor</span>
                  <span className="font-bold text-slate-900">{doc.name}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Specialty</span>
                  <span className="font-semibold text-primary-800">{doc.specialty}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Hospital / Facility</span>
                  <span className="font-medium text-slate-800">{doc.hospitalName}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Date & Slot</span>
                  <span className="font-bold text-slate-900">
                    {appointmentDate} at {selectedSlot}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Consultation Type</span>
                  <span className="font-semibold uppercase tracking-wider text-slate-800">
                    {consultationType.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Symptoms Note</span>
                  <span className="font-medium text-slate-800 text-right max-w-xs">
                    {symptomsSummary}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 text-sm">
                  <span className="font-bold text-slate-900">Consultation Fee</span>
                  <span className="text-xl font-black text-primary-900">
                    ₹{doc.consultationFee.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <Alert type="info">
                <strong>Local Demo Confirmation:</strong> In this phase, your appointment is persisted in your local patient history. If clinic integration is connected, real scheduling occurs.
              </Alert>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("select")}>
                Change Slot
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                isLoading={isSubmitting}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Confirm Appointment Request
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
