'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminSection from '@/components/AdminSection';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-grow">
        <AdminSection onBackToStore={() => router.push('/')} />
      </main>

      <Footer />
    </div>
  );
}
