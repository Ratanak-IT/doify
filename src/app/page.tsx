// app/page.tsx
import Hero from "@/components/landing/Hero";
import Logos from "@/components/landing/Logos";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import NavBar from "@/components/NavBar";

export default function HomePage() {
  return (
    <div className="dark:bg-gray-900">
      <Hero />
      <Logos />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FinalCTA />
    </div>
  );
}