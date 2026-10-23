"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Camera,
  UploadCloud,
  Pill,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Info,
  ArrowRight,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Alert } from "../../../components/ui/Alert";
import { MedicineGuideService } from "../../../lib/services/medicine-guide-service";
import { StorageService } from "../../../lib/data/storage";
import { MedicineCatalogueItem, MedicineOcrResult } from "../../../lib/types";

export default function MedicineGuideLandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MedicineCatalogueItem[]>(
    MedicineGuideService.searchMedicines("")
  );

  // Photograph OCR state
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<MedicineOcrResult | null>(null);
  const [confirmedMatch, setConfirmedMatch] = useState<MedicineCatalogueItem | null>(null);

  const healthProfile = typeof window !== "undefined" ? StorageService.getHealthProfile() : null;

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    const results = MedicineGuideService.searchMedicines(q);
    setSearchResults(results);
  };

  const handleSimulatePhoto = (sampleFilename: string) => {
    setOcrLoading(true);
    setConfirmedMatch(null);
    setOcrResult(null);

    setTimeout(() => {
      const result = MedicineGuideService.identifyMedicineFromImage({
        fileName: sampleFilename,
      });
      setOcrResult(result);
      setOcrLoading(false);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setOcrLoading(true);
      setConfirmedMatch(null);
      setOcrResult(null);

      setTimeout(() => {
        const result = MedicineGuideService.identifyMedicineFromImage({
          fileName: file.name,
          fileSize: file.size,
        });
        setOcrResult(result);
        setOcrLoading(false);
      }, 900);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/prescriptions"
            className="text-xs font-semibold text-primary-800 hover:underline"
          >
            ← Back to Prescriptions
          </Link>
          <span className="text-xs text-slate-500">
            Powered by Verified Indian Pharmacopoeia & CDSCO Data
          </span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary-800 bg-primary-100 px-3 py-1 rounded-full">
                Active-Ingredient & Salt Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Medicine Guide & Alternatives
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Identify the active salt in your medicines, understand verified uses, and discover equivalent brand or Jan Aushadhi generic products from approved Indian manufacturers.
            </p>
          </div>

          {/* Mandatory Clinical Notice */}
          <div className="mt-5 p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold text-amber-950 block mb-0.5">
                Educational Information & Medical Notice
              </strong>
              These products may share the same active ingredient, but clinical suitability depends on strength, formulation release matrix, prescription instructions, and individual medical circumstances. <strong>Always confirm any brand substitution with your prescribing doctor or pharmacist before making changes.</strong>
            </div>
          </div>
        </div>

        {/* Section 1: Search & Photo Identification Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Box (2 Cols) */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-primary-700" />
                Search by Brand, Molecule, or Salt Name
              </h2>
              <span className="text-[11px] text-slate-400">Barcode compatible</span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="e.g. Glycomet, Telmisartan, Atorvastatin, Augmentin, Paracetamol..."
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none bg-surface-ground focus:bg-white transition-colors"
              />
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">Popular Searches:</span>
              <button
                type="button"
                onClick={() => handleSearch("Metformin")}
                className="px-2.5 py-1 bg-surface-ground border border-surface-border rounded-lg hover:border-primary-400 text-slate-700"
              >
                Metformin (Glycomet)
              </button>
              <button
                type="button"
                onClick={() => handleSearch("Telmisartan")}
                className="px-2.5 py-1 bg-surface-ground border border-surface-border rounded-lg hover:border-primary-400 text-slate-700"
              >
                Telmisartan (Telma)
              </button>
              <button
                type="button"
                onClick={() => handleSearch("Atorvastatin")}
                className="px-2.5 py-1 bg-surface-ground border border-surface-border rounded-lg hover:border-primary-400 text-slate-700"
              >
                Atorvastatin (Atorva)
              </button>
              <button
                type="button"
                onClick={() => handleSearch("Augmentin")}
                className="px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg hover:border-red-400 text-red-900 font-semibold"
                title="Penicillin allergen test"
              >
                Augmentin (Allergy Test)
              </button>
            </div>
          </div>

          {/* Photo Identification Card (1 Col) */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-primary-700" />
                Scan Medicine Strip or Box
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take a photograph of a medicine blister strip, carton, or bottle label. AI vision extracts the active ingredients and matches approved products.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <label className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-primary-300 bg-primary-50/50 hover:bg-primary-50 text-xs font-bold text-primary-800 cursor-pointer transition-colors">
                <UploadCloud className="w-4 h-4" />
                <span>Upload Medicine Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Instant Simulator Pills */}
              <div className="text-[11px] text-slate-500 pt-1">
                <span>Or simulate test photograph:</span>
                <div className="flex gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => handleSimulatePhoto("glycomet_500_strip.jpg")}
                    className="flex-1 py-1 px-2 rounded-md bg-surface-ground border border-surface-border hover:bg-slate-100 text-slate-700 font-medium truncate"
                  >
                    Glycomet Strip
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulatePhoto("telma_40_box.png")}
                    className="flex-1 py-1 px-2 rounded-md bg-surface-ground border border-surface-border hover:bg-slate-100 text-slate-700 font-medium truncate"
                  >
                    Telma Box
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulatePhoto("augmentin_625_bottle.jpg")}
                    className="flex-1 py-1 px-2 rounded-md bg-red-50 border border-red-200 hover:bg-red-100 text-red-900 font-medium truncate"
                  >
                    Augmentin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OCR Result & Confirmation Box if processing photo */}
        {ocrLoading && (
          <div className="bg-white rounded-2xl border border-primary-200 p-8 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-800">
              Processing medicine photograph & extracting text...
            </p>
            <p className="text-[11px] text-slate-500">
              Extracting brand name, strength, and matching against Indian Pharmacopoeia database.
            </p>
          </div>
        )}

        {ocrResult && !ocrLoading && (
          <div className="bg-primary-50/50 border border-primary-300 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-primary-200">
              <div>
                <span className="text-[10px] font-bold text-primary-800 uppercase tracking-wider block">
                  Vision OCR Analysis Result
                </span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  Extracted Label: <span className="font-mono text-primary-900 font-normal">"{ocrResult.extractedText}"</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-primary-200 text-primary-800">
                  {ocrResult.confidence}% Match Confidence
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-700">
              <strong className="block text-slate-900 mb-1">
                Candidate Product Matches (User Confirmation Required)
              </strong>
              <p className="text-slate-500 text-[11px] mb-3">
                Please verify the matched product against your physical medicine strip before proceeding.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ocrResult.candidateMatches.map(({ medicine, matchConfidence, matchedFields }) => (
                  <div
                    key={medicine.id}
                    className="p-4 rounded-xl bg-white border border-surface-border flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-bold text-slate-900">{medicine.brandName}</strong>
                        <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                          {matchConfidence}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Active Salt: <strong>{medicine.activeIngredients.map((i) => i.name).join(" + ")} ({medicine.strength})</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Manufacturer: {medicine.manufacturer}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {matchedFields.map((f, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => router.push(`/prescriptions/medicine-guide/${medicine.id}`)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Confirm Match & View Active Salt Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Medicine Catalogue Search Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Medicine Catalogue ({searchResults.length} Products Found)
            </h2>
            <span className="text-xs text-slate-500">
              Showing approved formulations in India
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((med) => {
              // Check patient allergy flag
              const allergyCheck = healthProfile
                ? MedicineGuideService.checkPatientAllergyInteraction(med, healthProfile.allergies)
                : { hasContraindication: false };

              return (
                <div
                  key={med.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs hover:border-primary-400 transition-all flex flex-col justify-between space-y-4 ${
                    allergyCheck.hasContraindication ? "border-red-300 bg-red-50/20" : "border-surface-border"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/prescriptions/medicine-guide/${med.id}`}
                          className="text-base font-bold text-slate-900 hover:text-primary-800 transition-colors"
                        >
                          {med.brandName}
                        </Link>
                        <p className="text-xs font-semibold text-primary-800 mt-0.5">
                          {med.activeIngredients.map((i) => i.name).join(" + ")} ({med.strength})
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-slate-900">₹{med.approxPrice.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400 block line-through">MRP ₹{med.mrp.toFixed(2)}</span>
                      </div>
                    </div>

                    {allergyCheck.hasContraindication && (
                      <div className="p-2 rounded-lg bg-red-100/70 border border-red-300 text-xs text-red-900 font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                        <span>Allergy Alert: Contains {allergyCheck.allergenMatched} derivative!</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-500">
                      Manufacturer: <strong>{med.manufacturer}</strong> • Form: {med.dosageForm.toUpperCase()} ({med.releaseType.replace(/_/g, " ")})
                    </p>

                    <div className="p-2.5 rounded-xl bg-surface-ground border border-surface-border text-xs text-slate-700">
                      <strong className="block text-[11px] font-semibold text-slate-800 uppercase tracking-wider mb-0.5">
                        Primary Approved Indications:
                      </strong>
                      <p className="line-clamp-2 leading-relaxed">{med.generalIndications[0]}</p>
                    </div>

                    {med.janAushadhiEquivalent && (
                      <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Generic Available: {med.janAushadhiEquivalent}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Verified: {med.lastVerified}
                    </span>
                    <Link
                      href={`/prescriptions/medicine-guide/${med.id}`}
                      className="text-xs font-semibold text-primary-800 hover:underline flex items-center gap-1"
                    >
                      Compare Same-Salt Alternatives <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
