import { PageLayout } from "@/components/PageLayout";
import { notices } from "@/lib/data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function NoticePage() {
  return (
    <PageLayout title="공지사항" subtitle="Notice" imageIndex={0}>
      <div className="max-w-4xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button type="button" className="px-4 py-2 bg-[#1a2e5a] text-white rounded-lg text-sm font-medium">
            전체
          </button>
          <button type="button" className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            공지
          </button>
          <button type="button" className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            안내
          </button>
          <button type="button" className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            소식
          </button>
        </div>

        {/* Notice List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1a2e5a]">번호</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1a2e5a]">제목</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1a2e5a] hidden md:table-cell">날짜</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice, index) => (
                <tr key={notice.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{notices.length - index}</td>
                  <td className="px-6 py-4">
                    <Link href={`/news/notice/${notice.id}`} className="group flex items-center gap-2">
                      {notice.isNew && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 bg-[#c41e3a] text-white text-[10px] font-bold rounded">
                          NEW
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        notice.category === "공지" ? "bg-[#1a2e5a]/10 text-[#1a2e5a]" :
                        notice.category === "안내" ? "bg-[#2e5aa7]/10 text-[#2e5aa7]" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {notice.category}
                      </span>
                      <span className="text-gray-800 group-hover:text-[#c41e3a] transition-colors line-clamp-1">
                        {notice.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <span className="text-gray-400 text-xs mt-1 md:hidden">{notice.date}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{notice.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
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
