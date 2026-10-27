import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold uppercase text-primary tracking-widest">
            Error 404
          </span>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Healthcare Record Not Found
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
            We couldn&apos;t locate the requested page, hospital ID, or blood bank record. It may have been moved or updated.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-subtle transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/hospitals"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition"
          >
            <span>Hospitals Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
