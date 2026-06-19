"use client";

import { useState } from "react";
import { User, Bell, CreditCard, Shield, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNav = [
  { label: "Account Profile", icon: User, to: "/creators_side/settings" },
  { label: "Notifications", icon: Bell, to: "/creators_side/settings/notifications" },
  { label: "Payments", icon: CreditCard, to: "/creators_side/settings/payments" },
  { label: "Language", icon: Globe, to: "/creators_side/settings/language" },
  { label: "Security", icon: Shield, to: "/creators_side/settings/security" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Preferences</p>
        <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">
          Settings
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Manage your account preferences, notifications, and billing details.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-[240px] shrink-0">
          <nav className="space-y-1">
            {settingsNav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.label}
                  href={item.to}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all",
                    active
                      ? "bg-vybe/10 text-vybe-dark"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        
        <main className="flex-1 min-w-0">
          <div className="bg-white/90 shadow-card border border-border/40 rounded-3xl p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
