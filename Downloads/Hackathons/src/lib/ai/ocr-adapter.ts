import type { MedicalReport, ReportMeasurement, Prescription, PrescriptionItem } from "../types";

export interface OcrExtractionResult {
  reportType: "blood_test" | "lipid_panel" | "radiology" | "other";
  title: string;
  facility: string;
  date: string;
  measurements: ReportMeasurement[];
  confidenceScore: number;
  extractedRawText: string;
  hasUncertainValues: boolean;
}

export interface PrescriptionOcrResult {
  doctorName: string;
  facility: string;
  date: string;
  prescriptionNumber: string;
  items: PrescriptionItem[];
  instructions: string;
  rawText: string;
  hasUncertainItems: boolean;
}

export const OcrAdapter = {
  // Simulates OCR on medical report document
  async processMedicalReport(
    file: File | { name: string; size: number }
  ): Promise<OcrExtractionResult> {
    // Realistic simulated network / AI inference delay
    await new Promise((res) => setTimeout(res, 1200));

    const fileName = file.name.toLowerCase();

    // Default template: Metabolic & Lipid Panel
    const measurements: ReportMeasurement[] = [
      {
        id: `ocr_m_${Date.now()}_1`,
        testName: "Fasting Blood Glucose",
        valueNumeric: 124,
        valueText: "124",
        unit: "mg/dL",
        referenceRangeLow: 70,
        referenceRangeHigh: 99,
        referenceText: "70 - 99 mg/dL",
        isAbnormal: true,
        flag: "HIGH",
        plainExplanation: "Fasting blood sugar is elevated above standard baseline.",
      },
      {
        id: `ocr_m_${Date.now()}_2`,
        testName: "Glycated Hemoglobin (HbA1c)",
        valueNumeric: 6.9,
        valueText: "6.9",
        unit: "%",
        referenceRangeLow: 4.0,
        referenceRangeHigh: 5.6,
        referenceText: "< 5.7% (Normal), 5.7 - 6.4% (Prediabetes), >= 6.5% (Diabetes)",
        isAbnormal: true,
        flag: "HIGH",
        plainExplanation: "3-month glucose estimate reflects ongoing glycemic monitoring.",
      },
      {
        id: `ocr_m_${Date.now()}_3`,
        testName: "Total Cholesterol",
        valueNumeric: 208,
        valueText: "208",
        unit: "mg/dL",
        referenceRangeLow: 125,
        referenceRangeHigh: 200,
        referenceText: "< 200 mg/dL",
        isAbnormal: true,
        flag: "HIGH",
        plainExplanation: "Total serum cholesterol is slightly higher than optimal.",
      },
      {
        id: `ocr_m_${Date.now()}_4`,
        testName: "LDL Cholesterol",
        valueNumeric: 135,
        valueText: "135",
        unit: "mg/dL",
        referenceRangeLow: 0,
        referenceRangeHigh: 100,
        referenceText: "< 100 mg/dL (Optimal for diabetic patients)",
        isAbnormal: true,
        flag: "HIGH",
        plainExplanation: "Low-density lipoprotein is above recommended target.",
      },
      {
        id: `ocr_m_${Date.now()}_5`,
        testName: "HDL Cholesterol",
        valueNumeric: 46,
        valueText: "46",
        unit: "mg/dL",
        referenceRangeLow: 40,
        referenceRangeHigh: 60,
        referenceText: "> 40 mg/dL",
        isAbnormal: false,
        flag: "NORMAL",
        plainExplanation: "High-density lipoprotein cholesterol is within healthy range.",
      },
      {
        id: `ocr_m_${Date.now()}_6`,
        testName: "Serum Creatinine",
        valueNumeric: 0.82,
        valueText: "0.82",
        unit: "mg/dL",
        referenceRangeLow: 0.5,
        referenceRangeHigh: 1.1,
        referenceText: "0.50 - 1.10 mg/dL",
        isAbnormal: false,
        flag: "NORMAL",
        plainExplanation: "Normal kidney clearance marker.",
      },
    ];

    return {
      reportType: "lipid_panel",
      title: "Extracted Clinical Laboratory Report",
      facility: "National Clinical Diagnostics",
      date: new Date().toISOString().split("T")[0],
      measurements,
      confidenceScore: 94,
      extractedRawText: `NATIONAL CLINICAL DIAGNOSTICS\nPATIENT RECORD REPORT\nDATE: ${new Date().toLocaleDateString()}\nTEST: FASTING GLUCOSE 124 mg/dL [H] (Ref: 70-99)\nHbA1c: 6.9 % [H] (Ref: <5.7%)\nTOTAL CHOLESTEROL: 208 mg/dL [H] (Ref: <200)\nLDL CHOLESTEROL: 135 mg/dL [H] (Ref: <100)\nHDL CHOLESTEROL: 46 mg/dL (Ref: >40)\nCREATININE: 0.82 mg/dL (Ref: 0.5-1.1)`,
      hasUncertainValues: false,
    };
  },

  // Simulates OCR on prescription document
  async processPrescription(
    file: File | { name: string; size: number }
  ): Promise<PrescriptionOcrResult> {
    await new Promise((res) => setTimeout(res, 1300));

    const items: PrescriptionItem[] = [
      {
        id: `rx_ocr_${Date.now()}_1`,
        medicineName: "Metformin Hydrochloride",
        genericName: "Metformin HCl",
        strength: "500 mg",
        form: "tablet",
        dosage: "1 tablet (500mg)",
        frequency: "Twice daily after meals",
        duration: "30 days",
        instructions: "Take with food to minimize gastric discomfort.",
        ocrConfidence: 96,
        uncertain: false,
      },
      {
        id: `rx_ocr_${Date.now()}_2`,
        medicineName: "Telmisartan",
        genericName: "Telmisartan",
        strength: "40 mg",
        form: "tablet",
        dosage: "1 tablet (40mg)",
        frequency: "Once daily morning",
        duration: "30 days",
        instructions: "Take consistently at the same time each morning.",
        ocrConfidence: 94,
        uncertain: false,
      },
      {
        id: `rx_ocr_${Date.now()}_3`,
        medicineName: "Atorvastatin Calcium",
        genericName: "Atorvastatin",
        strength: "10 mg",
        form: "tablet",
        dosage: "1 tablet (10mg)",
        frequency: "Once daily at night",
        duration: "30 days",
        instructions: "Take at bedtime.",
        ocrConfidence: 82, // Flagged for patient verification
        uncertain: true,
      },
    ];

    return {
      doctorName: "Dr. Arvind Mehta, MD",
      facility: "Apex Multispecialty Hospital",
      date: new Date().toISOString().split("T")[0],
      prescriptionNumber: `RX-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      items,
      instructions: "Take prescribed oral medications as indicated. Maintain adequate hydration.",
      rawText: `APEX MULTISPECIALTY HOSPITAL\nPRESCRIPTION Rx\n1. Tab Metformin 500mg BD pc x 30d\n2. Tab Telmisartan 40mg OD am x 30d\n3. Tab Atorvastatin 10mg HS x 30d (handwriting semi-clear)`,
      hasUncertainItems: true,
    };
  },
};
