"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  BedDouble,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Droplet,
  Edit3,
  HeartPulse,
  History,
  LayoutDashboard,
  LogOut,
  MapPin,
  PackageCheck,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AuditLog, BloodBank, Facility, ResourceStatus, User } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

type DashboardTab =
  | "overview"
  | "facilities"
  | "equipment"
  | "blood"
  | "history"
  | "notifications"
  | "settings";

const STATUS_COLORS: Record<ResourceStatus, string> = {
  AVAILABLE: "#10b981",
  LIMITED: "#f59e0b",
  UNAVAILABLE: "#ef4444",
  UNKNOWN: "#94a3b8",
};

const STATUS_LABELS: Record<ResourceStatus, string> = {
  AVAILABLE: "Available",
  LIMITED: "Limited",
  UNAVAILABLE: "Unavailable",
  UNKNOWN: "Unknown",
};

const NAV_ITEMS: { id: DashboardTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "facilities", label: "Facilities", icon: Building2 },
  { id: "equipment", label: "Equipment & beds", icon: BedDouble },
  { id: "blood", label: "Blood inventory", icon: Droplet },
  { id: "history", label: "Update history", icon: History },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

function StaffDashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState<DashboardTab>("overview");
  const [historySearch, setHistorySearch] = useState("");
  const [historyResourceFilter, setHistoryResourceFilter] = useState("ALL");
  const [editingModalOpen, setEditingModalOpen] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState("fac_apollo_lko");
  const [selectedResourceType, setSelectedResourceType] = useState("Ventilator");
  const [editStatus, setEditStatus] = useState<ResourceStatus>("AVAILABLE");
  const [editQuantity, setEditQuantity] = useState(8);
  const [editNotes, setEditNotes] = useState("Checked with hospital staff");
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activityRange, setActivityRange] = useState<"weekly" | "daily">("weekly");

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

      const [facilityResponse, bloodResponse, auditResponse] = await Promise.all([
        fetch("/api/facilities"),
        fetch("/api/blood-banks"),
        fetch("/api/audit-logs"),
      ]);
      const [facilityData, bloodData, auditData] = await Promise.all([
        facilityResponse.json(),
        bloodResponse.json(),
        auditResponse.json(),
      ]);
      setFacilities(facilityData);
      setBloodBanks(bloodData);
      setAuditLogs(auditData);
      setSelectedFacilityId((current) =>
        facilityData.some((facility: Facility) => facility.id === current)
          ? current
          : facilityData[0]?.id || "",
      );
    } catch (error) {
      console.error("Unable to load staff dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const resources = useMemo(
    () =>
      facilities.flatMap((facility) =>
        facility.resources.map((resource) => ({ ...resource, facilityName: facility.name })),
      ),
    [facilities],
  );
  const bedResources = resources.filter((resource) => resource.category === "BEDS");
  const equipmentResources = resources.filter((resource) => resource.category !== "BEDS");
  const totalBeds = bedResources.reduce(
    (total, resource) => total + (resource.totalUnits ?? resource.availableUnits ?? 0),
    0,
  );
  const icuBedResources = bedResources.filter((resource) => /icu/i.test(resource.name));
  const totalIcuBeds = icuBedResources.reduce(
    (total, resource) => total + (resource.totalUnits ?? resource.availableUnits ?? 0),
    0,
  );
  const availableIcuBeds = icuBedResources.reduce(
    (total, resource) => total + (resource.availableUnits ?? 0),
    0,
  );
  const availableBeds = bedResources.reduce(
    (total, resource) => total + (resource.availableUnits ?? 0),
    0,
  );
  const bedsNotAvailable = Math.max(totalBeds - availableBeds, 0);
  const bedAvailabilityPercent = totalBeds ? Math.round((availableBeds / totalBeds) * 100) : 0;
  const availableCount = resources.filter((resource) => resource.status === "AVAILABLE").length;
  const attentionCount = resources.filter(
    (resource) => resource.status === "LIMITED" || resource.status === "UNAVAILABLE",
  ).length;
  const bloodUnits = bloodBanks
    .flatMap((bank) => bank.inventory)
    .reduce((total, item) => total + (item.unitsAvailable ?? 0), 0);
  const bloodInventory = bloodBanks.flatMap((bank) =>
    bank.inventory.map((item) => ({ ...item, bankName: bank.name })),
  );
  const resourceOptions = Array.from(new Set(resources.map((resource) => resource.name)));

  const categoryData = [
    { key: "BEDS", name: "Beds" },
    { key: "EQUIPMENT", name: "Equipment" },
    { key: "DIAGNOSTICS", name: "Diagnostics" },
    { key: "SPECIALTY", name: "Specialty" },
  ].map(({ key, name }) => ({
    key,
    name,
    available: resources.filter(
      (resource) => resource.category === key && resource.status === "AVAILABLE",
    ).length,
    limited: resources.filter(
      (resource) => resource.category === key && resource.status === "LIMITED",
    ).length,
    unavailable: resources.filter(
      (resource) => resource.category === key && resource.status === "UNAVAILABLE",
    ).length,
  }));
  const bedStatusData = [
    { name: "Available", value: availableBeds, color: STATUS_COLORS.AVAILABLE },
    { name: "Not available", value: bedsNotAvailable, color: "#fbd38d" },
  ].filter((item) => item.value > 0);
  const activityData =
    activityRange === "weekly"
      ? Array.from({ length: 7 }, (_, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - index));
          const updates = auditLogs.filter((log) => {
            const timestamp = new Date(log.timestamp);
            return (
              timestamp.getFullYear() === date.getFullYear() &&
              timestamp.getMonth() === date.getMonth() &&
              timestamp.getDate() === date.getDate()
            );
          }).length;
          return {
            period: date.toLocaleDateString("en-US", { weekday: "short" }),
            updates,
          };
        })
      : Array.from({ length: 8 }, (_, index) => {
          const date = new Date();
          date.setHours(date.getHours() - (7 - index), 0, 0, 0);
          const updates = auditLogs.filter((log) => {
            const timestamp = new Date(log.timestamp);
            return (
              timestamp.getFullYear() === date.getFullYear() &&
              timestamp.getMonth() === date.getMonth() &&
              timestamp.getDate() === date.getDate() &&
              timestamp.getHours() === date.getHours()
            );
          }).length;
          return {
            period: date.toLocaleTimeString("en-US", { hour: "numeric" }),
            updates,
          };
        });
  const resourceAvailabilityData = categoryData.map((category) => {
    const categoryResources = resources.filter((resource) => resource.category === category.key);
    return {
      name: category.name,
      available: category.available,
      total: categoryResources.length,
      percentage: categoryResources.length
        ? Math.round((category.available / categoryResources.length) * 100)
        : 0,
    };
  });
  const recentResources = [...equipmentResources]
    .sort((a, b) => {
      const priority: Record<ResourceStatus, number> = {
        UNAVAILABLE: 0,
        LIMITED: 1,
        UNKNOWN: 2,
        AVAILABLE: 3,
      };
      return priority[a.status] - priority[b.status];
    })
    .slice(0, 5);
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesResource =
      historyResourceFilter === "ALL" ||
      log.resourceName.toLowerCase().includes(historyResourceFilter.toLowerCase());
    const matchesSearch =
      !historySearch ||
      `${log.resourceName} ${log.facilityName} ${log.changedByName}`
        .toLowerCase()
        .includes(historySearch.toLowerCase());
    return matchesResource && matchesSearch;
  });

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const handleSaveResourceUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const facility =
        facilities.find((item) => item.id === selectedFacilityId) || facilities[0];
      const resource =
        facility?.resources.find((item) =>
          item.name.toLowerCase().includes(selectedResourceType.toLowerCase()),
        ) || facility?.resources[0];

      if (!facility || !resource) {
        throw new Error("Choose a facility and resource before saving.");
      }

      const response = await fetch(`/api/facilities/${facility.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resource.id,
          status: editStatus,
          availableUnits: editQuantity,
          notes: editNotes,
        }),
      });
      if (!response.ok) throw new Error("Failed to save resource change");

      setToastMessage(`Updated ${resource.name} to ${STATUS_LABELS[editStatus]}`);
      setTimeout(() => setToastMessage(null), 4000);
      setEditingModalOpen(false);
      await fetchDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffbf4]">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
          <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-[3px] border-[#E88A05] border-t-transparent" />
          <p className="text-sm font-semibold text-slate-700">Loading your clinical dashboard</p>
          <p className="mt-1 text-xs text-slate-400">Connecting to facility data…</p>
        </div>
      </div>
    );
  }

  const activeFacility = facilities.find((facility) => facility.id === user?.facilityId) || facilities[0];
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "MC";

  return (
    <div className="min-h-screen bg-[#fffbf4] text-slate-900 lg:flex">
      <aside className="z-20 flex shrink-0 flex-col border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[250px] lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:px-6 lg:py-6">
          <a href="/staff/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff4e5] text-[#eea31b]">
              <HeartPulse className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-[18px] font-extrabold tracking-tight text-slate-900">
              Medi<span className="text-[#E88A05]">Connect</span>
            </span>
          </a>
          <button
            type="button"
            aria-label="Collapse navigation"
            className="hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 lg:flex"
          >
            <ChevronDown className="h-4 w-4 -rotate-90" />
          </button>
        </div>

        <div className="mx-4 mb-5 hidden items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 lg:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <span className="flex-1 text-xs text-slate-400">Search</span>
          <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
            Ctrl K
          </kbd>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:flex-1 lg:space-y-1 lg:overflow-visible lg:px-3">
          <p className="hidden px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 lg:block">
            Main menu
          </p>
          {NAV_ITEMS.map(({ id, label, icon: Icon }, index) => (
            <React.Fragment key={id}>
              {index === 5 && (
                <p className="hidden px-3 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 lg:block">
                  Workspace
                </p>
              )}
              <button
                type="button"
                onClick={() => setActiveNav(id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition lg:w-full ${
                  activeNav === id
                    ? "bg-[#fff5e8] text-[#b66b00] shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{label}</span>
                {id === "notifications" && attentionCount > 0 && (
                  <span className="ml-auto hidden h-5 min-w-5 items-center justify-center rounded-full bg-rose-100 px-1.5 text-[10px] font-bold text-rose-600 lg:flex">
                    {attentionCount}
                  </span>
                )}
              </button>
            </React.Fragment>
          ))}
        </nav>

        <div className="hidden border-t border-slate-100 p-4 lg:block">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">{user?.name}</p>
              <p className="truncate text-[10px] text-slate-400">Hospital staff</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 sm:py-7 lg:px-9">
        <div className="mx-auto max-w-[1500px] space-y-6">
          <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                <span>Workspace</span>
                <ChevronRight className="h-3 w-3" />
                <span className="font-medium text-slate-600">
                  {NAV_ITEMS.find((item) => item.id === activeNav)?.label}
                </span>
              </div>
              <h1 className="font-display text-[25px] font-bold tracking-tight text-slate-900">
                {activeNav === "overview" ? "Dashboard" : NAV_ITEMS.find((item) => item.id === activeNav)?.label}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                {activeFacility?.name || "Your healthcare network"}
                <span className="mx-1 text-slate-300">•</span>
                Live facility overview
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveNav("notifications")}
                aria-label="View notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <Bell className="h-4 w-4" />
                {attentionCount > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
                )}
              </button>
              <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-3 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-700">
                  {initials}
                </div>
                <div>
                  <p className="max-w-36 truncate text-xs font-bold text-slate-800">{user?.name}</p>
                  <p className="text-[10px] text-slate-400">Staff account</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => setEditingModalOpen(true)}
                className="flex h-10 items-center gap-2 rounded-xl bg-[#E88A05] px-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#C45F08] sm:px-4"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Update resource</span>
                <span className="sm:hidden">Update</span>
              </button>
            </div>
          </header>

          {toastMessage && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                {toastMessage}
              </span>
              <button type="button" onClick={() => setToastMessage(null)} aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {(activeNav === "overview" || activeNav === "facilities" || activeNav === "equipment") && (
            <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              <MetricCard
                label="Total beds"
                value={totalBeds.toLocaleString()}
                detail={`${availableBeds.toLocaleString()} available now`}
                icon={BedDouble}
                tone="amber"
                progress={totalBeds ? (availableBeds / totalBeds) * 100 : 0}
              />
              <MetricCard
                label="ICU beds available"
                value={availableIcuBeds.toLocaleString()}
                detail={
                  totalIcuBeds
                    ? `of ${totalIcuBeds.toLocaleString()} reported ICU beds`
                    : "No ICU bed capacity reported"
                }
                icon={HeartPulse}
                tone="amber"
                progress={totalIcuBeds ? (availableIcuBeds / totalIcuBeds) * 100 : 0}
              />
              <MetricCard
                label="Available"
                value={availableCount.toLocaleString()}
                detail={resources.length ? `${Math.round((availableCount / resources.length) * 100)}% of resources` : "No resources reported"}
                icon={CheckCircle2}
                tone="green"
                progress={resources.length ? (availableCount / resources.length) * 100 : 0}
              />
              <MetricCard
                label="Needs attention"
                value={attentionCount.toLocaleString()}
                detail={`${bloodUnits.toLocaleString()} blood units in stock`}
                icon={AlertTriangle}
                tone={attentionCount ? "rose" : "green"}
              />
            </section>
          )}

          {activeNav === "overview" && (
            <>
              <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Bed status</h2>
                      <p className="mt-1 text-xs text-slate-400">Capacity across your connected facilities</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNav("equipment")}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      View details <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="grid items-center gap-4 md:grid-cols-[minmax(170px,0.8fr)_minmax(0,1.2fr)]">
                    <div className="relative mx-auto h-[190px] w-full max-w-[220px]">
                      {totalBeds > 0 ? (
                        <>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={bedStatusData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={66}
                                outerRadius={86}
                                startAngle={90}
                                endAngle={-270}
                                paddingAngle={totalBeds > 1 ? 3 : 0}
                                stroke="none"
                              >
                                {bedStatusData.map((item) => (
                                  <Cell key={item.name} fill={item.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold tracking-tight text-slate-900">{bedAvailabilityPercent}%</span>
                            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">available</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full items-center justify-center rounded-full bg-slate-50 text-xs text-slate-400">
                          No bed capacity reported
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          <span className="text-xs text-slate-600">Available beds</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{availableBeds.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-200" />
                          <span className="text-xs text-slate-600">Not available</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{bedsNotAvailable.toLocaleString()}</span>
                      </div>
                      <div className="rounded-xl bg-amber-50 px-3.5 py-3">
                        <div className="flex items-center gap-2 text-amber-700">
                          <Activity className="h-4 w-4" />
                          <span className="text-xs font-bold">Capacity summary</span>
                        </div>
                        <p className="mt-1.5 text-[11px] leading-5 text-amber-800/80">
                          {availableBeds.toLocaleString()} of {totalBeds.toLocaleString()} reported beds are currently available.
                        </p>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Equipment & needs</h2>
                      <p className="mt-1 text-xs text-slate-400">Resources that may need attention</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNav("equipment")}
                      aria-label="View all equipment"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  {recentResources.length ? (
                    <div className="space-y-1">
                      {recentResources.map((resource) => (
                        <button
                          key={resource.id}
                          type="button"
                          onClick={() => {
                            setSelectedFacilityId(resource.facilityId);
                            setSelectedResourceType(resource.name);
                            setEditingModalOpen(true);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-50"
                        >
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                            style={{
                              backgroundColor: `${STATUS_COLORS[resource.status]}14`,
                              color: STATUS_COLORS[resource.status],
                            }}
                          >
                            <Stethoscope className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold text-slate-800">{resource.name}</span>
                            <span className="block truncate text-[10px] text-slate-400">{resource.facilityName}</span>
                          </span>
                          <span className="text-right">
                            <span className="block text-xs font-bold text-slate-800">
                              {resource.availableUnits ?? 0}
                              {resource.totalUnits ? `/${resource.totalUnits}` : ""}
                            </span>
                            <span className="block text-[10px]" style={{ color: STATUS_COLORS[resource.status] }}>
                              {STATUS_LABELS[resource.status]}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={PackageCheck} message="No equipment resources have been reported yet." />
                  )}
                  <button
                    type="button"
                    onClick={() => setEditingModalOpen(true)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-500 transition hover:border-[#E88A05] hover:bg-amber-50 hover:text-[#E88A05]"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Update a resource
                  </button>
                </article>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Resource status</h2>
                      <p className="mt-1 text-xs text-slate-400">Availability by service category</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(["AVAILABLE", "LIMITED", "UNAVAILABLE"] as ResourceStatus[]).map((status) => (
                        <span key={status} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] }} />
                          {STATUS_LABELS[status]}
                        </span>
                      ))}
                    </div>
                  </div>
                  {resources.length ? (
                    <div className="h-[235px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }} barCategoryGap="28%">
                          <CartesianGrid vertical={false} stroke="#eef1f5" strokeDasharray="3 3" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                          <Tooltip cursor={{ fill: "#f8fafc" }} />
                          <Bar dataKey="available" name="Available" stackId="resources" fill={STATUS_COLORS.AVAILABLE} radius={[0, 0, 0, 0]} />
                          <Bar dataKey="limited" name="Limited" stackId="resources" fill={STATUS_COLORS.LIMITED} />
                          <Bar dataKey="unavailable" name="Unavailable" stackId="resources" fill={STATUS_COLORS.UNAVAILABLE} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <EmptyState icon={Activity} message="Resource status will appear here when facilities report data." />
                  )}
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Blood inventory</h2>
                      <p className="mt-1 text-xs text-slate-400">{bloodUnits.toLocaleString()} units across blood banks</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNav("blood")}
                      className="text-[11px] font-bold text-[#E88A05] hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  {bloodInventory.length ? (
                    <div className="space-y-3">
                      {bloodInventory.slice(0, 5).map((item) => (
                        <div key={`${item.bankName}-${item.bloodGroup}`} className="flex items-center gap-3">
                          <span className="flex h-9 w-10 items-center justify-center rounded-lg bg-rose-50 text-xs font-bold text-rose-600">
                            {item.bloodGroup}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-semibold text-slate-800">{item.unitsAvailable ?? 0} units</span>
                            <span className="block truncate text-[10px] text-slate-400">{item.bankName}</span>
                          </span>
                          <StatusBadge status={item.status} showIcon={false} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={Droplet} message="No blood inventory has been reported yet." />
                  )}
                </article>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Resource activity</h2>
                      <p className="mt-1 text-xs text-slate-400">
                        {activityRange === "weekly"
                          ? "Facility updates by day over the last week"
                          : "Facility updates by hour over the last eight hours"}
                      </p>
                    </div>
                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                      {(["weekly", "daily"] as const).map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => setActivityRange(range)}
                          aria-pressed={activityRange === range}
                          className={`rounded-md px-2.5 py-1 text-[10px] font-semibold capitalize transition ${
                            activityRange === range
                              ? "bg-white text-slate-800 shadow-sm"
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[190px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                        <defs>
                          <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f4a62a" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#f4a62a" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#eef1f5" strokeDasharray="3 3" />
                        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="updates" name="Updates" stroke="#f4a62a" strokeWidth={2.5} fill="url(#activityFill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Resource availability</h2>
                      <p className="mt-1 text-xs text-slate-400">Available resources by category</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNav("equipment")}
                      className="text-[11px] font-bold text-[#E88A05] hover:underline"
                    >
                      Details
                    </button>
                  </div>
                  {resources.length ? (
                    <div className="space-y-4 pt-1">
                      {resourceAvailabilityData.map((category, index) => (
                        <div key={category.name}>
                          <div className="mb-1.5 flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-600">{category.name}</span>
                            <span className="text-[11px] font-semibold text-slate-700">
                              {category.available}/{category.total}
                            </span>
                          </div>
                          <div
                            className="h-2 overflow-hidden rounded-full bg-amber-100"
                            aria-label={`${category.name}: ${category.percentage}% available`}
                          >
                            <div
                              className={`h-full rounded-full ${index % 2 === 0 ? "bg-amber-400" : "bg-orange-500"}`}
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      <p className="border-t border-slate-100 pt-3 text-[10px] leading-4 text-slate-400">
                        Counts reflect reported resource records, not staffing levels.
                      </p>
                    </div>
                  ) : (
                    <EmptyState icon={PackageCheck} message="Resource availability will appear when facilities report data." />
                  )}
                </article>
              </section>
            </>
          )}

          {activeNav === "facilities" && (
            <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {facilities.length ? facilities.map((facility) => {
                const facilityResources = facility.resources || [];
                const facilityAvailable = facilityResources.filter((resource) => resource.status === "AVAILABLE").length;
                const facilityAttention = facilityResources.filter((resource) =>
                  resource.status === "LIMITED" || resource.status === "UNAVAILABLE",
                ).length;
                return (
                  <article key={facility.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                        <Building2 className="h-5 w-5" />
                      </span>
                      {facility.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                    <h2 className="mt-4 text-sm font-bold text-slate-900">{facility.name}</h2>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {[facility.area, facility.city].filter(Boolean).join(", ")}
                    </p>
                    <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                      <div><p className="text-lg font-bold text-slate-900">{facility.totalBeds}</p><p className="text-[10px] text-slate-400">Total beds</p></div>
                      <div><p className="text-lg font-bold text-emerald-600">{facilityAvailable}</p><p className="text-[10px] text-slate-400">Available</p></div>
                      <div><p className="text-lg font-bold text-amber-600">{facilityAttention}</p><p className="text-[10px] text-slate-400">Needs attention</p></div>
                    </div>
                  </article>
                );
              }) : <EmptyState icon={Building2} message="No facilities are connected to this account yet." />}
            </section>
          )}

          {activeNav === "equipment" && (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Beds, equipment & diagnostics</h2>
                  <p className="mt-1 text-xs text-slate-400">Live resource availability across facilities</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  {resources.length} resources
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Resource</th>
                      <th className="px-5 py-3 font-semibold">Facility</th>
                      <th className="px-5 py-3 font-semibold">Category</th>
                      <th className="px-5 py-3 font-semibold">Availability</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resources.map((resource) => (
                      <tr key={resource.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3.5 font-semibold text-slate-800">{resource.name}</td>
                        <td className="px-5 py-3.5 text-slate-500">{resource.facilityName}</td>
                        <td className="px-5 py-3.5 text-slate-500">{resource.category.toLowerCase()}</td>
                        <td className="px-5 py-3.5 font-medium text-slate-700">
                          {resource.availableUnits ?? 0}{resource.totalUnits ? ` / ${resource.totalUnits}` : ""}
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge status={resource.status} /></td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFacilityId(resource.facilityId);
                              setSelectedResourceType(resource.name);
                              setEditStatus(resource.status);
                              setEditQuantity(resource.availableUnits ?? 0);
                              setEditingModalOpen(true);
                            }}
                            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:border-amber-300 hover:text-amber-700"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!resources.length && (
                      <tr><td colSpan={6} className="px-5 py-10"><EmptyState icon={PackageCheck} message="No resources are available yet." /></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeNav === "blood" && (
            <section className="space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const).map((group) => {
                  const items = bloodInventory.filter((item) => item.bloodGroup === group);
                  const units = items.reduce((sum, item) => sum + (item.unitsAvailable ?? 0), 0);
                  const status = items.some((item) => item.status === "UNAVAILABLE")
                    ? "UNAVAILABLE"
                    : items.some((item) => item.status === "LIMITED")
                      ? "LIMITED"
                      : items.length
                        ? "AVAILABLE"
                        : "UNKNOWN";
                  return (
                    <article key={group} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex h-9 w-10 items-center justify-center rounded-xl bg-rose-50 text-sm font-bold text-rose-600">{group}</span>
                        <Droplet className="h-4 w-4 text-rose-300" />
                      </div>
                      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{units}</p>
                      <p className="text-[11px] text-slate-400">units available</p>
                      <div className="mt-3"><StatusBadge status={status} showIcon={false} /></div>
                    </article>
                  );
                })}
              </div>
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="text-sm font-bold text-slate-900">Blood banks</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {bloodBanks.map((bank) => (
                    <div key={bank.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{bank.name}</p>
                        <p className="mt-1 text-[10px] text-slate-400">{bank.address}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        {bank.inventory.reduce((sum, item) => sum + (item.unitsAvailable ?? 0), 0)} units
                      </span>
                    </div>
                  ))}
                  {!bloodBanks.length && <div className="px-5 py-8"><EmptyState icon={Droplet} message="No blood banks are connected yet." /></div>}
                </div>
              </section>
            </section>
          )}

          {(activeNav === "history" || activeNav === "notifications") && (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {activeNav === "history" ? "Resource update history" : "Resource alerts"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {activeNav === "history" ? "Audit trail of recent facility changes" : "Resources currently marked limited or unavailable"}
                  </p>
                </div>
                {activeNav === "history" && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        value={historySearch}
                        onChange={(event) => setHistorySearch(event.target.value)}
                        placeholder="Search updates"
                        className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none focus:border-amber-400 sm:w-48"
                      />
                    </div>
                    <select
                      value={historyResourceFilter}
                      onChange={(event) => setHistoryResourceFilter(event.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-amber-400"
                    >
                      <option value="ALL">All resources</option>
                      {resourceOptions.map((name) => <option key={name} value={name}>{name}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Resource</th>
                      <th className="px-5 py-3 font-semibold">Facility</th>
                      <th className="px-5 py-3 font-semibold">Change</th>
                      <th className="px-5 py-3 font-semibold">Updated by</th>
                      <th className="px-5 py-3 font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(activeNav === "history" ? filteredAuditLogs : auditLogs.filter((log) =>
                      resources.some((resource) =>
                        resource.facilityId === log.facilityId &&
                        resource.name === log.resourceName &&
                        (resource.status === "LIMITED" || resource.status === "UNAVAILABLE"),
                      ),
                    )).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3.5 font-semibold text-slate-800">{log.resourceName}</td>
                        <td className="px-5 py-3.5 text-slate-500">{log.facilityName}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-slate-400">{log.previousStatus || "—"}</span>
                          <ArrowUpRight className="mx-1 inline h-3 w-3 text-slate-300" />
                          <span className="font-semibold text-slate-700">{log.newStatus}</span>
                          {typeof log.newUnits === "number" && <span className="ml-1 text-slate-400">· {log.newUnits} units</span>}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">{log.changedByName}</td>
                        <td className="px-5 py-3.5 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                    {!(activeNav === "history" ? filteredAuditLogs : auditLogs.filter((log) =>
                      resources.some((resource) =>
                        resource.facilityId === log.facilityId &&
                        resource.name === log.resourceName &&
                        (resource.status === "LIMITED" || resource.status === "UNAVAILABLE"),
                      ),
                    )).length && (
                      <tr><td colSpan={5} className="px-5 py-10"><EmptyState icon={History} message={activeNav === "history" ? "No updates match your search." : "There are no active resource alerts."} /></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeNav === "settings" && (
            <section className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">{initials}</span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{user?.name}</h2>
                  <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <dl className="grid gap-4 pt-5 sm:grid-cols-2">
                <div><dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Role</dt><dd className="mt-1 text-xs font-semibold text-slate-700">Hospital staff</dd></div>
                <div><dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Facility</dt><dd className="mt-1 text-xs font-semibold text-slate-700">{activeFacility?.name || "Not assigned"}</dd></div>
              </dl>
              <button type="button" onClick={handleLogout} className="mt-6 flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50">
                <LogOut className="h-3.5 w-3.5" /> Log out
              </button>
            </section>
          )}

          <footer className="flex flex-wrap items-center justify-between gap-2 py-2 text-[10px] text-slate-400">
            <span>MediConnect facility operations</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Data synced from connected facilities</span>
          </footer>
        </div>
      </main>

      {editingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
          <form
            onSubmit={handleSaveResourceUpdate}
            className="max-h-[90vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Update resource</h2>
                <p className="mt-1 text-xs text-slate-400">Keep availability information up to date</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingModalOpen(false)}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700">
                Resource
                <select
                  value={selectedResourceType}
                  onChange={(event) => setSelectedResourceType(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-normal text-slate-700 outline-none focus:border-amber-400"
                >
                  {resourceOptions.length ? resourceOptions.map((name) => <option key={name} value={name}>{name}</option>) : <option value="Ventilator">Ventilator</option>}
                </select>
              </label>
              <label className="block text-xs font-semibold text-slate-700">
                Facility
                <select
                  value={selectedFacilityId}
                  onChange={(event) => setSelectedFacilityId(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-normal text-slate-700 outline-none focus:border-amber-400"
                >
                  {facilities.map((facility) => <option key={facility.id} value={facility.id}>{facility.name}</option>)}
                </select>
              </label>
              <fieldset>
                <legend className="mb-2 text-xs font-semibold text-slate-700">Availability status</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(["AVAILABLE", "LIMITED", "UNAVAILABLE", "UNKNOWN"] as ResourceStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setEditStatus(status)}
                      className={`rounded-lg border px-2 py-2 text-[10px] font-semibold transition ${
                        editStatus === status
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="block text-xs font-semibold text-slate-700">
                Available units
                <input
                  type="number"
                  min="0"
                  value={editQuantity}
                  onChange={(event) => setEditQuantity(Number.parseInt(event.target.value, 10) || 0)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-amber-400"
                />
              </label>
              <label className="block text-xs font-semibold text-slate-700">
                Verification notes
                <input
                  type="text"
                  value={editNotes}
                  onChange={(event) => setEditNotes(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-amber-400"
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setEditingModalOpen(false)}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !facilities.length}
                className="flex items-center gap-2 rounded-lg bg-[#E88A05] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#C45F08] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <Activity className="h-3.5 w-3.5 animate-pulse" /> : <Check className="h-3.5 w-3.5" />}
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  progress,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof BedDouble;
  tone: "amber" | "blue" | "green" | "rose";
  progress?: number;
}) {
  const tones = {
    amber: { icon: "bg-amber-50 text-amber-600", bar: "bg-amber-400", track: "bg-amber-100" },
    blue: { icon: "bg-amber-50 text-amber-600", bar: "bg-amber-500", track: "bg-amber-100" },
    green: { icon: "bg-emerald-50 text-emerald-600", bar: "bg-emerald-500", track: "bg-emerald-100" },
    rose: { icon: "bg-rose-50 text-rose-600", bar: "bg-rose-500", track: "bg-rose-100" },
  }[tone];
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones.icon}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-[26px] font-bold leading-none tracking-tight text-slate-900">{value}</p>
      {progress !== undefined && (
        <div className={`mt-3 h-1.5 overflow-hidden rounded-full ${tones.track}`}>
          <div className={`h-full rounded-full ${tones.bar}`} style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} />
        </div>
      )}
      <p className="mt-2 text-[10px] text-slate-400">{detail}</p>
    </article>
  );
}

function EmptyState({ icon: Icon, message }: { icon: typeof Activity; message: string }) {
  return (
    <div className="flex min-h-[130px] flex-col items-center justify-center px-4 text-center">
      <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <Icon className="h-4 w-4" />
      </span>
      <p className="max-w-xs text-xs leading-5 text-slate-400">{message}</p>
    </div>
  );
}

export default function StaffDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] text-sm text-slate-500">
          Loading staff dashboard…
        </div>
      }
    >
      <StaffDashboardContent />
    </Suspense>
  );
}
