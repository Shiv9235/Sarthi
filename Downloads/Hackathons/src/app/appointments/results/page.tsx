"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Search,
  MapPin,
  Star,
  Clock,
  Hospital,
  ArrowRight,
  Filter,
  Sparkles,
  Video,
  User,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { InteractiveMap } from "../../../components/map/InteractiveMap";
import { StorageService } from "../../../lib/data/storage";
import { Doctor } from "../../../lib/types";

export default function AppointmentResultsPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-8 text-center text-xs text-slate-500">
            Loading matching doctors...
          </div>
        </AppShell>
      }
    >
      <AppointmentResultsContent />
    </Suspense>
  );
}

function AppointmentResultsContent() {
  const searchParams = useSearchParams();
  const allDoctors = StorageService.getDoctors();

  const querySpecialties = searchParams.get("specialties")?.split(",") || [];
  const queryReasoning = searchParams.get("reasoning")?.split("|") || [];
  const queryLocation = searchParams.get("location") || "";

  // Local filter states
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(
    querySpecialties[0] || "all"
  );
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "fee" | "distance">("relevance");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [showMap, setShowMap] = useState(true);

  // Filter & Sort
  const filteredDoctors = useMemo(() => {
    return allDoctors
      .filter((doc) => {
        if (
          searchDoctor &&
          !doc.name.toLowerCase().includes(searchDoctor.toLowerCase()) &&
          !doc.hospitalName.toLowerCase().includes(searchDoctor.toLowerCase())
        ) {
          return false;
        }

        if (
          selectedSpecialty !== "all" &&
          !doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
        ) {
          return false;
        }

        if (
          appointmentTypeFilter !== "all" &&
          !doc.appointmentTypes.includes(appointmentTypeFilter as any)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "fee") return a.consultationFee - b.consultationFee;
        if (sortBy === "distance") return (a.distanceKm || 0) - (b.distanceKm || 0);
        // Default: relevance (recommended specialty matches first)
        const aMatch = querySpecialties.some((s) => a.specialty.includes(s));
        const bMatch = querySpecialties.some((s) => b.specialty.includes(s));
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return b.rating - a.rating;
      });
  }, [allDoctors, searchDoctor, selectedSpecialty, appointmentTypeFilter, sortBy, querySpecialties]);

  const mapMarkers = filteredDoctors.map((doc) => ({
    id: doc.id,
    name: doc.name,
    subtitle: `${doc.specialty} • ${doc.hospitalName}`,
    latitude: doc.latitude,
    longitude: doc.longitude,
    rating: doc.rating,
    address: doc.hospitalAddress,
    fee: doc.consultationFee,
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Doctor Discovery
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                {queryLocation ? `PIN Code ${queryLocation}` : "Nearby Area"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recommended Doctors & Hospitals
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Matched based on your reported symptoms, medical history, location, and verified doctor qualifications.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/appointments/symptoms">
              <Button variant="outline" size="sm">
                Retake Symptom Triage
              </Button>
            </Link>
          </div>
        </div>

        {/* AI Recommendation Reasoning Banner */}
        {queryReasoning.length > 0 && (
          <div className="p-4 rounded-xl bg-cyan-50/80 border border-cyan-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-900 font-bold">
              <Sparkles className="w-4 h-4 text-cyan-700" />
              <span>Why these specialties were matched:</span>
            </div>
            <ul className="list-disc pl-5 text-cyan-800 space-y-0.5">
              {queryReasoning.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Interactive Map Section */}
        {showMap && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                Clinic & Hospital Map Locations (OpenStreetMap Tiles)
              </span>
              <button
                onClick={() => setShowMap(false)}
                className="text-slate-500 hover:text-slate-700 font-normal underline"
              >
                Hide Map
              </button>
            </div>
            <InteractiveMap markers={mapMarkers} height="300px" />
          </div>
        )}

        {/* Filters and Sorting Bar */}
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <Input
                  placeholder="Search doctor name or hospital..."
                  value={searchDoctor}
                  onChange={(e) => setSearchDoctor(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>

              <div className="sm:col-span-3">
                <Select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  options={[
                    { value: "all", label: "Specialty: All" },
                    { value: "Cardiology", label: "Cardiology" },
                    { value: "Internal Medicine", label: "Internal Medicine" },
                    { value: "Orthopedics", label: "Orthopedics" },
                    { value: "Neurology", label: "Neurology" },
                    { value: "Pulmonology", label: "Pulmonology" },
                    { value: "Dermatology", label: "Dermatology" },
                  ]}
                />
              </div>

              <div className="sm:col-span-2">
                <Select
                  value={appointmentTypeFilter}
                  onChange={(e) => setAppointmentTypeFilter(e.target.value)}
                  options={[
                    { value: "all", label: "Format: Any" },
                    { value: "in_person", label: "In-Person Visit" },
                    { value: "teleconsultation", label: "Video Consultation" },
                  ]}
                />
              </div>

              <div className="sm:col-span-2">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  options={[
                    { value: "relevance", label: "Sort: Relevance" },
                    { value: "rating", label: "Highest Rating" },
                    { value: "distance", label: "Closest Distance" },
                    { value: "fee", label: "Lowest Fee" },
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
              <span>Found <strong>{filteredDoctors.length}</strong> matching doctors</span>
              {!showMap && (
                <button
                  onClick={() => setShowMap(true)}
                  className="text-primary-700 font-semibold hover:underline"
                >
                  Show Clinic Map
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Doctor Listings Cards */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-surface-border p-8 space-y-3">
            <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800">No Doctors Match Filters</h3>
            <p className="text-xs text-slate-500">
              Try resetting your specialty or search keywords.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedSpecialty("all");
                setAppointmentTypeFilter("all");
                setSearchDoctor("");
                setSortBy("relevance");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDoctors.map((doc) => {
              const isRecommendedSpecialty = querySpecialties.some((s) =>
                doc.specialty.toLowerCase().includes(s.toLowerCase())
              );

              return (
                <Card
                  key={doc.id}
                  hoverable
                  className={`border-surface-border transition-all ${
                    isRecommendedSpecialty ? "border-l-4 border-l-primary-600" : ""
                  }`}
                >
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      {/* Doctor Details */}
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={doc.photoUrl}
                          alt={doc.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900">
                              {doc.name}
                            </h3>
                            {isRecommendedSpecialty && (
                              <span className="px-2 py-0.5 rounded-full bg-primary-50 border border-primary-200 text-primary-800 text-[10px] font-bold uppercase tracking-wider">
                                Top Specialty Match
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-primary-700">
                            {doc.specialty}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <Hospital className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{doc.hospitalName}</span>
                            {doc.distanceKm && (
                              <span className="text-slate-400">({doc.distanceKm} km away)</span>
                            )}
                          </p>
                          <p className="text-xs text-slate-600 line-clamp-1 pt-1">
                            {doc.bio}
                          </p>
                        </div>
                      </div>

                      {/* Fee & Rating Box */}
                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-xl font-extrabold text-slate-900">
                          ₹{doc.consultationFee.toLocaleString("en-IN")}
                          <span className="text-xs font-normal text-slate-500"> / visit</span>
                        </div>
                        <div className="flex sm:justify-end items-center gap-1 mt-1 text-xs font-bold text-amber-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{doc.rating}</span>
                          <span className="font-normal text-slate-400 text-[11px]">
                            ({doc.reviewCount} verified reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata & Slots */}
                    <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-primary-600" />
                          <span>Next Slot: <strong>{doc.nextAvailableSlot}</strong></span>
                        </span>
                        <span>•</span>
                        <span>{doc.experienceYears} Years Exp</span>
                        <span>•</span>
                        <span>Languages: {doc.languages.join(", ")}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/appointments/doctor/${doc.id}`}>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/appointments/book/${doc.id}`}>
                          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                            Book Consultation
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
