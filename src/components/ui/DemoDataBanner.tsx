"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function DemoDataBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex items-center justify-between py-2 px-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-700/80 dark:border-amber-800/40">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="text-[11px] font-medium text-amber-800 dark:text-amber-200">
          DEMO DATA — Resource availability is simulated. Please call the facility to confirm before travelling.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="ml-4 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 text-sm leading-none shrink-0 transition-colors"
        aria-label="Dismiss banner"
      >
        ✕
      </button>
    </div>
  );
}
