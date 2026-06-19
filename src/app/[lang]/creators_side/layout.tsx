"use client";

import { CreatorSidebar } from "@/components/creator/CreatorSidebar";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <CreatorSidebar />
      <main className="flex-1 w-full pt-20 px-4 py-8 md:pt-10 md:ml-[240px] md:px-12 max-w-[1400px]">
        {children}
      </main>
    </div>
  );
}
