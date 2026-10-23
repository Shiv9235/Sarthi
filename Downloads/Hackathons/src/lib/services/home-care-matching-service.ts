import {
  SAARTHEE_HOME_CARE_CATEGORIES,
  SAARTHEE_PROVIDERS,
} from "../data/home-care-data.ts";
import type {
  HomeCareCategory,
  HomeCareCategoryId,
  SaartheeProvider,
  HomeCareIntakeResponse,
  HomeCareRecommendationResult,
  ProviderMatchItem,
} from "../types/index.ts";

export const HomeCareMatchingService = {
  // 1. Get all 9 Encone-Care-inspired home care categories
  getCategories(): HomeCareCategory[] {
    return SAARTHEE_HOME_CARE_CATEGORIES.filter((c) => c.isActive);
  },

  getCategoryById(id: string): HomeCareCategory | undefined {
    return SAARTHEE_HOME_CARE_CATEGORIES.find((c) => c.id === id);
  },

  // 2. Get Saarthee-affiliated verified providers
  getProviders(): SaartheeProvider[] {
    return SAARTHEE_PROVIDERS.filter((p) => p.isSaartheeVerified);
  },

  getProviderById(id: string): SaartheeProvider | undefined {
    return SAARTHEE_PROVIDERS.find((p) => p.id === id);
  },

  // 3. Emergency Red-Flag Screening
  screenForEmergency(text: string): {
    isEmergency: boolean;
    reason?: string;
    emergencyAdvice?: string;
  } {
    const q = text.toLowerCase();
    const acuteCardiac =
      q.includes("chest pain") ||
      q.includes("heart attack") ||
      q.includes("radiating to arm") ||
      q.includes("crushing pressure");
    const acuteRespiratory =
      q.includes("cannot breathe") ||
      q.includes("severe breathlessness") ||
      q.includes("choking") ||
      q.includes("turning blue");
    const acuteNeurological =
      q.includes("sudden paralysis") ||
      q.includes("slurred speech") ||
      q.includes("facial droop") ||
      q.includes("unconscious") ||
      q.includes("seizure right now");
    const acuteTrauma =
      q.includes("heavy bleeding") ||
      q.includes("massive hemorrhage") ||
      q.includes("head injury unconscious");

    if (acuteCardiac || acuteRespiratory || acuteNeurological || acuteTrauma) {
      return {
        isEmergency: true,
        reason: "Symptoms indicate a potential acute life-threatening medical emergency.",
        emergencyAdvice:
          "Dial 112 (National Emergency) or 102 (Ambulance) immediately, or visit the nearest hospital emergency room. Ordinary home care cannot substitute for emergency resuscitation or hospital intensive care.",
      };
    }

    return { isEmergency: false };
  },

  // 4. Determine Best Category from Intake
  determineCategory(
    primaryConcern: string,
    naturalLanguageNeed: string
  ): {
    categoryId: HomeCareCategoryId;
    categoryName: string;
    clinicalRationale: string;
    requiredQualificationLevel: string;
  } {
    const text = (primaryConcern + " " + naturalLanguageNeed).toLowerCase();

    // Check specific clinical keywords
    if (text.includes("physio") || text.includes("rehab") || text.includes("joint stiffness") || text.includes("gait")) {
      return {
        categoryId: "physiotherapy",
        categoryName: "Physiotherapy & Mobility Rehabilitation",
        clinicalRationale:
          "Physical therapy requires a credential-verified BPT/MPT therapist for safe joint mobilization and neurological gait restoration.",
        requiredQualificationLevel: "Bachelor / Master of Physiotherapy (BPT/MPT)",
      };
    }

    if (text.includes("sleep") || text.includes("apnea") || text.includes("snoring") || text.includes("psg")) {
      return {
        categoryId: "sleep_study",
        categoryName: "Home Sleep Study Diagnostics",
        clinicalRationale:
          "Diagnostic evaluation of obstructive sleep apnea requires specialized overnight polysomnography equipment and sleep technologist setup.",
        requiredQualificationLevel: "Certified Sleep Diagnostic Technologist (RPSGT)",
      };
    }

    if (text.includes("injection") || text.includes("cannula") || text.includes("saline") || text.includes("iv drip") || text.includes("iv fluid")) {
      return {
        categoryId: "injection_visit",
        categoryName: "Doorstep Injection & Infusion Visit",
        clinicalRationale:
          "Prescribed injections and IV infusions require aseptic technique and anaphylaxis preparedness by a registered nurse.",
        requiredQualificationLevel: "Registered Nurse (GNM / B.Sc)",
      };
    }

    if (text.includes("baby") || text.includes("newborn") || text.includes("infant") || text.includes("maternity")) {
      return {
        categoryId: "baby_care",
        categoryName: "Newborn & Infant Baby Care",
        clinicalRationale:
          "Delicate neonatal hygiene, lactation support, and infant safety require background-verified pediatric nurses or trained child nannies.",
        requiredQualificationLevel: "Pediatric Nurse or Certified Childcare Specialist",
      };
    }

    if (text.includes("surgery") || text.includes("post-op") || text.includes("operation") || text.includes("wound dressing") || text.includes("stitches")) {
      return {
        categoryId: "post_operative_care",
        categoryName: "Post-Operative & Surgical Recovery Care",
        clinicalRationale:
          "Surgical wounds, surgical drains, and post-anesthesia recovery require sterile dressing protocols and vital sign charting by hospital-trained staff nurses.",
        requiredQualificationLevel: "Registered Staff Nurse (B.Sc / GNM)",
      };
    }

    // Attendants & basic daily hygiene care
    if (text.includes("sponge bath") || text.includes("feeding") || text.includes("hygiene") || text.includes("daily living") || text.includes("attendant")) {
      return {
        categoryId: "patient_attendants",
        categoryName: "Patient Attendants & Everyday Assistance",
        clinicalRationale:
          "Semi-dependent adults requiring physical assistance with bathing, hygiene, and daily ambulation are safely supported by trained patient attendants.",
        requiredQualificationLevel: "Certified General Duty Assistant (GDA)",
      };
    }

    if (text.includes("tracheostomy") || text.includes("ventilator") || text.includes("bipap") || text.includes("suction") || text.includes("paralysis") || text.includes("coma") || text.includes("icu stepdown")) {
      return {
        categoryId: "specialized_care",
        categoryName: "Specialized Critical & Bedridden Care",
        clinicalRationale:
          "Invasive airway management, deep pressure sore prevention, and PEG tube enteral nutrition mandate ICU-trained critical care nurses.",
        requiredQualificationLevel: "Critical Care Nurse (B.Sc with ICU experience)",
      };
    }

    if (text.includes("elderly") || text.includes("dementia") || text.includes("alzheimer") || text.includes("senior citizen")) {
      return {
        categoryId: "elder_care",
        categoryName: "Elderly & Dementia Care",
        clinicalRationale:
          "Elderly companionship, fall prevention, cognitive stimulation, and gentle daily routine support are best delivered by geriatric caregivers.",
        requiredQualificationLevel: "Certified Geriatric Care Specialist or GNM",
      };
    }

    // Default: Professional Nursing Staff
    return {
      categoryId: "nursing_staff",
      categoryName: "Professional Nursing Staff (12/24 Hr Shifts)",
      clinicalRationale:
        "Continuous bedside medication delivery, vital monitoring, and patient safety require licensed hospital staff nurses.",
      requiredQualificationLevel: "Hospital Licensed Staff Nurse (B.Sc / GNM)",
    };
  },

  // 5. Run Full Assessment & Matching Algorithm
  assessAndMatch(intake: HomeCareIntakeResponse): HomeCareRecommendationResult {
    const { categoryId, categoryName, clinicalRationale, requiredQualificationLevel } =
      this.determineCategory(intake.primaryConcern, intake.naturalLanguageNeed);

    // Rule: Must be verified Saarthee-affiliated provider
    const allVerified = this.getProviders();

    // Check if clinical care requires licensed nurse (e.g. post-op, specialized, injection, or catheter/IV equipment)
    const requiresLicensedNurse =
      categoryId === "post_operative_care" ||
      categoryId === "specialized_care" ||
      categoryId === "injection_visit" ||
      categoryId === "nursing_staff" ||
      intake.clinicalEquipmentNeeded.some((e) => ["urinary_catheter", "iv_infusion", "wound_dressing"].includes(e));

    const matches: ProviderMatchItem[] = [];
    const unmetConstraints: string[] = [];

    for (const provider of allVerified) {
      const matchReasons: string[] = [];
      let score = 50;

      // Filter 1: Clinical qualification requirement
      if (requiresLicensedNurse && provider.providerTier === "trained_attendant") {
        continue; // Attendants cannot perform sterile nursing or clinical wound dressing
      }

      // Check category compatibility
      const categoryMatch = provider.categoryIds.includes(categoryId);
      if (categoryMatch) {
        score += 25;
        matchReasons.push(`Certified for ${categoryName}`);
      }

      // Check tier qualification
      if (provider.providerTier === "licensed_nurse") {
        score += 15;
        matchReasons.push(`Verified Council Registration (${provider.councilRegistration || "State Nursing Council"})`);
      } else if (provider.providerTier === "physiotherapist") {
        score += 20;
        matchReasons.push("Qualified Physical Therapist (BPT/MPT)");
      } else if (provider.providerTier === "elder_care_specialist") {
        score += 15;
        matchReasons.push("Certified Geriatric & Elderly Care Specialist");
      }

      // Check location & PIN coverage
      const cleanPostal = intake.postalCode?.trim();
      const coversLocation =
        cleanPostal &&
        (provider.postalCodesCovered.includes(cleanPostal) ||
          provider.serviceAreas.some((a) => a.toLowerCase().includes(intake.locationCity.toLowerCase())));

      if (coversLocation) {
        score += 15;
        matchReasons.push(`Active coverage in ${intake.locationCity || "your area"} (PIN ${cleanPostal})`);
      }

      // Check shift duration compatibility
      const shiftPref = intake.shiftDuration;
      let estimatedCost = 0;
      let rateExplanation = "";

      if (shiftPref === "short_visit") {
        estimatedCost = provider.shiftRates.visit || 450;
        rateExplanation = `₹${estimatedCost} per doorstep visit`;
        matchReasons.push("Available for short doorstep clinical visits");
      } else if (shiftPref === "24hr_livein") {
        estimatedCost = provider.shiftRates.shift24hr || 4500;
        rateExplanation = `₹${estimatedCost} per 24-hr live-in shift`;
        matchReasons.push("Available for continuous 24-hr live-in care");
      } else {
        // 8hr or 12hr day/night shift
        estimatedCost = provider.shiftRates.shift12hr || 2600;
        rateExplanation = `₹${estimatedCost} per 12-hr shift`;
        matchReasons.push("Available for 12-hr day / night shift care");
      }

      // Budget check
      if (intake.budgetMaxPerShift > 0) {
        if (estimatedCost <= intake.budgetMaxPerShift) {
          score += 10;
          matchReasons.push(`Fits within stated budget (Under ₹${intake.budgetMaxPerShift})`);
        } else {
          score -= 10;
        }
      }

      // Experience factor
      if (provider.experienceYears >= 8) {
        score += 10;
        matchReasons.push(`${provider.experienceYears}+ years senior hospital and home-care experience`);
      }

      matches.push({
        provider,
        matchScore: score,
        matchReasons,
        estimatedCost,
        rateExplanation,
      });
    }

    // Sort by match score descending
    matches.sort((a, b) => b.matchScore - a.matchScore);

    if (matches.length === 0) {
      unmetConstraints.push(
        "No verified Saarthee providers currently match every constraint in your specified area. You can adjust the shift duration or requested start date."
      );
    }

    return {
      intakeId: intake.id,
      recommendedCategoryId: categoryId,
      categoryName,
      clinicalRationale,
      requiredQualificationLevel,
      eligibleProviders: matches.slice(0, 4), // Shortlist top matching Saarthee professionals
      unmetConstraints: unmetConstraints.length > 0 ? unmetConstraints : undefined,
    };
  },
};
