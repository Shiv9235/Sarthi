-- =========================================================================
-- SARTHI HEALTHCARE PLATFORM — PHASE 2 MIGRATION
-- Doctor Portal, Credential Verification & Patient-Doctor Integration
-- =========================================================================

-- 1. ENUMS FOR DOCTOR PORTAL
DO $$ BEGIN
    CREATE TYPE verification_status_type AS ENUM (
        'draft', 'submitted', 'under_review', 'verified', 'rejected', 'additional_info_required'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE access_grant_type AS ENUM (
        'appointment', 'consultation', 'referral', 'explicit_consent'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE encounter_status_type AS ENUM (
        'draft', 'finalized'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE investigation_category_type AS ENUM (
        'pathology_lab', 'radiology_scan'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE investigation_urgency_type AS ENUM (
        'routine', 'urgent', 'immediate'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE recommendation_status_type AS ENUM (
        'recommended', 'accepted_by_patient', 'declined_by_patient', 'booked', 'completed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. DOCTOR PROFILES & VERIFICATION
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    specialty TEXT NOT NULL,
    subspecialties TEXT[] DEFAULT '{}',
    reg_number TEXT NOT NULL,
    council_name TEXT NOT NULL,
    reg_year INT NOT NULL,
    education TEXT[] DEFAULT '{}',
    experience_years INT DEFAULT 0,
    hospital_name TEXT NOT NULL,
    clinic_address TEXT,
    consultation_fee NUMERIC(10, 2) DEFAULT 0,
    teleconsultation_fee NUMERIC(10, 2) DEFAULT 0,
    bio TEXT,
    languages TEXT[] DEFAULT '{"Hindi", "English"}',
    verification_status verification_status_type DEFAULT 'draft' NOT NULL,
    reviewer_notes TEXT,
    submitted_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    available_days TEXT[] DEFAULT '{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"}',
    consultation_hours TEXT DEFAULT '10:00 AM - 04:00 PM',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. DOCTOR SUPPORTING DOCUMENTS FOR CREDENTIAL VERIFICATION
CREATE TABLE IF NOT EXISTS public.doctor_supporting_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('degree', 'council_registration', 'identity_proof', 'clinic_proof', 'other')),
    file_url TEXT NOT NULL,
    file_size TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. DOCTOR-PATIENT ACCESS RELATIONSHIPS
CREATE TABLE IF NOT EXISTS public.doctor_patient_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    access_type access_grant_type DEFAULT 'appointment' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ,
    last_encounter_at TIMESTAMPTZ,
    patient_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_doctor_patient UNIQUE (doctor_id, patient_id)
);

-- 5. CLINICAL ENCOUNTERS (CONSULTATION NOTES)
CREATE TABLE IF NOT EXISTS public.clinical_encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE RESTRICT,
    appointment_id UUID REFERENCES public.appointment_bookings(id) ON DELETE SET NULL,
    encounter_date DATE DEFAULT CURRENT_DATE NOT NULL,
    encounter_type consultation_type_enum DEFAULT 'in_person' NOT NULL,
    chief_complaint TEXT NOT NULL,
    symptoms_history TEXT,
    vitals JSONB DEFAULT '{}',
    examination_findings TEXT,
    provisional_diagnosis TEXT NOT NULL,
    clinical_notes TEXT,
    treatment_plan TEXT NOT NULL,
    follow_up_instructions TEXT,
    follow_up_date DATE,
    status encounter_status_type DEFAULT 'draft' NOT NULL,
    finalized_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. INVESTIGATION REQUESTS (PATHOLOGY & RADIOLOGY ORDERS)
CREATE TABLE IF NOT EXISTS public.investigation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE RESTRICT,
    encounter_id UUID REFERENCES public.clinical_encounters(id) ON DELETE SET NULL,
    category investigation_category_type NOT NULL,
    test_name TEXT NOT NULL,
    clinical_indication TEXT NOT NULL,
    instructions TEXT,
    urgency investigation_urgency_type DEFAULT 'routine' NOT NULL,
    status recommendation_status_type DEFAULT 'recommended' NOT NULL,
    estimated_cost NUMERIC(10, 2),
    recommended_facility TEXT,
    result_report_id UUID REFERENCES public.medical_reports(id) ON DELETE SET NULL,
    decline_reason TEXT,
    decision_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. REFERRAL ORDERS
CREATE TABLE IF NOT EXISTS public.referral_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referring_doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE RESTRICT,
    target_specialty TEXT NOT NULL,
    target_doctor_id UUID REFERENCES public.doctor_profiles(id) ON DELETE SET NULL,
    target_doctor_name TEXT,
    target_hospital TEXT,
    reason_for_referral TEXT NOT NULL,
    clinical_summary TEXT NOT NULL,
    urgency TEXT DEFAULT 'routine' CHECK (urgency IN ('routine', 'priority', 'urgent')),
    status recommendation_status_type DEFAULT 'recommended' NOT NULL,
    decline_reason TEXT,
    decision_at TIMESTAMPTZ,
    appointment_id UUID REFERENCES public.appointment_bookings(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. CLINICAL AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.clinical_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE RESTRICT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =========================================================================
-- INDICES FOR OPTIMIZED ACCESS
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_doc_profiles_verification ON public.doctor_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_doc_patient_rel_doctor ON public.doctor_patient_relationships(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doc_patient_rel_patient ON public.doctor_patient_relationships(patient_id);
CREATE INDEX IF NOT EXISTS idx_encounters_patient ON public.clinical_encounters(patient_id);
CREATE INDEX IF NOT EXISTS idx_encounters_doctor ON public.clinical_encounters(doctor_id);
CREATE INDEX IF NOT EXISTS idx_inv_requests_patient ON public.investigation_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_inv_requests_doctor ON public.investigation_requests(doctor_id);
CREATE INDEX IF NOT EXISTS idx_referral_orders_patient ON public.referral_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_audit_patient ON public.clinical_audit_logs(patient_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_supporting_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_patient_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_audit_logs ENABLE ROW LEVEL SECURITY;

-- Doctor Profiles RLS: Doctors can manage their own profile, anyone can read verified doctors
CREATE POLICY "Public read verified doctors" ON public.doctor_profiles
    FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Doctors manage own profile" ON public.doctor_profiles
    FOR ALL USING (auth.uid() = profile_id);

-- Relationships RLS: Active doctors can view authorized patients
CREATE POLICY "Authorized doctor access to relationships" ON public.doctor_patient_relationships
    FOR SELECT USING (
        doctor_id IN (SELECT id FROM public.doctor_profiles WHERE profile_id = auth.uid())
        OR patient_id = auth.uid()
    );

-- Clinical Encounters: Doctor who authored can edit if draft; patient and authorized doctor can read
CREATE POLICY "Read clinical encounters" ON public.clinical_encounters
    FOR SELECT USING (
        patient_id = auth.uid()
        OR doctor_id IN (SELECT id FROM public.doctor_profiles WHERE profile_id = auth.uid())
    );

CREATE POLICY "Doctor write clinical encounters" ON public.clinical_encounters
    FOR INSERT WITH CHECK (
        doctor_id IN (SELECT id FROM public.doctor_profiles WHERE profile_id = auth.uid() AND verification_status = 'verified')
    );

CREATE POLICY "Doctor update draft encounter" ON public.clinical_encounters
    FOR UPDATE USING (
        doctor_id IN (SELECT id FROM public.doctor_profiles WHERE profile_id = auth.uid())
        AND status = 'draft'
    );

-- Investigation Requests: Doctor can create, patient can read and update status (accept/decline)
CREATE POLICY "Read investigation requests" ON public.investigation_requests
    FOR SELECT USING (
        patient_id = auth.uid()
        OR doctor_id IN (SELECT id FROM public.doctor_profiles WHERE profile_id = auth.uid())
    );

CREATE POLICY "Patient update investigation decision" ON public.investigation_requests
    FOR UPDATE USING (patient_id = auth.uid());

-- Referral Orders: Doctor can create, patient can read and update status (accept/decline)
CREATE POLICY "Read referral orders" ON public.referral_orders
    FOR SELECT USING (
        patient_id = auth.uid()
        OR referring_doctor_id IN (SELECT id FROM public.doctor_profiles WHERE profile_id = auth.uid())
    );

CREATE POLICY "Patient update referral decision" ON public.referral_orders
    FOR UPDATE USING (patient_id = auth.uid());
