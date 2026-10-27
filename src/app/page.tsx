"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Stethoscope,
  Droplet,
  Users,
  Clock,
  Phone,
  PhoneCall,
  ChevronRight,
  Info,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { HeroSearch } from "@/components/ui/HeroSearch";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BloodGroup } from "@/types";

const BLOOD_GROUPS: { group: BloodGroup; status: "AVAILABLE" | "LIMITED" | "UNAVAILABLE" }[] = [
  { group: "A+", status: "AVAILABLE" },
  { group: "A-", status: "LIMITED" },
  { group: "B+", status: "AVAILABLE" },
  { group: "B-", status: "LIMITED" },
  { group: "AB+", status: "AVAILABLE" },
  { group: "AB-", status: "UNAVAILABLE" },
  { group: "O+", status: "AVAILABLE" },
  { group: "O-", status: "LIMITED" },
];

export default function HomePage() {
  const featuredHospitals = [
    {
      id: "fac_apollo_lko",
      name: "City Care Hospital",
      area: "Gomti Nagar, Lucknow",
      phone: "+91 522 408 1234",
      image: "/images/hospital-1.svg",
      status: "AVAILABLE" as const,
      facilities: "ICU, Ventilator, X-Ray, ECG",
      updatedAt: "Apr 28, 2025, 10:30 AM",
    },
    {
      id: "fac_kgmu_lko",
      name: "Sunrise Multispeciality Hospital",
      area: "Hazratganj, Lucknow",
      phone: "+91 522 412 5678",
      image: "/images/hospital-2.svg",
      status: "LIMITED" as const,
      facilities: "ICU, Ventilator, CT Scan, X-Ray",
      updatedAt: "Apr 28, 2025, 09:15 AM",
    },
    {
      id: "fac_max_del",
      name: "LifeCare Hospital",
      area: "Aliganj, Lucknow",
      phone: "+91 522 433 2211",
      image: "/images/hospital-3.svg",
      status: "AVAILABLE" as const,
      facilities: "ICU, X-Ray, ECG",
      updatedAt: "Apr 28, 2025, 09:45 AM",
    },
  ];

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-20">
      {/* 1. HERO SECTION (Layout 1: Landing Page from Reference) */}
      <section className="pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-display font-extrabold text-[#0F172A] dark:text-white leading-[1.15] tracking-tight">
                Better Information. <br />
                <span className="text-[#0284C7]">Faster Connections to Care.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Find hospitals, explore listed medical facilities, and connect with blood banks — all in one place.
              </p>
            </div>

            {/* Functional Search Bar */}
            <div className="pt-2">
              <HeroSearch />
            </div>

            {/* Quick Action 4 Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              {/* Card 1: Find Hospitals */}
              <Link
                href="/hospitals"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl hover:border-[#0284C7] shadow-xs hover:shadow-subtle transition flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-[#0284C7] flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Find Hospitals</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Search nearby hospitals and facilities
                </p>
              </Link>

              {/* Card 2: Explore Facilities */}
              <Link
                href="/hospitals?service=icu"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl hover:border-[#0284C7] shadow-xs hover:shadow-subtle transition flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Explore Facilities</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Check ICU, ventilator, X-ray and more
                </p>
              </Link>

              {/* Card 3: Search Blood Banks */}
              <Link
                href="/blood-banks"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl hover:border-[#0284C7] shadow-xs hover:shadow-subtle transition flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Droplet className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Search Blood Banks</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Find blood availability by group
                </p>
              </Link>

              {/* Card 4: Staff Portal */}
              <Link
                href="/staff/dashboard"
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl hover:border-[#0284C7] shadow-xs hover:shadow-subtle transition flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Staff Portal</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Authorized staff login and updates
                </p>
              </Link>
            </div>
          </div>

          {/* Right Hero Healthcare Illustration */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-4/3 max-w-md rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-float bg-sky-50 dark:bg-slate-800">
              <Image
                src="/images/hero-illustration.svg"
                alt="MediConnect Hospital and Medical Professional Illustration"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED HOSPITALS (DEMO DATA) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Featured Hospitals
            </h2>
            <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded">
              DEMO DATA
            </span>
          </div>
          <Link
            href="/hospitals"
            className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
          >
            <span>View All Hospitals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-card transition flex flex-col justify-between"
            >
              <div>
                {/* Hospital Header and Image */}
                <div className="p-4 flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                    <Image src={hosp.image} alt={hosp.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {hosp.name}
                      </h3>
                      <StatusBadge status={hosp.status} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {hosp.area}
                    </p>
                    <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#0284C7]" />
                      {hosp.phone}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <p className="flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hosp.facilities}</span>
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" />
                    Last updated: {hosp.updatedAt}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/hospitals/${hosp.id}`}
                  className="w-full block text-center py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0284C7] text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-[#0284C7] transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BLOOD AVAILABILITY SHORTCUTS (DEMO DATA) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Blood Availability
            </h2>
            <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded">
              DEMO DATA
            </span>
          </div>
          <Link
            href="/blood-banks"
            className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
          >
            <span>View All Blood Banks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 8-Group Button Row matching Reference 1 */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {BLOOD_GROUPS.map(({ group, status }) => (
            <Link
              key={group}
              href={`/blood-banks?group=${encodeURIComponent(group)}`}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl text-center shadow-xs hover:border-rose-400 hover:shadow-subtle transition flex flex-col items-center justify-center gap-1.5 group"
            >
              <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center group-hover:scale-110 transition">
                <Droplet className="w-4 h-4 fill-rose-600/20" />
              </div>
              <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                {group}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                  status === "AVAILABLE"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : status === "LIMITED"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                }`}
              >
                {status === "AVAILABLE" ? "Available" : status === "LIMITED" ? "Limited" : "Shortage"}
              </span>
            </Link>
          ))}
        </div>

        {/* Reference Disclaimer Pill */}
        <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-slate-800/60 border border-blue-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#0284C7] shrink-0" />
          <span>
            Please call the hospital or blood bank to confirm availability before travelling. This platform provides information for reference only (DEMO DATA).
          </span>
        </div>
      </section>
    </div>
  );
}
