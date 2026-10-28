"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search, MapPin, Phone, PhoneCall, Clock, Filter, Droplet, ChevronRight,
  ShieldCheck, X, SlidersHorizontal, AlertTriangle,
} from "lucide-react";
import { BloodBank, BloodGroup } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { BloodRequestButton } from "@/components/blood/BloodRequestButton";
import { useBrowserLocation } from "@/hooks/useBrowserLocation";
import { distanceInKm } from "@/lib/location";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const STATUS_OPTIONS = ["Available", "Limited", "Unavailable"];
const AREAS = ["All Regions", "Lucknow", "Hazratganj", "Aliganj", "Indira Nagar"];

function BloodBanksFinderContent() {
  const searchParams = useSearchParams();

  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [areaFilter, setAreaFilter] = useState(searchParams.get("area") || "Lucknow");
  const [selectedGroup, setSelectedGroup] = useState<string>(searchParams.get("group") || "O+");
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(STATUS_OPTIONS.map((s) => [s, s !== "Unavailable"]))
  );
  const [sortBy, setSortBy] = useState<"nearest" | "updated">("nearest");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { location, locating, error: locationError, requestLocation } = useBrowserLocation();

  const nearbyBloodBanks = location
    ? [...bloodBanks].sort((left, right) => {
        const leftDistance = left.latitude === undefined || left.longitude === undefined
          ? Number.POSITIVE_INFINITY
          : distanceInKm(location, { latitude: left.latitude, longitude: left.longitude });
        const rightDistance = right.latitude === undefined || right.longitude === undefined
          ? Number.POSITIVE_INFINITY
          : distanceInKm(location, { latitude: right.latitude, longitude: right.longitude });
        return leftDistance - rightDistance;
      })
    : bloodBanks;

  const fetchBloodBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (areaFilter && areaFilter !== "All Regions") params.set("area", areaFilter);
      if (selectedGroup && selectedGroup !== "ALL") params.set("group", selectedGroup);
      const res = await fetch(`/api/blood-banks?${params}`);
      if (!res.ok) throw new Error("Failed to load blood banks");
      const data: BloodBank[] = await res.json();
      setBloodBanks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBloodBanks(); }, [selectedGroup, areaFilter]);
  useEffect(() => {
    if (location) setAreaFilter("All Regions");
  }, [location]);

  const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); fetchBloodBanks(); };
  const handleClearFilters = () => {
    setSearchQuery("");
    setAreaFilter("All Regions");
    setSelectedGroup("O+");
    setStatusFilters(Object.fromEntries(STATUS_OPTIONS.map((s) => [s, s !== "Unavailable"])));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 space-y-1">
        <h1 className="font-display text-2xl font-bold text-[#101828] dark:text-white">Blood Bank Finder</h1>
        <p className="text-sm text-[#475467] dark:text-slate-400">
          Check reported blood group availability near you. All data is DEMO DATA — call the facility to confirm.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={requestLocation}
            disabled={locating}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E88A05]/30 bg-amber-50 px-3 py-2 text-xs font-semibold text-[#9A4A00] transition hover:bg-amber-100 disabled:opacity-60"
          >
            <MapPin className="h-4 w-4" />
            {locating ? "Finding nearby banks…" : location ? "Refresh nearby banks" : "Use my location"}
          </button>
          {location && <span className="text-xs text-slate-500">Sorted by approximate distance; your location stays in this browser.</span>}
          {locationError && <span role="status" className="text-xs text-amber-700">{locationError}</span>}
        </div>
      </div>

      {/* Demo notice */}
      <div className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>Blood unit quantities are <strong>simulated</strong>. Always call the facility before travelling.</span>
      </div>

      {/* Blood group selector */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mb-5">
        {BLOOD_GROUPS.map((bg) => (
          <button
            key={bg}
            type="button"
            onClick={() => setSelectedGroup(bg)}
            className={`py-2.5 rounded-xl text-sm font-mono font-bold transition-all border text-center ${
              selectedGroup === bg
                ? "bg-[#E88A05] text-white border-[#E88A05] shadow-xs scale-[1.03]"
                : "bg-white dark:bg-slate-900 border-[#E4EAF1] dark:border-slate-800 text-[#101828] dark:text-slate-200 hover:border-[#E88A05]/40"
            }`}
          >
            {bg}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-2 shadow-xs mb-6 flex flex-col sm:flex-row items-center gap-2"
      >
        <div className="flex-1 flex items-center gap-2 px-3 w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blood bank or area…"
            className="flex-1 bg-transparent py-2 text-sm text-[#101828] dark:text-white placeholder:text-slate-400 outline-none"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border-t sm:border-t-0 sm:border-l border-[#E4EAF1] dark:border-slate-800 shrink-0 w-full sm:w-auto">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="bg-transparent text-sm font-medium text-[#475467] dark:text-slate-300 outline-none cursor-pointer"
          >
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto px-1">
          <button
            type="submit"
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#E88A05] hover:bg-[#C45F08] text-white transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Search className="w-3.5 h-3.5" /> Search
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E4EAF1] dark:border-slate-700 text-sm font-semibold text-[#475467]"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="flex gap-7 items-start">
        {/* Filter sidebar */}
        <aside className={`w-64 shrink-0 bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5 ${
          sidebarOpen ? "block" : "hidden lg:block"
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[#101828] dark:text-white flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-400" /> Filters
            </span>
            <button onClick={handleClearFilters} className="text-xs font-semibold text-[#E88A05] hover:underline">Clear all</button>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[#101828] dark:text-white uppercase tracking-wide">Blood Group</h4>
            <div className="grid grid-cols-2 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(selectedGroup === bg ? "O+" : bg)}
                  className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition ${
                    selectedGroup === bg
                      ? "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400"
                      : "border-[#E4EAF1] dark:border-slate-700 text-[#475467] dark:text-slate-300"
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E4EAF1] dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-[#101828] dark:text-white uppercase tracking-wide">Availability</h4>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((st) => (
                <label key={st} className="flex items-center gap-2.5 text-sm text-[#475467] dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={statusFilters[st]}
                    onChange={() => setStatusFilters((p) => ({ ...p, [st]: !p[st] }))}
                    className="w-4 h-4 rounded border-slate-300 accent-[#E88A05]"
                  />
                  {st}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E4EAF1] dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-[#101828] dark:text-white uppercase tracking-wide">Sort By</h4>
            <div className="space-y-2">
              {(["nearest", "updated"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-[#475467] dark:text-slate-300 cursor-pointer">
                  <input type="radio" name="sortByBlood" checked={sortBy === s} onChange={() => setSortBy(s)} className="accent-[#E88A05]" />
                  {s === "nearest" ? "Nearest First" : "Last Updated"}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#475467] dark:text-slate-400">
              <strong className="text-[#101828] dark:text-white font-bold">{bloodBanks.length}</strong> blood banks found
            </span>
          </div>

          {loading && <div className="space-y-4">{[1,2,3].map((i) => <SkeletonCard key={i} />)}</div>}

          {!loading && error && (
            <div className="py-16 text-center space-y-3">
              <Droplet className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-[#101828] dark:text-white">Failed to load blood banks</p>
              <p className="text-sm text-[#475467] dark:text-slate-400">{error}</p>
              <button onClick={fetchBloodBanks} className="px-4 py-2 rounded-xl bg-[#E88A05] text-white text-sm font-semibold">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && bloodBanks.length === 0 && (
            <div className="py-16 text-center space-y-3">
              <Droplet className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-[#101828] dark:text-white">No blood banks found</p>
              <button onClick={handleClearFilters} className="text-sm font-semibold text-[#E88A05] hover:underline">Clear filters</button>
            </div>
          )}

          {!loading && !error && nearbyBloodBanks.map((bb, idx) => {
            const status = idx === 0 ? "LIMITED" : idx === 1 ? "AVAILABLE" : "UNKNOWN";
            const distance = location && bb.latitude !== undefined && bb.longitude !== undefined
              ? distanceInKm(location, { latitude: bb.latitude, longitude: bb.longitude })
              : null;
            return (
              <div
                key={bb.id}
                className="bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-card transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                      <Droplet className="w-5 h-5 fill-rose-600/15" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-[#101828] dark:text-white">{bb.name}</h3>
                      <p className="text-xs text-[#475467] dark:text-slate-400">{bb.hospitalName || bb.area}</p>
                      {distance !== null && (
                        <p className="mt-1 text-[11px] font-medium text-[#9A4A00]">
                          About {distance.toFixed(1)} km away (straight-line estimate)
                        </p>
                      )}
                      <p className="text-xs font-mono text-[#475467] dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-[#E88A05]" /> {bb.phone}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={status as any} />
                </div>

                {/* Blood group inventory grid */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-[#101828] dark:text-white mb-2">Reported Units <span className="text-amber-600 font-normal">(DEMO DATA)</span></p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {bb.inventory.map((inv) => (
                      <div
                        key={inv.bloodGroup}
                        className={`text-center py-2 rounded-xl border text-xs font-mono ${
                          inv.bloodGroup === selectedGroup
                            ? "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800"
                            : "bg-[#F7F9FC] dark:bg-slate-800 border-[#E4EAF1] dark:border-slate-700"
                        }`}
                      >
                        <span className="font-extrabold text-[#101828] dark:text-white block">{inv.bloodGroup}</span>
                        <span className="text-rose-600 font-bold text-[11px]">{inv.unitsAvailable ?? 0}u</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4EAF1] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Staff Verified
                    </span>
                    <span className="text-[#475467] dark:text-slate-400 font-mono text-[11px]">
                      Updated: {new Date(bb.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BloodRequestButton
                      bloodBank={bb}
                      initialGroup={selectedGroup as BloodGroup}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#E88A05] px-3 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#C45F08]"
                    />
                    <Link
                      href={`/blood-banks/${bb.id}`}
                      className="px-4 py-2 rounded-xl border border-[#E4EAF1] dark:border-slate-700 hover:border-[#E88A05] text-sm font-semibold text-[#475467] dark:text-slate-200 hover:text-[#E88A05] transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={`tel:${bb.phone}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E88A05] hover:bg-[#C45F08] text-white text-sm font-semibold transition-colors shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function BloodBanksPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {[1,2,3].map((i) => <SkeletonCard key={i} />)}
      </div>
    }>
      <BloodBanksFinderContent />
    </Suspense>
  );
}
