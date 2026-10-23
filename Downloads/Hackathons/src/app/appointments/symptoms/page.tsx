"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  PhoneCall,
  User,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent, CardFooter } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { Alert } from "../../../components/ui/Alert";
import { StorageService } from "../../../lib/data/storage";
import { screenForEmergency, matchSpecialtiesFromSymptoms } from "../../../lib/ai/symptom-triage";
import { PatientHealthProfile, UserProfile } from "../../../lib/types";

const COMMON_SYMPTOMS = [
  "Frequent headaches",
  "Persistent dry cough",
  "Knee joint pain / stiffness",
  "Elevated blood sugar readings",
  "Dizziness or lightheadedness",
  "Skin itching or rash",
  "Abdominal discomfort / acid reflux",
  "Lower back pain",
  "Chest tightness / discomfort",
  "Shortness of breath with mild exertion",
];

export default function SymptomQuestionnairePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<PatientHealthProfile | null>(null);

  // Form State
  const [description, setDescription] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [onset, setOnset] = useState("1_3_days");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe">("moderate");
  const [preferredArea, setPreferredArea] = useState("");
  const [appointmentType, setAppointmentType] = useState<"in_person" | "teleconsultation" | "any">("any");

  // Emergency Screening result
  const [emergencyResult, setEmergencyResult] = useState<{
    isEmergency: boolean;
    warningSigns: string[];
    recommendation: string;
  } | null>(null);

  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const u = StorageService.getUser();
    const p = StorageService.getHealthProfile();
    setUser(u);
    setProfile(p);
    setPreferredArea(u?.postalCode || "110025");
  }, []);

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleRunSafetyScreening = async () => {
    if (!description && selectedSymptoms.length === 0) return;

    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 600));

    // Run clinical safety screening
    const screening = screenForEmergency(description, selectedSymptoms);
    setEmergencyResult(screening);
    setIsAnalyzing(false);

    if (!screening.isEmergency) {
      setStep(2);
    }
  };

  const handleProceedToResults = () => {
    const { specialties, reasoning } = matchSpecialtiesFromSymptoms(
      description,
      selectedSymptoms
    );

    const queryParams = new URLSearchParams({
      specialties: specialties.join(","),
      reasoning: reasoning.join("|"),
      description: encodeURIComponent(description),
      severity,
      appointmentType,
      location: preferredArea,
    });

    router.push(`/appointments/results?${queryParams.toString()}`);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/appointments" className="hover:text-primary-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Consultations
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Symptom Assessment</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-800 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>Clinical Triage & Safety Screening</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tell Us About Your Symptoms
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Describe how you are feeling in your own words. We will screen for urgent warning signs and identify suitable medical specialists.
          </p>
        </div>

        {/* Emergency Modal / Warning Banner if triggered */}
        {emergencyResult?.isEmergency && (
          <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-2 flex-1">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 text-xs font-black uppercase tracking-wider">
                  Immediate Emergency Warning
                </span>
                <h2 className="text-xl font-extrabold text-rose-950">
                  Potential Urgent Medical Distress Detected
                </h2>
                <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-medium">
                  {emergencyResult.recommendation}
                </p>

                <div className="bg-white/80 rounded-xl p-4 border border-rose-200 text-xs space-y-2 mt-3">
                  <strong className="text-rose-950 block font-bold">
                    Warning signs identified in your report:
                  </strong>
                  <ul className="list-disc pl-5 text-rose-800 space-y-1">
                    {emergencyResult.warningSigns.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Emergency Services (112 / 108)</span>
                  </a>
                  <Button
                    variant="outline"
                    onClick={() => setEmergencyResult(null)}
                    className="border-rose-300 text-rose-900 hover:bg-rose-100"
                  >
                    Edit Symptoms
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Symptom Input & Safety Screening */}
        {step === 1 && !emergencyResult?.isEmergency && (
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Step 1: Plain-Language Symptom Description
                </h2>
                <p className="text-xs text-slate-500">
                  Describe what you feel. Include any changes, triggers, or pain location.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plain language input */}
              <Textarea
                label="Describe your main symptoms"
                placeholder="e.g. I have had a persistent dull headache on the right side of my head for 3 days, accompanied by slight sensitivity to light and mild neck stiffness..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                helperText="Use your own plain words. Do not worry about technical medical terminology."
              />

              {/* Quick Select Chips */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Select Any Accompanying Symptoms
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SYMPTOMS.map((sym) => {
                    const isSelected = selectedSymptoms.includes(sym);
                    return (
                      <button
                        type="button"
                        key={sym}
                        onClick={() => toggleSymptom(sym)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-primary-700 text-white border-primary-800 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-primary-400"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Onset & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <Select
                  label="When did these symptoms begin?"
                  value={onset}
                  onChange={(e) => setOnset(e.target.value)}
                  options={[
                    { value: "today", label: "Today (Sudden onset)" },
                    { value: "1_3_days", label: "Past 1 to 3 days" },
                    { value: "1_week", label: "About a week ago" },
                    { value: "chronic", label: "Ongoing / Several weeks (Chronic)" },
                  ]}
                />

                <Select
                  label="Severity Level"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  options={[
                    { value: "mild", label: "Mild (Noticeable but does not disrupt routine)" },
                    { value: "moderate", label: "Moderate (Disrupts normal activity)" },
                    { value: "severe", label: "Severe (Substantial distress)" },
                  ]}
                />
              </div>

              {/* Reused Patient Medical History Callout */}
              {profile && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Auto-Connected Patient History:</span>
                  </div>
                  <p className="text-slate-600">
                    Existing conditions (<strong>{profile.conditions.join(", ")}</strong>) and allergies (
                    <strong>{profile.allergies.map((a) => a.allergen).join(", ")}</strong>) are already attached to this assessment. You do not need to re-type them.
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Link href="/appointments">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                variant="primary"
                onClick={handleRunSafetyScreening}
                isLoading={isAnalyzing}
                disabled={!description.trim() && selectedSymptoms.length === 0}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Run Safety Screening & Match
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 2: Preferences & Final Confirmation before Results */}
        {step === 2 && !emergencyResult?.isEmergency && (
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Step 2: Consultation Preferences
                </h2>
                <p className="text-xs text-slate-500">
                  Refine your location and appointment format preferences.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert type="success">
                <strong>Safety Screening Passed:</strong> No acute red-flag emergency symptoms were identified in this routine screening. Proceeding to specialist ranking.
              </Alert>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Search Postal Code or City"
                  value={preferredArea}
                  onChange={(e) => setPreferredArea(e.target.value)}
                  placeholder="e.g. 110025"
                  helperText="Used to calculate distance and hospital commute"
                />

                <Select
                  label="Preferred Consultation Type"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as any)}
                  options={[
                    { value: "any", label: "Either In-Person or Teleconsultation" },
                    { value: "in_person", label: "In-Person Clinic Visit Only" },
                    { value: "teleconsultation", label: "Video / Teleconsultation Only" },
                  ]}
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <strong className="text-slate-900 block font-semibold">
                  Transparent Recommendation Policy:
                </strong>
                Doctor rankings are computed using specialty relevance, verified patient reviews, proximity to your postal code, and next available appointment slot. We never accept fees to bias clinical rankings.
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Edit Symptoms
              </Button>
              <Button
                variant="primary"
                onClick={handleProceedToResults}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Find Recommended Doctors & Hospitals
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
