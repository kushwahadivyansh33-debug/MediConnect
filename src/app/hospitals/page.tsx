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
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Building2,
  Stethoscope,
  Activity,
  Layers,
  Map,
} from "lucide-react";
import { Facility } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

function HospitalsFinderContent() {
  const searchParams = useSearchParams();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters from Reference Panel 2
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [areaFilter, setAreaFilter] = useState(searchParams.get("area") || "Lucknow");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Multi-checkbox equipment filters
  const [selectedServices, setSelectedServices] = useState<{ [key: string]: boolean }>({
    ICU: true,
    Ventilator: true,
    "X-Ray": true,
    ECG: true,
    "CT Scan": false,
    MRI: false,
    Lab: false,
    Pharmacy: false,
  });

  // Status checkboxes
  const [statusFilters, setStatusFilters] = useState<{ [key: string]: boolean }>({
    Available: true,
    Limited: true,
    Unavailable: true,
    Unknown: false,
  });

  const [sortBy, setSortBy] = useState<"name" | "updated">("updated");

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (areaFilter && areaFilter !== "ALL") params.set("area", areaFilter);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [areaFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHospitals();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setAreaFilter("ALL");
    setSortBy("updated");
    setSelectedServices({
      ICU: true,
      Ventilator: true,
      "X-Ray": true,
      ECG: true,
      "CT Scan": false,
      MRI: false,
      Lab: false,
      Pharmacy: false,
    });
    setStatusFilters({
      Available: true,
      Limited: true,
      Unavailable: true,
      Unknown: false,
    });
  };

  const toggleService = (srv: string) => {
    setSelectedServices((prev) => ({ ...prev, [srv]: !prev[srv] }));
  };

  const toggleStatus = (st: string) => {
    setStatusFilters((prev) => ({ ...prev, [st]: !prev[st] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search & Location Header Bar (Matching Reference 2) */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs flex flex-col md:flex-row items-center gap-2"
      >
        <div className="relative flex-1 flex items-center w-full">
          <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospitals, area, or facility..."
            className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden"
          />
        </div>

        <div className="relative flex items-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-2 md:pt-0 md:pl-2 shrink-0 w-full md:w-auto">
          <MapPin className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="bg-transparent text-sm font-medium px-2 py-1.5 text-slate-700 dark:text-slate-300 outline-hidden cursor-pointer w-full"
          >
            <option value="Lucknow">Lucknow</option>
            <option value="Gomti Nagar">Gomti Nagar, Lucknow</option>
            <option value="Hazratganj">Hazratganj, Lucknow</option>
            <option value="Aliganj">Aliganj, Lucknow</option>
            <option value="ALL">All Regions</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-6 py-2 rounded-xl text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-xs transition flex items-center justify-center gap-2 w-full md:w-auto shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </button>
      </form>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-500" />
              Filters
            </span>
            <button
              onClick={handleClearFilters}
              className="text-xs text-[#0284C7] hover:underline font-semibold"
            >
              Clear Filters
            </button>
          </div>

          {/* Section 1: Facilities & Equipment Checkboxes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Facilities & Equipment</h4>
            <div className="space-y-2">
              {Object.keys(selectedServices).map((srv) => (
                <label key={srv} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedServices[srv]}
                    onChange={() => toggleService(srv)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                  />
                  <span>{srv}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Status Checkboxes */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Status</h4>
            <div className="space-y-2">
              {Object.keys(statusFilters).map((st) => (
                <label key={st} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={statusFilters[st]}
                    onChange={() => toggleStatus(st)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Sort By Radio Buttons */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sort By</h4>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === "name"}
                  onChange={() => setSortBy("name")}
                  className="text-[#0284C7] focus:ring-[#0284C7]"
                />
                <span>Name (A-Z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === "updated"}
                  onChange={() => setSortBy("updated")}
                  className="text-[#0284C7] focus:ring-[#0284C7]"
                />
                <span>Last Updated</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleClearFilters}
              className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Right Hospital Results Area (lg:col-span-9) */}
        <div className="lg:col-span-9 space-y-4">
          {/* Top Results Controls Row matching Reference 2 */}
          <div className="flex items-center justify-between">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  viewMode === "map"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map View</span>
              </button>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">{facilities.length}</strong> hospitals found
            </span>
          </div>

          {/* Results List */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#0284C7] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Updating hospital status...</p>
            </div>
          ) : viewMode === "map" ? (
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700 space-y-2">
              <MapPin className="w-8 h-8 text-[#0284C7] mx-auto animate-bounce" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Map View Simulation</h4>
              <p className="text-xs text-slate-500">Displaying geospatial facility coordinates across Lucknow and NCR.</p>
              <button onClick={() => setViewMode("list")} className="text-xs text-[#0284C7] font-semibold underline">
                Switch back to List View
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {facilities.map((hosp, idx) => {
                const icu = hosp.resources.find((r) => r.name.toLowerCase().includes("icu"));
                const status = icu?.status || "AVAILABLE";
                const img = hosp.image || `/images/hospital-${(idx % 3) + 1}.svg`;
                const dist = hosp.distanceKm || (idx === 0 ? 1.2 : idx === 1 ? 3.8 : 5.4);

                return (
                  <div
                    key={hosp.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-card transition flex flex-col sm:flex-row items-start gap-4 justify-between"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Image Thumbnail matching Reference */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                        <Image src={img} alt={hosp.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                            {hosp.name}
                          </h3>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {hosp.area}, {hosp.city}
                        </p>

                        <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 pt-0.5">
                          <Phone className="w-3.5 h-3.5 text-[#0284C7]" />
                          {hosp.phone}
                        </p>

                        {/* Listed Services Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-600 dark:text-slate-400">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                          <span>ICU, Ventilator, X-Ray, ECG</span>
                        </div>

                        <p className="text-[11px] font-mono text-slate-400 pt-1">
                          Last updated: Apr 28, 2025, 10:30 AM
                        </p>
                      </div>
                    </div>

                    {/* Right Action Column matching Reference */}
                    <div className="sm:self-stretch flex flex-col justify-between items-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 self-start sm:self-end">
                        <StatusBadge status={status} />
                        <span className="text-xs text-slate-500 font-mono flex items-center gap-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {dist} km
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link
                          href={`/hospitals/${hosp.id}`}
                          className="flex-1 sm:flex-initial text-center py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0284C7] text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0284C7] transition"
                        >
                          View Details
                        </Link>
                        <a
                          href={`tel:${hosp.emergencyPhone}`}
                          className="py-2 px-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Numbered Pagination matching Reference 2 */}
              <div className="flex items-center justify-center gap-1.5 pt-6">
                <button className="w-8 h-8 rounded-lg text-xs font-bold bg-[#0284C7] text-white shadow-xs">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  3
                </button>
                <span className="text-slate-400 px-1">...</span>
                <button className="w-8 h-8 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <ChevronRight className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading Hospital Finder...</div>}>
      <HospitalsFinderContent />
    </Suspense>
  );
}
