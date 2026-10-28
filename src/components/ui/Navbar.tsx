"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Moon,
  Sun,
  Menu,
  X,
  User,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { NotificationBell } from "@/components/ui/NotificationBell";

interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Find Hospitals", href: "/hospitals" },
  { label: "Blood Banks", href: "/blood-banks" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, theme, toggleTheme } = useApp();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-white/98 dark:bg-slate-950/98 backdrop-blur-md border-b border-[#E4EAF1] dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="MediConnect Home">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              d="M16 2L4 7.5V16.5C4 22.8 9.3 28.6 16 30C22.7 28.6 28 22.8 28 16.5V7.5L16 2Z"
              fill="#E88A05"
            />
            <rect x="14" y="9" width="4" height="14" rx="1" fill="white" />
            <rect x="9" y="14" width="14" height="4" rx="1" fill="white" />
          </svg>
          <span
            className="text-[18px] font-extrabold tracking-tight leading-none select-none"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span className="text-[#101828] dark:text-white">Medi</span>
            <span className="text-[#E88A05]">Connect</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-1.5 text-sm transition-colors rounded-md ${
                isActive(link.href)
                  ? "text-[#E88A05] font-semibold"
                  : "text-[#475467] hover:text-[#101828] dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#E88A05]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5">
          {/* Language Toggle */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#475467] dark:text-slate-400 hover:text-[#101828] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E4EAF1] dark:border-slate-700 transition"
              aria-haspopup="true"
              aria-expanded={langOpen}
            >
              <Globe className="w-3.5 h-3.5" />
              {locale === "en" ? "EN" : "हि"}
              <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-slate-900 border border-[#E4EAF1] dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50">
                <button
                  onClick={() => { setLocale("en"); setLangOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition ${locale === "en" ? "text-[#E88A05] font-semibold bg-amber-50 dark:bg-amber-900/20" : "text-[#475467] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                >
                  English
                </button>
                <button
                  onClick={() => { setLocale("hi"); setLangOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition ${locale === "hi" ? "text-[#E88A05] font-semibold bg-amber-50 dark:bg-amber-900/20" : "text-[#475467] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                >
                  हिन्दी
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-[#475467] dark:text-slate-400 hover:text-[#101828] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Notification Bell */}
          <NotificationBell />

          {/* Auth Controls */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 ml-1">
              <div className="w-8 h-8 rounded-full bg-[#E88A05] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <Link
                href="/staff/dashboard"
                className="text-sm font-semibold text-white bg-[#E88A05] hover:bg-[#C45F08] px-3.5 py-1.5 rounded-lg transition"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 ml-1">
              <Link
                href="/login"
                className="text-sm font-medium text-[#475467] dark:text-slate-300 hover:text-[#101828] dark:hover:text-white transition px-2 py-1.5"
              >
                Login
              </Link>
              <Link
                href="/hospitals"
                className="text-sm font-semibold text-white bg-[#E88A05] hover:bg-[#C45F08] px-4 py-1.5 rounded-lg transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile: Bell + Hamburger */}
          <div className="flex items-center gap-1 sm:hidden ml-1">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-lg text-[#475467] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="hidden sm:flex lg:hidden p-2 rounded-lg text-[#475467] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E4EAF1] dark:border-slate-800/60 bg-white dark:bg-slate-950 px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive(link.href)
                  ? "text-[#E88A05] bg-amber-50 dark:bg-amber-900/20 font-semibold"
                  : "text-[#475467] dark:text-slate-300 hover:text-[#101828] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-[#E4EAF1] dark:border-slate-800 flex flex-col gap-2">
            {/* Language toggle mobile */}
            <div className="flex gap-2">
              <button
                onClick={() => setLocale("en")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${locale === "en" ? "border-[#E88A05] text-[#E88A05] bg-amber-50 dark:bg-amber-900/20" : "border-[#E4EAF1] dark:border-slate-700 text-[#475467] dark:text-slate-400"}`}
              >
                English
              </button>
              <button
                onClick={() => setLocale("hi")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${locale === "hi" ? "border-[#E88A05] text-[#E88A05] bg-amber-50 dark:bg-amber-900/20" : "border-[#E4EAF1] dark:border-slate-700 text-[#475467] dark:text-slate-400"}`}
              >
                हिन्दी
              </button>
            </div>
            {user ? (
              <Link
                href="/staff/dashboard"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center text-sm font-semibold text-white bg-[#E88A05] hover:bg-[#C45F08] px-4 py-2.5 rounded-lg transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center text-sm font-medium text-[#475467] dark:text-slate-300 border border-[#E4EAF1] dark:border-slate-700 px-4 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Login
                </Link>
                <Link
                  href="/hospitals"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center text-sm font-semibold text-white bg-[#E88A05] hover:bg-[#C45F08] px-4 py-2.5 rounded-lg transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
