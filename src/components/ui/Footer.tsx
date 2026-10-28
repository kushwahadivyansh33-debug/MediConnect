"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Shield } from "lucide-react";

const linkClass =
  "text-[13px] leading-7 text-slate-500 transition-colors hover:text-[#C45F08] dark:text-slate-400 dark:hover:text-amber-300";
const headingClass =
  "mb-4 text-[13px] font-semibold uppercase tracking-widest text-slate-900 dark:text-white";

export function Footer() {
  return (
    <footer className="border-t border-amber-100 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#E88A05]">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span
                className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                MediConnect
              </span>
            </div>
            <p className="max-w-xs text-[13px] leading-6 text-slate-500 dark:text-slate-400">
              Connecting patients with critical healthcare resources across India — hospitals,
              blood banks, and emergency services.
            </p>
            <span className="inline-flex w-fit items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300">
              Demo Data
            </span>
          </div>

          <div>
            <h4 className={headingClass}>Quick Links</h4>
            <ul className="flex flex-col">
              {[
                { label: "Home", href: "/" },
                { label: "Find Hospitals", href: "/hospitals" },
                { label: "Blood Banks", href: "/blood-banks" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "About", href: "/about" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={headingClass}>Legal</h4>
            <ul className="flex flex-col">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Accessibility", href: "/accessibility" },
                { label: "Staff Login", href: "/staff/login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={headingClass}>Contact</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="mailto:support@mediconnect.in" className={`flex items-center gap-2 ${linkClass}`}>
                  <Mail className="h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
                  support@mediconnect.in
                </a>
              </li>
              <li>
                <a href="tel:+915221234567" className={`flex items-center gap-2 ${linkClass}`}>
                  <Phone className="h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
                  +91 522 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2 text-[13px] leading-7 text-slate-500 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
                Lucknow, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-amber-100 pt-6 dark:border-slate-800 sm:flex-row">
          <p className="text-[12px] text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} MediConnect. All rights reserved.
          </p>
          <p className="text-[12px] text-slate-500 dark:text-slate-400">
            Built for Public Health • Hackathon 2026
          </p>
          <span className="inline-flex items-center rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300">
            Demo
          </span>
        </div>
      </div>
    </footer>
  );
}
