"use client";
import React from "react";
import { CheckCircle2, AlertCircle, XCircle, HelpCircle } from "lucide-react";
import { ResourceStatus } from "@/types";

const STATUS_CONFIG: Record<ResourceStatus, { label: string; icon: React.ReactNode; cls: string }> = {
  AVAILABLE: {
    label: "Available",
    icon: <CheckCircle2 className="w-3 h-3" />,
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50",
  },
  LIMITED: {
    label: "Limited",
    icon: <AlertCircle className="w-3 h-3" />,
    cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50",
  },
  UNAVAILABLE: {
    label: "Unavailable",
    icon: <XCircle className="w-3 h-3" />,
    cls: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50",
  },
  UNKNOWN: {
    label: "Unknown",
    icon: <HelpCircle className="w-3 h-3" />,
    cls: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  },
};

export function StatusBadge({ status, showIcon = true }: { status: ResourceStatus; showIcon?: boolean }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.UNKNOWN;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.cls}`}
    >
      {showIcon && cfg.icon}
      {cfg.label}
    </span>
  );
}
