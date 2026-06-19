"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Globe, Check } from "lucide-react";
import { usePathname } from "next/navigation";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
  { code: "fr", label: "Français", flag: "🇫🇷", short: "FR" },
  { code: "ar", label: "العربية", flag: "🇩🇿", short: "AR", rtl: true },
];

export default function LangSwitcher({ currentLang }: { currentLang: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Build the same path in the target language
  const getPathForLang = (targetLang: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const knownLangs = ["en", "fr", "ar"];
    if (knownLangs.includes(segments[0])) {
      segments[0] = targetLang;
    } else {
      segments.unshift(targetLang);
    }
    return "/" + segments.join("/");
  };

  const current = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 h-[42px] px-4 rounded-full text-[13px] font-semibold transition-all duration-300 select-none ${
          open
            ? "bg-black/8 dark:bg-white/8 text-foreground"
            : "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
        }`}
        aria-label="Change language"
      >
        <Globe className="h-4 w-4 text-vybe shrink-0" />
        <span className="hidden sm:inline">{current.flag}</span>
        <span>{current.short}</span>
        {/* Chevron */}
        <svg
          className={`h-3 w-3 text-muted-foreground/60 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-[calc(100%+10px)] ltr:right-0 rtl:left-0 w-52 rounded-2xl overflow-hidden transition-all duration-300 origin-top-right z-[999] ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
        style={{
          background: "oklch(0.995 0.003 300 / 0.9)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          boxShadow: "0 20px 60px -12px oklch(0 0 0 / 0.15), 0 0 0 1px oklch(0.88 0.02 300 / 0.5)",
        }}
      >
        {/* Header */}
        <div className="px-4 pt-3 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/50">
            Language
          </p>
        </div>

        {/* Options */}
        <div className="px-2 pb-2 space-y-0.5">
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === currentLang;
            return (
              <Link
                key={lang.code}
                href={getPathForLang(lang.code)}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#f7931e]/10 to-[#ea2d3e]/10 text-foreground"
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                }`}
                dir={lang.rtl ? "rtl" : "ltr"}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className={`font-semibold ${isActive ? "text-foreground" : ""}`}>
                      {lang.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground/50 font-normal">
                      {lang.short}
                    </span>
                  </div>
                </div>
                {isActive && (
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-br from-[#f7931e] to-[#ea2d3e] flex items-center justify-center shadow-sm">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
