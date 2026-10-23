import type { MedicineCatalogueItem } from "../types/index.ts";

export const MEDICINE_CATALOGUE: MedicineCatalogueItem[] = [
  // 1. Glycomet 500
  {
    id: "med_glycomet_500",
    brandName: "Glycomet 500 Tablet",
    genericName: "Metformin Hydrochloride",
    activeIngredients: [
      {
        name: "Metformin Hydrochloride",
        strength: "500 mg",
        saltName: "Metformin HCl",
        therapeuticClass: "Biguanide Antidiabetic Agent",
        roleDescription: "Decreases hepatic glucose production and enhances peripheral insulin sensitivity.",
      },
    ],
    strength: "500 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "USV Private Limited",
    packSize: "Strip of 20 tablets",
    mrp: 46.0,
    approxPrice: 38.5,
    isGeneric: false,
    janAushadhiEquivalent: "Jan Aushadhi Metformin 500 (Code #201)",
    generalIndications: [
      "Type 2 Diabetes Mellitus management in adults as monotherapy or adjunct to diet and exercise.",
      "Preventive glycemic regulation in metabolic syndrome under medical supervision.",
    ],
    contraindications: [
      "Severe renal impairment (eGFR < 30 mL/min/1.73m²)",
      "Acute or chronic metabolic acidosis (including diabetic ketoacidosis)",
      "Severe hepatic impairment or active alcohol abuse",
    ],
    importantWarnings: [
      "Lactic Acidosis: Rare but serious metabolic complication; monitor kidney function periodically.",
      "Gastrointestinal: Take with or after meals to reduce stomach discomfort, nausea, or diarrhea.",
      "Temporary Discontinuation: Withhold prior to iodinated radiocontrast imaging procedures.",
    ],
    commonSideEffects: [
      "Nausea or stomach upset",
      "Loose stools or diarrhea (usually transient)",
      "Metallic taste in mouth",
    ],
    pregnancyWarning: "Category B: Insulin is preferred during pregnancy unless directed by endocrinologist.",
    allergensCovered: [],
    sources: [
      {
        sourceName: "Central Drugs Standard Control Organisation (CDSCO)",
        citation: "CDSCO Form 46 Drug Approval Registry, Govt of India",
        verifiedDate: "15/01/2026",
      },
      {
        sourceName: "Indian Pharmacopoeia (IP 2022)",
        citation: "Ministry of Health & Family Welfare, Govt of India",
        verifiedDate: "10/08/2025",
      },
    ],
    barcode: "8901117001423",
    lastVerified: "15/01/2026",
  },

  // 1b. Metfor 500 (Same-Salt Exact Match)
  {
    id: "med_metfor_500",
    brandName: "Metfor 500 Tablet",
    genericName: "Metformin Hydrochloride",
    activeIngredients: [
      {
        name: "Metformin Hydrochloride",
        strength: "500 mg",
        saltName: "Metformin HCl",
        therapeuticClass: "Biguanide Antidiabetic Agent",
      },
    ],
    strength: "500 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "Cipla Limited",
    packSize: "Strip of 20 tablets",
    mrp: 42.0,
    approxPrice: 34.0,
    isGeneric: false,
    generalIndications: [
      "Type 2 Diabetes Mellitus glycemic control.",
    ],
    contraindications: [
      "Severe renal failure (eGFR < 30 mL/min)",
      "Metabolic acidosis",
    ],
    importantWarnings: [
      "Take after meals to mitigate GI discomfort.",
    ],
    commonSideEffects: ["Nausea", "Diarrhea", "Flatulence"],
    sources: [
      {
        sourceName: "CDSCO Approved Product Registry",
        citation: "Govt of India Drug Safety Database",
        verifiedDate: "12/02/2026",
      },
    ],
    lastVerified: "12/02/2026",
  },

  // 1c. Jan Aushadhi Metformin 500 (Generic Same-Salt Equivalent)
  {
    id: "med_janaushadhi_metformin_500",
    brandName: "Jan Aushadhi Metformin 500",
    genericName: "Metformin Hydrochloride",
    activeIngredients: [
      {
        name: "Metformin Hydrochloride",
        strength: "500 mg",
        saltName: "Metformin HCl",
        therapeuticClass: "Biguanide Antidiabetic Agent",
      },
    ],
    strength: "500 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "Bureau of Pharma PSUs of India (BPPI)",
    packSize: "Strip of 10 tablets",
    mrp: 8.5,
    approxPrice: 8.5,
    isGeneric: true,
    generalIndications: [
      "Type 2 Diabetes Mellitus glycemic control.",
    ],
    contraindications: ["Renal failure", "Acidosis"],
    importantWarnings: ["Affordable generic formulation under PMBJP scheme."],
    commonSideEffects: ["Transient mild GI symptoms"],
    sources: [
      {
        sourceName: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
        citation: "Department of Pharmaceuticals, Govt of India",
        verifiedDate: "01/01/2026",
      },
    ],
    lastVerified: "01/01/2026",
  },

  // 1d. Glycomet-SR 500 (Same Salt, Different Release Formulation)
  {
    id: "med_glycomet_sr_500",
    brandName: "Glycomet-SR 500 Tablet",
    genericName: "Metformin Hydrochloride Sustained Release",
    activeIngredients: [
      {
        name: "Metformin Hydrochloride (Sustained Release)",
        strength: "500 mg",
        saltName: "Metformin HCl",
        therapeuticClass: "Biguanide Antidiabetic Agent",
        roleDescription: "Extended matrix delivery allowing once-daily dosing with minimized GI adverse effects.",
      },
    ],
    strength: "500 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "sustained_release",
    manufacturer: "USV Private Limited",
    packSize: "Strip of 20 tablets",
    mrp: 54.0,
    approxPrice: 46.0,
    isGeneric: false,
    generalIndications: [
      "Type 2 Diabetes Mellitus when immediate-release causes gastrointestinal intolerance.",
    ],
    contraindications: ["Severe renal impairment (eGFR < 30 mL/min)"],
    importantWarnings: [
      "Do NOT crush, chew, or split sustained-release matrix tablets. Swallow whole with water.",
    ],
    commonSideEffects: ["Mild GI disturbances (significantly lower incidence than immediate release)"],
    sources: [
      {
        sourceName: "CDSCO Form 46 Drug Approval Registry",
        citation: "CDSCO Formulation Standards",
        verifiedDate: "10/01/2026",
      },
    ],
    lastVerified: "10/01/2026",
  },

  // 2. Telma 40
  {
    id: "med_telma_40",
    brandName: "Telma 40 Tablet",
    genericName: "Telmisartan",
    activeIngredients: [
      {
        name: "Telmisartan",
        strength: "40 mg",
        saltName: "Telmisartan (Free Acid Form)",
        therapeuticClass: "Angiotensin II Receptor Blocker (ARB)",
        roleDescription: "Selectively blocks AT1 receptors causing vasodilation and reducing aldosterone secretion.",
      },
    ],
    strength: "40 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "Glenmark Pharmaceuticals",
    packSize: "Strip of 30 tablets",
    mrp: 290.0,
    approxPrice: 242.0,
    isGeneric: false,
    janAushadhiEquivalent: "Jan Aushadhi Telmisartan 40 (Code #412)",
    generalIndications: [
      "Essential Hypertension (High Blood Pressure) in adults.",
      "Cardiovascular risk reduction in patients with documented atherothrombotic vascular disease.",
    ],
    contraindications: [
      "Hypersensitivity to telmisartan or formulation excipients",
      "Second and third trimesters of pregnancy (fetal toxicity)",
      "Biliary obstructive disorders or severe hepatic impairment",
      "Concomitant use with aliskiren in patients with diabetes",
    ],
    importantWarnings: [
      "Fetal Toxicity: Discontinue immediately when pregnancy is detected.",
      "Hypotension: Transient postural dizziness can occur, especially during initiation or volume depletion.",
      "Hyperkalemia: Monitor serum potassium in patients with renal impairment or taking potassium supplements.",
    ],
    commonSideEffects: [
      "Dizziness or lightheadedness upon standing",
      "Back pain or sinus congestion",
      "Diarrhea (occasional)",
    ],
    pregnancyWarning: "Black Box Warning: Contraindicated in pregnancy; risk of fetal kidney damage.",
    allergensCovered: [],
    sources: [
      {
        sourceName: "CDSCO Drug Safety & Efficacy Registry",
        citation: "Govt of India Drugs Controller General",
        verifiedDate: "20/01/2026",
      },
      {
        sourceName: "British National Formulary (BNF 86)",
        citation: "BMJ Group & Pharmaceutical Press",
        verifiedDate: "15/11/2025",
      },
    ],
    barcode: "8901117002598",
    lastVerified: "20/01/2026",
  },

  // 2b. Telpres 40 (Same-Salt Exact Match)
  {
    id: "med_telpres_40",
    brandName: "Telpres 40 Tablet",
    genericName: "Telmisartan",
    activeIngredients: [
      {
        name: "Telmisartan",
        strength: "40 mg",
        saltName: "Telmisartan",
        therapeuticClass: "Angiotensin II Receptor Blocker (ARB)",
      },
    ],
    strength: "40 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "Abbott Healthcare",
    packSize: "Strip of 30 tablets",
    mrp: 275.0,
    approxPrice: 230.0,
    isGeneric: false,
    generalIndications: ["Essential Hypertension in adults."],
    contraindications: ["Pregnancy", "Biliary obstruction"],
    importantWarnings: ["Check blood pressure regularly; avoid abrupt discontinuation."],
    commonSideEffects: ["Dizziness", "Fatigue"],
    sources: [
      {
        sourceName: "Indian Pharmacopoeia 2022",
        citation: "Monograph on Telmisartan Tablets IP",
        verifiedDate: "05/01/2026",
      },
    ],
    lastVerified: "05/01/2026",
  },

  // 2c. Jan Aushadhi Telmisartan 40 (Generic Same-Salt Equivalent)
  {
    id: "med_janaushadhi_telmisartan_40",
    brandName: "Jan Aushadhi Telmisartan 40",
    genericName: "Telmisartan",
    activeIngredients: [
      {
        name: "Telmisartan",
        strength: "40 mg",
        saltName: "Telmisartan",
        therapeuticClass: "Angiotensin II Receptor Blocker (ARB)",
      },
    ],
    strength: "40 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "Bureau of Pharma PSUs of India (BPPI)",
    packSize: "Strip of 10 tablets",
    mrp: 14.5,
    approxPrice: 14.5,
    isGeneric: true,
    generalIndications: ["Essential Hypertension in adults."],
    contraindications: ["Pregnancy", "Severe hepatic impairment"],
    importantWarnings: ["Quality-tested generic under National Health Mission standards."],
    commonSideEffects: ["Dizziness"],
    sources: [
      {
        sourceName: "PMBJP Formulary",
        citation: "Dept of Pharmaceuticals, Ministry of Chemicals & Fertilizers",
        verifiedDate: "01/01/2026",
      },
    ],
    lastVerified: "01/01/2026",
  },

  // 2d. Telma 20 (Same Active Ingredient, Lower Strength)
  {
    id: "med_telma_20",
    brandName: "Telma 20 Tablet",
    genericName: "Telmisartan",
    activeIngredients: [
      {
        name: "Telmisartan",
        strength: "20 mg",
        saltName: "Telmisartan",
        therapeuticClass: "Angiotensin II Receptor Blocker (ARB)",
      },
    ],
    strength: "20 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "Glenmark Pharmaceuticals",
    packSize: "Strip of 30 tablets",
    mrp: 165.0,
    approxPrice: 138.0,
    isGeneric: false,
    generalIndications: ["Mild hypertension or starting titration in elderly patients."],
    contraindications: ["Pregnancy"],
    importantWarnings: ["Lower strength formulation. Do not substitute 40mg without prescriber approval."],
    commonSideEffects: ["Mild dizziness"],
    sources: [
      {
        sourceName: "CDSCO Registry",
        citation: "Govt of India",
        verifiedDate: "10/01/2026",
      },
    ],
    lastVerified: "10/01/2026",
  },

  // 3. Atorva 10
  {
    id: "med_atorva_10",
    brandName: "Atorva 10 Tablet",
    genericName: "Atorvastatin Calcium",
    activeIngredients: [
      {
        name: "Atorvastatin Calcium",
        strength: "10 mg",
        saltName: "Atorvastatin Trihydrate Calcium Salt",
        therapeuticClass: "HMG-CoA Reductase Inhibitor (Statin)",
        roleDescription: "Inhibits hepatic cholesterol biosynthesis, upregulates LDL receptors, and lowers LDL and triglycerides.",
      },
    ],
    strength: "10 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "Zydus Cadila",
    packSize: "Strip of 15 tablets",
    mrp: 118.0,
    approxPrice: 95.0,
    isGeneric: false,
    janAushadhiEquivalent: "Jan Aushadhi Atorvastatin 10 (Code #119)",
    generalIndications: [
      "Primary hypercholesterolemia and combined mixed dyslipidemia.",
      "Cardiovascular prevention in patients at elevated risk of myocardial infarction or stroke.",
    ],
    contraindications: [
      "Active liver disease or unexplained persistent elevations of transaminases",
      "Pregnancy and lactation",
      "Concomitant strong CYP3A4 inhibitors (e.g. ketoconazole, clarithromycin) at high doses",
    ],
    importantWarnings: [
      "Myopathy / Rhabdomyolysis: Report unexplained muscle pain, tenderness, or weakness promptly.",
      "Liver Enzymes: Liver function tests (LFT) recommended prior to initiation and as clinically indicated.",
      "Administration: Can be taken at any time of day, with or without meals, but bedtime consistency is recommended.",
    ],
    commonSideEffects: [
      "Headache",
      "Mild muscle ache or arthralgia",
      "Mild digestive upset or constipation",
    ],
    pregnancyWarning: "Contraindicated in pregnancy; cholesterol is essential for fetal organ development.",
    allergensCovered: [],
    sources: [
      {
        sourceName: "CDSCO Drug Master File",
        citation: "Govt of India Pharmaceutical Standards",
        verifiedDate: "18/02/2026",
      },
      {
        sourceName: "Indian Pharmacopoeia (IP 2022)",
        citation: "Ministry of Health & Family Welfare",
        verifiedDate: "15/10/2025",
      },
    ],
    barcode: "8901117003885",
    lastVerified: "18/02/2026",
  },

  // 3b. Storvas 10 (Same-Salt Exact Match)
  {
    id: "med_storvas_10",
    brandName: "Storvas 10 Tablet",
    genericName: "Atorvastatin Calcium",
    activeIngredients: [
      {
        name: "Atorvastatin Calcium",
        strength: "10 mg",
        saltName: "Atorvastatin Calcium Salt",
        therapeuticClass: "HMG-CoA Reductase Inhibitor (Statin)",
      },
    ],
    strength: "10 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "Sun Pharma Laboratories",
    packSize: "Strip of 15 tablets",
    mrp: 122.0,
    approxPrice: 98.0,
    isGeneric: false,
    generalIndications: ["Hypercholesterolemia and cardiovascular risk mitigation."],
    contraindications: ["Active liver disease", "Pregnancy"],
    importantWarnings: ["Report muscle soreness immediately."],
    commonSideEffects: ["Muscle aches", "Headache"],
    sources: [
      {
        sourceName: "CDSCO Product Monograph",
        citation: "Central Drugs Standard Control Organisation",
        verifiedDate: "12/01/2026",
      },
    ],
    lastVerified: "12/01/2026",
  },

  // 4. Augmentin 625 Duo (CRITICAL PENICILLIN ALLERGY ITEM)
  {
    id: "med_augmentin_625",
    brandName: "Augmentin 625 Duo Tablet",
    genericName: "Amoxicillin and Potassium Clavulanate",
    activeIngredients: [
      {
        name: "Amoxicillin Trihydrate",
        strength: "500 mg",
        saltName: "Amoxicillin (Penicillin-class beta-lactam)",
        therapeuticClass: "Aminopenicillin Antibiotic",
        roleDescription: "Inhibits bacterial cell wall biosynthesis during active multiplication.",
      },
      {
        name: "Potassium Clavulanate",
        strength: "125 mg",
        saltName: "Clavulanate Potassium",
        therapeuticClass: "Beta-Lactamase Inhibitor",
        roleDescription: "Inactivates beta-lactamase enzymes produced by resistant bacteria.",
      },
    ],
    strength: "625 mg (500mg + 125mg)",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "GlaxoSmithKline Pharmaceuticals (GSK)",
    packSize: "Strip of 10 tablets",
    mrp: 228.0,
    approxPrice: 198.0,
    isGeneric: false,
    generalIndications: [
      "Bacterial infections of the upper and lower respiratory tract (sinusitis, community-acquired pneumonia).",
      "Skin and soft tissue infections, acute bacterial otitis media, urinary tract infections.",
    ],
    contraindications: [
      "History of serious hypersensitivity or anaphylaxis to Penicillins or other beta-lactam agents",
      "Previous history of amoxicillin-clavulanate-associated cholestatic jaundice or hepatic dysfunction",
    ],
    importantWarnings: [
      "CRITICAL ALLERGY RISK: Severe anaphylactic reactions occur in penicillin-allergic patients. Cross-reacts with all aminopenicillins.",
      "Antibiotic Resistance: Use strictly according to medical prescription. Complete the full course.",
      "Hepatic / Renal: Cholestatic jaundice has been reported; dose adjust in renal impairment.",
    ],
    commonSideEffects: [
      "Diarrhea or loose stools",
      "Nausea and vomiting",
      "Candidiasis (oral or vaginal thrush)",
    ],
    pregnancyWarning: "Category B: Considered generally acceptable when prescribed by a physician.",
    allergensCovered: ["Penicillin", "Amoxicillin", "Beta-lactam Antibiotics"],
    sources: [
      {
        sourceName: "CDSCO Antibiotic Safety Advisory",
        citation: "Govt of India National List of Essential Medicines",
        verifiedDate: "05/01/2026",
      },
      {
        sourceName: "British National Formulary (BNF)",
        citation: "Amoxicillin with Clavulanic Acid Monograph",
        verifiedDate: "10/11/2025",
      },
    ],
    barcode: "8901117004122",
    lastVerified: "05/01/2026",
  },

  // 4b. Clavam 625 (Same-Salt Exact Match to Augmentin)
  {
    id: "med_clavam_625",
    brandName: "Clavam 625 Tablet",
    genericName: "Amoxicillin and Potassium Clavulanate",
    activeIngredients: [
      {
        name: "Amoxicillin Trihydrate",
        strength: "500 mg",
        saltName: "Amoxicillin (Penicillin-class)",
        therapeuticClass: "Aminopenicillin Antibiotic",
      },
      {
        name: "Potassium Clavulanate",
        strength: "125 mg",
        saltName: "Clavulanate Potassium",
        therapeuticClass: "Beta-Lactamase Inhibitor",
      },
    ],
    strength: "625 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "Alkem Laboratories",
    packSize: "Strip of 10 tablets",
    mrp: 215.0,
    approxPrice: 185.0,
    isGeneric: false,
    generalIndications: ["Bacterial infections susceptible to beta-lactamase protected penicillins."],
    contraindications: ["Penicillin allergy", "Severe hepatic jaundice"],
    importantWarnings: ["CRITICAL ALLERGY: Strict contraindication in patients with penicillin allergy."],
    commonSideEffects: ["Diarrhea", "Nausea"],
    allergensCovered: ["Penicillin", "Amoxicillin"],
    sources: [
      {
        sourceName: "Indian Pharmacopoeia 2022",
        citation: "Amoxicillin and Clavulanate Potassium Tablets IP",
        verifiedDate: "08/01/2026",
      },
    ],
    lastVerified: "08/01/2026",
  },

  // 5. Pantocid 40
  {
    id: "med_pantocid_40",
    brandName: "Pantocid 40 Tablet",
    genericName: "Pantoprazole Sodium",
    activeIngredients: [
      {
        name: "Pantoprazole Sodium",
        strength: "40 mg",
        saltName: "Pantoprazole Sodium Sesquihydrate",
        therapeuticClass: "Proton Pump Inhibitor (PPI)",
        roleDescription: "Irreversibly inhibits the H+/K+ ATPase pump in gastric parietal cells, suppressing gastric acid secretion.",
      },
    ],
    strength: "40 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "delayed_release",
    manufacturer: "Sun Pharma Laboratories",
    packSize: "Strip of 15 tablets",
    mrp: 172.0,
    approxPrice: 145.0,
    isGeneric: false,
    generalIndications: [
      "Gastroesophageal Reflux Disease (GERD) and erosive esophagitis.",
      "Duodenal and gastric ulcers.",
      "Prevention of NSAID-induced gastrointestinal erosions in high-risk patients.",
    ],
    contraindications: [
      "Hypersensitivity to substituted benzimidazoles (pantoprazole, omeprazole, rabeprazole)",
    ],
    importantWarnings: [
      "Administration: Swallow enteric-coated tablets whole 30-60 minutes before morning breakfast.",
      "Long-term Use: Daily use exceeding 1 year may reduce absorption of Vitamin B12, magnesium, and bone mineral density.",
      "Masking Symptoms: If persistent alarm symptoms (unexplained weight loss, dysphagia) occur, seek medical endoscopy.",
    ],
    commonSideEffects: [
      "Headache",
      "Abdominal pain or constipation",
      "Flatulence or bloating",
    ],
    pregnancyWarning: "Category B: Safe when prescribed; diet and antacids are first-line in pregnancy.",
    allergensCovered: [],
    sources: [
      {
        sourceName: "CDSCO Form 46 Standards",
        citation: "Govt of India Drug Formulary",
        verifiedDate: "14/02/2026",
      },
    ],
    barcode: "8901117005910",
    lastVerified: "14/02/2026",
  },

  // 5b. Pan 40 (Same-Salt Exact Match)
  {
    id: "med_pan_40",
    brandName: "Pan 40 Tablet",
    genericName: "Pantoprazole Sodium",
    activeIngredients: [
      {
        name: "Pantoprazole Sodium",
        strength: "40 mg",
        saltName: "Pantoprazole Sodium",
        therapeuticClass: "Proton Pump Inhibitor (PPI)",
      },
    ],
    strength: "40 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "delayed_release",
    manufacturer: "Alkem Laboratories",
    packSize: "Strip of 15 tablets",
    mrp: 165.0,
    approxPrice: 139.0,
    isGeneric: false,
    generalIndications: ["GERD, hyperacidity, and gastric ulcer protection."],
    contraindications: ["Benzimidazole allergy"],
    importantWarnings: ["Take on an empty stomach in the morning."],
    commonSideEffects: ["Headache", "Nausea"],
    sources: [
      {
        sourceName: "Indian Pharmacopoeia 2022",
        citation: "Pantoprazole Gastro-resistant Tablets IP",
        verifiedDate: "10/01/2026",
      },
    ],
    lastVerified: "10/01/2026",
  },

  // 6. Dolo 650
  {
    id: "med_dolo_650",
    brandName: "Dolo 650 Tablet",
    genericName: "Paracetamol",
    activeIngredients: [
      {
        name: "Paracetamol",
        strength: "650 mg",
        saltName: "Acetaminophen / Paracetamol IP",
        therapeuticClass: "Antipyretic & Analgesic",
        roleDescription: "Inhibits central prostaglandin synthesis; acts on the hypothalamic heat-regulating center.",
      },
    ],
    strength: "650 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "Micro Labs Limited",
    packSize: "Strip of 15 tablets",
    mrp: 35.0,
    approxPrice: 31.0,
    isGeneric: false,
    janAushadhiEquivalent: "Jan Aushadhi Paracetamol 650 (Code #008)",
    generalIndications: [
      "Relief of mild to moderate pain (headache, body ache, toothache).",
      "Reduction of pyrexia (fever) associated with viral or bacterial infections.",
    ],
    contraindications: [
      "Severe active hepatic impairment or acute liver failure",
      "Known hypersensitivity to paracetamol",
    ],
    importantWarnings: [
      "Hepatotoxicity: Do not exceed 4000 mg (4 grams) in 24 hours from all sources combined.",
      "Duplicate Products: Check labels of over-the-counter cold/cough formulations to prevent accidental overdose.",
      "Do not consume alcohol concurrently.",
    ],
    commonSideEffects: [
      "Rare at therapeutic doses; nausea or mild allergic rash in sensitive individuals.",
    ],
    pregnancyWarning: "Category B: Generally considered the safest antipyretic/analgesic during all trimesters when used appropriately.",
    allergensCovered: [],
    sources: [
      {
        sourceName: "Central Drugs Standard Control Organisation (CDSCO)",
        citation: "National List of Essential Medicines 2022",
        verifiedDate: "01/02/2026",
      },
      {
        sourceName: "Indian Pharmacopoeia 2022",
        citation: "Paracetamol Tablets IP Monograph",
        verifiedDate: "15/09/2025",
      },
    ],
    barcode: "8901117006733",
    lastVerified: "01/02/2026",
  },

  // 6b. Calpol 650 (Same-Salt Exact Match)
  {
    id: "med_calpol_650",
    brandName: "Calpol 650 Tablet",
    genericName: "Paracetamol",
    activeIngredients: [
      {
        name: "Paracetamol",
        strength: "650 mg",
        saltName: "Paracetamol IP",
        therapeuticClass: "Antipyretic & Analgesic",
      },
    ],
    strength: "650 mg",
    dosageForm: "tablet",
    route: "Oral",
    releaseType: "immediate",
    manufacturer: "GlaxoSmithKline (GSK)",
    packSize: "Strip of 15 tablets",
    mrp: 34.5,
    approxPrice: 30.5,
    isGeneric: false,
    generalIndications: ["Relief of fever and pain."],
    contraindications: ["Severe liver disease"],
    importantWarnings: ["Maximum 4000 mg per day. Keep 4-6 hours gap between doses."],
    commonSideEffects: ["Minimal side effects at recommended dosages."],
    sources: [
      {
        sourceName: "CDSCO Registry",
        citation: "NLEM Standards",
        verifiedDate: "12/01/2026",
      },
    ],
    lastVerified: "12/01/2026",
  },
];
