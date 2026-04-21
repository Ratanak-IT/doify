
import Hero from "@/components/landing/Hero";
import Logos from "@/components/landing/Logos";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import NavBar from "@/components/NavBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doify — Where teams move work forward",
  description: "Plan smarter, collaborate in real time, and ship work without the chaos.",
  openGraph: {
    title: "Doify — Where teams move work forward",
    description: "Plan smarter, collaborate in real time, and ship work without the chaos.",
    url: "https://doify-self.vercel.app",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <div className="dark:bg-gray-900">
      <Hero />
      <Logos />
      <Features />
      <HowItWorks />
      <Testimonials />
      {/* <Pricing /> */}
      <FinalCTA />
    </div>
  );
}