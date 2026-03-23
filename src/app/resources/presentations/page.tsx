import { resources } from "@/lib/data"; // 학술자료 데이터를 가져옵니다
import { FileText, Download } from "lucide-react";

export default function ResourcesPage() {
  // 학술자료 중 '발표자료' 카테고리만 필터링 (필요 시 사용)
  const presentationData = resources?.filter(item => item.category === "발표자료") || resources;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 min-h-[600px]">
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-[#1a2b4b] pb-4">학술 자료실 (발표자료)</h1>
      
      {!presentationData || presentationData.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg text-gray-400">
          등록된 학술 자료가 없습니다.
        </div>
      ) : (
        <div className="grid gap-4">
          {presentationData.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="w-6 h-6 text-[#1a2b4b]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                  <div className="flex gap-3 mt-1 text-sm text-gray-400">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.fileSize || "PDF"}</span>
                  </div>
                </div>
              </div>
              
              <button className="mt-4 md:mt-0 flex items-center gap-2 bg-[#1a2b4b] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#0f1d3a] transition-colors">
                <Download size={16} />
                자료 다운로드
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
