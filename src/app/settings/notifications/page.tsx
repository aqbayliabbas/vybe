"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const groups = [
  {
    title: 'Email',
    desc: 'Updates delivered to your inbox.',
    items: [
      { id: 'submissions', label: 'New submissions', desc: 'When a creator submits to your campaign.' },
      { id: 'milestones', label: 'Campaign milestones', desc: 'Goal reached, halfway, ending soon.' },
      { id: 'invoices', label: 'Invoices & receipts', desc: 'Billing activity and payment confirmations.' },
      { id: 'newsletter', label: 'Product newsletter', desc: 'Monthly highlights and best practices.' },
    ],
  },
  {
    title: 'In-app',
    desc: 'Realtime alerts inside the workspace.',
    items: [
      { id: 'mentions', label: 'Mentions & replies', desc: 'When someone replies to your feedback.' },
      { id: 'leaderboard', label: 'Leaderboard changes', desc: 'When ranking on a contest you own shifts.' },
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
        <Button className="rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-6 text-white">Save preferences</Button>
      </div>
    </div>
  );
}
