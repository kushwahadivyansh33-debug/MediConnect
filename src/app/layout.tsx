import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { DemoDataBanner } from "@/components/ui/DemoDataBanner";

export const metadata: Metadata = {
  title: "MediConnect — Smart Hospital Resource & Blood Bank Availability",
  description:
    "Production-grade healthcare directory for verifying hospital ICU beds, ventilators, diagnostics, and blood bank stock in real-time.",
  keywords: [
    "Hospital Resources",
    "ICU Availability",
    "Ventilators",
    "Blood Bank Inventory",
    "Healthcare Platform",
    "MediConnect",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <AppProvider>
          <DemoDataBanner />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
