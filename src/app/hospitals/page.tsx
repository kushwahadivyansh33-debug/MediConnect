"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Phone,
  PhoneCall,
  Clock,
  ChevronRight,
  Filter,
  Building2,
  Stethoscope,
  Layers,
  X,
  SlidersHorizontal,
  MapPinned,
} from "lucide-react";
import { Facility } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { useBrowserLocation } from "@/hooks/useBrowserLocation";
import { distanceInKm } from "@/lib/location";

const SERVICES = ["ICU", "Ventilator", "X-Ray", "ECG", "CT Scan", "MRI", "Lab", "Pharmacy"];
const STATUS_OPTIONS = ["Available", "Limited", "Unavailable"];
const AREAS = ["All Regions", "Lucknow", "Gomti Nagar", "Hazratganj", "Aliganj"];

function HospitalsFinderContent() {
  const searchParams = useSearchParams();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [areaFilter, setAreaFilter]   = useState(searchParams.get("area") || "Lucknow");
  const [sortBy, setSortBy]           = useState<"name" | "updated">("updated");
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>(
    Object.fromEntries(SERVICES.map((s) => [s, false]))
  );
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>(
    Object.fromEntries(STATUS_OPTIONS.map((s) => [s, true]))
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { location, locating, error: locationError, requestLocation } = useBrowserLocation();

  const nearbyFacilities = location
    ? [...facilities].sort((left, right) => {
        const leftDistance = left.latitude === undefined || left.longitude === undefined
          ? Number.POSITIVE_INFINITY
          : distanceInKm(location, { latitude: left.latitude, longitude: left.longitude });
        const rightDistance = right.latitude === undefined || right.longitude === undefined
          ? Number.POSITIVE_INFINITY
          : distanceInKm(location, { latitude: right.latitude, longitude: right.longitude });
        return leftDistance - rightDistance;
      })
    : facilities;

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (areaFilter && areaFilter !== "All Regions") params.set("area", areaFilter);

      const res = await fetch(`/api/facilities?${params}`);
      if (!res.ok) throw new Error("Failed to load facilities");
      const data: Facility[] = await res.json();

      if (sortBy === "name") {
        data.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      }
      setFacilities(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHospitals(); }, [areaFilter, sortBy]);
  useEffect(() => {
    if (location) setAreaFilter("All Regions");
  }, [location]);

  const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); fetchHospitals(); };

  const handleClearFilters = () => {
    setSearchQuery("");
    setAreaFilter("Lucknow");
    setSortBy("updated");
    setSelectedServices(Object.fromEntries(SERVICES.map((s) => [s, false])));
    setStatusFilters(Object.fromEntries(STATUS_OPTIONS.map((s) => [s, true])));
  };

  const activeFilterCount =
    Object.values(selectedServices).filter(Boolean).length +
    Object.values(statusFilters).filter((v) => !v).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-[#101828] dark:text-white">Find Hospitals</h1>
          <p className="text-sm text-[#475467] dark:text-slate-400">
            Search reported resource availability at hospitals near you.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={requestLocation}
            disabled={locating}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E88A05]/30 bg-amber-50 px-3 py-2 text-xs font-semibold text-[#9A4A00] transition hover:bg-amber-100 disabled:opacity-60"
          >
            <MapPinned className="h-4 w-4" />
            {locating ? "Finding nearby hospitals…" : location ? "Refresh nearby hospitals" : "Use my location"}
          </button>
          <Link
            href="/hospitals/register"
            className="inline-flex items-center gap-2 rounded-lg bg-[#E88A05] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#C45F08]"
          >
            <Building2 className="h-4 w-4" />
            Register a hospital
          </Link>
        </div>
      </div>
      {location && <p className="mb-4 text-xs text-slate-500">Sorted by approximate distance; your location stays in this browser.</p>}
      {locationError && <p role="status" className="mb-4 text-xs text-amber-700">{locationError}</p>}

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
            placeholder="Search hospitals, area, or facility…"
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
          {/* Mobile filter toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E4EAF1] dark:border-slate-700 text-sm font-semibold text-[#475467] dark:text-slate-300 relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#E88A05] text-white text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </form>

      <div className="flex gap-7 items-start">

        {/* ── Left filter sidebar ── */}
        <aside className={`w-64 shrink-0 bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5 ${
          sidebarOpen ? "block" : "hidden lg:block"
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[#101828] dark:text-white flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-400" /> Filters
            </span>
            <button onClick={handleClearFilters} className="text-xs font-semibold text-[#E88A05] hover:underline">
              Clear all
            </button>
          </div>

          {/* Facilities */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[#101828] dark:text-white uppercase tracking-wide">Facilities</h4>
            <div className="space-y-2">
              {SERVICES.map((srv) => (
                <label key={srv} className="flex items-center gap-2.5 text-sm text-[#475467] dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedServices[srv]}
                    onChange={() => setSelectedServices((p) => ({ ...p, [srv]: !p[srv] }))}
                    className="w-4 h-4 rounded border-slate-300 text-[#E88A05] accent-[#E88A05]"
                  />
                  {srv}
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="pt-4 border-t border-[#E4EAF1] dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-[#101828] dark:text-white uppercase tracking-wide">Status</h4>
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

          {/* Sort */}
          <div className="pt-4 border-t border-[#E4EAF1] dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-[#101828] dark:text-white uppercase tracking-wide">Sort By</h4>
            <div className="space-y-2">
              {(["name", "updated"] as const).map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-[#475467] dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    checked={sortBy === s}
                    onChange={() => setSortBy(s)}
                    className="accent-[#E88A05]"
                  />
                  {s === "name" ? "Name (A–Z)" : "Last Updated"}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Right results area ── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Results header */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#475467] dark:text-slate-400">
              <strong className="text-[#101828] dark:text-white font-bold">{facilities.length}</strong> hospitals found
            </span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 text-[#101828] dark:text-white shadow-xs">
                <Layers className="w-3.5 h-3.5" /> List
              </button>
            </div>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="py-16 text-center space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-[#101828] dark:text-white">Failed to load hospitals</p>
              <p className="text-sm text-[#475467] dark:text-slate-400">{error}</p>
              <button
                onClick={fetchHospitals}
                className="px-4 py-2 rounded-xl bg-[#E88A05] text-white text-sm font-semibold hover:bg-[#C45F08] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && facilities.length === 0 && (
            <div className="py-16 text-center space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-[#101828] dark:text-white">No hospitals found</p>
              <p className="text-sm text-[#475467] dark:text-slate-400">Try adjusting your search or filters.</p>
              <button
                onClick={handleClearFilters}
                className="text-sm font-semibold text-[#E88A05] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Results */}
          {!loading && !error && facilities.length > 0 && (
            <div className="space-y-4">
              {nearbyFacilities.map((hosp, idx) => {
                const icu    = hosp.resources.find((r) => r.name.toLowerCase().includes("icu"));
                const status = icu?.status || "AVAILABLE";
                const img    = hosp.image || `/images/hospital-${(idx % 3) + 1}.svg`;
                const dist   = location && hosp.latitude !== undefined && hosp.longitude !== undefined
                  ? distanceInKm(location, { latitude: hosp.latitude, longitude: hosp.longitude }).toFixed(1)
                  : hosp.distanceKm || [1.2, 3.8, 5.4][idx % 3];

                return (
                  <div
                    key={hosp.id}
                    className="bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-card transition-all duration-200 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-28 h-32 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-[#E4EAF1] dark:border-slate-800 bg-amber-50 dark:bg-slate-800">
                      <Image src={img} alt={hosp.name} fill className="object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-base text-[#101828] dark:text-white leading-tight">
                          {hosp.name}
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <StatusBadge status={status} />
                          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {dist} km{location ? " approx." : ""}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-[#475467] dark:text-slate-400">
                        {hosp.area}, {hosp.city}
                      </p>

                      <p className="text-xs font-mono font-medium text-[#475467] dark:text-slate-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#E88A05]" /> {hosp.phone}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {hosp.resources.slice(0, 4).map((r) => (
                          <span
                            key={r.id}
                            className="text-[10px] font-medium bg-[#F7F9FC] dark:bg-slate-800 border border-[#E4EAF1] dark:border-slate-700 text-[#475467] dark:text-slate-400 px-2 py-0.5 rounded-md"
                          >
                            {r.name}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last updated: {new Date(hosp.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col justify-end items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#E4EAF1] dark:border-slate-800 sm:pl-5">
                      <Link
                        href={`/hospitals/${hosp.id}`}
                        className="flex-1 sm:flex-initial text-center px-4 py-2 rounded-xl border border-[#E4EAF1] dark:border-slate-700 hover:border-[#E88A05] text-sm font-semibold text-[#475467] dark:text-slate-200 hover:text-[#E88A05] transition-colors"
                      >
                        View Details
                      </Link>
                      <a
                        href={`tel:${hosp.emergencyPhone}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E88A05] hover:bg-[#C45F08] text-white text-sm font-semibold transition-colors shadow-xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {[1,2,3].map((i) => <SkeletonCard key={i} />)}
      </div>
    }>
      <HospitalsFinderContent />
    </Suspense>
  );
}
