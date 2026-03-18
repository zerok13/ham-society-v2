import { aboutInfo } from "@/lib/data";
import Image from "next/image";
import { GraduationCap, FileSearch, BookOpen, Stethoscope, ClipboardList, History, User, Target, Award } from "lucide-react";

const activityCategories = [
  { icon: BookOpen, title: "학술 활동", items: aboutInfo.activities.academic },
  { icon: FileSearch, title: "연구 활동", items: aboutInfo.activities.research },
  { icon: GraduationCap, title: "교육 활동", items: aboutInfo.activities.education },
  { icon: ClipboardList, title: "진료 지침 개발", items: aboutInfo.activities.guidelines },
];

export default function IntroductionPage() {
  return (
    <div className="bg-gray-50 pb-20 pt-10">
      {/* 1. 상단 메인 배너 */}
      <div className="bg-[#1a2b4b] text-white py-20 mb-12 shadow-inner relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">연구회 소개</h1>
          <p className="text-blue-200 text-xl font-light italic">About Hemodialysis Access Meeting (HAM)</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        
        {/* 2. 회장 인사말 (Greeting) - 전문 수록 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 border border-gray-100">
          <div className="flex items-center gap-4 mb-10 border-b pb-6">
            <div className="p-3 bg-red-50 rounded-2xl">
              <User className="w-8 h-8 text-[#c41e3a]" />
            </div>
            <h3 className="text-3xl font-bold text-[#1a2b4b]">회장 인사말</h3>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-2xl font-bold text-gray-800 leading-snug">
                "투석 환자의 생명선인 혈액투석길,<br /> 그 최선의 길을 함께 고민하겠습니다."
              </h4>
              <div className="text-gray-700 leading-relaxed text-lg space-y-4 whitespace-pre-wrap">
                {/* 데이터에 저장된 인사말 전문을 불러옵니다 */}
                {aboutInfo.purpose}
              </div>
              <div className="pt-8 text-right">
                <p className="text-xl font-bold text-[#1a2b4b]">대한혈관외과학회 혈액투석길 연구회</p>
                <p className="text-2xl font-black text-gray-900 mt-2">회장 장 상 철 <span className="text-sm font-normal text-gray-500">(인)</span></p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#1a2b4b] to-[#c41e3a] rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image src="/logo.jpg" alt="회장님 사진" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. 설립 배경 및 미션 (Mission & Vision) */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 text-white">
          <div className="bg-[#1a2b4b] p-10 rounded-3xl shadow-lg flex flex-col justify-between">
            <Target className="w-12 h-12 mb-6 opacity-50" />
            <div>
              <h4 className="text-2xl font-bold mb-4">설립 배경</h4>
              <p className="text-blue-100 leading-relaxed">
                급증하는 혈액투석 환자들의 삶의 질 향상을 위해 투석 통로의 전문적인 관리와 연구가 절실해짐에 따라, 2022년 혈관외과 전문의들이 뜻을 모아 창립하였습니다.
              </p>
            </div>
          </div>
          <div className="bg-[#c41e3a] p-10 rounded-3xl shadow-lg flex flex-col justify-between">
            <Award className="w-12 h-12 mb-6 opacity-50" />
            <div>
              <h4 className="text-2xl font-bold mb-4">핵심 가치</h4>
              <p className="text-red-100 leading-relaxed">
                최신 지견의 공유, 다학제적 접근, 표준화된 진료 지침 확립을 통해 환자에게 안전하고 오래 지속되는 투석 혈관 서비스를 제공하는 것을 최우선으로 합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 4. 연구회 연혁 (Full Timeline) */}
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
              <div className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-[#c41e3a] mb-2">2025. 01</h4>
                <p className="text-gray-800 font-semibold">대한혈관외과학회 공식 산하 연구회 승인 및 등록</p>
                <p className="text-gray-500 text-sm mt-1">혈관외과 전문 학술 단체로서의 위상 정립</p>
              </div>
            </div>
            
            <div className="relative">
              <span className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-[#1a2b4b] border-4 border-white shadow-md"></span>
              <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
                <h4 className="text-xl font-bold text-[#1a2b4b] mb-2">2022. 05</h4>
                <p className="text-gray-800 font-semibold">혈액투석길 연구회 (HAM) 발기인 대화 및 창립 총회</p>
                <p className="text-gray-500 text-sm mt-1">초대 회장 장상철 선출 및 운영위원회 구성</p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-gray-200 border-4 border-white shadow-md"></span>
              <div className="bg-gray-50 rounded-2xl p-6 shadow-sm opacity-80">
                <h4 className="text-xl font-bold text-gray-500 mb-2">2022 ~ 현재</h4>
                <p className="text-gray-800">정기 학술대회(하계/동계) 및 심포지엄 매년 개최</p>
                <p className="text-gray-500 text-sm mt-1">전국 단위 회원 확보 및 학술지 발간 준비</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. 주요 활동 (Activities) */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-[#1a2b4b] mb-12 text-center flex items-center justify-center gap-4">
            <span className="w-12 h-1 bg-[#c41e3a] rounded-full"></span>
            활동 영역
            <span className="w-12 h-1 bg-[#c41e3a] rounded-full"></span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-8">
            {activityCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <category.icon className="w-7 h-7 text-[#c41e3a]" />
                  </div>
                  <h4 className="font-bold text-2xl text-[#1a2b4b]">{category.title}</h4>
                </div>
                <ul className="space-y-4">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-gray-600 flex items-start gap-3 text-base leading-relaxed">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#c41e3a] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
