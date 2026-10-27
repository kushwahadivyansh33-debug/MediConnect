"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold uppercase text-rose-600 tracking-widest">
            Error 500
          </span>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Something went wrong
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            An unexpected error occurred while communicating with the healthcare server. Your session data remains safe.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-subtle transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
