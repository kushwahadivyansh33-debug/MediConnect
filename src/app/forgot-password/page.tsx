"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message);
      setSubmitted(true);
    } catch {
      setMessage("If an authorized account is associated with this address, a reset link will be sent.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-[#F7F9FC] dark:bg-slate-950">
      <div className="w-full max-w-md space-y-5">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#087FBD] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#087FBD" stroke="#087FBD" />
                <path d="M12 8v8M8 12h8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-display font-extrabold text-2xl text-[#101828] dark:text-white tracking-tight">
              Medi<span className="text-[#087FBD]">Connect</span>
            </span>
          </Link>
          <p className="text-sm text-[#475467] dark:text-slate-400">
            Account recovery for medical staff
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-7 shadow-card space-y-5">
          <div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087FBD] hover:text-[#0369A1] mb-3 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
            <h1 className="font-display text-xl font-bold text-[#101828] dark:text-white">
              Reset Staff Password
            </h1>
            <p className="text-sm text-[#475467] dark:text-slate-400 mt-0.5">
              Enter your registered clinical email to receive secure recovery instructions.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
                  <p className="font-semibold">Instructions Dispatched</p>
                  <p className="text-xs leading-relaxed">{message}</p>
                </div>
              </div>

              <div className="p-3 bg-[#F7F9FC] dark:bg-slate-800/60 rounded-xl text-xs font-mono text-slate-500 border border-[#E4EAF1] dark:border-slate-700">
                Demo hint: Reset tokens in local evaluation mode are output directly to server stdout logs.
              </div>

              <Link
                href="/login"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#087FBD] hover:bg-[#0369A1] text-white shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="reset-email" className="text-sm font-semibold text-[#101828] dark:text-slate-200 block">
                  Registered Hospital Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff.apollo@mediconnect.local"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-[#E4EAF1] dark:border-slate-700 rounded-xl text-[#101828] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087FBD]/20 focus:border-[#087FBD] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#087FBD] hover:bg-[#0369A1] text-white shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating link…
                  </>
                ) : (
                  <>
                    Send Recovery Link <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-xs text-[#475467] dark:text-slate-400">
            Cryptographically signed single-use recovery tokens expiring in 60 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
