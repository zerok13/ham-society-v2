import { aboutInfo } from "@/lib/data";
import Image from "next/image";
import { GraduationCap, FileSearch, BookOpen, Stethoscope, ClipboardList, History, User } from "lucide-react";

const activityCategories = [
  { icon: BookOpen, title: "학술 활동", items: aboutInfo.activities.academic },
  { icon: FileSearch, title: "연구 활동", items: aboutInfo.activities.research },
  { icon: GraduationCap, title: "교육 활동", items: aboutInfo.activities.education },
  { icon: ClipboardList, title: "진료 지침 개발", items: aboutInfo.activities.guidelines },
];

export default function IntroductionPage() {
  return (
    <div className="bg-gray-50 pb-20 pt-10">
      {/* 1. 상단 타이틀 */}
      <div className="bg-[#1a2b4b] text-white py-16 mb-12 shadow-md">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">연구회 소개</h1>
          <p className="text-blue-200 text-lg font-light italic">About HAM</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        
        {/* 2. 회장 인사말 섹션 (Greeting) */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-12 border border-gray-100">
          <div className="flex items-center gap-3 mb-8 border-b pb-4">
            <User className="w-6 h-6 text-[#c41e3a]" />
            <h3 className="text-2xl font-bold text-[#1a2b4b]">회장 인사말</h3>
          </div>
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="bg-blue-50/50 rounded-2xl p-8 mb-6 italic text-gray-700 leading-relaxed shadow-inner border-l-4 border-[#c41e3a]">
                {/* 데이터에 있는 인사말을 불러옵니다 */}
                <p className="whitespace-pre-wrap">{aboutInfo.purpose}</p> 
              </div>
              <p className="text-right font-bold text-lg text-[#1a2b4b]">대한혈관외과학회 혈액투석길 연구회 회장</p>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-md border-4 border-white">
               <Image src="/logo.jpg" alt="회장님" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* 3. 연구회 연혁 섹션 (History) */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-12 border border-gray-100">
          <div className="flex items-center gap-3 mb-8 border-b pb-4">
            <History className="w-6 h-6 text-[#c41e3a]" />
            <h3 className="text-2xl font-bold text-[#1a2b4b]">연구회 연혁</h3>
          </div>
          <div className="space-y-6">
            {/* 연혁 데이터를 리스트로 출력합니다 */}
            <div className="relative border-l-2 border-gray-200 ml-4 pl-8 space-y-8">
              <div className="relative">
                <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[#c41e3a] border-4 border-white shadow-sm"></span>
                <h4 className="font-bold text-[#1a2b4b]">2025. 01</h4>
                <p className="text-gray-600">대한혈관외과학회 공식 산하 연구회 승인</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-gray-300 border-4 border-white shadow-sm"></span>
                <h4 className="font-bold text-[#1a2b4b]">2022. 05</h4>
                <p className="text-gray-600">혈액투석길 연구회 (HAM) 창립</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. 주요 활동 섹션 (Activities) */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8 border-b pb-4">
            <Stethoscope className="w-6 h-6 text-[#c41e3a]" />
            <h3 className="text-2xl font-bold text-[#1a2b4b]">주요 활동</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {activityCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <category.icon className="w-6 h-6 text-[#c41e3a]" />
                  <h4 className="font-bold text-xl text-[#1a2b4b]">{category.title}</h4>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-gray-600 flex items-start gap-2 text-sm">
                      <span className="text-[#c41e3a] mt-1.5 w-1 h-1 rounded-full bg-[#c41e3a] shrink-0" />
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
