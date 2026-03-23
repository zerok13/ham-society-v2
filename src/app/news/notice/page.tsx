import { notices } from "@/lib/data";
import Link from "next/link";

export default function NoticePage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 min-h-[600px]">
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-[#1a2b4b] pb-4">공지 및 소식</h1>
      
      {/* 데이터가 없을 때 처리 */}
      {!notices || notices.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg text-gray-400">
          등록된 공지사항이 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50 text-gray-600">
                <th className="py-4 px-4 font-bold w-16 text-center">번호</th>
                <th className="py-4 px-4 font-bold">제목</th>
                <th className="py-4 px-4 font-bold w-24 text-center">작성자</th>
                <th className="py-4 px-4 font-bold w-32 text-center">날짜</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-center text-gray-500">{notices.length - index}</td>
                  <td className="py-4 px-4">
                    <Link href={`/news/notice/${item.id}`} className="font-medium hover:text-[#1a2b4b] hover:underline">
                      {item.title}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600">{item.author || "관리자"}</td>
                  <td className="py-4 px-4 text-center text-sm text-gray-400">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
