"use client";

import { PageLayout } from "@/components/PageLayout";
import { FileSearch, Download, Calendar, BookOpen } from "lucide-react";
import { useState } from "react";

const allMaterials = [
  {
    id: 1,
    title: "투석 혈관 접근로 최신 연구 동향",
    author: "연구위원회",
    date: "2025.12.15",
    type: "연구논문",
    downloads: 34,
  },
  {
    id: 2,
    title: "AV Fistula 장기 성적 분석",
    author: "학술위원회",
    date: "2025.10.20",
    type: "연구논문",
    downloads: 67,
  },
  {
    id: 3,
    title: "투석혈관 중재시술 가이드라인",
    author: "연구위원회",
    date: "2025.08.10",
    type: "가이드라인",
    downloads: 112,
  },
  {
    id: 4,
    title: "Vascular Access 관리 프로토콜",
    author: "교육위원회",
    date: "2025.05.15",
    type: "프로토콜",
    downloads: 89,
  },
  {
    id: 5,
    title: "AVF/AVG 합병증 관리 지침",
    author: "연구위원회",
    date: "2024.12.08",
    type: "가이드라인",
    downloads: 145,
  },
  {
    id: 6,
    title: "국내 투석혈관 현황 다기관 공동연구",
    author: "HAM 공동 연구팀",
    date: "2024.06.30",
    type: "다기관 공동연구",
    downloads: 210,
  },
];

const filterTypes = ["전체", "연구논문", "가이드라인", "프로토콜", "다기관 공동연구"];

export default function ResearchPage() {
  const [activeFilter, setActiveFilter] = useState("전체");

  const filteredMaterials = activeFilter === "전체"
    ? allMaterials
    : allMaterials.filter((item) => item.type === activeFilter);

  return (
    <PageLayout title="연구자료실" subtitle="Research Materials" imageIndex={0}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2e5aa7] to-[#4a90c9] rounded-xl p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-2">연구 자료</h2>
          <p className="text-white/80 text-sm">
            AV Access 관련 연구논문, 가이드라인, 프로토콜, 다기관 공동연구 자료 등을 제공합니다.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === type
                  ? "bg-[#1a2e5a] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {type}
            </button>
          ))}
        </div>

        {/* Resource List */}
        <div className="space-y-4">
          {filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-[#2e5aa7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-[#2e5aa7]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        item.type === "연구논문" ? "bg-[#1a2e5a]/10 text-[#1a2e5a]" :
                        item.type === "가이드라인" ? "bg-[#c41e3a]/10 text-[#c41e3a]" :
                        item.type === "다기관 공동연구" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1a2e5a] mb-2">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileSearch className="w-4 h-4" />
                        {item.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {item.downloads}회 다운로드
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-[#2e5aa7] text-white rounded-lg text-sm font-medium hover:bg-[#1a4a97] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">다운로드</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
          <p>연구자료 다운로드는 회원 로그인 후 가능합니다.</p>
        </div>
      </div>
    </PageLayout>
  );
}
