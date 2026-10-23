"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Award,
  Globe2,
  Calendar,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Phone,
  FileCheck,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { StorageService } from "../../../lib/data/storage";
import { HomeCareMatchingService } from "../../../lib/services/home-care-matching-service";

export default function CaregiverDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const saartheeProvider = HomeCareMatchingService.getProviderById(resolvedParams.id);
  const legacyNurse = !saartheeProvider
    ? StorageService.getCaregiverById(resolvedParams.id)
    : null;

  if (!saartheeProvider && !legacyNurse) {
    notFound();
  }

  const name = saartheeProvider ? saartheeProvider.name : legacyNurse!.name;
  const title = saartheeProvider ? saartheeProvider.title : legacyNurse!.title;
  const rating = saartheeProvider ? saartheeProvider.rating : legacyNurse!.rating;
  const reviewCount = saartheeProvider ? saartheeProvider.reviewCount : legacyNurse!.reviewCount;
  const experienceYears = saartheeProvider ? saartheeProvider.experienceYears : legacyNurse!.experienceYears;
  const languages = saartheeProvider ? saartheeProvider.languages : legacyNurse!.languages;
  const serviceArea = saartheeProvider ? saartheeProvider.serviceAreas.join(", ") : legacyNurse!.serviceArea;
  const postalCodes = saartheeProvider ? saartheeProvider.postalCodesCovered : legacyNurse!.postalCodesCovered;
  const bio = saartheeProvider ? saartheeProvider.bio : legacyNurse!.bio;
  const councilReg = saartheeProvider?.councilRegistration;
  const capabilities = saartheeProvider ? saartheeProvider.capabilities : legacyNurse!.specialities;
  const qualifications = saartheeProvider ? saartheeProvider.qualifications : legacyNurse!.qualifications;
  const shiftRate = saartheeProvider ? (saartheeProvider.shiftRates.shift12hr || 2600) : legacyNurse!.shiftRate;

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/nursing" className="hover:text-emerald-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Marketplace
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{name}</span>
        </div>

        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-800 font-extrabold text-2xl shrink-0 shadow-sm">
                {name.replace("Sister ", "").replace("Dr. ", "").replace("Nurse ", "").slice(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {name}
                      </h1>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Saarthee Verified
                      </span>
                    </div>
                    <p className="text-sm font-medium text-emerald-700 mt-0.5">
                      {title}
                    </p>
                    {councilReg && (
                      <p className="text-xs text-gray-400">Council Registration: {councilReg}</p>
                    )}
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-black text-gray-900">
                      ₹{shiftRate.toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-gray-500"> / 12-hr shift</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Doorstep clinical visits from ₹450
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-amber-700 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {rating.toFixed(1)}
                    <span className="font-normal text-gray-400">
                      ({reviewCount} patient reviews)
                    </span>
                  </span>
                  <span>•</span>
                  <span>{experienceYears} Years Clinical Experience</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {serviceArea}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Globe2 className="w-3.5 h-3.5 text-gray-400" />
                    Languages: {languages.join(", ")}
                  </span>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link href={`/nursing/book/${resolvedParams.id}`}>
                    <Button variant="primary">
                      Request Home Care with {name.split(" ")[1] || name}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                  <Link href="/nursing">
                    <Button variant="outline">Browse Other Providers</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Sections: Bio, Qualifications, Specialties */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Bio */}
            <Card>
              <CardHeader className="py-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Professional Background
                </h2>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>{bio}</p>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
                  <strong className="text-gray-900 block font-semibold">
                    Saarthee Clinical Safety Guarantee:
                  </strong>
                  All registered nurses on Saarthee follow strict infection control protocols, sterile technique standards, and maintain transparent care documentation logs.
                </div>
              </CardContent>
            </Card>

            {/* Specialties & Clinical Procedures */}
            <Card>
              <CardHeader className="py-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Specialties & Procedures Supported
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {capabilities.map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs font-medium text-emerald-950"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar: Qualifications & Verification */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <h2 className="text-sm font-bold text-gray-900">
                    Qualifications & Degrees
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {qualifications.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Service Coverage Districts */}
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-700" />
                  <h2 className="text-sm font-bold text-gray-900">
                    PIN Codes Covered
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-gray-600">
                  {serviceArea}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {postalCodes.map((code) => (
                    <span
                      key={code}
                      className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-medium text-gray-700"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
