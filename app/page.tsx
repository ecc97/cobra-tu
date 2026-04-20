'use client';

import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import WhyProjectExists from '@/components/sections/WhyProjectExists';
import Pricing from '@/components/sections/Pricing';
import FinalCTA from '@/components/sections/FinalCTA';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="bg-surface text-on-surface">
      <Navbar />
      <Hero />
      <HowItWorks />
      <WhyProjectExists />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
