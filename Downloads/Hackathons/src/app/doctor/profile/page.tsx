"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Award,
  Hospital,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Save,
  CheckCircle2,
} from "lucide-react";
import { DoctorAppShell } from "../../../components/layout/DoctorAppShell";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Alert } from "../../../components/ui/Alert";
import { useAuth } from "../../../lib/context/AuthContext";
import { StorageService } from "../../../lib/data/storage";

export default function DoctorProfilePage() {
  const router = useRouter();
  const { doctorProfile, updateDoctorProfile } = useAuth();

  const profile = doctorProfile || StorageService.getDoctorProfiles()[0];

  const [name, setName] = useState(profile?.name || "Dr. Arvind Mehta, MD");
  const [email, setEmail] = useState(profile?.email || "arvind.mehta@maxhealthcare.in");
  const [phone, setPhone] = useState(profile?.phone || "+91 98200 11223");
  const [specialty, setSpecialty] = useState(profile?.specialty || "Internal Medicine & Diabetology");
  const [hospitalName, setHospitalName] = useState(profile?.hospitalName || "Max Super Speciality Hospital");
  const [clinicAddress, setClinicAddress] = useState(profile?.clinicAddress || "Press Enclave Road, Saket, New Delhi - 110017");
  const [consultationFee, setConsultationFee] = useState(String(profile?.consultationFee || 800));
  const [teleconsultationFee, setTeleconsultationFee] = useState(String(profile?.teleconsultationFee || 650));
  const [consultationHours, setConsultationHours] = useState(profile?.consultationHours || "10:00 AM - 04:00 PM");
  const [bio, setBio] = useState(profile?.bio || "Senior consultant physician specializing in adult diabetes and metabolic disorders.");

  const [savedMessage, setSavedMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updated = {
      name,
      email,
      phone,
      specialty,
      hospitalName,
      clinicAddress,
      consultationFee: parseInt(consultationFee) || 800,
      teleconsultationFee: parseInt(teleconsultationFee) || 600,
      consultationHours,
      bio,
    };

    updateDoctorProfile(updated);
    setIsLoading(false);
    setSavedMessage("Doctor profile updated successfully.");
    setTimeout(() => setSavedMessage(""), 4000);
  };

  const isVerified = profile?.verificationStatus === "verified";

  return (
    <DoctorAppShell>
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-primary-700" />
            Practitioner Profile & Credentials
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your verified medical registrations, clinic address, OPD timings, and consultation fees.
          </p>
        </div>

        <div>
          {isVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary-100 text-primary-900 border border-primary-200">
              <ShieldCheck className="w-4 h-4 text-primary-700" />
              Verified Council Practitioner
            </span>
          ) : (
            <Link
              href="/doctor/verification"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 hover:underline"
            >
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              Verification Pending (Review)
            </Link>
          )}
        </div>
      </div>

      {savedMessage && <Alert type="success">{savedMessage}</Alert>}

      {/* Council Credential Overview Banner */}
      <div className="bg-surface-ground rounded-2xl border border-surface-border p-5 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 block">State Medical Council:</span>
          <strong className="text-slate-900 text-sm">{profile?.councilName || "Delhi Medical Council"}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Registration Number:</span>
          <strong className="text-slate-900 text-sm font-mono">{profile?.regNumber || "DMC/R/14290"}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Year of Registration:</span>
          <strong className="text-slate-900">{profile?.regYear || 2008}</strong>
        </div>
        <div>
          <span className="text-slate-500 block">Credentials Audit:</span>
          <Link href="/doctor/verification" className="text-primary-800 font-semibold hover:underline">
            Manage Documents & Status →
          </Link>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-surface-border">
            1. Identity & Specialty Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <Input
              label="Doctor Name & Honorific *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Official Email Address *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contact Phone *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input
              label="Primary Specialty *"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
            />
            <Input
              label="Primary Hospital Affiliation *"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              required
            />
          </div>

          <div className="text-xs">
            <Input
              label="Clinic / OPD Address"
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Professional Bio / Overview</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-surface-border">
            2. OPD Timings & Consultation Fees (₹ INR)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <Input
              label="In-Person Consultation Fee (₹) *"
              type="number"
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
              required
            />
            <Input
              label="Teleconsultation Fee (₹) *"
              type="number"
              value={teleconsultationFee}
              onChange={(e) => setTeleconsultationFee(e.target.value)}
              required
            />
            <Input
              label="OPD Consultation Hours *"
              value={consultationHours}
              onChange={(e) => setConsultationHours(e.target.value)}
              placeholder="e.g. 10:00 AM - 04:00 PM"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </DoctorAppShell>
  );
}
