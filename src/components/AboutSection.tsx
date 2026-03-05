"use client";

import Image from "next/image";
import { GraduationCap, FileSearch, Users, Target } from "lucide-react";

const goals = [
  {
    icon: GraduationCap,
    title: "교육",
    description: "투석혈관질환에 대한 이해도를 증진시킵니다",
  },
  {
    icon: FileSearch,
    title: "의학정보제공",
    description: "최신 의료정보를 제공해 드립니다",
  },
  {
    icon: Target,
    title: "연구",
    description: "공동 연구의 기틀을 만들어 갑니다",
  },
  {
    icon: Users,
    title: "협력",
    description: "혈관외과 전문의들의 네트워크를 구축합니다",
  },
];

export function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative animate-slideInLeft">
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-xl bg-[#1a2e5a]">
              <Image
                src="/images/slide-panel.jpg"
                alt="HAM 학술 활동"
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e5a]/60 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#c41e3a] text-white p-4 rounded-lg shadow-lg hidden md:block">
              <p className="text-2xl font-bold">HAM</p>
              <p className="text-xs">Since 2022</p>
            </div>
          </div>

          {/* Content */}
          <div className="animate-slideInRight">
            <div className="inline-block px-3 py-1 bg-[#1a2e5a]/10 text-[#1a2e5a] text-sm font-medium rounded-full mb-4">
              About HAM
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a2e5a] mb-4">
              혈액투석길 연구회를 소개합니다
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              대한혈관외과학회 투석길 연구회는 대한혈관외과학회 산하의 순수 의학 연구 단체로서,
              AV access에 대한 학술 연구와 회의를 원하는 혈관외과 전문의로 구성되어 있습니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              투석 환자의 혈관 접근로(Vascular Access)에 관한 연구와 임상 경험을 공유하고,
              관련 분야의 발전을 도모하기 위해 설립되었습니다.
            </p>

            {/* Goals Grid */}
            <div className="grid grid-cols-2 gap-4">
              {goals.map((goal) => (
                <div
                  key={goal.title}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-[#1a2e5a]/5 transition-colors"
                >
                  <div className="p-2 bg-[#1a2e5a] rounded-lg">
                    <goal.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a2e5a] text-sm">
                      {goal.title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {goal.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
