"use client";

import React from "react";
import { AuthProvider } from "../../lib/context/AuthContext";
import { NotificationProvider } from "../../lib/context/NotificationContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </AuthProvider>
  );
}
