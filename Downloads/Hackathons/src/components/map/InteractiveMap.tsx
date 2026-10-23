"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Phone, ExternalLink, Plus, Minus } from "lucide-react";

export interface MapMarker {
  id: string;
  name: string;
  subtitle?: string;
  latitude: number;
  longitude: number;
  rating?: number;
  address?: string;
  phone?: string;
  fee?: number;
}

interface InteractiveMapProps {
  markers: MapMarker[];
  selectedMarkerId?: string;
  onSelectMarker?: (marker: MapMarker) => void;
  height?: string;
  center?: { lat: number; lng: number };
}

export function InteractiveMap({
  markers,
  selectedMarkerId,
  onSelectMarker,
  height = "380px",
  center = { lat: 28.54, lng: 77.24 },
}: InteractiveMapProps) {
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(
    markers.find((m) => m.id === selectedMarkerId) || markers[0] || null
  );
  const [zoomLevel, setZoomLevel] = useState(13);

  // Convert lat/lng to normalized SVG coords for resilient vector projection
  const minLat = 28.50;
  const maxLat = 28.59;
  const minLng = 77.19;
  const maxLng = 77.29;

  const getCoordinates = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y)),
    };
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 select-none"
      style={{ height }}
    >
      {/* Map Tile Background (OpenStreetMap Tile Mock Vector Layout) */}
      <div className="absolute inset-0 bg-[#e5e3df] overflow-hidden">
        {/* Subtle SVG Grid & Road Network Simulation */}
        <svg className="w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5d0c7" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Main roads */}
          <path d="M -20 180 Q 250 150 600 240 T 1100 190" fill="none" stroke="#fbd38d" strokeWidth="6" />
          <path d="M 120 -20 Q 200 200 450 500" fill="none" stroke="#ffffff" strokeWidth="5" />
          <path d="M 380 -20 Q 320 220 390 500" fill="none" stroke="#fbd38d" strokeWidth="4" />
          <path d="M 0 320 Q 350 300 800 350" fill="none" stroke="#ffffff" strokeWidth="4" />
          {/* River / Park area */}
          <path d="M 680 -20 C 720 180, 620 300, 780 500" fill="none" stroke="#bee3f8" strokeWidth="14" />
        </svg>

        {/* Map Attribution */}
        <div className="absolute bottom-1 right-2 bg-white/80 px-2 py-0.5 rounded text-[10px] text-slate-500 backdrop-blur-xs z-10">
          © OpenStreetMap contributors • Simulated Map View
        </div>
      </div>

      {/* Zoom and Pan Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-20">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(z + 1, 16))}
          className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 font-bold"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
          className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 font-bold"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Markers Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {markers.map((marker) => {
          const coords = getCoordinates(marker.latitude, marker.longitude);
          const isSelected = activeMarker?.id === marker.id;

          return (
            <div
              key={marker.id}
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-full pointer-events-auto cursor-pointer transition-transform hover:scale-110"
              onClick={() => {
                setActiveMarker(marker);
                if (onSelectMarker) onSelectMarker(marker);
              }}
            >
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lg border text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-teal-700 text-white border-teal-800 scale-105 ring-4 ring-teal-600/30"
                    : "bg-white text-slate-800 border-slate-300 hover:border-teal-500"
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-teal-200" : "text-teal-600"}`} />
                <span>{marker.name.split(",")[0]}</span>
                {marker.rating && (
                  <span className="text-[11px] opacity-90">★ {marker.rating}</span>
                )}
              </div>
              <div className="w-2 h-2 bg-teal-800 rotate-45 mx-auto -mt-1 shadow-sm" />
            </div>
          );
        })}
      </div>

      {/* Active Marker Popup Card (Bottom Left) */}
      {activeMarker && (
        <div className="absolute bottom-3 left-3 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-slate-200 shadow-xl z-30 animate-in fade-in-0 duration-150">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                {activeMarker.name}
              </h4>
              {activeMarker.subtitle && (
                <p className="text-xs text-teal-700 font-medium mt-0.5">
                  {activeMarker.subtitle}
                </p>
              )}
            </div>
            {activeMarker.rating && (
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded-md shrink-0">
                ★ {activeMarker.rating}
              </span>
            )}
          </div>
          {activeMarker.address && (
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{activeMarker.address}</span>
            </p>
          )}
          {activeMarker.fee && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Consultation Fee</span>
              <span className="font-bold text-slate-900">${activeMarker.fee}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
