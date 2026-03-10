import { PageLayout } from "@/components/PageLayout";
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
    <PageLayout title="연구회 소개" subtitle="About HAM" imageIndex={0}>
      <div className="max-w-6xl mx-auto">
        {/* Main Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-[#1a2e5a]/10 text-[#1a2e5a] text-sm font-medium rounded-full mb-4">
                Hemodialysis Access Meeting
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a2e5a] mb-4">
                대한혈관외과학회<br />
                <span className="text-[#c41e3a]">혈액투석길 연구회 (HAM)</span>
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-[#1a2e5a] mb-2">설립 목적</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {aboutInfo.purpose}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-[#c41e3a] text-white px-4 py-2 rounded-lg">
                  <p className="text-2xl font-bold">HAM</p>
                  <p className="text-xs">Since 2022</p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>2025년 대한혈관외과학회</p>
                  <p>공식 연구회 승인</p>
                </div>
              </div>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden bg-[#1a2e5a]">
              <Image
                src="/slide-av-study.jpg"
                alt="HAM 단체 사진"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-[#1a2e5a] mb-6 text-center">
            주요 활동
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {activityCategories.map((category) => (
              <div
                key={category.title}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1a2e5a] to-[#2e5aa7] rounded-lg flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-[#1a2e5a]">{category.title}</h4>
                </div>
                <ul className="space-y-2">
                  {category.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#c41e3a] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Programs */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-[#1a2e5a] mb-6 text-center">
            주요 프로그램
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {aboutInfo.programs.map((program) => (
              <div
                key={program.title}
                className="bg-gradient-to-br from-[#1a2e5a] to-[#2e5aa7] rounded-xl p-6 text-white"
              >
                <h4 className="font-bold text-lg mb-2">{program.title}</h4>
                <p className="text-white/80 text-sm">{program.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Stethoscope className="w-10 h-10 mx-auto text-[#1a2e5a] mb-4" />
          <h3 className="text-xl font-bold text-[#1a2e5a] mb-4">연구회 참여 안내</h3>
          <p className="text-gray-600 mb-6">
            대한혈관외과학회 회원으로서 혈액투석길 연구회 가입을 원하시는 분은<br className="hidden md:inline" />
            사무국으로 문의해 주시기 바랍니다.
          </p>
          <a
            href="/members/join"
            className="inline-block bg-[#1a2e5a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0f1d3a] transition-colors"
          >
            회원가입 안내 보기
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
