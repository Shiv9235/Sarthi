"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  CalendarDays,
  FileText,
  Pill,
  ArrowRight,
  User,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Badge, StatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { StorageService } from "../../lib/data/storage";
import {
  UserProfile,
  PatientHealthProfile,
  AppointmentBooking,
  MedicalReport,
  Prescription,
  NursingBooking,
} from "../../lib/types";

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [healthProfile, setHealthProfile] = useState<PatientHealthProfile | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentBooking[]>([]);
  const [recentReports, setRecentReports] = useState<MedicalReport[]>([]);
  const [latestPrescription, setLatestPrescription] = useState<Prescription | null>(null);
  const [nursingBookings, setNursingBookings] = useState<NursingBooking[]>([]);

  useEffect(() => {
    setUser(StorageService.getUser());
    setHealthProfile(StorageService.getHealthProfile());
    setUpcomingAppointments(
      StorageService.getAppointmentBookings().filter(
        (a) => a.status === "confirmed" || a.status === "requested"
      )
    );
    setRecentReports(StorageService.getReports().slice(0, 3));
    const allPrescriptions = StorageService.getPrescriptions();
    const active = allPrescriptions.find((p) => p.status === "active") || allPrescriptions[0];
    setLatestPrescription(active || null);
    setNursingBookings(StorageService.getNursingBookings().slice(0, 2));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Personalized Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Patient Overview
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                Health ID: #{user?.id || "patient_001"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {getGreeting()}, {user?.fullName || "Sunita Sharma"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Welcome to SARTHI. Manage your care team, health records, and medicines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/profile/health">
              <Button variant="outline" size="sm" leftIcon={<User className="w-3.5 h-3.5 text-primary-700" />}>
                Health Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Compact Health Profile Summary Strip */}
        {healthProfile && (
          <div className="bg-white rounded-xl border border-surface-border p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Allergies:</span>
                {healthProfile.allergies.length > 0 ? (
                  <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {healthProfile.allergies.map((a) => a.allergen).join(", ")}
                  </span>
                ) : (
                  <span className="text-slate-500">None documented</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Active Diagnoses:</span>
                <span className="font-semibold text-slate-800">
                  {healthProfile.conditions.slice(0, 2).join(", ")}
                  {healthProfile.conditions.length > 2 && ` +${healthProfile.conditions.length - 2} more`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Primary Care:</span>
                <span className="font-semibold text-primary-800">
                  {healthProfile.primaryCareProvider?.name || "Dr. Arvind Mehta"}
                </span>
              </div>
            </div>

            <Link
              href="/profile/health"
              className="text-xs font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1 shrink-0"
            >
              <span>Edit Medical Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 
          EXACTLY FOUR PRIMARY FEATURE CARDS:
          1. Nursing Services
          2. Doctor Appointments
          3. Medical Reports
          4. Prescriptions
          Centered name only, no descriptions, no module numbers.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Nursing Services */}
          <Link href="/nursing" className="group">
            <div className="h-44 bg-white rounded-2xl border border-surface-border p-6 shadow-2xs hover:border-primary-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group-hover:bg-primary-50/30">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-2xs">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <span className="text-lg font-bold text-slate-800 group-hover:text-primary-800 transition-colors">
                Nursing Services
              </span>
            </div>
          </Link>

          {/* 2. Doctor Appointments */}
          <Link href="/appointments" className="group">
            <div className="h-44 bg-white rounded-2xl border border-surface-border p-6 shadow-2xs hover:border-primary-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group-hover:bg-primary-50/30">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-2xs">
                <CalendarDays className="w-7 h-7" />
              </div>
              <span className="text-lg font-bold text-slate-800 group-hover:text-primary-800 transition-colors">
                Doctor Appointments
              </span>
            </div>
          </Link>

          {/* 3. Medical Reports */}
          <Link href="/reports" className="group">
            <div className="h-44 bg-white rounded-2xl border border-surface-border p-6 shadow-2xs hover:border-primary-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group-hover:bg-primary-50/30">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-2xs">
                <FileText className="w-7 h-7" />
              </div>
              <span className="text-lg font-bold text-slate-800 group-hover:text-primary-800 transition-colors">
                Medical Reports
              </span>
            </div>
          </Link>

          {/* 4. Prescriptions */}
          <Link href="/prescriptions" className="group">
            <div className="h-44 bg-white rounded-2xl border border-surface-border p-6 shadow-2xs hover:border-primary-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group-hover:bg-primary-50/30">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-2xs">
                <Pill className="w-7 h-7" />
              </div>
              <span className="text-lg font-bold text-slate-800 group-hover:text-primary-800 transition-colors">
                Prescriptions
              </span>
            </div>
          </Link>
        </div>

        {/* Supporting Elements: Upcoming Appointments, Latest Reports, Active Prescriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Consultations & Nursing */}
          <Card className="lg:col-span-1">
            <CardHeader className="py-3.5">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Upcoming Bookings
                </h3>
              </div>
              <Link
                href="/appointments/history"
                className="text-xs text-primary-700 font-semibold hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {upcomingAppointments.length === 0 && nursingBookings.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No upcoming bookings scheduled.
                </div>
              ) : (
                <>
                  {upcomingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 rounded-lg border border-surface-border bg-slate-50/60 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{apt.doctorName}</p>
                          <p className="text-slate-500">{apt.doctorSpecialty}</p>
                        </div>
                        <StatusBadge status={apt.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 pt-1 border-t border-slate-200/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary-600" />
                          {apt.appointmentDate} at {apt.appointmentTime}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{apt.consultationType.replace("_", " ")}</span>
                      </div>
                    </div>
                  ))}

                  {nursingBookings.map((nb) => (
                    <div
                      key={nb.id}
                      className="p-3 rounded-lg border border-primary-100 bg-primary-50/30 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{nb.caregiverName}</p>
                          <p className="text-primary-800">{nb.serviceCategory}</p>
                        </div>
                        <StatusBadge status={nb.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 pt-1 border-t border-primary-200/40">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary-600" />
                          {nb.requestedDate} ({nb.requestedTime})
                        </span>
                        <span>•</span>
                        <span>{nb.durationHours} hrs</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Medical Reports */}
          <Card className="lg:col-span-1">
            <CardHeader className="py-3.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Lab Reports
                </h3>
              </div>
              <Link
                href="/reports"
                className="text-xs text-primary-700 font-semibold hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {recentReports.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No medical reports uploaded yet.
                </div>
              ) : (
                recentReports.map((rep) => (
                  <Link
                    key={rep.id}
                    href={`/reports/${rep.id}`}
                    className="block p-3 rounded-lg border border-surface-border hover:border-primary-300 hover:bg-primary-50/30 transition-all text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 truncate">
                        {rep.title}
                      </p>
                      <StatusBadge status={rep.status} size="sm" />
                    </div>
                    <p className="text-slate-500 flex items-center justify-between">
                      <span>{rep.facilityName}</span>
                      <span>{rep.reportDate}</span>
                    </p>
                    {rep.doctorNotes && (
                      <p className="text-[11px] text-primary-800 font-medium line-clamp-1">
                        Doctor note: {rep.doctorNotes}
                      </p>
                    )}
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Latest Prescription */}
          <Card className="lg:col-span-1">
            <CardHeader className="py-3.5">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Latest Active Prescription
                </h3>
              </div>
              <Link
                href="/prescriptions/latest"
                className="text-xs text-primary-700 font-semibold hover:underline"
              >
                Details
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {latestPrescription ? (
                <div className="p-3 rounded-lg border border-primary-100 bg-primary-50/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">
                        #{latestPrescription.prescriptionNumber}
                      </p>
                      <p className="text-slate-500">
                        {latestPrescription.doctorName}
                      </p>
                    </div>
                    <Badge variant="primary" size="sm">
                      v{latestPrescription.version} Active
                    </Badge>
                  </div>

                  <div className="pt-2 border-t border-primary-200/40 space-y-1.5">
                    {latestPrescription.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-slate-700"
                      >
                        <span className="font-medium">{item.medicineName}</span>
                        <span className="text-slate-500">{item.strength}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-primary-800 font-semibold">
                    <Link
                      href="/prescriptions/compare-medicines"
                      className="hover:underline flex items-center gap-1"
                    >
                      Compare prices
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href="/prescriptions/report-problem"
                      className="text-rose-600 hover:underline"
                    >
                      Report issue
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No active prescriptions recorded.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
