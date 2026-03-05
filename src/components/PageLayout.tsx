"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";    


// 서브 페이지별 배경 이미지 (번갈아 사용)
const backgroundImages = [
  "/images/slide-group-winter.jpg",
  "/images/slide-group-suncheon.jpg",
];

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  imageIndex?: number; // 0 or 1 to select image
}

export function PageLayout({ children, title, subtitle, imageIndex }: PageLayoutProps) {
  // title의 첫 글자 charCode를 기반으로 이미지 선택 (일관된 결과를 위해)
  const selectedIndex = imageIndex !== undefined
    ? imageIndex
    : title.charCodeAt(0) % 2;
  const backgroundImage = backgroundImages[selectedIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header Banner */}
      <div className="relative h-56 md:h-72 overflow-hidden bg-[#1a2e5a]">
        {/* Background Image with object-contain */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="페이지 배경"
            fill
            className="object-contain object-center opacity-60"
            priority
          />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e5a]/90 via-[#1a2e5a]/70 to-[#1a2e5a]/50" />

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-white/80 text-lg mt-2">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1a2e5a]">HOME</Link>
            <span className="mx-2">/</span>
            <span className="text-[#1a2e5a] font-medium">{title}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
