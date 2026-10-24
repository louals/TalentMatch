import React from "react";
import HeroSection from "../../components/home/HeroSection";
import HowItWorks from "../../components/home/HowItWorks";
import FeaturesSection from "../../components/home/FeaturesSection";
import Testimonials from "../../components/home/DemoPreview";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <Testimonials />
      <Footer />
    </div>
  );
}