"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Search, PhoneCall, History, CheckCircle, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
          How MediConnect Works
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          From search to verified bed availability—discover how MediConnect powers reliable healthcare resource discovery.
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card text-card-foreground flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-lg shrink-0">
            01
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              Instant Need-Based Discovery
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Caregivers and patients can search by facility type (Hospital, Trauma Center), critical care equipment (ICU Beds, Invasive Ventilators, Oxygen manifold lines), or specific ABO/Rh blood groups (including scarce negative types like O- and AB-).
            </p>
            <div className="pt-2">
              <Link
                href="/hospitals"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Try Hospital Search <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card text-card-foreground flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-mono font-bold text-lg shrink-0">
            02
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              Transparent Freshness & Audit History
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every resource listing displays the exact timestamp of its last check, the name or role of the authorized hospital personnel who logged the count, and the reporting department. This prevents caregivers from relying on stale or outdated data.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card text-card-foreground flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-mono font-bold text-lg shrink-0">
            03
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              Direct Emergency Confirmation
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              With one tap, connect directly to the facility’s 24/7 emergency triage desk or the blood bank laboratory. Speak with duty staff to confirm bed reservation and donor cross-matching protocols before commencing transit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
