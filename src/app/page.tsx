"use client";

import React from "react";
import Link from "next/link";
import {
  Hospital,
  Droplet,
  Clock,
  ShieldCheck,
  PhoneCall,
  Search,
  CheckCircle,
  FileCheck2,
  ChevronRight,
  Stethoscope,
  Activity,
  HeartHandshake,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { HeroSearch } from "@/components/ui/HeroSearch";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const { t } = useApp();

  // Curated demo featured items
  const featuredHospitals = [
    {
      id: "fac_apollo_lko",
      name: "Apollo Medics Super Speciality Hospital",
      area: "Kanpur Road, Lucknow",
      phone: "+91 522 6788888",
      emergencyPhone: "+91 522 6788800",
      icuBeds: "8 Available",
      ventilators: "6 Available",
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: "Hospital On-Duty Administration",
    },
    {
      id: "fac_kgmu_lko",
      name: "King George's Medical University (KGMU)",
      area: "Chowk, Lucknow",
      phone: "+91 522 2257450",
      emergencyPhone: "+91 522 2257540",
      icuBeds: "3 Limited",
      ventilators: "4 Limited",
      updatedAt: new Date().toISOString(),
      source: "Chief Medical Officer Desk",
    },
    {
      id: "fac_max_del",
      name: "Max Super Speciality Hospital",
      area: "Saket, New Delhi",
      phone: "+91 11 26515050",
      emergencyPhone: "+91 11 40554055",
      icuBeds: "12 Available",
      ventilators: "9 Available",
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: "Hospital Operations Room",
    },
  ];

  const featuredBlood = [
    {
      id: "bb_apollo_lko",
      name: "Apollo Medics Blood Bank",
      area: "Kanpur Road, Lucknow",
      phone: "+91 522 6788889",
      oNegative: { status: "LIMITED" as const, units: 2 },
      bPositive: { status: "AVAILABLE" as const, units: 24 },
      aPositive: { status: "AVAILABLE" as const, units: 18 },
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: "Apollo Transfusion Dept",
    },
    {
      id: "bb_rotary_del",
      name: "Rotary Blood Bank & Apheresis",
      area: "Tughlakabad, New Delhi",
      phone: "+91 11 29955318",
      oNegative: { status: "AVAILABLE" as const, units: 8 },
      bPositive: { status: "AVAILABLE" as const, units: 41 },
      aPositive: { status: "AVAILABLE" as const, units: 34 },
      updatedAt: new Date().toISOString(),
      source: "Rotary Central Registry",
    },
  ];

  return (
    <div className="flex flex-col gap-16 lg:gap-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Activity className="w-3.5 h-3.5" />
            <span>{t.hero.badge}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground">
            {t.hero.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t.hero.subtitle}
          </p>
        </div>

        {/* Search Assistant Box */}
        <div className="mt-8">
          <HeroSearch />
        </div>

        {/* Disclaimer Callout */}
        <p className="text-center text-[11px] text-muted-foreground mt-4 max-w-xl mx-auto">
          {t.hero.disclaimer}
        </p>
      </section>

      {/* 2. QUICK ACCESS CARDS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/hospitals"
            className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:border-primary/50 hover:shadow-float transition"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Hospital className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground flex items-center justify-between">
              Find Hospitals
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Explore operational bed capacity, trauma units, and hospital emergency contacts.
            </p>
          </Link>

          <Link
            href="/hospitals?service=icu"
            className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:border-teal-500/50 hover:shadow-float transition"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground flex items-center justify-between">
              Critical Care & ICU
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-teal-500 transition" />
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Real-time reporting of intensive care beds, ventilator reserves, and neonatal units.
            </p>
          </Link>

          <Link
            href="/blood-banks"
            className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:border-rose-500/50 hover:shadow-float transition"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Droplet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground flex items-center justify-between">
              Blood Bank Inventory
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-rose-500 transition" />
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Search all 8 ABO/Rh blood groups with certified stock indicators and direct transfusion contacts.
            </p>
          </Link>

          <Link
            href="/staff/dashboard"
            className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:border-amber-500/50 hover:shadow-float transition"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground flex items-center justify-between">
              Staff Portal
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 transition" />
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Authorized clinical and administrative personnel portal for publishing resource changes.
            </p>
          </Link>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-muted/40 border border-border rounded-3xl p-8 sm:p-12">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              {t.howItWorks.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 bg-card p-6 rounded-2xl border border-border shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h3 className="text-base font-bold text-foreground">
                {t.howItWorks.step1Title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.howItWorks.step1Desc}
              </p>
            </div>

            <div className="space-y-3 bg-card p-6 rounded-2xl border border-border shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h3 className="text-base font-bold text-foreground">
                {t.howItWorks.step2Title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.howItWorks.step2Desc}
              </p>
            </div>

            <div className="space-y-3 bg-card p-6 rounded-2xl border border-border shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-foreground">
                {t.howItWorks.step3Title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.howItWorks.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED HOSPITALS DEMO DATA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-display text-foreground">
                Verified Hospitals & Bed Reserves
              </h2>
              <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold">
                DEMO DATA
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sample facility records showing live status, data provenance, and triage phone numbers.
            </p>
          </div>

          <Link
            href="/hospitals"
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover hover:underline"
          >
            <span>View All Hospitals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-card hover:border-primary/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-foreground text-sm leading-snug">
                    {hosp.name}
                  </h3>
                  <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-md">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{hosp.area}</p>

                {/* Status chips */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted/50 p-2.5 rounded-xl border border-border">
                    <span className="text-muted-foreground text-[10px] block font-medium">ICU Beds</span>
                    <span className="font-bold text-foreground">{hosp.icuBeds}</span>
                  </div>
                  <div className="bg-muted/50 p-2.5 rounded-xl border border-border">
                    <span className="text-muted-foreground text-[10px] block font-medium">Ventilators</span>
                    <span className="font-bold text-foreground">{hosp.ventilators}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    Updated: {formatDate(hosp.updatedAt)}
                  </p>
                  <p className="truncate">Source: {hosp.source}</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                <a
                  href={`tel:${hosp.emergencyPhone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call Emergency
                </a>
                <Link
                  href={`/hospitals/${hosp.id}`}
                  className="py-2 px-3 rounded-xl bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 transition"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED BLOOD BANKS DEMO DATA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-display text-foreground">
                Reported Blood Bank Inventory
              </h2>
              <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold">
                DEMO DATA
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sample ABO/Rh inventory reserves. Confirm with the laboratory before departure.
            </p>
          </div>

          <Link
            href="/blood-banks"
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover hover:underline"
          >
            <span>View All Blood Banks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredBlood.map((bb) => (
            <div
              key={bb.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-card hover:border-rose-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-foreground text-sm">{bb.name}</h3>
                  <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 rounded-md">
                    Component Bank
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{bb.area}</p>

                {/* Blood Group Indicators */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-muted/40 p-2.5 rounded-xl border border-border text-center">
                    <span className="text-[10px] font-bold text-muted-foreground block">O- Negative</span>
                    <span className="text-sm font-mono font-bold text-rose-600 dark:text-rose-400">
                      {bb.oNegative.units} Units
                    </span>
                    <div className="mt-1">
                      <StatusBadge status={bb.oNegative.status} showIcon={false} />
                    </div>
                  </div>
                  <div className="bg-muted/40 p-2.5 rounded-xl border border-border text-center">
                    <span className="text-[10px] font-bold text-muted-foreground block">B+ Positive</span>
                    <span className="text-sm font-mono font-bold text-foreground">
                      {bb.bPositive.units} Units
                    </span>
                    <div className="mt-1">
                      <StatusBadge status={bb.bPositive.status} showIcon={false} />
                    </div>
                  </div>
                  <div className="bg-muted/40 p-2.5 rounded-xl border border-border text-center">
                    <span className="text-[10px] font-bold text-muted-foreground block">A+ Positive</span>
                    <span className="text-sm font-mono font-bold text-foreground">
                      {bb.aPositive.units} Units
                    </span>
                    <div className="mt-1">
                      <StatusBadge status={bb.aPositive.status} showIcon={false} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between font-mono">
                  <span>Source: {bb.source}</span>
                  <span>Updated: {formatDate(bb.updatedAt)}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                <a
                  href={`tel:${bb.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-card border border-border hover:bg-muted text-xs font-bold text-foreground transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-primary" />
                  Call Blood Bank
                </a>
                <Link
                  href={`/blood-banks/${bb.id}`}
                  className="py-2 px-3 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition"
                >
                  All 8 Groups
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRUST & TRANSPARENCY SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="border border-border bg-card rounded-3xl p-8 lg:p-12 shadow-subtle grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verifiable Provenance Architecture</span>
            </div>
            <h2 className="text-3xl font-bold font-display text-foreground tracking-tight">
              Combating Medical Rumors with Immutable Audit Trails
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              In public health crises, false reports regarding oxygen beds and blood availability cause panic and fatal delays. MediConnect enforces verified staff authentication, timestamped modifications, and data source disclosure on every single record.
            </p>
            <ul className="space-y-2.5 text-xs text-foreground font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                Staff role-based authorization prevents unauthorized updates.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                Clear timestamps indicate information freshness down to the exact minute.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                Demonstration records are strictly tagged DEMO DATA.
              </li>
            </ul>
          </div>

          <div className="bg-muted/40 border border-border rounded-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-bold text-foreground">Recent Audit Ledger</span>
              <span className="text-[10px] text-emerald-600">● Live Feed</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-card rounded-xl border border-border">
                <p className="text-primary font-bold">Apollo Medics: ICU Beds</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Updated status: LIMITED → AVAILABLE (8 units)
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Actor: Nurse Priya Sharma • 2h ago
                </p>
              </div>

              <div className="p-3 bg-card rounded-xl border border-border">
                <p className="text-primary font-bold">Rotary Blood Bank: O- Stock</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Updated stock: 8 Units (Reserve Calibrated)
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Actor: Dr. Arvind Mehta • Just now
                </p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-center text-muted-foreground">
              Every change records actor identity, previous state, and timestamp.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
