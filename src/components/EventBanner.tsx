"use client";

import Link from "next/link";
import { Calendar, MapPin, Clock, ClipboardList } from "lucide-react";

export function EventBanner() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-[#1a2e5a] via-[#2e5aa7] to-[#4a90c9]">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left - Event Info (클릭 → 행사 상세) */}
            <Link href="/events/conference/11" className="group text-center md:text-left flex-1 min-w-0">
              <div className="inline-block px-3 py-1 bg-[#c41e3a] text-white text-xs font-bold rounded-full mb-2">
                제11회 심포지엄 · 사전 공지
              </div>
              <h3 className="text-white text-xl md:text-2xl font-bold mb-1 group-hover:underline underline-offset-2">
                대한혈관외과학회 혈액투석길 심포지엄
              </h3>
              <p className="text-white/80 text-sm">
                The 11th KSVS Hemodialysis Access Meeting (HAM)
              </p>
            </Link>

            {/* Center - Date & Location */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>2026년 10월 18일 (일)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>8:55 ~ 17:00</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>세종충남대학교 병원 4층 도담홀</span>
              </div>
            </div>

            {/* Right - 사전등록 버튼 */}
            <Link
              href="/events/register"
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-[#c41e3a] hover:bg-[#a01830] text-white font-bold text-sm rounded-xl shadow-lg transition-all hover:scale-105 whitespace-nowrap"
            >
              <ClipboardList className="w-4 h-4" />
              사전등록
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
