/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Trophy, Handshake, Users, BarChart3,
  Settings, LogOut, Zap, CreditCard, Sparkles, ChevronDown,
  User, Bell, Shield, FolderOpen, DollarSign, Globe, HelpCircle,
  Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/AuthProvider';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';
import { VybeLogo } from '@/components/VybeLogo';

const mainNav = [
  { label: 'Tableau de bord', icon: LayoutDashboard, to: '/creators_side' },
  { label: 'Opportunités', icon: Trophy, to: '/creators_side/browse' },
  { label: 'Mon Travail', icon: FolderOpen, to: '/creators_side/my-work' },
];

const accountNav = [
  { label: 'Revenus', icon: DollarSign, to: '/creators_side/earnings' },
  { label: 'Analyses', icon: BarChart3, to: '/creators_side/analytics' },
  { label: 'Profil', icon: User, to: '/creators_side/profile' },
];

const settingsChildren = [
  { label: 'Compte', icon: User, to: '/creators_side/settings' },
  { label: 'Notifications', icon: Bell, to: '/creators_side/settings/notifications' },
  { label: 'Paiements', icon: CreditCard, to: '/creators_side/settings/payments' },
  { label: 'Langue', icon: Globe, to: '/creators_side/settings/language' },
  { label: 'Sécurité', icon: Shield, to: '/creators_side/settings/security' },
];

export function CreatorSidebar() {
  const pathname = usePathname() || '';
  const router = useRouter();
  const settingsActive = pathname.startsWith('/creators_side/settings');
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

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Créateur';
  const displayEmail = user?.email || 'creator@vybe.app';
  
  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase() || 'CR';
  };

  const initials = getInitials(displayName);

  const isActive = (to: string) => {
    if (to === "/creators_side") return pathname === "/creators_side";
    return pathname.startsWith(to);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border/40 bg-white/60 backdrop-blur-xl z-40 flex items-center justify-between px-4">
        <div className="flex items-center px-2">
          <VybeLogo className="scale-90 origin-left" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-vybe-dark">Créateur</span>
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
          <div className="flex items-center">
            <VybeLogo />
            <span className="text-[10px] font-bold uppercase tracking-wider text-vybe-dark">Créateur</span>
          </div>
          <button className="md:hidden p-1 text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50">Principal</p>
        <div className="space-y-1">
          {mainNav.map(item => {
            const active = isActive(item.to);
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
            const active = isActive(item.to);
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
            href="/creators_side/help"
            className={cn(
              'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition-all',
              pathname.startsWith('/creators_side/help')
                ? 'bg-gradient-to-r from-vybe/15 to-vybe-glow/10 text-vybe-dark'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            <HelpCircle className={cn('h-[17px] w-[17px]', pathname.startsWith('/creators_side/help') ? 'text-vybe' : '')} />
            <span className="flex-1">Centre d'aide</span>
          </Link>
        </div>
      </nav>

      {/* User Info Block */}
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
