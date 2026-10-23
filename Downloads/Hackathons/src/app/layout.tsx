import type { Metadata } from "next";
import { AppProviders } from "../components/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "SARTHI — Healthcare Companion",
  description: "Simple, trustworthy healthcare platform for nursing services, doctor appointments, medical reports, and prescriptions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-surface-ground text-slate-800 antialiased selection:bg-primary-100 selection:text-primary-900">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
