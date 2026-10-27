"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Activity,
  Droplet,
  History,
  LogOut,
  Edit3,
  Clock,
  Save,
  X,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Check,
  Search,
  Bell,
  Settings,
  Shield,
  Layers,
  ChevronDown,
} from "lucide-react";
import { Facility, BloodBank, AuditLog, ResourceStatus, User } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

function StaffDashboardContent() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Sidebar Menu Tab matching Reference 7
  const [activeNav, setActiveNav] = useState<
    "overview" | "facilities" | "equipment" | "blood" | "history" | "notifications" | "settings"
  >("overview");

  // Filter state for Update History (Panel 9)
  const [historySearch, setHistorySearch] = useState("");
  const [historyResourceFilter, setHistoryResourceFilter] = useState("ALL");

  // Modal State for Update Resource (Panel 8)
  const [editingModalOpen, setEditingModalOpen] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState("fac_apollo_lko");
  const [selectedResourceType, setSelectedResourceType] = useState("Ventilator");
  const [editStatus, setEditStatus] = useState<ResourceStatus>("AVAILABLE");
  const [editQuantity, setEditQuantity] = useState(8);
  const [editNotes, setEditNotes] = useState("Checked with hospital staff - DEMO DATA");

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meData.user) {
        router.push("/login");
        return;
      }
      setUser(meData.user);

      const facRes = await fetch("/api/facilities");
      const facData = await facRes.json();
      setFacilities(facData);

      const bbRes = await fetch("/api/blood-banks");
      const bbData = await bbRes.json();
      setBloodBanks(bbData);

      const audRes = await fetch("/api/audit-logs");
      const audData = await audRes.json();
      setAuditLogs(audData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const handleSaveResourceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const facility = facilities.find((f) => f.id === selectedFacilityId) || facilities[0];
      const resItem =
        facility?.resources.find((r) => r.name.toLowerCase().includes(selectedResourceType.toLowerCase())) ||
        facility?.resources[0];

      if (!facility || !resItem) return;

      const res = await fetch(`/api/facilities/${facility.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resItem.id,
          status: editStatus,
          availableUnits: editQuantity,
          notes: editNotes,
        }),
      });

      if (!res.ok) throw new Error("Failed to save resource change");

      setToastMessage(`Updated ${selectedResourceType} to ${editStatus} (${editQuantity} units)`);
      setTimeout(() => setToastMessage(null), 4000);
      setEditingModalOpen(false);
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to save update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#0284C7] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Connecting to clinical console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 flex flex-col lg:flex-row">
      {/* 1. DARK NAVY SIDEBAR (Matching Panel 7 Reference: #0F172A / #1E293B) */}
      <aside className="w-full lg:w-60 bg-[#0F172A] text-slate-300 flex flex-col justify-between shrink-0 p-4 border-r border-slate-800">
        <div className="space-y-6">
          {/* Brand Logo in Sidebar */}
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-lg bg-[#0284C7] flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#0284C7" stroke="#0284C7" />
                <path d="M12 8v8M8 12h8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-display font-extrabold text-lg text-white tracking-tight">
              Medi<span className="text-[#38BDF8]">Connect</span>
            </span>
          </div>

          {/* User Profile Pill matching Reference 7 */}
          <div className="bg-[#1E293B] p-3 rounded-2xl flex items-center gap-3 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-[#0284C7] text-white font-bold flex items-center justify-center text-xs">
              {user?.name.charAt(0) || "P"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs text-white truncate">
                {user?.name || "Dr. Priya Sharma"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">Hospital Staff</p>
            </div>
          </div>

          {/* Sidebar Nav Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveNav("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "overview"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveNav("facilities")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "facilities"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Facilities</span>
            </button>

            <button
              onClick={() => setActiveNav("equipment")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "equipment"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Equipment</span>
            </button>

            <button
              onClick={() => setActiveNav("blood")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "blood"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Droplet className="w-4 h-4" />
              <span>Blood Inventory</span>
            </button>

            <button
              onClick={() => setActiveNav("history")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "history"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Update History</span>
            </button>

            <button
              onClick={() => setActiveNav("notifications")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "notifications"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </button>

            <button
              onClick={() => setActiveNav("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeNav === "settings"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Logout Bottom Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. REFINED LIGHT DASHBOARD MAIN CONTENT */}
      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-x-hidden">
        {/* Top Header Row matching Reference 7 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              City Care Hospital • Last updated: Apr 28, 2025, 10:30 AM
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-xs transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Resource</span>
            </button>
          </div>
        </div>

        {/* Toast confirmation */}
        {toastMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> {toastMessage}
            </span>
            <button onClick={() => setToastMessage(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4 Metric Cards matching Reference 7 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Resources */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Total Resources
            </span>
            <span className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white block">
              24
            </span>
            <span className="text-[11px] font-mono text-emerald-600 block pt-1">
              +2 since last week
            </span>
          </div>

          {/* Card 2: Available */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Available
            </span>
            <span className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white block">
              18
            </span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full w-[75%]" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono block pt-0.5">75% capacity</span>
          </div>

          {/* Card 3: Limited */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Limited
            </span>
            <span className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white block">
              4
            </span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-amber-500 h-full w-[17%]" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono block pt-0.5">17% constrained</span>
          </div>

          {/* Card 4: Unavailable */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Unavailable
            </span>
            <span className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white block">
              2
            </span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-rose-500 h-full w-[8%]" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono block pt-0.5">8% full</span>
          </div>
        </div>

        {/* Facilities / Blood Inventory Tab Switcher inside Dashboard */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNav("overview")}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#0284C7] text-white shadow-xs"
          >
            Facilities
          </button>
          <button
            onClick={() => setActiveNav("blood")}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            Blood Inventory
          </button>
        </div>

        {/* 3. RECENT UPDATES TABLE (Matching Reference 7 Table Composition) */}
        {activeNav === "overview" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Updates</h3>
              <button
                onClick={() => setActiveNav("history")}
                className="text-xs font-bold text-[#0284C7] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                    <th className="pb-3 font-semibold">Resource</th>
                    <th className="pb-3 font-semibold">Previous Status</th>
                    <th className="pb-3 font-semibold">New Status</th>
                    <th className="pb-3 font-semibold">Updated By</th>
                    <th className="pb-3 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">Ventilator</td>
                    <td className="py-3">
                      <StatusBadge status="LIMITED" showIcon={false} />
                    </td>
                    <td className="py-3">
                      <StatusBadge status="AVAILABLE" showIcon={false} />
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">Dr. Priya Sharma</td>
                    <td className="py-3 font-mono text-slate-400">10:30 AM</td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">ICU Bed</td>
                    <td className="py-3">
                      <StatusBadge status="AVAILABLE" showIcon={false} />
                    </td>
                    <td className="py-3">
                      <StatusBadge status="LIMITED" showIcon={false} />
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">Dr. Amit Verma</td>
                    <td className="py-3 font-mono text-slate-400">09:45 AM</td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">X-Ray Machine</td>
                    <td className="py-3">
                      <StatusBadge status="UNAVAILABLE" showIcon={false} />
                    </td>
                    <td className="py-3">
                      <StatusBadge status="AVAILABLE" showIcon={false} />
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">Dr. Rohan Singh</td>
                    <td className="py-3 font-mono text-slate-400">08:20 AM</td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">Blood Bank (O-)</td>
                    <td className="py-3 font-mono text-rose-600 font-bold">12 → 8 units</td>
                    <td className="py-3 font-mono text-emerald-600 font-bold">+ 8 units</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">Priya Sharma</td>
                    <td className="py-3 font-mono text-slate-400">07:15 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>3 resources need update based on 24hr data.</span>
            </div>
          </div>
        )}

        {/* 4. UPDATE HISTORY TAB (Matching Reference Panel 9) */}
        {activeNav === "history" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Update History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit history of resource and blood stock modifications.
              </p>
            </div>

            {/* Filter Controls Row matching Reference 9 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Date Range</label>
                <select className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200">
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>Today</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Resource</label>
                <select
                  value={historyResourceFilter}
                  onChange={(e) => setHistoryResourceFilter(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
                >
                  <option value="ALL">All Resources</option>
                  <option value="Ventilator">Ventilator</option>
                  <option value="ICU Bed">ICU Bed</option>
                  <option value="X-Ray Machine">X-Ray Machine</option>
                  <option value="Blood Bank">Blood Bank</option>
                  <option value="ECG Machine">ECG Machine</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Status</label>
                <select className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200">
                  <option>All Statuses</option>
                  <option>Available</option>
                  <option>Limited</option>
                  <option>Unavailable</option>
                </select>
              </div>
            </div>

            {/* Search Input matching Reference 9 */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            {/* Full Audit Table matching Reference 9 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                    <th className="pb-3 font-semibold">Resource</th>
                    <th className="pb-3 font-semibold">Previous → New Status</th>
                    <th className="pb-3 font-semibold">Updated By</th>
                    <th className="pb-3 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">Ventilator</td>
                    <td className="py-3 font-mono">
                      <span className="text-amber-600 font-bold">Limited</span> →{" "}
                      <span className="text-emerald-600 font-bold">Available</span>
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-200 font-medium">Dr. Priya Sharma</td>
                    <td className="py-3 font-mono text-slate-400">Apr 28, 10:30 AM</td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">ICU Bed</td>
                    <td className="py-3 font-mono">
                      <span className="text-emerald-600 font-bold">Available</span> →{" "}
                      <span className="text-amber-600 font-bold">Limited</span>
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-200 font-medium">Dr. Amit Verma</td>
                    <td className="py-3 font-mono text-slate-400">Apr 28, 09:45 AM</td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">X-Ray Machine</td>
                    <td className="py-3 font-mono">
                      <span className="text-rose-600 font-bold">Unavailable</span> →{" "}
                      <span className="text-emerald-600 font-bold">Available</span>
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-200 font-medium">Dr. Rohan Singh</td>
                    <td className="py-3 font-mono text-slate-400">Apr 28, 08:20 AM</td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">Blood Bank (O-)</td>
                    <td className="py-3 font-mono">
                      <span className="text-slate-600">12 → 8 units</span>
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-200 font-medium">Priya Sharma</td>
                    <td className="py-3 font-mono text-slate-400">Apr 28, 07:15 AM</td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">ECG Machine</td>
                    <td className="py-3 font-mono">
                      <span className="text-emerald-600 font-bold">Available</span> →{" "}
                      <span className="text-emerald-600 font-bold">Available</span>
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-200 font-medium">Dr. Priya Sharma</td>
                    <td className="py-3 font-mono text-slate-400">Apr 27, 08:50 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination matching Reference 9 */}
            <div className="flex items-center justify-center gap-1.5 pt-4">
              <button className="w-8 h-8 rounded-lg text-xs font-bold bg-[#0284C7] text-white">1</button>
              <button className="w-8 h-8 rounded-lg text-xs text-slate-600 dark:text-slate-300">2</button>
              <button className="w-8 h-8 rounded-lg text-xs text-slate-600 dark:text-slate-300">3</button>
            </div>
          </div>
        )}

        {/* 5. BLOOD INVENTORY TAB */}
        {activeNav === "blood" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Blood Bank Inventory Stock
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {bloodBanks[0]?.inventory.map((inv) => (
                <div key={inv.bloodGroup} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white block">{inv.bloodGroup}</span>
                  <span className="font-mono font-extrabold text-lg text-rose-600 block">{inv.unitsAvailable ?? 0} units</span>
                  <StatusBadge status={inv.status} showIcon={false} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 6. MODAL: UPDATE RESOURCE (Strictly Matching Panel 8 of Reference) */}
      {editingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveResourceUpdate}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-float space-y-4 animate-fadeIn"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#0284C7]" />
                Update Resource
              </h3>
              <button
                type="button"
                onClick={() => setEditingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Field 1: Resource / Equipment */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Resource / Equipment
                </label>
                <select
                  value={selectedResourceType}
                  onChange={(e) => setSelectedResourceType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-hidden"
                >
                  <option value="Ventilator">Ventilator</option>
                  <option value="ICU Bed">ICU Bed</option>
                  <option value="X-Ray">X-Ray Machine</option>
                  <option value="ECG">ECG Station</option>
                  <option value="Oxygen Beds">Oxygen Beds</option>
                </select>
              </div>

              {/* Field 2: Availability Status Radio Pills matching Reference 8 */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Availability Status
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus("AVAILABLE")}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      editStatus === "AVAILABLE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-400 dark:bg-emerald-950/60"
                        : "border-slate-200 dark:border-slate-700 text-slate-600"
                    }`}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus("LIMITED")}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      editStatus === "LIMITED"
                        ? "bg-amber-50 text-amber-700 border-amber-400 dark:bg-amber-950/60"
                        : "border-slate-200 dark:border-slate-700 text-slate-600"
                    }`}
                  >
                    Limited
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus("UNAVAILABLE")}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      editStatus === "UNAVAILABLE"
                        ? "bg-rose-50 text-rose-700 border-rose-400 dark:bg-rose-950/60"
                        : "border-slate-200 dark:border-slate-700 text-slate-600"
                    }`}
                  >
                    Unavailable
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus("UNKNOWN")}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      editStatus === "UNKNOWN"
                        ? "bg-slate-100 text-slate-800 border-slate-400"
                        : "border-slate-200 dark:border-slate-700 text-slate-600"
                    }`}
                  >
                    Unknown
                  </button>
                </div>
              </div>

              {/* Field 3: Quantity */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Quantity (if applicable)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Field 4: Facility Select */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Facility
                </label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="fac_apollo_lko">City Care Hospital</option>
                  <option value="fac_kgmu_lko">Sunrise Multispeciality Hospital</option>
                  <option value="fac_max_del">LifeCare Hospital</option>
                </select>
              </div>

              {/* Field 5: Verification / Source Notes */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Verification / Source Notes
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Field 6: Updated By and Timestamp Readonly */}
              <div className="grid grid-cols-2 gap-3 text-slate-500 pt-1">
                <div>
                  <span className="block text-[10px] font-bold">Updated By</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">
                    Dr. Priya Sharma (Staff)
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold">Update Timestamp</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono">
                    Apr 28, 2025, 10:30 AM
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions matching Reference 8 */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-xs transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function StaffDashboardPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading Staff Console...</div>}>
      <StaffDashboardContent />
    </Suspense>
  );
}
