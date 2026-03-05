import { PageLayout } from "@/components/PageLayout";

export default function NewJobPage() {
  return (
    <PageLayout title="채용공고 등록" subtitle="구인/구직">
      <div className="max-w-4xl mx-auto">
        <form className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input id="title" type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="예: 혈관외과 전문의 채용" />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">기관명</label>
            <input id="company" type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="예: 브이외과" />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">마감일</label>
            <input id="deadline" type="date" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">상세 내용</label>
            <textarea id="content" rows={10} className="w-full px-4 py-2 border rounded-lg" placeholder="주요 업무, 지원 방법 등을 입력하세요" />
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
