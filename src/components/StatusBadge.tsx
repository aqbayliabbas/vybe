import { cn } from '@/lib/utils';

const statusConfig: Record<string, { bg: string; text: string; dot?: string }> = {
  live: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  draft: { bg: 'bg-muted', text: 'text-muted-foreground' },
  ended: { bg: 'bg-muted', text: 'text-muted-foreground' },
  pending: { bg: 'bg-warning/10', text: 'text-warning-foreground' },
  approved: { bg: 'bg-success/10', text: 'text-success' },
  declined: { bg: 'bg-destructive/10', text: 'text-destructive' },
  edits: { bg: 'bg-warning/10', text: 'text-warning-foreground' },
  deal: { bg: 'bg-info/10', text: 'text-info' },
  contest: { bg: 'bg-primary/10', text: 'text-primary' },
  paid: { bg: 'bg-success/10', text: 'text-success' },
  processing: { bg: 'bg-warning/10', text: 'text-warning-foreground' },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const label = status === 'edits' ? 'Edits Requested' : status.charAt(0).toUpperCase() + status.slice(1);
  const config = statusConfig[status] || { bg: 'bg-muted', text: 'text-muted-foreground' };
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
      config.bg, config.text, className
    )}>
      {config.dot && <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />}
      {label}
    </span>
  );
}
