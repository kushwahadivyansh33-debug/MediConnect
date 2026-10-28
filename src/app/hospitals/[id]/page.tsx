"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Phone, PhoneCall, MapPin, Clock, ExternalLink,
  Activity, Wind, Zap, Scan, FlaskConical, Pill, Heart,
  AlertTriangle, Building2, ChevronRight, CheckCircle2,
} from "lucide-react";
import { Facility } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

const RESOURCE_ICONS: Record<string, React.ReactNode> = {
  icu:          <Activity className="w-5 h-5" />,
  ventilator:   <Wind className="w-5 h-5" />,
  ecg:          <Zap className="w-5 h-5" />,
  "x-ray":      <Scan className="w-5 h-5" />,
  "ct scan":    <Scan className="w-5 h-5" />,
  lab:          <FlaskConical className="w-5 h-5" />,
  pharmacy:     <Pill className="w-5 h-5" />,
  default:      <Heart className="w-5 h-5" />,
};

function getIcon(name: string) {
  const key = Object.keys(RESOURCE_ICONS).find((k) => name.toLowerCase().includes(k));
  return RESOURCE_ICONS[key ?? "default"];
}

export default function HospitalDetailPage() {
  const { id } = useParams() as { id: string };
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/facilities/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Facility not found");
        return r.json();
      })
      .then(setFacility)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="skeleton h-56 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="font-display text-xl font-bold text-[#101828] dark:text-white">Hospital Not Found</h2>
        <p className="text-sm text-[#475467] dark:text-slate-400">{error || "This facility does not exist."}</p>
        <Link href="/hospitals" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E88A05] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Hospitals
        </Link>
      </div>
    );
  }

  const hospitalPhotos: Record<string, string> = {
    fac_apollo_lko: "/images/hospital-photo-1.jpg",
    fac_kgmu_lko: "/images/hospital-photo-2.jpg",
    fac_max_del: "/images/hospital-photo-3.jpg",
  };
  const imgSrc =
    facility.image?.endsWith(".svg")
      ? hospitalPhotos[facility.id] || "/images/hospital-hero.jpg"
      : facility.image || "/images/hospital-hero.jpg";
  const overallStatus = facility.resources.find((r) => r.name.toLowerCase().includes("icu"))?.status || "AVAILABLE";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#475467] dark:text-slate-400">
        <Link href="/" className="hover:text-[#E88A05] transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/hospitals" className="hover:text-[#E88A05] transition-colors">Hospitals</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#101828] dark:text-white font-medium truncate max-w-[200px]">{facility.name}</span>
      </nav>

      {/* Hero card */}
      <div className="bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl overflow-hidden shadow-card">
        {/* Hospital image */}
        <div className="relative h-52 sm:h-64 bg-amber-50 dark:bg-slate-800">
          <Image src={imgSrc} alt={facility.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow">
                {facility.name}
              </h1>
              <p className="text-sm text-white/80 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" /> {facility.area}, {facility.city}
              </p>
            </div>
            <div className="shrink-0">
              <StatusBadge status={overallStatus} />
            </div>
          </div>
        </div>

        {/* Hospital meta */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E88A05]/10 text-[#E88A05] flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Phone</p>
              <a href={`tel:${facility.phone}`} className="text-sm font-mono font-semibold text-[#101828] dark:text-white hover:text-[#E88A05] transition-colors">
                {facility.phone}
              </a>
            </div>
          </div>

          {facility.emergencyPhone && (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Emergency</p>
                <a href={`tel:${facility.emergencyPhone}`} className="text-sm font-mono font-semibold text-rose-600">
                  {facility.emergencyPhone}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Last Updated</p>
              <p className="text-sm font-mono text-[#101828] dark:text-white">
                {new Date(facility.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo warning */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>All resource availability data below is <strong>DEMO DATA</strong>. Please call the facility directly to verify before travelling.</span>
      </div>

      {/* Resource grid */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-[#101828] dark:text-white">Resources & Facilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {facility.resources.map((res) => (
            <div
              key={res.id}
              className="bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-card transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 text-[#E88A05] flex items-center justify-center shrink-0">
                  {getIcon(res.name)}
                </div>
                <StatusBadge status={res.status} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#101828] dark:text-white">{res.name}</h3>
                {res.availableUnits != null && (
                  <p className="text-xs font-mono text-[#475467] dark:text-slate-400 mt-0.5">
                    {res.availableUnits} units reported
                  </p>
                )}
                {res.notes && (
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{res.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source info */}
      <div className="bg-[#F7F9FC] dark:bg-slate-800/60 border border-[#E4EAF1] dark:border-slate-700 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-xs text-[#475467] dark:text-slate-400 space-y-0.5">
          <p className="font-semibold text-[#101828] dark:text-white">Data Source</p>
          <p>Information reported by authorized hospital staff. Last verified: {new Date(facility.updatedAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}</p>
        </div>
      </div>

      {/* Back link */}
      <Link
        href="/hospitals"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E88A05] hover:text-[#C45F08] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Hospital Finder
      </Link>
    </div>
  );
}
