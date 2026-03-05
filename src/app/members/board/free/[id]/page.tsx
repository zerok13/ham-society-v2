import { PageLayout } from "@/components/PageLayout";
import { ArrowLeft, User, Calendar } from "lucide-react";
import Link from "next/link";

export default function FreeBoardDetailPage() {
  return (
    <PageLayout title="자유게시판" subtitle="Free Board">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/members/board/free" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#1a2e5a]">
            <ArrowLeft className="w-4 h-4" /> 목록으로
          </Link>
        </div>
        <article className="bg-white rounded-xl shadow-lg">
          <header className="px-8 py-6 border-b">
            <h1 className="text-xl font-bold text-[#1a2e5a]">안녕하세요</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> 김형태
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> 2026.02.10
              </div>
            </div>
          </header>
          <div className="p-8 prose max-w-none">
            <p>HAM 홈페이지가 새롭게 오픈되어 기쁩니다. 앞으로 활발한 교류를 기대합니다.</p>
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
