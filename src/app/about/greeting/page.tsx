import { PageLayout } from "@/components/PageLayout";
import { aboutInfo } from "@/lib/data";
import Image from "next/image";
import { GraduationCap, FileSearch, Target } from "lucide-react";

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
];

export default function GreetingPage() {
  return (
    <PageLayout title="인사말" subtitle="Greeting" imageIndex={1}>
      <div className="max-w-4xl mx-auto">
        {/* President Greeting Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="md:flex">
            {/* President Photo */}
            <div className="md:w-1/3 bg-gradient-to-br from-[#1a2e5a] to-[#2e5aa7] p-8 flex flex-col items-center justify-center">
              <div className="relative w-40 h-48 rounded-lg overflow-hidden shadow-xl border-4 border-white mb-4">
                <Image
                  src="/president.jpg"
                  alt="김형태 회장"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center text-white">
                <p className="font-bold text-lg">김형태</p>
                <p className="text-sm text-white/80">회장 / 브이외과</p>
              </div>
            </div>

            {/* Greeting Content */}
            <div className="md:w-2/3 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12">
                  <Image
                    src="/logo.jpg"
                    alt="HAM 로고"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-[#c41e3a] text-sm font-medium">대한혈관외과학회</p>
                  <p className="text-[#1a2e5a] font-bold">혈액투석길 연구회 (HAM)</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#1a2e5a] mb-6">
                환영합니다
              </h2>

              <div className="prose prose-gray max-w-none">
                {aboutInfo.greeting.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed mb-4 text-sm">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-right text-[#1a2e5a] font-medium">
                  대한혈관외과학회 혈액투석길 연구회<br />
                  회장 <span className="font-bold">김형태</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div>
          <h3 className="text-xl font-bold text-[#1a2e5a] mb-6 text-center">
            연구회 목표
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.title}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#1a2e5a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <goal.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-[#1a2e5a] mb-2">{goal.title}</h4>
                <p className="text-gray-600 text-sm">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
