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
    if (eventId === 11) return "/slide-group-winter.jpg"; // 제11회 예정
    if (eventId === 10) return "/slide-group-winter.jpg"; // 제10회
    if (eventId === 9) return "/slide-group-winter.jpg"; // 제9회
    if (eventId === 8) return "/slide-group-suncheon.jpg"; // 제8회
    if (eventId === 1) return "/slide-av-study.jpg"; // 제1회
    return "/slide-group-suncheon.jpg"; // default
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

            {/* Program (for 11th meeting) */}
            {event.id === 11 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-[#1a2e5a] mb-4">프로그램</h2>

                {/* Opening */}
                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1a2e5a] text-white">
                        <th className="px-4 py-2.5 text-left w-40">시간</th>
                        <th className="px-4 py-2.5 text-left">내용</th>
                        <th className="px-4 py-2.5 text-left w-56">발표자</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-500 font-mono">8:55 – 9:00</td>
                        <td className="px-4 py-2.5 text-gray-800 font-medium">Opening Remark</td>
                        <td className="px-4 py-2.5 text-gray-600">김형태 (회장), 이상수 (대한혈관외과학회 이사장)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Session I */}
                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#2e5aa7] text-white">
                        <th colSpan={3} className="px-4 py-2.5 text-left">
                          Session I. Central Venous Catheter (CVC)-related Complications
                          <span className="ml-3 font-normal text-blue-100 text-xs">
                            좌장: 이상수 (부산의대) · 장정환 (장정환외과)
                          </span>
                        </th>
                      </tr>
                      <tr className="bg-blue-50">
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-40">시간</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold">발표 제목</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-56">발표자 (소속)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        ["9:00 – 9:20", "Immediate and early complications after CVC placement", "박근명 (인전외과)"],
                        ["9:20 – 9:40", "Cause and prevention of CVC dysfunction", "구경림 (나은길외과)"],
                        ["9:40 – 10:00", "Fibrin sheath disruption does work?", "주윤성 (홀은강안병원)"],
                        ["10:00 – 10:20", "Mangement of CVC-related thrombosis", "안상현 (서울의대)"],
                        ["10:20 – 10:40", "CVC placement in patients with central venous obstruction", "양승부 (을지의대)"],
                      ].map(([time, title, presenter], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2.5 text-gray-500 font-mono">{time}</td>
                          <td className="px-4 py-2.5 text-gray-800">{title}</td>
                          <td className="px-4 py-2.5 text-gray-600">{presenter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Coffee Break 1 */}
                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="bg-amber-50">
                        <td className="px-4 py-2.5 text-gray-500 font-mono w-40">10:40 – 11:00</td>
                        <td className="px-4 py-2.5 text-amber-700 font-medium">☕ Coffee Break</td>
                        <td className="px-4 py-2.5 w-56" />
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Session II */}
                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1a4a97] text-white">
                        <th colSpan={3} className="px-4 py-2.5 text-left">
                          Session II. Case Presentation: Central Venous Catheter (CVC)-related Complications
                          <span className="ml-3 font-normal text-blue-100 text-xs">
                            좌장: 권정남 (원광의대) · 변승재 (청맥병원)
                          </span>
                        </th>
                      </tr>
                      <tr className="bg-blue-50">
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-40">시간</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold">내용</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-56">발표자</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        ["11:00 – 11:20", "Case 1", ""],
                        ["11:20 – 11:40", "Case 2", ""],
                        ["11:40 – 12:00", "Case 3", ""],
                        ["12:00 – 12:20", "Case 4", ""],
                      ].map(([time, title, presenter], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2.5 text-gray-500 font-mono">{time}</td>
                          <td className="px-4 py-2.5 text-gray-800">{title}</td>
                          <td className="px-4 py-2.5 text-gray-600">{presenter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Lunch Session */}
                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#5a7a2e] text-white">
                        <th colSpan={3} className="px-4 py-2.5 text-left">
                          🍽 Lunch Session
                          <span className="ml-3 font-normal text-green-100 text-xs">
                            좌장: 김형태 (브이외과)
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="bg-white">
                        <td className="px-4 py-2.5 text-gray-500 font-mono w-40">12:20 – 13:00</td>
                        <td className="px-4 py-2.5 text-gray-800">IN.PACT AV DCB: Extending the Life of AV Access</td>
                        <td className="px-4 py-2.5 text-gray-600 w-56">문진호 (유창현혈관외과)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-500 font-mono">13:00 – 13:30</td>
                        <td className="px-4 py-2.5 text-amber-700 font-medium">🍱 점심식사</td>
                        <td className="px-4 py-2.5" />
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Session III */}
                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#2e5aa7] text-white">
                        <th colSpan={3} className="px-4 py-2.5 text-left">
                          Session III. Cephalic Arch Stenosis
                          <span className="ml-3 font-normal text-blue-100 text-xs">
                            좌장: 박재훈 (오른외과) · 이순천 (광양사랑병원)
                          </span>
                        </th>
                      </tr>
                      <tr className="bg-blue-50">
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-40">시간</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold">발표 제목</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-56">발표자 (소속)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        ["13:30 – 13:50", "Cephalic arch anatomy and its variants and etiology of cephalic arch stenosis", "권준성 (한림의대)"],
                        ["13:50 – 14:10", "Cephalic arch stenting: Choice of stent size and precise deployment technique", "김동현 (샌텀도담외과)"],
                        ["14:10 – 14:30", "New technologies for cephalic arch stenosis: Stent graft, drug-coated balloon and drug-eluting stent", "김현규 (이담외과)"],
                        ["14:30 – 14:50", "Surgical options and their outcomes for cephalic arch stenosis", "숨단 (순천향의대)"],
                        ["14:50 – 15:10", "My treatment algorithm for cephalic arch stenosis", "최찬중 (초이스외과)"],
                      ].map(([time, title, presenter], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2.5 text-gray-500 font-mono">{time}</td>
                          <td className="px-4 py-2.5 text-gray-800">{title}</td>
                          <td className="px-4 py-2.5 text-gray-600">{presenter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Coffee Break 2 */}
                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="bg-amber-50">
                        <td className="px-4 py-2.5 text-gray-500 font-mono w-40">15:10 – 15:30</td>
                        <td className="px-4 py-2.5 text-amber-700 font-medium">☕ Coffee Break</td>
                        <td className="px-4 py-2.5 w-56" />
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Session IV */}
                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1a4a97] text-white">
                        <th colSpan={3} className="px-4 py-2.5 text-left">
                          Session IV. Case Presentation: Cephalic Arch Stenosis
                          <span className="ml-3 font-normal text-blue-100 text-xs">
                            좌장: 이종훈 (이종훈혈관외과) · 남우석 (민트병원)
                          </span>
                        </th>
                      </tr>
                      <tr className="bg-blue-50">
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-40">시간</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold">내용</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-56">발표자</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        ["15:30 – 15:50", "Case 1", ""],
                        ["15:50 – 16:10", "Case 2", ""],
                        ["16:10 – 16:30", "Case 3", ""],
                        ["16:30 – 16:50", "Case 4", ""],
                      ].map(([time, title, presenter], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2.5 text-gray-500 font-mono">{time}</td>
                          <td className="px-4 py-2.5 text-gray-800">{title}</td>
                          <td className="px-4 py-2.5 text-gray-600">{presenter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Closing */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="bg-[#1a2e5a]/5">
                        <td className="px-4 py-2.5 text-gray-500 font-mono w-40">16:50 – 17:00</td>
                        <td className="px-4 py-2.5 text-[#1a2e5a] font-medium">Closing Remark</td>
                        <td className="px-4 py-2.5 text-gray-600 w-56">김형태 (회장)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Program (for 10th meeting) */}
            {event.id === 10 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-[#1a2e5a] mb-4">프로그램</h2>

                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1a2e5a] text-white">
                        <th className="px-4 py-2.5 text-left w-40">시간</th>
                        <th className="px-4 py-2.5 text-left">내용</th>
                        <th className="px-4 py-2.5 text-left w-48">발표자</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-500 font-mono">14:50 – 15:00</td>
                        <td className="px-4 py-2.5 text-gray-800 font-medium">Registration &amp; Opening Remarks</td>
                        <td className="px-4 py-2.5 text-gray-500">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#2e5aa7] text-white">
                        <th colSpan={3} className="px-4 py-2.5 text-left">
                          Session 1. Discussion of Interesting Cases
                          <span className="ml-3 font-normal text-blue-100 text-xs">
                            좌장: 유창현 (유창현외과) · 안문상 (충남대병원)
                          </span>
                        </th>
                      </tr>
                      <tr className="bg-blue-50">
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-40">시간</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold">발표 제목</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-48">발표자 (소속)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        ["15:00 – 15:10", "Case 1. 박재영 (베스트)", "박재영 (도담외과)"],
                        ["15:10 – 15:20", "Case 2. 김동현 (워스트)", "김동현 (해운대도담외과)"],
                        ["15:20 – 15:30", "Case 3. 김원종 (베스트)", "김원종 (수원도담외과)"],
                        ["15:30 – 15:40", "Case 4. 문진호 (베스트)", "문진호 (유창현외과)"],
                        ["15:40 – 15:50", "Case 5. 김형태 (워스트)", "김형태 (브이외과)"],
                        ["15:50 – 16:00", "Case 6. 변승재 (워스트)", "변승재 (청맥병원)"],
                        ["16:00 – 16:10", "Case 7. 권준성 (베스트)", "권준성 (춘천성심병원)"],
                        ["16:10 – 16:20", "Case 8. 김영화 (베스트)", "김영화 (서울선정형외과)"],
                        ["16:20 – 16:30", "Case 9. 정병훈 (워스트)", "정병훈 (JB외과)"],
                        ["16:30 – 16:40", "Case 10. 이순천 (워스트)", "이순천 (광양사랑병원)"],
                      ].map(([time, title, presenter], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2.5 text-gray-500 font-mono">{time}</td>
                          <td className="px-4 py-2.5 text-gray-800">{title}</td>
                          <td className="px-4 py-2.5 text-gray-600">{presenter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="bg-amber-50">
                        <td className="px-4 py-2.5 text-gray-500 font-mono w-40">16:40 – 16:50</td>
                        <td className="px-4 py-2.5 text-amber-700 font-medium">☕ Break Time</td>
                        <td className="px-4 py-2.5 w-48" />
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1a4a97] text-white">
                        <th colSpan={3} className="px-4 py-2.5 text-left">
                          Session 2. Discussion of Complex Cases
                          <span className="ml-3 font-normal text-blue-100 text-xs">
                            좌장: 박제훈 (오른외과) · 이순천 (광양사랑병원)
                          </span>
                        </th>
                      </tr>
                      <tr className="bg-blue-50">
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-40">시간</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold">발표 제목</th>
                        <th className="px-4 py-2 text-left text-[#1a2e5a] font-semibold w-48">발표자 (소속)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        ["16:50 – 17:00", "Case 1. 김영균 (워스트)", "김영균 (세이브외과)"],
                        ["17:00 – 17:10", "Case 2. 박제훈 (베스트)", "박제훈 (오른외과)"],
                        ["17:10 – 17:20", "Case 3. 이수용 (워스트)", "이수용 (나은길외과)"],
                        ["17:20 – 17:30", "Case 4. 박근명 (워스트)", "박근명 (인천외과)"],
                        ["17:30 – 17:40", "Case 5. 김송이 (베스트)", "김송이 (세종충남대병원)"],
                        ["17:40 – 17:50", "Case 6. 고진 (워스트)", "고진 (고하이외과)"],
                        ["17:50 – 18:00", "Case 7. 최찬중 (워스트)", "최찬중 (초이스외과)"],
                        ["18:00 – 18:10", "Case 8. 윤우성 (워스트)", "윤우성 (루백외과)"],
                        ["18:10 – 18:20", "Case 9. 이재훈 (베스트)", "이재훈 (대구가톨릭대학교 병원)"],
                        ["18:20 – 18:30", "AV access registry 소개 · 홈페이지 소개", "고진, 김영균 (전산위원/간사)"],
                      ].map(([time, title, presenter], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2.5 text-gray-500 font-mono">{time}</td>
                          <td className="px-4 py-2.5 text-gray-800">{title}</td>
                          <td className="px-4 py-2.5 text-gray-600">{presenter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="bg-[#1a2e5a]/5">
                        <td className="px-4 py-2.5 text-gray-500 font-mono w-40">18:30 –</td>
                        <td className="px-4 py-2.5 text-[#1a2e5a] font-medium">Closing Remarks &amp; Dinner</td>
                        <td className="px-4 py-2.5 text-gray-600 w-48">김형태 회장 (브이외과)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* Poster & Materials */}
            {(event.id === 10 || event.id === 11) && (
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
