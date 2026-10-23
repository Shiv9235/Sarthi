"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Pill,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  FileText,
  Printer,
  ChevronRight,
  TrendingDown,
  Building,
  Layers,
  BookOpen,
} from "lucide-react";
import { AppShell } from "../../../../components/layout/AppShell";
import { Button } from "../../../../components/ui/Button";
import { Alert } from "../../../../components/ui/Alert";
import { MedicineGuideService } from "../../../../lib/services/medicine-guide-service";
import { StorageService } from "../../../../lib/data/storage";
import {
  MedicineCatalogueItem,
  MedicineComparisonGroup,
  PatientHealthProfile,
} from "../../../../lib/types";

export default function MedicineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const medicineId = params.medicineId as string;

  const [medicine, setMedicine] = useState<MedicineCatalogueItem | null>(null);
  const [comparisons, setComparisons] = useState<MedicineComparisonGroup | null>(null);
  const [healthProfile, setHealthProfile] = useState<PatientHealthProfile | null>(null);
  const [allergyCheck, setAllergyCheck] = useState<{
    hasContraindication: boolean;
    allergenMatched?: string;
    severity?: string;
    warningMessage?: string;
  }>({ hasContraindication: false });

  useEffect(() => {
    if (!medicineId) return;
    const med = MedicineGuideService.getMedicineById(medicineId);
    if (med) {
      setMedicine(med);
      const comps = MedicineGuideService.getSameSaltComparisons(med.id);
      setComparisons(comps);

      // Check allergies
      const profile = StorageService.getHealthProfile();
      setHealthProfile(profile);
      if (profile?.allergies) {
        const check = MedicineGuideService.checkPatientAllergyInteraction(med, profile.allergies);
        setAllergyCheck(check);
      }
    }
  }, [medicineId]);

  if (!medicine) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <Pill className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Medicine Not Found</h2>
          <p className="text-gray-600 mt-2 mb-6 text-sm">
            The requested medicine could not be found in the Saarthee verified catalogue.
          </p>
          <Link href="/prescriptions/medicine-guide">
            <Button variant="primary">Return to Medicine Guide</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const primaryIngredient = medicine.activeIngredients[0];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6 pb-16">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/prescriptions" className="hover:text-emerald-700">
              Prescriptions
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/prescriptions/medicine-guide" className="hover:text-emerald-700">
              Medicine Guide
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900">{medicine.brandName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm"
              title="Print medicine summary"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
              Print Guide
            </button>
            <Link href="/prescriptions/medicine-guide">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Search
              </Button>
            </Link>
          </div>
        </div>

        {/* Allergy Cross-Check Alert */}
        {allergyCheck.hasContraindication ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 sm:p-5 flex items-start gap-4 shadow-sm animate-pulse">
            <div className="p-2.5 bg-red-100 rounded-lg text-red-700 shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white text-xs uppercase tracking-wider font-extrabold px-2 py-0.5 rounded">
                  Clinical Safety Warning
                </span>
                <span className="text-xs text-red-700 font-semibold">Cross-checked against your profile</span>
              </div>
              <h3 className="text-base font-bold text-red-950 mt-1">
                Potential Allergy Risk Detected: {allergyCheck.allergenMatched}
              </h3>
              <p className="text-sm text-red-800 mt-1 leading-relaxed">
                {allergyCheck.warningMessage}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/prescriptions/report-problem?medicine=${encodeURIComponent(
                    medicine.brandName
                  )}&issueType=allergy`}
                >
                  <Button size="sm" variant="danger">
                    Notify My Doctor Immediately
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button size="sm" variant="outline">
                    View My Recorded Allergies
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Allergy Safety Checked:</strong> No contraindications found between {medicine.brandName} and your recorded allergies ({healthProfile?.allergies?.length || 0} documented in profile).
            </span>
          </div>
        )}

        {/* Main Medicine Hero Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  {medicine.dosageForm} • {medicine.releaseType.replace("_", " ")}
                </span>
                {medicine.isGeneric ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Generic Form
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    Branded Formulation
                  </span>
                )}
                {medicine.janAushadhiEquivalent && (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    Jan Aushadhi Scheme Available
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {medicine.brandName}
              </h1>

              <p className="text-base font-medium text-emerald-700">
                {medicine.genericName}
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  Mfr: <strong>{medicine.manufacturer}</strong>
                </span>
                <span>•</span>
                <span>Pack: {medicine.packSize}</span>
                <span>•</span>
                <span>Route: {medicine.route}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 sm:min-w-[240px] text-left md:text-right shrink-0">
              <span className="text-xs text-gray-500 block">Indicative Market Price (MRP)</span>
              <div className="flex items-baseline gap-2 md:justify-end mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                  ₹{medicine.approxPrice.toFixed(2)}
                </span>
                {medicine.mrp > medicine.approxPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{medicine.mrp.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-gray-500 block mt-1">
                Approx. ₹{(medicine.approxPrice / (parseInt(medicine.packSize) || 10)).toFixed(2)} / unit
              </span>
              {medicine.janAushadhiEquivalent && (
                <div className="mt-2.5 pt-2.5 border-t border-emerald-200 text-left text-xs text-teal-900 bg-teal-50/70 p-2 rounded">
                  <p className="font-semibold flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-teal-700" />
                    Jan Aushadhi Alternative:
                  </p>
                  <p className="text-[11px] text-teal-800 mt-0.5 font-medium">
                    {medicine.janAushadhiEquivalent} (typically ~₹5–₹15)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Active Ingredients breakdown list */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Active Ingredients & Salt Composition
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {medicine.activeIngredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex items-start justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{ing.name}</h4>
                    <p className="text-xs text-emerald-700 font-medium mt-0.5">
                      Salt: {ing.saltName}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Class: {ing.therapeuticClass}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gray-900 bg-white border border-gray-200 px-2.5 py-1 rounded-md shadow-sm">
                    {ing.strength}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer Notice - Mandatory per Prompt */}
        <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <h4 className="font-bold text-amber-900 mb-1">
              Important Medical & Substitution Notice
            </h4>
            <p>
              Medicines listed here may share the same active ingredient (salt), but clinical
              suitability depends on exact strength, formulation release matrix (e.g. sustained vs.
              immediate release), individual medical history, and specific prescription instructions.
              <strong>
                {" "}Do not replace, substitute, or alter any prescribed medicine without prior
                confirmation from your prescribing doctor or licensed pharmacist.
              </strong>
            </p>
          </div>
        </div>

        {/* Salt Overview & Patient Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Approved Uses */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              What is {medicine.brandName} Generally Used For?
            </h3>
            <p className="text-xs text-gray-600">
              The active ingredient ({primaryIngredient?.name}) is commonly prescribed for:
            </p>
            <ul className="space-y-2 text-xs text-gray-700">
              {medicine.generalIndications.map((ind, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Precautions & Warnings */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Important Precautions & Warnings
            </h3>
            <ul className="space-y-2 text-xs text-gray-700">
              {medicine.importantWarnings.map((warn, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{warn}</span>
                </li>
              ))}
              {medicine.pregnancyWarning && (
                <li className="flex items-start gap-2 font-medium text-amber-900 bg-amber-50 p-2 rounded">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{medicine.pregnancyWarning}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Common Side Effects */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              Common Side Effects
            </h3>
            <p className="text-xs text-gray-500">
              Most side effects are mild and transient. Report severe or persistent symptoms to your doctor:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {medicine.commonSideEffects.map((effect, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-200"
                >
                  {effect}
                </span>
              ))}
            </div>
          </div>

          {/* Contraindications */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Contraindications & When to Avoid
            </h3>
            <ul className="space-y-2 text-xs text-gray-700">
              {medicine.contraindications.map((contra, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>{contra}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SAME-SALT MEDICINE COMPARISONS SECTION */}
        <div className="space-y-6 pt-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              Same-Salt Medicine Comparisons & Alternatives
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Compare products containing {primaryIngredient?.name} ({medicine.strength}) by brand,
              manufacturer, and indicative price.
            </p>
          </div>

          {/* GROUP 1: Exact Matches (Direct Therapeutic Equivalents) */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-emerald-50/80 px-5 py-3 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Group 1: Direct Therapeutic Equivalents (Exact Matches)
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Exact same active ingredient ({primaryIngredient?.name}), identical strength ({medicine.strength}),
                  and same dosage release form ({medicine.releaseType.replace("_", " ")}).
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 shrink-0">
                {comparisons?.exactMatches.length || 0} Products Found
              </span>
            </div>

            {comparisons && comparisons.exactMatches.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {comparisons.exactMatches.map((match) => {
                  const savings = medicine.approxPrice - match.approxPrice;
                  const isCheaper = savings > 0;

                  return (
                    <div
                      key={match.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/prescriptions/medicine-guide/${match.id}`}
                            className="text-base font-bold text-gray-900 hover:text-emerald-700"
                          >
                            {match.brandName}
                          </Link>
                          {match.isGeneric && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                              Generic / Jan Aushadhi
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            ({match.strength} • {match.dosageForm})
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Mfr: <span className="font-medium text-gray-800">{match.manufacturer}</span> • Pack: {match.packSize}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-medium">
                          Salt: {match.activeIngredients.map((i) => `${i.name} ${i.strength}`).join(" + ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="text-base font-extrabold text-gray-900">
                            ₹{match.approxPrice.toFixed(2)}
                          </div>
                          {isCheaper ? (
                            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 justify-end">
                              <TrendingDown className="w-3 h-3 text-emerald-600" />
                              Save ~₹{savings.toFixed(2)} ({Math.round((savings / medicine.approxPrice) * 100)}%)
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-400">
                              MRP ₹{match.mrp.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <Link href={`/prescriptions/medicine-guide/${match.id}`}>
                          <Button size="sm" variant="outline">
                            View Salt Info
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-gray-500">
                No exact strength and formulation matches currently indexed in this catalogue for {medicine.brandName}.
              </div>
            )}
          </div>

          {/* GROUP 2: Different Strengths or Formulations */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-amber-50/70 px-5 py-3 border-b border-amber-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Group 2: Different Strength or Formulation (Not Directly Interchangeable)
                </h3>
                <p className="text-xs text-amber-900 mt-0.5">
                  Same active salt, but different release matrix (e.g. Sustained Release SR vs Immediate) or different dosage milligram.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-200 text-amber-900 shrink-0">
                {comparisons?.differentStrengths.length || 0} Products
              </span>
            </div>

            {comparisons && comparisons.differentStrengths.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {comparisons.differentStrengths.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/prescriptions/medicine-guide/${alt.id}`}
                          className="text-base font-bold text-gray-900 hover:text-emerald-700"
                        >
                          {alt.brandName}
                        </Link>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {alt.strength} • {alt.releaseType.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Mfr: {alt.manufacturer} • Pack: {alt.packSize}
                      </p>
                      <p className="text-[11px] text-amber-800 font-medium">
                        Notice: Requires doctor re-calculation. Do not take this strength without prescription.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">
                          ₹{alt.approxPrice.toFixed(2)}
                        </div>
                        <span className="text-[11px] text-gray-400">MRP ₹{alt.mrp.toFixed(2)}</span>
                      </div>
                      <Link href={`/prescriptions/medicine-guide/${alt.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-gray-500">
                No different strength formulations indexed for this compound.
              </div>
            )}
          </div>

          {/* GROUP 3: Similar Therapeutic Class (Educational Context Only) */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-blue-50/70 px-5 py-3 border-b border-blue-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Group 3: Similar Therapeutic Class (Educational Context Only)
                </h3>
                <p className="text-xs text-blue-800 mt-0.5">
                  Shares the same therapeutic class ({primaryIngredient?.therapeuticClass}) but uses a{" "}
                  <strong>completely different active chemical salt</strong>. Strictly requires doctor prescription change.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-200 text-blue-900 shrink-0">
                {comparisons?.similarTherapeuticClass.length || 0} Products
              </span>
            </div>

            {comparisons && comparisons.similarTherapeuticClass.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {comparisons.similarTherapeuticClass.map((sim) => (
                  <div
                    key={sim.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/prescriptions/medicine-guide/${sim.id}`}
                          className="text-base font-bold text-gray-900 hover:text-emerald-700"
                        >
                          {sim.brandName}
                        </Link>
                        <span className="text-xs text-gray-500">({sim.strength})</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Active Salt:{" "}
                        <span className="font-semibold text-gray-800">
                          {sim.activeIngredients.map((i) => i.name).join(" + ")}
                        </span>
                      </p>
                      <p className="text-[11px] text-blue-700">
                        Class: {sim.activeIngredients[0]?.therapeuticClass}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">
                          ₹{sim.approxPrice.toFixed(2)}
                        </div>
                      </div>
                      <Link href={`/prescriptions/medicine-guide/${sim.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-gray-500">
                No related therapeutic class products currently shown.
              </div>
            )}
          </div>
        </div>

        {/* References & Authority Sources */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-5 text-xs text-gray-600 space-y-2">
          <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-gray-500" />
            Verified Regulatory & Pharmacopoeial Sources
          </h4>
          <p className="text-[11px] text-gray-500">
            Medicine data, indications, and active ingredient classifications are verified against Indian
            statutory references:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {medicine.sources.map((src, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-gray-200 text-gray-700 text-[11px] font-medium"
              >
                <span>{src.sourceName}</span>
                <span className="text-gray-400">({src.citation})</span>
              </span>
            ))}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-gray-200 text-gray-700 text-[11px]">
              Last verified: {medicine.lastVerified}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <Link href="/prescriptions/medicine-guide">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Medicine Search
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/prescriptions/report-problem?medicine=${encodeURIComponent(
                medicine.brandName
              )}`}
            >
              <Button variant="outline">
                Report Issue / Ask Doctor
              </Button>
            </Link>
            <Link href="/appointments">
              <Button variant="primary">
                Book Consultation with Doctor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
