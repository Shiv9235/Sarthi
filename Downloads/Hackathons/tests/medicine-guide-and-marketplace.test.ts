import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { MedicineGuideService } from "../src/lib/services/medicine-guide-service.ts";
import { HomeCareMatchingService } from "../src/lib/services/home-care-matching-service.ts";
import { MEDICINE_CATALOGUE } from "../src/lib/data/medicine-catalogue.ts";
import { SAARTHEE_HOME_CARE_CATEGORIES, SAARTHEE_PROVIDERS } from "../src/lib/data/home-care-data.ts";
import type { HomeCareIntakeResponse, AllergyItem } from "../src/lib/types/index.ts";

// =========================================================================
// PART A: MEDICINE GUIDE & ACTIVE-INGREDIENT FINDER TESTS
// =========================================================================

test("Medicine Guide: Search by brand name finds exact and partial matches", () => {
  const glycometResults = MedicineGuideService.searchMedicines("Glycomet");
  assert.ok(glycometResults.length >= 2, "Should find at least Glycomet 500 and Glycomet SR 500");
  assert.ok(glycometResults.some((m) => m.id === "med_glycomet_500"));

  const telmaResults = MedicineGuideService.searchMedicines("Telma");
  assert.ok(telmaResults.length >= 2, "Should find Telma 40 and Telma 20");
});

test("Medicine Guide: Search by active ingredient (salt) name finds all containing brands", () => {
  const metforminResults = MedicineGuideService.searchMedicines("Metformin");
  assert.ok(metforminResults.length >= 3, "Should find Glycomet 500, Metfor 500, and Jan Aushadhi Metformin");
  assert.ok(metforminResults.every((m) =>
    m.activeIngredients.some((i) => i.name.toLowerCase().includes("metformin"))
  ));

  const amoxicillinResults = MedicineGuideService.searchMedicines("Amoxicillin");
  assert.ok(amoxicillinResults.length >= 2, "Should find Augmentin and Clavam");
});

test("Medicine Guide: Search by barcode and manufacturer works accurately", () => {
  const barcodeResults = MedicineGuideService.searchMedicines("8901117001423");
  assert.equal(barcodeResults.length, 1);
  assert.equal(barcodeResults[0].id, "med_glycomet_500");

  const gskResults = MedicineGuideService.searchMedicines("GlaxoSmithKline");
  assert.ok(gskResults.length >= 1);
  assert.ok(gskResults[0].brandName.includes("Augmentin 625 Duo"));
});

test("Medicine Guide: Photograph OCR simulation extracts text and mandates patient confirmation", () => {
  const ocrResult = MedicineGuideService.identifyMedicineFromImage({
    fileName: "augmentin_strip.jpg",
  });

  assert.ok(ocrResult.confidence >= 90, "Confidence should be high for clear text");
  assert.ok(ocrResult.extractedText.includes("AUGMENTIN"));
  assert.ok(ocrResult.candidateMatches.length > 0);
  assert.equal(ocrResult.candidateMatches[0].medicine.id, "med_augmentin_625");
  // Prompt rule: never assume OCR guess as confirmed identity without user confirmation
  assert.equal(ocrResult.requiresUserConfirmation, true);
});

test("Medicine Guide: Same-salt comparison properly categorizes into 3 distinct clinical groups", () => {
  const comparison = MedicineGuideService.getSameSaltComparisons("med_glycomet_500");
  assert.ok(comparison !== null);

  // Group 1: Exact matches (Same salt, same 500mg, immediate release)
  const exactNames = comparison.exactMatches.map((m) => m.brandName);
  assert.ok(exactNames.some((n) => n.includes("Metfor 500")), "Metfor 500 should be an exact match");
  assert.ok(exactNames.some((n) => n.includes("Jan Aushadhi Metformin")), "Jan Aushadhi should be an exact match");

  // Group 2: Different strengths / formulations (SR Sustained Release or different dosage)
  const differentNames = comparison.differentStrengths.map((m) => m.brandName);
  assert.ok(differentNames.some((n) => n.includes("Glycomet-SR")), "SR release formulation belongs in Group 2");

  // Verify Telmisartan grouping
  const telmaComp = MedicineGuideService.getSameSaltComparisons("med_telma_40");
  assert.ok(telmaComp !== null);
  assert.ok(telmaComp.exactMatches.some((m) => m.brandName.includes("Telpres 40")));
  assert.ok(telmaComp.differentStrengths.some((m) => m.brandName.includes("Telma 20")));
});

test("Medicine Guide: Allergy cross-check flags critical contraindication on Penicillin allergy", () => {
  const augmentin = MedicineGuideService.getMedicineById("med_augmentin_625")!;
  const glycomet = MedicineGuideService.getMedicineById("med_glycomet_500")!;

  const patientAllergies: AllergyItem[] = [
    {
      id: "alg_1",
      allergen: "Penicillin",
      reaction: "Severe hives and facial swelling (anaphylaxis risk)",
      severity: "severe",
      recordedAt: "2026-01-10",
    },
  ];

  // Augmentin contains Amoxicillin (aminopenicillin) -> should trigger alert!
  const alertAugmentin = MedicineGuideService.checkPatientAllergyInteraction(augmentin, patientAllergies);
  assert.equal(alertAugmentin.hasContraindication, true);
  assert.equal(alertAugmentin.allergenMatched, "Penicillin");
  assert.match(alertAugmentin.warningMessage!, /CRITICAL ALLERGY ALERT/);

  // Glycomet contains Metformin (not a penicillin) -> should NOT trigger allergy alert
  const alertGlycomet = MedicineGuideService.checkPatientAllergyInteraction(glycomet, patientAllergies);
  assert.equal(alertGlycomet.hasContraindication, false);
});

// =========================================================================
// PART B: SAARTHEE HOME-CARE & NURSING MARKETPLACE TESTS
// =========================================================================

test("Home-Care Marketplace: All 9 Encone-Care inspired categories are defined and active", () => {
  const categories = HomeCareMatchingService.getCategories();
  assert.equal(categories.length, 9, "Must have exactly the 9 categories from the Encone Care design");

  const expectedIds = [
    "nursing_staff",
    "patient_attendants",
    "elder_care",
    "baby_care",
    "specialized_care",
    "post_operative_care",
    "physiotherapy",
    "sleep_study",
    "injection_visit",
  ];

  for (const expectedId of expectedIds) {
    const found = categories.find((c) => c.id === expectedId);
    assert.ok(found, `Category ${expectedId} must exist`);
    assert.ok(found.startingRate > 0, `Category ${expectedId} must have a positive starting rate`);
    assert.ok(found.qualificationRequirements.length > 0, `Category ${expectedId} must specify qualification requirements`);
  }
});

test("Home-Care Marketplace: Emergency symptom screening catches acute medical red-flags", () => {
  const acuteCardiac = HomeCareMatchingService.screenForEmergency(
    "Patient having crushing chest pain radiating to left arm and sweating"
  );
  assert.equal(acuteCardiac.isEmergency, true);
  assert.match(acuteCardiac.emergencyAdvice!, /112/);

  const acuteRespiratory = HomeCareMatchingService.screenForEmergency(
    "Severe breathlessness, cannot breathe, turning blue"
  );
  assert.equal(acuteRespiratory.isEmergency, true);

  const nonEmergency = HomeCareMatchingService.screenForEmergency(
    "Need daily sponge bath and help with walking for elderly parent"
  );
  assert.equal(nonEmergency.isEmergency, false);
});

test("Home-Care Marketplace: Matching engine enforces provider qualifications & separates attendants from nurses", () => {
  // Test 1: Surgical wound care & IV infusions strictly requires licensed staff nurse (B.Sc / GNM)
  const surgicalIntake: HomeCareIntakeResponse = {
    id: "intake_test_1",
    patientId: "p_test",
    naturalLanguageNeed: "Post-operative surgical wound dressing and IV antibiotic administration",
    primaryConcern: "Post-op wound care",
    careRecipient: "parent",
    recipientAge: 65,
    startDate: "2026-10-25",
    urgency: "within_48hrs",
    bookingFormat: "several_days",
    shiftDuration: "12hr_day",
    locationCity: "Delhi NCR",
    postalCode: "110091",
    address: "Mayur Vihar Phase 1",
    patientMobility: "needs_assistance",
    clinicalEquipmentNeeded: ["wound_dressing", "iv_infusion"],
    budgetMaxPerShift: 3500,
    preferredGender: "female",
    preferredLanguages: ["Hindi"],
    physicianInstructionsProvided: true,
    emergencyFlagsDetected: false,
    createdAt: new Date().toISOString(),
  };

  const surgicalRec = HomeCareMatchingService.assessAndMatch(surgicalIntake);
  assert.equal(surgicalRec.recommendedCategoryId, "post_operative_care");
  assert.ok(surgicalRec.eligibleProviders.length > 0);

  // Strict check: No trained attendants (GDA) can be matched for sterile wound care or IV infusions
  const hasAttendant = surgicalRec.eligibleProviders.some(
    (m) => m.provider.providerTier === "trained_attendant"
  );
  assert.equal(hasAttendant, false, "Attendants must never be matched for sterile surgical procedures or IV infusions");

  // Test 2: General hygiene and sponge bath correctly matches trained patient attendants
  const hygieneIntake: HomeCareIntakeResponse = {
    ...surgicalIntake,
    id: "intake_test_2",
    naturalLanguageNeed: "Bedridden patient needing daily sponge bath, bed linen changing, and feeding assistance",
    primaryConcern: "Daily living assistance and hygiene",
    clinicalEquipmentNeeded: [],
  };

  const hygieneRec = HomeCareMatchingService.assessAndMatch(hygieneIntake);
  assert.equal(hygieneRec.recommendedCategoryId, "patient_attendants");
  assert.ok(hygieneRec.eligibleProviders.some((m) => m.provider.providerTier === "trained_attendant"));
});

test("Home-Care Marketplace: Physiotherapy intake correctly routes to certified BPT/MPT therapist", () => {
  const physioIntake: HomeCareIntakeResponse = {
    id: "intake_physio",
    patientId: "p_test",
    naturalLanguageNeed: "Mother needs physiotherapy exercises for knee joint stiffness and gait balance recovery",
    primaryConcern: "Physiotherapy rehab",
    careRecipient: "parent",
    recipientAge: 68,
    startDate: "2026-10-25",
    urgency: "within_48hrs",
    bookingFormat: "several_days",
    shiftDuration: "short_visit",
    locationCity: "Delhi NCR",
    postalCode: "110017",
    address: "Saket, South Delhi",
    patientMobility: "needs_assistance",
    clinicalEquipmentNeeded: [],
    budgetMaxPerShift: 2000,
    preferredGender: "any",
    preferredLanguages: ["Hindi", "English"],
    physicianInstructionsProvided: true,
    emergencyFlagsDetected: false,
    createdAt: new Date().toISOString(),
  };

  const rec = HomeCareMatchingService.assessAndMatch(physioIntake);
  assert.equal(rec.recommendedCategoryId, "physiotherapy");
  assert.ok(rec.eligibleProviders.some((m) => m.provider.providerTier === "physiotherapist"));
  assert.equal(rec.eligibleProviders[0].provider.name, "Dr. Alok Verma, BPT, MPT");
});

test("Database Schema: Migration file defines tables for medicine catalogue and home care marketplace", () => {
  const migrationPath = path.join(
    process.cwd(),
    "supabase/migrations/20261024000000_medicine_guide_and_marketplace.sql"
  );
  assert.ok(fs.existsSync(migrationPath), "Migration file must exist on disk");

  const sqlContent = fs.readFileSync(migrationPath, "utf-8");
  assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.medicine_catalogue"));
  assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.medicine_active_ingredients"));
  assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.home_care_service_categories"));
  assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.saarthee_providers"));
  assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.home_care_intakes"));
  assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.saarthee_home_care_bookings"));
});
