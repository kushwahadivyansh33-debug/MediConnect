"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Mic, MicOff, MapPin, Hospital, Droplet, ArrowRight, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function HeroSearch() {
  const { t, locale } = useApp();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [area, setArea] = useState("ALL");
  const [category, setCategory] = useState<"HOSPITALS" | "BLOOD">("HOSPITALS");
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Speech Recognition integration
  const startVoiceSearch = () => {
    // Check browser support
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice("Voice search is not supported in this browser. Please use text search.");
      setTimeout(() => setVoiceNotice(null), 5000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = locale === "hi" ? "hi-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice(locale === "hi" ? "सुन रहे हैं... बोलिए" : "Listening... speak now");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        setVoiceNotice(null);

        // Smart intent analysis
        const lower = transcript.toLowerCase();
        if (
          lower.includes("blood") ||
          lower.includes("रक्त") ||
          lower.includes("खून") ||
          lower.includes("positive") ||
          lower.includes("negative") ||
          lower.includes("o-") ||
          lower.includes("a+")
        ) {
          router.push(`/blood-banks?q=${encodeURIComponent(transcript)}`);
        } else {
          router.push(`/hospitals?q=${encodeURIComponent(transcript)}`);
        }
      };

      recognition.onerror = (e: any) => {
        setIsListening(false);
        setVoiceNotice(`Speech recognition error (${e.error}). Falling back to text input.`);
        setTimeout(() => setVoiceNotice(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceNotice("Microphone permission denied or unavailable.");
      setTimeout(() => setVoiceNotice(null), 4000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (category === "HOSPITALS") {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (area !== "ALL") params.set("area", area);
      router.push(`/hospitals?${params.toString()}`);
    } else {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (area !== "ALL") params.set("area", area);
      router.push(`/blood-banks?${params.toString()}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => setCategory("HOSPITALS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            category === "HOSPITALS"
              ? "bg-primary text-white shadow-subtle"
              : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Hospital className="w-4 h-4" />
          <span>{t.hero.searchCategoryHospital}</span>
        </button>
        <button
          type="button"
          onClick={() => setCategory("BLOOD")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            category === "BLOOD"
              ? "bg-rose-600 text-white shadow-subtle"
              : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>{t.hero.searchCategoryBlood}</span>
        </button>
      </div>

      {/* Main Search Bar Box */}
      <form
        onSubmit={handleSearch}
        className="bg-card border border-border rounded-2xl p-2 sm:p-2.5 shadow-float text-card-foreground flex flex-col md:flex-row items-stretch md:items-center gap-2"
      >
        {/* Search input field */}
        <div className="relative flex-1 flex items-center min-w-[200px]">
          <Search className="w-5 h-5 text-muted-foreground ml-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              category === "HOSPITALS"
                ? locale === "hi"
                  ? "अस्पताल, आईसीयू, वेंटिलेटर, एक्स-रे..."
                  : "Search hospital name, ICU, Ventilator, X-Ray..."
                : locale === "hi"
                ? "ब्लड बैंक, ब्लड ग्रुप उदा: O-, A+, B+..."
                : "Search blood bank or blood group (e.g. O-, A+)..."
            }
            className="w-full bg-transparent px-3 py-2.5 text-sm sm:text-base outline-hidden text-foreground placeholder:text-muted-foreground/70"
          />
        </div>

        {/* Area Dropdown */}
        <div className="relative flex items-center border-t md:border-t-0 md:border-l border-border pt-2 md:pt-0 md:pl-2 shrink-0">
          <MapPin className="w-4 h-4 text-muted-foreground ml-2 shrink-0" />
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="bg-transparent text-xs sm:text-sm font-medium px-2 py-2 text-foreground outline-hidden cursor-pointer"
          >
            <option value="ALL" className="bg-card text-card-foreground">
              {locale === "hi" ? "सभी क्षेत्र (All Areas)" : "All Regions"}
            </option>
            <option value="Lucknow" className="bg-card text-card-foreground">
              Lucknow (All)
            </option>
            <option value="Kanpur Road" className="bg-card text-card-foreground">
              Lucknow — Kanpur Road
            </option>
            <option value="Chowk" className="bg-card text-card-foreground">
              Lucknow — Chowk
            </option>
            <option value="New Delhi" className="bg-card text-card-foreground">
              New Delhi (All)
            </option>
            <option value="Saket" className="bg-card text-card-foreground">
              New Delhi — Saket
            </option>
            <option value="Gurugram" className="bg-card text-card-foreground">
              Gurugram
            </option>
          </select>
        </div>

        {/* Microphone and Submit Button */}
        <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0">
          <button
            type="button"
            onClick={startVoiceSearch}
            title={t.hero.voiceSearchTooltip}
            className={`p-2.5 rounded-xl border transition flex items-center justify-center ${
              isListening
                ? "bg-rose-500 text-white animate-pulse border-rose-600"
                : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            type="submit"
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-hover shadow-subtle transition"
          >
            <span>{t.common.search}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Voice Assistant / Query Feedback Notice */}
      {voiceNotice && (
        <div className="mt-2 text-xs font-medium px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 shrink-0 text-primary" />
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* Suggested Quick Searches */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Trending Searches:</span>
        <button
          type="button"
          onClick={() => {
            setCategory("HOSPITALS");
            setQuery("ICU Beds");
            router.push("/hospitals?service=icu");
          }}
          className="px-2.5 py-1 rounded-full bg-card border border-border hover:border-primary hover:text-primary transition"
        >
          ICU Beds
        </button>
        <button
          type="button"
          onClick={() => {
            setCategory("HOSPITALS");
            setQuery("Ventilators");
            router.push("/hospitals?service=ventilator");
          }}
          className="px-2.5 py-1 rounded-full bg-card border border-border hover:border-primary hover:text-primary transition"
        >
          Ventilators
        </button>
        <button
          type="button"
          onClick={() => {
            setCategory("BLOOD");
            setQuery("O-");
            router.push("/blood-banks?group=O-");
          }}
          className="px-2.5 py-1 rounded-full bg-card border border-border hover:border-rose-600 hover:text-rose-600 transition"
        >
          O- Negative Blood
        </button>
        <button
          type="button"
          onClick={() => {
            setCategory("BLOOD");
            setQuery("A+");
            router.push("/blood-banks?group=A%2B");
          }}
          className="px-2.5 py-1 rounded-full bg-card border border-border hover:border-rose-600 hover:text-rose-600 transition"
        >
          A+ Positive
        </button>
      </div>
    </div>
  );
}
