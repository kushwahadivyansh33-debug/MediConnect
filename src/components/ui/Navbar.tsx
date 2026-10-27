"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  User,
  Shield,
  PhoneCall,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { NotificationBell } from "./NotificationBell";

export function Navbar() {
  const { t, locale, setLocale, theme, toggleTheme } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/hospitals", label: t.nav.hospitals },
    { href: "/blood-banks", label: t.nav.bloodBanks },
    { href: "/how-it-works", label: t.nav.howItWorks },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-subtle group-hover:scale-105 transition">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight flex items-center gap-1.5">
                MediConnect
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  Live
                </span>
              </span>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                Hospital Resources & Blood Bank
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border">
              <Globe className="w-3.5 h-3.5 text-muted-foreground ml-1.5 mr-1" />
              <button
                onClick={() => setLocale("en")}
                className={`text-xs px-2 py-0.5 rounded font-medium transition ${
                  locale === "en"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale("hi")}
                className={`text-xs px-2 py-0.5 rounded font-medium transition ${
                  locale === "hi"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Dark Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent hover:border-border transition"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Emergency Hotline Quick Dial */}
            <a
              href="tel:112"
              title="National Emergency Hotline 112"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900 hover:bg-rose-100 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>112 / 108</span>
            </a>

            {/* Staff Auth Button */}
            {user ? (
              <Link
                href="/staff/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-subtle transition"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-foreground text-background hover:opacity-90 shadow-subtle transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.nav.login}</span>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden items-center gap-2">
            <NotificationBell />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLocale(locale === "en" ? "hi" : "en")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-muted/40"
              >
                Language: {locale === "en" ? "English" : "हिन्दी"}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-border bg-muted/40 text-muted-foreground"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {user ? (
              <Link
                href="/staff/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-foreground text-background"
              >
                {t.nav.login}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
