import { HeroSection } from "@/components/HeroSection";
import { EventBanner } from "@/components/EventBanner";
import { NoticeSection } from "@/components/NoticeSection";
import { AboutSection } from "@/components/AboutSection";
import { QuickLinks } from "@/components/QuickLinks";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <EventBanner />
      <NoticeSection />
      <AboutSection />
      <QuickLinks />
    </main>
  );
}
