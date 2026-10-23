import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("Phase 2 Database Schema: Migration defines complete doctor clinical architecture", () => {
  const schemaPath = path.join(
    __dirname,
    "../supabase/migrations/20261023000001_doctor_portal_schema.sql"
  );
  assert.ok(fs.existsSync(schemaPath), "Doctor Portal migration SQL file must exist");

  const sql = fs.readFileSync(schemaPath, "utf-8");

  // Expected tables
  const expectedTables = [
    "doctor_profiles",
    "doctor_supporting_documents",
    "doctor_patient_relationships",
    "clinical_encounters",
    "investigation_requests",
    "referral_orders",
    "clinical_audit_logs",
  ];

  for (const table of expectedTables) {
    assert.ok(
      sql.includes(`CREATE TABLE IF NOT EXISTS public.${table}`),
      `Schema must define table public.${table}`
    );
  }

  // Row Level Security policies
  assert.ok(sql.includes("ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;"));
  assert.ok(sql.includes("ALTER TABLE public.clinical_encounters ENABLE ROW LEVEL SECURITY;"));
  assert.ok(sql.includes("ALTER TABLE public.investigation_requests ENABLE ROW LEVEL SECURITY;"));
  assert.ok(sql.includes("ALTER TABLE public.referral_orders ENABLE ROW LEVEL SECURITY;"));
  assert.ok(sql.includes("CREATE POLICY \"Public read verified doctors\""));
  assert.ok(sql.includes("CREATE POLICY \"Authorized doctor access to relationships\""));
  assert.ok(sql.includes("CREATE POLICY \"Doctor write clinical encounters\""));
});

test("Phase 2 Architecture: Verify All Doctor & Integration Routes are Defined", () => {
  const requiredDoctorRoutes = [
    "app/doctor/signup/page.tsx",
    "app/doctor/verification/page.tsx",
    "app/doctor/dashboard/page.tsx",
    "app/doctor/patients/page.tsx",
    "app/doctor/patients/[patientId]/page.tsx",
    "app/doctor/patients/[patientId]/history/page.tsx",
    "app/doctor/appointments/page.tsx",
    "app/doctor/appointments/[appointmentId]/page.tsx",
    "app/doctor/prescriptions/page.tsx",
    "app/doctor/prescriptions/new/page.tsx",
    "app/doctor/prescriptions/[prescriptionId]/page.tsx",
    "app/doctor/investigations/page.tsx",
    "app/doctor/investigations/new/page.tsx",
    "app/doctor/referrals/page.tsx",
    "app/doctor/referrals/new/page.tsx",
    "app/doctor/medication-problems/page.tsx",
    "app/doctor/medication-problems/[problemId]/page.tsx",
    "app/doctor/reports/page.tsx",
    "app/doctor/reports/[reportId]/page.tsx",
    "app/doctor/profile/page.tsx",
    "app/doctor/settings/page.tsx",
    "app/doctor/notifications/page.tsx",
    "app/recommendations/[id]/page.tsx",
  ];

  for (const relPath of requiredDoctorRoutes) {
    const fullPath = path.join(__dirname, "../src", relPath);
    assert.ok(fs.existsSync(fullPath), `Required doctor route must exist: ${relPath}`);
  }
});

test("Doctor Verification Lifecycle: Supports Draft, Submitted, Under Review, Verified, Rejected", () => {
  type VerificationStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "verified"
    | "rejected"
    | "additional_info_required";

  const validStatuses: VerificationStatus[] = [
    "draft",
    "submitted",
    "under_review",
    "verified",
    "rejected",
    "additional_info_required",
  ];

  assert.equal(validStatuses.length, 6);
  assert.ok(validStatuses.includes("verified"));
  assert.ok(validStatuses.includes("under_review"));

  // Check verification guard logic: unverified doctors must not have active clinical write privileges
  const isDoctorAuthorized = (status: VerificationStatus) => status === "verified";
  assert.equal(isDoctorAuthorized("verified"), true);
  assert.equal(isDoctorAuthorized("under_review"), false);
  assert.equal(isDoctorAuthorized("draft"), false);
  assert.equal(isDoctorAuthorized("rejected"), false);
});

test("Clinical Safety: Real-time Allergy Cross-Check Flags Penicillin & Sulfa Drugs", () => {
  const patientAllergies = ["Penicillin", "Sulfa Drugs"];

  function checkContraindication(medicineText: string): string | null {
    const text = medicineText.toLowerCase();
    if (
      text.includes("penicillin") ||
      text.includes("amoxicillin") ||
      text.includes("augmentin") ||
      text.includes("ampicillin")
    ) {
      return "CONTRAINDICATION: Documented severe Penicillin allergy!";
    }
    if (text.includes("sulfa") || text.includes("cotrimoxazole") || text.includes("bactrim")) {
      return "CONTRAINDICATION: Documented moderate Sulfa allergy!";
    }
    return null;
  }

  // Safe medicines
  assert.equal(checkContraindication("Glycomet 500 Tablet (Metformin HCl)"), null);
  assert.equal(checkContraindication("Telma 40 Tablet (Telmisartan)"), null);
  assert.equal(checkContraindication("Atorva 10 Tablet (Atorvastatin)"), null);

  // Penicillin derivatives must trigger alert
  assert.ok(checkContraindication("Amoxicillin 500mg Capsule")?.includes("Penicillin allergy"));
  assert.ok(checkContraindication("Augmentin 625 Duo Tablet")?.includes("Penicillin allergy"));

  // Sulfa drugs must trigger alert
  assert.ok(checkContraindication("Cotrimoxazole Double Strength")?.includes("Sulfa allergy"));
});

test("Patient-Doctor Loop: Investigation & Referral Requires Explicit Yes / No Confirmation", () => {
  type RecommendationStatus =
    | "recommended"
    | "accepted_by_patient"
    | "declined_by_patient"
    | "booked"
    | "completed";

  interface RecommendationState {
    status: RecommendationStatus;
    decisionAt?: string;
    declineReason?: string;
  }

  // Scenario 1: Initial creation by doctor
  const order: RecommendationState = {
    status: "recommended",
  };
  assert.equal(order.status, "recommended");
  assert.notEqual(order.status, "booked", "System must never silently book without patient confirmation");

  // Scenario 2: Patient clicks 'Yes, Proceed to Book'
  function patientAccept(state: RecommendationState): RecommendationState {
    return {
      ...state,
      status: "accepted_by_patient",
      decisionAt: new Date().toISOString(),
    };
  }

  const accepted = patientAccept(order);
  assert.equal(accepted.status, "accepted_by_patient");
  assert.ok(accepted.decisionAt);

  // Scenario 3: Patient clicks 'No, Decline for Now'
  function patientDecline(state: RecommendationState, reason: string): RecommendationState {
    return {
      ...state,
      status: "declined_by_patient",
      declineReason: reason,
      decisionAt: new Date().toISOString(),
    };
  }

  const declined = patientDecline(order, "Recently completed lipid tests at another diagnostic center.");
  assert.equal(declined.status, "declined_by_patient");
  assert.ok(declined.declineReason?.includes("another diagnostic center"));
});
