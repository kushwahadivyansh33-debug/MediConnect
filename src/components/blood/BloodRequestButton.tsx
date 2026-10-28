"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Droplet, LoaderCircle, PhoneCall, X } from "lucide-react";
import { BloodBank, BloodGroup } from "@/types";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

type CreatedRequest = {
  reference: string;
  bloodBankName: string;
  bloodGroup: BloodGroup;
  units: number;
  neededBy: string;
  appointmentSlot: string;
  status: "PENDING";
};

export function BloodRequestButton({
  bloodBank,
  initialGroup = "O+",
  className,
}: {
  bloodBank: Pick<BloodBank, "id" | "name" | "phone">;
  initialGroup?: BloodGroup;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreatedRequest | null>(null);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(initialGroup);
  const [units, setUnits] = useState(1);
  const [neededBy, setNeededBy] = useState(() => new Date().toISOString().slice(0, 10));
  const [appointmentSlot, setAppointmentSlot] = useState("09:00");
  const [requesterName, setRequesterName] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [prescriptionConfirmed, setPrescriptionConfirmed] = useState(false);

  useEffect(() => {
    setBloodGroup(initialGroup);
  }, [initialGroup]);

  const close = () => {
    if (submitting) return;
    setOpen(false);
    setError(null);
    setResult(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/blood-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bloodBankId: bloodBank.id,
          bloodGroup,
          units,
          neededBy,
          appointmentSlot,
          requesterName,
          requesterPhone,
          requesterEmail,
          notes,
          prescriptionConfirmed,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit your request.");
      }
      setResult(data.request);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          "inline-flex items-center justify-center gap-2 rounded-xl bg-[#E88A05] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#C45F08]"
        }
      >
        <Droplet className="h-4 w-4" />
        Request blood
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="blood-request-title"
            className="my-auto max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-amber-100 bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#E88A05]">
                  <Droplet className="h-5 w-5" />
                </span>
                <h2 id="blood-request-title" className="text-lg font-bold text-slate-900">
                  {result ? "Request received" : "Request blood units"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">{bloodBank.name}</p>
              </div>
              <button
                type="button"
                onClick={close}
                disabled={submitting}
                aria-label="Close blood request"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {result ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <CheckCircle2 className="h-5 w-5" />
                    Request submitted for bank review
                  </div>
                  <p className="mt-2 text-xs leading-5 text-emerald-800/80">
                    This is a request only—not a confirmed reservation. Call the blood bank to
                    verify stock, prescription requirements, and cross-matching before travel.
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 p-4 text-xs">
                  <div>
                    <dt className="text-slate-400">Reference number</dt>
                    <dd className="mt-1 font-mono font-bold text-slate-800">{result.reference}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Request</dt>
                    <dd className="mt-1 font-semibold text-slate-800">
                      {result.units} unit{result.units === 1 ? "" : "s"} · {result.bloodGroup}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-slate-400">Requested visit</dt>
                    <dd className="mt-1 font-semibold text-slate-800">
                      {new Date(`${result.neededBy}T00:00:00`).toLocaleDateString()} · {result.appointmentSlot}
                    </dd>
                  </div>
                </dl>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Done
                  </button>
                  <a
                    href={`tel:${bloodBank.phone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E88A05] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#C45F08]"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    Call blood bank
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Blood group
                    <select
                      value={bloodGroup}
                      onChange={(event) => setBloodGroup(event.target.value as BloodGroup)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-normal outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    >
                      {BLOOD_GROUPS.map((group) => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Units needed
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={units}
                      onChange={(event) => setUnits(Number(event.target.value))}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    />
                    <span className="mt-1 block text-[10px] font-normal text-slate-400">Submit 1–10 units per request</span>
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Needed by
                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      required
                      value={neededBy}
                      onChange={(event) => setNeededBy(event.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Preferred appointment slot
                    <select
                      value={appointmentSlot}
                      onChange={(event) => setAppointmentSlot(event.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-normal outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    >
                      {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    <span className="mt-1 block text-[10px] font-normal text-slate-400">Requested time only; the blood bank must confirm the appointment.</span>
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Contact name
                    <input
                      type="text"
                      autoComplete="name"
                      minLength={2}
                      maxLength={80}
                      required
                      value={requesterName}
                      onChange={(event) => setRequesterName(event.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Phone number
                    <input
                      type="tel"
                      autoComplete="tel"
                      minLength={7}
                      maxLength={24}
                      required
                      value={requesterPhone}
                      onChange={(event) => setRequesterPhone(event.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                      placeholder="+91 98765 43210"
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-700">
                    Email <span className="font-normal text-slate-400">(optional)</span>
                    <input
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      value={requesterEmail}
                      onChange={(event) => setRequesterEmail(event.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>

                <label className="block text-xs font-semibold text-slate-700">
                  Note for the blood bank <span className="font-normal text-slate-400">(optional)</span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    maxLength={250}
                    rows={2}
                    className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="Add a brief note; do not include sensitive medical records."
                  />
                </label>

                <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-[11px] leading-5 text-amber-950">
                  <input
                    type="checkbox"
                    required
                    checked={prescriptionConfirmed}
                    onChange={(event) => setPrescriptionConfirmed(event.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#E88A05]"
                  />
                  <span>
                    I have a doctor&apos;s prescription and understand this request is not a
                    reservation. The blood bank must confirm availability and complete required
                    compatibility testing.
                  </span>
                </label>

                {error && (
                  <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                    {error}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] leading-4 text-slate-400">
                    Inventory shown is demo data. For urgent needs, call the bank directly.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting || !prescriptionConfirmed}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#E88A05] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#C45F08] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Droplet className="h-4 w-4" />}
                    {submitting ? "Submitting…" : "Submit request"}
                  </button>
                </div>
                <p className="flex items-start gap-1.5 text-[10px] leading-4 text-slate-400">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                  This service does not provide medical advice or guarantee blood supply. For emergencies, contact local emergency services and the blood bank.
                </p>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
