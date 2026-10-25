import { HeroSection } from "@/components/HeroSection";
import { NoticeSection } from "@/components/NoticeSection";
import { AboutSection } from "@/components/AboutSection";
import { QuickLinks } from "@/components/QuickLinks";

export default function Home() {
  return (
    <>
      <HeroSection />
      <NoticeSection />
      <AboutSection />
      <QuickLinks />
    </>
  );
}
