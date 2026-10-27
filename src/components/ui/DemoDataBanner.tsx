import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoDataBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-amber-500/10 border-b border-amber-500/25 px-4 py-2 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2 font-medium tracking-wide",
        className
      )}
    >
      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
      <span>
        <strong>DEMO DATA NOTICE:</strong> All inventory and bed quantities are simulated for demonstration. Always call the facility to verify live availability before transit.
      </span>
    </div>
  );
}
