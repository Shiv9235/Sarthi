-- =========================================================================
-- SAARTHEE HEALTHCARE PLATFORM — PHASE 4 MIGRATION
-- Medicine Guide, Active-Ingredient Finder & Home-Care Marketplace
-- =========================================================================

-- 1. MEDICINE GUIDE CATALOGUE
CREATE TABLE IF NOT EXISTS public.medicine_catalogue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    strength TEXT NOT NULL,
    dosage_form TEXT NOT NULL,
    route TEXT DEFAULT 'Oral',
    release_type TEXT DEFAULT 'immediate',
    manufacturer TEXT NOT NULL,
    pack_size TEXT NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    approx_price NUMERIC(10, 2) NOT NULL,
    is_generic BOOLEAN DEFAULT FALSE,
    jan_aushadhi_equivalent TEXT,
    general_indications TEXT[] DEFAULT '{}',
    contraindications TEXT[] DEFAULT '{}',
    important_warnings TEXT[] DEFAULT '{}',
    common_side_effects TEXT[] DEFAULT '{}',
    pregnancy_warning TEXT,
    barcode TEXT,
    sources JSONB DEFAULT '[]',
    last_verified DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. MEDICINE ACTIVE INGREDIENTS
CREATE TABLE IF NOT EXISTS public.medicine_active_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID NOT NULL REFERENCES public.medicine_catalogue(id) ON DELETE CASCADE,
    ingredient_name TEXT NOT NULL,
    strength TEXT NOT NULL,
    salt_name TEXT NOT NULL,
    therapeutic_class TEXT NOT NULL,
    role_description TEXT
);

-- 3. HOME CARE SERVICE CATEGORIES (ENCONE INSPIRATION)
CREATE TABLE IF NOT EXISTS public.home_care_service_categories (
    id TEXT PRIMARY KEY, -- e.g. 'nursing_staff', 'post_operative_care'
    name TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    qualification_requirements TEXT[] DEFAULT '{}',
    ideal_for TEXT[] DEFAULT '{}',
    services_included TEXT[] DEFAULT '{}',
    starting_rate NUMERIC(10, 2) NOT NULL,
    rate_unit TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. SAARTHEE-AFFILIATED VERIFIED PROVIDERS
CREATE TABLE IF NOT EXISTS public.saarthee_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    photo_url TEXT,
    provider_tier TEXT NOT NULL CHECK (provider_tier IN ('licensed_nurse', 'trained_attendant', 'elder_care_specialist', 'physiotherapist', 'diagnostic_technician')),
    category_ids TEXT[] DEFAULT '{}',
    qualifications TEXT[] DEFAULT '{}',
    council_registration TEXT,
    is_saarthee_verified BOOLEAN DEFAULT TRUE NOT NULL,
    verification_date DATE DEFAULT CURRENT_DATE,
    experience_years INT DEFAULT 0,
    capabilities TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{"Hindi", "English"}',
    service_areas TEXT[] DEFAULT '{}',
    postal_codes_covered TEXT[] DEFAULT '{}',
    available_shifts TEXT[] DEFAULT '{"12hr_day"}',
    shift_rates JSONB DEFAULT '{}',
    rating NUMERIC(3, 2) DEFAULT 4.90,
    review_count INT DEFAULT 0,
    bio TEXT,
    availability_status TEXT DEFAULT 'available_today',
    is_fictional_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. HOME CARE INTAKE RESPONSES
CREATE TABLE IF NOT EXISTS public.home_care_intakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    natural_language_need TEXT NOT NULL,
    primary_concern TEXT NOT NULL,
    care_recipient TEXT DEFAULT 'self',
    recipient_age INT,
    start_date DATE NOT NULL,
    urgency TEXT DEFAULT 'within_48hrs',
    booking_format TEXT DEFAULT 'recurring_shifts',
    shift_duration TEXT DEFAULT '12hr_day',
    location_city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    address TEXT,
    patient_mobility TEXT DEFAULT 'needs_assistance',
    clinical_equipment_needed TEXT[] DEFAULT '{}',
    budget_max_per_shift NUMERIC(10, 2),
    preferred_gender TEXT DEFAULT 'any',
    preferred_languages TEXT[] DEFAULT '{"Hindi", "English"}',
    physician_instructions_provided BOOLEAN DEFAULT FALSE,
    emergency_flags_detected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. SAARTHEE HOME CARE BOOKINGS
CREATE TABLE IF NOT EXISTS public.saarthee_home_care_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES public.saarthee_providers(id) ON DELETE RESTRICT,
    category_id TEXT NOT NULL REFERENCES public.home_care_service_categories(id),
    service_address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    requested_date DATE NOT NULL,
    shift_duration TEXT NOT NULL,
    shift_rate NUMERIC(10, 2) NOT NULL,
    num_days_or_visits INT DEFAULT 1,
    estimated_total NUMERIC(10, 2) NOT NULL,
    is_price_final BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'request_submitted' CHECK (status IN ('draft', 'request_submitted', 'awaiting_saarthee_confirmation', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    status_message TEXT,
    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =========================================================================
-- INDICES & ROW LEVEL SECURITY
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_med_cat_brand ON public.medicine_catalogue(brand_name);
CREATE INDEX IF NOT EXISTS idx_med_cat_generic ON public.medicine_catalogue(generic_name);
CREATE INDEX IF NOT EXISTS idx_saarthee_prov_tier ON public.saarthee_providers(provider_tier);
CREATE INDEX IF NOT EXISTS idx_shb_patient ON public.saarthee_home_care_bookings(patient_id);

ALTER TABLE public.medicine_catalogue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_care_service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saarthee_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_care_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saarthee_home_care_bookings ENABLE ROW LEVEL SECURITY;

-- Public read for medicine catalogue & active service categories
CREATE POLICY "Public read medicine catalogue" ON public.medicine_catalogue FOR SELECT USING (true);
CREATE POLICY "Public read home care categories" ON public.home_care_service_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read verified saarthee providers" ON public.saarthee_providers FOR SELECT USING (is_saarthee_verified = true);

-- Patient access for own intakes & bookings
CREATE POLICY "Patients manage own intakes" ON public.home_care_intakes
    FOR ALL USING (auth.uid() = patient_id);

CREATE POLICY "Patients manage own home care bookings" ON public.saarthee_home_care_bookings
    FOR ALL USING (auth.uid() = patient_id);
