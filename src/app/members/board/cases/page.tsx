import { PageLayout } from "@/components/PageLayout";
import { FileText } from "lucide-react";

export default function BoardCasesPage() {
  return (
    <PageLayout title="증례 토론" subtitle="Case Discussions">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-500">
            <FileText className="w-5 h-5" />
            <span className="text-sm">총 1개의 글</span>
          </div>
          <button className="px-4 py-2 bg-[#1a2e5a] text-white text-sm rounded-lg hover:bg-[#0f1d3a]">
            증례 올리기
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-[#1a2e5a]">제목</th>
                <th className="px-6 py-3 text-left font-semibold text-[#1a2e5a]">작성자</th>
                <th className="px-6 py-3 text-left font-semibold text-[#1a2e5a]">작성일</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-6 py-4">AVF 재수술 증례</td>
                <td className="px-6 py-4">고진</td>
                <td className="px-6 py-4">2026.02.08</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
