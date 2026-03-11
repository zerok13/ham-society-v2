import { PageLayout } from "@/components/PageLayout";
import { Users } from "lucide-react";

export default function BoardJobsPage() {
  return (
    <PageLayout title="구인/구직" subtitle="Jobs Board">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="w-5 h-5" />
            <span className="text-sm">총 1개의 글</span>
          </div>
          <button className="px-4 py-2 bg-[#1a2e5a] text-white text-sm rounded-lg hover:bg-[#0f1d3a]">
            채용공고 등록
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-[#1a2e5a]">제목</th>
                <th className="px-6 py-3 text-left font-semibold text-[#1a2e5a]">기관명</th>
                <th className="px-6 py-3 text-left font-semibold text-[#1a2e5a]">마감일</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-6 py-4">혈관외과 전문의 채용</td>
                <td className="px-6 py-4">브이외과</td>
                <td className="px-6 py-4">2026.03.31</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
