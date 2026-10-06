import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ProductDemo } from './components/ProductDemo';
import { Features } from './components/Features';
import { Privacy } from './components/Privacy';
import { CTA } from './components/CTA';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

export const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ProductDemo />
        <Features />
        <Privacy />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};
