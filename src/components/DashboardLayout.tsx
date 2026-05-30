import { ReactNode } from 'react';
import { BrandSidebar } from '@/components/BrandSidebar';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.97_0.012_310)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[600px] w-[700px] rounded-full bg-[oklch(0.82_0.12_300_/_0.35)] blur-[140px]" />
        <div className="absolute top-[40%] -right-40 h-[500px] w-[500px] rounded-full bg-[oklch(0.85_0.1_340_/_0.3)] blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[oklch(0.86_0.08_280_/_0.25)] blur-[120px]" />
      </div>
      <div className="relative flex min-h-screen">
        <BrandSidebar />
        <main className="ml-[240px] flex-1 p-6 md:p-8">
          <div className="rounded-[28px] border border-border/40 bg-white/80 p-6 shadow-soft backdrop-blur-xl md:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
