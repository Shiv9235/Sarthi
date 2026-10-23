"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Hospital,
  Video,
  XCircle,
  RotateCcw,
  ArrowLeft,
  CalendarPlus,
  MapPin,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardContent } from "../../../components/ui/Card";
import { StatusBadge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { StorageService } from "../../../lib/data/storage";
import { AppointmentBooking } from "../../../lib/types";

export default function AppointmentHistoryPage() {
  const [appointments, setAppointments] = useState<AppointmentBooking[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentBooking | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("10:30 AM");

  const refresh = () => {
    setAppointments(StorageService.getAppointmentBookings());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCancel = (apt: AppointmentBooking) => {
    setSelectedAppointment(apt);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = () => {
    if (!selectedAppointment) return;
    StorageService.cancelAppointmentBooking(selectedAppointment.id);
    setIsCancelModalOpen(false);
    refresh();
  };

  const handleReschedule = (apt: AppointmentBooking) => {
    setSelectedAppointment(apt);
    setRescheduleDate(apt.appointmentDate);
    setRescheduleTime(apt.appointmentTime);
    setIsRescheduleModalOpen(true);
  };

  const confirmReschedule = () => {
    if (!selectedAppointment || !rescheduleDate) return;
    const updated: AppointmentBooking = {
      ...selectedAppointment,
      appointmentDate: rescheduleDate,
      appointmentTime: rescheduleTime,
      status: "confirmed",
    };
    StorageService.saveAppointmentBooking(updated);
    setIsRescheduleModalOpen(false);
    refresh();
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/appointments" className="hover:text-primary-700 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Appointments
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Consultation History</span>
          </div>

          <Link href="/appointments/symptoms">
            <Button variant="primary" size="sm" leftIcon={<CalendarPlus className="w-3.5 h-3.5" />}>
              Book New Doctor
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Doctor Consultation History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Manage your scheduled clinic visits, view appointment details, and access rescheduling.
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-border p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No Doctor Appointments Recorded
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start our symptom questionnaire or browse specialists to schedule your first consultation.
            </p>
            <Link href="/appointments/symptoms">
              <Button variant="primary" size="sm">
                Start Symptom Assessment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <Card key={apt.id} className="border-surface-border">
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">
                          {apt.doctorName}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-400">
                          #{apt.id}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-primary-700">
                        {apt.doctorSpecialty} • {apt.hospitalName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <StatusBadge status={apt.status} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-primary-600 shrink-0" />
                      <span>
                        <strong>Date:</strong> {apt.appointmentDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-600 shrink-0" />
                      <span>
                        <strong>Time:</strong> {apt.appointmentTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {apt.consultationType === "in_person" ? (
                        <Hospital className="w-4 h-4 text-primary-600 shrink-0" />
                      ) : (
                        <Video className="w-4 h-4 text-primary-600 shrink-0" />
                      )}
                      <span className="capitalize">
                        <strong>Type:</strong> {apt.consultationType.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {apt.symptomsSummary && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <strong>Reason for Visit:</strong> {apt.symptomsSummary}
                    </div>
                  )}

                  <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                    <div className="text-xs font-semibold text-slate-700">
                      Consultation Fee: <span className="font-bold text-primary-900">₹{apt.fee.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {apt.status !== "completed" && apt.status !== "cancelled" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReschedule(apt)}
                            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancel(apt)}
                            leftIcon={<XCircle className="w-3.5 h-3.5" />}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Cancellation Modal */}
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title="Cancel Doctor Consultation"
          description="Are you sure you want to cancel this appointment?"
        >
          <div className="space-y-4 text-sm text-slate-600">
            <p>
              Cancelling will update your appointment status to <code>cancelled</code> and free up the slot for other patients.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
                Keep Appointment
              </Button>
              <Button variant="danger" onClick={confirmCancel}>
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </Modal>

        {/* Reschedule Modal */}
        <Modal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          title="Reschedule Appointment Slot"
          description="Select a new date and time for your consultation."
        >
          <div className="space-y-4">
            <Input
              label="New Appointment Date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              required
            />
            <Select
              label="New Time Slot"
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              options={[
                { value: "09:30 AM", label: "09:30 AM" },
                { value: "10:15 AM", label: "10:15 AM" },
                { value: "11:00 AM", label: "11:00 AM" },
                { value: "02:00 PM", label: "02:00 PM" },
                { value: "03:30 PM", label: "03:30 PM" },
                { value: "04:15 PM", label: "04:15 PM" },
              ]}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsRescheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmReschedule}>
                Save New Time
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
