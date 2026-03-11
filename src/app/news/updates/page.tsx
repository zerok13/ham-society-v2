import { PageLayout } from "@/components/PageLayout";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";

const updates = [
  {
    id: 1,
    title: "제9회 학술대회 사전등록 시작",
    date: "2026.01.10",
    summary: "2026년 1월 25일 대구가톨릭대학교에서 개최되는 제9회 학술대회 사전등록이 시작되었습니다.",
    image: "/group-photo-1.jpg",
    category: "학술대회",
  },
  {
    id: 2,
    title: "홈페이지 오픈 안내",
    date: "2026.01.12",
    summary: "대한혈관외과학회 혈액투석길 연구회 공식 홈페이지가 새롭게 오픈되었습니다.",
    image: "/group-photo-2.jpg",
    category: "소식",
  },
  {
    id: 3,
    title: "2025년 연구회 활동 결산",
    date: "2025.12.28",
    summary: "2025년 한 해 동안의 혈액투석길 연구회 주요 활동을 정리하였습니다.",
    image: "/session.jpg",
    category: "소식",
  },
  {
    id: 4,
    title: "대한혈관외과학회 공식 연구회 승인",
    date: "2025.03.15",
    summary: "혈액투석길 연구회가 대한혈관외과학회의 공식 산하 연구회로 승인받았습니다.",
    image: "/study.jpg",
    category: "소식",
  },
];

export default function UpdatesPage() {
  return (
    <PageLayout title="연구회 소식" subtitle="News & Updates" imageIndex={1}>
      <div className="max-w-6xl mx-auto">
        {/* Featured Update */}
        <div className="mb-12">
          <Link href="#" className="group block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-full">
                <Image
                  src={updates[0].image}
                  alt={updates[0].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#c41e3a] text-white text-xs font-medium rounded-full">
                    {updates[0].category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  {updates[0].date}
                </div>
                <h2 className="text-2xl font-bold text-[#1a2e5a] mb-4 group-hover:text-[#c41e3a] transition-colors">
                  {updates[0].title}
                </h2>
                <p className="text-gray-600 mb-4">{updates[0].summary}</p>
                <div className="flex items-center gap-2 text-[#2e5aa7] font-medium">
                  자세히 보기
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Update Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {updates.slice(1).map((update) => (
            <Link
              key={update.id}
              href="#"
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="relative h-48">
                <Image
                  src={update.image}
                  alt={update.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 bg-[#1a2e5a]/80 text-white text-xs font-medium rounded">
                    {update.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                  <Calendar className="w-3 h-3" />
                  {update.date}
                </div>
                <h3 className="font-bold text-[#1a2e5a] mb-2 group-hover:text-[#c41e3a] transition-colors line-clamp-2">
                  {update.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2">{update.summary}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-12">
          <button type="button" className="w-10 h-10 flex items-center justify-center bg-[#1a2e5a] text-white rounded-lg">
            1
          </button>
          <button type="button" className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            2
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
