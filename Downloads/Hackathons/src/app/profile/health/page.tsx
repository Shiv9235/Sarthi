"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  HeartPulse,
  AlertTriangle,
  Pill,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  FileCheck,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent, CardFooter } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { Alert } from "../../../components/ui/Alert";
import { StorageService } from "../../../lib/data/storage";
import { useAuth } from "../../../lib/context/AuthContext";
import { AllergyItem, MedicationItem, PatientHealthProfile, UserProfile } from "../../../lib/types";

export default function HealthProfilePage() {
  const { user, updateUser } = useAuth();

  const [healthProfile, setHealthProfile] = useState<PatientHealthProfile | null>(null);

  // Personal Fields
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "other" | "prefer_not_to_say">("female");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");

  // Clinical Lists
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState("");
  const [allergies, setAllergies] = useState<AllergyItem[]>([]);
  const [newAllergen, setNewAllergen] = useState("");
  const [newReaction, setNewReaction] = useState("");
  const [newSeverity, setNewSeverity] = useState<"mild" | "moderate" | "severe">("moderate");

  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [newMedName, setNewMedName] = useState("");
  const [newMedDose, setNewMedDose] = useState("");
  const [newMedFreq, setNewMedFreq] = useState("");

  const [familyHistory, setFamilyHistory] = useState<string[]>([]);
  const [newFamilyItem, setNewFamilyItem] = useState("");

  const [patientNotes, setPatientNotes] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const u = StorageService.getUser();
    const p = StorageService.getHealthProfile();
    if (u) {
      setFullName(u.fullName || "");
      setDob(u.dob || "");
      setSex(u.sex || "female");
      setPhone(u.phone || "");
      setPostalCode(u.postalCode || "");
      setAddress(u.address || "");
      setPreferredLanguage(u.preferredLanguage || "English");
      setEmergencyName(u.emergencyContactName || "");
      setEmergencyPhone(u.emergencyContactPhone || "");
      setEmergencyRelation(u.emergencyContactRelation || "");
    }
    if (p) {
      setHealthProfile(p);
      setConditions(p.conditions || []);
      setAllergies(p.allergies || []);
      setMedications(p.medications || []);
      setFamilyHistory(p.familyHistory || []);
      setPatientNotes(p.patientNotes || "");
    }
  }, []);

  const handleSaveAll = () => {
    // 1. Update user profile
    const updatedUser: Partial<UserProfile> = {
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
    };
    updateUser(updatedUser);

    // 2. Update medical health profile
    const updatedHealth: PatientHealthProfile = {
      conditions,
      allergies,
      medications,
      surgeries: healthProfile?.surgeries || [],
      familyHistory,
      patientNotes,
      primaryCareProvider: healthProfile?.primaryCareProvider,
    };
    StorageService.setHealthProfile(updatedHealth);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const removeCondition = (idx: number) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };

  const addAllergy = () => {
    if (newAllergen.trim()) {
      setAllergies([
        ...allergies,
        {
          id: `alg_${Date.now()}`,
          allergen: newAllergen.trim(),
          reaction: newReaction.trim() || "Unspecified reaction",
          severity: newSeverity,
          recordedAt: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewAllergen("");
      setNewReaction("");
    }
  };

  const removeAllergy = (id: string) => {
    setAllergies(allergies.filter((a) => a.id !== id));
  };

  const addMedication = () => {
    if (newMedName.trim()) {
      setMedications([
        ...medications,
        {
          id: `med_${Date.now()}`,
          name: newMedName.trim(),
          dosage: newMedDose.trim() || "As directed",
          frequency: newMedFreq.trim() || "Daily",
        },
      ]);
      setNewMedName("");
      setNewMedDose("");
      setNewMedFreq("");
    }
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  const addFamily = () => {
    if (newFamilyItem.trim()) {
      setFamilyHistory([...familyHistory, newFamilyItem.trim()]);
      setNewFamilyItem("");
    }
  };

  const removeFamily = (idx: number) => {
    setFamilyHistory(familyHistory.filter((_, i) => i !== idx));
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/dashboard" className="hover:text-primary-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Medical Health Profile</span>
        </div>

        {/* Header with Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Patient Records
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">Encrypted Chart</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Patient Health Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Review and update your clinical history, allergies, medications, and contact information.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveAll}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </div>

        {saveSuccess && (
          <Alert type="success">
            <strong>Changes Saved:</strong> Your updated health profile and allergy records have been persisted to your account.
          </Alert>
        )}

        {/* Section 1: Personal & Demographics */}
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary-700" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Personal Demographics & Address
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <Select
                label="Biological Sex / Clinical Info"
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="PIN Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                helperText="Used for doctor & nurse proximity"
              />
              <Select
                label="Preferred Language"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                options={[
                  { value: "English", label: "English" },
                  { value: "Hindi", label: "Hindi" },
                  { value: "Spanish", label: "Spanish" },
                  { value: "French", label: "French" },
                ]}
              />
            </div>

            <Input
              label="Home Residential Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Section 2: Documented Allergies (Critical Clinical Safety) */}
        <Card className="border-rose-200">
          <CardHeader className="py-4 bg-rose-50/30">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Documented Allergies & Drug Reactions
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {allergies.map((alg) => (
                <div
                  key={alg.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-rose-50/60 border border-rose-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-rose-950 mr-2">{alg.allergen}</span>
                    <span className="text-rose-800">Reaction: {alg.reaction}</span>
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 font-bold uppercase text-[10px]">
                      {alg.severity}
                    </span>
                  </div>
                  <button
                    onClick={() => removeAllergy(alg.id)}
                    className="text-rose-400 hover:text-rose-800 p-1"
                    title="Remove allergy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <Input
                placeholder="New Allergen (e.g. Latex)"
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
              />
              <Input
                placeholder="Reaction Description"
                value={newReaction}
                onChange={(e) => setNewReaction(e.target.value)}
              />
              <div className="flex gap-2">
                <Select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  options={[
                    { value: "mild", label: "Mild" },
                    { value: "moderate", label: "Moderate" },
                    { value: "severe", label: "Severe" },
                  ]}
                />
                <Button variant="outline" size="sm" onClick={addAllergy}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Daily Medications */}
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Current Active Medications & Supplements
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 mr-2">{med.name}</span>
                    <span className="text-slate-600">{med.dosage} — {med.frequency}</span>
                  </div>
                  <button
                    onClick={() => removeMedication(med.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Remove medicine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <Input
                placeholder="Medicine Name"
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
              />
              <Input
                placeholder="Dosage (e.g. 500mg)"
                value={newMedDose}
                onChange={(e) => setNewMedDose(e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Frequency"
                  value={newMedFreq}
                  onChange={(e) => setNewMedFreq(e.target.value)}
                />
                <Button variant="outline" size="sm" onClick={addMedication}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Existing Diagnoses & Family History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="py-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Existing Medical Diagnoses
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                {conditions.map((cond, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs"
                  >
                    <span className="font-medium text-slate-800">{cond}</span>
                    <button
                      onClick={() => removeCondition(i)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add condition..."
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
                />
                <Button variant="outline" size="sm" onClick={addCondition}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Relevant Family Medical History
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                {familyHistory.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs"
                  >
                    <span className="font-medium text-slate-800">{item}</span>
                    <button
                      onClick={() => removeFamily(i)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Father: Heart Attack at age 61"
                  value={newFamilyItem}
                  onChange={(e) => setNewFamilyItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFamily())}
                />
                <Button variant="outline" size="sm" onClick={addFamily}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 5: Emergency Contact */}
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Emergency Contact Details
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Full Name"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
              />
              <Input
                label="Emergency Phone"
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
              <Input
                label="Relationship"
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleSaveAll}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
