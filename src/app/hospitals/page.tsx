"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Hospital,
  Search,
  Filter,
  PhoneCall,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  RefreshCw,
} from "lucide-react";
import { Facility } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

function HospitalsContent() {
  const { t } = useApp();
  const searchParams = useSearchParams();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [areaFilter, setAreaFilter] = useState(searchParams.get("area") || "ALL");
  const [serviceFilter, setServiceFilter] = useState(searchParams.get("service") || "ALL");
  const [sortBy, setSortBy] = useState<"name" | "updated">("updated");

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (areaFilter !== "ALL") params.set("area", areaFilter);
      if (serviceFilter !== "ALL") params.set("service", serviceFilter);

      const res = await fetch(`/api/facilities?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load facilities");
      const data: Facility[] = await res.json();

      // Sort
      if (sortBy === "name") {
        data.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      }

      setFacilities(data);
    } catch (err: any) {
      setError(err.message || "Failed to load facility data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [areaFilter, serviceFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHospitals();
  };

  const handleReset = () => {
    setSearchQuery("");
    setAreaFilter("ALL");
    setServiceFilter("ALL");
    setSortBy("updated");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title & Breadcrumb Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground font-semibold">Hospitals Directory</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              Hospital Directory & Resource Tracking
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Verify real-time ICU capacity, operational ventilators, and emergency contacts across listed medical centers.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">
            DEMO DATA DATASET
          </span>
        </div>
      </div>

      {/* Filter / Search Bar Box */}
      <div className="bg-card border border-border p-4 sm:p-6 rounded-2xl shadow-subtle space-y-4 text-card-foreground">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Query search */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hospital name or keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Area filter */}
          <div>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl text-foreground focus:outline-hidden"
            >
              <option value="ALL">All Regions / Cities</option>
              <option value="Lucknow">Lucknow (All)</option>
              <option value="Kanpur Road">Lucknow — Kanpur Road</option>
              <option value="Chowk">Lucknow — Chowk</option>
              <option value="New Delhi">New Delhi (All)</option>
              <option value="Saket">New Delhi — Saket</option>
              <option value="Ansari Nagar">New Delhi — Ansari Nagar</option>
              <option value="Gurugram">Gurugram</option>
            </select>
          </div>

          {/* Service filter */}
          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl text-foreground focus:outline-hidden"
            >
              <option value="ALL">All Facilities & Equipment</option>
              <option value="icu">ICU Beds Available</option>
              <option value="ventilator">Ventilators Available</option>
              <option value="x-ray">X-Ray Diagnostics</option>
              <option value="ecg">ECG Services</option>
              <option value="oxygen">Oxygen Beds</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold bg-primary text-white hover:bg-primary-hover shadow-subtle transition flex items-center justify-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset all filters"
              className="p-2 border border-border rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Sort Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
          <span>Showing {facilities.length} healthcare facilities</span>
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <button
              onClick={() => setSortBy("updated")}
              className={`font-semibold ${sortBy === "updated" ? "text-primary" : "hover:text-foreground"}`}
            >
              Recently Updated
            </button>
            <span>•</span>
            <button
              onClick={() => setSortBy("name")}
              className={`font-semibold ${sortBy === "name" ? "text-primary" : "hover:text-foreground"}`}
            >
              Hospital Name
            </button>
          </div>
        </div>
      </div>

      {/* Main Results Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">Loading hospital availability...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 space-y-3">
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={fetchHospitals}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            Retry Loading
          </button>
        </div>
      ) : facilities.length === 0 ? (
        <div className="py-16 text-center bg-card border border-border rounded-2xl p-8 space-y-4">
          <Hospital className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No hospitals found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {t.common.noResultsFound}
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => {
            const icuRes = facility.resources.find((r) => r.name.toLowerCase().includes("icu"));
            const ventRes = facility.resources.find((r) => r.name.toLowerCase().includes("ventilator"));
            const oxyRes = facility.resources.find((r) => r.name.toLowerCase().includes("oxygen"));

            return (
              <div
                key={facility.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-card hover:border-primary/50 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        {facility.type}
                      </span>
                    </div>
                    {facility.verified && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-foreground mt-3 group-hover:text-primary transition line-clamp-1">
                    {facility.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {facility.address}, {facility.city}
                  </p>

                  {/* Resource Badges */}
                  <div className="mt-4 space-y-2">
                    {icuRes && (
                      <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/40 border border-border">
                        <span className="font-semibold text-foreground">ICU Beds:</span>
                        <div className="flex items-center gap-2">
                          {icuRes.availableUnits !== undefined && (
                            <span className="font-mono font-bold text-primary">
                              {icuRes.availableUnits} avail
                            </span>
                          )}
                          <StatusBadge status={icuRes.status} />
                        </div>
                      </div>
                    )}

                    {ventRes && (
                      <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/40 border border-border">
                        <span className="font-semibold text-foreground">Ventilators:</span>
                        <div className="flex items-center gap-2">
                          {ventRes.availableUnits !== undefined && (
                            <span className="font-mono font-bold text-primary">
                              {ventRes.availableUnits} avail
                            </span>
                          )}
                          <StatusBadge status={ventRes.status} />
                        </div>
                      </div>
                    )}

                    {oxyRes && (
                      <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/40 border border-border">
                        <span className="font-semibold text-foreground">Oxygen Beds:</span>
                        <div className="flex items-center gap-2">
                          {oxyRes.availableUnits !== undefined && (
                            <span className="font-mono font-bold text-primary">
                              {oxyRes.availableUnits} avail
                            </span>
                          )}
                          <StatusBadge status={oxyRes.status} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground space-y-1 font-mono">
                    <p className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated: {formatDate(facility.updatedAt)}
                    </p>
                    <p className="truncate">Source: {facility.dataSource}</p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                  <a
                    href={`tel:${facility.emergencyPhone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call Triage
                  </a>
                  <Link
                    href={`/hospitals/${facility.id}`}
                    className="py-2 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-subtle transition flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading Directory...</div>}>
      <HospitalsContent />
    </Suspense>
  );
}
