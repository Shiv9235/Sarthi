"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Pill,
  FileText,
  Clock,
  ShieldCheck,
  History,
  ArrowLeft,
  AlertTriangle,
  ShoppingBag,
  Download,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Badge, StatusBadge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { StorageService } from "../../../lib/data/storage";
import { Prescription } from "../../../lib/types";

export default function LatestPrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedRxId, setSelectedRxId] = useState<string>("");

  useEffect(() => {
    const list = StorageService.getPrescriptions();
    setPrescriptions(list);
    const active = list.find((p) => p.status === "active") || list[0];
    if (active) setSelectedRxId(active.id);
  }, []);

  const currentRx = prescriptions.find((p) => p.id === selectedRxId) || prescriptions[0];
  const olderPrescriptions = prescriptions.filter((p) => p.id !== selectedRxId);

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/prescriptions" className="hover:text-purple-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Prescriptions
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Latest Doctor's Prescription</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Doctor's Prescription
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Review current medications, clinician dosing notes, and historical superseded versions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/prescriptions/compare-medicines">
              <Button variant="outline" size="sm" leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}>
                Compare Pharmacy Prices
              </Button>
            </Link>
          </div>
        </div>

        {currentRx ? (
          <div className="space-y-6">
            {/* Primary Prescription Card */}
            <Card className="border-purple-200 shadow-xs">
              <CardHeader className="py-4 bg-purple-50/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-slate-900">
                        Prescription #{currentRx.prescriptionNumber}
                      </h2>
                      <StatusBadge status={currentRx.status} />
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                        Version {currentRx.version}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Prescribed by {currentRx.doctorName} • {currentRx.facilityName}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500 block">Issue Date</span>
                    <span className="text-xs font-bold text-slate-900">
                      {currentRx.issueDate}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Doctor's General Instructions */}
                {currentRx.instructionsNotes && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <strong className="text-slate-900 block font-bold uppercase tracking-wider">
                      Physician's Instructions & Notes:
                    </strong>
                    <p className="text-slate-700 leading-relaxed italic">
                      "{currentRx.instructionsNotes}"
                    </p>
                  </div>
                )}

                {/* Medication Items List */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Prescribed Medications ({currentRx.items.length})
                  </h3>
                  <div className="space-y-3">
                    {currentRx.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-sm font-bold text-slate-900 mr-2">
                              {item.medicineName}
                            </span>
                            <span className="text-teal-700 font-semibold">
                              ({item.genericName})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                              {item.form}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-bold text-[10px]">
                              {item.strength}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 pt-2 border-t border-slate-100">
                          <div>
                            <span className="text-slate-400">Dosage: </span>
                            <strong>{item.dosage}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400">Schedule: </span>
                            <strong>{item.frequency}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400">Course Duration: </span>
                            <strong>{item.duration}</strong>
                          </div>
                        </div>

                        {item.instructions && (
                          <p className="text-slate-500 italic pt-1">
                            Note: {item.instructions}
                          </p>
                        )}

                        <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-purple-700">
                          <Link
                            href={`/prescriptions/compare-medicines?search=${encodeURIComponent(item.genericName)}`}
                            className="hover:underline flex items-center gap-1"
                          >
                            <span>Compare Pharmacy Prices for {item.genericName}</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                          <Link
                            href={`/prescriptions/report-problem?med=${encodeURIComponent(item.medicineName)}`}
                            className="text-rose-600 hover:underline"
                          >
                            Report Side Effect
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Metadata & Document Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Source File: {currentRx.sourceFileName || "Digital_Prescription_Order.pdf"}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => alert(`Simulating download of ${currentRx.sourceFileName || "prescription.pdf"}`)}
                  >
                    Download Original PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Historical Superseded Versions */}
            {olderPrescriptions.length > 0 && (
              <Card>
                <CardHeader className="py-4">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-600" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Prescription Version History & Superseded Records
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {olderPrescriptions.map((older) => (
                    <div
                      key={older.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            #{older.prescriptionNumber} (Version {older.version})
                          </span>
                          <StatusBadge status={older.status} size="sm" />
                        </div>
                        <p className="text-slate-500 mt-0.5">
                          Issued on {older.issueDate} by {older.doctorName} • {older.items.length} medicines
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRxId(older.id)}
                      >
                        Inspect Version {older.version}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Pill className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800">No Prescriptions Recorded</h3>
            <p className="text-xs text-slate-500">Upload your prescription or ask your doctor to share one.</p>
            <Link href="/prescriptions/upload">
              <Button variant="primary" size="sm">
                Upload Prescription
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}
