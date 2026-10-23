"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  User,
  Clock,
  Calendar,
  MapPin,
  Heart,
  Stethoscope,
  Info,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Button } from "../../../components/ui/Button";
import { HomeCareMatchingService } from "../../../lib/services/home-care-matching-service";
import { StorageService } from "../../../lib/data/storage";
import { useAuth } from "../../../lib/context/AuthContext";
import { HomeCareIntakeResponse } from "../../../lib/types";

function IntakeFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCategory = searchParams.get("category") || "";
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [naturalLanguageNeed, setNaturalLanguageNeed] = useState(
    preselectedCategory === "post_operative_care"
      ? "My mother recently had surgery and needs daily wound dressing, vital checks, and assistance moving around."
      : preselectedCategory === "elder_care"
      ? "Need a compassionate caregiver for my elderly father for daily companionship, medication reminders, and mobility support."
      : preselectedCategory === "physiotherapy"
      ? "Looking for a certified physiotherapist for joint rehab exercises and gait training."
      : ""
  );

  const [careRecipient, setCareRecipient] = useState<"self" | "parent" | "spouse" | "child" | "relative">("parent");
  const [recipientAge, setRecipientAge] = useState<number>(68);
  const [patientMobility, setPatientMobility] = useState<
    "independent" | "needs_assistance" | "wheelchair_bound" | "bedridden"
  >("needs_assistance");
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(
    preselectedCategory === "post_operative_care" ? ["wound_dressing"] : []
  );

  const [urgency, setUrgency] = useState<"today" | "within_48hrs" | "flexible_this_week">("within_48hrs");
  const [shiftDuration, setShiftDuration] = useState<
    "short_visit" | "8hr" | "12hr_day" | "12hr_night" | "24hr_livein"
  >(
    preselectedCategory === "injection_visit" || preselectedCategory === "physiotherapy"
      ? "short_visit"
      : "12hr_day"
  );
  const [bookingFormat, setBookingFormat] = useState<"single_visit" | "several_days" | "recurring_shifts">("several_days");
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );

  const [locationCity, setLocationCity] = useState("Delhi NCR");
  const [address, setAddress] = useState(user?.address || "Mayur Vihar Phase 1, Pocket 4");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "110091");
  const [preferredGender, setPreferredGender] = useState<"any" | "female" | "male">("female");
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(["Hindi", "English"]);
  const [budgetMax, setBudgetMax] = useState<number>(3500);
  const [hasDoctorNote, setHasDoctorNote] = useState(true);

  // Emergency screening check
  const emergencyCheck = HomeCareMatchingService.screenForEmergency(naturalLanguageNeed);

  const toggleEquipment = (eqId: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(eqId) ? prev.filter((i) => i !== eqId) : [...prev, eqId]
    );
  };

  const toggleLanguage = (lang: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    const intakeId = `intake_${Date.now()}`;
    const intakeData: HomeCareIntakeResponse = {
      id: intakeId,
      patientId: user?.id || "patient_001",
      naturalLanguageNeed: naturalLanguageNeed || "Home care support required",
      primaryConcern: naturalLanguageNeed.slice(0, 100),
      careRecipient,
      recipientAge,
      startDate,
      urgency,
      bookingFormat,
      shiftDuration,
      locationCity,
      postalCode,
      address,
      patientMobility,
      clinicalEquipmentNeeded: selectedEquipment,
      budgetMaxPerShift: budgetMax,
      preferredGender,
      preferredLanguages,
      physicianInstructionsProvided: hasDoctorNote,
      emergencyFlagsDetected: emergencyCheck.isEmergency,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveHomeCareIntake(intakeData);
    router.push(`/nursing/recommendations?intakeId=${intakeId}`);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6 pb-16">
        {/* Header & Steps Breadcrumb */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/nursing" className="hover:text-emerald-700">
              Home Care Marketplace
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-900">Guided Care Intake</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Guided Care Intake
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Step {step} of 4
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: "Why do you need home care today?" */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Primary Care Assessment
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Why do you need home care today?
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Describe the patient&apos;s condition and what assistance is needed. You can use simple, everyday language.
              </p>
            </div>

            {/* Quick Inspiration Pills */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                Quick Select / Examples:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Post-surgery wound dressing & medication",
                  "Elderly parent companionship & fall prevention",
                  "Bedridden patient sponge bath & personal hygiene",
                  "Physiotherapy for stroke / joint recovery",
                  "Doorstep nurse visit for IV injection / cannula",
                  "Tracheostomy or ICU step-down nursing",
                  "Newborn baby & mother care support",
                  "Home sleep study for snoring / apnea",
                ].map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNaturalLanguageNeed(sample)}
                    className="text-xs bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors text-left"
                  >
                    + {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <textarea
                rows={4}
                value={naturalLanguageNeed}
                onChange={(e) => setNaturalLanguageNeed(e.target.value)}
                placeholder="e.g., My 68-year-old mother had total knee replacement surgery 4 days ago. She needs a licensed nurse for daily sterile wound dressings, IV antibiotic administration, and help walking to the bathroom safely."
                className="w-full text-sm rounded-xl border border-gray-300 p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Red Flag Emergency Screening Alert */}
            {emergencyCheck.isEmergency && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 sm:p-5 flex items-start gap-4 shadow-sm animate-pulse">
                <div className="p-2.5 bg-red-100 rounded-lg text-red-700 shrink-0 mt-0.5">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="bg-red-600 text-white text-xs uppercase tracking-wider font-extrabold px-2 py-0.5 rounded">
                    Potential Acute Medical Emergency
                  </span>
                  <h3 className="text-base font-bold text-red-950">
                    {emergencyCheck.reason}
                  </h3>
                  <p className="text-sm text-red-900 leading-relaxed">
                    {emergencyCheck.emergencyAdvice}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <a href="tel:112">
                      <Button size="sm" variant="danger">
                        <PhoneCall className="w-4 h-4 mr-1.5" />
                        Dial 112 (National Emergency)
                      </Button>
                    </a>
                    <a href="tel:102">
                      <Button size="sm" variant="outline">
                        Dial 102 (Ambulance)
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!naturalLanguageNeed.trim()}
              >
                Continue: Patient Condition
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Who needs care & clinical equipment */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Who Needs Care?
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Help us understand the recipient&apos;s relationship, age, and physical mobility.
              </p>
            </div>

            {/* Care recipient relationship */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Relationship to You:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: "parent", label: "Parent (Mother/Father)" },
                  { id: "self", label: "Myself" },
                  { id: "spouse", label: "Spouse" },
                  { id: "child", label: "Child / Infant" },
                  { id: "relative", label: "Other Relative" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCareRecipient(item.id as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      careRecipient === item.id
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Age */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Patient Age:
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={recipientAge}
                  onChange={(e) => setRecipientAge(parseInt(e.target.value) || 0)}
                  className="w-28 text-sm rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-xs text-gray-500">
                  {recipientAge >= 60 ? "Eligible for Senior / Geriatric Specialists" : "Standard care routing"}
                </span>
              </div>
            </div>

            {/* Mobility */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Current Mobility Status:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "independent", label: "Fully Independent", desc: "Can walk and manage toilet alone" },
                  { id: "needs_assistance", label: "Needs Assistance", desc: "Requires support to stand, walk or reach toilet" },
                  { id: "wheelchair_bound", label: "Wheelchair Dependent", desc: "Uses wheelchair for transfers" },
                  { id: "bedridden", label: "Completely Bedridden", desc: "Requires full bed sponge baths and turning" },
                ].map((mob) => (
                  <button
                    key={mob.id}
                    type="button"
                    onClick={() => setPatientMobility(mob.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      patientMobility === mob.id
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xs font-bold block">{mob.label}</span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">{mob.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Equipment & Invasive Needs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Clinical Equipment or Sterile Procedures Needed (Select all that apply):
              </label>
              <p className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded border border-emerald-100">
                Note: Catheterization, IV drips, and sterile wound dressings strictly require licensed nurses (B.Sc / GNM) under Saarthee safety policy.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {[
                  { id: "wound_dressing", label: "Sterile Wound Dressing / Surgical Sutures" },
                  { id: "iv_infusion", label: "IV Drips / Cannula / Injections" },
                  { id: "urinary_catheter", label: "Urinary Foley Catheter Care" },
                  { id: "ryles_tube", label: "Ryle's Tube / Nasogastric Feeding" },
                  { id: "oxygen_concentrator", label: "Oxygen Therapy / Concentrator" },
                  { id: "bipap_ventilator", label: "BiPAP / CPAP / Home Ventilator" },
                ].map((eq) => {
                  const isChecked = selectedEquipment.includes(eq.id);
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => toggleEquipment(eq.id)}
                      className={`p-3 rounded-lg border text-xs text-left font-medium flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{eq.label}</span>
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={handlePrev}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Previous
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Continue: Schedule & Shifts
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Shift Duration & Timings */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Shift Duration & Schedule
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose the shift length that fits your family routine and patient supervision needs.
              </p>
            </div>

            {/* Shift duration options */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Select Shift Format:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "short_visit",
                    label: "Doorstep Visit (30–60 mins)",
                    desc: "Ideal for injections, wound dressing change, or physio session",
                    rate: "From ₹450 / visit",
                  },
                  {
                    id: "12hr_day",
                    label: "12-Hour Day Shift (8 AM – 8 PM)",
                    desc: "Full daytime monitoring, meals, medication, and mobility",
                    rate: "From ₹1,500 – ₹2,600 / shift",
                  },
                  {
                    id: "12hr_night",
                    label: "12-Hour Night Shift (8 PM – 8 AM)",
                    desc: "Overnight assistance, vitals check, sleep safety, and toileting",
                    rate: "From ₹1,600 – ₹2,800 / shift",
                  },
                  {
                    id: "24hr_livein",
                    label: "24-Hour Live-in Care",
                    desc: "Continuous round-the-clock stay with patient room accommodation",
                    rate: "From ₹3,000 – ₹4,500 / day",
                  },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setShiftDuration(s.id as any)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      shiftDuration === s.id
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm ring-1 ring-emerald-500"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{s.label}</span>
                      <span className="text-[11px] font-extrabold text-emerald-700">{s.rate}</span>
                    </div>
                    <span className="text-[11px] text-gray-500 block">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                When Do You Need Care to Begin?
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "today", label: "Urgent (Today)" },
                  { id: "within_48hrs", label: "Within 24–48 Hours" },
                  { id: "flexible_this_week", label: "Flexible Later This Week" },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUrgency(u.id as any)}
                    className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                      urgency === u.id
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Preferred Start Date:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-64 text-sm rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={handlePrev}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Previous
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Continue: Location & Preferences
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Location, Language, Gender & Submit */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Location & Service Preferences
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Provide your address details to match providers with active coverage in your neighbourhood.
              </p>
            </div>

            {/* Location Address */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Street Address / Colony:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., Flat 302, Pocket 4, Mayur Vihar Phase 1"
                  className="w-full text-sm rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    City / Zone:
                  </label>
                  <select
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    className="w-full text-sm rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Delhi NCR">Delhi NCR (All Zones)</option>
                    <option value="South Delhi">South Delhi</option>
                    <option value="East Delhi">East Delhi</option>
                    <option value="Noida">Noida & Greater Noida</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="West Delhi">West Delhi</option>
                    <option value="Central Delhi">Central Delhi</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Pincode:
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g., 110091"
                    className="w-full text-sm rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Caregiver Gender Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Caregiver Gender Preference:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "female", label: "Female Caregiver" },
                  { id: "male", label: "Male Caregiver" },
                  { id: "any", label: "No Preference / Any" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setPreferredGender(g.id as any)}
                    className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                      preferredGender === g.id
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Preferences */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Preferred Spoken Languages:
              </label>
              <div className="flex flex-wrap gap-2">
                {["Hindi", "English", "Punjabi", "Bengali", "Malayalam"].map((lang) => {
                  const isChecked = preferredLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        isChecked
                          ? "bg-emerald-800 text-white border-emerald-800 font-semibold"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {isChecked ? "✓ " : "+ "}
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Doctor Note */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3 text-xs text-gray-700">
              <input
                type="checkbox"
                id="docNote"
                checked={hasDoctorNote}
                onChange={(e) => setHasDoctorNote(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="docNote">
                <strong>I have a hospital discharge summary or doctor prescription available</strong> for the visiting care provider to review.
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={handlePrev}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Previous
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                className="shadow font-bold px-6"
              >
                Find & Match Care Providers
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function HomeCareIntakePage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="max-w-3xl mx-auto py-12 text-center text-sm text-gray-500">
            Loading care intake questionnaire...
          </div>
        </AppShell>
      }
    >
      <IntakeFormContent />
    </Suspense>
  );
}
