import { PageLayout } from "@/components/PageLayout";
import { events } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

export default function ConferencePage() {
  const conferences = events.filter((e) => e.type === "정기 학술대회");
  const upcomingConferences = conferences.filter((e) => e.isUpcoming);
  const pastConferences = conferences.filter((e) => !e.isUpcoming);

  // Choose specific images for certain conferences
  const getPastImage = (id: number) => {
    if (id === 9) return "/images/slide-group-winter.jpg"; // 제9회
    if (id === 8) return "/images/slide-group-suncheon.jpg"; // 제8회
    if (id === 1) return "/images/slide-av-study.jpg"; // 제1회
    return "/images/slide-group-suncheon.jpg"; // default fallback
  };
  const hasPastImage = (id: number) => id === 9 || id === 8 || id === 1;

  return (
    <PageLayout title="학술대회" subtitle="Academic Conference" imageIndex={0}>
      <div className="max-w-6xl mx-auto">
        {/* Upcoming Conference */}
        {upcomingConferences.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#1a2e5a] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse" />
              다가오는 학술대회
            </h2>
            {upcomingConferences.map((conference) => (
              <Link
                key={conference.id}
                href={`/events/conference/${conference.id}`}
                className="group block bg-gradient-to-r from-[#1a2e5a] via-[#2e5aa7] to-[#4a90c9] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="grid md:grid-cols-3">
                  <div className="relative h-48 md:h-full">
                    <Image
                      src="/images/slide-group-winter.jpg"
                      alt={conference.title}
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a2e5a]/80" />
                  </div>
                  <div className="md:col-span-2 p-8 text-white">
                    <div className="inline-block px-3 py-1 bg-[#c41e3a] text-white text-sm font-medium rounded-full mb-4">
                      사전등록 진행중
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{conference.title}</h3>
                    <p className="text-white/80 mb-6">Hemodialysis Access Meeting (HAM)</p>
                    <div className="flex flex-wrap gap-6 text-white/90 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {conference.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {conference.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white font-medium group-hover:translate-x-2 transition-transform">
                      상세보기 및 등록
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Past Conferences */}
        <div>
          <h2 className="text-xl font-bold text-[#1a2e5a] mb-6">역대 학술대회</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastConferences.map((conference) => (
              <div
                key={conference.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                {hasPastImage(conference.id) ? (
                  <div className="relative h-40">
                    <Image
                      src={getPastImage(conference.id)}
                      alt={conference.title}
                      fill
                      className="object-cover grayscale opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-white text-[#1a2e5a] text-sm font-bold rounded">
                        {conference.date.split('.')[0]}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-2 bg-gradient-to-r from-[#1a2e5a] to-[#2e5aa7]" />
                )}
                <div className="p-5">
                  <h3 className="font-bold text-[#1a2e5a] mb-2 line-clamp-2">
                    {conference.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    {conference.date}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{conference.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-4">
            학술대회 관련 문의는 사무국으로 연락 주시기 바랍니다.
          </p>
          <Link
            href="/members/join"
            className="inline-block bg-[#1a2e5a] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0f1d3a] transition-colors"
          >
            문의하기
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
