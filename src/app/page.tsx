import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { RecentlyClaimed } from "@/components/landing/recently-claimed";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <RecentlyClaimed />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
}
