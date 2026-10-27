"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  MapPin,
  Phone,
  PhoneCall,
  Clock,
  Navigation,
  Info,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  Bed,
} from "lucide-react";
import { Facility } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function HospitalDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/facilities/${id}`)
      .then((res) => res.json())
      .then((data) => setFacility(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#0284C7] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading hospital details...</p>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hospital Not Found</h1>
        <Link href="/hospitals" className="inline-block px-4 py-2 bg-[#0284C7] text-white rounded-xl text-xs font-bold">
          Back to Hospital Finder
        </Link>
      </div>
    );
  }

  const imageSrc = facility.image || "/images/hospital-1.svg";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Path matching Reference 3 */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-800 dark:hover:text-slate-200">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/hospitals" className="hover:text-slate-800 dark:hover:text-slate-200">Hospitals</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-900 dark:text-white">{facility.name}</span>
      </div>

      {/* Main Hospital Hero Card matching Reference 3 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
          {/* Large Hospital Facade Photo */}
          <div className="relative w-full lg:w-[420px] aspect-16/10 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0">
            <span className="absolute top-3 left-3 z-10 text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded shadow-xs">
              DEMO DATA
            </span>
            <Image src={imageSrc} alt={facility.name} fill className="object-cover" priority />
          </div>

          {/* Hospital Information & Action Controls */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
                  {facility.name}
                </h1>
                <p className="text-xs font-semibold text-[#0284C7] uppercase tracking-wide mt-1">
                  Multi-Speciality Hospital
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {facility.address}, {facility.city}, {facility.state} — {facility.pincode}
                </p>
                <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mt-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#0284C7]" />
                  {facility.phone}
                </p>
              </div>

              {/* Status Indicator Pill */}
              <div className="shrink-0 text-right space-y-1">
                <StatusBadge status="AVAILABLE" />
                <p className="text-[10px] font-mono text-slate-400">
                  Last updated: Apr 28, 2025, 10:30 AM
                </p>
                <p className="text-[10px] text-slate-400">
                  Source: Demo Data
                </p>
              </div>
            </div>

            {/* Call Hospital and Get Directions Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`tel:${facility.emergencyPhone}`}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Hospital</span>
              </a>
              <button
                onClick={() => alert(`Directions initiated for: ${facility.name}, ${facility.address}`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0284C7] text-xs font-bold text-slate-700 dark:text-slate-200 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Get Directions</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities & Equipment 4-Pill Grid matching Reference 3 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
            Facilities & Equipment
          </h2>
          <span className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer">
            View All Facilities ›
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* ICU Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
              <Bed className="w-4 h-4 text-[#0284C7]" />
              <span>ICU</span>
            </div>
            <span className="text-xl font-mono font-bold text-slate-900 dark:text-white block">
              12 beds
            </span>
            <div className="pt-1">
              <StatusBadge status="AVAILABLE" />
            </div>
          </div>

          {/* Ventilator Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
              <Activity className="w-4 h-4 text-[#0284C7]" />
              <span>Ventilator</span>
            </div>
            <span className="text-xl font-mono font-bold text-slate-900 dark:text-white block">
              8 units
            </span>
            <div className="pt-1">
              <StatusBadge status="AVAILABLE" />
            </div>
          </div>

          {/* X-Ray Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
              <Stethoscope className="w-4 h-4 text-[#0284C7]" />
              <span>X-Ray</span>
            </div>
            <span className="text-xl font-mono font-bold text-slate-900 dark:text-white block">
              2 units
            </span>
            <div className="pt-1">
              <StatusBadge status="LIMITED" />
            </div>
          </div>

          {/* ECG Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
              <Activity className="w-4 h-4 text-[#0284C7]" />
              <span>ECG</span>
            </div>
            <span className="text-xl font-mono font-bold text-slate-900 dark:text-white block">
              4 units
            </span>
            <div className="pt-1">
              <StatusBadge status="AVAILABLE" />
            </div>
          </div>
        </div>
      </div>

      {/* About Hospital Description & Warning Note matching Reference 3 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">About Hospital</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {facility.name} is a multi-speciality hospital providing quality healthcare services with modern infrastructure and experienced medical professionals.
          </p>
        </div>

        {/* Note Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-800/60 border border-blue-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-slate-900 dark:text-white">Note</span>
            <p className="mt-0.5">
              Please call the hospital to confirm the availability of facilities before visiting. This information is for reference only (DEMO DATA).
            </p>
          </div>
        </div>

        <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Last Updated: Apr 28, 2025, 10:30 AM</span>
          <span>Source: Demo Data</span>
        </div>
      </div>
    </div>
  );
}
