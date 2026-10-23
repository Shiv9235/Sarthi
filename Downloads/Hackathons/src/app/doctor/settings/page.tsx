"use client";

import React, { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Smartphone,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { DoctorAppShell } from "../../../components/layout/DoctorAppShell";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";

export default function DoctorSettingsPage() {
  const [notifyAppt, setNotifyAppt] = useState(true);
  const [notifyMedProb, setNotifyMedProb] = useState(true);
  const [notifyPatientAccept, setNotifyPatientAccept] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DoctorAppShell>
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary-700" />
            Clinical Practice Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure clinical notification alerts, urgent patient side-effect channels, and privacy preferences.
          </p>
        </div>
      </div>

      {saved && <Alert type="success">Settings saved successfully.</Alert>}

      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs space-y-6 max-w-3xl">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-surface-border flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary-700" />
          Clinical Notification Preferences
        </h2>

        <div className="space-y-4 text-xs">
          <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-ground border border-surface-border cursor-pointer">
            <input
              type="checkbox"
              checked={notifyMedProb}
              onChange={(e) => setNotifyMedProb(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <strong className="block font-semibold text-slate-900">
                Patient Medication Problem & Side Effect Alerts (High Priority)
              </strong>
              <p className="text-slate-500 mt-0.5">
                Receive instant high-priority alerts whenever an authorized patient reports dizziness, adverse drug reactions, or suspected errors.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-ground border border-surface-border cursor-pointer">
            <input
              type="checkbox"
              checked={notifyPatientAccept}
              onChange={(e) => setNotifyPatientAccept(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <strong className="block font-semibold text-slate-900">
                Patient Recommendation Acceptance / Decline Decisions
              </strong>
              <p className="text-slate-500 mt-0.5">
                Notify when a patient confirms or declines an investigation or specialist referral you ordered.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-ground border border-surface-border cursor-pointer">
            <input
              type="checkbox"
              checked={notifyAppt}
              onChange={(e) => setNotifyAppt(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <strong className="block font-semibold text-slate-900">
                New Consultation Bookings & Schedule Changes
              </strong>
              <p className="text-slate-500 mt-0.5">
                Receive notification when a patient schedules or reschedules an OPD consultation slot.
              </p>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-surface-border flex justify-end">
          <Button onClick={handleSave} size="sm">
            Save Preferences
          </Button>
        </div>
      </div>
    </DoctorAppShell>
  );
}
