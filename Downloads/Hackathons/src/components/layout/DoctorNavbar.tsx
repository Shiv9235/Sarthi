"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  Stethoscope,
  Search,
  ShieldCheck,
  ShieldAlert,
  CalendarDays,
  FileText,
  Pill,
  Users,
  TestTube,
  Share2,
  AlertTriangle,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../lib/context/AuthContext";

export function DoctorNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { doctorProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getPageTitle = () => {
    if (pathname === "/doctor/dashboard") return "Clinical Dashboard";
    if (pathname.startsWith("/doctor/patients")) return "Authorized Patients";
    if (pathname.startsWith("/doctor/appointments")) return "Consultation Schedule";
    if (pathname.startsWith("/doctor/reports")) return "Report Reviews";
    if (pathname.startsWith("/doctor/prescriptions")) return "Prescription Management";
    if (pathname.startsWith("/doctor/investigations")) return "Diagnostic Orders";
    if (pathname.startsWith("/doctor/referrals")) return "Specialist Referrals";
    if (pathname.startsWith("/doctor/medication-problems")) return "Medication Problem Alerts";
    if (pathname.startsWith("/doctor/verification")) return "Credential Verification";
    if (pathname.startsWith("/doctor/profile")) return "Doctor Profile";
    if (pathname.startsWith("/doctor/settings")) return "Practice Settings";
    if (pathname.startsWith("/doctor/notifications")) return "Doctor Notifications";
    return "SARTHI Clinical Portal";
  };

  const handlePatientSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/doctor/patients?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/doctor/patients");
    }
  };

  const isVerified = doctorProfile?.verificationStatus === "verified";

  const navLinks = [
    { name: "Dashboard", href: "/doctor/dashboard", icon: Stethoscope },
    { name: "Authorized Patients", href: "/doctor/patients", icon: Users },
    { name: "Appointments", href: "/doctor/appointments", icon: CalendarDays },
    { name: "Patient Reports", href: "/doctor/reports", icon: FileText },
    { name: "Prescriptions", href: "/doctor/prescriptions", icon: Pill },
    { name: "Investigations", href: "/doctor/investigations", icon: TestTube },
    { name: "Referrals", href: "/doctor/referrals", icon: Share2 },
    { name: "Medication Issues", href: "/doctor/medication-problems", icon: AlertTriangle },
    { name: "Verification", href: "/doctor/verification", icon: ShieldCheck },
    { name: "Settings", href: "/doctor/settings", icon: Settings },
  ];

  return (
    <header className="h-16 bg-white border-b border-surface-border px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
      {/* Left: Mobile menu toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-surface-muted focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="md:hidden w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-primary-700" />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center: Patient Quick Search */}
      <form onSubmit={handlePatientSearch} className="hidden lg:flex items-center relative max-w-xs w-full">
        <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patient name, ID, or phone..."
          className="w-full text-xs pl-9 pr-3 py-1.5 rounded-full bg-surface-ground border border-surface-border focus:border-primary-500 focus:bg-white focus:outline-none transition-colors"
        />
      </form>

      {/* Right: Verification Pill & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Verification Status */}
        {isVerified ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-800 border border-primary-200">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
            <span>Council Verified</span>
          </span>
        ) : (
          <Link
            href="/doctor/verification"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Verification Pending</span>
          </Link>
        )}

        {/* Doctor Notifications */}
        <Link
          href="/doctor/notifications"
          className="relative p-2 rounded-xl text-slate-600 hover:text-primary-800 hover:bg-surface-muted transition-colors"
          title="Doctor Notifications"
          aria-label="Doctor Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-600 rounded-full ring-2 ring-white" />
        </Link>

        {/* Doctor Pill */}
        <Link
          href="/doctor/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-surface-border hover:border-primary-300 bg-surface-muted/50 transition-colors text-xs font-semibold text-slate-700"
        >
          <div className="w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center text-xs font-bold">
            {doctorProfile?.name?.replace("Dr. ", "")?.charAt(0) || "D"}
          </div>
          <span className="hidden sm:inline-block max-w-[120px] truncate">
            {doctorProfile?.name || "Dr. Arvind Mehta"}
          </span>
        </Link>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-black/30 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full flex flex-col p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Doctor Navigation
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-800"
                >
                  <item.icon className="w-4 h-4 text-primary-700" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-surface-border mt-auto">
              <button
                onClick={logout}
                className="flex items-center gap-2 text-xs font-semibold text-red-600 px-3 py-2 w-full hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
