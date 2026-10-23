import type { SymptomAssessment } from "../types";

export interface EmergencyCheckResult {
  isEmergency: boolean;
  warningSigns: string[];
  recommendation: string;
}

const RED_FLAG_KEYWORDS = [
  { term: "chest pain", desc: "Crushing chest pain, tightness or pressure" },
  { term: "shortness of breath", desc: "Severe difficulty breathing or gasping" },
  { term: "cannot breathe", desc: "Acute respiratory distress" },
  { term: "numbness", desc: "Sudden facial drooping, arm weakness or speech difficulty (Stroke signs)" },
  { term: "stroke", desc: "Suspected acute neurological deficit" },
  { term: "unconscious", desc: "Fainting or sudden loss of consciousness" },
  { term: "coughing blood", desc: "Hemoptysis / acute hemorrhage" },
  { term: "worst headache", desc: "Sudden onset thunderclap headache" },
  { term: "suicidal", desc: "Immediate acute mental health crisis" },
  { term: "anaphylaxis", desc: "Rapid swelling of lips, tongue, or throat closing" },
];

export function screenForEmergency(
  description: string,
  symptomsList: string[]
): EmergencyCheckResult {
  const combinedText = `${description} ${symptomsList.join(" ")}`.toLowerCase();

  const foundWarnings: string[] = [];

  for (const flag of RED_FLAG_KEYWORDS) {
    if (combinedText.includes(flag.term.toLowerCase())) {
      foundWarnings.push(flag.desc);
    }
  }

  if (foundWarnings.length > 0) {
    return {
      isEmergency: true,
      warningSigns: foundWarnings,
      recommendation:
        "EMERGENCY WARNING: Your described symptoms indicate potential urgent medical distress. Please call local emergency services (911 / 112 / 108) or proceed to the nearest emergency room immediately. Do not delay care by waiting for a routine clinic appointment.",
    };
  }

  return {
    isEmergency: false,
    warningSigns: [],
    recommendation: "No immediate red flag symptoms identified in basic screening. Proceed to specialty matching.",
  };
}

export function matchSpecialtiesFromSymptoms(
  description: string,
  symptoms: string[]
): {
  specialties: string[];
  reasoning: string[];
} {
  const text = `${description} ${symptoms.join(" ")}`.toLowerCase();
  const specialties: string[] = [];
  const reasoning: string[] = [];

  if (
    text.includes("heart") ||
    text.includes("palpitation") ||
    text.includes("blood pressure") ||
    text.includes("cholesterol") ||
    text.includes("hypertension")
  ) {
    specialties.push("Cardiology");
    reasoning.push("Symptoms mention cardiac symptoms or cardiovascular history.");
  }

  if (
    text.includes("knee") ||
    text.includes("joint") ||
    text.includes("bone") ||
    text.includes("back pain") ||
    text.includes("spine") ||
    text.includes("shoulder") ||
    text.includes("orthopedic")
  ) {
    specialties.push("Orthopedics & Joint Surgery");
    reasoning.push("Symptoms involve musculoskeletal pain or joint movement limitation.");
  }

  if (
    text.includes("cough") ||
    text.includes("asthma") ||
    text.includes("wheezing") ||
    text.includes("lung") ||
    text.includes("bronchitis") ||
    text.includes("phlegm")
  ) {
    specialties.push("Pulmonology & Respiratory Medicine");
    reasoning.push("Symptoms relate to lower airways, persistent cough, or breathing.");
  }

  if (
    text.includes("headache") ||
    text.includes("migraine") ||
    text.includes("dizziness") ||
    text.includes("nerve") ||
    text.includes("tingling")
  ) {
    specialties.push("Neurology");
    reasoning.push("Symptoms indicate neurological, nerve, or chronic cephalic patterns.");
  }

  if (
    text.includes("rash") ||
    text.includes("skin") ||
    text.includes("itching") ||
    text.includes("eczema") ||
    text.includes("spots") ||
    text.includes("dermatitis")
  ) {
    specialties.push("Dermatology");
    reasoning.push("Symptoms relate to cutaneous or dermatological manifestations.");
  }

  if (
    text.includes("stomach") ||
    text.includes("abdomen") ||
    text.includes("acid") ||
    text.includes("nausea") ||
    text.includes("diarrhea") ||
    text.includes("digestion")
  ) {
    specialties.push("Gastroenterology");
    reasoning.push("Symptoms involve digestive or gastrointestinal discomfort.");
  }

  // Fallback or general
  if (specialties.length === 0) {
    specialties.push("Internal Medicine & Diabetes Care");
    reasoning.push("Comprehensive diagnostic evaluation recommended with an internal medicine physician.");
  }

  return { specialties, reasoning };
}
