"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, CheckCircle, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8 text-foreground">
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase text-primary">Governance & User Agreement</span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display">Terms and Conditions</h1>
        <p className="text-xs font-mono text-muted-foreground">Effective Date: October 2026 | Demonstration Build</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. Informational Purpose & Prototype Limitations</h2>
          <p>
            MediConnect is provided solely as an informational discovery tool and national hackathon prototype. The platform aggregates reported availability from registered healthcare facilities. MediConnect does not provide medical services, does not dispatch emergency response units, and does not guarantee the availability of any hospital bed, ventilator, or blood component.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. Mandatory Independent Confirmation</h2>
          <p>
            Users, patients, and caregivers are strictly required to independently contact the healthcare facility or blood bank to verify real-time availability before traveling. Emergency resources are subject to immediate triage admissions, walk-in casualties, and clinical priority changes beyond the control of the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. User Responsibilities & Acceptable Use</h2>
          <p>
            Users agree to use the platform in good faith for healthcare resource discovery. Any attempt to disrupt service availability, perform automated scraping, inject malicious payloads, or impersonate hospital personnel is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. Authorized Staff Responsibilities</h2>
          <p>
            Authorized staff members with login privileges agree to provide accurate, honest, and timely updates based on genuine clinical status within their facility. Staff credentials must be safeguarded. Any deliberate falsification of availability constitutes a breach of healthcare ethics and platform governance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">5. Limitation of Liability</h2>
          <p>
            Under no circumstances shall MediConnect, its hackathon creators, contributors, or affiliated healthcare institutions be held liable for any direct, indirect, incidental, or consequential damages resulting from reliance on the platform, delays in medical transit, or resource discrepancies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">6. Contact & Inquiries</h2>
          <p>
            For inquiries regarding platform governance or hackathon demonstration rules, please contact the development team at{" "}
            <a href="mailto:governance@mediconnect.local" className="text-primary hover:underline font-mono">
              governance@mediconnect.local
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
