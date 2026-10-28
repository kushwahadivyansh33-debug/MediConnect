"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Droplet,
  MapPin,
  Phone,
  PhoneCall,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Building,
} from "lucide-react";
import { BloodBank } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { BloodRequestButton } from "@/components/blood/BloodRequestButton";

export default function BloodBankDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [bloodBank, setBloodBank] = useState<BloodBank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/blood-banks/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Blood bank record not found");
        return res.json();
      })
      .then((data) => {
        setBloodBank(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Loading blood bank record...</p>
      </div>
    );
  }

  if (error || !bloodBank) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Droplet className="w-12 h-12 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-bold font-display text-foreground">Blood Bank Not Found</h1>
        <p className="text-xs text-muted-foreground">
          The requested blood bank record does not exist or has been relocated.
        </p>
        <Link
          href="/blood-banks"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blood Banks Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Back & Label */}
      <div className="flex items-center justify-between">
        <Link
          href="/blood-banks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blood Banks
        </Link>
        <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">
          DEMO DATA RECORD
        </span>
      </div>

      {/* Main Bank Card */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card text-card-foreground">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase bg-rose-500/10 text-rose-600 px-2.5 py-0.5 rounded-md">
                Blood Component Center
              </span>
              {bloodBank.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Certified Transfusion Council
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              {bloodBank.name}
            </h1>
            {bloodBank.hospitalName && (
              <p className="text-xs font-semibold text-primary flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                Hospital: {bloodBank.hospitalName}
              </p>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              {bloodBank.address}, {bloodBank.area}, {bloodBank.city}, {bloodBank.state} — {bloodBank.pincode}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <BloodRequestButton
              bloodBank={bloodBank}
              initialGroup={
                bloodBank.inventory.find((item) => item.status === "AVAILABLE")?.bloodGroup || "O+"
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E88A05] px-5 py-3 text-sm font-bold text-white shadow-subtle transition hover:bg-[#C45F08]"
            />
            <a
              href={`tel:${bloodBank.phone}`}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Lab ({bloodBank.phone})</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Operating Hours</span>
            <span className="font-semibold text-foreground">{bloodBank.operatingHours}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Source Registry</span>
            <span className="font-semibold text-foreground truncate block">{bloodBank.dataSource}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Last Updated</span>
            <span className="font-mono font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              {formatDate(bloodBank.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Complete Blood Group Breakdown */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card text-card-foreground space-y-6">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <Droplet className="w-5 h-5 text-rose-600" />
            ABO / Rh Blood Group Inventory Ledger
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Certified component units in cold storage reported by blood bank technicians.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-mono">
                <th className="pb-3 font-semibold">Blood Group</th>
                <th className="pb-3 font-semibold">Reported Units</th>
                <th className="pb-3 font-semibold">Availability Status</th>
                <th className="pb-3 font-semibold">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bloodBank.inventory.map((item) => (
                <tr key={item.bloodGroup} className="hover:bg-muted/30 transition">
                  <td className="py-4 font-mono font-bold text-foreground text-sm pr-4">
                    {item.bloodGroup}
                  </td>
                  <td className="py-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-sm pr-4">
                    {item.unitsAvailable !== undefined ? `${item.unitsAvailable} Units` : "-"}
                  </td>
                  <td className="py-4 pr-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-4 font-mono text-[11px] text-muted-foreground">
                    {formatDate(item.lastUpdated)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Safety Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Cross-Matching & Requisition Notice:</strong> Blood units are subject to doctor prescription, cross-matching, and donor replacement rules per national guidelines. Always speak directly with laboratory staff prior to patient transit.
          </p>
        </div>
      </div>
    </div>
  );
}
