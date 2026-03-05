import { PageLayout } from "@/components/PageLayout";
import { events } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Download, FileText } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConferenceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = events.find((e) => e.id === Number.parseInt(id));

  if (!event) {
    notFound();
  }

  // Choose specific image based on event id
  const getEventImage = (eventId: number) => {
    if (eventId === 10) return "/images/slide-group-winter.jpg"; // 제10회 예정
    if (eventId === 9) return "/images/slide-group-winter.jpg"; // 제9회
    if (eventId === 8) return "/images/slide-group-suncheon.jpg"; // 제8회
    if (eventId === 1) return "/images/slide-av-study.jpg"; // 제1회
    return "/images/slide-group-suncheon.jpg"; // default
  };

  return (
    <PageLayout title="학술행사" subtitle="Conference" imageIndex={1}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/events/conference"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a2e5a] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Link>

        {/* Event Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-52 md:h-64 bg-[#1a2e5a]">
            <Image
              src={getEventImage(event.id)}
              alt={event.title}
              fill
              className="object-contain"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e5a]/90 via-[#1a2e5a]/40 to-transparent" />
          </div>

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#1a2e5a] via-[#2e5aa7] to-[#4a90c9] p-8 text-white">
            <div className="flex items-center gap-2 mb-3">
              {event.isUpcoming ? (
                <span className="px-3 py-1 bg-[#c41e3a] text-white text-sm font-medium rounded-full">
                  예정된 행사
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-500 text-white text-sm font-medium rounded-full">
                  종료된 행사
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {event.title}
            </h1>
            <p className="text-white/80">
              Hemodialysis Access Meeting (HAM)
            </p>
          </div>

          {/* Event Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-[#1a2e5a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">일시</p>
                  <p className="font-semibold text-[#1a2e5a]">{event.date}</p>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-[#2e5aa7] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">장소</p>
                  <p className="font-semibold text-[#1a2e5a]">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-[#1a2e5a] mb-4">행사 안내</h2>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Program (for upcoming events) */}
            {event.isUpcoming && event.id === 10 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-[#1a2e5a] mb-4">프로그램</h2>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#1a2e5a]">시간</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#1a2e5a]">세션</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#1a2e5a]">주요 내용</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">15:00 ~ 15:10</td>
                        <td className="px-4 py-3 text-sm text-gray-800">개회</td>
                        <td className="px-4 py-3 text-sm text-gray-800">개회사</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">15:10 ~ 16:30</td>
                        <td className="px-4 py-3 text-sm text-gray-800">Session 1</td>
                        <td className="px-4 py-3 text-sm text-gray-800">Latest updates in Vascular Access</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">16:30 ~ 16:50</td>
                        <td className="px-4 py-3 text-sm text-gray-800">Break</td>
                        <td className="px-4 py-3 text-sm text-gray-800">Coffee break</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600">16:50 ~ 18:30</td>
                        <td className="px-4 py-3 text-sm text-gray-800">Session 2</td>
                        <td className="px-4 py-3 text-sm text-gray-800">Case discussions & panel</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Poster & Materials */}
            {event.id === 10 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-[#1a2e5a] mb-4">포스터 및 자료</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="relative h-48 bg-[#1a2e5a]">
                      <Image
                        src={getEventImage(10)}
                        alt="제10회 포스터"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FileText className="w-4 h-4 text-[#2e5aa7]" /> 포스터 (JPG)
                      </div>
                      <a
                        href={getEventImage(10)}
                        download
                        className="inline-flex items-center gap-2 px-3 py-2 bg-[#1a2e5a] text-white rounded-lg text-sm hover:bg-[#0f1d3a]"
                      >
                        <Download className="w-4 h-4" /> 다운로드
                      </a>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#1a2e5a]">발표자료 모음 (업로드 예정)</p>
                      <p className="text-sm text-gray-500 mt-1">행사 종료 후 학술자료실에 게시됩니다.</p>
                    </div>
                    <Link
                      href="/resources/presentations"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                      자료실로 이동
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Button */}
            {event.isUpcoming && (
              <div className="text-center">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-[#c41e3a] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#a01830] transition-colors"
                >
                  <Users className="w-5 h-5" />
                  사전등록 신청
                </button>
                <p className="text-gray-500 text-sm mt-2">
                  사전등록은 회원 로그인 후 가능합니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
