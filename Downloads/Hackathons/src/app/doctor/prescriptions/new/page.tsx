"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pill,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Info,
} from "lucide-react";
import { DoctorAppShell } from "../../../../components/layout/DoctorAppShell";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Alert } from "../../../../components/ui/Alert";
import { useAuth } from "../../../../lib/context/AuthContext";
import { StorageService } from "../../../../lib/data/storage";
import { Prescription, PrescriptionItem } from "../../../../lib/types";

interface FormMedicineItem {
  id: string;
  medicineName: string;
  genericName: string;
  strength: string;
  form: "tablet" | "capsule" | "syrup" | "injection" | "inhaler" | "drops";
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function NewPrescriptionPage() {
  return (
    <Suspense
      fallback={
        <DoctorAppShell>
          <div className="p-8 text-center text-xs text-slate-500">Loading prescription form...</div>
        </DoctorAppShell>
      }
    >
      <NewPrescriptionContent />
    </Suspense>
  );
}

function NewPrescriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { doctorProfile } = useAuth();

  const [patientName, setPatientName] = useState("Sunita Sharma");
  const [patientId, setPatientId] = useState(searchParams.get("patientId") || "patient_001");
  const [instructionsNotes, setInstructionsNotes] = useState(
    "Take Glycomet after breakfast and dinner. Take Telma consistently every morning with water. Maintain adequate hydration."
  );

  const [items, setItems] = useState<FormMedicineItem[]>([
    {
      id: "item_1",
      medicineName: "Glycomet 500 Tablet",
      genericName: "Metformin Hydrochloride",
      strength: "500 mg",
      form: "tablet",
      dosage: "1 tablet (500mg)",
      frequency: "Twice daily after meals",
      duration: "90 days",
      instructions: "Take with or immediately after meals.",
    },
    {
      id: "item_2",
      medicineName: "Telma 40 Tablet",
      genericName: "Telmisartan",
      strength: "40 mg",
      form: "tablet",
      dosage: "1 tablet (40mg)",
      frequency: "Once daily in morning",
      duration: "90 days",
      instructions: "Take regularly at 9:00 AM every day.",
    },
  ]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Real-time Drug Allergy Warning Logic
  const checkAllergyContraindication = (name: string, generic: string) => {
    const text = (name + " " + generic).toLowerCase();
    const penicillinMatch =
      text.includes("penicillin") ||
      text.includes("amoxicillin") ||
      text.includes("augmentin") ||
      text.includes("ampicillin") ||
      text.includes("cloxacillin");
    const sulfaMatch =
      text.includes("sulfa") ||
      text.includes("cotrimoxazole") ||
      text.includes("bactrim") ||
      text.includes("septra") ||
      text.includes("sulfamethoxazole");

    if (penicillinMatch) return "Penicillin Allergy Alert: Patient has documented severe allergy (facial swelling / hives).";
    if (sulfaMatch) return "Sulfa Allergy Alert: Patient has documented moderate reaction to sulfa medications.";
    return null;
  };

  const detectedAllergies = items
    .map((item) => checkAllergyContraindication(item.medicineName, item.genericName))
    .filter(Boolean);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}`,
        medicineName: "",
        genericName: "",
        strength: "",
        form: "tablet",
        dosage: "1 tablet",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with water after food.",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof FormMedicineItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleQuickAdd = (brand: string, generic: string, strength: string, freq: string, inst: string) => {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}`,
        medicineName: brand,
        genericName: generic,
        strength,
        form: "tablet",
        dosage: `1 tablet (${strength})`,
        frequency: freq,
        duration: "90 days",
        instructions: inst,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.some((i) => !i.medicineName || !i.dosage)) {
      setError("Please ensure every medicine item has a name and dosage specified.");
      return;
    }

    if (detectedAllergies.length > 0) {
      if (
        !confirm(
          "WARNING: One or more prescribed medications trigger a known drug allergy flag for this patient. Are you sure you wish to proceed?"
        )
      ) {
        return;
      }
    }

    setIsLoading(true);
    const newRxNumber = `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPrescription: Prescription = {
      id: `rx_${Date.now()}`,
      patientId,
      prescriptionNumber: newRxNumber,
      doctorName: doctorProfile?.name || "Dr. Arvind Mehta, MD",
      facilityName: doctorProfile?.hospitalName || "Max Super Speciality Hospital",
      issueDate: new Date().toLocaleDateString("en-IN"),
      status: "active",
      version: 1,
      items: items.map((i) => ({
        id: i.id,
        medicineName: i.medicineName,
        genericName: i.genericName || i.medicineName,
        strength: i.strength || "Standard",
        form: i.form,
        dosage: i.dosage,
        frequency: i.frequency,
        duration: i.duration,
        instructions: i.instructions,
        ocrConfidence: 100,
        uncertain: false,
      })),
      instructionsNotes,
      isDoctorIssued: true,
      createdAt: new Date().toISOString(),
    };

    StorageService.issueDoctorPrescription(newPrescription);
    setIsLoading(false);
    router.push(`/doctor/prescriptions/${newPrescription.id}`);
  };

  return (
    <DoctorAppShell>
      <div className="flex items-center justify-between">
        <Link
          href="/doctor/prescriptions"
          className="text-xs font-semibold text-primary-800 hover:underline"
        >
          ← Back to Prescriptions
        </Link>
        <span className="text-xs font-semibold text-slate-500">
          Prescriber: <strong className="text-slate-800">{doctorProfile?.name || "Dr. Arvind Mehta"}</strong>
        </span>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Contraindication Alert */}
      {detectedAllergies.length > 0 && (
        <Alert type="error" className="bg-red-50 border-red-300">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs font-bold text-red-950 uppercase tracking-wider block">
                Critical Drug Contraindication Detected!
              </strong>
              {detectedAllergies.map((msg, i) => (
                <p key={i} className="text-xs text-red-900 mt-0.5">
                  • {msg}
                </p>
              ))}
            </div>
          </div>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prescription Header */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
          <h1 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary-700" />
            Issue Verified Clinical Prescription
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Patient Name *</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-surface-ground font-bold text-slate-900"
                readOnly
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hospital / Clinic</label>
              <input
                type="text"
                value={doctorProfile?.hospitalName || "Max Super Speciality Hospital"}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-surface-ground text-slate-700"
                readOnly
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Doctor Council Reg #</label>
              <input
                type="text"
                value={doctorProfile?.regNumber || "DMC/R/14290"}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-surface-ground text-slate-700 font-mono"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Medicines Section */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Prescribed Medicines & Regimen
              </h2>
              <p className="text-xs text-slate-500">
                Specify medicine brand, chemical generic, dosage strength, and frequency.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddItem}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Another Medicine
            </Button>
          </div>

          {/* Quick Add Pills */}
          <div className="p-3 bg-surface-ground rounded-xl border border-surface-border flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Quick Formulary Add:</span>
            <button
              type="button"
              onClick={() => handleQuickAdd("Atorva 10 Tablet", "Atorvastatin", "10 mg", "Once daily at bedtime", "Take after dinner")}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:border-primary-500 text-slate-800"
            >
              + Atorva 10
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd("Pantocid 40", "Pantoprazole", "40 mg", "Once daily before breakfast", "Take 30 mins before food")}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg hover:border-primary-500 text-slate-800"
            >
              + Pantocid 40
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd("Augmentin 625 Duo", "Amoxicillin + Clavulanic Acid", "625 mg", "Twice daily", "After food")}
              className="px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg hover:border-red-400 text-red-900 font-semibold"
              title="Test allergy trigger"
            >
              ⚠️ Test Augmentin (Allergy Test)
            </button>
          </div>

          {/* Medicine Items List */}
          <div className="space-y-4">
            {items.map((item, idx) => {
              const contraindication = checkAllergyContraindication(item.medicineName, item.genericName);
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border space-y-3 ${
                    contraindication ? "bg-red-50/60 border-red-300" : "bg-surface-ground border-surface-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      Medicine Item #{idx + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  {contraindication && (
                    <div className="text-xs text-red-800 font-bold bg-white p-2 rounded-lg border border-red-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      {contraindication}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Brand Name *</label>
                      <input
                        type="text"
                        value={item.medicineName}
                        onChange={(e) => handleItemChange(idx, "medicineName", e.target.value)}
                        placeholder="e.g. Glycomet 500 Tablet"
                        className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Generic / Molecule</label>
                      <input
                        type="text"
                        value={item.genericName}
                        onChange={(e) => handleItemChange(idx, "genericName", e.target.value)}
                        placeholder="e.g. Metformin HCl"
                        className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Strength</label>
                      <input
                        type="text"
                        value={item.strength}
                        onChange={(e) => handleItemChange(idx, "strength", e.target.value)}
                        placeholder="e.g. 500 mg"
                        className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Form</label>
                      <select
                        value={item.form}
                        onChange={(e) => handleItemChange(idx, "form", e.target.value as any)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500 bg-white"
                      >
                        <option value="tablet">Tablet</option>
                        <option value="capsule">Capsule</option>
                        <option value="syrup">Syrup</option>
                        <option value="injection">Injection</option>
                        <option value="inhaler">Inhaler</option>
                        <option value="drops">Drops</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Dosage & Frequency *</label>
                      <input
                        type="text"
                        value={item.frequency}
                        onChange={(e) => handleItemChange(idx, "frequency", e.target.value)}
                        placeholder="e.g. Twice daily after meals"
                        className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Duration *</label>
                      <input
                        type="text"
                        value={item.duration}
                        onChange={(e) => handleItemChange(idx, "duration", e.target.value)}
                        placeholder="e.g. 90 days"
                        className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Patient Instructions</label>
                      <input
                        type="text"
                        value={item.instructions}
                        onChange={(e) => handleItemChange(idx, "instructions", e.target.value)}
                        placeholder="e.g. Take with warm water after food"
                        className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-primary-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* General Notes */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            General Dietary & Clinical Advice
          </label>
          <textarea
            rows={3}
            value={instructionsNotes}
            onChange={(e) => setInstructionsNotes(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none"
            placeholder="Record lifestyle counsel, hydration, or warning signs..."
          />
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/doctor/prescriptions")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign & Issue Prescription
          </Button>
        </div>
      </form>
    </DoctorAppShell>
  );
}
