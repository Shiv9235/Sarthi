export type UserRole = "patient" | "doctor" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  age?: number;
  dob?: string;
  sex?: "male" | "female" | "other" | "prefer_not_to_say";
  phone?: string;
  address?: string;
  postalCode?: string;
  preferredLanguage?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientHealthProfile {
  allergies: AllergyItem[];
  medications: MedicationItem[];
  conditions: string[];
  surgeries: SurgeryItem[];
  familyHistory: string[];
  patientNotes?: string;
  primaryCareProvider?: {
    name: string;
    clinic: string;
    phone: string;
  };
}

export interface AllergyItem {
  id: string;
  allergen: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe" | "life_threatening";
  recordedAt: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  prescribingDoctor?: string;
  notes?: string;
}

export interface SurgeryItem {
  id: string;
  procedure: string;
  year: number;
  hospital?: string;
  notes?: string;
}

// 1. Nursing & Home Care
export interface Caregiver {
  id: string;
  name: string;
  title: string;
  photoUrl: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  shiftRate: number; // 8-12 hr shift
  experienceYears: number;
  qualifications: string[];
  specialities: string[];
  languages: string[];
  serviceArea: string;
  postalCodesCovered: string[];
  availabilityStatus: "available_today" | "available_this_week" | "busy";
  isVerified: boolean;
  bio: string;
  certifications: string[];
}

export type NursingBookingStatus =
  | "requested"
  | "awaiting_confirmation"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface NursingBooking {
  id: string;
  patientId: string;
  caregiverId: string;
  caregiverName: string;
  caregiverPhoto: string;
  serviceCategory: string;
  careNeedsDescription: string;
  requestedDate: string;
  requestedTime: string;
  durationHours: number;
  serviceAddress: string;
  postalCode: string;
  estimatedCost: number;
  status: NursingBookingStatus;
  statusMessage?: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

// 2. Doctor Appointments
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subspecialties: string[];
  hospitalName: string;
  hospitalAddress: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  experienceYears: number;
  languages: string[];
  photoUrl: string;
  bio: string;
  appointmentTypes: ("in_person" | "teleconsultation")[];
  nextAvailableSlot: string;
  availableDays: string[];
  education: string[];
}

export interface SymptomAssessment {
  mainSymptoms: string[];
  description: string;
  onset: string; // e.g. "today", "1_3_days", "1_week", "chronic"
  severity: "mild" | "moderate" | "severe";
  accompanyingSymptoms: string[];
  emergencyScreeningPassed: boolean;
  flaggedUrgent?: boolean;
  urgentReason?: string;
  recommendedSpecialties: string[];
  preferredLocation: string;
  appointmentType: "in_person" | "teleconsultation" | "any";
  matchedReasoning: string[];
}

export type AppointmentStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface AppointmentBooking {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalName: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: "in_person" | "teleconsultation";
  fee: number;
  symptomsSummary: string;
  status: AppointmentStatus;
  isDemo: boolean;
  createdAt: string;
}

// 3. Medical Reports
export interface ReportMeasurement {
  id: string;
  testName: string;
  valueNumeric?: number;
  valueText: string;
  unit: string;
  referenceRangeLow?: number;
  referenceRangeHigh?: number;
  referenceText: string;
  isAbnormal: boolean;
  flag?: "HIGH" | "LOW" | "NORMAL" | "CRITICAL";
  plainExplanation: string;
  patientCorrected?: boolean;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  title: string;
  reportDate: string;
  reportType:
    | "pathology_lab"
    | "radiology_scan"
    | "blood_test"
    | "lipid_panel"
    | "radiology"
    | "metabolic_panel"
    | "cardiac"
    | "other";
  facilityName: string;
  status: "extracted" | "reviewed_by_patient" | "doctor_shared" | "doctor_approved";
  isDoctorShared: boolean;
  doctorName?: string;
  doctorNotes?: string;
  doctorApprovedAt?: string;
  aiGeneratedSummary: string;
  plainLanguageExplanation: string;
  suggestedDoctorQuestions: string[];
  measurements: ReportMeasurement[];
  sourceFileName: string;
  fileSize?: string;
  createdAt: string;
}

// 4. Prescriptions and Medicines
export interface PrescriptionItem {
  id: string;
  medicineName: string;
  genericName: string;
  strength: string;
  form: "tablet" | "capsule" | "syrup" | "injection" | "inhaler" | "drops";
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  ocrConfidence: number; // 0-100
  uncertain?: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  prescriptionNumber: string;
  doctorName: string;
  facilityName: string;
  issueDate: string;
  status: "active" | "superseded" | "completed" | "cancelled" | "uncertain";
  version: number;
  items: PrescriptionItem[];
  instructionsNotes?: string;
  sourceFileName?: string;
  isDoctorIssued: boolean;
  createdAt: string;
}

export interface PharmacyProduct {
  id: string;
  medicineName: string;
  genericName: string;
  brandName: string;
  activeIngredient: string;
  strength: string;
  dosageForm: string;
  packSize: string;
  pharmacyName: string;
  pharmacyLogo?: string;
  price: number;
  mrp?: number;
  deliveryFee: number;
  estimatedDelivery: string;
  inStock: boolean;
  lastUpdated: string;
  isSampleData: boolean;
}

export interface MedicationProblemReport {
  id: string;
  patientId: string;
  prescriptionId?: string;
  medicineName: string;
  problemType:
    | "suspected_side_effect"
    | "allergy_concern"
    | "medication_error"
    | "incorrect_medicine"
    | "unclear_instructions"
    | "missing_medicine"
    | "other";
  severity: "mild" | "moderate" | "severe" | "urgent";
  description: string;
  onsetDate: string;
  emergencyScreeningTriggered: boolean;
  status: "submitted" | "under_review" | "doctor_responded";
  doctorResponseNotes?: string;
  isDemo: boolean;
  createdAt: string;
}

export type VerificationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected"
  | "additional_info_required";

export interface DoctorSupportingDoc {
  id: string;
  name: string;
  type: "degree" | "council_registration" | "identity_proof" | "clinic_proof" | "other";
  fileUrl: string;
  uploadedAt: string;
  size?: string;
}

export interface DoctorProfile {
  id: string; // matches Doctor.id / UserProfile.id
  name: string;
  email: string;
  phone: string;
  specialty: string;
  subspecialties: string[];
  regNumber: string; // e.g. DMC/R/14290
  councilName: string; // e.g. Delhi Medical Council
  regYear: number;
  education: string[];
  experienceYears: number;
  hospitalName: string;
  clinicAddress: string;
  consultationFee: number;
  teleconsultationFee: number;
  bio: string;
  languages: string[];
  photoUrl?: string;
  verificationStatus: VerificationStatus;
  supportingDocs: DoctorSupportingDoc[];
  submittedAt?: string;
  verifiedAt?: string;
  reviewerNotes?: string;
  availableDays: string[];
  consultationHours: string;
}

export type AccessGrantType = "appointment" | "consultation" | "referral" | "explicit_consent";

export interface DoctorPatientRelationship {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientSex?: string;
  patientPhone?: string;
  accessType: AccessGrantType;
  isActive: boolean;
  grantedAt: string;
  expiresAt?: string;
  lastEncounterAt?: string;
  patientSummary?: string;
}

export type EncounterStatus = "draft" | "finalized";

export interface ClinicalVitals {
  bloodPressure?: string;
  pulseRate?: number;
  temperatureF?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weightKg?: number;
  heightCm?: number;
  bmi?: number;
}

export interface ClinicalEncounter {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentId?: string;
  encounterDate: string;
  encounterType: "in_person" | "teleconsultation" | "follow_up";
  chiefComplaint: string;
  symptomsHistory: string;
  vitals: ClinicalVitals;
  examinationFindings: string;
  provisionalDiagnosis: string;
  clinicalNotes: string;
  treatmentPlan: string;
  followUpInstructions?: string;
  followUpDate?: string;
  status: EncounterStatus;
  finalizedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvestigationCategory = "pathology_lab" | "radiology_scan";
export type InvestigationUrgency = "routine" | "urgent" | "immediate";
export type RecommendationStatus =
  | "recommended"
  | "accepted_by_patient"
  | "declined_by_patient"
  | "booked"
  | "completed";

export interface InvestigationRequest {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  encounterId?: string;
  category: InvestigationCategory;
  testName: string;
  clinicalIndication: string;
  instructions?: string;
  urgency: InvestigationUrgency;
  status: RecommendationStatus;
  estimatedCost?: number;
  recommendedFacility?: string;
  resultReportId?: string;
  declineReason?: string;
  createdAt: string;
  decisionAt?: string;
}

export interface ReferralOrder {
  id: string;
  patientId: string;
  patientName: string;
  referringDoctorId: string;
  referringDoctorName: string;
  referringDoctorSpecialty: string;
  targetSpecialty: string;
  targetDoctorId?: string;
  targetDoctorName?: string;
  targetHospital?: string;
  reasonForReferral: string;
  clinicalSummary: string;
  urgency: "routine" | "priority" | "urgent";
  status: RecommendationStatus;
  declineReason?: string;
  createdAt: string;
  decisionAt?: string;
  appointmentId?: string;
}

export interface ClinicalAuditLog {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  action:
    | "record_viewed"
    | "encounter_created"
    | "encounter_finalized"
    | "prescription_issued"
    | "investigation_ordered"
    | "referral_created"
    | "report_reviewed"
    | "medication_problem_resolved";
  entityType: "patient" | "encounter" | "prescription" | "investigation" | "referral" | "report";
  entityId: string;
  details: string;
  timestamp: string;
}

// Notifications
export interface PatientNotification {
  id: string;
  patientId: string;
  title: string;
  message: string;
  type:
    | "appointment"
    | "nursing"
    | "report"
    | "prescription"
    | "medication_problem"
    | "doctor_recommendation"
    | "referral"
    | "general";
  linkUrl: string;
  isRead: boolean;
  isDemo: boolean;
  createdAt: string;
  recommendationId?: string;
  recommendationType?: "investigation" | "referral";
}

// =========================================================================
// PART A: MEDICINE GUIDE & ACTIVE-INGREDIENT FINDER TYPES
// =========================================================================

export interface ActiveIngredientDetail {
  name: string;
  strength: string;
  saltName: string;
  therapeuticClass: string;
  roleDescription?: string;
}

export interface MedicineSourceReference {
  sourceName: string;
  citation: string;
  verifiedDate: string;
  url?: string;
}

export interface MedicineCatalogueItem {
  id: string;
  brandName: string;
  genericName: string;
  activeIngredients: ActiveIngredientDetail[];
  strength: string;
  dosageForm: "tablet" | "capsule" | "syrup" | "injection" | "inhaler" | "drops" | "cream" | "suspension";
  route: string;
  releaseType: "immediate" | "sustained_release" | "extended_release" | "delayed_release";
  manufacturer: string;
  packSize: string;
  mrp: number;
  approxPrice: number;
  isGeneric: boolean;
  janAushadhiEquivalent?: string;
  generalIndications: string[];
  contraindications: string[];
  importantWarnings: string[];
  commonSideEffects: string[];
  pregnancyWarning?: string;
  allergensCovered?: string[];
  sources: MedicineSourceReference[];
  barcode?: string;
  imageUrl?: string;
  lastVerified: string;
}

export interface MedicineOcrResult {
  extractedText: string;
  confidence: number; // 0-100
  candidateMatches: {
    medicine: MedicineCatalogueItem;
    matchConfidence: number;
    matchedFields: string[];
  }[];
  isUncertain: boolean;
  requiresUserConfirmation: boolean;
}

export interface MedicineComparisonGroup {
  targetMedicine: MedicineCatalogueItem;
  exactMatches: MedicineCatalogueItem[];
  differentStrengths: MedicineCatalogueItem[];
  similarTherapeuticClass: MedicineCatalogueItem[];
}

// =========================================================================
// PART B: SAARTHEE HOME-CARE & NURSING MARKETPLACE TYPES
// =========================================================================

export type HomeCareCategoryId =
  | "nursing_staff"
  | "patient_attendants"
  | "elder_care"
  | "baby_care"
  | "specialized_care"
  | "post_operative_care"
  | "physiotherapy"
  | "sleep_study"
  | "injection_visit";

export interface HomeCareCategory {
  id: HomeCareCategoryId;
  name: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  qualificationRequirements: string[];
  idealFor: string[];
  servicesIncluded: string[];
  startingRate: number;
  rateUnit: string; // e.g. "per 12-hr shift" or "per visit"
  isActive: boolean;
}

export type SaartheeProviderTier =
  | "licensed_nurse"
  | "trained_attendant"
  | "elder_care_specialist"
  | "physiotherapist"
  | "diagnostic_technician";

export interface SaartheeProvider {
  id: string;
  name: string;
  title: string;
  photoUrl: string;
  providerTier: SaartheeProviderTier;
  categoryIds: HomeCareCategoryId[];
  qualifications: string[];
  councilRegistration?: string;
  isSaartheeVerified: boolean;
  verificationDate: string;
  experienceYears: number;
  capabilities: string[];
  languages: string[];
  serviceAreas: string[];
  postalCodesCovered: string[];
  availableShifts: ("visit" | "8hr_day" | "12hr_day" | "12hr_night" | "24hr_livein")[];
  shiftRates: {
    visit?: number;
    shift8hr?: number;
    shift12hr?: number;
    shift24hr?: number;
  };
  rating: number;
  reviewCount: number;
  bio: string;
  availabilityStatus: "available_today" | "available_this_week" | "busy";
  isFictionalDemoData: boolean;
}

export interface HomeCareIntakeResponse {
  id: string;
  patientId: string;
  naturalLanguageNeed: string;
  primaryConcern: string;
  careRecipient: "self" | "parent" | "spouse" | "child" | "relative";
  recipientAge?: number;
  startDate: string;
  urgency: "today" | "within_48hrs" | "flexible_this_week";
  bookingFormat: "single_visit" | "several_days" | "recurring_shifts";
  shiftDuration: "short_visit" | "8hr" | "12hr_day" | "12hr_night" | "24hr_livein";
  locationCity: string;
  postalCode: string;
  address: string;
  patientMobility: "independent" | "needs_assistance" | "wheelchair_bound" | "bedridden";
  clinicalEquipmentNeeded: string[];
  budgetMaxPerShift: number;
  preferredGender: "any" | "female" | "male";
  preferredLanguages: string[];
  physicianInstructionsProvided: boolean;
  emergencyFlagsDetected: boolean;
  createdAt: string;
}

export interface ProviderMatchItem {
  provider: SaartheeProvider;
  matchScore: number;
  matchReasons: string[];
  estimatedCost: number;
  rateExplanation: string;
}

export interface HomeCareRecommendationResult {
  intakeId: string;
  recommendedCategoryId: HomeCareCategoryId;
  categoryName: string;
  clinicalRationale: string;
  requiredQualificationLevel: string;
  eligibleProviders: ProviderMatchItem[];
  unmetConstraints?: string[];
}

export type HomeCareBookingStatus =
  | "draft"
  | "request_submitted"
  | "awaiting_saarthee_confirmation"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface SaartheeHomeCareBooking {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  providerTier: SaartheeProviderTier;
  providerPhoto: string;
  categoryId: HomeCareCategoryId;
  categoryName: string;
  careNeedsDescription: string;
  serviceAddress: string;
  postalCode: string;
  requestedDate: string;
  shiftDuration: "short_visit" | "8hr" | "12hr_day" | "12hr_night" | "24hr_livein";
  shiftRate: number;
  numDaysOrVisits: number;
  estimatedTotal: number;
  isPriceFinal: boolean;
  status: HomeCareBookingStatus;
  statusMessage: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

