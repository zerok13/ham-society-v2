import { aboutInfo } from "@/lib/data";
import Image from "next/image";
import { GraduationCap, FileSearch, Users, BookOpen, Stethoscope, ClipboardList } from "lucide-react";

const activityCategories = [
  {
    icon: BookOpen,
    title: "학술 활동",
    items: aboutInfo.activities.academic,
  },
  {
    icon: FileSearch,
    title: "연구 활동",
    items: aboutInfo.activities.research,
  },
  {
    icon: GraduationCap,
    title: "교육 활동",
    items: aboutInfo.activities.education,
  },
  {
    icon: ClipboardList,
    title: "진료 지침 개발",
    items: aboutInfo.activities.guidelines,
  },
];

export default function IntroductionPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      {/* 상단 타이틀 영역 */}
      <div className="bg-[#1a2b4b] text-white py-16 mb-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">연구회 소개</h1>
          <p className="text-blue-200 text-lg">About HAM</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* 메인 소개 카드 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1 bg-blue-50 text-[#1a2b4b] text-sm font-semibold rounded-full mb-6">
                Hemodialysis Access Meeting
              </div>
              <h2 className="text-3xl font-bold text-[#1a2b4b] mb-6 leading-tight">
                대한혈관외과학회<br />
                <span className="text-[#c41e3a]">혈액투석길 연구회 (HAM)</span>
              </h2>

              <div className="bg-blue-50/50 rounded-xl p-6 mb-8 border border-blue-100">
                <h3 className="font-bold text-[#1a2b4b] mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#c41e3a] rounded-full"></span>
                  설립 목적
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {aboutInfo.purpose}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="bg-[#c41e3a] text-white px-6 py-3 rounded-xl shadow-md">
                  <p className="text-2xl font-black">HAM</p>
                  <p className="text-xs opacity-80 uppercase tracking-tighter">Since 2022</p>
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  <p>2025년 대한혈관외과학회</p>
                  <p className="text-[#1a2b4b]">공식 연구회 승인 완료</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/slide-av-study.jpg"
                alt="HAM 단체 사진"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* 주요 활동 그리드 */}
        <div className="mb-20">
          <div className="flex flex-col items-center mb-10">
            <h3 className="text-2xl font-bold text-[#1a2b4b] mb-2">주요 활동</h3>
            <div className="w-12 h-1 bg-[#c41e3a] rounded-full"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {activityCategories.map((category) => (
              <div
                key={category.title}
                className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#1a2b4b] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-xl text-[#1a2b4b]">{category.title}</h4>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-600">
                      <span className="text-[#c41e3a] font-bold mt-0.5">•</span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 주요 프로그램 */}
        <div className="mb-20">
           <div className="flex flex-col items-center mb-10">
            <h3 className="text-2xl font-bold text-[#1a2b4b] mb-2">주요 프로그램</h3>
            <div className="w-12 h-1 bg-[#c41e3a] rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {aboutInfo.programs.map((program) => (
              <div
                key={program.title}
                className="bg-gradient-to-br from-[#1a2b4b] to-[#2e5aa7] rounded-2xl p-8 text-white shadow-lg hover:-translate-y-1 transition-transform"
              >
                <h4 className="font-bold text-xl mb-3 border-b border-white/20 pb-3">{program.title}</h4>
                <p className="text-blue-50 leading-relaxed">{program.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 안내 섹션 */}
        <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-blue-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c41e3a] via-[#1a2b4b] to-[#c41e3a]"></div>
          <Stethoscope className="w-14 h-14 mx-auto text-[#1a2b4b] mb-6 opacity-20" />
          <h3 className="text-2xl font-bold text-[#1a2b4b] mb-4">연구회 참여 안내</h3>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">
            대한혈관외과학회 회원으로서 혈액투석길 연구회 가입을 원하시는 분은<br className="hidden md:inline" />
            사무국으로 문의해 주시기 바랍니다.
          </p>
          <a
            href="/signup"
            className="inline-block bg-[#1a2b4b] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#0f1d3a] hover:shadow-2xl transform hover:-translate-y-0.5 transition-all"
          >
            회원가입 안내 보기
          </a>
        </div>
      </div>
    </div>
  );
}
