"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#101828] text-slate-400 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#087FBD] flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-extrabold text-lg tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                MediConnect
              </span>
            </div>
            <p className="text-[13px] text-slate-400 leading-6 max-w-xs">
              Connecting patients with critical healthcare resources across India — hospitals, blood banks, and emergency services.
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-semibold uppercase tracking-wider w-fit">
              Demo Data
            </span>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-[13px] font-semibold uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="flex flex-col">
              {[
                { label: "Home", href: "/" },
                { label: "Find Hospitals", href: "/hospitals" },
                { label: "Blood Banks", href: "/blood-banks" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "About", href: "/about" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-slate-400 hover:text-white transition-colors leading-7"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-[13px] font-semibold uppercase tracking-widest mb-4">Legal</h4>
            <ul className="flex flex-col">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Accessibility", href: "/accessibility" },
                { label: "Staff Login", href: "/staff/login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-slate-400 hover:text-white transition-colors leading-7"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-[13px] font-semibold uppercase tracking-widest mb-4">Contact</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:support@mediconnect.in"
                  className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-white transition-colors leading-7"
                >
                  <Mail className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                  support@mediconnect.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+915221234567"
                  className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-white transition-colors leading-7"
                >
                  <Phone className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                  +91 522 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2 text-[13px] text-slate-400 leading-7">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                Lucknow, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-slate-500">
            © {new Date().getFullYear()} MediConnect. All rights reserved.
          </p>
          <p className="text-[12px] text-slate-500">
            Built for Public Health • Hackathon 2026
          </p>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
            Demo
          </span>
        </div>
      </div>
    </footer>
  );
}
