"use client";

import React from "react";
import { DoctorSidebar } from "./DoctorSidebar";
import { DoctorNavbar } from "./DoctorNavbar";
import { DemoBanner } from "./DemoBanner";

export function DoctorAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50 text-slate-800">
      {/* Top Demo Mode Banner with Role Switcher */}
      <DemoBanner />

      {/* Core Doctor Layout: DoctorSidebar + Main Area */}
      <div className="flex flex-1 overflow-hidden">
        <DoctorSidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DoctorNavbar />

          {/* Scrollable Clinical Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
