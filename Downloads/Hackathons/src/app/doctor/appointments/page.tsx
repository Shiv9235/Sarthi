"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Stethoscope,
  Filter,
} from "lucide-react";
import { DoctorAppShell } from "../../../components/layout/DoctorAppShell";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../lib/context/AuthContext";
import { StorageService } from "../../../lib/data/storage";
import { AppointmentBooking } from "../../../lib/types";

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const { doctorProfile } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentBooking[]>([]);

  const doctorId = doctorProfile?.id || "doc_1";

  useEffect(() => {
    const list = StorageService.getAppointmentBookings().filter(
      (a) => a.doctorId === doctorId || doctorId === "doc_1"
    );
    setAppointments(list);
  }, [doctorId]);

  return (
    <DoctorAppShell>
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-primary-700" />
            Consultation Roster & Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage scheduled patient consultations, launch encounter notes, record vitals, and issue clinical orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-surface-ground px-3 py-1.5 rounded-xl border border-surface-border">
            Total Consultations: {appointments.length}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs hover:border-primary-300 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-lg border border-primary-200 shrink-0">
                  S
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      Sunita Sharma (Patient)
                    </h2>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800">
                      {appt.consultationType === "in_person" ? "In-Person Hospital OPD" : "Video Teleconsultation"}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Patient Chief Concern: <strong>{appt.symptomsSummary}</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-primary-700" />
                      {appt.appointmentDate} at {appt.appointmentTime}
                    </span>
                    <span>•</span>
                    <span>OPD Fee: ₹{appt.fee}</span>
                    <span>•</span>
                    <span className="text-red-700 font-semibold">Allergy Alert: Penicillin</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => router.push(`/doctor/appointments/${appt.id}`)}
                  leftIcon={<Stethoscope className="w-4 h-4" />}
                >
                  Start Consultation Note
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/doctor/patients/${appt.patientId}`)}
                >
                  View Medical Record
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DoctorAppShell>
  );
}
