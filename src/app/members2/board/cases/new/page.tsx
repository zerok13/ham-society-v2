import { PageLayout } from "@/components/PageLayout";

export default function NewCasePage() {
  return (
    <PageLayout title="새 증례 올리기" subtitle="증례 토론">
      <div className="max-w-4xl mx-auto">
        <form className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input id="title" type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="증례 제목을 입력하세요" />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">내용</label>
            <textarea id="content" rows={10} className="w-full px-4 py-2 border rounded-lg" placeholder="환자 정보, 수술 내용, 질문 등을 입력하세요" />
          </div>
          <div>
            <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-2">첨부파일</label>
            <input id="attachment" type="file" multiple className="block w-full text-sm" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-5 py-2 text-sm bg-gray-200 rounded-lg">취소</button>
            <button type="submit" className="px-5 py-2 text-sm bg-[#1a2e5a] text-white rounded-lg">등록</button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
