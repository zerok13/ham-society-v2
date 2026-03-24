import { aboutInfo } from "@/lib/data";
import Image from "next/image";
import { Quote, User } from "lucide-react";

export default function GreetingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10">
      {/* 상단 타이틀 */}
      <div className="bg-[#1a2b4b] text-white py-16 mb-12 shadow-md">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">회장 인사말</h1>
          <p className="text-blue-200 text-lg font-light italic">Greeting from the President</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* 인사말 카드 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-10 border border-gray-100 relative overflow-hidden">
          {/* 배경 장식 따옴표 */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Quote size={150} className="text-[#1a2b4b]" />
          </div>

          <div className="flex items-center gap-4 mb-10 border-b pb-6">
            <div className="p-3 bg-red-50 rounded-2xl">
              <User className="w-8 h-8 text-[#c41e3a]" />
            </div>
            <h3 className="text-3xl font-bold text-[#1a2b4b]">회장 인사말</h3>
          </div>

          {/* 사진 + 텍스트 레이아웃 */}
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* 왼쪽: 인사말 텍스트 */}
            <div className="flex-1 space-y-6">
              <h4 className="text-2xl font-bold text-gray-800 leading-snug">
                &ldquo;투석 환자의 생명선인 혈액투석길,<br /> 그 최선의 길을 위해 함께 정진하겠습니다.&rdquo;
              </h4>

              <div className="text-gray-700 leading-relaxed text-base space-y-4">
                <p>안녕하십니까?</p>
                <p>
                  대한혈관외과학회 혈액투석길 연구회(HAM) 홈페이지를 방문해 주신 여러분을 진심으로 환영합니다.
                </p>
                <p>
                  우리 연구회는 혈액투석 환자들에게는 '생명선'과도 같은 혈관 통로의 조성과 관리, 그리고 합병증 치료에 매진하는 전문가들의 모임입니다. 최근 고령화와 만성 질환의 증가로 투석 환자가 급증함에 따라 혈액투석로 관리의 중요성은 그 어느 때보다 높아지고 있습니다.
                </p>
                <p>
                  본 연구회는 창립 이후 학술적 연구뿐만 아니라 임상 현장에서의 풍부한 경험을 공유하며, 다학제적 접근을 통해 환자들에게 가장 안전하고 지속 가능한 투석 환경을 제공하기 위해 노력해 왔습니다.
                </p>
                <p>
                  앞으로도 회원 여러분과 함께 최신 지견을 나누고 국내 혈액투석로 진료 표준을 선도해 나가는 연구회가 되도록 최선을 다하겠습니다.
                </p>
                <p>여러분의 지속적인 관심과 성원을 부탁드립니다. 감사합니다.</p>
              </div>

              <div className="pt-8 text-right border-t">
                <p className="text-lg font-bold text-[#1a2b4b]">대한혈관외과학회 혈액투석길 연구회</p>
                <p className="text-2xl font-black text-gray-900 mt-2">회장 김형태</p>
              </div>
            </div>

            {/* 오른쪽: 회장 사진 */}
            <div className="w-full lg:w-60 flex-shrink-0">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/president.jpg"
                  alt="회장 김형태"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center mt-4 font-bold text-gray-700 text-lg">회장 김형태</p>
              <p className="text-center text-sm text-gray-500">브이외과</p>
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 버튼 */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/about/introduction"
            className="inline-flex items-center gap-2 bg-gray-100 text-[#1a2b4b] px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all"
          >
            연구회 소개
          </a>
          <a
            href="/about/executives"
            className="inline-flex items-center gap-2 bg-[#1a2b4b] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#0f1d3a] transition-all shadow-lg"
          >
            임원진 소개
          </a>
        </div>
      </div>
    </div>
  );
}
