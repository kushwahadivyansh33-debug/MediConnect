import React from "react";
import { cn } from "@/lib/utils";
import { ResourceStatus } from "@/types";
import { Check, AlertTriangle, X, HelpCircle } from "lucide-react";

interface StatusBadgeProps {
  status: ResourceStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  switch (status) {
    case "AVAILABLE":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
            className
          )}
        >
          {showIcon && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
          Available
        </span>
      );
    case "LIMITED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
            className
          )}
        >
          {showIcon && <AlertTriangle className="w-3 h-3 text-amber-600" />}
          Limited
        </span>
      );
    case "UNAVAILABLE":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
            className
          )}
        >
          {showIcon && <X className="w-3 h-3 text-rose-600 stroke-[3]" />}
          Unavailable
        </span>
      );
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
            className
          )}
        >
          {showIcon && <HelpCircle className="w-3 h-3 text-slate-500" />}
          Unknown
        </span>
      );
  }
}
