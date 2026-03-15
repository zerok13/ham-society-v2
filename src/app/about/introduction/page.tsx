import { aboutInfo } from "@/lib/data";
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
    <div className="bg-gray-50 pb-20">
      {/* 상단 타이틀 영역 */}
      <div className="bg-[#1a2b4b] text-white py-16 mb-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">연구회 소개</h1>
          <p className="text-blue-200 text-lg">About HAM</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
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
                <p className="text-gray-700 leading-relaxed">{aboutInfo.purpose}</p>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image src="/slide-av-study.jpg" alt="HAM" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
