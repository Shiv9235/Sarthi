import test from "node:test";
import assert from "node:assert/strict";
import { screenForEmergency, matchSpecialtiesFromSymptoms } from "../src/lib/ai/symptom-triage.ts";
import { generateReportExplanation } from "../src/lib/ai/report-explainer.ts";
import { OcrAdapter } from "../src/lib/ai/ocr-adapter.ts";

test("Emergency Screening: Flags chest pain as potential acute emergency", () => {
  const result = screenForEmergency("I have crushing chest pain radiating to left arm", []);
  assert.equal(result.isEmergency, true);
  assert.ok(result.warningSigns.length > 0);
  assert.match(result.recommendation, /EMERGENCY WARNING/);
});

test("Emergency Screening: Passes benign non-emergency symptoms", () => {
  const result = screenForEmergency("Mild knee pain after jogging for 2 days", ["knee pain"]);
  assert.equal(result.isEmergency, false);
  assert.equal(result.warningSigns.length, 0);
});

test("Specialty Matching: Correctly maps cardiac symptoms to Cardiology", () => {
  const result = matchSpecialtiesFromSymptoms("High blood pressure and palpitations", []);
  assert.ok(result.specialties.includes("Cardiology"));
  assert.ok(result.reasoning.length > 0);
});

test("Specialty Matching: Correctly maps musculoskeletal pain to Orthopedics", () => {
  const result = matchSpecialtiesFromSymptoms("Severe knee joint pain and back pain", []);
  assert.ok(result.specialties.includes("Orthopedics & Joint Surgery"));
});

test("Specialty Matching: Correctly maps respiratory symptoms to Pulmonology", () => {
  const result = matchSpecialtiesFromSymptoms("Persistent dry cough and wheezing for a week", []);
  assert.ok(result.specialties.includes("Pulmonology & Respiratory Medicine"));
});

test("Report Explainer: Preserves exact measurements and units without diagnosing", () => {
  const sampleMeasurements = [
    {
      id: "m1",
      testName: "Fasting Blood Glucose",
      valueNumeric: 125,
      valueText: "125",
      unit: "mg/dL",
      referenceRangeLow: 70,
      referenceRangeHigh: 99,
      referenceText: "70 - 99 mg/dL",
      isAbnormal: true,
      flag: "HIGH" as const,
      plainExplanation: "Fasting glucose is above standard baseline.",
    },
    {
      id: "m2",
      testName: "Serum Creatinine",
      valueNumeric: 0.85,
      valueText: "0.85",
      unit: "mg/dL",
      referenceRangeLow: 0.5,
      referenceRangeHigh: 1.1,
      referenceText: "0.50 - 1.10 mg/dL",
      isAbnormal: false,
      flag: "NORMAL" as const,
      plainExplanation: "Normal kidney clearance marker.",
    },
  ];

  const explanation = generateReportExplanation(sampleMeasurements);
  assert.equal(explanation.abnormalItemsCount, 1);
  assert.ok(explanation.aiSummary.includes("Fasting Blood Glucose"));
  assert.ok(explanation.plainLanguageExplanation.includes("125 mg/dL"));
  assert.ok(explanation.doctorQuestions.length >= 3);
});

test("OCR Adapter: Flags uncertain prescription items for patient verification", async () => {
  const rxResult = await OcrAdapter.processPrescription({ name: "Rx_Order.pdf", size: 500000 });
  assert.ok(rxResult.items.length >= 3);
  assert.equal(rxResult.hasUncertainItems, true);
  const uncertainItem = rxResult.items.find((i) => i.uncertain === true);
  assert.ok(uncertainItem, "Should have at least one uncertain item requiring human review");
});
