"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  AlertCircle,
  HelpCircle,
  Award,
  Filter,
  User,
  Heart,
  Stethoscope,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Button } from "../../../components/ui/Button";
import { StorageService } from "../../../lib/data/storage";
import { HomeCareMatchingService } from "../../../lib/services/home-care-matching-service";
import {
  HomeCareIntakeResponse,
  HomeCareRecommendationResult,
  ProviderMatchItem,
} from "../../../lib/types";

function RecommendationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intakeId = searchParams.get("intakeId");

  const [intake, setIntake] = useState<HomeCareIntakeResponse | null>(null);
  const [recommendation, setRecommendation] =
    useState<HomeCareRecommendationResult | null>(null);

  useEffect(() => {
    let currentIntake: HomeCareIntakeResponse | undefined;

    if (intakeId) {
      currentIntake = StorageService.getHomeCareIntakeById(intakeId);
    }

    // Fallback if accessed without prior intake
    if (!currentIntake) {
      const intakes = StorageService.getHomeCareIntakes();
      currentIntake =
        intakes[0] || {
          id: "intake_sample",
          patientId: "patient_001",
          naturalLanguageNeed:
            "Patient recovering from surgical knee replacement needing sterile wound dressing and IV antibiotic administration.",
          primaryConcern: "Post-surgery wound care",
          careRecipient: "parent",
          recipientAge: 68,
          startDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
          urgency: "within_48hrs",
          bookingFormat: "several_days",
          shiftDuration: "12hr_day",
          locationCity: "Delhi NCR",
          postalCode: "110091",
          address: "Mayur Vihar Phase 1",
          patientMobility: "needs_assistance",
          clinicalEquipmentNeeded: ["wound_dressing", "iv_infusion"],
          budgetMaxPerShift: 3500,
          preferredGender: "female",
          preferredLanguages: ["Hindi", "English"],
          physicianInstructionsProvided: true,
          emergencyFlagsDetected: false,
          createdAt: new Date().toISOString(),
        };
    }

    setIntake(currentIntake);
    const result = HomeCareMatchingService.assessAndMatch(currentIntake);
    setRecommendation(result);
  }, [intakeId]);

  if (!intake || !recommendation) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto py-16 text-center text-gray-500">
          Analyzing care requirements and matching verified providers...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/nursing" className="hover:text-emerald-700">
              Home Care Marketplace
            </Link>
            <span>/</span>
            <Link href="/nursing/intake" className="hover:text-emerald-700">
              Intake
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-900">Recommended Providers</span>
          </div>

          <Link href="/nursing/intake">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Modify Needs
            </Button>
          </Link>
        </div>

        {/* INTAKE RECAP BAR */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Your Care Request:
            </span>
            <p className="font-semibold text-gray-900">
              {intake.naturalLanguageNeed}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-gray-500 pt-0.5">
              <span>Recipient: {intake.careRecipient} ({intake.recipientAge} yrs)</span>
              <span>•</span>
              <span>Location: {intake.address} ({intake.postalCode})</span>
              <span>•</span>
              <span className="capitalize">
                Shift: {intake.shiftDuration.replace("_", " ")}
              </span>
            </div>
          </div>

          <Link href="/nursing/intake">
            <Button size="sm" variant="outline" className="text-xs shrink-0">
              Edit Intake
            </Button>
          </Link>
        </div>

        {/* CLINICAL RATIONALE & CATEGORY DETERMINATION CARD */}
        <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Clinical Match Analysis
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight">
              Recommended: {recommendation.categoryName}
            </h2>

            <div className="bg-emerald-800/80 rounded-xl p-4 border border-emerald-700 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block">
                Why this qualification tier was selected:
              </span>
              <p className="text-sm text-emerald-100 leading-relaxed">
                {recommendation.clinicalRationale}
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>
                  <strong>Mandatory Qualification:</strong> {recommendation.requiredQualificationLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MATCHED SAARTHEE VERIFIED PROVIDERS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                Verified Providers Matching Your Care Needs
              </h3>
              <p className="text-xs text-gray-500">
                Ranked by qualification level, proximity to your area, and shift availability.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              {recommendation.eligibleProviders.length} Providers Verified
            </span>
          </div>

          <div className="space-y-4">
            {recommendation.eligibleProviders.map((matchItem: ProviderMatchItem) => {
              const p = matchItem.provider;

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                >
                  <div className="space-y-3 sm:max-w-xl">
                    {/* Header line */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-800 font-extrabold text-base shrink-0">
                        {p.name
                          .replace("Sister ", "")
                          .replace("Dr. ", "")
                          .replace("Nurse ", "")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-gray-900">
                            {p.name}
                          </h4>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Saarthee Verified
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-extrabold border border-teal-200">
                            {matchItem.matchScore}% Match
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 font-medium mt-0.5">
                          {p.title}
                        </p>

                        {p.councilRegistration && (
                          <p className="text-[11px] text-gray-400">
                            Reg: {p.councilRegistration}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {p.rating.toFixed(1)} ({p.reviewCount} reviews)
                          </span>
                          <span>•</span>
                          <span>{p.experienceYears} Years Exp</span>
                          <span>•</span>
                          <span>Speaks: {p.languages.join(", ")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1">
                      <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block">
                        Match Highlights:
                      </span>
                      <ul className="text-xs text-gray-700 space-y-1">
                        {matchItem.matchReasons.map((reason, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pricing and Book Action */}
                  <div className="sm:text-right shrink-0 flex flex-col justify-between sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div>
                      <span className="text-[11px] text-gray-400 block">
                        Estimated Shift Rate:
                      </span>
                      <div className="text-xl font-extrabold text-emerald-950">
                        ₹{matchItem.estimatedCost}
                      </div>
                      <span className="text-[11px] text-gray-500 block">
                        {matchItem.rateExplanation}
                      </span>
                    </div>

                    <Link
                      href={`/nursing/book/${p.id}?intakeId=${intake.id}`}
                      className="w-full sm:w-auto"
                    >
                      <Button variant="primary" size="sm" className="w-full shadow-sm font-bold">
                        Select & Book
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CLINICAL POLICY FOOTER */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Saarthee Scope of Practice Policy:</strong> Licensed nurses (B.Sc/GNM) manage
            sterile procedures, injections, and complex clinical monitoring. Patient attendants (GDA)
            provide non-invasive bedside care, bathing, and mobility assistance. Saarthee guarantees
            that only registered clinical personnel carry out medical interventions.
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function HomeCareRecommendationsPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="max-w-4xl mx-auto py-16 text-center text-gray-500">
            Loading provider recommendations...
          </div>
        </AppShell>
      }
    >
      <RecommendationsContent />
    </Suspense>
  );
}
