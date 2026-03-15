import { CalendarDays, Clock, MapPin, ExternalLink, CalendarCheck } from "lucide-react";

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
      <div className="bg-[#1a2b4b] text-white py-16 mb-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">학술행사 일정</h1>
          <p className="text-blue-200 text-lg">Academic Events Schedule</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-100">
          <div className="p-10">
            <h2 className="text-2xl font-bold text-[#1a2b4b] mb-8 flex items-center gap-3">
              <CalendarCheck className="w-7 h-7" /> 주요 학술 행사 일정
            </h2>
            <div className="space-y-8">
              {scheduleData.map((item, index) => (
                <div key={index} className="border-l-4 border-l-[#c41e3a] p-8 bg-white shadow-sm rounded-r-xl">
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {item.date}</div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {item.time}</div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {item.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
