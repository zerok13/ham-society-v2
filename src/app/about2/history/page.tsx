import { PageLayout } from "@/components/PageLayout";
import { history } from "@/lib/data";
import { Flag, Clock } from "lucide-react";

export default function HistoryPage() {
  return (
    <PageLayout title="연혁" subtitle="History" imageIndex={0}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c41e3a] text-white rounded-full font-bold mb-4">
            <Flag className="w-4 h-4" /> 2022 ~ 현재
          </div>
          <h2 className="text-2xl font-bold text-[#1a2e5a]">
            대한혈관외과학회 혈액투석길 연구회의 발자취
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#c41e3a] via-[#1a2e5a] to-[#2e5aa7] rounded" />

          {history.map((item, index) => (
            <div
              key={item.year}
              className={`relative flex items-start gap-8 mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Year Badge */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2">
                <div className="w-16 h-16 bg-white border-4 border-[#1a2e5a] rounded-full flex items-center justify-center shadow">
                  <span className="text-[#1a2e5a] font-bold text-sm">{item.year}</span>
                </div>
              </div>

              {/* Content */}
              <div className={`ml-20 md:ml-0 md:w-[calc(50%-3rem)] ${index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                <div className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-[#2e5aa7] md:border-l-0 md:border-r-4`}>
                  <div className={`flex items-center gap-2 text-[#2e5aa7] mb-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-semibold">Milestones</span>
                  </div>
                  <ul className="space-y-2">
                    {item.events.map((event, eventIndex) => (
                      <li key={eventIndex} className="text-gray-700 text-sm flex items-start gap-2">
                        <span className="mt-1 w-2 h-2 rounded-full bg-[#c41e3a] flex-shrink-0" />
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Foundation Note */}
        <div className="mt-12 bg-gradient-to-r from-[#1a2e5a] to-[#2e5aa7] rounded-xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">HAM 창립</h3>
          <p className="text-white/80">
            2022년 9월 혈액투석길 연구회가 창립되어<br />
            투석 환자의 혈관 접근로에 관한 연구와 임상 경험 공유를 시작하였습니다.
          </p>
        </div>

        {/* English Summary */}
        <div className="mt-12 bg-gradient-to-r from-[#1a2e5a] to-[#2e5aa7] rounded-xl p-8 text-white">
          <h3 className="text-xl font-bold mb-2">History (English Summary)</h3>
          <p className="text-white/90 text-sm leading-relaxed">
            HAM (Hemodialysis Access Meeting) has been organizing regular academic meetings since its foundation in 2022.
            We share knowledge and clinical experiences regarding vascular access for hemodialysis, develop guidelines,
            and collaborate through multi-center research projects. As of 2026, the 9th meeting has been held in Daegu (Jan),
            and the 10th meeting is scheduled in Daejeon (Apr).
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
