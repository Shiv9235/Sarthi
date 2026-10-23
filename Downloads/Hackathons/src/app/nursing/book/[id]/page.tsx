"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter, notFound, useSearchParams } from "next/navigation";
import {
  HeartHandshake,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Star,
  User,
  Sparkles,
  PhoneCall,
  DollarSign,
  FileText,
} from "lucide-react";
import { AppShell } from "../../../../components/layout/AppShell";
import { Card, CardHeader, CardContent, CardFooter } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { Select } from "../../../../components/ui/Select";
import { Textarea } from "../../../../components/ui/Textarea";
import { Alert } from "../../../../components/ui/Alert";
import { StorageService } from "../../../../lib/data/storage";
import { HomeCareMatchingService } from "../../../../lib/services/home-care-matching-service";
import { useAuth } from "../../../../lib/context/AuthContext";
import {
  NursingBooking,
  SaartheeHomeCareBooking,
  SaartheeProvider,
  Caregiver,
} from "../../../../lib/types";

export default function UnifiedNursingBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();

  // Try finding provider from Saarthee verified providers first, then legacy caregivers
  const saartheeProvider = HomeCareMatchingService.getProviderById(resolvedParams.id);
  const legacyCaregiver = !saartheeProvider
    ? StorageService.getCaregiverById(resolvedParams.id)
    : null;

  if (!saartheeProvider && !legacyCaregiver) {
    notFound();
  }

  // Unified display values
  const providerName = saartheeProvider ? saartheeProvider.name : legacyCaregiver!.name;
  const providerTitle = saartheeProvider ? saartheeProvider.title : legacyCaregiver!.title;
  const providerTier = saartheeProvider ? saartheeProvider.providerTier : "licensed_nurse";
  const councilReg = saartheeProvider?.councilRegistration;
  const providerRating = saartheeProvider ? saartheeProvider.rating : legacyCaregiver!.rating;
  const providerReviews = saartheeProvider ? saartheeProvider.reviewCount : legacyCaregiver!.reviewCount;
  const providerLanguages = saartheeProvider ? saartheeProvider.languages : legacyCaregiver!.languages;

  // Form states
  const [shiftDuration, setShiftDuration] = useState<
    "short_visit" | "8hr" | "12hr_day" | "12hr_night" | "24hr_livein"
  >(saartheeProvider?.shiftRates.visit ? "short_visit" : "12hr_day");

  const [numDays, setNumDays] = useState<number>(1);
  const [requestedDate, setRequestedDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [requestedTime, setRequestedTime] = useState("08:00 AM");
  const [careNeeds, setCareNeeds] = useState(
    "Post-hospitalization recovery care, medication administration, vitals monitoring, and daily assistance."
  );
  const [serviceAddress, setServiceAddress] = useState(
    user?.address || "Mayur Vihar Phase 1, Pocket 4, Flat 302"
  );
  const [postalCode, setPostalCode] = useState(user?.postalCode || "110091");
  const [contactPhone, setContactPhone] = useState(user?.phone || "+91 98765 43210");

  const [step, setStep] = useState<"form" | "review" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<SaartheeHomeCareBooking | null>(null);

  // Rate lookup
  const getRateForShift = () => {
    if (saartheeProvider) {
      if (shiftDuration === "short_visit") return saartheeProvider.shiftRates.visit || 450;
      if (shiftDuration === "8hr") return saartheeProvider.shiftRates.shift8hr || 1900;
      if (shiftDuration === "12hr_night") return (saartheeProvider.shiftRates.shift12hr || 2600) + 200;
      if (shiftDuration === "24hr_livein") return saartheeProvider.shiftRates.shift24hr || 4500;
      return saartheeProvider.shiftRates.shift12hr || 2600;
    }
    // Legacy caregiver fallback
    return legacyCaregiver?.shiftRate || 2400;
  };

  const perShiftRate = getRateForShift();
  const subtotal = perShiftRate * numDays;
  const gstAmount = Math.round(subtotal * 0.05); // 5% healthcare care services GST
  const grandTotal = subtotal + gstAmount;

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careNeeds || !serviceAddress || !requestedDate) return;
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const bookingId = `shb_${Date.now()}`;
    const newBooking: SaartheeHomeCareBooking = {
      id: bookingId,
      patientId: user?.id || "patient_001",
      providerId: saartheeProvider?.id || legacyCaregiver!.id,
      providerName,
      providerTier,
      providerPhoto: saartheeProvider?.photoUrl || legacyCaregiver!.photoUrl,
      categoryId: saartheeProvider?.categoryIds[0] || "nursing_staff",
      categoryName: saartheeProvider ? saartheeProvider.categoryIds[0].replace(/_/g, " ") : "Nursing Staff",
      careNeedsDescription: careNeeds,
      serviceAddress,
      postalCode,
      requestedDate,
      shiftDuration,
      shiftRate: perShiftRate,
      numDaysOrVisits: numDays,
      estimatedTotal: grandTotal,
      isPriceFinal: false,
      status: "request_submitted",
      statusMessage: "Booking request received. Saarthee clinical care coordinator is confirming provider shift availability.",
      isDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save in Saarthee Home-Care Bookings
    StorageService.saveSaartheeHomeCareBooking(newBooking);

    // Also mirror into legacy NursingBooking for backward-compatibility
    const legacyMirror: NursingBooking = {
      id: bookingId,
      patientId: user?.id || "patient_001",
      caregiverId: newBooking.providerId,
      caregiverName: providerName,
      caregiverPhoto: newBooking.providerPhoto,
      serviceCategory: newBooking.categoryName,
      careNeedsDescription: careNeeds,
      requestedDate,
      requestedTime,
      durationHours: shiftDuration === "short_visit" ? 1 : shiftDuration === "8hr" ? 8 : 12,
      serviceAddress,
      postalCode,
      estimatedCost: grandTotal,
      status: "requested",
      statusMessage: newBooking.statusMessage,
      isDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveNursingBooking(legacyMirror);

    setBookingResult(newBooking);
    setIsSubmitting(false);
    setStep("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6 pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/nursing" className="hover:text-emerald-700">
            Home Care Marketplace
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-900">Book Care Provider</span>
        </div>

        {/* PROVIDER MINI HERO */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-800 font-extrabold text-lg shrink-0">
            {providerName.replace("Sister ", "").replace("Dr. ", "").replace("Nurse ", "").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 truncate">{providerName}</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Saarthee Verified
              </span>
            </div>
            <p className="text-xs text-gray-600 font-medium">{providerTitle}</p>
            {councilReg && <p className="text-[11px] text-gray-400">Reg: {councilReg}</p>}
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {providerRating.toFixed(1)} ({providerReviews} reviews)
              </span>
              <span>•</span>
              <span>Speaks: {providerLanguages.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* STEP 1: FORM */}
        {step === "form" && (
          <form onSubmit={handleReview} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">
              Configure Shift Details & Patient Location
            </h2>

            {/* Shift Duration Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Select Shift Type:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: "short_visit", label: "Doorstep Clinical Visit (30–60 min)", rate: "₹450 – ₹1,200" },
                  { id: "8hr", label: "8-Hour Day Shift", rate: "₹1,900" },
                  { id: "12hr_day", label: "12-Hour Day Shift (8 AM – 8 PM)", rate: `₹${perShiftRate}` },
                  { id: "12hr_night", label: "12-Hour Night Shift (8 PM – 8 AM)", rate: `₹${perShiftRate + 200}` },
                  { id: "24hr_livein", label: "24-Hour Live-in Care", rate: "₹4,500" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setShiftDuration(s.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      shiftDuration === s.id
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm ring-1 ring-emerald-500"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xs font-bold block">{s.label}</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">{s.rate}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of days & Start Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Duration (Number of Days / Shifts):
                </label>
                <select
                  value={numDays}
                  onChange={(e) => setNumDays(parseInt(e.target.value) || 1)}
                  className="w-full text-sm rounded-lg border border-gray-300 p-2.5 bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={1}>1 Day (Single Shift)</option>
                  <option value={3}>3 Days (Post-discharge recovery)</option>
                  <option value={7}>7 Days (1 Week Package)</option>
                  <option value={15}>15 Days (2 Weeks Package)</option>
                  <option value={30}>30 Days (Monthly Care)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Start Date:
                </label>
                <input
                  type="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full text-sm rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Care Needs Description */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Describe Patient Condition & Specific Needs:
              </label>
              <textarea
                rows={3}
                value={careNeeds}
                onChange={(e) => setCareNeeds(e.target.value)}
                placeholder="e.g., Mother is 68, recovering from surgery. Needs vital checks, sterile dressing change, medication reminder, and help walking to the bathroom."
                className="w-full text-sm rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Service Address & Contact */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Doorstep Service Address:
                </label>
                <input
                  type="text"
                  value={serviceAddress}
                  onChange={(e) => setServiceAddress(e.target.value)}
                  className="w-full text-sm rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Pincode:
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full text-sm rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Emergency Phone Number:
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-sm rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing Summary Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2 text-xs">
              <span className="font-bold text-emerald-950 uppercase tracking-wide block">
                Estimated Price Breakdown
              </span>
              <div className="flex justify-between text-gray-700">
                <span>Shift Rate (₹{perShiftRate} × {numDays} shift{numDays > 1 ? "s" : ""})</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Healthcare Care Services GST (5%)</span>
                <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Saarthee Quality & Clinical Oversight Fee</span>
                <span className="font-bold text-emerald-700">₹0.00 (Included)</span>
              </div>
              <div className="border-t border-emerald-200 pt-2 flex justify-between text-sm font-extrabold text-emerald-950">
                <span>Estimated Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <span className="text-[11px] text-gray-500 block pt-1">
                * Payment is processed after coordinator confirms shift availability. No surprise charges.
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Link href="/nursing">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary">
                Review Request Summary
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: REVIEW */}
        {step === "review" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Review and Submit Care Request
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Please verify your care details before our clinical coordinator initiates provider matching.
              </p>
            </div>

            {/* Review Cards */}
            <div className="space-y-4 text-xs">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="font-bold text-gray-700 uppercase tracking-wide block">
                  Assigned Provider & Shift:
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-bold text-gray-900">{providerName} ({providerTitle})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shift Type:</span>
                  <span className="font-semibold capitalize text-gray-900">{shiftDuration.replace("_", " ")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Schedule:</span>
                  <span className="font-semibold text-gray-900">{requestedDate} ({numDays} days)</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <span className="font-bold text-gray-700 uppercase tracking-wide block">
                  Patient & Location:
                </span>
                <p className="text-gray-800"><strong>Address:</strong> {serviceAddress}, PIN {postalCode}</p>
                <p className="text-gray-800"><strong>Emergency Contact:</strong> {contactPhone}</p>
                <p className="text-gray-800"><strong>Needs:</strong> {careNeeds}</p>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-emerald-950 block">Estimated Total</span>
                  <span className="text-xs text-gray-500">Includes all taxes & clinical oversight</span>
                </div>
                <span className="text-xl font-extrabold text-emerald-950">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Coordination Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Saarthee Care Coordination:</strong> Once you submit, our clinical manager confirms the provider&apos;s shift readiness and calls you within 30 minutes to verify medical instructions.
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => setStep("form")}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Edit Details
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="font-bold px-6"
              >
                {isSubmitting ? "Submitting Request..." : "Confirm & Submit Request"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === "success" && bookingResult && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Request Submitted Successfully
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 pt-2">
                Care Request #{bookingResult.id} Logged
              </h2>
              <p className="text-xs text-gray-500">
                Status: <strong className="text-amber-700 uppercase">Awaiting Saarthee Confirmation</strong>
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Provider:</span>
                <span className="font-bold text-gray-900">{bookingResult.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shift:</span>
                <span className="font-semibold capitalize text-gray-900">{bookingResult.shiftDuration.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Start Date:</span>
                <span className="font-semibold text-gray-900">{bookingResult.requestedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Total:</span>
                <span className="font-extrabold text-emerald-900">₹{bookingResult.estimatedTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl border border-emerald-200 text-xs max-w-md mx-auto text-left flex items-start gap-3">
              <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Our Saarthee clinical supervisor will reach out on your mobile number to confirm medical readiness before the caregiver arrives.
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-100">
              <Link href="/nursing/history">
                <Button variant="primary">
                  View My Home-Care Bookings
                </Button>
              </Link>
              <Link href="/nursing">
                <Button variant="outline">
                  Return to Marketplace
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
