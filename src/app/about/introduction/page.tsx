import { aboutInfo } from "@/lib/data"; // 👈 데이터를 가져오는 핵심 줄입니다!
import Image from "next/image";
import { GraduationCap, FileSearch, BookOpen, Stethoscope, ClipboardList } from "lucide-react";

const activityCategories = [
  { icon: BookOpen, title: "학술 활동", items: aboutInfo.activities.academic },
  { icon: FileSearch, title: "연구 활동", items: aboutInfo.activities.research },
  { icon: GraduationCap, title: "교육 활동", items: aboutInfo.activities.education },
  { icon: ClipboardList, title: "진료 지침 개발", items: aboutInfo.activities.guidelines },
];

export default function IntroductionPage() {
  return (
    <div className="bg-gray-50 pb-20 pt-10">
      {/* 상단 타이틀 영역 */}
      <div className="bg-[#1a2b4b] text-white py-16 mb-12 shadow-md">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">연구회 소개</h1>
          <p className="text-blue-200 text-lg font-light italic">About HAM</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* 인사말 및 설립 목적 섹션 */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1 bg-blue-50 text-[#1a2b4b] text-sm font-bold rounded-full mb-6 border border-blue-100">
                Hemodialysis Access Meeting
              </div>
              <h2 className="text-3xl font-bold text-[#1a2b4b] mb-6 leading-tight">
                대한혈관외과학회<br />
                <span className="text-[#c41e3a]">혈액투석길 연구회 (HAM)</span>
              </h2>

              <div className="bg-gray-50 rounded-2xl p-8 mb-8 border-l-4 border-[#c41e3a] italic text-gray-700 leading-relaxed shadow-inner">
                "{aboutInfo.purpose}"
              </div>

              <div className="flex items-center gap-6">
                <div className="bg-[#c41e3a] text-white px-6 py-4 rounded-2xl shadow-lg">
                  <p className="text-2xl font-black tracking-tighter">HAM</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Since 2022</p>
                </div>
                <div className="text-sm font-medium text-gray-500">
                  <p>대한혈관외과학회</p>
                  <p className="text-[#1a2b4b] font-bold">공식 산하 연구회</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white group">
              <Image
                src="/slide-av-study.jpg" 
                alt="연구회 활동"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>

        {/* 주요 활동 내용 (데이터 기반) */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-[#1a2b4b] mb-10 text-center flex items-center justify-center gap-3">
            <span className="w-10 h-0.5 bg-[#c41e3a]"></span>
            연구회 주요 활동
            <span className="w-10 h-0.5 bg-[#c41e3a]"></span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-8">
            {activityCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <category.icon className="w-6 h-6 text-[#c41e3a]" />
                  <h4 className="font-bold text-xl text-[#1a2b4b]">{category.title}</h4>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-gray-600 flex items-start gap-2 text-sm leading-relaxed">
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
