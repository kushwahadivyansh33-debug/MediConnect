"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Mic, Building2, Droplet } from "lucide-react";

const AREAS = ["All Areas", "Lucknow", "Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar"];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("Lucknow");
  const [mode, setMode] = useState<"hospitals" | "blood">("hospitals");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (area && area !== "All Areas") params.set("area", area);
    router.push(mode === "hospitals" ? `/hospitals?${params}` : `/blood-banks?${params}`);
  };

  return (
    <div className="space-y-3">
      {/* Mode toggle pills */}
      <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
        <button
          type="button"
          onClick={() => setMode("hospitals")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === "hospitals"
              ? "bg-white dark:bg-slate-700 text-[#E88A05] shadow-xs"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Hospitals
        </button>
        <button
          type="button"
          onClick={() => setMode("blood")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === "blood"
              ? "bg-white dark:bg-slate-700 text-rose-600 shadow-xs"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Droplet className="w-3.5 h-3.5" />
          Blood Banks
        </button>
      </div>

      {/* Main search form */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row items-stretch gap-0 bg-white dark:bg-slate-900 rounded-2xl border border-[#E4EAF1] dark:border-slate-700 shadow-card overflow-hidden"
      >
        <div className="flex-1 flex items-center gap-2 px-4 py-3">
          <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === "hospitals" ? "Search hospital name, area, or facility…" : "Search blood bank, blood group, or area…"}
            className="flex-1 bg-transparent text-sm text-[#101828] dark:text-white placeholder:text-slate-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t sm:border-t-0 sm:border-l border-[#E4EAF1] dark:border-slate-700 shrink-0">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="bg-transparent text-sm font-medium text-[#475467] dark:text-slate-300 outline-none cursor-pointer"
          >
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 border-t sm:border-t-0 sm:border-l-0">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#E88A05] hover:bg-[#C45F08] text-white text-sm font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
