"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Droplet,
  Search,
  Filter,
  PhoneCall,
  Clock,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Heart,
  AlertCircle,
} from "lucide-react";
import { BloodBank, BloodGroup } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function BloodBanksContent() {
  const searchParams = useSearchParams();

  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedGroup, setSelectedGroup] = useState<string>(searchParams.get("group") || "ALL");
  const [areaFilter, setAreaFilter] = useState(searchParams.get("area") || "ALL");

  const fetchBloodBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (selectedGroup !== "ALL") params.set("group", selectedGroup);
      if (areaFilter !== "ALL") params.set("area", areaFilter);

      const res = await fetch(`/api/blood-banks?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load blood banks");
      const data: BloodBank[] = await res.json();
      setBloodBanks(data);
    } catch (err: any) {
      setError(err.message || "Failed to load blood bank data");
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

  const handleReset = () => {
    setSearchQuery("");
    setSelectedGroup("ALL");
    setAreaFilter("ALL");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground font-semibold">Blood Bank Directory</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              Blood Bank Availability & Component Directory
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Search certified blood banks across all 8 ABO/Rh blood groups with reported unit reserves and laboratory contacts.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full">
            DEMO DATA INVENTORY
          </span>
        </div>
      </div>

      {/* Blood Group Quick-Selector Bar */}
      <div className="bg-card border border-border p-4 rounded-2xl shadow-subtle space-y-3 text-card-foreground">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            Select Blood Group (ABO / Rh)
          </span>
          {selectedGroup !== "ALL" && (
            <button
              onClick={() => setSelectedGroup("ALL")}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Show All Groups
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-9 gap-2">
          <button
            type="button"
            onClick={() => setSelectedGroup("ALL")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition text-center ${
              selectedGroup === "ALL"
                ? "bg-foreground text-background shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              type="button"
              onClick={() => setSelectedGroup(bg)}
              className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition text-center ${
                selectedGroup === bg
                  ? "bg-rose-600 text-white shadow-subtle"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Location Filter */}
      <div className="bg-card border border-border p-4 sm:p-6 rounded-2xl shadow-subtle space-y-4 text-card-foreground">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blood bank or hospital name..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl text-foreground focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl text-foreground focus:outline-hidden"
            >
              <option value="ALL">All Regions / Cities</option>
              <option value="Lucknow">Lucknow (All)</option>
              <option value="Kanpur Road">Lucknow — Kanpur Road</option>
              <option value="Kaiserbagh">Lucknow — Kaiserbagh</option>
              <option value="New Delhi">New Delhi (All)</option>
              <option value="Tughlakabad">New Delhi — Tughlakabad</option>
              <option value="Raja Garden">New Delhi — Raja Garden</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold bg-primary text-white hover:bg-primary-hover shadow-subtle transition flex items-center justify-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Banks</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset all"
              className="p-2 border border-border rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">Checking blood bank inventory logs...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : bloodBanks.length === 0 ? (
        <div className="py-16 text-center bg-card border border-border rounded-2xl p-8 space-y-4">
          <Droplet className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No matching blood banks</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No blood banks reporting stock for group {selectedGroup !== "ALL" ? selectedGroup : ""} in this area.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bloodBanks.map((bb) => (
            <div
              key={bb.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-card hover:border-rose-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{bb.name}</h3>
                    {bb.hospitalName && (
                      <p className="text-xs text-primary font-medium mt-0.5">
                        Affiliated: {bb.hospitalName}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {bb.address}, {bb.area}, {bb.city}
                    </p>
                  </div>
                  {bb.verified && (
                    <span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3" />
                      Certified
                    </span>
                  )}
                </div>

                {/* Inventory Table Grid */}
                <div className="mt-5">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-2">
                    Reported Inventory by Blood Group
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {bb.inventory.map((inv) => {
                      const isHighlighted = selectedGroup === "ALL" || selectedGroup === inv.bloodGroup;
                      return (
                        <div
                          key={inv.bloodGroup}
                          className={`p-2 rounded-xl border text-center transition ${
                            isHighlighted
                              ? "bg-card border-border"
                              : "opacity-40 bg-muted/20 border-transparent"
                          }`}
                        >
                          <span className="text-xs font-mono font-bold block text-foreground">
                            {inv.bloodGroup}
                          </span>
                          <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 block my-0.5">
                            {inv.unitsAvailable !== undefined ? `${inv.unitsAvailable} u` : "-"}
                          </span>
                          <StatusBadge status={inv.status} showIcon={false} className="px-1.5 py-0 text-[9px]" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground flex flex-wrap items-center justify-between font-mono gap-2">
                  <span>Hours: {bb.operatingHours}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Updated: {formatDate(bb.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                <a
                  href={`tel:${bb.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-card border border-border hover:bg-muted text-xs font-bold text-foreground transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-primary" />
                  Call Lab ({bb.phone})
                </a>
                <Link
                  href={`/blood-banks/${bb.id}`}
                  className="py-2 px-4 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-subtle transition flex items-center gap-1"
                >
                  <span>Details</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BloodBanksPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading Blood Banks...</div>}>
      <BloodBanksContent />
    </Suspense>
  );
}
