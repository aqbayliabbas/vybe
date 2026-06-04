"use client";

import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function CreatorDashboardPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authService.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      <div className="text-center z-10 space-y-6">
        <h1 className="font-heading text-4xl font-bold text-foreground">Coming Soon</h1>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          We are currently building the creator experience. Stay tuned for updates!
        </p>
        
        <div className="pt-8">
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="rounded-full px-8 gap-2 shadow-soft"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
