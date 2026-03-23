"use client";

import { executives } from "@/lib/data";
import { User, Mail, Phone, ShieldCheck, Users } from "lucide-react";

// 직책별 색상 포인트
const positionColors: Record<string, string> = {
  "회장": "bg-[#c41e3a]",
  "총무": "bg-[#1a2b4b]",
  "회계 감사": "bg-[#2e5aa7]",
  "학술": "bg-[#4a90c9]",
  "간사": "bg-gray-500",
  "전산 위원": "bg-[#6b7280]",
};

export default function ExecutivesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10">
      {/* 1. 상단 타이틀 영역 */}
      <div className="bg-[#1a2b4b] text-white py-16 mb-12 shadow-md">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">임원진 소개</h1>
          <p className="text-blue-200 text-lg font-light italic">Executives of HAM</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block p-3 bg-red-50 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-[#c41e3a]" />
          </div>
          <h2 className="text-3xl font-bold text-[#1a2b4b] mb-4">혈액투석길 연구회 임원진</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            대한혈관외과학회 혈액투석길 연구회(HAM)를 이끌어가는 <br className="hidden md:inline" />
            분야별 최고의 전문가들을 소개합니다.
          </p>
        </div>

        {/* 2. 임원진 카드 그리드 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {executives.map((executive) => (
            <div
              key={executive.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              {/* 카드 상단 배경색 */}
              <div className={`h-24 ${positionColors[executive.position] || "bg-[#1a2b4b]"} relative transition-colors`}>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">
                    {executive.image ? (
                      <img
                        src={executive.image}
                        alt={executive.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                    {executive.position}
                  </span>
                </div>
              </div>

              {/* 정보 영역 */}
              <div className="pt-16 pb-8 px-8 text-center">
                <h3 className="text-xl font-bold text-[#1a2b4b] mb-1">{executive.name}</h3>
                <p className="text-[#c41e3a] font-semibold text-sm mb-3">{executive.affiliation}</p>
                <div className="inline-block px-3 py-1 bg-gray-50 rounded-lg text-gray-500 text-xs mb-6">
                   {executive.role}
                </div>

                {/* 연락처 정보 */}
                <div className="pt-6 border-t border-gray-50 space-y-3">
                  {executive.email && (
                    <a
                      href={`mailto:${executive.email}`}
                      className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#c41e3a] transition-colors"
                    >
                      <Mail className="w-4 h-4 opacity-70" />
                      {executive.email}
                    </a>
                  )}
                  {executive.phone && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Phone className="w-4 h-4 opacity-70" />
                      {executive.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. 조직도 (Organization Chart) */}
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-blue-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#c41e3a]"></div>
          <div className="flex items-center justify-center gap-3 mb-12">
            <ShieldCheck className="w-8 h-8 text-[#1a2b4b]" />
            <h3 className="text-2xl font-bold text-[#1a2b4b]">조직 체계</h3>
          </div>
          
          <div className="flex flex-col items-center">
            {/* 회장 */}
            <div className="bg-[#c41e3a] text-white w-64 py-6 rounded-2xl text-center shadow-2xl z-10">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">President</p>
              <p className="text-xl font-black">회장 김형태</p>
            </div>

            {/* 연결선 */}
            <div className="w-1 h-12 bg-gray-200"></div>

            {/* 총무 */}
            <div className="bg-[#1a2b4b] text-white w-56 py-4 rounded-xl text-center shadow-lg mb-8">
              <p className="text-xs opacity-70 mb-1 font-bold">General Secretary</p>
              <p className="text-lg font-bold text-blue-100">총무 변승재</p>
            </div>

            {/* 부서 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                <p className="text-[#1a2b4b] font-bold text-sm mb-1">회계 감사</p>
                <p className="text-gray-600 text-xs font-medium">이순천</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                <p className="text-[#1a2b4b] font-bold text-sm mb-1">학술 위원</p>
                <p className="text-gray-600 text-xs font-medium">윤우성</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                <p className="text-[#1a2b4b] font-bold text-sm mb-1">상임 간사</p>
                <p className="text-gray-600 text-xs font-medium">김영균, 권준성, 이재훈</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                <p className="text-[#1a2b4b] font-bold text-sm mb-1">전산 위원</p>
                <p className="text-gray-600 text-xs font-medium">고진</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
