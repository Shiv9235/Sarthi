"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Mail, Lock, ArrowRight, UserCheck, Stethoscope, ShieldAlert, Award } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Alert } from "../../components/ui/Alert";
import { useAuth } from "../../lib/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsPatient, loginAsDoctor, login } = useAuth();
  const [activeTab, setActiveTab] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("sunita.sharma@example.in");
  const [password, setPassword] = useState("••••••••••••");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTabSwitch = (tab: "patient" | "doctor") => {
    setActiveTab(tab);
    setError("");
    if (tab === "patient") {
      setEmail("sunita.sharma@example.in");
    } else {
      setEmail("arvind.mehta@maxhealthcare.in");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please provide your email address or mobile number.");
      return;
    }
    setIsLoading(true);
    try {
      if (activeTab === "doctor") {
        if (email.includes("neha.kapoor")) {
          await loginAsDoctor("doc_unverified");
          router.push("/doctor/verification");
        } else {
          await loginAsDoctor("doc_1");
          router.push("/doctor/dashboard");
        }
      } else {
        await login(email, password, "patient");
        router.push("/dashboard");
      }
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientQuick = async () => {
    setIsLoading(true);
    try {
      await loginAsPatient();
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorVerifiedQuick = async () => {
    setIsLoading(true);
    try {
      await loginAsDoctor("doc_1");
      router.push("/doctor/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorPendingQuick = async () => {
    setIsLoading(true);
    try {
      await loginAsDoctor("doc_unverified");
      router.push("/doctor/verification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-ground flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 border border-primary-200 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-primary-600 text-primary-600" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">SARTHI</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">
          Sign In to Healthcare Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Select your portal role to continue
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 shadow-xs sm:rounded-2xl sm:px-10 border border-surface-border">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 p-1 bg-surface-ground rounded-xl mb-6 border border-surface-border">
            <button
              type="button"
              onClick={() => handleTabSwitch("patient")}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === "patient"
                  ? "bg-white text-primary-800 shadow-xs border border-primary-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-primary-600" />
              Patient Portal
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("doctor")}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === "doctor"
                  ? "bg-white text-primary-800 shadow-xs border border-primary-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-primary-600" />
              Doctor Portal
            </button>
          </div>

          {error && (
            <Alert type="error" className="mb-5">
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label={activeTab === "doctor" ? "Doctor Email / Council ID" : "Email Address or Mobile Number"}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === "doctor" ? "doctor@hospital.in or DMC number" : "e.g. 9876543210"}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="font-medium text-primary-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {activeTab === "doctor" ? "Sign In as Doctor" : "Sign In as Patient"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold">
                  Demo Fast Sign-In
                </span>
              </div>
            </div>

            {activeTab === "patient" ? (
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold text-slate-700"
                  onClick={handlePatientQuick}
                  disabled={isLoading}
                  leftIcon={<UserCheck className="w-4 h-4 text-primary-600" />}
                >
                  Sign In as Sunita Sharma (Patient)
                </Button>
                <p className="text-center text-xs text-slate-500 mt-2">
                  New to SARTHI?{" "}
                  <Link href="/signup" className="text-primary-700 font-medium hover:underline">
                    Create patient account
                  </Link>
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold text-slate-800 border-primary-200 bg-primary-50/40 hover:bg-primary-50"
                  onClick={handleDoctorVerifiedQuick}
                  disabled={isLoading}
                  leftIcon={<Award className="w-4 h-4 text-primary-700" />}
                >
                  Dr. Arvind Mehta (Verified Doctor)
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold text-amber-900 border-amber-200 bg-amber-50/40 hover:bg-amber-50"
                  onClick={handleDoctorPendingQuick}
                  disabled={isLoading}
                  leftIcon={<ShieldAlert className="w-4 h-4 text-amber-600" />}
                >
                  Dr. Neha Kapoor (Verification Pending)
                </Button>
                <p className="text-center text-xs text-slate-500 mt-2">
                  New Medical Practitioner?{" "}
                  <Link href="/doctor/signup" className="text-primary-700 font-medium hover:underline">
                    Register Doctor Account
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
