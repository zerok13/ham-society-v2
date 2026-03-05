import Header from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { EventBanner } from "@/components/EventBanner";
import { NoticeSection } from "@/components/NoticeSection";
import { AboutSection } from "@/components/AboutSection";
import { QuickLinks } from "@/components/QuickLinks";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <EventBanner />
        <NoticeSection />
        <AboutSection />
        <QuickLinks />
      </main>
      <Footer />
    </div>
  );
}
