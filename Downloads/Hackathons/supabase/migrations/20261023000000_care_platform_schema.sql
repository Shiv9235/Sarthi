-- =========================================================================
-- CARE PLATFORM — COMPREHENSIVE HEALTHCARE DATABASE SCHEMA & MIGRATIONS
-- Phase 1: Patient-Side Platform with Doctor Architecture Foundation
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS
CREATE TYPE user_role_type AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE nursing_booking_status_type AS ENUM ('requested', 'awaiting_confirmation', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE appointment_status_type AS ENUM ('requested', 'confirmed', 'completed', 'cancelled');
CREATE TYPE consultation_type_enum AS ENUM ('in_person', 'teleconsultation');
CREATE TYPE report_status_type AS ENUM ('extracted', 'reviewed_by_patient', 'doctor_shared', 'doctor_approved');
CREATE TYPE prescription_status_type AS ENUM ('active', 'superseded', 'completed', 'cancelled', 'uncertain');
CREATE TYPE medication_problem_type AS ENUM ('suspected_side_effect', 'allergy_concern', 'medication_error', 'incorrect_medicine', 'unclear_instructions', 'missing_medicine', 'other');
CREATE TYPE problem_severity_type AS ENUM ('mild', 'moderate', 'severe', 'urgent');

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role_type DEFAULT 'patient' NOT NULL,
    full_name TEXT NOT NULL,
    dob DATE,
    age INT,
    sex TEXT CHECK (sex IN ('male', 'female', 'other', 'prefer_not_to_say')),
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    address TEXT,
    postal_code TEXT,
    preferred_language TEXT DEFAULT 'English',
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. PATIENT MEDICAL HISTORIES
CREATE TABLE IF NOT EXISTS public.patient_medical_histories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    conditions TEXT[] DEFAULT '{}',
    family_history TEXT[] DEFAULT '{}',
    patient_notes TEXT,
    primary_care_provider JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. ALLERGIES
CREATE TABLE IF NOT EXISTS public.patient_allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    allergen TEXT NOT NULL,
    reaction TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe', 'life_threatening')),
    recorded_at DATE DEFAULT CURRENT_DATE NOT NULL
);

-- 5. CURRENT MEDICATIONS
CREATE TABLE IF NOT EXISTS public.patient_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    start_date DATE,
    prescribing_doctor TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. CAREGIVERS (NURSING & HOME CARE)
CREATE TABLE IF NOT EXISTS public.caregivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    photo_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    hourly_rate NUMERIC(10, 2) NOT NULL,
    shift_rate NUMERIC(10, 2) NOT NULL,
    experience_years INT NOT NULL,
    qualifications TEXT[] DEFAULT '{}',
    specialities TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    service_area TEXT NOT NULL,
    postal_codes_covered TEXT[] DEFAULT '{}',
    availability_status TEXT DEFAULT 'available_today',
    is_verified BOOLEAN DEFAULT TRUE,
    bio TEXT,
    certifications TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. NURSING BOOKING REQUESTS
CREATE TABLE IF NOT EXISTS public.nursing_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    caregiver_id UUID NOT NULL REFERENCES public.caregivers(id) ON DELETE RESTRICT,
    service_category TEXT NOT NULL,
    care_needs_description TEXT NOT NULL,
    requested_date DATE NOT NULL,
    requested_time TEXT NOT NULL,
    duration_hours INT NOT NULL,
    service_address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    estimated_cost NUMERIC(10, 2) NOT NULL,
    status nursing_booking_status_type DEFAULT 'requested' NOT NULL,
    status_message TEXT,
    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. DOCTORS & CLINICS
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    subspecialties TEXT[] DEFAULT '{}',
    hospital_name TEXT NOT NULL,
    hospital_address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    consultation_fee NUMERIC(10, 2) NOT NULL,
    experience_years INT NOT NULL,
    languages TEXT[] DEFAULT '{}',
    photo_url TEXT,
    bio TEXT,
    appointment_types TEXT[] DEFAULT '{"in_person"}',
    next_available_slot TEXT,
    available_days TEXT[] DEFAULT '{}',
    education TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. DOCTOR APPOINTMENT BOOKINGS
CREATE TABLE IF NOT EXISTS public.appointment_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    consultation_type consultation_type_enum DEFAULT 'in_person' NOT NULL,
    fee NUMERIC(10, 2) NOT NULL,
    symptoms_summary TEXT,
    status appointment_status_type DEFAULT 'requested' NOT NULL,
    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. MEDICAL REPORTS
CREATE TABLE IF NOT EXISTS public.medical_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    report_date DATE NOT NULL,
    report_type TEXT NOT NULL,
    facility_name TEXT NOT NULL,
    status report_status_type DEFAULT 'extracted' NOT NULL,
    is_doctor_shared BOOLEAN DEFAULT FALSE,
    doctor_name TEXT,
    doctor_notes TEXT,
    doctor_approved_at TIMESTAMPTZ,
    ai_generated_summary TEXT,
    plain_language_explanation TEXT,
    suggested_doctor_questions TEXT[] DEFAULT '{}',
    source_file_name TEXT,
    file_size TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. MEDICAL REPORT MEASUREMENTS
CREATE TABLE IF NOT EXISTS public.medical_report_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.medical_reports(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    value_numeric NUMERIC(12, 4),
    value_text TEXT NOT NULL,
    unit TEXT NOT NULL,
    reference_range_low NUMERIC(12, 4),
    reference_range_high NUMERIC(12, 4),
    reference_text TEXT NOT NULL,
    is_abnormal BOOLEAN DEFAULT FALSE,
    flag TEXT,
    plain_explanation TEXT,
    patient_corrected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. PRESCRIPTIONS
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    prescription_number TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    facility_name TEXT NOT NULL,
    issue_date DATE NOT NULL,
    status prescription_status_type DEFAULT 'active' NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    instructions_notes TEXT,
    source_file_name TEXT,
    file_url TEXT,
    is_doctor_issued BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. PRESCRIPTION ITEMS
CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    generic_name TEXT,
    strength TEXT NOT NULL,
    form TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT NOT NULL,
    instructions TEXT,
    ocr_confidence NUMERIC(5, 2) DEFAULT 100.0,
    uncertain BOOLEAN DEFAULT FALSE
);

-- 14. PHARMACY PRODUCTS & PRICES
CREATE TABLE IF NOT EXISTS public.pharmacy_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_name TEXT NOT NULL,
    generic_name TEXT,
    brand_name TEXT,
    active_ingredient TEXT NOT NULL,
    strength TEXT NOT NULL,
    dosage_form TEXT NOT NULL,
    pack_size TEXT NOT NULL,
    pharmacy_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    mrp NUMERIC(10, 2),
    delivery_fee NUMERIC(10, 2) DEFAULT 0.0,
    estimated_delivery TEXT NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    is_sample_data BOOLEAN DEFAULT TRUE
);

-- 15. MEDICATION PROBLEMS REPORTED BY PATIENT
CREATE TABLE IF NOT EXISTS public.medication_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
    medicine_name TEXT NOT NULL,
    problem_type medication_problem_type NOT NULL,
    severity problem_severity_type NOT NULL,
    description TEXT NOT NULL,
    onset_date DATE NOT NULL,
    emergency_screening_triggered BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'doctor_responded')),
    doctor_response_notes TEXT,
    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    link_url TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 17. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_medical_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nursing_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_report_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read and update their own profile
CREATE POLICY "Users can manage own profile"
    ON public.profiles
    FOR ALL
    USING (auth.uid() = user_id);

-- Patient records: Accessible only by the owner patient
CREATE POLICY "Patients own medical history"
    ON public.patient_medical_histories
    FOR ALL
    USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Patients own allergies"
    ON public.patient_allergies
    FOR ALL
    USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Patients own medications"
    ON public.patient_medications
    FOR ALL
    USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Patients own nursing bookings"
    ON public.nursing_bookings
    FOR ALL
    USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Patients own appointments"
    ON public.appointment_bookings
    FOR ALL
    USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Patients own reports"
    ON public.medical_reports
    FOR ALL
    USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Patients own prescriptions"
    ON public.prescriptions
    FOR ALL
    USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Patients own medication problems"
    ON public.medication_problems
    FOR ALL
    USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Patients own notifications"
    ON public.notifications
    FOR ALL
    USING (patient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Public readable discovery data (Caregivers, Doctors, Pharmacy catalogs)
CREATE POLICY "Anyone can view caregivers"
    ON public.caregivers FOR SELECT USING (true);

CREATE POLICY "Anyone can view doctors"
    ON public.doctors FOR SELECT USING (true);

CREATE POLICY "Anyone can view pharmacy catalog"
    ON public.pharmacy_products FOR SELECT USING (true);
