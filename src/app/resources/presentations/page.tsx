"use client";

import { resources } from "@/lib/data";
import { FileText, Download, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Presentation {
  id: number;
  title: string;
  author: string;
  date: string;
  type: string;
  key: string;
  downloads: number;
  fileSize?: string;
  category?: string;
}

export default function ResourcesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("전체");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem("ham_auth") === "1");
    }
  }, []);

  useEffect(() => {
    const fetchPresentations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/presentations/list");
        if (res.ok) {
          const data = await res.json();
          setPresentations(data.presentations || []);
        } else {
          // DB 없을 때 정적 데이터 fallback
          setPresentations(
            resources.map((r, i) => ({
              id: r.id,
              title: r.title,
              author: "HAM",
              date: r.date,
              type: r.category || "발표자료",
              key: "",
              downloads: 0,
              fileSize: r.fileSize,
            }))
          );
        }
      } catch {
        setPresentations(
          resources.map((r) => ({
            id: r.id,
            title: r.title,
            author: "HAM",
            date: r.date,
            type: r.category || "발표자료",
            key: "",
            downloads: 0,
            fileSize: r.fileSize,
          }))
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPresentations();
  }, []);

  const filterTypes = ["전체", "학술대회", "가이드라인", "프로토콜", "발표자료"];
  const filtered = filter === "전체" ? presentations : presentations.filter((p) => p.type === filter);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 min-h-[600px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold border-b-2 border-[#1a2b4b] pb-4 md:border-0 md:pb-0">
          학술 자료실
        </h1>
        {isLoggedIn && (
          <Link
            href="/resources/upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2b4b] text-white text-sm rounded-lg hover:bg-[#0f1d3a] transition-colors"
          >
            자료 업로드
          </Link>
        )}
      </div>

      {/* 필터 탭 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === type
                ? "bg-[#1a2b4b] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-[#1a2b4b] border-t-transparent rounded-full mx-auto mb-3" />
          불러오는 중...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg text-gray-400">
          등록된 학술 자료가 없습니다.
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#1a2b4b]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-[#1a2b4b]/10 text-[#1a2b4b] text-xs rounded font-medium">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                  <div className="flex gap-3 mt-1 text-sm text-gray-400">
                    <span>{item.date}</span>
                    {item.fileSize && <><span>•</span><span>{item.fileSize}</span></>}
                    {item.downloads > 0 && <><span>•</span><span>다운로드 {item.downloads}회</span></>}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex-shrink-0">
                {!isLoggedIn ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>로그인 필요</span>
                  </div>
                ) : item.key ? (
                  <a
                    href={`/api/r2/get-url?key=${encodeURIComponent(item.key)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#1a2b4b] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#0f1d3a] transition-colors"
                  >
                    <Download size={16} />
                    다운로드
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">파일 준비 중</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 비로그인 안내 */}
      {!isLoggedIn && (
        <div className="mt-8 p-6 bg-[#1a2b4b]/5 border border-[#1a2b4b]/20 rounded-xl text-center">
          <Lock className="w-8 h-8 mx-auto mb-3 text-[#1a2b4b] opacity-50" />
          <p className="text-gray-600 mb-4">자료 다운로드는 회원 로그인 후 가능합니다.</p>
          <div className="flex justify-center gap-3">
            <Link href="/login" className="px-5 py-2 bg-[#1a2b4b] text-white rounded-lg text-sm font-medium hover:bg-[#0f1d3a]">
              로그인
            </Link>
            <Link href="/signup" className="px-5 py-2 border border-[#1a2b4b] text-[#1a2b4b] rounded-lg text-sm font-medium hover:bg-[#1a2b4b]/5">
              회원가입
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
