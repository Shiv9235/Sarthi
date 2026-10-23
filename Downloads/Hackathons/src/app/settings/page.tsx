"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Shield,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Bell,
  Eye,
} from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { StorageService } from "../../lib/data/storage";

export default function SettingsPage() {
  const [dataSharingConsent, setDataSharingConsent] = useState(true);
  const [researchConsent, setResearchConsent] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveConsents = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDemoData = () => {
    if (confirm("Reset all patient data to default seed state?")) {
      StorageService.resetDemoData();
      window.location.reload();
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/dashboard" className="hover:text-primary-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Settings & Privacy</span>
        </div>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
              Security & Compliance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account Settings & Privacy Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Manage your patient consent policies, access controls, and local demo environment.
          </p>
        </div>

        {savedSuccess && (
          <Alert type="success">
            <strong>Settings Updated:</strong> Your privacy preferences and consent settings have been updated.
          </Alert>
        )}

        {/* Privacy & Clinical Consent Card */}
        <Card>
          <CardHeader className="py-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary-700" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Patient Privacy & Data Access Controls
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-surface-border bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  Explicit Doctor Access Permission
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Only allow doctors with confirmed appointments to access your medical reports and health profile. Doctors do not gain broad access merely by joining the platform.
                </p>
              </div>
              <input
                type="checkbox"
                checked={dataSharingConsent}
                onChange={(e) => setDataSharingConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 accent-primary-600 cursor-pointer"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-surface-border bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  De-Identified Clinical Research Participation
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Contribute fully anonymized medical report trends to advance academic public health research. You may opt out anytime.
                </p>
              </div>
              <input
                type="checkbox"
                checked={researchConsent}
                onChange={(e) => setResearchConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 accent-primary-600 cursor-pointer"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-surface-border bg-slate-50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  Two-Factor Authentication (2FA)
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Require one-time verification codes when logging in or opening medical records from an unrecognized browser.
                </p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 accent-primary-600 cursor-pointer"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="primary" size="sm" onClick={handleSaveConsents}>
              Save Consent Preferences
            </Button>
          </CardFooter>
        </Card>

        {/* Demo Mode & Storage Management Card */}
        <Card className="border-amber-200">
          <CardHeader className="py-4 bg-amber-50/40">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
                Demo Mode & Data Reset
              </h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              SARTHI is operating in local demonstration mode. All newly created bookings, uploaded lab reports, and medication reports are persisted in your browser's local storage.
            </p>
            <p className="text-xs text-slate-500">
              To connect real Supabase PostgreSQL persistence and Supabase Auth, add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment file.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetDemoData}
                className="text-amber-900 border-amber-300 hover:bg-amber-50"
                leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-700" />}
              >
                Reset Demo to Initial Seed Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
