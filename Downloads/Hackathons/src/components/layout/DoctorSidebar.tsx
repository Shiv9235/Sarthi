"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Pill,
  TestTube,
  Share2,
  AlertTriangle,
  Bell,
  Stethoscope,
  Settings,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  Hospital,
} from "lucide-react";
import { useAuth } from "../../lib/context/AuthContext";
import { StorageService } from "../../lib/data/storage";

export function DoctorSidebar() {
  const pathname = usePathname();
  const { doctorProfile, logout } = useAuth();

  // Dynamic counts for alerts
  const medProblemsCount = typeof window !== "undefined"
    ? StorageService.getMedicationProblems().filter((p) => p.status === "submitted").length
    : 1;

  const pendingReportsCount = typeof window !== "undefined"
    ? StorageService.getReports().filter((r) => r.status === "doctor_shared").length
    : 1;

  const navigationItems = [
    {
      name: "Doctor Dashboard",
      href: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Authorized Patients",
      href: "/doctor/patients",
      icon: Users,
      matchSubpaths: ["/doctor/patients"],
    },
    {
      name: "Appointments",
      href: "/doctor/appointments",
      icon: CalendarDays,
      matchSubpaths: ["/doctor/appointments"],
    },
    {
      name: "Patient Reports",
      href: "/doctor/reports",
      icon: FileText,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
      badgeType: "primary" as const,
      matchSubpaths: ["/doctor/reports"],
    },
    {
      name: "Prescriptions",
      href: "/doctor/prescriptions",
      icon: Pill,
      matchSubpaths: ["/doctor/prescriptions"],
    },
    {
      name: "Investigations",
      href: "/doctor/investigations",
      icon: TestTube,
      matchSubpaths: ["/doctor/investigations"],
    },
    {
      name: "Referrals",
      href: "/doctor/referrals",
      icon: Share2,
      matchSubpaths: ["/doctor/referrals"],
    },
    {
      name: "Medication Issues",
      href: "/doctor/medication-problems",
      icon: AlertTriangle,
      badge: medProblemsCount > 0 ? medProblemsCount : undefined,
      badgeType: "warning" as const,
      matchSubpaths: ["/doctor/medication-problems"],
    },
    {
      name: "Notifications",
      href: "/doctor/notifications",
      icon: Bell,
    },
  ];

  const secondaryItems = [
    {
      name: "Profile & Verification",
      href: "/doctor/profile",
      icon: Stethoscope,
      matchSubpaths: ["/doctor/profile", "/doctor/verification"],
    },
    {
      name: "Practice Settings",
      href: "/doctor/settings",
      icon: Settings,
    },
  ];

  const isActive = (item: (typeof navigationItems)[0]) => {
    if (pathname === item.href) return true;
    if (item.matchSubpaths) {
      return item.matchSubpaths.some((sub) => pathname.startsWith(sub));
    }
    return false;
  };

  const isVerified = doctorProfile?.verificationStatus === "verified";

  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col shrink-0 border-r border-surface-border select-none hidden md:flex h-full shadow-2xs">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-surface-border bg-white">
        <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 border border-primary-200 flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-primary-700" />
        </div>
        <div>
          <span className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            SARTHI
          </span>
          <span className="text-[10px] uppercase font-semibold text-primary-700 tracking-wider block">
            Clinical Portal
          </span>
        </div>
      </div>

      {/* Doctor Status Banner */}
      <div className="p-3 mx-3 my-3 rounded-xl bg-surface-ground border border-surface-border">
        <div className="flex items-center gap-2 mb-1">
          {isVerified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-800 bg-primary-100/70 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-700" />
              Verified Practitioner
            </span>
          ) : (
            <Link
              href="/doctor/verification"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md hover:underline"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              Verification Needed
            </Link>
          )}
        </div>
        <p className="text-xs font-bold text-slate-900 truncate">
          {doctorProfile?.name || "Dr. Arvind Mehta"}
        </p>
        <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
          <Hospital className="w-3 h-3 text-slate-400" />
          {doctorProfile?.hospitalName || "Max Super Speciality"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto" aria-label="Doctor Sidebar Navigation">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Clinical Operations
        </p>
        {navigationItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? "bg-primary-50 text-primary-800 border border-primary-200/70 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-surface-muted"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? "text-primary-700" : "text-slate-400"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.badgeType === "warning"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-primary-100 text-primary-800"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 mt-2 border-t border-surface-border">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Practice Management
          </p>
          {secondaryItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-primary-50 text-primary-800 border border-primary-200/70 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-surface-muted"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? "text-primary-700" : "text-slate-400"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-surface-border bg-surface-ground flex items-center justify-between">
        <Link
          href="/doctor/profile"
          className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-80"
        >
          <div className="w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {doctorProfile?.name?.replace("Dr. ", "")?.charAt(0) || "D"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {doctorProfile?.name || "Dr. Arvind Mehta"}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {doctorProfile?.regNumber || "Reg #14290"}
            </p>
          </div>
        </Link>
        <button
          onClick={logout}
          title="Sign Out"
          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
