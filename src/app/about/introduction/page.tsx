"use client";

import { aboutInfo } from "@/lib/data";
import Image from "next/image";
import { History, User, Target, Award, Stethoscope, Quote, BookOpen, FileSearch, GraduationCap, ClipboardList } from "lucide-react";

export default function IntroductionPage() {
  // 활동 카테고리 아이콘 매핑
  const activityIcons = {
    academic: BookOpen,
    research: FileSearch,
    education: GraduationCap,
    guidelines: ClipboardList,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10">
      {/* 1. 상단 타이틀 영역 */}
      <div className="bg-[#1a2b4b] text-white py-16 mb-12 shadow-md">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">연구회 소개</h1>
          <p className="text-blue-200 text-lg font-light italic">About HAM (Hemodialysis Access Meeting)</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        
        {/* 2. 회장 인사말 섹션 (data.ts의 greeting 전문 반영) */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Quote size={120} className="text-[#1a2b4b]" />
          </div>
          
          <div className="flex items-center gap-4 mb-10 border-b pb-6">
            <div className="p-3 bg-red-50 rounded-2xl">
              <User className="w-8 h-8 text-[#c41e3a]" />
            </div>
            <h3 className="text-3xl font-bold text-[#1a2b4b]">회장 인사말</h3>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-2xl font-bold text-gray-800 leading-snug">
                "투석 환자의 생명선인 혈액투석길,<br /> 그 최선의 길을 위해 함께 정진하겠습니다."
              </h4>
              <div className="text-gray-700 leading-relaxed text-lg space-y-4 whitespace-pre-wrap font-medium">
                {/* 💡 data.ts의 greeting 전문 출력 */}
                {aboutInfo.greeting}
              </div>
              <div className="pt-8 text-right">
                <p className="text-xl font-bold text-[#1a2b4b]">대한혈관외과학회 혈액투석길 연구회</p>
                <div className="flex items-center justify-end gap-3 mt-2">
                  <p className="text-2xl font-black text-gray-900 underline decoration-[#c41e3a] decoration-4 underline-offset-8">
                    회장 김 형 태
                  </p>
                  <div className="w-12 h-12 border-2 border-[#c41e3a] text-[#c41e3a] rounded-full flex items-center justify-center font-bold text-sm bg-red-50">
                    (인)
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image src="/logo.jpg" alt="회장 김형태 원장님" fill className="object-cover" />
              </div>
              <p className="text-center mt-4 text-gray-500 text-sm font-medium">제2대 회장 김형태</p>
            </div>
          </div>
        </div>

        {/* 3. 설립 목적 (data.ts의 purpose 반영) */}
        <div className="bg-[#1a2b4b] p-10 rounded-3xl shadow-lg text-white mb-16 flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 p-4 bg-white/10 rounded-2xl">
            <Target className="w-12 h-12 text-blue-300" />
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-4">설립 목적</h4>
            <p className="text-blue-100 leading-relaxed text-lg">
              {aboutInfo.purpose}
            </p>
          </div>
        </div>

        {/* 4. 주요 활동 (data.ts의 activities 4종 전체 반영) */}
        <div className="mb-16">
          <div className="flex flex-col items-center mb-12">
            <h3 className="text-3xl font-bold text-[#1a2b4b] mb-2">주요 활동 영역</h3>
            <div className="w-16 h-1 bg-[#c41e3a] rounded-full"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {/* 학술 활동 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#1a2b4b]" />
                </div>
                <h4 className="font-bold text-xl text-[#1a2b4b]">학술 활동</h4>
              </div>
              <ul className="space-y-3">
                {aboutInfo.activities.academic.map((item, i) => (
                  <li key={i} className="text-gray-600 flex items-start gap-2 text-sm leading-relaxed">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#c41e3a] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 연구 활동 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileSearch className="w-6 h-6 text-[#1a2b4b]" />
                </div>
                <h4 className="font-bold text-xl text-[#1a2b4b]">연구 활동</h4>
              </div>
              <ul className="space-y-3">
                {aboutInfo.activities.research.map((item, i) => (
                  <li key={i} className="text-gray-600 flex items-start gap-2 text-sm leading-relaxed">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#c41e3a] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 교육 활동 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#1a2b4b]" />
                </div>
                <h4 className="font-bold text-xl text-[#1a2b4b]">교육 활동</h4>
              </div>
              <ul className="space-y-3">
                {aboutInfo.activities.education.map((item, i) => (
                  <li key={i} className="text-gray-600 flex items-start gap-2 text-sm leading-relaxed">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#c41e3a] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 진료 지침 개발 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-[#1a2b4b]" />
                </div>
                <h4 className="font-bold text-xl text-[#1a2b4b]">진료 지침 개발</h4>
              </div>
              <ul className="space-y-3">
                {aboutInfo.activities.guidelines.map((item, i) => (
                  <li key={i} className="text-gray-600 flex items-start gap-2 text-sm leading-relaxed">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#c41e3a] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 5. 주요 연혁 (History) */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 border border-gray-100">
          <div className="flex items-center gap-4 mb-12 border-b pb-6">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <History className="w-8 h-8 text-[#1a2b4b]" />
            </div>
            <h3 className="text-3xl font-bold text-[#1a2b4b]">주요 연혁</h3>
          </div>
          
          <div className="relative border-l-4 border-gray-100 ml-6 pl-10 space-y-12">
            <div className="relative">
              <span className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-[#c41e3a] border-4 border-white shadow-md"></span>
              <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
                <h4 className="text-xl font-bold text-[#c41e3a] mb-2">2025. 01</h4>
                <p className="text-gray-800 font-bold">대한혈관외과학회 공식 산하 연구회 승인</p>
                <p className="text-gray-500 text-sm mt-1">혈관외과 분과 내 전문 학술 연구 단체로 등록 완료</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-[#1a2b4b] border-4 border-white shadow-md"></span>
              <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
                <h4 className="text-xl font-bold text-[#1a2b4b] mb-2">2022. 09</h4>
                <p className="text-gray-800 font-bold">혈액투석길 연구회 (HAM) 창립총회</p>
                <p className="text-gray-500 text-sm mt-1">초대 회장 선출 및 창립 기념 제1회 정기 학술대회 개최</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
