import React from "react";
import { cn } from "@/lib/utils";
import { ResourceStatus } from "@/types";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

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
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
            className
          )}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5" />}
          Available
        </span>
      );
    case "LIMITED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
            className
          )}
        >
          {showIcon && <AlertTriangle className="w-3.5 h-3.5" />}
          Limited
        </span>
      );
    case "UNAVAILABLE":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
            className
          )}
        >
          {showIcon && <XCircle className="w-3.5 h-3.5" />}
          Unavailable
        </span>
      );
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
            className
          )}
        >
          {showIcon && <HelpCircle className="w-3.5 h-3.5" />}
          Unknown
        </span>
      );
  }
}
