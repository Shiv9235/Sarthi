"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  ShieldCheck,
  AlertCircle,
  FileText,
  Pill,
  ArrowRight,
  Filter,
  CheckCircle2,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import { DoctorAppShell } from "../../../components/layout/DoctorAppShell";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";
import { useAuth } from "../../../lib/context/AuthContext";
import { StorageService } from "../../../lib/data/storage";
import { DoctorPatientRelationship } from "../../../lib/types";

export default function DoctorPatientsPage() {
  return (
    <Suspense
      fallback={
        <DoctorAppShell>
          <div className="p-8 text-center text-xs text-slate-500">Loading authorized patients...</div>
        </DoctorAppShell>
      }
    >
      <DoctorPatientsContent />
    </Suspense>
  );
}

function DoctorPatientsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const { doctorProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [relationships, setRelationships] = useState<DoctorPatientRelationship[]>([]);

  const doctorId = doctorProfile?.id || "doc_1";

  useEffect(() => {
    const list = StorageService.getAuthorizedPatients(doctorId);
    setRelationships(list);
  }, [doctorId]);

  const filteredPatients = relationships.filter((rel) => {
    const term = searchTerm.toLowerCase();
    return (
      rel.patientName.toLowerCase().includes(term) ||
      (rel.patientPhone && rel.patientPhone.includes(term)) ||
      (rel.patientSummary && rel.patientSummary.toLowerCase().includes(term))
    );
  });

  return (
    <DoctorAppShell>
      {/* Header */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-700" />
              Authorized Clinical Access Only
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Authorized Patients
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review medical records, chronic diagnoses, prescriptions, and past lab investigations for patients who have granted clinical consent.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient name, phone..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-surface-ground border border-surface-border focus:border-primary-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Patients List */}
      <div className="space-y-4">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((rel) => (
            <div
              key={rel.id}
              className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs hover:border-primary-300 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-lg border border-primary-200 shrink-0">
                    {rel.patientName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">
                        {rel.patientName}
                      </h2>
                      <span className="text-xs text-slate-500">
                        ({rel.patientAge} years, {rel.patientSex})
                      </span>
                      <span className="text-[10px] font-semibold text-primary-800 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-primary-700" />
                        Consent: {rel.accessType.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {rel.patientSummary}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mt-2">
                      <span>Phone: <strong className="text-slate-700">{rel.patientPhone}</strong></span>
                      <span>•</span>
                      <span>Last Clinical Review: <strong className="text-slate-700">{rel.lastEncounterAt ? new Date(rel.lastEncounterAt).toLocaleDateString("en-IN") : "Never"}</strong></span>
                      <span>•</span>
                      <span className="text-red-700 font-semibold bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                        ⚠️ Severe Allergy: Penicillin
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => router.push(`/doctor/patients/${rel.patientId}`)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Complete Medical Record
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/doctor/prescriptions/new?patientId=${rel.patientId}`)}
                  >
                    Prescribe
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/doctor/investigations/new?patientId=${rel.patientId}`)}
                  >
                    Order Lab
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-surface-border p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No Authorized Patients Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm
                ? `No patient records matched "${searchTerm}".`
                : "You do not currently have authorized access to any patients. Patients must book an appointment or grant clinical consent."}
            </p>
          </div>
        )}
      </div>
    </DoctorAppShell>
  );
}
