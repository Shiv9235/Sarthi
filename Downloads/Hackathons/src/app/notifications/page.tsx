"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  CalendarDays,
  HeartHandshake,
  FileText,
  Pill,
  AlertTriangle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { useNotifications } from "../../lib/context/NotificationContext";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "doctor_recommendation":
        return <FileText className="w-5 h-5 text-primary-700" />;
      case "referral":
        return <HeartHandshake className="w-5 h-5 text-primary-700" />;
      case "appointment":
        return <CalendarDays className="w-5 h-5 text-cyan-600" />;
      case "nursing":
        return <HeartHandshake className="w-5 h-5 text-teal-600" />;
      case "report":
        return <FileText className="w-5 h-5 text-emerald-600" />;
      case "prescription":
        return <Pill className="w-5 h-5 text-purple-600" />;
      case "medication_problem":
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                Activity Stream
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                {unreadCount} Unread Notifications
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Patient Notification Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Live updates on appointments, nursing dispatches, doctor-approved lab reports, and medication updates.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              leftIcon={<CheckCheck className="w-4 h-4 text-teal-600" />}
            >
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No Notifications Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When a doctor confirms an appointment, a nurse is scheduled, or a report is reviewed, notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                  notif.isRead
                    ? "bg-white border-slate-200 opacity-80"
                    : "bg-teal-50/40 border-teal-200 shadow-2xs"
                }`}
              >
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-sm ${
                        notif.isRead ? "font-semibold text-slate-800" : "font-extrabold text-slate-950"
                      }`}
                    >
                      {notif.title}
                    </h3>

                    <div className="flex items-center gap-2 shrink-0">
                      {notif.isDemo && (
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                          Simulated Event
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.linkUrl && (
                    <div className="mt-2.5">
                      <Link
                        href={notif.linkUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900"
                      >
                        <span>View Related Record</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
