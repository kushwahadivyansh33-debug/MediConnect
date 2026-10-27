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
  ChevronRight,
  Info,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Heart,
  Activity,
  Shield,
} from "lucide-react";
import { HeroSearch } from "@/components/ui/HeroSearch";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BloodGroup } from "@/types";

const BLOOD_GROUPS: { group: BloodGroup; status: "AVAILABLE" | "LIMITED" | "UNAVAILABLE" }[] = [
  { group: "A+",  status: "AVAILABLE" },
  { group: "A-",  status: "LIMITED" },
  { group: "B+",  status: "AVAILABLE" },
  { group: "B-",  status: "LIMITED" },
  { group: "AB+", status: "AVAILABLE" },
  { group: "AB-", status: "UNAVAILABLE" },
  { group: "O+",  status: "AVAILABLE" },
  { group: "O-",  status: "LIMITED" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Search by Location",
    desc: "Enter your area or city to find nearby hospitals and blood banks.",
    color: "bg-sky-50 dark:bg-sky-950/40 text-[#087FBD]",
  },
  {
    step: "02",
    title: "Check Resource Status",
    desc: "View reported ICU beds, ventilators, equipment, and blood availability.",
    color: "bg-teal-50 dark:bg-teal-950/40 text-teal-600",
  },
  {
    step: "03",
    title: "Contact the Facility",
    desc: "Call the hospital or blood bank directly to confirm before travelling.",
    color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600",
  },
];

const WHY_REASONS = [
  { icon: <Activity className="w-5 h-5" />, title: "Real-time Updates", desc: "Staff update resource status as it changes." },
  { icon: <Shield className="w-5 h-5" />, title: "Verified Sources", desc: "Data sourced directly from authorized hospital staff." },
  { icon: <MapPin className="w-5 h-5" />, title: "Location-based Search", desc: "Find the nearest facilities by area or city." },
  { icon: <Heart className="w-5 h-5" />, title: "Blood Group Matching", desc: "Search all 8 ABO/Rh blood groups simultaneously." },
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
      facilities: "ICU · Ventilator · X-Ray · ECG",
      updatedAt: "Apr 28, 2025 · 10:30 AM",
      beds: 18,
    },
    {
      id: "fac_kgmu_lko",
      name: "Sunrise Multispeciality Hospital",
      area: "Hazratganj, Lucknow",
      phone: "+91 522 412 5678",
      image: "/images/hospital-2.svg",
      status: "LIMITED" as const,
      facilities: "ICU · Ventilator · CT Scan · X-Ray",
      updatedAt: "Apr 28, 2025 · 09:15 AM",
      beds: 6,
    },
    {
      id: "fac_max_del",
      name: "LifeCare Hospital",
      area: "Aliganj, Lucknow",
      phone: "+91 522 433 2211",
      image: "/images/hospital-3.svg",
      status: "AVAILABLE" as const,
      facilities: "ICU · X-Ray · ECG",
      updatedAt: "Apr 28, 2025 · 09:45 AM",
      beds: 12,
    },
  ];

  return (
    <div className="flex flex-col">

      {/* ─── 1. HERO ───────────────────────────────── */}
      <section className="bg-white dark:bg-slate-950 border-b border-[#E4EAF1] dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text + Search */}
            <div className="space-y-8">
              {/* Eyebrow tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#087FBD]/8 dark:bg-[#087FBD]/15 border border-[#087FBD]/20 text-[#087FBD] text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#087FBD] animate-pulse" />
                Hospital Resource & Blood Bank Platform
              </div>

              <div className="space-y-4">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#101828] dark:text-white leading-[1.12] tracking-tight">
                  Find the care and{" "}
                  <span className="text-[#087FBD]">resources you</span>{" "}
                  need, faster.
                </h1>
                <p className="text-base text-[#475467] dark:text-slate-400 max-w-lg leading-relaxed">
                  Search hospitals by area, check ICU and equipment availability, and connect with blood banks — all from one place.
                </p>
              </div>

              {/* Search */}
              <HeroSearch />

              {/* Trust strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#475467] dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Staff-verified data
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  5+ hospitals listed
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  All 8 blood groups
                </span>
              </div>
            </div>

            {/* Right: Illustration + Quick Stats */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#E4EAF1] dark:border-slate-800 shadow-float bg-gradient-to-br from-sky-50 to-white dark:from-slate-800 dark:to-slate-900 aspect-[4/3]">
                <Image
                  src="/images/hero-illustration.svg"
                  alt="Hospital and medical professional illustration"
                  fill
                  priority
                  className="object-cover"
                />
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 shadow-float border border-[#E4EAF1] dark:border-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-[#101828] dark:text-white">ICU Available — City Care</span>
                </div>
              </div>

              {/* Floating card top-right */}
              <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 shadow-float border border-[#E4EAF1] dark:border-slate-700 text-xs font-mono font-bold text-rose-600">
                O+ · 24 units
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. QUICK SERVICE CARDS ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { href: "/hospitals", icon: <Building2 className="w-5 h-5" />, label: "Find Hospitals", desc: "Search hospitals & ICU beds", color: "sky" },
            { href: "/hospitals?service=icu", icon: <Stethoscope className="w-5 h-5" />, label: "Explore Facilities", desc: "ICU, ventilator, X-ray & more", color: "teal" },
            { href: "/blood-banks", icon: <Droplet className="w-5 h-5" />, label: "Blood Banks", desc: "Find blood by group", color: "rose" },
            { href: "/staff/dashboard", icon: <Users className="w-5 h-5" />, label: "Staff Portal", desc: "Authorized updates", color: "amber" },
          ].map(({ href, icon, label, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-4 hover:border-[#087FBD]/40 hover:shadow-card transition-all duration-200 flex flex-col items-center text-center"
            >
              <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center group-hover:scale-105 transition-transform ${
                color === "sky"   ? "bg-sky-50 dark:bg-sky-950/50 text-[#087FBD]"  :
                color === "teal"  ? "bg-teal-50 dark:bg-teal-950/50 text-teal-600"  :
                color === "rose"  ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600"  :
                                    "bg-amber-50 dark:bg-amber-950/50 text-amber-600"
              }`}>
                {icon}
              </div>
              <h3 className="text-sm font-bold text-[#101828] dark:text-white mb-0.5">{label}</h3>
              <p className="text-[11px] text-[#475467] dark:text-slate-400 leading-snug">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 3. FEATURED HOSPITALS ─────────────────── */}
      <section className="bg-[#F7F9FC] dark:bg-slate-900/40 border-y border-[#E4EAF1] dark:border-slate-800/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-bold text-[#101828] dark:text-white">Featured Hospitals</h2>
              <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 rounded-md tracking-wider">
                DEMO DATA
              </span>
            </div>
            <Link
              href="/hospitals"
              className="text-sm font-semibold text-[#087FBD] hover:text-[#0369A1] flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredHospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-card transition-all duration-200 flex flex-col"
              >
                {/* Hospital image */}
                <div className="relative h-36 bg-sky-50 dark:bg-slate-800 overflow-hidden">
                  <Image src={hosp.image} alt={hosp.name} fill className="object-cover" />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={hosp.status} />
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-base text-[#101828] dark:text-white mb-0.5 leading-tight">
                    {hosp.name}
                  </h3>
                  <p className="text-xs text-[#475467] dark:text-slate-400 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 shrink-0" /> {hosp.area}
                  </p>
                  <p className="text-xs font-mono text-[#475467] dark:text-slate-300 flex items-center gap-1.5 mb-3">
                    <Phone className="w-3 h-3 text-[#087FBD]" /> {hosp.phone}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {hosp.facilities.split(" · ").map((f) => (
                      <span key={f} className="text-[10px] font-medium bg-slate-50 dark:bg-slate-800 border border-[#E4EAF1] dark:border-slate-700 text-[#475467] dark:text-slate-400 px-2 py-0.5 rounded-md">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 border-t border-[#E4EAF1] dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {hosp.updatedAt}
                    </span>
                    <Link
                      href={`/hospitals/${hosp.id}`}
                      className="text-xs font-semibold text-[#087FBD] hover:text-[#0369A1] flex items-center gap-1 transition-colors"
                    >
                      Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. BLOOD AVAILABILITY ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-bold text-[#101828] dark:text-white">Blood Availability</h2>
            <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 rounded-md tracking-wider">
              DEMO DATA
            </span>
          </div>
          <Link
            href="/blood-banks"
            className="text-sm font-semibold text-[#087FBD] hover:text-[#0369A1] flex items-center gap-1 transition-colors"
          >
            All Blood Banks <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {BLOOD_GROUPS.map(({ group, status }) => (
            <Link
              key={group}
              href={`/blood-banks?group=${encodeURIComponent(group)}`}
              className="group bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-3 text-center hover:border-rose-300 hover:shadow-subtle transition-all flex flex-col items-center gap-1.5"
            >
              <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Droplet className="w-4 h-4 fill-rose-600/15" />
              </div>
              <span className="font-mono font-extrabold text-sm text-[#101828] dark:text-white">{group}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                status === "AVAILABLE"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : status === "LIMITED"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
              }`}>
                {status === "AVAILABLE" ? "Available" : status === "LIMITED" ? "Limited" : "Shortage"}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50/70 dark:bg-slate-800/60 border border-blue-200/60 dark:border-slate-700 text-[12px] text-[#475467] dark:text-slate-300">
          <Info className="w-4 h-4 text-[#087FBD] shrink-0 mt-0.5" />
          <span>Always call the facility before travelling. Status indicators are simulated DEMO DATA — real-time verification requires direct contact with the facility.</span>
        </div>
      </section>

      {/* ─── 5. HOW IT WORKS ───────────────────────── */}
      <section className="bg-[#F7F9FC] dark:bg-slate-900/40 border-y border-[#E4EAF1] dark:border-slate-800/60 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#087FBD]">Simple Process</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101828] dark:text-white">How MediConnect Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-mono font-extrabold ${step.color}`}>
                  {step.step}
                </div>
                <h3 className="font-display font-bold text-base text-[#101828] dark:text-white">{step.title}</h3>
                <p className="text-sm text-[#475467] dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. WHY MEDICONNECT ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#087FBD]">Our Advantage</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101828] dark:text-white">
                Why use MediConnect?
              </h2>
              <p className="text-sm text-[#475467] dark:text-slate-400 leading-relaxed">
                We aggregate hospital resource data so that patients, caregivers, and healthcare workers can make better decisions faster.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WHY_REASONS.map((r) => (
                <div key={r.title} className="flex items-start gap-3 p-4 rounded-xl bg-[#F7F9FC] dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-[#087FBD]/10 text-[#087FBD] flex items-center justify-center shrink-0">
                    {r.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#101828] dark:text-white">{r.title}</p>
                    <p className="text-xs text-[#475467] dark:text-slate-400 mt-0.5 leading-snug">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#101828] rounded-2xl p-8 space-y-4 shadow-float">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Status Snapshot</p>
              <p className="text-[10px] font-mono text-amber-400 bg-amber-900/30 border border-amber-800/40 px-2 py-1 rounded-md inline-block">
                DEMO DATA — for illustration only
              </p>
              {[
                { name: "City Care Hospital", status: "AVAILABLE", color: "emerald" },
                { name: "Sunrise Hospital", status: "LIMITED", color: "amber" },
                { name: "LifeCare Hospital", status: "AVAILABLE", color: "emerald" },
              ].map((h) => (
                <div key={h.name} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-white">{h.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">ICU · Ventilator · X-Ray</p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    h.color === "emerald"
                      ? "bg-emerald-900/40 text-emerald-400 border border-emerald-800/40"
                      : "bg-amber-900/40 text-amber-400 border border-amber-800/40"
                  }`}>
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
