import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("Database Schema: Migration file exists and defines comprehensive schema", () => {
  const schemaPath = path.join(__dirname, "../supabase/migrations/20261023000000_care_platform_schema.sql");
  assert.ok(fs.existsSync(schemaPath), "Migration SQL file must exist");

  const sqlContent = fs.readFileSync(schemaPath, "utf-8");

  // Verify core tables
  const expectedTables = [
    "profiles",
    "patient_medical_histories",
    "patient_allergies",
    "patient_medications",
    "caregivers",
    "nursing_bookings",
    "doctors",
    "appointment_bookings",
    "medical_reports",
    "medical_report_measurements",
    "prescriptions",
    "prescription_items",
    "pharmacy_products",
    "medication_problems",
    "notifications",
    "audit_logs",
  ];

  for (const table of expectedTables) {
    assert.ok(
      sqlContent.includes(`CREATE TABLE IF NOT EXISTS public.${table}`),
      `Schema must define table public.${table}`
    );
  }

  // Verify Row Level Security (RLS) policies
  assert.ok(sqlContent.includes("ENABLE ROW LEVEL SECURITY;"), "RLS must be enabled");
  assert.ok(sqlContent.includes("CREATE POLICY \"Users can manage own profile\""), "Profile RLS policy required");
  assert.ok(sqlContent.includes("CREATE POLICY \"Patients own reports\""), "Reports RLS policy required");
  assert.ok(sqlContent.includes("CREATE POLICY \"Patients own prescriptions\""), "Prescriptions RLS policy required");
});

test("Architecture: Verify All Routes are Defined in Codebase", () => {
  const requiredAppRoutes = [
    "app/page.tsx",
    "app/login/page.tsx",
    "app/signup/page.tsx",
    "app/forgot-password/page.tsx",
    "app/onboarding/health-profile/page.tsx",
    "app/dashboard/page.tsx",
    "app/profile/health/page.tsx",
    "app/nursing/page.tsx",
    "app/nursing/[id]/page.tsx",
    "app/nursing/book/[id]/page.tsx",
    "app/nursing/history/page.tsx",
    "app/appointments/page.tsx",
    "app/appointments/symptoms/page.tsx",
    "app/appointments/results/page.tsx",
    "app/appointments/doctor/[id]/page.tsx",
    "app/appointments/book/[id]/page.tsx",
    "app/appointments/confirmation/page.tsx",
    "app/appointments/history/page.tsx",
    "app/reports/page.tsx",
    "app/reports/upload/page.tsx",
    "app/reports/doctor-reports/page.tsx",
    "app/reports/compare/page.tsx",
    "app/reports/[id]/page.tsx",
    "app/prescriptions/page.tsx",
    "app/prescriptions/upload/page.tsx",
    "app/prescriptions/latest/page.tsx",
    "app/prescriptions/report-problem/page.tsx",
    "app/prescriptions/compare-medicines/page.tsx",
    "app/notifications/page.tsx",
    "app/settings/page.tsx",
  ];

  for (const relPath of requiredAppRoutes) {
    const fullPath = path.join(__dirname, "../src", relPath);
    assert.ok(fs.existsSync(fullPath), `Required route file must exist: ${relPath}`);
  }
});
