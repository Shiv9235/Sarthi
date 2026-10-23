"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Pill,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Edit2,
  Trash2,
  ShieldAlert,
  ShoppingBag,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent, CardFooter } from "../../../components/ui/Card";
import { Badge, StatusBadge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Alert } from "../../../components/ui/Alert";
import { StorageService } from "../../../lib/data/storage";
import { OcrAdapter, PrescriptionOcrResult } from "../../../lib/ai/ocr-adapter";
import { Prescription, PrescriptionItem } from "../../../lib/types";

export default function PrescriptionUploadPage() {
  const router = useRouter();

  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Extracted Prescription state
  const [ocrData, setOcrData] = useState<PrescriptionOcrResult | null>(null);
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [doctorName, setDoctorName] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [instructions, setInstructions] = useState("");

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMedName, setEditMedName] = useState("");
  const [editStrength, setEditStrength] = useState("");
  const [editFreq, setEditFreq] = useState("");
  const [editInstructions, setEditInstructions] = useState("");

  const [step, setStep] = useState<"upload" | "review" | "saved">("upload");
  const [savedPrescription, setSavedPrescription] = useState<Prescription | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const valid = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!valid.includes(file.type)) {
      setError("Please select a PDF document or image file (PNG, JPG).");
      return;
    }

    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
  };

  const handleProcess = async () => {
    if (!fileName) return;

    setIsProcessing(true);
    try {
      const result = await OcrAdapter.processPrescription({
        name: fileName,
        size: 1024 * 1024,
      });
      setOcrData(result);
      setItems(result.items);
      setDoctorName(result.doctorName);
      setFacilityName(result.facility);
      setIssueDate(result.date);
      setInstructions(result.instructions);
      setStep("review");
    } catch {
      setError("Failed to parse prescription text.");
    } finally {
      setIsProcessing(false);
    }
  };

  const startEdit = (item: PrescriptionItem) => {
    setEditingId(item.id);
    setEditMedName(item.medicineName);
    setEditStrength(item.strength);
    setEditFreq(item.frequency);
    setEditInstructions(item.instructions);
  };

  const saveEdit = (id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          return {
            ...i,
            medicineName: editMedName,
            strength: editStrength,
            frequency: editFreq,
            instructions: editInstructions,
            uncertain: false, // cleared once reviewed by patient
          };
        }
        return i;
      })
    );
    setEditingId(null);
  };

  const handleSavePrescription = () => {
    const newRx: Prescription = {
      id: `rx_${Date.now()}`,
      patientId: StorageService.getUser().id || "patient_001",
      prescriptionNumber: ocrData?.prescriptionNumber || `RX-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorName: doctorName || "Attending Physician",
      facilityName: facilityName || "General Clinic",
      issueDate: issueDate || new Date().toISOString().split("T")[0],
      status: "active",
      version: 1,
      items,
      instructionsNotes: instructions,
      sourceFileName: fileName,
      isDoctorIssued: false, // patient uploaded
      createdAt: new Date().toISOString(),
    };

    StorageService.savePrescription(newRx);
    setSavedPrescription(newRx);
    setStep("saved");
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/prescriptions" className="hover:text-purple-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Prescriptions
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Upload & Digitize Prescription</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Upload & Digitize Prescription
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Extract prescribed medications with mandatory clinical uncertainty flagging for handwriting verification.
          </p>
        </div>

        {/* STEP 1: Upload */}
        {step === "upload" && (
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Select Prescription Document
                </h2>
                <p className="text-xs text-slate-500">
                  Upload an image of your prescription slip or pharmacy electronic order.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && <Alert type="error">{error}</Alert>}

              <label className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-purple-50/20">
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  {fileName ? fileName : "Click to select or drop prescription image/PDF here"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {fileSize ? `File size: ${fileSize}` : "PDF, PNG or JPG • Up to 15 MB"}
                </p>
              </label>

              {/* Sample loader */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-purple-600" />
                  <span className="text-slate-700">
                    Want to test without a file? Load sample doctor prescription:
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFileName("DrMehta_Rx_Order_Oct2026.pdf");
                    setFileSize("840 KB");
                  }}
                >
                  Load Sample Prescription
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link href="/prescriptions">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                variant="primary"
                onClick={handleProcess}
                disabled={!fileName}
                isLoading={isProcessing}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start OCR Extraction
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 2: Review OCR with Uncertainty Tags */}
        {step === "review" && (
          <div className="space-y-6">
            <Alert type="warning">
              <strong className="block mb-0.5">Clinical Safety Protocol:</strong>
              Optical Character Recognition cannot guarantee 100% accuracy on handwritten clinical orders. Items with lower confidence are highlighted with an <span className="text-amber-800 font-bold">Uncertainty Flag</span>. Verify medicine name and strength before saving.
            </Alert>

            {/* Prescription Header Info */}
            <Card>
              <CardHeader className="py-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Prescription Metadata
                </h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Prescribing Doctor"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                  <Input
                    label="Clinic / Facility"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                  />
                  <Input
                    label="Issue Date"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Extracted Medicines List */}
            <Card>
              <CardHeader className="py-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Extracted Medications ({items.length})
                </h2>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                      <th className="py-3 px-4">Medicine Name</th>
                      <th className="py-3 px-4">Strength</th>
                      <th className="py-3 px-4">Frequency & Timing</th>
                      <th className="py-3 px-4">Instructions</th>
                      <th className="py-3 px-4">OCR Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item) => {
                      const isEditing = editingId === item.id;

                      if (isEditing) {
                        return (
                          <tr key={item.id} className="bg-purple-50/50">
                            <td className="py-3 px-4">
                              <input
                                className="w-full px-2 py-1 rounded border border-purple-500 text-xs font-bold"
                                value={editMedName}
                                onChange={(e) => setEditMedName(e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                className="w-20 px-2 py-1 rounded border border-purple-500 text-xs"
                                value={editStrength}
                                onChange={(e) => setEditStrength(e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                className="w-32 px-2 py-1 rounded border border-purple-500 text-xs"
                                value={editFreq}
                                onChange={(e) => setEditFreq(e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                className="w-full px-2 py-1 rounded border border-purple-500 text-xs"
                                value={editInstructions}
                                onChange={(e) => setEditInstructions(e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-purple-700 font-bold">Reviewing</span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1">
                              <button
                                onClick={() => saveEdit(item.id)}
                                className="px-2 py-1 bg-purple-700 text-white rounded text-xs font-bold"
                              >
                                Save
                              </button>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            item.uncertain ? "bg-amber-50/40" : ""
                          }`}
                        >
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {item.medicineName}
                            <span className="block text-[10px] text-slate-500 font-normal">
                              Generic: {item.genericName}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {item.strength}
                          </td>
                          <td className="py-3 px-4 text-slate-700">{item.frequency}</td>
                          <td className="py-3 px-4 text-slate-500 italic max-w-xs truncate">
                            {item.instructions}
                          </td>
                          <td className="py-3 px-4">
                            {item.uncertain ? (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1 w-fit">
                                <AlertTriangle className="w-3 h-3 text-amber-700" />
                                Unclear Handwriting
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                Verified ({item.ocrConfidence}%)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => startEdit(item)}
                              className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 ml-auto"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  Re-upload Document
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSavePrescription}
                  rightIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Confirm & Save Prescription
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* STEP 3: Saved & Direct Links */}
        {step === "saved" && savedPrescription && (
          <Card className="text-center p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                Prescription Successfully Saved
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-3">
                Prescription #{savedPrescription.prescriptionNumber} Active
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                Your medications have been recorded. You can now compare prices across pharmacies or inspect your full regimen.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/prescriptions/compare-medicines">
                <Button variant="primary" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                  Compare Medicine Prices
                </Button>
              </Link>
              <Link href="/prescriptions/latest">
                <Button variant="outline">View in Prescription List</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
