"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  UploadCloud,
  FileSpreadsheet,
  GitCompare,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Layers,
} from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge, StatusBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { StorageService } from "../../lib/data/storage";
import { MedicalReport } from "../../lib/types";

export default function ReportsLandingPage() {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setReports(StorageService.getReports());
  }, []);

  const filteredReports = reports.filter((rep) => {
    if (selectedCategory === "all") return true;
    return rep.reportType === selectedCategory;
  });

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header without Module Three */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Medical Reports & Records
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/reports/upload">
              <Button variant="primary" size="sm" leftIcon={<UploadCloud className="w-3.5 h-3.5" />}>
                Upload New Report
              </Button>
            </Link>
          </div>
        </div>

        {/* 
          CATEGORY CARDS:
          Must clearly feature:
          1. Pathology Lab Records
          2. Radiological Scans
          3. Upload Report
          4. Compare Reports
          Centered name only, no descriptions, consistent dimensions, clickable.
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 1. Pathology Lab Records */}
          <button
            onClick={() => setSelectedCategory(selectedCategory === "pathology_lab" ? "all" : "pathology_lab")}
            className={`h-36 bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center ${
              selectedCategory === "pathology_lab"
                ? "border-primary-600 bg-primary-50/40 ring-2 ring-primary-600/20"
                : "border-surface-border hover:border-primary-400"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mb-2.5 shadow-2xs">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <span className="text-sm sm:text-base font-bold text-slate-900">
              Pathology Lab Records
            </span>
          </button>

          {/* 2. Radiological Scans */}
          <button
            onClick={() => setSelectedCategory(selectedCategory === "radiology_scan" ? "all" : "radiology_scan")}
            className={`h-36 bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center ${
              selectedCategory === "radiology_scan"
                ? "border-primary-600 bg-primary-50/40 ring-2 ring-primary-600/20"
                : "border-surface-border hover:border-primary-400"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mb-2.5 shadow-2xs">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-sm sm:text-base font-bold text-slate-900">
              Radiological Scans
            </span>
          </button>

          {/* 3. Upload Report */}
          <Link href="/reports/upload" className="group">
            <div className="h-36 bg-white rounded-2xl border border-surface-border p-4 shadow-2xs hover:border-primary-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group-hover:bg-primary-50/30">
              <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary-800 transition-colors">
                Upload Report
              </span>
            </div>
          </Link>

          {/* 4. Compare Reports */}
          <Link href="/reports/compare" className="group">
            <div className="h-36 bg-white rounded-2xl border border-surface-border p-4 shadow-2xs hover:border-primary-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group-hover:bg-primary-50/30">
              <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <GitCompare className="w-6 h-6" />
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary-800 transition-colors">
                Compare Reports
              </span>
            </div>
          </Link>
        </div>

        {/* Filter Indicator if active */}
        {selectedCategory !== "all" && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-primary-50/60 border border-primary-200 text-xs">
            <span className="text-primary-900 font-medium">
              Filtered by: <strong>{selectedCategory === "pathology_lab" ? "Pathology Lab Records" : "Radiological Scans"}</strong>
            </span>
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-primary-700 font-semibold hover:underline"
            >
              Show All Records
            </button>
          </div>
        )}

        {/* Saved Medical Reports List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">
              {selectedCategory === "pathology_lab"
                ? `Pathology Lab Records (${filteredReports.length})`
                : selectedCategory === "radiology_scan"
                ? `Radiological Scans (${filteredReports.length})`
                : `All Saved Medical Reports (${filteredReports.length})`}
            </h2>
            <Link
              href="/reports/compare"
              className="text-xs font-semibold text-primary-700 hover:underline flex items-center gap-1"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Selected</span>
            </Link>
          </div>

          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-border p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800">No Records Found</h3>
              <p className="text-xs text-slate-500">
                No reports found in this category. Upload a document to add it here.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSelectedCategory("all")}>
                View All Records
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((rep) => (
                <Card key={rep.id} hoverable className="border-surface-border">
                  <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Link
                          href={`/reports/${rep.id}`}
                          className="font-bold text-slate-900 hover:text-primary-700 text-sm truncate"
                        >
                          {rep.title}
                        </Link>
                        <StatusBadge status={rep.status} size="sm" />
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
                          {rep.reportType === "pathology_lab"
                            ? "Pathology Lab"
                            : rep.reportType === "radiology_scan"
                            ? "Radiological Scan"
                            : "General Report"}
                        </span>
                        {rep.isDoctorShared && (
                          <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-800 border border-primary-200 text-[10px] font-bold">
                            Doctor Shared
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-3">
                        <span>{rep.facilityName}</span>
                        <span>•</span>
                        <span>Date: {rep.reportDate}</span>
                        <span>•</span>
                        <span>{rep.measurements.length} test measurements</span>
                      </p>
                      {rep.doctorNotes && (
                        <p className="text-xs text-primary-800 italic line-clamp-1 pt-0.5">
                          Note: {rep.doctorNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/reports/${rep.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/reports/compare?id1=${rep.id}`}>
                        <Button variant="primary" size="sm" leftIcon={<GitCompare className="w-3 h-3" />}>
                          Compare
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
