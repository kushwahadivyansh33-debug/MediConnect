"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/staff/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (role: "admin" | "staff") => {
    if (role === "admin") {
      setEmail("admin@mediconnect.local");
      setPassword("Admin@123");
    } else {
      setEmail("staff.apollo@mediconnect.local");
      setPassword("Staff@123");
    }
    setError(null);
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
            Staff portal — authorized personnel only
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-7 shadow-card space-y-5">
          <div>
            <h1 className="font-display text-xl font-bold text-[#101828] dark:text-white">Welcome back</h1>
            <p className="text-sm text-[#475467] dark:text-slate-400 mt-0.5">
              Sign in to access the resource management console.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-sm text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-[#101828] dark:text-slate-200 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hospital.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-[#E4EAF1] dark:border-slate-700 rounded-xl text-[#101828] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087FBD]/20 focus:border-[#087FBD] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-[#101828] dark:text-slate-200">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[#087FBD] hover:text-[#0369A1] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 text-sm bg-white dark:bg-slate-800 border border-[#E4EAF1] dark:border-slate-700 rounded-xl text-[#101828] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087FBD]/20 focus:border-[#087FBD] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                  Authenticating…
                </>
              ) : (
                <>
                  Sign In to Console <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick fill for evaluation */}
          <div className="pt-2 border-t border-[#E4EAF1] dark:border-slate-800">
            <p className="text-xs text-slate-400 mb-2 font-medium">Hackathon demo — quick fill:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => quickFill("admin")}
                className="flex-1 py-1.5 px-3 rounded-lg bg-[#F7F9FC] dark:bg-slate-800 border border-[#E4EAF1] dark:border-slate-700 text-xs font-semibold text-[#475467] dark:text-slate-300 hover:border-[#087FBD]/50 hover:text-[#087FBD] transition-colors"
              >
                Admin Fill
              </button>
              <button
                type="button"
                onClick={() => quickFill("staff")}
                className="flex-1 py-1.5 px-3 rounded-lg bg-[#F7F9FC] dark:bg-slate-800 border border-[#E4EAF1] dark:border-slate-700 text-xs font-semibold text-[#475467] dark:text-slate-300 hover:border-[#087FBD]/50 hover:text-[#087FBD] transition-colors"
              >
                Staff Fill
              </button>
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-xs text-[#475467] dark:text-slate-400">
            Secured with JWT session cookies. We never reveal whether an account exists with this email address.
          </p>
        </div>

        <p className="text-center text-sm text-[#475467] dark:text-slate-400">
          Not a staff member?{" "}
          <Link href="/" className="font-semibold text-[#087FBD] hover:text-[#0369A1] transition-colors">
            Go to public portal
          </Link>
        </p>
      </div>
    </div>
  );
}
