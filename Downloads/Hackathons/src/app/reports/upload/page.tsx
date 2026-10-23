"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Edit2,
  Trash2,
  Save,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent, CardFooter } from "../../../components/ui/Card";
import { Badge, StatusBadge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Alert } from "../../../components/ui/Alert";
import { StorageService } from "../../../lib/data/storage";
import { OcrAdapter, OcrExtractionResult } from "../../../lib/ai/ocr-adapter";
import { generateReportExplanation } from "../../../lib/ai/report-explainer";
import { MedicalReport, ReportMeasurement } from "../../../lib/types";

export default function ReportUploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Extracted data state
  const [extractionResult, setExtractionResult] = useState<OcrExtractionResult | null>(null);
  const [measurements, setMeasurements] = useState<ReportMeasurement[]>([]);
  const [reportTitle, setReportTitle] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [reportDate, setReportDate] = useState("");

  // Correction state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValueText, setEditValueText] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editRefText, setEditRefText] = useState("");

  const [step, setStep] = useState<"upload" | "review" | "explanation">("upload");
  const [isSaving, setIsSaving] = useState(false);

  // File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate type (PDF or Image)
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(selected.type)) {
      setUploadError("Unsupported file type. Please upload a PDF or image (PNG, JPG).");
      return;
    }

    // Validate size (max 15MB)
    if (selected.size > 15 * 1024 * 1024) {
      setUploadError("File size exceeds 15 MB limit.");
      return;
    }

    setFile(selected);
    setFileName(selected.name);
    setFileSize(`${(selected.size / (1024 * 1024)).toFixed(1)} MB`);
  };

  const handleProcessDocument = async () => {
    if (!file && !fileName) return;

    setIsProcessing(true);
    try {
      const result = await OcrAdapter.processMedicalReport(
        file || { name: fileName || "Laboratory_Panel_Report.pdf", size: 1024 * 1024 }
      );
      setExtractionResult(result);
      setMeasurements(result.measurements);
      setReportTitle(result.title);
      setFacilityName(result.facility);
      setReportDate(result.date);
      setStep("review");
    } catch {
      setUploadError("Failed to extract medical data. Please verify document readability.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Measurement Editing / Correction
  const startEdit = (m: ReportMeasurement) => {
    setEditingId(m.id);
    setEditValueText(m.valueText);
    setEditUnit(m.unit);
    setEditRefText(m.referenceText);
  };

  const saveEdit = (id: string) => {
    setMeasurements((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const num = parseFloat(editValueText);
          const isNumeric = !isNaN(num);
          const isAbnormal =
            isNumeric && m.referenceRangeHigh !== undefined
              ? num > m.referenceRangeHigh || (m.referenceRangeLow !== undefined && num < m.referenceRangeLow)
              : m.isAbnormal;

          return {
            ...m,
            valueText: editValueText,
            valueNumeric: isNumeric ? num : m.valueNumeric,
            unit: editUnit,
            referenceText: editRefText,
            isAbnormal,
            flag: isAbnormal ? "HIGH" : "NORMAL",
            patientCorrected: true,
          };
        }
        return m;
      })
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // Save report to patient storage
  const handleSaveFinalReport = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    const explanation = generateReportExplanation(measurements);

    const newReport: MedicalReport = {
      id: `rep_${Date.now()}`,
      patientId: StorageService.getUser().id || "patient_001",
      title: reportTitle || "Clinical Laboratory Report",
      reportDate: reportDate || new Date().toISOString().split("T")[0],
      reportType: "lipid_panel",
      facilityName: facilityName || "Diagnostic Imaging & Labs",
      status: "reviewed_by_patient",
      isDoctorShared: false,
      aiGeneratedSummary: explanation.aiSummary,
      plainLanguageExplanation: explanation.plainLanguageExplanation,
      suggestedDoctorQuestions: explanation.doctorQuestions,
      measurements,
      sourceFileName: fileName || "Uploaded_Report.pdf",
      fileSize: fileSize || "1.2 MB",
      createdAt: new Date().toISOString(),
    };

    StorageService.saveReport(newReport);
    setIsSaving(false);
    router.push(`/reports/${newReport.id}`);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/reports" className="hover:text-emerald-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Reports
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Upload & Digitize Report</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Upload & Digitize Medical Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Extract tabular lab values from PDF or scanned documents. You retain full control to inspect, correct, and verify all numbers before saving.
          </p>
        </div>

        {/* Multi-step Flow */}

        {/* STEP 1: Upload Document */}
        {step === "upload" && (
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Select Document to Extract
                </h2>
                <p className="text-xs text-slate-500">
                  Accepted formats: Digital PDF, scanned document, JPEG, PNG (up to 15MB)
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {uploadError && <Alert type="error">{uploadError}</Alert>}

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20">
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  {fileName ? fileName : "Click to browse or drop medical report file here"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {fileSize ? `File size: ${fileSize}` : "PDF, PNG or JPG • Up to 15 MB"}
                </p>
              </label>

              {/* Demo Sample Quick Load */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700">
                    Want to test without a file? Use sample metabolic lab panel:
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFileName("Metropolis_Comprehensive_Panel.pdf");
                    setFileSize("1.4 MB");
                  }}
                >
                  Load Sample Document
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link href="/reports">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                variant="primary"
                onClick={handleProcessDocument}
                disabled={!fileName}
                isLoading={isProcessing}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Start Extraction & Review
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 2: Review & Correct Extracted Numerical Values */}
        {step === "review" && (
          <div className="space-y-6">
            <Alert type="info">
              <strong>Human-in-the-Loop Review:</strong> AI OCR has extracted the parameters below. Clinical guidelines require patients or clinicians to verify numerical values and units before generating plain-language explanations. Click "Edit" if any OCR error occurred.
            </Alert>

            {/* Metadata inputs */}
            <Card>
              <CardHeader className="py-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Report Information
                </h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Report Title"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                  <Input
                    label="Laboratory / Clinic Facility"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                  />
                  <Input
                    label="Collection Date"
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Extracted Values Table */}
            <Card>
              <CardHeader className="py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Extracted Test Measurements ({measurements.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Inspect values against the stated laboratory reference intervals.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                      <th className="py-3 px-4">Test Name</th>
                      <th className="py-3 px-4">Measured Value</th>
                      <th className="py-3 px-4">Unit</th>
                      <th className="py-3 px-4">Stated Reference Range</th>
                      <th className="py-3 px-4">Flag</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {measurements.map((m) => {
                      const isEditing = editingId === m.id;

                      if (isEditing) {
                        return (
                          <tr key={m.id} className="bg-teal-50/50">
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {m.testName}
                            </td>
                            <td className="py-3 px-4">
                              <input
                                className="w-24 px-2 py-1 rounded border border-teal-500 text-xs font-bold"
                                value={editValueText}
                                onChange={(e) => setEditValueText(e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                className="w-20 px-2 py-1 rounded border border-teal-500 text-xs"
                                value={editUnit}
                                onChange={(e) => setEditUnit(e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                className="w-36 px-2 py-1 rounded border border-teal-500 text-xs"
                                value={editRefText}
                                onChange={(e) => setEditRefText(e.target.value)}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-slate-400">Recalculating</span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1">
                              <button
                                onClick={() => saveEdit(m.id)}
                                className="px-2 py-1 bg-teal-700 text-white rounded text-xs font-bold hover:bg-teal-800"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={m.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            m.isAbnormal ? "bg-amber-50/30" : ""
                          }`}
                        >
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {m.testName}
                            {m.patientCorrected && (
                              <span className="ml-2 text-[10px] text-teal-700 font-semibold">
                                (Corrected)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-800 text-sm">
                            {m.valueText}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">{m.unit}</td>
                          <td className="py-3 px-4 text-slate-500">{m.referenceText}</td>
                          <td className="py-3 px-4">
                            {m.isAbnormal ? (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                                {m.flag || "HIGH"}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                                Normal
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => startEdit(m)}
                              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 ml-auto"
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
                  Change File
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setStep("explanation")}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Generate Plain-Language Explanation
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* STEP 3: Plain-Language Explanation & Physician Discussion Guide */}
        {step === "explanation" && (
          <div className="space-y-6">
            {/* Plain summary card */}
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Plain-Language Clinical Explanation
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 font-medium">
                  {generateReportExplanation(measurements).aiSummary}
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Breakdown of Parameters
                  </h3>
                  <div className="space-y-2">
                    {measurements.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-lg border text-xs ${
                          m.isAbnormal
                            ? "border-amber-200 bg-amber-50/40 text-amber-950"
                            : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span>
                            {m.testName}: {m.valueText} {m.unit}
                          </span>
                          <span className="text-[10px] uppercase font-semibold">
                            {m.isAbnormal ? "Outside reference" : "Within reference"}
                          </span>
                        </div>
                        <p className="text-slate-600">{m.plainExplanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Questions for Doctor */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    <span>Recommended Questions to Discuss with Your Doctor</span>
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                    {generateReportExplanation(measurements).doctorQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep("review")}>
                  Back to Review Values
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveFinalReport}
                  isLoading={isSaving}
                  rightIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Save Verified Report to My Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
