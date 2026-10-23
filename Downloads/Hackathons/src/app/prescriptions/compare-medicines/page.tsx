"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Search,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  Building2,
  Info,
  ExternalLink,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { AppShell } from "../../../components/layout/AppShell";
import { Card, CardHeader, CardContent } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Alert } from "../../../components/ui/Alert";
import { StorageService } from "../../../lib/data/storage";
import { PharmacyProduct } from "../../../lib/types";

export default function CompareMedicinesPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-8 text-center text-xs text-slate-500">
            Loading medicine prices...
          </div>
        </AppShell>
      }
    >
      <CompareMedicinesContent />
    </Suspense>
  );
}

function CompareMedicinesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const allProducts = StorageService.getPharmacyProducts();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedPharmacy, setSelectedPharmacy] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Group by active medicine formulation so patients compare like with like
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (
        searchQuery &&
        !p.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.genericName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (selectedPharmacy !== "all" && p.pharmacyName !== selectedPharmacy) {
        return false;
      }

      if (inStockOnly && !p.inStock) {
        return false;
      }

      return true;
    });
  }, [allProducts, searchQuery, selectedPharmacy, inStockOnly]);

  // Group by exact medicine name & strength for like-for-like comparison
  const groupedComparisons = useMemo(() => {
    const groups: { [key: string]: PharmacyProduct[] } = {};
    filteredProducts.forEach((p) => {
      const key = `${p.medicineName} (${p.strength})`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
    return groups;
  }, [filteredProducts]);

  return (
    <AppShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/prescriptions" className="hover:text-primary-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Prescriptions
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Medicine Price Comparison</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compare Medicine Prices Across Pharmacies
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Transparent price, delivery speed, and stock comparison across accredited pharmacies for your exact prescribed formulation.
            </p>
          </div>
        </div>

        {/* Clinical Substitution Safety Caution */}
        <Alert type="warning">
          <strong>Prescription & Substitution Policy:</strong> Pharmacists may only substitute generic formulations when authorized by your doctor. Do not independently change dosage or manufacturer strength without clinical consultation.
        </Alert>

        {/* Filter Controls */}
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <Input
                  placeholder="Search brand (e.g. Glycomet, Telma, Atorva) or generic name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>

              <div className="sm:col-span-4">
                <Select
                  value={selectedPharmacy}
                  onChange={(e) => setSelectedPharmacy(e.target.value)}
                  options={[
                    { value: "all", label: "All Accredited Pharmacies" },
                    { value: "Apollo Pharmacy", label: "Apollo Pharmacy" },
                    { value: "Tata 1mg", label: "Tata 1mg" },
                    { value: "Netmeds", label: "Netmeds" },
                  ]}
                />
              </div>

              <div className="sm:col-span-2 flex items-center pt-2 sm:pt-0">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-surface-border text-primary-600 focus:ring-primary-500"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-surface-border text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary-600" />
                Showing prices for <strong>{Object.keys(groupedComparisons).length}</strong> distinct formulations
              </span>
              <span className="font-semibold text-primary-800 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                Sample Pharmacy Catalog Dataset
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Tables Grouped by Formulation */}
        {Object.keys(groupedComparisons).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-surface-border p-8 space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800">No Medicine Matches Found</h3>
            <p className="text-xs text-slate-500">
              Try searching for Glycomet, Telma, or Atorva.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
              View All Medicines
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedComparisons).map(([formulationTitle, items]) => {
              const base = items[0];
              // Find lowest price
              const lowestPrice = Math.min(...items.map((i) => i.price));

              return (
                <Card key={formulationTitle} className="border-surface-border shadow-2xs">
                  <CardHeader className="py-4 bg-slate-50/70 border-b border-surface-border">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">
                          {base.medicineName}
                        </h2>
                        <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-800 text-xs font-bold border border-primary-200">
                          {base.strength}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface text-slate-700 text-xs font-medium border border-surface-border">
                          {base.dosageForm}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Active Ingredient: <strong>{base.activeIngredient}</strong> • Standard Pack: {base.packSize}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-white border-b border-surface-border text-slate-500 font-semibold uppercase">
                          <th className="py-3 px-4">Pharmacy Seller</th>
                          <th className="py-3 px-4">Pack Size</th>
                          <th className="py-3 px-4">Listed Price</th>
                          <th className="py-3 px-4">MRP (Savings)</th>
                          <th className="py-3 px-4">Estimated Delivery</th>
                          <th className="py-3 px-4">Delivery Fee</th>
                          <th className="py-3 px-4">Availability</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.map((prod) => {
                          const isBest = prod.price === lowestPrice;

                          return (
                            <tr
                              key={prod.id}
                              className={`hover:bg-slate-50 transition-colors ${
                                isBest ? "bg-primary-50/20" : ""
                              }`}
                            >
                              <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                <span>{prod.pharmacyName}</span>
                                {isBest && (
                                  <span className="px-1.5 py-0.5 rounded bg-primary-100 text-primary-800 font-extrabold text-[10px]">
                                    Lowest Price
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">{prod.packSize}</td>
                              <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900 text-sm">
                                ₹{prod.price.toFixed(1)}
                              </td>
                              <td className="py-3.5 px-4 text-slate-500">
                                {prod.mrp && prod.mrp > prod.price ? (
                                  <span className="text-slate-400 line-through">
                                    ₹{prod.mrp.toFixed(1)} (Save ₹{(prod.mrp - prod.price).toFixed(1)})
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-slate-700 flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                                <span>{prod.estimatedDelivery}</span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {prod.deliveryFee === 0 ? (
                                  <span className="text-primary-700 font-semibold">Free Delivery</span>
                                ) : (
                                  `+₹${prod.deliveryFee}`
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                {prod.inStock ? (
                                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    In Stock
                                  </span>
                                ) : (
                                  <span className="text-rose-600 font-semibold">Out of Stock</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <Button
                                  variant={isBest ? "primary" : "outline"}
                                  size="sm"
                                  onClick={() =>
                                    alert(
                                      `Simulating redirection to ${prod.pharmacyName} checkout for ${prod.medicineName}`
                                    )
                                  }
                                  rightIcon={<ExternalLink className="w-3 h-3" />}
                                >
                                  Select Seller
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
