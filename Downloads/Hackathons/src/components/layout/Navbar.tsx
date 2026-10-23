"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  Heart,
  User,
  HeartHandshake,
  CalendarDays,
  FileText,
  Pill,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../lib/context/AuthContext";
import { useNotifications } from "../../lib/context/NotificationContext";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/nursing")) return "Nursing Services";
    if (pathname.startsWith("/appointments")) return "Doctor Consultations & Appointments";
    if (pathname.startsWith("/reports")) return "Medical Reports";
    if (pathname.startsWith("/prescriptions")) return "Prescriptions";
    if (pathname.startsWith("/notifications")) return "Notifications";
    if (pathname.startsWith("/profile")) return "Health Profile";
    if (pathname.startsWith("/settings")) return "Settings & Privacy";
    return "SARTHI";
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Nursing Services", href: "/nursing", icon: HeartHandshake },
    { name: "Doctor Appointments", href: "/appointments", icon: CalendarDays },
    { name: "Medical Reports", href: "/reports", icon: FileText },
    { name: "Prescriptions", href: "/prescriptions", icon: Pill },
    { name: "Notifications", href: "/notifications", icon: Bell, badge: unreadCount },
    { name: "Health Profile", href: "/profile/health", icon: User },
  ];

  return (
    <header className="h-16 bg-white border-b border-surface-border px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
      {/* Left: Mobile hamburger & Page Title */}
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
            <Heart className="w-4 h-4 fill-primary-600 text-primary-600" />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications Icon Button - Preserved intact */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-xl text-slate-600 hover:text-primary-800 hover:bg-surface-muted transition-colors"
          title="View Notifications"
          aria-label="View Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {/* User Pill */}
        <Link
          href="/profile/health"
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-surface-border hover:border-primary-300 bg-surface-muted/50 transition-colors text-xs font-semibold text-slate-700"
        >
          <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold">
            {user?.fullName?.charAt(0) || "S"}
          </div>
          <span className="hidden sm:inline-block max-w-[120px] truncate">
            {user?.fullName || "Sunita Sharma"}
          </span>
        </Link>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-slate-900/30 backdrop-blur-xs z-50 animate-in fade-in-0 duration-150">
          <div className="bg-white w-72 h-full shadow-xl p-4 flex flex-col justify-between overflow-y-auto">
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary-50 text-primary-900 font-semibold border border-primary-200"
                        : "text-slate-700 hover:bg-surface-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? "text-primary-700" : "text-slate-500"}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-surface-border">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
