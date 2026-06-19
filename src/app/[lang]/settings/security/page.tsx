import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, Smartphone, KeyRound, LogOut } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
            <KeyRound className="h-4 w-4 text-vybe-dark/70" />
          </div>
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">Mot de passe</h3>
            <p className="text-[12px] text-muted-foreground">Utilisez un mot de passe fort et unique pour Vybe.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-foreground">Actuel</label>
            <Input type="password" placeholder="••••••••" className="rounded-2xl border-border/60 bg-white/70" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-foreground">Nouveau</label>
            <Input type="password" placeholder="••••••••" className="rounded-2xl border-border/60 bg-white/70" />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-foreground">Confirmer</label>
            <Input type="password" placeholder="••••••••" className="rounded-2xl border-border/60 bg-white/70" />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button className="rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-6 text-white">Mettre à jour le mot de passe</Button>
        </div>
      </div>

      <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
            <ShieldCheck className="h-4 w-4 text-vybe-dark/70" />
          </div>
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">Authentification à deux facteurs</h3>
            <p className="text-[12px] text-muted-foreground">Ajoutez une deuxième étape pour protéger votre compte.</p>
          </div>
        </div>
        <div className="divide-y divide-border/40">
          <Row label="Application d'authentification" desc="Utilisez Google Authenticator ou 1Password." defaultOn />
          <Row label="Vérification par SMS" desc="Recevez un code par SMS." />
          <Row label="Codes de secours" desc="Codes à usage unique si vous perdez votre appareil." defaultOn />
        </div>
      </div>

      <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
            <Smartphone className="h-4 w-4 text-vybe-dark/70" />
          </div>
          <div>
            <h3 className="font-heading text-base font-semibold text-foreground">Sessions actives</h3>
            <p className="text-[12px] text-muted-foreground">Appareils actuellement connectés.</p>
          </div>
        </div>
        <div className="divide-y divide-border/40">
          {[
            { device: 'MacBook Pro · Alger', last: 'Actif maintenant', current: true },
            { device: 'iPhone 15 · Alger', last: 'Il y a 2 heures' },
            { device: 'Chrome · Oran', last: 'Il y a 3 jours' },
          ].map(s => (
            <div key={s.device} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-[13px] font-medium text-foreground">{s.device} {s.current && <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Actuel</span>}</p>
                <p className="text-[12px] text-muted-foreground">{s.last}</p>
              </div>
              {!s.current && (
                <Button variant="ghost" size="sm" className="rounded-full text-destructive hover:bg-destructive/10">
                  <LogOut className="mr-1.5 h-3.5 w-3.5" /> Révoquer
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, desc, defaultOn }: { label: string; desc: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
      <div>
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        <p className="text-[12px] text-muted-foreground">{desc}</p>
      </div>
      <Switch defaultChecked={defaultOn} />
    </div>
  );
}
