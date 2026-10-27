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
  Shield,
  ChevronDown,
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
    { href: "/", label: "Home" },
    { href: "/hospitals", label: "Find Hospitals" },
    { href: "/blood-banks", label: "Blood Banks" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo matching reference (Blue Shield with White Medical Cross) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0284C7] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#0284C7" stroke="#0284C7" />
                <path d="M12 8v8M8 12h8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-display font-extrabold text-xl text-[#0F172A] dark:text-white tracking-tight">
              Medi<span className="text-[#0284C7]">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "text-[#0284C7] font-semibold"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as "en" | "hi")}
                className="appearance-none bg-transparent pr-6 pl-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-hidden cursor-pointer"
              >
                <option value="en" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                  English
                </option>
                <option value="hi" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                  हिन्दी
                </option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1 pointer-events-none" />
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Login / Profile / Get Started Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/staff/dashboard"
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center font-bold text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                  <span>{user.name.split(" ")[0]}</span>
                </Link>
                <Link
                  href="/staff/dashboard"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-xs transition"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0284C7] transition"
                >
                  Login
                </Link>
                <Link
                  href="/hospitals"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-xs transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <NotificationBell />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setLocale(locale === "en" ? "hi" : "en")}
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Lang: {locale === "en" ? "EN" : "हिन्दी"}
            </button>
            <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-300">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? (
              <Link
                href="/staff/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0284C7] text-white"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0284C7] text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
