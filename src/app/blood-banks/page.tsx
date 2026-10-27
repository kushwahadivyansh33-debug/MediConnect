"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Phone,
  PhoneCall,
  Clock,
  Filter,
  Droplet,
  ChevronRight,
  ShieldCheck,
  Building,
  Heart,
} from "lucide-react";
import { BloodBank, BloodGroup } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function BloodBanksFinderContent() {
  const searchParams = useSearchParams();

  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters from Reference Panel 4
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [areaFilter, setAreaFilter] = useState(searchParams.get("area") || "Lucknow");
  const [selectedGroup, setSelectedGroup] = useState<string>(searchParams.get("group") || "O+");

  const [statusFilters, setStatusFilters] = useState<{ [key: string]: boolean }>({
    Available: true,
    Limited: true,
    Unavailable: false,
    Unknown: false,
  });

  const [sortBy, setSortBy] = useState<"nearest" | "updated">("nearest");

  const fetchBloodBanks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (areaFilter && areaFilter !== "ALL") params.set("area", areaFilter);
      if (selectedGroup && selectedGroup !== "ALL") params.set("group", selectedGroup);

      const res = await fetch(`/api/blood-banks?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load blood banks");
      const data: BloodBank[] = await res.json();
      setBloodBanks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodBanks();
  }, [selectedGroup, areaFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBloodBanks();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setAreaFilter("ALL");
    setSelectedGroup("ALL");
    setStatusFilters({
      Available: true,
      Limited: true,
      Unavailable: false,
      Unknown: false,
    });
  };

  const toggleStatus = (st: string) => {
    setStatusFilters((prev) => ({ ...prev, [st]: !prev[st] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Headline Header matching Reference 4 */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
          Find Blood. Connect Faster.
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Search for blood banks near you and check reported availability by blood group. This information is for reference only (DEMO DATA).
        </p>
      </div>

      {/* Top Search Filter Bar matching Reference 4 */}
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
            placeholder="Search blood bank or area..."
            className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden"
          />
        </div>

        <div className="relative flex items-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-2 md:pt-0 md:pl-2 shrink-0 w-full md:w-auto">
          <MapPin className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="bg-transparent text-sm font-medium px-2 py-1.5 text-slate-700 dark:text-slate-300 outline-hidden cursor-pointer"
          >
            <option value="Lucknow">Lucknow</option>
            <option value="Hazratganj">Hazratganj, Lucknow</option>
            <option value="Aliganj">Aliganj, Lucknow</option>
            <option value="Indira Nagar">Indira Nagar, Lucknow</option>
            <option value="ALL">All Regions</option>
          </select>
        </div>

        {/* Selected Blood Group Mini Badge in Search */}
        <div className="relative flex items-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-2 md:pt-0 md:pl-2 shrink-0">
          <Droplet className="w-4 h-4 text-rose-600 ml-2 shrink-0" />
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="bg-transparent text-sm font-bold font-mono px-2 py-1.5 text-rose-600 dark:text-rose-400 outline-hidden cursor-pointer"
          >
            <option value="ALL">All Groups</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
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

      {/* Blood Group Selector Row matching Reference 4 */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {BLOOD_GROUPS.map((bg) => {
          const isSelected = selectedGroup === bg;
          return (
            <button
              key={bg}
              type="button"
              onClick={() => setSelectedGroup(bg)}
              className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition text-center border ${
                isSelected
                  ? "bg-[#0284C7] text-white border-[#0284C7] shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400"
              }`}
            >
              {bg}
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Panel (lg:col-span-3) */}
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

          {/* Availability */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Availability</h4>
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

          {/* Sort By */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sort By</h4>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortByBlood"
                  checked={sortBy === "nearest"}
                  onChange={() => setSortBy("nearest")}
                  className="text-[#0284C7] focus:ring-[#0284C7]"
                />
                <span>Nearest First</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortByBlood"
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

        {/* Right Blood Banks Results (lg:col-span-9) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">{bloodBanks.length}</strong> blood banks found
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Checking blood bank inventory...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bloodBanks.map((bb, idx) => {
                const isFirst = idx === 0;
                const status = isFirst ? "LIMITED" : idx === 1 ? "AVAILABLE" : "UNKNOWN";

                return (
                  <div
                    key={bb.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-card transition flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                          <Droplet className="w-5 h-5 fill-rose-600/20" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {bb.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {bb.hospitalName || bb.area}
                          </p>
                          <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-[#0284C7]" />
                            {bb.phone}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <StatusBadge status={status as any} />
                      </div>
                    </div>

                    {/* Reported Units Breakdown matching Reference 4 */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                        Reported Units
                      </span>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-700 dark:text-slate-300">
                        {bb.inventory.slice(0, 4).map((inv) => (
                          <div key={inv.bloodGroup} className="flex items-center gap-1">
                            <span className="font-bold text-slate-900 dark:text-white">{inv.bloodGroup}</span>
                            <span className="text-slate-500">{inv.unitsAvailable ?? 0}</span>
                          </div>
                        ))}
                        {bb.inventory.slice(4, 8).map((inv) => (
                          <div key={inv.bloodGroup} className="flex items-center gap-1">
                            <span className="font-bold text-slate-900 dark:text-white">{inv.bloodGroup}</span>
                            <span className="text-slate-500">{inv.unitsAvailable ?? 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verified & Timestamp Footer with Call Action */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                        <span>•</span>
                        <span>Last updated: Apr 28, 2025, 09:20 AM</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link
                          href={`/blood-banks/${bb.id}`}
                          className="flex-1 sm:flex-initial text-center py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0284C7] text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                        >
                          View Details
                        </Link>
                        <a
                          href={`tel:${bb.phone}`}
                          className="py-1.5 px-3 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Numbered Pagination matching Reference 4 */}
              <div className="flex items-center justify-center gap-1.5 pt-6">
                <button className="w-8 h-8 rounded-lg text-xs font-bold bg-[#0284C7] text-white shadow-xs">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  2
                </button>
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

export default function BloodBanksPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading Blood Bank Finder...</div>}>
      <BloodBanksFinderContent />
    </Suspense>
  );
}
