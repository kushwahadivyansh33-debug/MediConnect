"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8 text-foreground">
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase text-primary">Data Protection & Privacy</span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display">Privacy Policy</h1>
        <p className="text-xs font-mono text-muted-foreground">Effective Date: October 2026 | Demonstration Build</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. Minimal Data Collection Policy</h2>
          <p>
            MediConnect is strictly an information discovery service. We do not collect, process, or store personal health records (PHR), patient diagnostic histories, prescription files, or sensitive medical telemetry. Public visitors can browse hospitals and blood banks completely anonymously without creating an account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. Speech & Voice Search Processing</h2>
          <p>
            When utilizing voice search, speech audio is processed locally via your browser’s standard Web Speech API (or configured speech engine). MediConnect does not record, retain, or transmit audio files to external advertising trackers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. Hospital Staff Account Information</h2>
          <p>
            For authorized healthcare personnel, we store essential administrative credentials (name, institutional email, phone number, and hashed passwords via bcrypt). Sessions are authenticated using cryptographic HTTP-only JWT cookies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. Audit Logs and Transparency</h2>
          <p>
            To ensure public accountability and prevent misinformation, all resource status changes record the staff member’s name, facility identifier, and exact modification timestamp in an immutable ledger accessible to system administrators.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">5. Inquiries & Data Rights</h2>
          <p>
            For privacy inquiries or account de-provisioning requests, please reach out to{" "}
            <a href="mailto:privacy@mediconnect.local" className="text-primary hover:underline font-mono">
              privacy@mediconnect.local
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
