import { PageLayout } from "@/components/PageLayout";
import { events } from "@/lib/data";
import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function SchedulePage() {
  const upcomingEvents = events.filter((e) => e.isUpcoming);
  const pastEvents = events.filter((e) => !e.isUpcoming);

  return (
    <PageLayout title="행사 일정" subtitle="Event Schedule" imageIndex={0}>
      <div className="max-w-4xl mx-auto">
        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#1a2e5a] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse" />
            예정된 행사
          </h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/conference/${event.id}`}
                className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Date Badge */}
                  <div className="bg-gradient-to-br from-[#1a2e5a] to-[#2e5aa7] p-6 text-white text-center md:w-40 flex-shrink-0">
                    <p className="text-3xl font-bold">{event.date.split('.')[2]}</p>
                    <p className="text-sm opacity-80">{event.date.split('.')[0]}.{event.date.split('.')[1]}</p>
                  </div>
                  {/* Content */}
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-[#c41e3a]/10 text-[#c41e3a] text-xs font-medium rounded">
                        예정
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1a2e5a] mb-2">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h2 className="text-xl font-bold text-[#1a2e5a] mb-6">
            지난 행사
          </h2>
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-md overflow-hidden opacity-75"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Date Badge */}
                  <div className="bg-gray-400 p-6 text-white text-center md:w-40 flex-shrink-0">
                    <p className="text-3xl font-bold">{event.date.split('.')[2]}</p>
                    <p className="text-sm opacity-80">{event.date.split('.')[0]}.{event.date.split('.')[1]}</p>
                  </div>
                  {/* Content */}
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">
                        종료
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-600 mb-2">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Note */}
        <div className="mt-12 bg-gradient-to-r from-[#1a2e5a] to-[#2e5aa7] rounded-xl p-6 text-center text-white">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h3 className="font-bold mb-2">학술대회 참가 안내</h3>
          <p className="text-white/80 text-sm">
            학술대회 참가를 원하시는 분은 사전 등록을 해주시기 바랍니다.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
