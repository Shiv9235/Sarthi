"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Pill,
  TestTube,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { DoctorAppShell } from "../../../components/layout/DoctorAppShell";
import { Button } from "../../../components/ui/Button";

interface DoctorNotification {
  id: string;
  title: string;
  message: string;
  type: "medication_alert" | "appointment" | "investigation" | "referral";
  linkUrl: string;
  timestamp: string;
  isRead: boolean;
}

export default function DoctorNotificationsPage() {
  const [notifications, setNotifications] = useState<DoctorNotification[]>([
    {
      id: "doc_notif_1",
      title: "Patient Reported Medication Concern",
      message: "Sunita Sharma reported moderate dizziness with Telma 40 Tablet. Triage response requested.",
      type: "medication_alert",
      linkUrl: "/doctor/medication-problems",
      timestamp: "Today at 09:30 AM",
      isRead: false,
    },
    {
      id: "doc_notif_2",
      title: "Consultation Scheduled",
      message: "Sunita Sharma booked in-person OPD consultation for 26/10/2026 at 10:30 AM.",
      type: "appointment",
      linkUrl: "/doctor/appointments",
      timestamp: "Yesterday at 04:15 PM",
      isRead: false,
    },
    {
      id: "doc_notif_3",
      title: "Investigation Results Available",
      message: "Mahajan Imaging uploaded Digital Chest X-Ray PA View for Sunita Sharma. Ready for clinical sign-off.",
      type: "investigation",
      linkUrl: "/doctor/reports/rep_002",
      timestamp: "3 days ago",
      isRead: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <DoctorAppShell>
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-700" />
            Clinical Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding patient appointments, diagnostic findings, and adverse medication reports.
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={markAllRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              notif.isRead
                ? "bg-white border-surface-border"
                : "bg-primary-50/40 border-primary-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  notif.type === "medication_alert"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-primary-100 text-primary-800"
                }`}
              >
                {notif.type === "medication_alert" ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{notif.title}</h2>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                <span className="text-[11px] text-slate-400 mt-1 block">{notif.timestamp}</span>
              </div>
            </div>

            <Link
              href={notif.linkUrl}
              className="text-xs font-semibold text-primary-800 hover:underline flex items-center gap-1 shrink-0"
            >
              Take Action <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </DoctorAppShell>
  );
}
