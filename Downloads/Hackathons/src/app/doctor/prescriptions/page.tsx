"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pill,
  PlusCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
} from "lucide-react";
import { DoctorAppShell } from "../../../components/layout/DoctorAppShell";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../lib/context/AuthContext";
import { StorageService } from "../../../lib/data/storage";
import { Prescription } from "../../../lib/types";

export default function DoctorPrescriptionsPage() {
  const router = useRouter();
  const { doctorProfile } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const list = StorageService.getPrescriptions();
    setPrescriptions(list);
  }, []);

  const filtered = prescriptions.filter(
    (p) =>
      p.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.items.some((i) => i.medicineName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DoctorAppShell>
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-primary-700" />
            Prescriptions Issued
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, view, and update verified e-prescriptions. Issued prescriptions immediately sync to the patient's SARTHI portal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/doctor/prescriptions/new")}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Issue New Prescription
          </Button>
        </div>
      </div>

      {/* Prescription List */}
      <div className="space-y-4">
        {filtered.map((rx) => (
          <div
            key={rx.id}
            className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs hover:border-primary-300 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Prescription #{rx.prescriptionNumber}
                  </h2>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      rx.status === "active"
                        ? "bg-primary-100 text-primary-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {rx.status.toUpperCase()} (v{rx.version})
                  </span>
                  <span className="text-xs text-slate-500">
                    Issued: <strong>{rx.issueDate}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1">
                  Prescriber: <strong>{rx.doctorName}</strong> • {rx.facilityName}
                </p>

                {/* Medicines List summary */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {rx.items.map((item) => (
                    <span
                      key={item.id}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-ground border border-surface-border text-slate-800 flex items-center gap-1.5"
                    >
                      <Pill className="w-3 h-3 text-primary-700" />
                      {item.medicineName} ({item.dosage})
                    </span>
                  ))}
                </div>

                {rx.instructionsNotes && (
                  <p className="text-[11px] text-slate-500 mt-2 italic">
                    Notes: {rx.instructionsNotes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/doctor/prescriptions/${rx.id}`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DoctorAppShell>
  );
}
