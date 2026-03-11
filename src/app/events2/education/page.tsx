import { PageLayout } from "@/components/PageLayout";
import { GraduationCap, Calendar, Clock, Users, BookOpen, Award } from "lucide-react";

const educationPrograms = [
  {
    id: 1,
    title: "AV Fistula 수술 실습 워크샵",
    description: "투석용 동정맥루 수술의 기본 술기를 배우는 실습 중심 교육 프로그램입니다.",
    duration: "1일 (8시간)",
    target: "혈관외과 전문의, 전공의",
    credits: "8학점",
    status: "예정",
    date: "2026년 상반기",
  },
  {
    id: 2,
    title: "투석혈관 중재시술 과정",
    description: "투석 혈관의 협착 및 폐색에 대한 중재시술 기법을 배우는 교육 과정입니다.",
    duration: "2일 (16시간)",
    target: "혈관외과 전문의",
    credits: "16학점",
    status: "예정",
    date: "2026년 하반기",
  },
  {
    id: 3,
    title: "Vascular Access 관리 세미나",
    description: "투석 환자의 혈관 접근로 관리에 대한 최신 지견을 공유하는 세미나입니다.",
    duration: "반일 (4시간)",
    target: "의료진 전체",
    credits: "4학점",
    status: "예정",
    date: "정기 학술대회 내 진행",
  },
];

const benefits = [
  "최신 술기 및 지식 습득",
  "현장 실습 경험",
  "전문가 네트워크 구축",
  "평점 취득 기회",
];

export default function EducationPage() {
  return (
    <PageLayout title="연수교육" subtitle="Education Programs" imageIndex={1}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1a2e5a] to-[#2e5aa7] rounded-xl p-8 mb-12 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">HAM 연수교육 프로그램</h2>
              <p className="text-white/80">
                혈액투석길 연구회는 투석 혈관 접근로에 관한 전문 교육 프로그램을 운영합니다.
                정기 학술대회와 함께 다양한 워크샵 및 세미나를 통해 최신 지식과 술기를 습득할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Education Programs */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#1a2e5a] mb-6">교육 프로그램 안내</h2>
          <div className="space-y-6">
            {educationPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="md:w-2/3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                        program.status === "예정" ? "bg-[#2e5aa7]/10 text-[#2e5aa7]" : "bg-gray-100 text-gray-600"
                      }`}>
                        {program.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1a2e5a] mb-2">{program.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{program.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {program.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {program.target}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {program.credits}
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/3 md:text-right">
                    <div className="inline-block bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-[#1a2e5a] mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{program.date}</span>
                      </div>
                      <button
                        type="button"
                        className="mt-3 w-full md:w-auto px-4 py-2 bg-[#1a2e5a] text-white rounded-lg text-sm font-medium hover:bg-[#0f1d3a] transition-colors"
                      >
                        자세히 보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-[#1a2e5a] mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#c41e3a]" />
              교육 참여 혜택
            </h3>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-gray-600">
                  <div className="w-2 h-2 bg-[#c41e3a] rounded-full" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-[#1a2e5a] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2e5aa7]" />
              참가 안내
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              연수교육 프로그램은 HAM 회원을 대상으로 진행됩니다.
              비회원의 경우 별도 문의가 필요합니다.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              교육 일정 및 참가 신청은 공지사항을 통해 안내됩니다.
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-4">
            교육 프로그램 관련 문의사항이 있으시면 사무국으로 연락 주시기 바랍니다.
          </p>
          <p className="text-[#1a2e5a] font-medium">
            이메일: zerok13@gmail.com | 전화: 010-2688-5625
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
