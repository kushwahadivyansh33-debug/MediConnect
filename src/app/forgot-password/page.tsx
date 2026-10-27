"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

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
      setMessage("Request recorded. If an account is registered, instructions are generated.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Reset Staff Password
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Enter your official healthcare email to receive a secure recovery token.
          </p>
        </div>

        {submitted ? (
          <div className="bg-card border border-border p-6 rounded-3xl shadow-card space-y-4 text-card-foreground">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Instructions Sent</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
            <div className="p-3 bg-muted rounded-xl text-[11px] font-mono text-muted-foreground">
              Demo Test Hint: Password reset tokens in development are logged in server console.
            </div>
            <Link
              href="/login"
              className="block text-center py-2 px-4 rounded-xl text-xs font-bold bg-primary text-white"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border p-6 rounded-3xl shadow-card space-y-4 text-card-foreground"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Registered Hospital Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.org"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl text-foreground focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-primary text-white hover:bg-primary-hover shadow-subtle transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Generate Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
