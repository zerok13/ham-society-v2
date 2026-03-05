import { PageLayout } from "@/components/PageLayout";
import { ArrowLeft, User, Calendar, Download } from "lucide-react";
import Link from "next/link";

export default function CaseDetailPage() {
  return (
    <PageLayout title="증례 토론" subtitle="Case Discussion">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/members/board/cases" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#1a2e5a]">
            <ArrowLeft className="w-4 h-4" /> 목록으로
          </Link>
        </div>
        <article className="bg-white rounded-xl shadow-lg">
          <header className="px-8 py-6 border-b">
            <h1 className="text-xl font-bold text-[#1a2e5a]">AVF 재수술 증례</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> 고진
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> 2026.02.08
              </div>
            </div>
          </header>
          <div className="p-8 prose max-w-none">
            <p>환자 정보: 65세/남, ESRD. 2년 전 시행한 L-RCA AVF가 혈전으로 막혀 내원. 재개통술 및 협착 부위 교정 시행함.</p>
            <p>첨부된 이미지를 참고하여 의견 부탁드립니다.</p>
            {/* 첨부파일 영역 */}
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold">첨부파일</h3>
              <div className="flex items-center gap-2 mt-2">
                <Download className="w-4 h-4" />
                <a href="#" className="text-sm text-[#2e5aa7] hover:underline">pre-op_angiogram.jpg</a>
              </div>
            </div>
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
