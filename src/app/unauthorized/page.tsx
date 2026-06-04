import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-destructive/5 blur-[120px]" />
      </div>
      
      <div className="relative text-center max-w-md mx-auto">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-3">Unauthorized Access</h1>
        <p className="text-[14px] text-muted-foreground mb-8 leading-relaxed">
          You don't have the required permissions to view this page. This area is restricted to specific user roles.
        </p>
        <Link href="/dashboard">
          <Button className="h-12 rounded-full px-8 font-semibold shadow-soft">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
