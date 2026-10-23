"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Star,
  MapPin,
  Clock,
  Hospital,
  ShieldCheck,
  Award,
  Globe2,
  Video,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { AppShell } from "../../../../components/layout/AppShell";
import { Card, CardHeader, CardContent } from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { StorageService } from "../../../../lib/data/storage";

export default function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const doc = StorageService.getDoctorById(resolvedParams.id);

  if (!doc) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/appointments/results" className="hover:text-primary-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Doctors
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{doc.name}</span>
        </div>

        {/* Doctor Header Profile */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <img
                src={doc.photoUrl}
                alt={doc.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-sm"
              />

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {doc.name}
                    </h1>
                    <p className="text-sm font-semibold text-primary-700 mt-0.5">
                      {doc.specialty}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <Hospital className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.hospitalName} — {doc.hospitalAddress}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-black text-slate-900">
                      ₹{doc.consultationFee.toLocaleString("en-IN")}
                    </div>
                    <p className="text-xs text-slate-400">Consultation Fee</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-amber-700 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {doc.rating}
                    <span className="font-normal text-slate-400">
                      ({doc.reviewCount} verified reviews)
                    </span>
                  </span>
                  <span>•</span>
                  <span>{doc.experienceYears} Years Practice</span>
                  <span>•</span>
                  <span>Languages: {doc.languages.join(", ")}</span>
                  <span>•</span>
                  <span className="text-primary-700 font-semibold">
                    Next Available: {doc.nextAvailableSlot}
                  </span>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link href={`/appointments/book/${doc.id}`}>
                    <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Book Appointment with {doc.name.split(",")[0]}
                    </Button>
                  </Link>
                  <Link href="/appointments/results">
                    <Button variant="outline">Browse Other Doctors</Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biography, Education & Subspecialties */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="py-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Clinical Background & Bio
                </h2>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <p>{doc.bio}</p>

                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Subspecialties & Clinical Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {doc.subspecialties.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-primary-50 text-primary-900 text-xs font-medium border border-primary-200"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Consultation Formats Supported
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Hospital className="w-4 h-4 text-primary-600" />
                      <span>In-Person Clinic Consultation</span>
                    </div>
                    <p className="text-slate-500">
                      Direct physical examination at {doc.hospitalName}.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Video className="w-4 h-4 text-primary-600" />
                      <span>Encrypted Video Teleconsultation</span>
                    </div>
                    <p className="text-slate-500">
                      Secure digital follow-up and prescription review from home.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Education & Qualifications */}
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary-700" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Medical Education & Fellowships
                  </h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-700">
                {doc.education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-primary-600 shrink-0 mt-0.5" />
                    <span>{edu}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Available Days */}
            <Card>
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-700" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Clinic Operating Days
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {doc.availableDays.map((d) => (
                    <span
                      key={d}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      {d}
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
