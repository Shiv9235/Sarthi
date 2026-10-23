"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Pill,
  UploadCloud,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShoppingBag,
  Search,
  BookOpen,
} from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StorageService } from "../../lib/data/storage";
import { Prescription } from "../../lib/types";

export default function PrescriptionsLandingPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    setPrescriptions(StorageService.getPrescriptions());
  }, []);

  const latestActive = prescriptions.find((p) => p.status === "active") || prescriptions[0];

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Prescriptions & Medicines
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your active prescriptions, research active ingredients, compare brand vs. generic alternatives, and log medication concerns.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/prescriptions/compare-medicines">
              <Button variant="outline" size="sm" leftIcon={<ShoppingBag className="w-3.5 h-3.5 text-primary-700" />}>
                Compare Medicine Prices
              </Button>
            </Link>
          </div>
        </div>

        {/* 
          FOUR PRINCIPAL CARDS:
          1. Upload Prescription
          2. Latest Doctor's Prescription
          3. Medicine Guide & Alternatives (NEW)
          4. Report a Medication Problem
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Upload Prescription */}
          <Link href="/prescriptions/upload" className="group">
            <div className="h-36 bg-white rounded-2xl border border-surface-border p-4 shadow-2xs hover:border-primary-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group-hover:bg-primary-50/30">
              <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary-800 transition-colors">
                Upload Prescription
              </span>
            </div>
          </Link>

          {/* Card 2: Latest Doctor's Prescription */}
          <Link href="/prescriptions/latest" className="group">
            <div className="h-36 bg-white rounded-2xl border border-surface-border p-4 shadow-2xs hover:border-primary-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group-hover:bg-primary-50/30">
              <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary-800 transition-colors">
                Latest Prescription
              </span>
            </div>
          </Link>

          {/* Card 3: Medicine Guide & Alternatives (NEW) */}
          <Link href="/prescriptions/medicine-guide" className="group">
            <div className="h-36 bg-white rounded-2xl border border-surface-border p-4 shadow-2xs hover:border-primary-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group-hover:bg-primary-50/30">
              <div className="w-12 h-12 rounded-xl bg-primary-100 border border-primary-300 text-primary-800 flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 group-hover:bg-primary-700 group-hover:text-white transition-all">
                <BookOpen className="w-6 h-6 text-primary-700 group-hover:text-white" />
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary-800 transition-colors">
                Medicine Guide & Alternatives
              </span>
            </div>
          </Link>

          {/* Card 4: Report a Medication Problem */}
          <Link href="/prescriptions/report-problem" className="group">
            <div className="h-36 bg-white rounded-2xl border border-surface-border p-4 shadow-2xs hover:border-rose-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group-hover:bg-rose-50/30">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-rose-800 transition-colors">
                Report a Problem
              </span>
            </div>
          </Link>
        </div>

        {/* Active Regimen Quick View */}
        {latestActive && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Current Active Regimen (#{latestActive.prescriptionNumber})
                </h2>
                <p className="text-xs text-slate-500">
                  Prescribed by {latestActive.doctorName} • {latestActive.facilityName}
                </p>
              </div>
              <Link
                href="/prescriptions/latest"
                className="text-xs font-semibold text-primary-700 hover:underline"
              >
                View Full Details
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestActive.items.map((item) => (
                <Card key={item.id} className="border-surface-border">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {item.medicineName}
                        </h3>
                        <p className="text-xs text-primary-700 font-medium">
                          {item.genericName} ({item.strength})
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface text-slate-700 text-[10px] font-bold uppercase border border-surface-border">
                        {item.form}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Dosage:</strong> {item.frequency}
                    </p>
                    <p className="text-xs text-slate-500 italic">
                      "{item.instructions}"
                    </p>

                    <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs">
                      <Link
                        href={`/prescriptions/compare-medicines?search=${encodeURIComponent(item.genericName)}`}
                        className="text-primary-700 font-semibold hover:underline flex items-center gap-1"
                      >
                        Compare Prices
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link
                        href={`/prescriptions/report-problem?med=${encodeURIComponent(item.medicineName)}`}
                        className="text-rose-600 hover:underline text-[11px]"
                      >
                        Report Problem
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
