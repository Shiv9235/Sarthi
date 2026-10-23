"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  Search,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Activity,
  Heart,
  Baby,
  Bed,
  Moon,
  Syringe,
  PhoneCall,
  ChevronRight,
  Award,
} from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { HomeCareMatchingService } from "../../lib/services/home-care-matching-service";
import { SAARTHEE_PROVIDERS } from "../../lib/data/home-care-data";
import { HomeCareCategory, SaartheeProvider } from "../../lib/types";

// Category icon mapper helper
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "Stethoscope":
      return <Stethoscope className="w-5 h-5 text-emerald-700" />;
    case "HeartHandshake":
      return <HeartHandshake className="w-5 h-5 text-emerald-700" />;
    case "Heart":
      return <Heart className="w-5 h-5 text-emerald-700" />;
    case "Baby":
      return <Baby className="w-5 h-5 text-emerald-700" />;
    case "Activity":
      return <Activity className="w-5 h-5 text-emerald-700" />;
    case "Bed":
      return <Bed className="w-5 h-5 text-emerald-700" />;
    case "Moon":
      return <Moon className="w-5 h-5 text-emerald-700" />;
    case "Syringe":
      return <Syringe className="w-5 h-5 text-emerald-700" />;
    default:
      return <HeartHandshake className="w-5 h-5 text-emerald-700" />;
  }
};

export default function NursingMarketplacePage() {
  const categories = HomeCareMatchingService.getCategories();
  const allProviders = SAARTHEE_PROVIDERS;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("all");

  // Filter providers
  const filteredProviders = allProviders.filter((p) => {
    if (!p.isSaartheeVerified) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSpecialty = p.capabilities.some((c) => c.toLowerCase().includes(q));
      const matchTitle = p.title.toLowerCase().includes(q);
      if (!matchName && !matchSpecialty && !matchTitle) return false;
    }

    // Location / Area filter
    if (selectedArea !== "all") {
      const matchesArea = p.serviceAreas.some((a) =>
        a.toLowerCase().includes(selectedArea.toLowerCase())
      );
      if (!matchesArea) return false;
    }

    // Category tab filter
    if (selectedCategoryTab !== "all") {
      if (!p.categoryIds.includes(selectedCategoryTab as any)) {
        return false;
      }
    }

    return true;
  });

  return (
    <AppShell>
      <div className="space-y-8 pb-16">
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              Saarthee Verified Home-Care Network
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Home-Care & Nursing Marketplace
            </h1>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Hospital-trained staff nurses, dedicated patient attendants, geriatric specialists,
              and physiotherapists delivered to your home across Delhi NCR with verified credentials.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/nursing/history">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-1.5" />
                My Bookings
              </Button>
            </Link>
            <Link href="/nursing/intake">
              <Button variant="primary" size="sm" className="shadow-sm">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Start Care Intake
              </Button>
            </Link>
          </div>
        </div>

        {/* Guided Care Intake Hero Card (Prompt Requirement: "Why do you need home care today?") */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Guided Care Matching
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Why do you need home care today?
            </h2>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Tell us in your own words what your patient needs—from surgical wound dressings and IV
              infusions to elder companionship or physical therapy. We screen for emergency red flags,
              recommend the clinically appropriate qualification tier, and match verified providers.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/nursing/intake">
                <Button className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold px-5 py-2.5 shadow">
                  Answer Guided Intake Questions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <span className="text-xs text-emerald-200">
                Takes 2 minutes • 100% Free clinical guidance
              </span>
            </div>
          </div>

          <div className="absolute -right-8 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* 9 ENCONE-CARE-INSPIRED SERVICE CATEGORIES SECTION */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Explore Care Services
              </h2>
              <p className="text-xs text-gray-500">
                Select a service category to view specialized qualifications, inclusions, and transparent pricing.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              9 Specialized Care Categories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md">
                      ₹{cat.startingRate} {cat.rateUnit}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">{cat.name}</h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                      {cat.shortDescription}
                    </p>
                  </div>

                  {/* Qualification pill */}
                  <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="font-semibold text-gray-700">Verified Qualification:</span>{" "}
                    {cat.qualificationRequirements[0]}
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Services Included:
                    </span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {cat.servicesIncluded.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/nursing/intake?category=${cat.id}`}
                    className="w-full"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300">
                      Book or Match {cat.name}
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VERIFIED SAARTHEE PROVIDERS SHOWCASE */}
        <div className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Saarthee-Affiliated Verified Care Providers
              </h2>
              <p className="text-xs text-gray-500">
                Only background-checked and council-registered practitioners appear on Saarthee.
              </p>
            </div>

            {/* Area Filter Selector */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="text-xs font-medium bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Delhi NCR</option>
                <option value="South Delhi">South Delhi (Saket, GK, Hauz Khas)</option>
                <option value="East Delhi">East Delhi (Mayur Vihar, Preet Vihar)</option>
                <option value="Noida">Noida & Greater Noida</option>
                <option value="Gurugram">Gurugram (Cyber City, DLF)</option>
                <option value="West Delhi">West Delhi (Janakpuri, Rajouri)</option>
                <option value="Central Delhi">Central Delhi (Connaught Place)</option>
              </select>
            </div>
          </div>

          {/* Category Tabs for Quick Filtering */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
            {[
              { id: "all", label: "All Providers" },
              { id: "nursing_staff", label: "Staff Nurses (B.Sc/GNM)" },
              { id: "patient_attendants", label: "Patient Attendants (GDA)" },
              { id: "elder_care", label: "Elder Care" },
              { id: "post_operative_care", label: "Post-Operative" },
              { id: "physiotherapy", label: "Physiotherapy (BPT)" },
              { id: "sleep_study", label: "Sleep Study (RPSGT)" },
              { id: "injection_visit", label: "Injection Visits" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  selectedCategoryTab === tab.id
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Providers List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-800 font-extrabold text-base shrink-0">
                        {provider.name
                          .replace("Sister ", "")
                          .replace("Dr. ", "")
                          .replace("Nurse ", "")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900 truncate">
                            {provider.name}
                          </h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Saarthee Verified
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 font-medium">{provider.title}</p>

                        {provider.councilRegistration && (
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Reg: {provider.councilRegistration}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {provider.rating.toFixed(1)}
                            <span className="text-gray-400 font-normal">({provider.reviewCount})</span>
                          </span>
                          <span>•</span>
                          <span>{provider.experienceYears} Years Experience</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {provider.bio}
                    </p>

                    {/* Capabilities & Languages */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex flex-wrap gap-1.5">
                        {provider.capabilities.slice(0, 3).map((cap, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-gray-500 flex items-center gap-2 pt-1">
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">
                          Covers: {provider.serviceAreas.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-400 block">Indicative Rate:</span>
                      <div className="text-sm font-extrabold text-gray-900">
                        {provider.shiftRates.shift12hr ? (
                          <>₹{provider.shiftRates.shift12hr} <span className="text-xs font-normal text-gray-500">/ 12-hr shift</span></>
                        ) : provider.shiftRates.visit ? (
                          <>₹{provider.shiftRates.visit} <span className="text-xs font-normal text-gray-500">/ visit</span></>
                        ) : (
                          <>₹{provider.shiftRates.shift24hr} <span className="text-xs font-normal text-gray-500">/ 24-hr live-in</span></>
                        )}
                      </div>
                    </div>

                    <Link href={`/nursing/book/${provider.id}`}>
                      <Button size="sm" variant="primary">
                        Book Provider
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-xs text-gray-500 bg-white rounded-xl border border-gray-200">
                No providers match the selected criteria in this area. Try clearing filters or starting a guided intake.
              </div>
            )}
          </div>
        </div>

        {/* SAARTHEE TRUST & CLINICAL OVERSIGHT BANNER */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                The Saarthee Verification & Safety Guarantee
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Indian healthcare homes trust Saarthee for clinical rigour and patient dignity.
              </p>
            </div>
            <span className="text-xs font-bold bg-white text-emerald-900 px-3 py-1 rounded-full border border-emerald-200">
              Zero Unqualified Attendants
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-emerald-900">
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
              <span className="font-bold block text-gray-900 mb-1">1. Council License Check</span>
              All nurses and therapists must have active registration with State Nursing Council or IAP.
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
              <span className="font-bold block text-gray-900 mb-1">2. Aadhaar & Police Check</span>
              100% verified identities with residential proof and background screening.
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
              <span className="font-bold block text-gray-900 mb-1">3. Clear Scope of Practice</span>
              Attendants are strictly barred from invasive clinical procedures or IV injections.
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100">
              <span className="font-bold block text-gray-900 mb-1">4. Clinical Escalation</span>
              Direct 24/7 hotline to Saarthee supervising physicians in case of vital fluctuations.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
