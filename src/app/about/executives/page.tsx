import { PageLayout } from "@/components/PageLayout";
import { executives } from "@/lib/data";
import { User, Mail, Phone } from "lucide-react";

const positionColors: Record<string, string> = {
  "회장": "bg-[#c41e3a]",
  "총무": "bg-[#1a2e5a]",
  "회계 감사": "bg-[#2e5aa7]",
  "학술": "bg-[#4a90c9]",
  "간사1": "bg-gray-500",
  "간사2": "bg-gray-500",
  "간사3": "bg-gray-500",
  "전산 위원": "bg-[#6b7280]",
};

export default function ExecutivesPage() {
  return (
    <PageLayout title="임원진" subtitle="Executives" imageIndex={1}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#1a2e5a] mb-2">
            혈액투석길 연구회 임원진
          </h2>
          <p className="text-gray-600">
            HAM을 이끌어가는 전문가들을 소개합니다
          </p>
        </div>

        {/* Executives Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {executives.map((executive) => (
            <div
              key={executive.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Header with gradient */}
              <div className={`h-20 ${positionColors[executive.position] || "bg-[#1a2e5a]"} relative`}>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    {executive.image ? (
                      <img
                        src={executive.image}
                        alt={executive.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-[#1a2e5a]" />
                    )}
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded">
                    {executive.position}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="pt-12 pb-6 px-6 text-center">
                <h3 className="text-lg font-bold text-[#1a2e5a]">{executive.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{executive.affiliation}</p>
                <p className="text-gray-400 text-xs mt-1">{executive.role}</p>

                {/* Contact Info */}
                <div className="mt-4 pt-4 border-t space-y-2">
                  {executive.email && (
                    <a
                      href={`mailto:${executive.email}`}
                      className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-[#1a2e5a] transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                      {executive.email}
                    </a>
                  )}
                  {executive.phone && (
                    <a
                      href={`tel:${executive.phone}`}
                      className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-[#1a2e5a] transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      {executive.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Organization Chart */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-[#1a2e5a] mb-6 text-center">조직도</h3>
          <div className="flex flex-col items-center">
            {/* President */}
            <div className="bg-[#c41e3a] text-white px-8 py-4 rounded-lg text-center mb-4 shadow-lg">
              <p className="font-bold">회장</p>
              <p className="text-sm opacity-80">김형태</p>
            </div>

            {/* Line */}
            <div className="w-0.5 h-8 bg-[#1a2e5a]" />

            {/* Vice */}
            <div className="bg-[#1a2e5a] text-white px-6 py-3 rounded-lg text-center mb-4 shadow-lg">
              <p className="font-medium text-sm">총무</p>
              <p className="text-xs opacity-80">변승재</p>
            </div>

            {/* Line */}
            <div className="w-0.5 h-8 bg-[#2e5aa7]" />

            {/* Departments */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-[#2e5aa7] text-white px-4 py-2 rounded-lg text-center shadow">
                <p className="font-medium text-sm">회계 감사</p>
                <p className="text-xs opacity-80">이순천</p>
              </div>
              <div className="bg-[#4a90c9] text-white px-4 py-2 rounded-lg text-center shadow">
                <p className="font-medium text-sm">학술</p>
                <p className="text-xs opacity-80">윤우성</p>
              </div>
              <div className="bg-gray-500 text-white px-4 py-2 rounded-lg text-center shadow">
                <p className="font-medium text-sm">간사</p>
                <p className="text-xs opacity-80">김영균, 권준성, 이재훈</p>
              </div>
              <div className="bg-[#6b7280] text-white px-4 py-2 rounded-lg text-center shadow">
                <p className="font-medium text-sm">전산 위원</p>
                <p className="text-xs opacity-80">고진</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
