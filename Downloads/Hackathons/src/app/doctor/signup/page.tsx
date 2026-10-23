"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Mail,
  Lock,
  User,
  Phone,
  Hospital,
  Award,
  FileCheck,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Alert } from "../../../components/ui/Alert";
import { useAuth } from "../../../lib/context/AuthContext";

export default function DoctorSignupPage() {
  const router = useRouter();
  const { signupDoctor } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("Internal Medicine");
  const [regNumber, setRegNumber] = useState("");
  const [councilName, setCouncilName] = useState("Delhi Medical Council");
  const [regYear, setRegYear] = useState("2016");
  const [education, setEducation] = useState("MBBS, MD (Medicine)");
  const [experienceYears, setExperienceYears] = useState("10");
  const [hospitalName, setHospitalName] = useState("Apollo Hospital");
  const [clinicAddress, setClinicAddress] = useState("Sarita Vihar, New Delhi - 110076");
  const [consultationFee, setConsultationFee] = useState("800");
  const [teleconsultationFee, setTeleconsultationFee] = useState("650");
  const [bio, setBio] = useState("");
  const [docUploaded, setDocUploaded] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !regNumber || !councilName) {
      setError("Please complete all required fields including Medical Council registration.");
      return;
    }

    setIsLoading(true);
    try {
      await signupDoctor({
        name: fullName.startsWith("Dr.") ? fullName : `Dr. ${fullName}`,
        email,
        phone,
        specialty,
        subspecialties: [specialty],
        regNumber,
        councilName,
        regYear: parseInt(regYear) || 2016,
        education: education.split(",").map((s) => s.trim()),
        experienceYears: parseInt(experienceYears) || 5,
        hospitalName,
        clinicAddress,
        consultationFee: parseInt(consultationFee) || 800,
        teleconsultationFee: parseInt(teleconsultationFee) || 600,
        bio: bio || "Senior consultant practitioner.",
        languages: ["Hindi", "English"],
        supportingDocs: docUploaded
          ? [
              {
                id: `doc_up_${Date.now()}`,
                name: "Medical_Registration_Certificate.pdf",
                type: "council_registration",
                fileUrl: "/docs/sample_reg.pdf",
                uploadedAt: new Date().toISOString(),
                size: "2.1 MB",
              },
            ]
          : [],
      });
      router.push("/doctor/verification");
    } catch {
      setError("Registration failed. Please check your information and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-ground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 border border-primary-200 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-700" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">SARTHI</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Doctor & Practitioner Registration
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Join the verified healthcare professional network. All practitioner credentials are
            cross-verified against official State Medical Councils.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-xs">
          {error && <Alert type="error" className="mb-6">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal & Account */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary-700" />
                1. Practitioner Identity & Contact
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name (with Title)"
                  placeholder="e.g. Dr. Ramesh Gupta"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Official Email Address"
                  type="email"
                  placeholder="dr.ramesh@hospital.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Mobile Contact Number"
                  placeholder="+91 98765 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4" />}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Medical Specialty *
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-300 focus:border-primary-500 focus:outline-none"
                    required
                  >
                    <option value="Internal Medicine & Diabetology">Internal Medicine & Diabetology</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Orthopedics & Joint Care">Orthopedics & Joint Care</option>
                    <option value="Pulmonology">Pulmonology & Chest Medicine</option>
                    <option value="Pediatrics">Pediatrics & Child Care</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Medical Council Verification */}
            <div className="pt-4 border-t border-surface-border">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary-700" />
                2. Medical Council Credentials
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Registering State Medical Council *
                  </label>
                  <select
                    value={councilName}
                    onChange={(e) => setCouncilName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-slate-300 focus:border-primary-500 focus:outline-none"
                    required
                  >
                    <option value="Delhi Medical Council">Delhi Medical Council (DMC)</option>
                    <option value="Maharashtra Medical Council">Maharashtra Medical Council (MMC)</option>
                    <option value="Karnataka Medical Council">Karnataka Medical Council (KMC)</option>
                    <option value="Tamil Nadu Medical Council">Tamil Nadu Medical Council (TNMC)</option>
                    <option value="Medical Council of India / NMC">National Medical Commission (NMC)</option>
                  </select>
                </div>
                <div>
                  <Input
                    label="Registration Number *"
                    placeholder="e.g. DMC/R/14290"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Year of Registration *"
                    type="number"
                    placeholder="2016"
                    value={regYear}
                    onChange={(e) => setRegYear(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Degrees & Qualifications *"
                    placeholder="e.g. MBBS, MD (Medicine)"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Experience (Years) *"
                    type="number"
                    placeholder="10"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Affiliation & Practice */}
            <div className="pt-4 border-t border-surface-border">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Hospital className="w-4 h-4 text-primary-700" />
                3. Hospital Affiliation & Consultation Fees
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Primary Hospital / Clinic Name *"
                  placeholder="e.g. Max Super Speciality Hospital"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  required
                />
                <Input
                  label="Clinic / OPD Address"
                  placeholder="e.g. Saket, New Delhi"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                />
                <Input
                  label="In-Person Consultation Fee (₹) *"
                  type="number"
                  placeholder="800"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  required
                />
                <Input
                  label="Teleconsultation Fee (₹) *"
                  type="number"
                  placeholder="650"
                  value={teleconsultationFee}
                  onChange={(e) => setTeleconsultationFee(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Step 4: Supporting Document Upload */}
            <div className="pt-4 border-t border-surface-border">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-primary-700" />
                4. Credential Proof Upload
              </h2>
              <div className="border-2 border-dashed border-primary-200 bg-primary-50/40 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">
                  State Medical Council Registration Certificate Attached
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sample document attached automatically for simulation testing (PDF, 2.1 MB)
                </p>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Credentials for Verification
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already registered?{" "}
          <Link href="/login" className="text-primary-700 font-semibold hover:underline">
            Sign in to your doctor account
          </Link>
        </p>
      </div>
    </div>
  );
}
