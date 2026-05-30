import { Zap } from 'lucide-react';

export function VybeLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe to-vybe-glow shadow-card">
        <Zap className="h-4 w-4 text-white fill-white" />
      </div>
      <span className="text-lg font-heading font-bold tracking-tight text-foreground">Vybe</span>
    </div>
  );
}
