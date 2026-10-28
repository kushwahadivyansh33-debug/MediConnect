"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto w-full">
      {/* Top Header Path matching Reference 10 */}
      <div className="flex items-center justify-between pb-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[#E88A05] flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#E88A05" stroke="#E88A05" />
              <path d="M12 8v8M8 12h8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
            Medi<span className="text-[#E88A05]">Connect</span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Link href="/" className="hover:text-[#E88A05]">Home</Link>
          <Link href="/hospitals" className="hover:text-[#E88A05]">Hospitals</Link>
          <Link href="/blood-banks" className="hover:text-[#E88A05]">Blood Banks</Link>
          <Link href="/about" className="hover:text-[#E88A05]">About</Link>
        </nav>
      </div>

      {/* Main 404 Composition matching Reference 10 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-12">
        {/* Left Hospital Illustration */}
        <div className="md:col-span-6 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-amber-50 dark:bg-slate-900 shadow-card p-4">
            <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sky404" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#E0F2FE" />
                  <stop offset="100%" stop-color="#BAE6FD" />
                </linearGradient>
              </defs>
              <rect width="400" height="300" rx="16" fill="url(#sky404)" />
              <polygon points="60,90 200,60 200,260 60,270" fill="#E2E8F0" />
              <polygon points="200,60 320,80 320,260 200,260" fill="#CBD5E1" />
              <g fill="#E88A05">
                <rect x="80" y="100" width="35" height="24" rx="2" />
                <rect x="135" y="90" width="35" height="24" rx="2" />
                <rect x="80" y="140" width="35" height="24" rx="2" />
                <rect x="135" y="130" width="35" height="24" rx="2" />
                <rect x="80" y="180" width="35" height="24" rx="2" />
                <rect x="135" y="170" width="35" height="24" rx="2" />
                <rect x="220" y="95" width="35" height="24" rx="2" />
                <rect x="270" y="100" width="35" height="24" rx="2" />
                <rect x="220" y="135" width="35" height="24" rx="2" />
                <rect x="270" y="140" width="35" height="24" rx="2" />
              </g>
              <circle cx="260" cy="50" r="14" fill="#E88A05" />
              <rect x="257" y="42" width="6" height="16" fill="#FFFFFF" rx="1" />
              <rect x="252" y="47" width="16" height="6" fill="#FFFFFF" rx="1" />
              <circle cx="45" cy="270" r="25" fill="#10B981" />
              <circle cx="330" cy="265" r="30" fill="#059669" />
            </svg>
          </div>
        </div>

        {/* Right 404 Headline & Actions matching Reference 10 */}
        <div className="md:col-span-6 space-y-4">
          <span className="text-6xl sm:text-7xl font-mono font-extrabold text-[#E88A05] block tracking-tight">
            404
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
            We couldn&apos;t find that page.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            The page you&apos;re looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#E88A05] hover:bg-[#C45F08] text-white shadow-xs transition"
            >
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Footer */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <p>© 2026 MediConnect. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/accessibility" className="hover:underline">Accessibility</Link>
        </div>
      </div>
    </div>
  );
}
