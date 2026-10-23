import { MEDICINE_CATALOGUE } from "../data/medicine-catalogue.ts";
import type {
  MedicineCatalogueItem,
  MedicineOcrResult,
  MedicineComparisonGroup,
  AllergyItem,
} from "../types/index.ts";

export const MedicineGuideService = {
  // 1. Search catalogue by brand, generic, active ingredient, or barcode
  searchMedicines(query: string): MedicineCatalogueItem[] {
    if (!query || !query.trim()) return MEDICINE_CATALOGUE;
    const q = query.trim().toLowerCase();

    return MEDICINE_CATALOGUE.filter((med) => {
      // Check brand name
      if (med.brandName.toLowerCase().includes(q)) return true;
      // Check generic name
      if (med.genericName.toLowerCase().includes(q)) return true;
      // Check active ingredients & salt names
      const matchIngredient = med.activeIngredients.some(
        (ing) =>
          ing.name.toLowerCase().includes(q) ||
          ing.saltName.toLowerCase().includes(q) ||
          ing.therapeuticClass.toLowerCase().includes(q)
      );
      if (matchIngredient) return true;
      // Check barcode if provided
      if (med.barcode && med.barcode.includes(q)) return true;
      // Check manufacturer
      if (med.manufacturer.toLowerCase().includes(q)) return true;

      return false;
    });
  },

  // 2. Lookup medicine by ID
  getMedicineById(id: string): MedicineCatalogueItem | undefined {
    return MEDICINE_CATALOGUE.find((m) => m.id === id);
  },

  // 3. Photograph / Image OCR Processing Simulation
  identifyMedicineFromImage(input: {
    fileName: string;
    fileSize?: number;
    textOverride?: string;
  }): MedicineOcrResult {
    const rawText = input.textOverride || input.fileName.toLowerCase();

    let extractedText = "";
    let candidates: {
      medicine: MedicineCatalogueItem;
      matchConfidence: number;
      matchedFields: string[];
    }[] = [];

    // Analyze extracted tokens
    if (rawText.includes("glycomet") || rawText.includes("metformin")) {
      extractedText = "GLYCOMET 500 TABLET • Metformin Hydrochloride IP 500mg • USV Private Ltd";
      const match1 = MEDICINE_CATALOGUE.find((m) => m.id === "med_glycomet_500")!;
      const match2 = MEDICINE_CATALOGUE.find((m) => m.id === "med_glycomet_sr_500")!;
      candidates = [
        { medicine: match1, matchConfidence: 94, matchedFields: ["Brand Name: Glycomet", "Strength: 500mg", "Manufacturer: USV"] },
        { medicine: match2, matchConfidence: 72, matchedFields: ["Active Salt: Metformin HCl", "Strength: 500mg"] },
      ];
    } else if (rawText.includes("telma") || rawText.includes("telmisartan")) {
      extractedText = "TELMA 40 TABLETS • Telmisartan 40 mg • Glenmark Pharmaceuticals";
      const match1 = MEDICINE_CATALOGUE.find((m) => m.id === "med_telma_40")!;
      const match2 = MEDICINE_CATALOGUE.find((m) => m.id === "med_telma_20")!;
      candidates = [
        { medicine: match1, matchConfidence: 96, matchedFields: ["Brand: Telma", "Strength: 40mg", "Glenmark"] },
        { medicine: match2, matchConfidence: 68, matchedFields: ["Same Active Salt: Telmisartan (Lower 20mg Strength)"] },
      ];
    } else if (rawText.includes("augmentin") || rawText.includes("amoxicillin") || rawText.includes("clav")) {
      extractedText = "AUGMENTIN 625 DUO • Amoxicillin and Potassium Clavulanate Tablets IP • GSK";
      const match1 = MEDICINE_CATALOGUE.find((m) => m.id === "med_augmentin_625")!;
      const match2 = MEDICINE_CATALOGUE.find((m) => m.id === "med_clavam_625")!;
      candidates = [
        { medicine: match1, matchConfidence: 95, matchedFields: ["Brand: Augmentin 625 Duo", "Strength: 625mg", "GSK"] },
        { medicine: match2, matchConfidence: 80, matchedFields: ["Equivalent Salt: Amoxicillin + Clavulanate (Alkem)"] },
      ];
    } else if (rawText.includes("atorva") || rawText.includes("atorvastatin")) {
      extractedText = "ATORVA 10 TABLET • Atorvastatin Calcium IP 10mg • Zydus Cadila";
      const match1 = MEDICINE_CATALOGUE.find((m) => m.id === "med_atorva_10")!;
      candidates = [
        { medicine: match1, matchConfidence: 92, matchedFields: ["Brand: Atorva", "Strength: 10mg", "Zydus"] },
      ];
    } else if (rawText.includes("pantocid") || rawText.includes("pantoprazole") || rawText.includes("pan")) {
      extractedText = "PANTOCID 40 • Pantoprazole Gastro-resistant Tablets IP 40mg • Sun Pharma";
      const match1 = MEDICINE_CATALOGUE.find((m) => m.id === "med_pantocid_40")!;
      candidates = [
        { medicine: match1, matchConfidence: 91, matchedFields: ["Brand: Pantocid", "Strength: 40mg", "Sun Pharma"] },
      ];
    } else if (rawText.includes("dolo") || rawText.includes("paracetamol")) {
      extractedText = "DOLO 650 TABLET • Paracetamol IP 650mg • Micro Labs";
      const match1 = MEDICINE_CATALOGUE.find((m) => m.id === "med_dolo_650")!;
      candidates = [
        { medicine: match1, matchConfidence: 97, matchedFields: ["Brand: Dolo 650", "Paracetamol IP", "Micro Labs"] },
      ];
    } else {
      // Default fallback sample identification
      extractedText = "GLYCOMET 500 TABLET • Metformin Hydrochloride IP 500mg (Auto-detected from photo)";
      const match1 = MEDICINE_CATALOGUE.find((m) => m.id === "med_glycomet_500")!;
      candidates = [
        { medicine: match1, matchConfidence: 85, matchedFields: ["Visible Metformin Text", "500 mg strength pattern"] },
      ];
    }

    const highestConfidence = candidates.length > 0 ? candidates[0].matchConfidence : 0;
    const isUncertain = highestConfidence < 90 || candidates.length > 1;

    return {
      extractedText,
      confidence: highestConfidence,
      candidateMatches: candidates,
      isUncertain,
      requiresUserConfirmation: true, // Rule: never assume OCR guess as confirmed identity without user confirmation
    };
  },

  // 4. Same-Salt Medicine Comparison Grouping
  getSameSaltComparisons(medicineId: string): MedicineComparisonGroup | null {
    const target = this.getMedicineById(medicineId);
    if (!target) return null;

    const targetSalts = target.activeIngredients.map((i) => i.name.toLowerCase());
    const targetStrength = target.strength.toLowerCase().replace(/\s+/g, "");

    const exactMatches: MedicineCatalogueItem[] = [];
    const differentStrengths: MedicineCatalogueItem[] = [];
    const similarTherapeuticClass: MedicineCatalogueItem[] = [];

    const targetClass = target.activeIngredients[0]?.therapeuticClass.toLowerCase();

    for (const med of MEDICINE_CATALOGUE) {
      if (med.id === target.id) continue;

      const medSalts = med.activeIngredients.map((i) => i.name.toLowerCase());
      const medStrength = med.strength.toLowerCase().replace(/\s+/g, "");

      // Check if primary active salt matches
      const hasMatchingSalt = targetSalts.some((ts) =>
        medSalts.some((ms) => ms.includes(ts) || ts.includes(ms))
      );

      if (hasMatchingSalt) {
        // Check if formulation and strength are identical
        if (
          medStrength === targetStrength &&
          med.dosageForm === target.dosageForm &&
          med.releaseType === target.releaseType
        ) {
          exactMatches.push(med);
        } else {
          differentStrengths.push(med);
        }
      } else if (
        targetClass &&
        med.activeIngredients.some((i) => i.therapeuticClass.toLowerCase() === targetClass)
      ) {
        similarTherapeuticClass.push(med);
      }
    }

    return {
      targetMedicine: target,
      exactMatches,
      differentStrengths,
      similarTherapeuticClass,
    };
  },

  // 5. Patient Allergy & Drug Interaction Cross-Check
  checkPatientAllergyInteraction(
    medicine: MedicineCatalogueItem,
    allergies: AllergyItem[]
  ): {
    hasContraindication: boolean;
    allergenMatched?: string;
    severity?: string;
    warningMessage?: string;
  } {
    if (!allergies || allergies.length === 0) {
      return { hasContraindication: false };
    }

    const medString = (
      medicine.brandName +
      " " +
      medicine.genericName +
      " " +
      medicine.activeIngredients.map((i) => i.name + " " + i.saltName).join(" ")
    ).toLowerCase();

    for (const allergy of allergies) {
      const allergenName = allergy.allergen.toLowerCase();

      // Penicillin check
      if (allergenName.includes("penicillin")) {
        if (
          medString.includes("amoxicillin") ||
          medString.includes("ampicillin") ||
          medString.includes("penicillin") ||
          medString.includes("clavulanate") ||
          medicine.allergensCovered?.some((a) => a.toLowerCase().includes("penicillin"))
        ) {
          return {
            hasContraindication: true,
            allergenMatched: allergy.allergen,
            severity: allergy.severity,
            warningMessage: `CRITICAL ALLERGY ALERT: Patient has documented ${allergy.severity} allergy to ${allergy.allergen} (${allergy.reaction}). ${medicine.brandName} contains aminopenicillin/beta-lactam compounds carrying acute anaphylaxis risk.`,
          };
        }
      }

      // Sulfa check
      if (allergenName.includes("sulfa")) {
        if (medString.includes("sulfa") || medString.includes("cotrimoxazole") || medString.includes("bactrim")) {
          return {
            hasContraindication: true,
            allergenMatched: allergy.allergen,
            severity: allergy.severity,
            warningMessage: `ALLERGY WARNING: Patient has documented reaction to ${allergy.allergen}. Review suitability with prescribing physician.`,
          };
        }
      }
    }

    return { hasContraindication: false };
  },
};
