import type { ReportMeasurement } from "../types";

export interface PlainReportSummary {
  aiSummary: string;
  plainLanguageExplanation: string;
  doctorQuestions: string[];
  abnormalItemsCount: number;
}

export function generateReportExplanation(
  measurements: ReportMeasurement[]
): PlainReportSummary {
  const abnormal = measurements.filter((m) => m.isAbnormal);

  const plainLanguageLines = measurements.map((m) => {
    const statusText = m.isAbnormal
      ? `(Outside standard reference range of ${m.referenceText})`
      : "(Within expected biological range)";
    return `• ${m.testName}: Measured at ${m.valueText} ${m.unit} ${statusText}. ${m.plainExplanation}`;
  });

  const plainLanguageExplanation =
    plainLanguageLines.join("\n\n") +
    "\n\n[Clinical Context Note: Standard laboratory reference ranges represent statistical distributions and can vary according to age, gender, fasting status, and individual health context. These findings should always be interpreted by your prescribing clinician.]";

  const aiSummary = `This report contains ${measurements.length} test measurements. ${
    abnormal.length > 0
      ? `${abnormal.length} parameter(s) (${abnormal
          .map((a) => a.testName)
          .join(", ")}) are outside standard reference intervals and warrant physician review.`
      : "All extracted parameters are within standard reference intervals."
  }`;

  const doctorQuestions: string[] = [
    "What do these specific test results mean in the context of my current health history and medications?",
    "Do any of the values outside standard reference ranges require dietary modifications or medication adjustments?",
    "When should we schedule a follow-up test to monitor these parameters over time?",
  ];

  if (abnormal.some((a) => a.testName.toLowerCase().includes("glucose") || a.testName.toLowerCase().includes("a1c"))) {
    doctorQuestions.push("How are my current daily glucose levels and meal timings impacting my HbA1c trajectory?");
  }
  if (abnormal.some((a) => a.testName.toLowerCase().includes("cholesterol") || a.testName.toLowerCase().includes("ldl"))) {
    doctorQuestions.push("Is my current statin therapy achieving our targeted cardiovascular risk reduction?");
  }

  return {
    aiSummary,
    plainLanguageExplanation,
    doctorQuestions,
    abnormalItemsCount: abnormal.length,
  };
}
