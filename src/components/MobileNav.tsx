"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import LangSwitcher from "@/components/LangSwitcher";

interface NavDict {
  brands: string;
  creators: string;
  pricing?: string;
  start: string;
}

interface MobileNavProps {
  lang: string;
  dict: NavDict;
  page?: "brands" | "creators";
}

export default function MobileNav({ lang, dict, page = "brands" }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="flex md:hidden items-center gap-2">
      {/* Lang switcher visible on mobile too */}
      <div className="p-1 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-xl shadow-inner">
        <div className="rounded-full bg-white dark:bg-zinc-900 shadow-md border border-black/5 dark:border-white/5">
          <LangSwitcher currentLang={lang} />
        </div>
      </div>

      {/* Hamburger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-md backdrop-blur-xl transition-all duration-300 hover:scale-105"
      >
        {open ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div
          className="mx-4 mt-4 rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden"
          style={{
            background: "oklch(0.99 0.003 300 / 0.97)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/30">
            <span className="font-heading font-bold text-foreground text-base">Menu</span>
            <button
              onClick={close}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-colors"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="px-4 py-4 space-y-1">
            {page === "creators" ? (
              <Link
                href={`/${lang}`}
                onClick={close}
                className="flex items-center px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
              >
                {dict.brands}
              </Link>
            ) : (
              <span className="flex items-center px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-foreground bg-gradient-to-r from-[#f7931e]/8 to-[#ea2d3e]/8">
                {dict.brands}
              </span>
            )}

            {page === "brands" ? (
              <Link
                href={`/${lang}/for-creators`}
                onClick={close}
                className="flex items-center px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
              >
                {dict.creators}
              </Link>
            ) : (
              <span className="flex items-center px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-foreground bg-gradient-to-r from-[#f7931e]/8 to-[#ea2d3e]/8">
                {dict.creators}
              </span>
            )}

            {dict.pricing && (
              <a
                href="#pricing"
                onClick={close}
                className="flex items-center px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
              >
                {dict.pricing}
              </a>
            )}

            <div className="h-px bg-border/40 mx-2 my-1" />
          </nav>
        </div>
      </div>
    </div>
  );
}
