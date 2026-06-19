/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Trophy, Handshake, Users, BarChart3,
  Settings, LogOut, Zap, CreditCard, Sparkles, ChevronDown,
  User, Bell, Shield, FolderOpen, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/AuthProvider';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

const mainNav = [
  { label: 'Vue d\'ensemble', icon: LayoutDashboard, to: '/dashboard' },
  // { label: 'Concours', icon: Trophy, to: '/contests' },
  { label: 'Offres', icon: Handshake, to: '/deals' },
  { label: 'Créateurs', icon: Users, to: '/creators' },
];

const accountNav = [
  { label: 'Analyses', icon: BarChart3, to: '/analytics' },
  { label: 'Bibliothèque de contenu', icon: FolderOpen, to: '/library' },
];

const settingsChildren = [
  { label: 'Profil', icon: User, to: '/settings/profile' },
  { label: 'Facturation', icon: CreditCard, to: '/settings/billing' },
  { label: 'Notifications', icon: Bell, to: '/settings/notifications' },
  { label: 'Sécurité', icon: Shield, to: '/settings/security' },
];

export function BrandSidebar() {
  const pathname = usePathname() || '';
  const router = useRouter();
  const settingsActive = pathname.startsWith('/settings');
  const [settingsOpen, setSettingsOpen] = useState(settingsActive);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      toast.success('Déconnexion réussie.');
      router.push('/login');
    } catch (e: any) {
      console.error(e);
      toast.error('Échec de la déconnexion.');
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Compte Marque';
  const displayEmail = user?.email || 'brand@account.com';
  
  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase() || 'BA';
  };

  const initials = getInitials(displayName);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border/40 bg-white/60 backdrop-blur-xl z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe to-vybe-glow shadow-[0_4px_10px_-3px_oklch(0.72_0.14_300_/_0.5)]">
            <Zap className="h-4 w-4 fill-white text-white" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">Vybe</span>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-foreground">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col border-r border-border/40 bg-white/80 backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-6 py-7 md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe to-vybe-glow shadow-[0_8px_20px_-6px_oklch(0.72_0.14_300_/_0.5)]">
              <Zap className="h-4 w-4 fill-white text-white" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">Vybe</span>
          </div>
          <button className="md:hidden p-1 text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50">Espace de travail</p>
        <div className="space-y-1">
          {mainNav.map(item => {
            const active = pathname === item.to || (item.to !== '/dashboard' && pathname.startsWith(item.to));
            return (
              <Link
                key={item.label}
                href={item.to}
                className={cn(
                  'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition-all duration-300',
                  active
                    ? 'bg-gradient-to-r from-vybe/15 to-vybe-glow/10 text-vybe-dark shadow-[0_4px_16px_-6px_oklch(0.72_0.14_300_/_0.4)]'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-vybe shadow-[0_0_8px_oklch(0.72_0.14_300_/_0.6)]" />}
                <item.icon className={cn('h-[17px] w-[17px]', active ? 'text-vybe' : '')} />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <p className="mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50">Compte</p>
        <div className="space-y-1">
          {accountNav.map(item => {
            const active = pathname === item.to || (item.to !== '/dashboard' && pathname.startsWith(item.to));
            return (
              <Link
                key={item.label}
                href={item.to}
                className={cn(
                  'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition-all',
                  active
                    ? 'bg-gradient-to-r from-vybe/15 to-vybe-glow/10 text-vybe-dark shadow-[0_4px_16px_-6px_oklch(0.72_0.14_300_/_0.4)]'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-vybe shadow-[0_0_8px_oklch(0.72_0.14_300_/_0.6)]" />}
                <item.icon className={cn('h-[17px] w-[17px]', active ? 'text-vybe' : '')} />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}

          {/* Collapsible Settings */}
          <button
            onClick={() => setSettingsOpen(o => !o)}
            className={cn(
              'group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition-all',
              settingsActive
                ? 'bg-gradient-to-r from-vybe/15 to-vybe-glow/10 text-vybe-dark'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            {settingsActive && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-vybe shadow-[0_0_8px_oklch(0.72_0.14_300_/_0.6)]" />}
            <Settings className={cn('h-[17px] w-[17px]', settingsActive ? 'text-vybe' : '')} />
            <span className="flex-1 text-left">Paramètres</span>
            <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', settingsOpen ? 'rotate-180' : '')} />
          </button>
          {settingsOpen && (
            <div className="ml-4 space-y-0.5 border-l border-border/40 pl-3">
              {settingsChildren.map(c => {
                const active = pathname === c.to;
                return (
                  <Link
                    key={c.to}
                    href={c.to}
                    className={cn(
                       'flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-medium transition-colors',
                       active ? 'text-vybe-dark' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <c.icon className="h-3.5 w-3.5" />
                    {c.label}
                  </Link>
                );
              })}
            </div>
          )}

          <Link
            href="/upgrade"
            className={cn(
              'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition-all',
              pathname.startsWith('/upgrade')
                ? 'bg-gradient-to-r from-vybe/15 to-vybe-glow/10 text-vybe-dark'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            <Sparkles className={cn('h-[17px] w-[17px]', pathname.startsWith('/upgrade') ? 'text-vybe' : '')} />
            <span className="flex-1">Passer au plan supérieur</span>
          </Link>
        </div>
      </nav>

      {/* Upgrade card */}
      <div className="mx-3 mb-3 overflow-hidden rounded-2xl bg-gradient-to-br from-vybe/15 via-vybe-glow/10 to-vybe-pink/15 p-4 relative">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-vybe/20 blur-2xl" />
        <div className="relative">
          <p className="font-heading text-[13px] font-semibold text-foreground">Débloquer Pro</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Obtenez des analyses avancées et des campagnes illimitées.</p>
          <Link href="/upgrade" className="mt-3 block w-full rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-3 py-1.5 text-center text-[11px] font-semibold text-white shadow-[0_4px_12px_-4px_oklch(0.72_0.14_300_/_0.5)]">
            Mettre à niveau
          </Link>
        </div>
      </div>

      <div className="mx-3 mb-4 flex items-center gap-3 rounded-2xl border border-border/40 bg-white/60 p-2.5 backdrop-blur-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-vybe/25 to-vybe-glow/15 text-[11px] font-bold text-vybe-dark">{initials}</div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-[12px] font-semibold text-foreground" title={displayName}>{displayName}</p>
          <p className="truncate text-[10px] text-muted-foreground" title={displayEmail}>{displayEmail}</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="border-0 bg-transparent p-0 m-0 cursor-pointer text-muted-foreground/50 transition-colors hover:text-foreground flex items-center justify-center"
          title="Se déconnecter"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
    </>
  );
}
