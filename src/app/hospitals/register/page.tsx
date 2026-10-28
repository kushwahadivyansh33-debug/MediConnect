"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, CheckCircle2, LoaderCircle } from "lucide-react";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100";

export default function HospitalRegistrationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/hospital-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit the registration.");
      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit the registration. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/hospitals" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#C45F08] dark:text-slate-300">
          <ArrowLeft className="h-4 w-4" /> Back to hospitals
        </Link>
        <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-6 flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#E88A05]">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Register a hospital</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Submit your facility and contact details for verification.
              </p>
            </div>
          </div>

          {submitted ? (
            <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-5 w-5" /> Registration submitted for review
              </div>
              <p className="mt-2 text-sm leading-6">
                Your facility is pending verification and will not appear as a verified listing until it has been reviewed.
              </p>
              <Link href="/hospitals" className="mt-4 inline-flex rounded-lg bg-[#E88A05] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C45F08]">
                Return to hospitals
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 sm:col-span-2">
                  Hospital or facility name
                  <input name="name" required minLength={2} maxLength={120} className={inputClassName} autoComplete="organization" />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Facility type
                  <select name="type" required className={inputClassName} defaultValue="HOSPITAL">
                    <option value="HOSPITAL">Hospital</option>
                    <option value="CLINIC">Clinic</option>
                    <option value="TRAUMA_CENTER">Trauma center</option>
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Contact person
                  <input name="contactName" required minLength={2} maxLength={80} className={inputClassName} autoComplete="name" />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 sm:col-span-2">
                  Street address
                  <input name="address" required minLength={5} maxLength={200} className={inputClassName} autoComplete="street-address" />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Area / neighborhood
                  <input name="area" required minLength={2} maxLength={80} className={inputClassName} />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  City
                  <input name="city" required minLength={2} maxLength={80} className={inputClassName} autoComplete="address-level2" />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  State
                  <input name="state" required minLength={2} maxLength={80} className={inputClassName} autoComplete="address-level1" />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Postal / ZIP code
                  <input name="pincode" required minLength={4} maxLength={10} className={inputClassName} autoComplete="postal-code" />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Main phone
                  <input name="phone" required type="tel" minLength={7} maxLength={24} className={inputClassName} autoComplete="tel" />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Emergency phone
                  <input name="emergencyPhone" required type="tel" minLength={7} maxLength={24} className={inputClassName} />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Official email
                  <input name="email" required type="email" maxLength={254} className={inputClassName} autoComplete="email" />
                </label>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Website <span className="font-normal text-slate-400">(optional)</span>
                  <input name="website" type="url" maxLength={254} className={inputClassName} placeholder="https://" />
                </label>
              </div>

              {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-xs leading-5 text-slate-500">
                  Submissions are stored for review and are not published or marked verified automatically.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E88A05] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C45F08] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {submitting ? "Submitting…" : "Submit for review"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
