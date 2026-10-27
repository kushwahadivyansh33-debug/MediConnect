"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@mediconnect.local");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/staff/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCreds = (type: "admin" | "staff") => {
    if (type === "admin") {
      setEmail("admin@mediconnect.local");
      setPassword("Admin@123");
    } else {
      setEmail("staff.apollo@mediconnect.local");
      setPassword("Staff@123");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white mx-auto shadow-subtle">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            Healthcare Staff Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            Authorized personnel login for updating bed counts and blood stocks.
          </p>
        </div>

        {/* Demo Credentials Quick-Select Pill Box */}
        <div className="p-3.5 bg-muted/60 border border-border rounded-2xl text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Demo Testing Accounts:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickCreds("admin")}
              className="p-2 rounded-xl bg-card border border-border text-left hover:border-primary transition"
            >
              <span className="font-bold text-foreground block">System Admin</span>
              <span className="text-[10px] text-muted-foreground font-mono">admin@mediconnect.local</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickCreds("staff")}
              className="p-2 rounded-xl bg-card border border-border text-left hover:border-primary transition"
            >
              <span className="font-bold text-foreground block">Apollo Hospital</span>
              <span className="text-[10px] text-muted-foreground font-mono">staff.apollo@mediconnect.local</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-card space-y-5 text-card-foreground">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground block">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@hospital.org"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground block">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-primary text-white hover:bg-primary-hover shadow-subtle transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating session...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Need facility onboarding?{" "}
          <span className="text-foreground font-semibold">
            Contact state health directorate for administrative provisioning.
          </span>
        </p>
      </div>
    </div>
  );
}
