import React from "react";

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="skeleton w-16 h-16 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-3 rounded" style={{ width: `${80 - i * 15}%` }} />
      ))}
      <div className="flex gap-2 pt-1">
        <div className="skeleton h-8 flex-1 rounded-xl" />
        <div className="skeleton h-8 w-16 rounded-xl" />
      </div>
    </div>
  );
}
