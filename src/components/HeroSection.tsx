"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";

// HAM 학술대회 슬라이드 이미지
const bannerImages = [
  {
    src: "/slide-panel.jpg",
    alt: "좌장 패널 세션 - 학술대회 토론",
  },
  {
    src: "/slide-av-study.jpg",
    alt: "제1회 AV Access 연구회 단체사진",
  },
  {
    src: "/slide-group-winter.jpg",
    alt: "혈액투석길 연구회 동계 학술대회 단체사진",
  },
  {
    src: "/slide-group-suncheon.jpg",
    alt: "2023년 순천 학술대회 단체사진",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 3초마다 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <section className="relative w-full h-[450px] md:h-[550px] overflow-hidden bg-[#1a2e5a]">
      {/* Background Slider */}
      <div className="absolute inset-0 flex items-center justify-center">
        {bannerImages.map((img, index) => (
          <div
            key={img.src}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-contain"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e5a]/95 via-[#1a2e5a]/60 to-[#1a2e5a]/30" />
          </div>
        ))}
      </div>

      {/* Slider Controls */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
        aria-label="이전 슬라이드"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
        aria-label="다음 슬라이드"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {bannerImages.map((img, index) => (
          <button
            key={`indicator-${img.src}`}
            type="button"
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`슬라이드 ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl animate-fadeIn">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 leading-tight">
            대한혈관외과학회
            <br />
            <span className="text-[#4a90c9]">혈액투석길 연구회</span>
          </h1>
          <p className="text-white/90 text-lg md:text-2xl font-light mb-6">
            Hemodialysis Access Meeting (HAM)
          </p>

          {/* Info Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 md:p-6 shadow-xl max-w-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Logo size="sm" />
              </div>
              <div>
                <p className="text-[#1a2e5a] font-semibold mb-1 text-sm">
                  대한혈관외과학회 혈액투석길 연구회 (HAM)
                </p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  투석 환자의 혈관 접근로(Vascular Access)에 관한 연구와 임상 경험을 공유하고,
                  관련 분야의 발전을 도모하기 위해 설립된 대한혈관외과학회 산하 학술 단체입니다.
                </p>
                <Link
                  href="/about/introduction"
                  className="inline-block mt-2 text-[#c41e3a] text-xs font-medium hover:underline"
                >
                  + 자세히보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
