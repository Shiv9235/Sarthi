"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HeartHandshake,
  CalendarDays,
  FileText,
  Pill,
  Bell,
  User,
  Settings,
  Heart,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../lib/context/AuthContext";
import { useNotifications } from "../../lib/context/NotificationContext";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Nursing Services",
      href: "/nursing",
      icon: HeartHandshake,
      matchSubpaths: ["/nursing"],
    },
    {
      name: "Doctor Appointments",
      href: "/appointments",
      icon: CalendarDays,
      matchSubpaths: ["/appointments"],
    },
    {
      name: "Medical Reports",
      href: "/reports",
      icon: FileText,
      matchSubpaths: ["/reports"],
    },
    {
      name: "Prescriptions",
      href: "/prescriptions",
      icon: Pill,
      matchSubpaths: ["/prescriptions"],
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  const secondaryItems = [
    {
      name: "Health Profile",
      href: "/profile/health",
      icon: User,
    },
    {
      name: "Settings & Privacy",
      href: "/settings",
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

  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col shrink-0 border-r border-surface-border select-none hidden md:flex h-full shadow-2xs">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-surface-border bg-white">
        <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 border border-primary-200 flex items-center justify-center">
          <Heart className="w-5 h-5 fill-primary-600 text-primary-600" />
        </div>
        <div>
          <span className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            SARTHI
          </span>
          <span className="text-[10px] uppercase font-semibold text-primary-700 tracking-wider block">
            Healthcare Companion
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-primary-50 text-primary-800 border border-primary-200/80 font-semibold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-surface-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? "text-primary-700" : "text-slate-500"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            My Account
          </p>
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary-50 text-primary-800 border border-primary-200/80 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-surface-muted"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-primary-700" : "text-slate-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="p-4 border-t border-surface-border bg-surface-muted/40">
        <div className="flex items-center justify-between">
          <Link
            href="/profile/health"
            className="flex items-center gap-2.5 min-w-0 hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.fullName?.charAt(0) || "S"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                {user?.fullName || "Sunita Sharma"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user?.phone || "+91 98765 43210"}
              </p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
