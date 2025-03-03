'use client';
import { useState } from 'react';
import Navbar from '@/components/base/Navbar';
import { Sidebar } from '@/components/base/Sidebar';
import { Footer } from '@/components/base/Footer';
import { usePathname } from 'next/navigation';

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1">
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          defaultActive='forum'
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
