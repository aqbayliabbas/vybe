"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { cn } from '@/lib/utils';
import { User, Bell, Shield, CreditCard, Building2 } from 'lucide-react';

const tabs = [
  { href: '/settings/profile', label: 'Company', icon: Building2 },
  { href: '/settings/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings/security', label: 'Security', icon: Shield },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Settings</p>
        <h1 className="font-heading mt-2 text-[28px] font-bold tracking-tight text-foreground md:text-[34px]">Workspace settings</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Manage your profile, notifications and account security.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="rounded-3xl border border-border/40 bg-white/90 p-2 shadow-card h-fit">
          {tabs.map(t => {
            const active = pathname === t.href || (pathname === '/settings' && t.href === '/settings/profile');
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition-all',
                  active
                    ? 'bg-gradient-to-r from-vybe/15 to-vybe-glow/10 text-vybe-dark'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <t.icon className="h-[17px] w-[17px]" />
                {t.label}
              </Link>
            );
          })}
        </nav>
        <div>
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
}
