'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-white text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-grow">
        <ServicesSection />
      </main>

      <Footer />
    </div>
  );
}
