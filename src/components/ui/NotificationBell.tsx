"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck, Clock, ExternalLink, X } from "lucide-react";
import { SystemNotification } from "@/types";
import { formatDate } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export function NotificationBell() {
  const { notificationsCount, refreshNotificationsCount } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      refreshNotificationsCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkSingle = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      refreshNotificationsCount();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open notifications"
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition"
      >
        <Bell className="w-5 h-5" />
        {notificationsCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[1.125rem] h-[1.125rem] px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full border-2 border-white dark:border-slate-900">
            {notificationsCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-card border border-border shadow-float z-50 overflow-hidden text-card-foreground">
          <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
              <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Live Feed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="text-xs text-muted-foreground hover:text-primary transition flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {loading ? (
              <div className="p-6 text-center text-xs text-muted-foreground">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No current notifications.</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleMarkSingle(item.id)}
                  className={`p-3.5 transition cursor-pointer hover:bg-muted/30 ${
                    !item.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-semibold ${!item.read ? "text-primary" : "text-foreground"}`}>
                      {item.title}
                    </p>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(item.createdAt)}
                    </span>
                    {item.facilityId && (
                      <Link
                        href={`/hospitals/${item.facilityId}`}
                        onClick={() => setIsOpen(false)}
                        className="text-primary hover:underline flex items-center gap-0.5"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
