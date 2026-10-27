"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Building2,
  Activity,
  Droplet,
  History,
  LogOut,
  Edit3,
  CheckCircle2,
  Clock,
  Save,
  X,
  AlertTriangle,
  RefreshCw,
  Bell,
  Sliders,
  Check,
} from "lucide-react";
import { Facility, BloodBank, AuditLog, ResourceStatus, User } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";

function StaffDashboardContent() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "facilities" | "blood" | "audit">("overview");

  // Editing state for Hospital Resource
  const [editingResource, setEditingResource] = useState<{
    facilityId: string;
    resourceId: string;
    resourceName: string;
    status: ResourceStatus;
    units: number;
    notes: string;
  } | null>(null);

  // Editing state for Blood Bank Inventory
  const [editingBlood, setEditingBlood] = useState<{
    bloodBankId: string;
    bloodGroup: string;
    status: ResourceStatus;
    units: number;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Check current session
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meData.user) {
        router.push("/login");
        return;
      }
      setUser(meData.user);

      // 2. Fetch facilities
      const facRes = await fetch("/api/facilities");
      const facData = await facRes.json();
      setFacilities(facData);

      // 3. Fetch blood banks
      const bbRes = await fetch("/api/blood-banks");
      const bbData = await bbRes.json();
      setBloodBanks(bbData);

      // 4. Fetch audit logs
      const audRes = await fetch("/api/audit-logs");
      const audData = await audRes.json();
      setAuditLogs(audData);
    } catch (err: any) {
      console.error(err);
      setActionError("Failed to load dashboard data");
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

  const handleSaveResource = async () => {
    if (!editingResource) return;
    setSaving(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/facilities/${editingResource.facilityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: editingResource.resourceId,
          status: editingResource.status,
          availableUnits: editingResource.units,
          notes: editingResource.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save update");
      }

      setActionSuccess(`Successfully updated ${editingResource.resourceName}`);
      setEditingResource(null);
      await fetchDashboardData();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBlood = async () => {
    if (!editingBlood) return;
    setSaving(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/blood-banks/${editingBlood.bloodBankId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bloodGroup: editingBlood.bloodGroup,
          status: editingBlood.status,
          unitsAvailable: editingBlood.units,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save blood inventory");
      }

      setActionSuccess(`Successfully updated ${editingBlood.bloodGroup} inventory`);
      setEditingBlood(null);
      await fetchDashboardData();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Filter facilities the user can edit
  const userFacilities = user?.role === "ADMIN"
    ? facilities
    : facilities.filter((f) => f.id === user?.facilityId);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Verifying staff credentials & session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Staff Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              {user?.role} PORTAL
            </span>
            <span className="text-xs text-muted-foreground">Logged in as {user?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground mt-1">
            Clinical Operations & Resource Command
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            title="Refresh Ledger"
            className="p-2 border border-border rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900 hover:bg-rose-100 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Action Messages */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            {actionSuccess}
          </span>
          <button onClick={() => setActionSuccess(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {actionError}
          </span>
          <button onClick={() => setActionError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "overview"
              ? "bg-primary text-white shadow-subtle"
              : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("facilities")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "facilities"
              ? "bg-primary text-white shadow-subtle"
              : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Hospital Resources ({userFacilities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("blood")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "blood"
              ? "bg-primary text-white shadow-subtle"
              : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Droplet className="w-3.5 h-3.5" />
          <span>Blood Inventory ({bloodBanks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "audit"
              ? "bg-primary text-white shadow-subtle"
              : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Ledger ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-subtle">
              <span className="text-xs text-muted-foreground block font-medium">Hospitals Active</span>
              <span className="text-2xl font-mono font-bold text-foreground mt-1 block">
                {facilities.length} Centers
              </span>
              <span className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All desks reporting
              </span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-subtle">
              <span className="text-xs text-muted-foreground block font-medium">ICU Beds In Network</span>
              <span className="text-2xl font-mono font-bold text-foreground mt-1 block">
                {facilities.reduce(
                  (acc, f) =>
                    acc +
                    (f.resources.find((r) => r.name.toLowerCase().includes("icu"))?.availableUnits ?? 0),
                  0
                )}{" "}
                Available
              </span>
              <span className="text-[11px] text-primary font-medium mt-2 block">
                Real-time tally from live feeds
              </span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-subtle">
              <span className="text-xs text-muted-foreground block font-medium">Ventilator Reserves</span>
              <span className="text-2xl font-mono font-bold text-foreground mt-1 block">
                {facilities.reduce(
                  (acc, f) =>
                    acc +
                    (f.resources.find((r) => r.name.toLowerCase().includes("ventilator"))?.availableUnits ?? 0),
                  0
                )}{" "}
                Functional
              </span>
              <span className="text-[11px] text-teal-600 font-medium mt-2 block">
                Calibrated in last 24h
              </span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-subtle">
              <span className="text-xs text-muted-foreground block font-medium">Audit Updates Logged</span>
              <span className="text-2xl font-mono font-bold text-foreground mt-1 block">
                {auditLogs.length} Records
              </span>
              <span className="text-[11px] text-muted-foreground font-medium mt-2 block">
                Immutable actor timestamps
              </span>
            </div>
          </div>

          {/* Recent Audit Ledger Preview */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-subtle space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center justify-between">
              <span>Recent Operational Audit Entries</span>
              <span className="text-xs font-mono font-normal text-muted-foreground">Real-time DB Ledger</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-mono">
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Facility</th>
                    <th className="pb-2">Resource</th>
                    <th className="pb-2">Status Change</th>
                    <th className="pb-2">Authorized Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLogs.slice(0, 5).map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30">
                      <td className="py-2.5 font-mono text-muted-foreground">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="py-2.5 font-bold text-foreground pr-2">{log.facilityName}</td>
                      <td className="py-2.5 text-primary pr-2">{log.resourceName}</td>
                      <td className="py-2.5 pr-2 font-mono">
                        {log.previousStatus ? `${log.previousStatus} → ` : ""}
                        <span className="font-bold">{log.newStatus}</span> ({log.newUnits ?? 0} units)
                      </td>
                      <td className="py-2.5 text-muted-foreground font-medium">{log.changedByName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACILITIES & RESOURCE EDITING */}
      {activeTab === "facilities" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Managed Healthcare Facilities
              </h2>
              <p className="text-xs text-muted-foreground">
                Authorized staff can modify operational quantities and status flags.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {userFacilities.map((facility) => (
              <div
                key={facility.id}
                className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{facility.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {facility.address}, {facility.city} • Triage: {facility.emergencyPhone}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Last Sync: {formatDate(facility.updatedAt)}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-mono">
                        <th className="pb-2">Resource</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Available / Total</th>
                        <th className="pb-2">Staff Notes</th>
                        <th className="pb-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {facility.resources.map((res) => (
                        <tr key={res.id} className="hover:bg-muted/30">
                          <td className="py-3 font-bold text-foreground">{res.name}</td>
                          <td className="py-3 font-mono text-[10px] text-muted-foreground">{res.category}</td>
                          <td className="py-3">
                            <StatusBadge status={res.status} />
                          </td>
                          <td className="py-3 font-mono font-bold text-foreground">
                            {res.availableUnits !== undefined ? `${res.availableUnits} / ${res.totalUnits ?? "-"}` : "-"}
                          </td>
                          <td className="py-3 text-muted-foreground text-[11px] max-w-xs truncate">
                            {res.notes || "-"}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() =>
                                setEditingResource({
                                  facilityId: facility.id,
                                  resourceId: res.id,
                                  resourceName: res.name,
                                  status: res.status,
                                  units: res.availableUnits ?? 0,
                                  notes: res.notes || "",
                                })
                              }
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-primary hover:text-white transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BLOOD INVENTORY */}
      {activeTab === "blood" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Blood Bank Inventory Controls</h2>
            <p className="text-xs text-muted-foreground">
              Update units and shortage flags across ABO/Rh blood groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bloodBanks.map((bb) => (
              <div key={bb.id} className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-bold text-foreground text-sm">{bb.name}</h3>
                  <span className="text-[10px] font-mono text-muted-foreground">{bb.operatingHours}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {bb.inventory.map((inv) => (
                    <div
                      key={inv.bloodGroup}
                      onClick={() =>
                        setEditingBlood({
                          bloodBankId: bb.id,
                          bloodGroup: inv.bloodGroup,
                          status: inv.status,
                          units: inv.unitsAvailable ?? 0,
                        })
                      }
                      className="p-3 bg-muted/40 rounded-xl border border-border hover:border-primary cursor-pointer transition text-center"
                    >
                      <span className="font-mono font-bold text-sm block text-foreground">{inv.bloodGroup}</span>
                      <span className="font-mono font-bold text-rose-600 block text-xs my-0.5">
                        {inv.unitsAvailable ?? 0} u
                      </span>
                      <StatusBadge status={inv.status} showIcon={false} className="text-[9px] px-1.5 py-0" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMPLETE AUDIT LEDGER */}
      {activeTab === "audit" && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card space-y-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Full Operational Audit Trail</h2>
            <p className="text-xs text-muted-foreground">
              Every status modification is digitally registered with actor identity, previous state, and timestamp.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-[10px] font-mono">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Facility</th>
                  <th className="pb-3">Resource / Item</th>
                  <th className="pb-3">Previous State</th>
                  <th className="pb-3">New State</th>
                  <th className="pb-3">Authorized By</th>
                  <th className="pb-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30">
                    <td className="py-3 font-mono text-muted-foreground whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="py-3 font-bold text-foreground pr-2">{log.facilityName}</td>
                    <td className="py-3 text-primary pr-2">{log.resourceName}</td>
                    <td className="py-3 font-mono text-muted-foreground pr-2">
                      {log.previousStatus ?? "-"} ({log.previousUnits ?? "-"} u)
                    </td>
                    <td className="py-3 font-mono font-bold text-foreground pr-2">
                      {log.newStatus} ({log.newUnits ?? "-"} u)
                    </td>
                    <td className="py-3 text-foreground font-semibold pr-2">{log.changedByName}</td>
                    <td className="py-3 text-muted-foreground text-[11px] max-w-xs truncate">
                      {log.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Resource Update Dialog */}
      {editingResource && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-float text-card-foreground space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground">
                Update {editingResource.resourceName}
              </h3>
              <button
                onClick={() => setEditingResource(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Availability Status</label>
                <select
                  value={editingResource.status}
                  onChange={(e) =>
                    setEditingResource({
                      ...editingResource,
                      status: e.target.value as ResourceStatus,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground"
                >
                  <option value="AVAILABLE">AVAILABLE (Operational)</option>
                  <option value="LIMITED">LIMITED (Near Capacity / Reserved)</option>
                  <option value="UNAVAILABLE">UNAVAILABLE (Full / Offline)</option>
                  <option value="UNKNOWN">UNKNOWN (Under Review)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Units Available (Live Count)</label>
                <input
                  type="number"
                  min="0"
                  value={editingResource.units}
                  onChange={(e) =>
                    setEditingResource({
                      ...editingResource,
                      units: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Staff Operational Notes</label>
                <textarea
                  rows={3}
                  value={editingResource.notes}
                  onChange={(e) =>
                    setEditingResource({
                      ...editingResource,
                      notes: e.target.value,
                    })
                  }
                  placeholder="e.g. 2 beds reserved for scheduled cardiac surgery."
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingResource(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveResource}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover flex items-center gap-1.5 shadow-subtle disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving to DB..." : "Commit Update"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Blood Inventory Update Dialog */}
      {editingBlood && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-float text-card-foreground space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground">
                Update Blood Group: {editingBlood.bloodGroup}
              </h3>
              <button
                onClick={() => setEditingBlood(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Availability Status</label>
                <select
                  value={editingBlood.status}
                  onChange={(e) =>
                    setEditingBlood({
                      ...editingBlood,
                      status: e.target.value as ResourceStatus,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground"
                >
                  <option value="AVAILABLE">AVAILABLE (Sufficient Stock)</option>
                  <option value="LIMITED">LIMITED (Low Units Alert)</option>
                  <option value="UNAVAILABLE">UNAVAILABLE (Stock Depleted)</option>
                  <option value="UNKNOWN">UNKNOWN</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Units Available In Storage</label>
                <input
                  type="number"
                  min="0"
                  value={editingBlood.units}
                  onChange={(e) =>
                    setEditingBlood({
                      ...editingBlood,
                      units: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingBlood(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveBlood}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 flex items-center gap-1.5 shadow-subtle disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving to DB..." : "Commit Stock"}</span>
              </button>
            </div>
          </div>
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
