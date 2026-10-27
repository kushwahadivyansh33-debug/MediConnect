"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Building2,
  MapPin,
  Phone,
  PhoneCall,
  Globe,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Activity,
  Bed,
  CheckCircle2,
} from "lucide-react";
import { Facility } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function HospitalDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/facilities/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Hospital record not found");
        return res.json();
      })
      .then((data) => {
        setFacility(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Loading verified hospital record...</p>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Building2 className="w-12 h-12 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-bold font-display text-foreground">Facility Not Found</h1>
        <p className="text-xs text-muted-foreground">
          The requested hospital ID does not exist in our directory or has been decommissioned.
        </p>
        <Link
          href="/hospitals"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hospitals Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/hospitals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
        <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">
          DEMO DATA RECORD
        </span>
      </div>

      {/* Main Hospital Header Card */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card text-card-foreground">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase bg-primary/10 text-primary px-2.5 py-0.5 rounded-md">
                {facility.type}
              </span>
              {facility.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Hospital Desk
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              {facility.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              {facility.address}, {facility.area}, {facility.city}, {facility.state} — {facility.pincode}
            </p>
          </div>

          {/* Emergency Call Action */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <a
              href={`tel:${facility.emergencyPhone}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-subtle transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Emergency Triage ({facility.emergencyPhone})</span>
            </a>
            <a
              href={`tel:${facility.phone}`}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-border hover:bg-muted font-semibold text-xs text-foreground transition"
            >
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>General Helpdesk ({facility.phone})</span>
            </a>
          </div>
        </div>

        {/* Quick Specs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Total Bed Capacity</span>
            <span className="font-mono font-bold text-base text-foreground">{facility.totalBeds} Beds</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Data Source</span>
            <span className="font-semibold text-foreground truncate block">{facility.dataSource}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Last Updated</span>
            <span className="font-mono font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              {formatDate(facility.updatedAt)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Official Portal</span>
            {facility.website ? (
              <a
                href={facility.website}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-semibold hover:underline flex items-center gap-1 mt-0.5"
              >
                <Globe className="w-3.5 h-3.5" />
                Visit Site
              </a>
            ) : (
              <span className="text-muted-foreground">Not Listed</span>
            )}
          </div>
        </div>
      </div>

      {/* Critical Resource Table */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card text-card-foreground space-y-6">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Operational Equipment & Medical Service Status
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time status reported by authorized hospital administration.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-mono">
                <th className="pb-3 font-semibold">Service / Resource</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Current Availability</th>
                <th className="pb-3 font-semibold">Units Available</th>
                <th className="pb-3 font-semibold">Staff Notes</th>
                <th className="pb-3 font-semibold">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {facility.resources.map((res) => (
                <tr key={res.id} className="hover:bg-muted/30 transition">
                  <td className="py-4 font-bold text-foreground pr-4">
                    {res.name}
                  </td>
                  <td className="py-4 pr-4">
                    <span className="font-mono text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                      {res.category}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <StatusBadge status={res.status} />
                  </td>
                  <td className="py-4 font-mono font-bold text-foreground pr-4">
                    {res.availableUnits !== undefined
                      ? `${res.availableUnits} / ${res.totalUnits ?? "-"}`
                      : "Present"}
                  </td>
                  <td className="py-4 text-muted-foreground max-w-xs pr-4 text-[11px]">
                    {res.notes || "Standard clinical operations."}
                  </td>
                  <td className="py-4 font-mono text-[11px] text-muted-foreground">
                    {formatDate(res.lastUpdated)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confirmation Advice */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Mandatory Patient Guidance:</strong> Resource states fluctuate rapidly during influxes. Do not undertake critical ambulance transit without directly speaking to the emergency triage room via the number above.
          </p>
        </div>
      </div>
    </div>
  );
}
