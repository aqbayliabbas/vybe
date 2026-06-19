"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const groups = [
  {
    title: 'Email',
    desc: 'Mises à jour envoyées dans votre boîte de réception.',
    items: [
      { id: 'submissions', label: 'Nouvelles soumissions', desc: 'Lorsqu\'un créateur postule à votre campagne.' },
      { id: 'milestones', label: 'Étapes de la campagne', desc: 'Objectif atteint, à mi-chemin, se termine bientôt.' },
      { id: 'invoices', label: 'Factures & reçus', desc: 'Activité de facturation et confirmations de paiement.' },
      { id: 'newsletter', label: 'Newsletter du produit', desc: 'Faits marquants mensuels et bonnes pratiques.' },
    ],
  },
  {
    title: 'Dans l\'application',
    desc: 'Alertes en temps réel dans l\'espace de travail.',
    items: [
      { id: 'mentions', label: 'Mentions & réponses', desc: 'Lorsque quelqu\'un répond à vos commentaires.' },
      { id: 'leaderboard', label: 'Changements de classement', desc: 'Lorsque le classement d\'un concours que vous possédez change.' },
    ],
  },
];

export default function NotificationsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    submissions: true, milestones: true, invoices: true, newsletter: false,
    mentions: true, leaderboard: false,
  });

  return (
    <div className="space-y-6">
      {groups.map(g => (
        <div key={g.title} className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card">
          <div className="mb-5">
            <h3 className="font-heading text-base font-semibold text-foreground">{g.title}</h3>
            <p className="text-[12px] text-muted-foreground">{g.desc}</p>
          </div>
          <div className="divide-y divide-border/40">
            {g.items.map(it => (
              <div key={it.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-[13px] font-medium text-foreground">{it.label}</p>
                  <p className="text-[12px] text-muted-foreground">{it.desc}</p>
                </div>
                <Switch
                  checked={enabled[it.id]}
                  onCheckedChange={v => setEnabled(prev => ({ ...prev, [it.id]: v }))}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button className="rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-6 text-white">Enregistrer les préférences</Button>
      </div>
    </div>
  );
}
