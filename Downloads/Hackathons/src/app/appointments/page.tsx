"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Sparkles,
  ArrowRight,
  Calendar,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function AppointmentsLandingPage() {
  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header: Exact title with no subtitles or secondary descriptions beneath */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Doctor Consultations & Appointments
          </h1>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/appointments/history">
              <Button variant="outline" size="sm" leftIcon={<Calendar className="w-3.5 h-3.5 text-primary-700" />}>
                My Appointments
              </Button>
            </Link>
          </div>
        </div>

        {/* Symptom-First Assessment Gate (No premature doctor suggestions displayed) */}
        <div className="max-w-2xl mx-auto py-8">
          <div className="bg-white rounded-2xl border border-surface-border p-8 sm:p-10 text-center space-y-6 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mx-auto shadow-2xs">
              <Stethoscope className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Describe Your Symptoms to Find the Right Doctor
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Doctor recommendations are personalized based on your symptoms and clinical needs. Start our brief questionnaire to find verified specialists and hospitals.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/appointments/symptoms">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-8"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Start Symptom Questionnaire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
