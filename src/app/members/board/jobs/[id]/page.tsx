import { PageLayout } from "@/components/PageLayout";
import { ArrowLeft, User, Calendar, Building } from "lucide-react";
import Link from "next/link";

export default function JobDetailPage() {
  return (
    <PageLayout title="구인/구직" subtitle="Jobs Board">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/members/board/jobs" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#1a2e5a]">
            <ArrowLeft className="w-4 h-4" /> 목록으로
          </Link>
        </div>
        <article className="bg-white rounded-xl shadow-lg">
          <header className="px-8 py-6 border-b">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-[#1a2e5a]/10 text-[#1a2e5a] text-xs rounded">채용</span>
            </div>
            <h1 className="text-xl font-bold text-[#1a2e5a]">혈관외과 전문의 채용</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4" /> 브이외과
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> 마감일: 2026.03.31
              </div>
            </div>
          </header>
          <div className="p-8 prose max-w-none">
            <p>브이외과에서 함께 성장할 혈관외과 전문의를 초빙합니다.</p>
            <h3 className="font-semibold">주요 업무</h3>
            <ul>
              <li>AV Access 수술 및 시술</li>
              <li>혈관외과 외래 진료</li>
            </ul>
            <h3 className="font-semibold">지원 방법</h3>
            <p>이메일(forgene@naver.com)로 이력서 및 자기소개서 제출</p>
          </div>
          <footer className="px-8 py-4 bg-gray-50 border-t flex justify-end gap-2">
            <button className="px-4 py-2 text-sm bg-gray-200 rounded-lg">수정</button>
            <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg">삭제</button>
          </footer>
        </article>
      </div>
    </PageLayout>
  );
}
