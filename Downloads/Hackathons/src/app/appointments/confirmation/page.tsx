"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Hospital,
  Video,
  ArrowRight,
  CalendarDays,
  FileText,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { StorageService } from "../../../lib/data/storage";

export default function AppointmentConfirmationPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-8 text-center text-xs text-slate-500">
            Loading confirmation...
          </div>
        </AppShell>
      }
    >
      <AppointmentConfirmationContent />
    </Suspense>
  );
}

function AppointmentConfirmationContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("id");

  const appointment = StorageService.getAppointmentBookings().find(
    (a) => a.id === appointmentId
  ) || StorageService.getAppointmentBookings()[0];

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6 text-center py-6">
        <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-800 border border-primary-200 text-xs font-bold uppercase tracking-wider">
            Appointment Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Your Consultation Is Scheduled
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
            We have recorded your appointment with {appointment?.doctorName || "your specialist"}.
          </p>
        </div>

        {appointment && (
          <Card className="text-left border-surface-border shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-surface-border">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {appointment.doctorName}
                  </h3>
                  <p className="text-xs text-primary-700 font-semibold">
                    {appointment.doctorSpecialty}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {appointment.hospitalName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400 block">Reference</span>
                  <span className="text-xs font-mono font-bold text-slate-700">#{appointment.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
                  <span>
                    <strong>Date:</strong> {appointment.appointmentDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-600 shrink-0" />
                  <span>
                    <strong>Time:</strong> {appointment.appointmentTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  {appointment.consultationType === "in_person" ? (
                    <Hospital className="w-4 h-4 text-primary-600 shrink-0" />
                  ) : (
                    <Video className="w-4 h-4 text-primary-600 shrink-0" />
                  )}
                  <span>
                    <strong>Type:</strong>{" "}
                    {appointment.consultationType === "in_person"
                      ? "In-Person Clinic Visit (Please arrive 10 min early with ID)"
                      : "Video Teleconsultation (Access link active 15 min prior)"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <strong className="text-slate-900 block font-semibold">
                  Pre-Consultation Checklist:
                </strong>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-600">
                  <li>Review your latest medical reports in the Reports section.</li>
                  <li>Have your current medication list handy.</li>
                  <li>Prepare any specific questions for the physician.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/appointments/history">
            <Button variant="primary" rightIcon={<CalendarDays className="w-4 h-4" />}>
              View All My Appointments
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
