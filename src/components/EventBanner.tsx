"use client";

import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";

export function EventBanner() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <Link href="/events/conference/11" className="block group">
          <div className="relative w-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#1a2e5a] via-[#2e5aa7] to-[#4a90c9]">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left - Event Info */}
              <div className="text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-[#c41e3a] text-white text-xs font-bold rounded-full mb-2">
                  제11회 학술대회 · 사전 공지
                </div>
                <h3 className="text-white text-xl md:text-2xl font-bold mb-1">
                  대한혈관외과학회 혈액투석길 연구회
                </h3>
                <p className="text-white/80 text-sm">
                  The 11th KSVS Hemodialysis Access Meeting (HAM)
                </p>
              </div>

              {/* Right - Date & Location */}
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>2026년 10월 18일 (일)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>8:55 ~ 17:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>세종충남대학교 병원 4층 도담홀</span>
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="hidden lg:flex items-center justify-center w-10 h-10 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
