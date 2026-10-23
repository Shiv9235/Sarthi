"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Pill,
  Printer,
  Share2,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Hospital,
  ArrowRight,
  User,
} from "lucide-react";
import { DoctorAppShell } from "../../../../components/layout/DoctorAppShell";
import { Button } from "../../../../components/ui/Button";
import { StorageService } from "../../../../lib/data/storage";
import { Prescription } from "../../../../lib/types";

export default function DoctorPrescriptionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const prescriptionId = params.prescriptionId as string;

  const [prescription, setPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    const rx = StorageService.getPrescriptionById(prescriptionId) || StorageService.getPrescriptions()[0];
    setPrescription(rx);
  }, [prescriptionId]);

  if (!prescription) {
    return (
      <DoctorAppShell>
        <div className="p-8 text-center bg-white rounded-2xl border border-surface-border">
          <p className="text-sm text-slate-500">Prescription record not found.</p>
          <Button className="mt-4" onClick={() => router.push("/doctor/prescriptions")}>
            Return to Prescriptions
          </Button>
        </div>
      </DoctorAppShell>
    );
  }

  return (
    <DoctorAppShell>
      <div className="flex items-center justify-between">
        <Link
          href="/doctor/prescriptions"
          className="text-xs font-semibold text-primary-800 hover:underline"
        >
          ← Back to Prescriptions
        </Link>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Print Prescription
          </Button>
        </div>
      </div>

      {/* Official Prescription Paper Layout */}
      <div className="bg-white rounded-2xl border border-surface-border p-8 shadow-xs max-w-4xl mx-auto space-y-6">
        {/* Hospital & Doctor Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-primary-800/80">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{prescription.facilityName}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Press Enclave Road, Saket, New Delhi - 110017</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Phone: +91 11 2651 5050 • NABH Accredited</p>
          </div>
          <div className="text-left sm:text-right">
            <h2 className="text-base font-bold text-primary-900">{prescription.doctorName}</h2>
            <p className="text-xs text-slate-600">MD (Medicine) AIIMS • Consultant Physician</p>
            <p className="text-xs font-semibold text-primary-800 mt-0.5">Reg #DMC/R/14290 (Delhi Medical Council)</p>
          </div>
        </div>

        {/* Patient Demographics & Prescription Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-ground border border-surface-border text-xs">
          <div>
            <span className="text-slate-500 block">Patient Name:</span>
            <strong className="text-slate-900 text-sm">Sunita Sharma</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Age / Sex:</span>
            <strong className="text-slate-900">44 Years / Female</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Date of Issue:</span>
            <strong className="text-slate-900">{prescription.issueDate}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Prescription No:</span>
            <strong className="text-slate-900 font-mono">{prescription.prescriptionNumber}</strong>
          </div>
        </div>

        {/* Allergy Alert Note */}
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-center justify-between">
          <span>
            <strong>Patient Drug Allergy Flag:</strong> Penicillin (Severe) • Sulfa Drugs
          </span>
          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
            Contraindications Verified
          </span>
        </div>

        {/* Medicines List Table */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary-800 font-serif">Rx</span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Prescribed Medications
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-surface-border rounded-xl overflow-hidden">
              <thead className="bg-surface-ground text-slate-600 border-b border-surface-border">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Medicine & Generic Form</th>
                  <th className="p-3">Dosage</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {prescription.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="p-3 text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="p-3">
                      <strong className="text-slate-900 block">{item.medicineName}</strong>
                      <span className="text-[11px] text-slate-500">{item.genericName} ({item.strength})</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{item.dosage}</td>
                    <td className="p-3 text-slate-700">{item.frequency}</td>
                    <td className="p-3 text-slate-700">{item.duration}</td>
                    <td className="p-3 text-slate-600">{item.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        {prescription.instructionsNotes && (
          <div className="p-4 rounded-xl bg-surface-ground border border-surface-border text-xs">
            <strong className="block text-slate-800 font-semibold mb-1">Dietary & Lifestyle Advice:</strong>
            <p className="text-slate-600 leading-relaxed">{prescription.instructionsNotes}</p>
          </div>
        )}

        {/* Electronic Signature & Footer */}
        <div className="pt-6 border-t border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-[11px] text-slate-400">
            <p>Generated electronically through SARTHI Clinical Platform.</p>
            <p>Cryptographically logged: {prescription.createdAt}</p>
          </div>

          <div className="text-left sm:text-right">
            <div className="inline-block border-b border-slate-300 pb-1 mb-1">
              <span className="font-serif italic text-primary-800 text-sm font-bold">
                {prescription.doctorName}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-800">Electronically Signed</p>
            <p className="text-[10px] text-slate-500">Reg #DMC/R/14290</p>
          </div>
        </div>
      </div>
    </DoctorAppShell>
  );
}
