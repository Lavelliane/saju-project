"use client";

import { AboutSection } from "../_components/AboutSection";
import { CtaSection } from "../_components/CtaSection";
import { HeroSection } from "../_components/HeroSection";
import { HowItWorksSection } from "../_components/HowItWorksSection";
import { ServicesSection } from "../_components/ServicesSection";
import { TestimonialsSection } from "../_components/TestimonialsSection";

const HomePage = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <ServicesSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
};

export default HomePage;
