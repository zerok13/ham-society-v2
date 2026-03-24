import { events } from "@/lib/data";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, CalendarCheck } from "lucide-react";

export default function SchedulePage() {
  const upcomingEvents = events.filter((e) => e.isUpcoming);
  const pastEvents = events.filter((e) => !e.isUpcoming);

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="bg-[#1a2b4b] text-white py-16 mb-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">학술행사 일정</h1>
          <p className="text-blue-200 text-lg">Academic Events Schedule</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* 예정 행사 */}
        {upcomingEvents.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 border border-gray-100">
            <div className="bg-gradient-to-r from-[#c41e3a] to-[#e04e5e] px-8 py-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <h2 className="text-white font-bold text-lg">예정된 학술 행사</h2>
            </div>
            <div className="divide-y">
              {upcomingEvents.map((item) => (
                <Link
                  key={item.id}
                  href={`/events/conference/${item.id}`}
                  className="block p-8 hover:bg-[#f8faff] transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-[#c41e3a]/10 text-[#c41e3a] text-xs font-bold rounded-full mb-2">
                        {item.type}
                      </span>
                      <h3 className="text-lg font-bold text-[#1a2b4b] group-hover:text-[#c41e3a] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-[#1a2b4b]" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#1a2b4b]" />
                        {item.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#1a2b4b]" />
                        {item.location}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 전체 학술 행사 목록 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-100">
          <div className="px-8 py-5 border-b flex items-center gap-3">
            <CalendarCheck className="w-6 h-6 text-[#1a2b4b]" />
            <h2 className="text-xl font-bold text-[#1a2b4b]">역대 학술 행사 일정</h2>
          </div>
          <div className="divide-y">
            {pastEvents.map((item) => (
              <Link
                key={item.id}
                href={`/events/conference/${item.id}`}
                className="block px-8 py-5 hover:bg-[#f8faff] transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1a2b4b] group-hover:text-[#2e5aa7] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4" />
                      {item.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1 max-w-[200px]">{item.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 문의 안내 */}
        <div className="bg-gradient-to-r from-[#1a2b4b] to-[#2e5aa7] rounded-2xl p-8 text-center text-white">
          <p className="mb-4 text-white/80">학술행사 관련 문의는 사무국으로 연락 주시기 바랍니다.</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span>이메일: zerok13@gmail.com</span>
            <span>|</span>
            <span>전화: 010-2688-5625</span>
          </div>
        </div>
      </div>
    </div>
  );
}
