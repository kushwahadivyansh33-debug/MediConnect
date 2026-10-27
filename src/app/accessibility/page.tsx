"use client";

import React from "react";
import Link from "next/link";
import { Eye, Keyboard, Contrast, Volume2, ShieldCheck } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8 text-foreground">
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase text-primary">Inclusivity & WCAG Guidelines</span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display">Accessibility Statement</h1>
        <p className="text-xs font-mono text-muted-foreground">Compliance Target: WCAG 2.1 Level AA</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card space-y-6 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <p>
          MediConnect is dedicated to ensuring digital healthcare information is accessible to everyone, including individuals with low vision, motor impairments, cognitive disabilities, or non-English language preferences.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-muted/40 rounded-2xl border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Contrast className="w-4 h-4 text-primary" />
              High Contrast & Theming
            </div>
            <p className="text-xs">
              Every interface element maintains a minimum 4.5:1 contrast ratio in both Light and Dark mode modes to ensure readability in bright sunlight and low light.
            </p>
          </div>

          <div className="p-4 bg-muted/40 rounded-2xl border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Volume2 className="w-4 h-4 text-primary" />
              Multilingual Voice Assistant
            </div>
            <p className="text-xs">
              Built-in voice query support in Hindi and English facilitates search for users with mobility constraints or difficulty typing on mobile keyboards.
            </p>
          </div>

          <div className="p-4 bg-muted/40 rounded-2xl border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Keyboard className="w-4 h-4 text-primary" />
              Keyboard Navigation
            </div>
            <p className="text-xs">
              Full focus rings, logical tab indices, and ARIA labels enable screen reader users to navigate without a mouse.
            </p>
          </div>

          <div className="p-4 bg-muted/40 rounded-2xl border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Eye className="w-4 h-4 text-primary" />
              Sensible Font Scaling
            </div>
            <p className="text-xs">
              Responsive typography utilizes relative rem units, adapting gracefully to user-configured browser zoom levels up to 200%.
            </p>
          </div>
        </div>

        <section className="space-y-2 pt-4">
          <h2 className="text-base font-bold text-foreground">Feedback & Assistance</h2>
          <p>
            If you encounter any accessibility barrier or have suggestions for improvement, please email{" "}
            <a href="mailto:accessibility@mediconnect.local" className="text-primary hover:underline font-mono">
              accessibility@mediconnect.local
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
