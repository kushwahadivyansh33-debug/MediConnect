"use client";

import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, HeartHandshake, Phone, ArrowUpRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function Footer() {
  const { t } = useApp();

  return (
    <footer className="border-t border-border bg-card text-card-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-subtle">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight">
                MediConnect
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/50 p-2.5 rounded-lg border border-border">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>National Hackathon 2026 Demonstration Build</span>
            </div>
          </div>

          {/* Core Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Healthcare Directory
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/hospitals" className="hover:text-primary transition">
                  Find Hospitals & ICU Beds
                </Link>
              </li>
              <li>
                <Link href="/blood-banks" className="hover:text-primary transition">
                  Blood Bank ABO/Rh Availability
                </Link>
              </li>
              <li>
                <Link href="/hospitals?service=ventilators" className="hover:text-primary transition">
                  Emergency Ventilator Tracking
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition">
                  Audit Trails & Transparency
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparency & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About MediConnect Architecture
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-primary transition">
                  {t.footer.accessibility}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition flex items-center gap-1">
                  Hospital Staff Verification <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Alert Hotline info */}
          <div className="space-y-3 bg-muted/40 p-4 rounded-xl border border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              Emergency Helpline
            </h4>
            <p className="text-xs text-muted-foreground">
              MediConnect is an informational tool. In any acute critical medical emergency:
            </p>
            <div className="space-y-1 font-mono text-xs">
              <p className="text-rose-600 dark:text-rose-400 font-bold">
                Police / National: 112
              </p>
              <p className="text-rose-600 dark:text-rose-400 font-bold">
                Medical Ambulance: 108 / 102
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Blood Helpline: 1910
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-500" /> Built for Public Good
            </span>
            <span>•</span>
            <span className="font-mono text-[11px]">Next.js 14 / TypeScript / Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
