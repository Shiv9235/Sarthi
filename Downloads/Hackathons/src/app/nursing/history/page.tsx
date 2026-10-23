"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  XCircle,
  RotateCcw,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CalendarPlus,
  ShieldCheck,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { StatusBadge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { StorageService } from "../../../lib/data/storage";
import { NursingBooking, SaartheeHomeCareBooking } from "../../../lib/types";

export default function NursingHistoryPage() {
  const [bookings, setBookings] = useState<NursingBooking[]>([]);
  const [saartheeBookings, setSaartheeBookings] = useState<SaartheeHomeCareBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<NursingBooking | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  // Reschedule form state
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("08:00 AM");

  const refresh = () => {
    setBookings(StorageService.getNursingBookings());
    setSaartheeBookings(StorageService.getSaartheeHomeCareBookings());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCancel = (booking: NursingBooking) => {
    setSelectedBooking(booking);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = () => {
    if (!selectedBooking) return;
    StorageService.cancelNursingBooking(selectedBooking.id);
    StorageService.cancelSaartheeHomeCareBooking(selectedBooking.id);
    setIsCancelModalOpen(false);
    refresh();
  };

  const handleReschedule = (booking: NursingBooking) => {
    setSelectedBooking(booking);
    setRescheduleDate(booking.requestedDate);
    setRescheduleTime(booking.requestedTime);
    setIsRescheduleModalOpen(true);
  };

  const confirmReschedule = () => {
    if (!selectedBooking || !rescheduleDate) return;
    const updated: NursingBooking = {
      ...selectedBooking,
      requestedDate: rescheduleDate,
      requestedTime: rescheduleTime,
      status: "requested",
      statusMessage: "Reschedule requested by patient. Awaiting caregiver re-confirmation.",
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveNursingBooking(updated);
    setIsRescheduleModalOpen(false);
    refresh();
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/nursing" className="hover:text-emerald-700 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Home-Care Marketplace
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Booking Requests & History</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/nursing/intake">
              <Button variant="outline" size="sm">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Guided Intake
              </Button>
            </Link>
            <Link href="/nursing">
              <Button variant="primary" size="sm">
                <CalendarPlus className="w-3.5 h-3.5 mr-1" />
                Book Care Provider
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Home-Care Requests & Active Shifts
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Track clinical coordination status, shift timings, reschedule dates, or cancel upcoming nursing visits.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">
              No Home Care Bookings Logged Yet
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              You haven&apos;t requested any home nursing visits or attendants yet. Browse our 9 verified care categories to find qualified support.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link href="/nursing/intake">
                <Button variant="primary" size="sm">
                  Start 2-Min Guided Intake
                </Button>
              </Link>
              <Link href="/nursing">
                <Button variant="outline" size="sm">
                  Browse Providers
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="border-gray-200 shadow-sm hover:border-emerald-200 transition-all">
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-extrabold text-sm shrink-0">
                        {booking.caregiverName.replace("Sister ", "").replace("Dr. ", "").replace("Nurse ", "").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-sm">
                            {booking.caregiverName}
                          </h3>
                          <span className="text-[10px] text-gray-400 font-mono">
                            #{booking.id}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-700">
                          {booking.serviceCategory}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 capitalize">
                        {booking.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Date:</strong> {booking.requestedDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Time / Shift:</strong> {booking.requestedTime} ({booking.durationHours} hrs)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">
                        <strong>Address:</strong> {booking.serviceAddress}
                      </span>
                    </div>
                  </div>

                  {booking.careNeedsDescription && (
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-700">
                      <strong>Care Notes:</strong> {booking.careNeedsDescription}
                    </div>
                  )}

                  {booking.statusMessage && (
                    <div className="flex items-start gap-2 text-xs text-emerald-900 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>
                        <strong>Coordinator Note:</strong> {booking.statusMessage}
                      </span>
                    </div>
                  )}

                  {/* Actions (Cancel / Reschedule) */}
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-gray-700">
                      Estimated Cost: <span className="font-extrabold text-emerald-950 text-sm">₹{booking.estimatedCost.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.status !== "completed" && booking.status !== "cancelled" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(booking)}
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReschedule(booking)}
                            className="text-xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-1" />
                            Reschedule
                          </Button>
                        </>
                      )}
                      <a href="tel:+911145678900" className="inline-flex items-center text-xs font-medium text-emerald-700 hover:underline">
                        <PhoneCall className="w-3 h-3 mr-1" />
                        Saarthee Support
                      </a>
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
          title="Cancel Home Care Request"
        >
          <div className="space-y-4 text-xs sm:text-sm text-gray-600">
            <p>
              Are you sure you want to cancel the home care request for{" "}
              <strong className="text-gray-900">{selectedBooking?.caregiverName}</strong> on{" "}
              <strong className="text-gray-900">{selectedBooking?.requestedDate}</strong>?
            </p>
            <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              There is no cancellation fee if cancelled at least 2 hours before the scheduled shift start.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsCancelModalOpen(false)}>
                Keep Booking
              </Button>
              <Button variant="danger" size="sm" onClick={confirmCancel}>
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </Modal>

        {/* Reschedule Modal */}
        <Modal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          title="Reschedule Care Shift"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                New Preferred Date:
              </label>
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full text-sm rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Shift Timing:
              </label>
              <select
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="w-full text-sm rounded-lg border border-gray-300 p-2.5 bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="08:00 AM">Day Shift (08:00 AM)</option>
                <option value="10:00 AM">Morning Visit (10:00 AM)</option>
                <option value="02:00 PM">Afternoon Visit (02:00 PM)</option>
                <option value="08:00 PM">Night Shift (08:00 PM)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsRescheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={confirmReschedule}>
                Submit Reschedule Request
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
