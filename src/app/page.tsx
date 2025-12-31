import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/landing/hero-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
    </main>
  );
}
