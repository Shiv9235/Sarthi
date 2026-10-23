"use client";

import {
  UserProfile,
  PatientHealthProfile,
  Caregiver,
  Doctor,
  MedicalReport,
  Prescription,
  PharmacyProduct,
  PatientNotification,
  NursingBooking,
  AppointmentBooking,
  MedicationProblemReport,
  DoctorProfile,
  DoctorPatientRelationship,
  ClinicalEncounter,
  InvestigationRequest,
  ReferralOrder,
  ClinicalAuditLog,
  VerificationStatus,
  HomeCareIntakeResponse,
  SaartheeHomeCareBooking,
} from "../types";

import {
  MOCK_USER,
  MOCK_HEALTH_PROFILE,
  MOCK_CAREGIVERS,
  MOCK_DOCTORS,
  MOCK_REPORTS,
  MOCK_PRESCRIPTIONS,
  MOCK_PHARMACY_PRODUCTS,
  MOCK_NOTIFICATIONS,
  MOCK_NURSING_BOOKINGS,
  MOCK_APPOINTMENT_BOOKINGS,
  MOCK_DOCTOR_PROFILES,
  MOCK_DOCTOR_PATIENT_RELATIONSHIPS,
  MOCK_CLINICAL_ENCOUNTERS,
  MOCK_INVESTIGATION_REQUESTS,
  MOCK_REFERRAL_ORDERS,
  MOCK_CLINICAL_AUDIT_LOGS,
} from "./mock-data";

const STORAGE_KEYS = {
  USER: "care_platform_user",
  HEALTH_PROFILE: "care_platform_health_profile",
  NURSING_BOOKINGS: "care_platform_nursing_bookings",
  APPOINTMENTS: "care_platform_appointments",
  REPORTS: "care_platform_reports",
  PRESCRIPTIONS: "care_platform_prescriptions",
  NOTIFICATIONS: "care_platform_notifications",
  MEDICATION_PROBLEMS: "care_platform_medication_problems",
  AUTH_SESSION: "care_platform_auth_session",
  DOCTOR_PROFILES: "care_platform_doctor_profiles",
  DOCTOR_RELATIONSHIPS: "care_platform_doctor_relationships",
  CLINICAL_ENCOUNTERS: "care_platform_clinical_encounters",
  INVESTIGATION_REQUESTS: "care_platform_investigation_requests",
  REFERRAL_ORDERS: "care_platform_referral_orders",
  CLINICAL_AUDIT_LOGS: "care_platform_clinical_audit_logs",
  HOME_CARE_INTAKES: "saarthee_home_care_intakes",
  HOME_CARE_BOOKINGS: "saarthee_home_care_bookings",
};

// Safe localStorage accessor
function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export const StorageService = {
  // Auth & User Profile
  getUser(): UserProfile {
    return getStoredItem<UserProfile>(STORAGE_KEYS.USER, MOCK_USER);
  },

  setUser(user: UserProfile): void {
    setStoredItem(STORAGE_KEYS.USER, user);
  },

  getHealthProfile(): PatientHealthProfile {
    return getStoredItem<PatientHealthProfile>(
      STORAGE_KEYS.HEALTH_PROFILE,
      MOCK_HEALTH_PROFILE
    );
  },

  setHealthProfile(profile: PatientHealthProfile): void {
    setStoredItem(STORAGE_KEYS.HEALTH_PROFILE, profile);
  },

  // Nursing Caregivers
  getCaregivers(): Caregiver[] {
    return MOCK_CAREGIVERS;
  },

  getCaregiverById(id: string): Caregiver | undefined {
    return MOCK_CAREGIVERS.find((c) => c.id === id);
  },

  getNursingBookings(): NursingBooking[] {
    return getStoredItem<NursingBooking[]>(
      STORAGE_KEYS.NURSING_BOOKINGS,
      MOCK_NURSING_BOOKINGS
    );
  },

  saveNursingBooking(booking: NursingBooking): void {
    const list = this.getNursingBookings();
    const existingIndex = list.findIndex((b) => b.id === booking.id);
    if (existingIndex >= 0) {
      list[existingIndex] = booking;
    } else {
      list.unshift(booking);
    }
    setStoredItem(STORAGE_KEYS.NURSING_BOOKINGS, list);

    // Also trigger simulated notification
    this.addNotification({
      id: `notif_${Date.now()}`,
      patientId: booking.patientId,
      title: "Nursing Care Request Submitted",
      message: `Your booking request for ${booking.caregiverName} (${booking.requestedDate}) has been recorded.`,
      type: "nursing",
      linkUrl: "/nursing/history",
      isRead: false,
      isDemo: true,
      createdAt: new Date().toISOString(),
    });
  },

  cancelNursingBooking(bookingId: string): boolean {
    const list = this.getNursingBookings();
    const target = list.find((b) => b.id === bookingId);
    if (target && target.status !== "completed" && target.status !== "cancelled") {
      target.status = "cancelled";
      target.statusMessage = "Cancelled by patient.";
      target.updatedAt = new Date().toISOString();
      setStoredItem(STORAGE_KEYS.NURSING_BOOKINGS, list);
      return true;
    }
    return false;
  },

  // Doctors & Appointments
  getDoctors(): Doctor[] {
    return MOCK_DOCTORS;
  },

  getDoctorById(id: string): Doctor | undefined {
    return MOCK_DOCTORS.find((d) => d.id === id);
  },

  getAppointmentBookings(): AppointmentBooking[] {
    return getStoredItem<AppointmentBooking[]>(
      STORAGE_KEYS.APPOINTMENTS,
      MOCK_APPOINTMENT_BOOKINGS
    );
  },

  saveAppointmentBooking(appointment: AppointmentBooking): void {
    const list = this.getAppointmentBookings();
    const existingIndex = list.findIndex((a) => a.id === appointment.id);
    if (existingIndex >= 0) {
      list[existingIndex] = appointment;
    } else {
      list.unshift(appointment);
    }
    setStoredItem(STORAGE_KEYS.APPOINTMENTS, list);

    this.addNotification({
      id: `notif_${Date.now()}`,
      patientId: appointment.patientId,
      title: "Doctor Appointment Scheduled",
      message: `Confirmed consultation with ${appointment.doctorName} for ${appointment.appointmentDate} at ${appointment.appointmentTime}.`,
      type: "appointment",
      linkUrl: "/appointments/history",
      isRead: false,
      isDemo: true,
      createdAt: new Date().toISOString(),
    });
  },

  cancelAppointmentBooking(appointmentId: string): boolean {
    const list = this.getAppointmentBookings();
    const target = list.find((a) => a.id === appointmentId);
    if (target && target.status !== "completed" && target.status !== "cancelled") {
      target.status = "cancelled";
      setStoredItem(STORAGE_KEYS.APPOINTMENTS, list);
      return true;
    }
    return false;
  },

  // Medical Reports
  getReports(): MedicalReport[] {
    return getStoredItem<MedicalReport[]>(STORAGE_KEYS.REPORTS, MOCK_REPORTS);
  },

  getReportById(id: string): MedicalReport | undefined {
    const reports = this.getReports();
    return reports.find((r) => r.id === id);
  },

  saveReport(report: MedicalReport): void {
    const list = this.getReports();
    const index = list.findIndex((r) => r.id === report.id);
    if (index >= 0) {
      list[index] = report;
    } else {
      list.unshift(report);
    }
    setStoredItem(STORAGE_KEYS.REPORTS, list);

    this.addNotification({
      id: `notif_${Date.now()}`,
      patientId: report.patientId,
      title: "Medical Report Processed",
      message: `Report "${report.title}" processed with ${report.measurements.length} test measurements ready for review.`,
      type: "report",
      linkUrl: `/reports/${report.id}`,
      isRead: false,
      isDemo: true,
      createdAt: new Date().toISOString(),
    });
  },

  // Prescriptions
  getPrescriptions(): Prescription[] {
    return getStoredItem<Prescription[]>(
      STORAGE_KEYS.PRESCRIPTIONS,
      MOCK_PRESCRIPTIONS
    );
  },

  getPrescriptionById(id: string): Prescription | undefined {
    return this.getPrescriptions().find((p) => p.id === id);
  },

  savePrescription(prescription: Prescription): void {
    const list = this.getPrescriptions();
    const index = list.findIndex((p) => p.id === prescription.id);
    if (index >= 0) {
      list[index] = prescription;
    } else {
      list.unshift(prescription);
    }
    setStoredItem(STORAGE_KEYS.PRESCRIPTIONS, list);

    this.addNotification({
      id: `notif_${Date.now()}`,
      patientId: prescription.patientId,
      title: "Prescription Saved",
      message: `Prescription #${prescription.prescriptionNumber} with ${prescription.items.length} medicines is now saved in your profile.`,
      type: "prescription",
      linkUrl: "/prescriptions/latest",
      isRead: false,
      isDemo: true,
      createdAt: new Date().toISOString(),
    });
  },

  // Pharmacy Comparison
  getPharmacyProducts(): PharmacyProduct[] {
    return MOCK_PHARMACY_PRODUCTS;
  },

  // Medication Problems
  getMedicationProblems(): MedicationProblemReport[] {
    return getStoredItem<MedicationProblemReport[]>(
      STORAGE_KEYS.MEDICATION_PROBLEMS,
      []
    );
  },

  saveMedicationProblem(report: MedicationProblemReport): void {
    const list = this.getMedicationProblems();
    list.unshift(report);
    setStoredItem(STORAGE_KEYS.MEDICATION_PROBLEMS, list);

    this.addNotification({
      id: `notif_${Date.now()}`,
      patientId: report.patientId,
      title: "Medication Issue Logged",
      message: `Report for ${report.medicineName} recorded. In live mode, this alerts your prescriber.`,
      type: "medication_problem",
      linkUrl: "/prescriptions/report-problem",
      isRead: false,
      isDemo: true,
      createdAt: new Date().toISOString(),
    });
  },

  // Notifications
  getNotifications(): PatientNotification[] {
    return getStoredItem<PatientNotification[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      MOCK_NOTIFICATIONS
    );
  },

  addNotification(notif: PatientNotification): void {
    const list = this.getNotifications();
    list.unshift(notif);
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications();
    const target = list.find((n) => n.id === id);
    if (target) {
      target.isRead = true;
      setStoredItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  },

  markAllNotificationsAsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, isRead: true }));
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  // =========================================================================
  // PHASE 2: DOCTOR PORTAL METHODS
  // =========================================================================

  // Doctor Profiles & Verification
  getDoctorProfiles(): DoctorProfile[] {
    return getStoredItem<DoctorProfile[]>(
      STORAGE_KEYS.DOCTOR_PROFILES,
      MOCK_DOCTOR_PROFILES
    );
  },

  getDoctorProfileById(id: string): DoctorProfile | undefined {
    return this.getDoctorProfiles().find((d) => d.id === id);
  },

  saveDoctorProfile(profile: DoctorProfile): void {
    const list = this.getDoctorProfiles();
    const index = list.findIndex((d) => d.id === profile.id);
    if (index >= 0) {
      list[index] = profile;
    } else {
      list.unshift(profile);
    }
    setStoredItem(STORAGE_KEYS.DOCTOR_PROFILES, list);
  },

  updateDoctorVerification(
    id: string,
    status: VerificationStatus,
    reviewerNotes?: string
  ): boolean {
    const list = this.getDoctorProfiles();
    const target = list.find((d) => d.id === id);
    if (target) {
      target.verificationStatus = status;
      if (reviewerNotes) target.reviewerNotes = reviewerNotes;
      if (status === "verified") {
        target.verifiedAt = new Date().toISOString();
      }
      setStoredItem(STORAGE_KEYS.DOCTOR_PROFILES, list);
      return true;
    }
    return false;
  },

  // Doctor-Patient Access Relationships
  getDoctorPatientRelationships(): DoctorPatientRelationship[] {
    return getStoredItem<DoctorPatientRelationship[]>(
      STORAGE_KEYS.DOCTOR_RELATIONSHIPS,
      MOCK_DOCTOR_PATIENT_RELATIONSHIPS
    );
  },

  getAuthorizedPatients(doctorId: string): DoctorPatientRelationship[] {
    return this.getDoctorPatientRelationships().filter(
      (r) => r.doctorId === doctorId && r.isActive
    );
  },

  isDoctorAuthorizedForPatient(doctorId: string, patientId: string): boolean {
    return this.getDoctorPatientRelationships().some(
      (r) => r.doctorId === doctorId && r.patientId === patientId && r.isActive
    );
  },

  grantPatientAccess(rel: DoctorPatientRelationship): void {
    const list = this.getDoctorPatientRelationships();
    const existingIndex = list.findIndex(
      (r) => r.doctorId === rel.doctorId && r.patientId === rel.patientId
    );
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...rel, isActive: true };
    } else {
      list.unshift(rel);
    }
    setStoredItem(STORAGE_KEYS.DOCTOR_RELATIONSHIPS, list);
  },

  // Clinical Encounters (Consultation Notes)
  getClinicalEncounters(patientId?: string, doctorId?: string): ClinicalEncounter[] {
    let list = getStoredItem<ClinicalEncounter[]>(
      STORAGE_KEYS.CLINICAL_ENCOUNTERS,
      MOCK_CLINICAL_ENCOUNTERS
    );
    if (patientId) {
      list = list.filter((e) => e.patientId === patientId);
    }
    if (doctorId) {
      list = list.filter((e) => e.doctorId === doctorId);
    }
    return list;
  },

  getClinicalEncounterById(id: string): ClinicalEncounter | undefined {
    return this.getClinicalEncounters().find((e) => e.id === id);
  },

  saveClinicalEncounter(encounter: ClinicalEncounter): void {
    const list = this.getClinicalEncounters();
    const index = list.findIndex((e) => e.id === encounter.id);
    encounter.updatedAt = new Date().toISOString();
    if (index >= 0) {
      list[index] = encounter;
    } else {
      list.unshift(encounter);
    }
    setStoredItem(STORAGE_KEYS.CLINICAL_ENCOUNTERS, list);

    // Audit log
    this.logClinicalAudit({
      id: `audit_${Date.now()}`,
      patientId: encounter.patientId,
      doctorId: encounter.doctorId,
      doctorName: encounter.doctorName,
      action: encounter.status === "finalized" ? "encounter_finalized" : "encounter_created",
      entityType: "encounter",
      entityId: encounter.id,
      details: `${encounter.status === "finalized" ? "Finalized" : "Saved draft"} encounter: ${encounter.provisionalDiagnosis}`,
      timestamp: new Date().toISOString(),
    });
  },

  finalizeClinicalEncounter(id: string): boolean {
    const list = this.getClinicalEncounters();
    const target = list.find((e) => e.id === id);
    if (target && target.status !== "finalized") {
      target.status = "finalized";
      target.finalizedAt = new Date().toISOString();
      target.updatedAt = new Date().toISOString();
      setStoredItem(STORAGE_KEYS.CLINICAL_ENCOUNTERS, list);

      this.logClinicalAudit({
        id: `audit_${Date.now()}`,
        patientId: target.patientId,
        doctorId: target.doctorId,
        doctorName: target.doctorName,
        action: "encounter_finalized",
        entityType: "encounter",
        entityId: target.id,
        details: `Finalized consultation note for ${target.provisionalDiagnosis}`,
        timestamp: new Date().toISOString(),
      });
      return true;
    }
    return false;
  },

  // Issue Doctor Prescription & Notify Patient
  issueDoctorPrescription(prescription: Prescription): void {
    this.savePrescription(prescription);

    // Audit log
    this.logClinicalAudit({
      id: `audit_${Date.now()}`,
      patientId: prescription.patientId,
      doctorId: "doc_1",
      doctorName: prescription.doctorName,
      action: "prescription_issued",
      entityType: "prescription",
      entityId: prescription.id,
      details: `Prescription #${prescription.prescriptionNumber} issued with ${prescription.items.length} medicines.`,
      timestamp: new Date().toISOString(),
    });
  },

  // Investigation Requests
  getInvestigationRequests(
    patientId?: string,
    doctorId?: string
  ): InvestigationRequest[] {
    let list = getStoredItem<InvestigationRequest[]>(
      STORAGE_KEYS.INVESTIGATION_REQUESTS,
      MOCK_INVESTIGATION_REQUESTS
    );
    if (patientId) {
      list = list.filter((i) => i.patientId === patientId);
    }
    if (doctorId) {
      list = list.filter((i) => i.doctorId === doctorId);
    }
    return list;
  },

  getInvestigationRequestById(id: string): InvestigationRequest | undefined {
    return this.getInvestigationRequests().find((i) => i.id === id);
  },

  saveInvestigationRequest(inv: InvestigationRequest): void {
    const list = this.getInvestigationRequests();
    const index = list.findIndex((i) => i.id === inv.id);
    if (index >= 0) {
      list[index] = inv;
    } else {
      list.unshift(inv);
    }
    setStoredItem(STORAGE_KEYS.INVESTIGATION_REQUESTS, list);

    // If new recommendation, create patient notification
    if (inv.status === "recommended") {
      this.addNotification({
        id: `notif_rec_${Date.now()}`,
        patientId: inv.patientId,
        title: "Doctor Recommends Investigation",
        message: `${inv.doctorName} recommended test: "${inv.testName}". Please review to proceed.`,
        type: "doctor_recommendation",
        linkUrl: `/recommendations/${inv.id}`,
        isRead: false,
        isDemo: true,
        createdAt: new Date().toISOString(),
        recommendationId: inv.id,
        recommendationType: "investigation",
      });
    }

    this.logClinicalAudit({
      id: `audit_${Date.now()}`,
      patientId: inv.patientId,
      doctorId: inv.doctorId,
      doctorName: inv.doctorName,
      action: "investigation_ordered",
      entityType: "investigation",
      entityId: inv.id,
      details: `Ordered ${inv.testName} (${inv.urgency})`,
      timestamp: new Date().toISOString(),
    });
  },

  respondToInvestigationRecommendation(
    id: string,
    decision: "accepted" | "declined",
    declineReason?: string
  ): boolean {
    const list = this.getInvestigationRequests();
    const target = list.find((i) => i.id === id);
    if (target) {
      target.status = decision === "accepted" ? "accepted_by_patient" : "declined_by_patient";
      target.decisionAt = new Date().toISOString();
      if (declineReason) target.declineReason = declineReason;
      setStoredItem(STORAGE_KEYS.INVESTIGATION_REQUESTS, list);
      return true;
    }
    return false;
  },

  // Referral Orders
  getReferralOrders(patientId?: string, doctorId?: string): ReferralOrder[] {
    let list = getStoredItem<ReferralOrder[]>(
      STORAGE_KEYS.REFERRAL_ORDERS,
      MOCK_REFERRAL_ORDERS
    );
    if (patientId) {
      list = list.filter((r) => r.patientId === patientId);
    }
    if (doctorId) {
      list = list.filter((r) => r.referringDoctorId === doctorId);
    }
    return list;
  },

  getReferralOrderById(id: string): ReferralOrder | undefined {
    return this.getReferralOrders().find((r) => r.id === id);
  },

  saveReferralOrder(referral: ReferralOrder): void {
    const list = this.getReferralOrders();
    const index = list.findIndex((r) => r.id === referral.id);
    if (index >= 0) {
      list[index] = referral;
    } else {
      list.unshift(referral);
    }
    setStoredItem(STORAGE_KEYS.REFERRAL_ORDERS, list);

    if (referral.status === "recommended") {
      this.addNotification({
        id: `notif_ref_${Date.now()}`,
        patientId: referral.patientId,
        title: "Specialist Referral Recommended",
        message: `${referral.referringDoctorName} referred you to ${referral.targetDoctorName || referral.targetSpecialty}. Review and confirm.`,
        type: "referral",
        linkUrl: `/recommendations/${referral.id}`,
        isRead: false,
        isDemo: true,
        createdAt: new Date().toISOString(),
        recommendationId: referral.id,
        recommendationType: "referral",
      });
    }

    this.logClinicalAudit({
      id: `audit_${Date.now()}`,
      patientId: referral.patientId,
      doctorId: referral.referringDoctorId,
      doctorName: referral.referringDoctorName,
      action: "referral_created",
      entityType: "referral",
      entityId: referral.id,
      details: `Referred to ${referral.targetSpecialty} (${referral.targetDoctorName || "Specialist"})`,
      timestamp: new Date().toISOString(),
    });
  },

  respondToReferralRecommendation(
    id: string,
    decision: "accepted" | "declined",
    declineReason?: string
  ): boolean {
    const list = this.getReferralOrders();
    const target = list.find((r) => r.id === id);
    if (target) {
      target.status = decision === "accepted" ? "accepted_by_patient" : "declined_by_patient";
      target.decisionAt = new Date().toISOString();
      if (declineReason) target.declineReason = declineReason;
      setStoredItem(STORAGE_KEYS.REFERRAL_ORDERS, list);
      return true;
    }
    return false;
  },

  // Respond to Patient Medication Problems
  respondToMedicationProblem(
    problemId: string,
    doctorResponseNotes: string
  ): boolean {
    const list = this.getMedicationProblems();
    const target = list.find((p) => p.id === problemId);
    if (target) {
      target.status = "doctor_responded";
      target.doctorResponseNotes = doctorResponseNotes;
      setStoredItem(STORAGE_KEYS.MEDICATION_PROBLEMS, list);

      this.addNotification({
        id: `notif_resp_${Date.now()}`,
        patientId: target.patientId,
        title: "Doctor Responded to Medication Issue",
        message: `Your doctor reviewed your note regarding ${target.medicineName} and provided instructions.`,
        type: "medication_problem",
        linkUrl: "/prescriptions/report-problem",
        isRead: false,
        isDemo: true,
        createdAt: new Date().toISOString(),
      });

      this.logClinicalAudit({
        id: `audit_${Date.now()}`,
        patientId: target.patientId,
        doctorId: "doc_1",
        doctorName: "Dr. Arvind Mehta, MD",
        action: "medication_problem_resolved",
        entityType: "prescription",
        entityId: target.id,
        details: `Provided clinical guidance on ${target.medicineName} report`,
        timestamp: new Date().toISOString(),
      });
      return true;
    }
    return false;
  },

  // Approve Medical Report with Doctor Interpretation
  approveMedicalReport(
    reportId: string,
    doctorName: string,
    doctorNotes: string
  ): boolean {
    const list = this.getReports();
    const target = list.find((r) => r.id === reportId);
    if (target) {
      target.status = "doctor_approved";
      target.isDoctorShared = true;
      target.doctorName = doctorName;
      target.doctorNotes = doctorNotes;
      target.doctorApprovedAt = new Date().toISOString();
      setStoredItem(STORAGE_KEYS.REPORTS, list);

      this.addNotification({
        id: `notif_rep_${Date.now()}`,
        patientId: target.patientId,
        title: "Report Approved by Doctor",
        message: `${doctorName} reviewed and added notes to your report "${target.title}".`,
        type: "report",
        linkUrl: `/reports/${target.id}`,
        isRead: false,
        isDemo: true,
        createdAt: new Date().toISOString(),
      });

      this.logClinicalAudit({
        id: `audit_${Date.now()}`,
        patientId: target.patientId,
        doctorId: "doc_1",
        doctorName: doctorName,
        action: "report_reviewed",
        entityType: "report",
        entityId: target.id,
        details: `Doctor signed off and shared findings on ${target.title}`,
        timestamp: new Date().toISOString(),
      });
      return true;
    }
    return false;
  },

  // Clinical Audit Logs
  getClinicalAuditLogs(patientId?: string, doctorId?: string): ClinicalAuditLog[] {
    let list = getStoredItem<ClinicalAuditLog[]>(
      STORAGE_KEYS.CLINICAL_AUDIT_LOGS,
      MOCK_CLINICAL_AUDIT_LOGS
    );
    if (patientId) {
      list = list.filter((l) => l.patientId === patientId);
    }
    if (doctorId) {
      list = list.filter((l) => l.doctorId === doctorId);
    }
    return list;
  },

  logClinicalAudit(log: ClinicalAuditLog): void {
    const list = this.getClinicalAuditLogs();
    list.unshift(log);
    setStoredItem(STORAGE_KEYS.CLINICAL_AUDIT_LOGS, list);
  },

  // =========================================================================
  // PART B: SAARTHEE HOME CARE INTAKE & BOOKINGS
  // =========================================================================

  getHomeCareIntakes(): HomeCareIntakeResponse[] {
    return getStoredItem<HomeCareIntakeResponse[]>(STORAGE_KEYS.HOME_CARE_INTAKES, []);
  },

  getHomeCareIntakeById(id: string): HomeCareIntakeResponse | undefined {
    return this.getHomeCareIntakes().find((i) => i.id === id);
  },

  saveHomeCareIntake(intake: HomeCareIntakeResponse): void {
    const list = this.getHomeCareIntakes();
    const index = list.findIndex((i) => i.id === intake.id);
    if (index >= 0) {
      list[index] = intake;
    } else {
      list.unshift(intake);
    }
    setStoredItem(STORAGE_KEYS.HOME_CARE_INTAKES, list);
  },

  getSaartheeHomeCareBookings(): SaartheeHomeCareBooking[] {
    return getStoredItem<SaartheeHomeCareBooking[]>(STORAGE_KEYS.HOME_CARE_BOOKINGS, [
      {
        id: "shb_001",
        patientId: "patient_001",
        providerId: "sp_1",
        providerName: "Sister Priya Sharma, RN",
        providerTier: "licensed_nurse",
        providerPhoto: "https://images.unsplash.com/photo-1594824813589-32213e2a9010?auto=format&fit=crop&w=600&q=80",
        categoryId: "post_operative_care",
        categoryName: "Post-Operative & Surgical Recovery Care",
        careNeedsDescription: "Post-surgical sterile dressing inspection, drain monitoring, and vitals check.",
        serviceAddress: "Flat 402, Shanti Vihar, Mayur Vihar Phase 1, New Delhi",
        postalCode: "110091",
        requestedDate: "27/10/2026",
        shiftDuration: "12hr_day",
        shiftRate: 2800,
        numDaysOrVisits: 1,
        estimatedTotal: 2800,
        isPriceFinal: false,
        status: "request_submitted",
        statusMessage: "Booking request received. Saarthee care coordinator is confirming provider shift availability.",
        isDemo: true,
        createdAt: "2026-10-23T14:00:00Z",
        updatedAt: "2026-10-23T14:00:00Z",
      },
    ]);
  },

  getSaartheeHomeCareBookingById(id: string): SaartheeHomeCareBooking | undefined {
    return this.getSaartheeHomeCareBookings().find((b) => b.id === id);
  },

  saveSaartheeHomeCareBooking(booking: SaartheeHomeCareBooking): void {
    const list = this.getSaartheeHomeCareBookings();
    const index = list.findIndex((b) => b.id === booking.id);
    if (index >= 0) {
      list[index] = booking;
    } else {
      list.unshift(booking);
    }
    setStoredItem(STORAGE_KEYS.HOME_CARE_BOOKINGS, list);

    this.addNotification({
      id: `notif_shb_${Date.now()}`,
      patientId: booking.patientId,
      title: "Saarthee Home-Care Request Logged",
      message: `Your request for ${booking.providerName} (${booking.categoryName}) is recorded. Status: ${booking.status.replace(/_/g, " ")}.`,
      type: "nursing",
      linkUrl: "/nursing/history",
      isRead: false,
      isDemo: true,
      createdAt: new Date().toISOString(),
    });
  },

  cancelSaartheeHomeCareBooking(bookingId: string): boolean {
    const list = this.getSaartheeHomeCareBookings();
    const target = list.find((b) => b.id === bookingId);
    if (target && target.status !== "completed" && target.status !== "cancelled") {
      target.status = "cancelled";
      target.statusMessage = "Cancelled by patient.";
      target.updatedAt = new Date().toISOString();
      setStoredItem(STORAGE_KEYS.HOME_CARE_BOOKINGS, list);
      return true;
    }
    return false;
  },

  // Reset Demo to Default Seed
  resetDemoData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.HEALTH_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.NURSING_BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.PRESCRIPTIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.MEDICATION_PROBLEMS);
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    localStorage.removeItem(STORAGE_KEYS.DOCTOR_PROFILES);
    localStorage.removeItem(STORAGE_KEYS.DOCTOR_RELATIONSHIPS);
    localStorage.removeItem(STORAGE_KEYS.CLINICAL_ENCOUNTERS);
    localStorage.removeItem(STORAGE_KEYS.INVESTIGATION_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.REFERRAL_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CLINICAL_AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.HOME_CARE_INTAKES);
    localStorage.removeItem(STORAGE_KEYS.HOME_CARE_BOOKINGS);
  },
};
