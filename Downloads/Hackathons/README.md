# Care Platform — AI-Powered Healthcare Portal
## Phase 1: Patient-Side Application (Doctor Architecture Ready)

A modern, responsive, and clinical-grade web application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase/PostgreSQL**.

The application provides patients with a unified portal to manage home nursing care, doctor discovery and appointment booking, medical laboratory report analysis with longitudinal comparison, and prescription management with accredited pharmacy price comparisons.

---

## 🌟 Key Capabilities Implemented

### 1. Patient Dashboard (`/dashboard`)
- **Exactly Four Primary Feature Cards:**
  1. **Nursing & Home Care** (`/nursing`)
  2. **Doctor Appointments** (`/appointments`)
  3. **Medical Reports** (`/reports`)
  4. **Prescriptions and Medicines** (`/prescriptions`)
- **Personalized greeting** & dynamic day-time context.
- **Compact health profile summary** (Allergies, chronic conditions, primary care doctor).
- **Live widgets**: Upcoming doctor visits, nursing dispatches, recent lab reports, latest active prescription.

### 2. Module One — Nursing & Home Care (`/nursing`)
- **Category Filter Tabs:** Post-operative care, elderly care, short-duration visits, and 12/24-hour shift packages.
- **Search & Filters:** Search by name or skill, postal code/district, maximum hourly budget slider, language, and immediate availability.
- **Caregiver Listings & Profile (`/nursing/[id]`):** Verified qualifications, clinical specialties, languages, hourly/shift pricing, rating and reviews.
- **Booking Workflow (`/nursing/book/[id]`):** Multi-step form collecting care requirements, date, time slot, duration, and address with transparent price estimates.
- **Booking History (`/nursing/history`):** Complete tracking with working cancellation and rescheduling workflows.

### 3. Module Two — Doctor Appointments (`/appointments`)
- **Symptom Questionnaire (`/appointments/symptoms`):** Plain-language symptom description, onset timing, severity rating, accompanying symptom chips, and automatic reuse of patient allergies and medical history.
- **Clinical Safety Screening:** Real-time screening for red flag emergency symptoms (crushing chest pain, acute respiratory distress, stroke signs, anaphylaxis). Prioritizes clear emergency guidance and hotline links over routine appointments.
- **Doctor & Clinic Discovery (`/appointments/results`):** Specialty relevance matching, distance and postal proximity, rating and verified review counts, consultation fees, and OpenStreetMap interactive tile map with clinic markers.
- **Doctor Details & Booking (`/appointments/doctor/[id]`, `/appointments/book/[id]`):** Slot picker, format toggle (in-person vs teleconsultation), and booking confirmation (`/appointments/confirmation`).
- **Consultation History (`/appointments/history`):** Active bookings with working cancellation and rescheduling dialogs.

### 4. Module Three — Medical Reports (`/reports`)
- **Three Principal Cards:**
  1. **Upload Report (`/reports/upload`)**
  2. **Doctor's Reports (`/reports/doctor-reports`)**
  3. **Compare With Previous Report (`/reports/compare`)**
- **OCR Extraction & Patient Review:** Securely extracts test names, numerical values, units, and stated biological reference ranges. Patients can review and correct any OCR error.
- **Plain-Language Explanations:** Explains biological metrics and terminology cautiously without fabricating ungrounded diagnoses. Formulates questions for the patient's next consultation.
- **Doctor-Approved Reports:** Clear distinction between AI-generated drafts and clinician-approved interpretations.
- **Longitudinal Trend Comparison with Recharts:** Side-by-side comparison of two test dates, calculation of absolute and percentage shifts, unit compatibility validation (flags unit mismatches instead of misleading calculations), and interactive bar charts.

### 5. Module Four — Prescriptions & Medicines (`/prescriptions`)
- **Three Principal Cards:**
  1. **Upload Prescription (`/prescriptions/upload`)**
  2. **Latest Doctor's Prescription (`/prescriptions/latest`)**
  3. **Report a Medication Problem (`/prescriptions/report-problem`)**
- **Handwriting Uncertainty Flagging:** Flags uncertain OCR output to prevent medication errors.
- **Audit Version History:** Maintains prescription versioning (v1, v2) when doctors adjust dosages, distinguishing active from superseded orders.
- **Pharmacovigilance Incident Reporting:** Report side effects, allergic reactions, or medication errors with urgent reaction triage.
- **Accredited Pharmacy Price Comparison (`/prescriptions/compare-medicines`):** Compares like-for-like formulations across Apollo Pharmacy, Tata 1mg, and Netmeds with pricing, delivery times, and stock indicators.

### 6. Authentication & Onboarding
- **Routes:** `/login`, `/signup`, `/forgot-password`, `/onboarding/health-profile`.
- **Pre-populated Demo Patient:** One-click demo sign-in as *Sarah Jenkins* with synthetic records.
- **Multi-step Onboarding:** Collects demographics, conditions, allergies, medications, and emergency contacts with skip/edit support.
- **Health Profile Editor (`/profile/health`):** Fully editable medical profile that syncs with all subsequent clinical workflows.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 15.1.7 (App Router) |
| **Language** | TypeScript 5 |
| **Styling & Design System** | Tailwind CSS 3.4 with custom healthcare palette |
| **Icons** | Lucide React |
| **Charts** | Recharts 2.15 |
| **Forms & Validation** | React Hook Form & Zod |
| **Database & Auth** | Supabase (PostgreSQL) with Row Level Security |
| **Local Demo Persistence** | Reactive browser storage + in-memory hydration |
| **Testing** | Node.js 22 Native Test Runner (`node --test`) |

---

## 🚀 Setup & Run Commands

### Prerequisites
- Node.js `v20+` or `v22+`
- npm `10+`

### Installation
```bash
# 1. Clone repository and install dependencies
npm install

# 2. Set up environment configuration
cp .env.example .env.local

# 3. Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Launch
```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

### Running Test Suite
```bash
npm test
```

---

## 🔑 Demo Mode & Credentials

Care Platform includes a **zero-configuration Local Demo Mode** active by default:
- **No external API keys required** to test all workflows.
- All bookings, reports, profile edits, problem submissions, and notifications persist in `localStorage` across page reloads.
- **One-Click Sign In:** On `/login`, click *"One-Click Sign In as Sarah Jenkins (Demo Patient)"*.
- **Demo Reset:** Use the *"Reset Sample Data"* pill in the top banner or on `/settings` to restore baseline data at any time.

---

## 🗄️ Database Schema & Migrations

The complete relational schema with Row Level Security is provided in:
`supabase/migrations/20261023000000_care_platform_schema.sql`

### Tables Included
1. `profiles`: Patient and doctor profiles, demographics, emergency contacts.
2. `patient_medical_histories`: Conditions, surgical history, family history.
3. `patient_allergies`: Allergens, reactions, clinical severity levels.
4. `patient_medications`: Active and past medication records.
5. `caregivers`: Licensed home nurses, certifications, rates, and coverage zones.
6. `nursing_bookings`: Service requests, address, hours, status, and cost.
7. `doctors`: Specialists, hospitals, consultation fees, ratings, and coordinates.
8. `appointment_bookings`: Consultations, format (in-person/video), symptoms note.
9. `medical_reports`: Reports metadata, AI summaries, doctor approvals.
10. `medical_report_measurements`: Numerical results, units, reference intervals, flags.
11. `prescriptions`: Prescription orders, doctor name, facility, versioning.
12. `prescription_items`: Medicine name, generic, strength, route, frequency.
13. `pharmacy_products`: Pharmacy catalog, prices, delivery estimates, stock.
14. `medication_problems`: Patient-reported side effects and incident reports.
15. `notifications`: Alert stream, read/unread states, record deep links.
16. `audit_logs`: Audit events for sensitive record access and updates.

### Applying to Supabase
```bash
# Push migration to your Supabase project
supabase db push
```

---

## 🛡️ Clinical Safety & Privacy Principles

1. **Safety Red Flags:** Symptom intake immediately diverts potential emergencies to call 911 / 112 rather than delaying care through scheduling.
2. **Preservation of Values:** Medical lab numbers and reference units are strictly preserved.
3. **No Fabricated Diagnoses:** AI assistants generate plain-language explanations and physician discussion questions without attempting to diagnose conditions.
4. **Physician Attribution:** AI-generated text is explicitly labeled as draft and never attributed as doctor-approved unless confirmed by a clinician.
5. **Like-with-Like Comparisons:** Lab metrics with mismatched units or differing test assays are flagged as incomparable to prevent misleading conclusions.
