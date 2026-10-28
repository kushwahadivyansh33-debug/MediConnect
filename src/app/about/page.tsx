"use client";

import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, HeartHandshake, Eye, Database, Lock, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Title */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Activity className="w-3.5 h-3.5" />
          <span>Product Mission & Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight">
          About MediConnect
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Smart Hospital Resource & Blood Bank Availability System designed to eliminate deadly information asymmetry in emergency healthcare.
        </p>
      </div>

      {/* The Core Problem */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card text-card-foreground space-y-4">
        <h2 className="text-xl font-bold font-display text-foreground">
          The Problem We Are Solving
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          During acute medical emergencies and seasonal healthcare spikes, families and ambulance drivers often spend critical hours calling unverified phone numbers or traveling between multiple hospitals in search of an open ICU bed, an available ventilator, or compatible negative blood groups.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          MediConnect solves this by centralizing hospital-reported operational status, maintaining immutable audit trails of who made each update and when, and providing transparent contact lines directly to emergency desks.
        </p>
      </div>

      {/* Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm">Authorized Staff Updates</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Only verified hospital and laboratory personnel can adjust resource statuses, ensuring bad actors cannot broadcast fake availability.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm">Transparent Freshness</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Timestamps show data freshness down to the exact minute alongside the reporting department source so caregivers know how recent the information is.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-foreground text-sm">Public Good Prototype</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Developed for national hackathon demonstration. All mock inventory is strictly identified as DEMO DATA to prevent misinformation.
          </p>
        </div>
      </div>

      {/* Prototype Limitations Notice */}
      <div className="bg-muted/40 border border-border rounded-2xl p-6 text-xs text-muted-foreground space-y-2">
        <h4 className="font-bold text-foreground text-sm">National Hackathon Demonstration Notice</h4>
        <p>
          MediConnect is an information discovery platform and prototype. It does not dispatch emergency ambulances, guarantee bed reservations, or substitute for professional medical triage. In life-threatening emergencies, citizens must immediately call emergency numbers <strong>112</strong> or <strong>108</strong>.
        </p>
      </div>
    </div>
  );
}
