import { aboutInfo } from "@/lib/data";
import Image from "next/image";
import { History, User, Target, Award, Stethoscope, Quote } from "lucide-react";

export default function IntroductionPage() {
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
          
          {/* 사진 우측 배치를 위해 flex-row 구조 사용 */}
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* 왼쪽: 인사말 텍스트 (비중 확장) */}
            <div className="flex-1 space-y-6">
              <h4 className="text-2xl font-bold text-gray-800 leading-snug">
                "투석 환자의 생명선인 혈액투석길,<br /> 그 최선의 길을 위해 함께 정진하겠습니다."
              </h4>
              <div className="text-gray-700 leading-relaxed text-lg space-y-4 whitespace-pre-wrap">
                안녕하십니까?
                {"\n\n"}
                대한혈관외과학회 혈액투석길 연구회(HAM) 홈페이지를 방문해 주신 여러분을 진심으로 환영합니다.
                {"\n\n"}
                우리 연구회는 혈액투석 환자들에게는 '생명선'과도 같은 혈관 통로의 조성과 관리, 그리고 합병증 치료에 매진하는 전문가들의 모임입니다. 최근 고령화와 만성 질환의 증가로 투석 환자가 급증함에 따라 혈액투석로 관리의 중요성은 그 어느 때보다 높아지고 있습니다.
                {"\n\n"}
                본 연구회는 창립 이후 학술적 연구뿐만 아니라 임상 현장에서의 풍부한 경험을 공유하며, 다학제적 접근을 통해 환자들에게 가장 안전하고 지속 가능한 투석 환경을 제공하기 위해 노력해 왔습니다. 앞으로도 회원 여러분과 함께 최신 지견을 나누고 국내 혈액투석로 진료 표준을 선도해 나가는 연구회가 되도록 최선을 다하겠습니다.
                {"\n\n"}
                여러분의 지속적인 관심과 성원을 부탁드립니다. 감사합니다.
              </div>
              <div className="pt-8 text-right">
                <p className="text-xl font-bold text-[#1a2b4b]">대한혈관외과학회 혈액투석길 연구회</p>
                <div className="flex items-center justify-end gap-3 mt-2">
                  <p className="text-2xl font-black text-gray-900">회장 김형태</p>
                </div>
              </div>
            </div>

            {/* 오른쪽: 회장님 사진 (너비를 1/4 수준인 w-64로 제한) */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image src="/president.jpg" alt="회장 김형태" fill className="object-cover" />
              </div>
              <p className="text-center mt-4 font-bold text-gray-700 text-lg">회장 김형태</p>
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
