import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { TestAuthBanner } from "@/components/auth/test-auth-banner";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TestAuthBanner />
    </main>
  );
}
