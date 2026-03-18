import { aboutInfo } from "@/lib/data";
import Image from "next/image";
import { History, User, Target, Award, Stethoscope, Quote } from "lucide-react";

export default function IntroductionPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10">
      {/* 1. 상단 타이틀 영역 (임원진 페이지와 통일) */}
      <div className="bg-[#1a2b4b] text-white py-16 mb-12 shadow-md">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">연구회 소개</h1>
          <p className="text-blue-200 text-lg font-light italic">About HAM (Hemodialysis Access Meeting)</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        
        {/* 2. 회장 인사말 섹션 (Greeting) */}
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
              <div className="text-gray-700 leading-relaxed text-lg space-y-4 whitespace-pre-wrap">
                {/* 데이터에 저장된 인사말 전문 노출 */}
                {aboutInfo.purpose}
              </div>
              <div className="pt-8 text-right">
                <p className="text-xl font-bold text-[#1a2b4b]">대한혈관외과학회 혈액투석길 연구회</p>
                <div className="flex items-center justify-end gap-3 mt-2">
                  <p className="text-2xl font-black text-gray-900">회장 장 상 철</p>
                  <div className="w-10 h-10 border-2 border-[#c41e3a] text-[#c41e3a] rounded-full flex items-center justify-center font-bold text-xs">
                    (인)
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                {/* 실제 사진이 있다면 /president.jpg 등으로 교체 가능합니다 */}
                <Image src="/logo.jpg" alt="회장님 사진" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. 설립 배경 및 비전 (Mission) */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#1a2b4b] p-10 rounded-3xl shadow-lg text-white">
            <Target className="w-12 h-12 mb-6 text-blue-300" />
            <h4 className="text-2xl font-bold mb-4">설립 배경</h4>
            <p className="text-blue-100 leading-relaxed">
              투석 환자의 급증과 함께 혈액투석 혈관 통로 관리의 중요성이 대두됨에 따라, 
              혈관외과 전문의들이 중심이 되어 최상의 진료 표준을 확립하고자 2022년 창립되었습니다.
            </p>
          </div>
          <div className="bg-[#c41e3a] p-10 rounded-3xl shadow-lg text-white">
            <Award className="w-12 h-12 mb-6 text-red-200" />
            <h4 className="text-2xl font-bold mb-4">연구회의 사명</h4>
            <p className="text-red-100 leading-relaxed">
              학술적 연구를 넘어 임상 현장의 지견을 공유하고, 다학제적 접근을 통해 
              투석 환자들에게 보다 안전하고 지속 가능한 혈액투석 통로를 제공하는 것을 목표로 합니다.
            </p>
          </div>
        </div>

        {/* 4. 주요 연혁 (History Timeline) */}
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
                <h4 className="text-xl font-bold text-[#1a2b4b] mb-2">2022. 05</h4>
                <p className="text-gray-800 font-bold">혈액투석길 연구회 (HAM) 창립총회</p>
                <p className="text-gray-500 text-sm mt-1">초대 회장 장상철 선출 및 창립 기념 학술대회 개최</p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-gray-200 border-4 border-white shadow-md"></span>
              <div className="bg-gray-50 rounded-2xl p-6 shadow-sm opacity-80">
                <h4 className="text-xl font-bold text-gray-400 mb-2">2022 ~ 현재</h4>
                <p className="text-gray-800">매년 하계 및 동계 정기 학술대회 개최</p>
                <p className="text-gray-500 text-sm mt-1">혈액투석 접근로 관련 진료 지침 연구 및 회원 교육 진행</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. 하단 버튼 */}
        <div className="text-center">
          <a
            href="/about/executives"
            className="inline-flex items-center gap-2 bg-[#1a2b4b] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#0f1d3a] transition-all shadow-xl hover:-translate-y-1"
          >
            임원진 소개 보기
          </a>
        </div>

      </div>
    </div>
  );
}
