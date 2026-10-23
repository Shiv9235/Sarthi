"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  User,
  HeartPulse,
  AlertTriangle,
  Pill,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { Card, CardHeader, CardContent, CardFooter } from "../../../components/ui/Card";
import { Alert } from "../../../components/ui/Alert";
import { StorageService } from "../../../lib/data/storage";
import { useAuth } from "../../../lib/context/AuthContext";
import { AllergyItem, MedicationItem } from "../../../lib/types";

export default function OnboardingHealthProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Personal Information
  const [fullName, setFullName] = useState(user?.fullName || "Sunita Sharma");
  const [dob, setDob] = useState(user?.dob || "1982-08-14");
  const [sex, setSex] = useState<"male" | "female" | "other" | "prefer_not_to_say">(
    user?.sex || "female"
  );
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "110091");
  const [address, setAddress] = useState(user?.address || "Flat 402, Shanti Vihar, Mayur Vihar Phase 1");
  const [preferredLanguage, setPreferredLanguage] = useState(
    user?.preferredLanguage || "Hindi & English"
  );

  // Step 2: Conditions & Surgeries
  const [conditions, setConditions] = useState<string[]>([
    "Type 2 Diabetes Mellitus",
    "Hypertension (Blood Pressure)",
  ]);
  const [newCondition, setNewCondition] = useState("");
  const [surgeries, setSurgeries] = useState<string[]>([
    "Laparoscopic Cholecystectomy (Gallbladder, 2021)",
  ]);
  const [newSurgery, setNewSurgery] = useState("");

  // Step 3: Allergies & Medications
  const [allergies, setAllergies] = useState<AllergyItem[]>([
    {
      id: "alg_1",
      allergen: "Penicillin",
      reaction: "Skin hives and facial swelling",
      severity: "severe",
      recordedAt: "12/03/2024",
    },
  ]);
  const [allergenName, setAllergenName] = useState("");
  const [allergenReaction, setAllergenReaction] = useState("");
  const [allergenSeverity, setAllergenSeverity] = useState<"mild" | "moderate" | "severe">("moderate");

  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      id: "med_1",
      name: "Glycomet 500",
      dosage: "500 mg",
      frequency: "Twice daily after meals",
    },
    {
      id: "med_2",
      name: "Telma 40",
      dosage: "40 mg",
      frequency: "Once daily in morning",
    },
  ]);
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medFreq, setMedFreq] = useState("");

  // Step 4: Emergency Contacts & Notes
  const [emergencyName, setEmergencyName] = useState("Rajesh Sharma");
  const [emergencyPhone, setEmergencyPhone] = useState("+91 98111 22334");
  const [emergencyRelation, setEmergencyRelation] = useState("Spouse");
  const [patientNotes, setPatientNotes] = useState(
    "Checks blood pressure and sugar at home weekly."
  );

  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const removeCondition = (idx: number) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };

  const addSurgery = () => {
    if (newSurgery.trim()) {
      setSurgeries([...surgeries, newSurgery.trim()]);
      setNewSurgery("");
    }
  };

  const removeSurgery = (idx: number) => {
    setSurgeries(surgeries.filter((_, i) => i !== idx));
  };

  const addAllergy = () => {
    if (allergenName.trim()) {
      setAllergies([
        ...allergies,
        {
          id: `alg_${Date.now()}`,
          allergen: allergenName.trim(),
          reaction: allergenReaction.trim() || "Unspecified reaction",
          severity: allergenSeverity,
          recordedAt: new Date().toLocaleDateString("en-GB"),
        },
      ]);
      setAllergenName("");
      setAllergenReaction("");
    }
  };

  const removeAllergy = (id: string) => {
    setAllergies(allergies.filter((a) => a.id !== id));
  };

  const addMedication = () => {
    if (medName.trim()) {
      setMedications([
        ...medications,
        {
          id: `med_${Date.now()}`,
          name: medName.trim(),
          dosage: medDosage.trim() || "As directed",
          frequency: medFreq.trim() || "Daily",
        },
      ]);
      setMedName("");
      setMedDosage("");
      setMedFreq("");
    }
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const handleComplete = () => {
    const updatedUser = {
      fullName,
      dob,
      sex,
      phone,
      postalCode,
      address,
      preferredLanguage,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      emergencyContactRelation: emergencyRelation,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    };
    updateUser(updatedUser);

    const existingHealth = StorageService.getHealthProfile();
    StorageService.setHealthProfile({
      ...existingHealth,
      conditions,
      allergies,
      medications,
      patientNotes,
    });

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-surface-ground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-800 text-xs font-semibold">
            <Heart className="w-4 h-4 fill-primary-600 text-primary-600" />
            <span>Health Profile Setup</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Tell Us About Your Health
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            This information helps doctors and nurses understand your medical history. You can edit this anytime.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white p-4 rounded-2xl border border-surface-border shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>
              {step === 1 && "Personal Details"}
              {step === 2 && "Health Conditions"}
              {step === 3 && "Allergies & Medicines"}
              {step === 4 && "Emergency Contact"}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card>
          {step === 1 && (
            <>
              <CardHeader>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Step 1: Personal Details
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  <Select
                    label="Gender / Clinical Info"
                    value={sex}
                    onChange={(e) => setSex(e.target.value as any)}
                    options={[
                      { value: "female", label: "Female" },
                      { value: "male", label: "Male" },
                      { value: "other", label: "Other" },
                      { value: "prefer_not_to_say", label: "Prefer not to disclose" },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                  <Input
                    label="PIN Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 110091"
                    required
                  />
                </div>

                <Input
                  label="Home Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat number, locality, city"
                />

                <Select
                  label="Preferred Language"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  options={[
                    { value: "Hindi & English", label: "Hindi & English" },
                    { value: "Hindi", label: "Hindi" },
                    { value: "English", label: "English" },
                    { value: "Bengali", label: "Bengali" },
                    { value: "Marathi", label: "Marathi" },
                    { value: "Tamil", label: "Tamil" },
                    { value: "Telugu", label: "Telugu" },
                    { value: "Gujarati", label: "Gujarati" },
                  ]}
                />
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Step 2: Existing Health Conditions & Surgeries
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Known Diagnoses
                  </label>
                  <div className="space-y-2 mb-3">
                    {conditions.map((cond, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2 bg-surface-muted rounded-xl text-sm"
                      >
                        <span className="font-medium text-slate-800">{cond}</span>
                        <button
                          type="button"
                          onClick={() => removeCondition(i)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. Diabetes, Blood Pressure, Thyroid, Asthma"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
                    />
                    <Button type="button" variant="outline" onClick={addCondition}>
                      Add
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-border">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Past Surgeries or Major Procedures
                  </label>
                  <div className="space-y-2 mb-3">
                    {surgeries.map((surg, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2 bg-surface-muted rounded-xl text-sm"
                      >
                        <span className="font-medium text-slate-800">{surg}</span>
                        <button
                          type="button"
                          onClick={() => removeSurgery(i)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. Gallbladder Removal (2021), Knee Surgery"
                      value={newSurgery}
                      onChange={(e) => setNewSurgery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSurgery())}
                    />
                    <Button type="button" variant="outline" onClick={addSurgery}>
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Step 3: Allergies & Daily Medications
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Known Drug or Food Allergies
                  </label>
                  <div className="space-y-2 mb-3">
                    {allergies.map((alg) => (
                      <div
                        key={alg.id}
                        className="flex items-center justify-between px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl text-xs"
                      >
                        <div>
                          <strong className="text-rose-950 mr-2">{alg.allergen}</strong>
                          <span className="text-rose-700">({alg.reaction})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAllergy(alg.id)}
                          className="text-rose-400 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      placeholder="Allergen (e.g. Penicillin)"
                      value={allergenName}
                      onChange={(e) => setAllergenName(e.target.value)}
                    />
                    <Input
                      placeholder="Reaction (e.g. Rash, swelling)"
                      value={allergenReaction}
                      onChange={(e) => setAllergenReaction(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Select
                        value={allergenSeverity}
                        onChange={(e) => setAllergenSeverity(e.target.value as any)}
                        options={[
                          { value: "mild", label: "Mild" },
                          { value: "moderate", label: "Moderate" },
                          { value: "severe", label: "Severe" },
                        ]}
                      />
                      <Button type="button" variant="outline" onClick={addAllergy}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-border">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Current Daily Medicines
                  </label>
                  <div className="space-y-2 mb-3">
                    {medications.map((med) => (
                      <div
                        key={med.id}
                        className="flex items-center justify-between px-3 py-2 bg-surface-muted rounded-xl text-xs"
                      >
                        <div>
                          <strong className="text-slate-900 mr-2">{med.name}</strong>
                          <span className="text-slate-600">{med.dosage} — {med.frequency}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMedication(med.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      placeholder="Medicine name"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                    />
                    <Input
                      placeholder="Dosage (e.g. 500mg)"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Frequency (e.g. Twice daily)"
                        value={medFreq}
                        onChange={(e) => setMedFreq(e.target.value)}
                      />
                      <Button type="button" variant="outline" onClick={addMedication}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Step 4: Emergency Contact Details
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Contact Name"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    required
                  />
                  <Input
                    label="Contact Phone"
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="Relationship"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    placeholder="e.g. Spouse, Son, Daughter"
                    required
                  />
                </div>

                <Textarea
                  label="Any specific health notes or preferences"
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  rows={2}
                />
              </CardContent>
            </>
          )}

          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                variant="primary"
                onClick={() => setStep(step + 1)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleComplete}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Complete & Open Dashboard
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
