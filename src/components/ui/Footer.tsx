"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Col matching Reference 1 Dark Navy Footer */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0284C7] flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#0284C7" stroke="#0284C7" />
                  <path d="M12 8v8M8 12h8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-display font-extrabold text-lg text-white tracking-tight">
                Medi<span className="text-[#38BDF8]">Connect</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart Hospital Resource & Blood Bank Availability System
            </p>
          </div>

          {/* Quick Links matching Reference */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/hospitals" className="hover:text-white transition">Find Hospitals</Link>
              </li>
              <li>
                <Link href="/blood-banks" className="hover:text-white transition">Blood Banks</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">How It Works</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">About</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links matching Reference */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-white transition">Accessibility</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">Staff Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact Col matching Reference */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                <a href="mailto:support@mediconnect.in" className="hover:text-white">support@mediconnect.in</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>+91 522 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Lucknow, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 MediConnect. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Built with care for public health</span>
            <span>•</span>
            <span className="font-mono text-[11px]">National Hackathon 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
