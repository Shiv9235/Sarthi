"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  GitCompare,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { Alert } from "../../../components/ui/Alert";
import { StorageService } from "../../../lib/data/storage";
import { MedicalReport, ReportMeasurement } from "../../../lib/types";

interface ComparisonRow {
  testName: string;
  previousValue: number | string;
  newValue: number | string;
  unit: string;
  referenceText: string;
  absoluteChange?: number;
  percentageChange?: string;
  trend: "increased" | "decreased" | "unchanged" | "incomparable";
  cautiousExplanation: string;
  isUnitMismatch?: boolean;
}

export default function CompareReportsPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-8 text-center text-xs text-slate-500">
            Loading report comparison matrix...
          </div>
        </AppShell>
      }
    >
      <CompareReportsContent />
    </Suspense>
  );
}

function CompareReportsContent() {
  const searchParams = useSearchParams();
  const initialId1 = searchParams.get("id1");

  const reports = StorageService.getReports();

  // Selected report IDs (Newer report vs Baseline report)
  const [newReportId, setNewReportId] = useState<string>(
    initialId1 || (reports[0]?.id ?? "")
  );
  const [prevReportId, setPrevReportId] = useState<string>(
    reports[1]?.id || (reports[0]?.id ?? "")
  );

  const newReport = reports.find((r) => r.id === newReportId) || reports[0];
  const prevReport = reports.find((r) => r.id === prevReportId) || reports[1];

  // Compute matched measurements comparison
  const comparisonRows: ComparisonRow[] = useMemo(() => {
    if (!newReport || !prevReport || newReport.id === prevReport.id) {
      return [];
    }

    const rows: ComparisonRow[] = [];

    newReport.measurements.forEach((newM) => {
      // Find matching test in older report
      const prevM = prevReport.measurements.find(
        (p) => p.testName.toLowerCase() === newM.testName.toLowerCase()
      );

      if (prevM) {
        // Check unit compatibility
        if (prevM.unit.toLowerCase() !== newM.unit.toLowerCase()) {
          rows.push({
            testName: newM.testName,
            previousValue: `${prevM.valueText} ${prevM.unit}`,
            newValue: `${newM.valueText} ${newM.unit}`,
            unit: "Unit Mismatch",
            referenceText: `${prevM.unit} vs ${newM.unit}`,
            trend: "incomparable",
            isUnitMismatch: true,
            cautiousExplanation:
              "Incomparable: The earlier and newer test utilized different measurement units. Direct numerical comparison would be mathematically misleading.",
          });
          return;
        }

        const prevNum = prevM.valueNumeric ?? parseFloat(prevM.valueText);
        const newNum = newM.valueNumeric ?? parseFloat(newM.valueText);

        if (!isNaN(prevNum) && !isNaN(newNum)) {
          const absDiff = Number((newNum - prevNum).toFixed(2));
          const pctDiff =
            prevNum !== 0
              ? `${(((newNum - prevNum) / prevNum) * 100).toFixed(1)}%`
              : "N/A";

          let trend: "increased" | "decreased" | "unchanged" = "unchanged";
          if (absDiff > 0.001) trend = "increased";
          else if (absDiff < -0.001) trend = "decreased";

          // Cautious contextual explanation without diagnosing
          let explanation = "";
          if (newM.testName.toLowerCase().includes("glucose") || newM.testName.toLowerCase().includes("a1c")) {
            explanation =
              trend === "decreased"
                ? `Numerical reduction of ${Math.abs(absDiff)} ${newM.unit}. While lower values can indicate improved glycemic management, confirm with your physician.`
                : `Numerical rise of ${Math.abs(absDiff)} ${newM.unit}. Discuss lifestyle or therapeutic modifications with your doctor.`;
          } else if (newM.testName.toLowerCase().includes("cholesterol") || newM.testName.toLowerCase().includes("ldl")) {
            explanation =
              trend === "decreased"
                ? `Numerical reduction of ${Math.abs(absDiff)} ${newM.unit}. Statin therapy and diet often aim for downward trends in atherogenic lipoproteins.`
                : `Numerical rise of ${Math.abs(absDiff)} ${newM.unit}. Compare with your target cardiovascular lipid goals with your clinician.`;
          } else {
            explanation = `Observed absolute change of ${absDiff > 0 ? "+" : ""}${absDiff} ${newM.unit}. Requires evaluation in light of symptoms and medication history.`;
          }

          rows.push({
            testName: newM.testName,
            previousValue: prevNum,
            newValue: newNum,
            unit: newM.unit,
            referenceText: newM.referenceText,
            absoluteChange: absDiff,
            percentageChange: pctDiff,
            trend,
            cautiousExplanation: explanation,
          });
        }
      }
    });

    return rows;
  }, [newReport, prevReport]);

  // Chart data for comparable numeric values
  const chartData = useMemo(() => {
    return comparisonRows
      .filter((r) => typeof r.previousValue === "number" && typeof r.newValue === "number")
      .map((r) => ({
        name: r.testName.split(" ")[0],
        Baseline: r.previousValue,
        Latest: r.newValue,
        unit: r.unit,
      }));
  }, [comparisonRows]);

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/reports" className="hover:text-emerald-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Reports Hub
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Compare Previous Report</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compare Lab Measurements Over Time
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Select two test panels to evaluate trajectory. Validates unit compatibility to avoid misleading interpretations.
            </p>
          </div>
        </div>

        {/* Selection Cards for Two Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-teal-200 bg-white">
            <CardHeader className="py-3 bg-teal-50/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-950">
                  Report 1 (Recent / Current)
                </h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Select
                value={newReportId}
                onChange={(e) => setNewReportId(e.target.value)}
                options={reports.map((r) => ({
                  value: r.id,
                  label: `${r.reportDate} — ${r.title} (${r.facilityName})`,
                }))}
              />
              {newReport && (
                <p className="text-xs text-slate-500">
                  Measurements available: <strong>{newReport.measurements.length}</strong>
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-cyan-200 bg-white">
            <CardHeader className="py-3 bg-cyan-50/50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-950">
                  Report 2 (Earlier Baseline)
                </h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Select
                value={prevReportId}
                onChange={(e) => setPrevReportId(e.target.value)}
                options={reports.map((r) => ({
                  value: r.id,
                  label: `${r.reportDate} — ${r.title} (${r.facilityName})`,
                }))}
              />
              {prevReport && (
                <p className="text-xs text-slate-500">
                  Measurements available: <strong>{prevReport.measurements.length}</strong>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Clinical Disclaimer Alert */}
        <Alert type="warning">
          <strong>Clinical Context Caution:</strong> Numerical shifts between tests reflect biological fluctuations and timing. An increase or decrease does not independently diagnose clinical improvement or disease. Discuss all laboratory trends directly with your treating physician.
        </Alert>

        {newReportId === prevReportId ? (
          <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            Please select two different reports above to calculate comparison metrics.
          </div>
        ) : comparisonRows.length === 0 ? (
          <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No overlapping test parameters found between the selected reports.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Recharts Longitudinal Visualizer */}
            {chartData.length > 0 && (
              <Card>
                <CardHeader className="py-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Trajectory Chart (Baseline vs Latest)
                  </h3>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            fontSize: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Bar
                          dataKey="Baseline"
                          fill="#94a3b8"
                          radius={[4, 4, 0, 0]}
                          name={`${prevReport?.reportDate || "Baseline"}`}
                        />
                        <Bar
                          dataKey="Latest"
                          fill="#0d9488"
                          radius={[4, 4, 0, 0]}
                          name={`${newReport?.reportDate || "Latest"}`}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detailed Comparison Table */}
            <Card>
              <CardHeader className="py-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Test Comparison Matrix
                </h3>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                      <th className="py-3 px-4">Test Name</th>
                      <th className="py-3 px-4">Previous ({prevReport?.reportDate})</th>
                      <th className="py-3 px-4">Latest ({newReport?.reportDate})</th>
                      <th className="py-3 px-4">Absolute Shift</th>
                      <th className="py-3 px-4">% Change</th>
                      <th className="py-3 px-4">Movement</th>
                      <th className="py-3 px-4">Interpretation Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comparisonRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {row.testName}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            Ref: {row.referenceText}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {row.previousValue} {row.unit !== "Unit Mismatch" ? row.unit : ""}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {row.newValue} {row.unit !== "Unit Mismatch" ? row.unit : ""}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold">
                          {row.absoluteChange !== undefined ? (
                            <span
                              className={
                                row.absoluteChange > 0
                                  ? "text-slate-900"
                                  : row.absoluteChange < 0
                                  ? "text-teal-700"
                                  : "text-slate-400"
                              }
                            >
                              {row.absoluteChange > 0 ? `+${row.absoluteChange}` : row.absoluteChange} {row.unit}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {row.percentageChange || "—"}
                        </td>
                        <td className="py-3 px-4">
                          {row.trend === "increased" && (
                            <span className="inline-flex items-center gap-1 text-slate-900 font-bold">
                              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                              Increased
                            </span>
                          )}
                          {row.trend === "decreased" && (
                            <span className="inline-flex items-center gap-1 text-teal-700 font-bold">
                              <TrendingDown className="w-3.5 h-3.5 text-teal-600" />
                              Decreased
                            </span>
                          )}
                          {row.trend === "unchanged" && (
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <Minus className="w-3.5 h-3.5" />
                              Stable
                            </span>
                          )}
                          {row.trend === "incomparable" && (
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                              Unit Mismatch
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs text-[11px] leading-relaxed">
                          {row.cautiousExplanation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
