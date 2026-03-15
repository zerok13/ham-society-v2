// 데이터 이름을 파일 내부에서 직접 정의하여 에러를 원천 차단했습니다.
import { CalendarDays, Clock, MapPin, ExternalLink, CalendarCheck } from "lucide-react";

// 실제 학술 행사 데이터 (여기에 내용을 추가/수정하시면 됩니다)
const scheduleData = [
  {
    title: "2025 대한혈관외과학회 혈액투석길 연구회 하계 학술대회",
    date: "2025년 08월 23일 (토)",
    time: "09:00 - 17:00",
    location: "서울대학교병원 의생명연구원 대강당",
  },
  {
    title: "제11회 혈액투석길 연구회 정기 심포지엄",
    date: "2026년 04월 25일 (토)",
    time: "10:00 - 16:00",
    location: "대전 충남대학교병원 암센터 강당",
  }
];

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      {/* 상단 타이틀 영역 */}
      <div className="bg-[#1a2b4b] text-white py-16 mb-12 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight text-white drop-shadow-sm">학술행사 일정</h1>
          <p className="text-blue-200 text-lg font-light">Academic Events Schedule</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* 주요 행사 안내 카드 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-100 ring-1 ring-gray-200">
          <div className="p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-[#1a2b4b] rounded-xl flex items-center justify-center shadow-lg">
                <CalendarCheck className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a2b4b]">주요 학술 행사 일정</h2>
            </div>

            <div className="space-y-8">
              {scheduleData.map((item, index) => (
                <div 
                  key={index}
                  className="group relative bg-white border-l-4 border-l-[#c41e3a] p-8 rounded-r-xl shadow-sm hover:shadow-md transition-all duration-300 border-y border-r border-gray-50"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-blue-50 text-[#1a2b4b] px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                          Academic Meeting
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1a2b4b] transition-colors leading-tight">
                          {item.title}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2.5">
                          <CalendarDays className="w-4 h-4 text-[#c41e3a]" />
                          <span className="font-medium">{item.date}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-[#c41e3a]" />
                          <span>{item.time || "세부 일정 추후 공지"}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-[#c41e3a]" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center shrink-0">
                      <button className="flex items-center gap-2 bg-[#1a2b4b] text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-[#0f1d3a] transition-all hover:shadow-lg active:scale-95 group-hover:bg-[#c41e3a]">
                        <ExternalLink className="w-4 h-4" />
                        사전등록 안내
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 안내 섹션 */}
        <div className="bg-gradient-to-br from-[#1a2b4b] to-[#2e5aa7] rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-4">행사 참여 및 안내 사항</h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed text-lg">
              혈액투석길 연구회(HAM)에서 주최하는 모든 학술 행사는 전문적인 지식 공유를 위해 진행됩니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl text-white text-sm">
                📞 사무국 문의: 010-2688-5625
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
