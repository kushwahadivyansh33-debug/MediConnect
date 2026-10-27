"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Mic, MicOff } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function HeroSearch() {
  const router = useRouter();
  const { locale } = useApp();

  const [query, setQuery] = useState("");
  const [area, setArea] = useState("Lucknow");
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = locale === "hi" ? "hi-IN" : "en-IN";
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        const lower = transcript.toLowerCase();
        if (lower.includes("blood") || lower.includes("खून") || lower.includes("negative") || lower.includes("o-")) {
          router.push(`/blood-banks?q=${encodeURIComponent(transcript)}&area=${encodeURIComponent(area)}`);
        } else {
          router.push(`/hospitals?q=${encodeURIComponent(transcript)}&area=${encodeURIComponent(area)}`);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (area && area !== "ALL") params.set("area", area);
    router.push(`/hospitals?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-card hover:shadow-float transition flex flex-col md:flex-row items-stretch md:items-center gap-2"
    >
      {/* Search Input Field */}
      <div className="relative flex-1 flex items-center min-w-[240px]">
        <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search hospitals, blood banks, or facilities..."
          className="w-full bg-transparent px-3 py-2.5 text-sm outline-hidden text-slate-900 dark:text-white placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={startVoiceSearch}
          title="Search by voice"
          className={`p-1.5 mr-2 rounded-lg transition ${
            isListening
              ? "text-rose-500 animate-pulse bg-rose-50 dark:bg-rose-950/40"
              : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      {/* Location / Area Selector with MapPin */}
      <div className="relative flex items-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-2 md:pt-0 md:pl-2 shrink-0">
        <MapPin className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="bg-transparent text-sm font-medium px-2.5 py-2 text-slate-700 dark:text-slate-200 outline-hidden cursor-pointer"
        >
          <option value="Lucknow">Lucknow</option>
          <option value="Gomti Nagar">Gomti Nagar, Lucknow</option>
          <option value="Hazratganj">Hazratganj, Lucknow</option>
          <option value="Aliganj">Aliganj, Lucknow</option>
          <option value="Indira Nagar">Indira Nagar, Lucknow</option>
          <option value="New Delhi">New Delhi</option>
          <option value="ALL">All Regions</option>
        </select>
      </div>

      {/* Search Action Button matching reference */}
      <button
        type="submit"
        className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-xs transition flex items-center justify-center gap-2 shrink-0"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
      </button>
    </form>
  );
}
