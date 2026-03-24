"use client";

import { PageLayout } from "@/components/PageLayout";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default function NewJobPostPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("ham_auth") === "1";
      setIsLoggedIn(loggedIn);
      if (!loggedIn) {
        alert("로그인 후 이용 가능합니다.");
        router.push("/login");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/board/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, boardType: "jobs" }),
      });
      if (res.ok) {
        alert("게시글이 등록되었습니다.");
        router.push("/members/board/jobs");
      } else {
        const body = await res.json().catch(() => ({}));
        if (res.status === 403) throw new Error("로그인이 필요합니다.");
        throw new Error(body.error || "등록 실패");
      }
    } catch (e: any) {
      alert(e.message || "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <PageLayout title="구인/구직 글쓰기" subtitle="Job Board">
      <div className="max-w-4xl mx-auto">
        <Link href="/members/board/jobs" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a2e5a] mb-6">
          <ArrowLeft className="w-4 h-4" /> 목록으로
        </Link>
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          💼 구인 또는 구직 정보를 상세히 작성해 주세요. (기관명, 모집분야, 연락처 포함 권장)
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              제목 <span className="text-[#c41e3a]">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] outline-none"
              placeholder="예: [구인] ○○외과 혈관외과 전문의 모집"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              내용 <span className="text-[#c41e3a]">*</span>
            </label>
            <textarea
              id="content"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] outline-none resize-y"
              placeholder="상세 내용, 모집 요건, 연락처 등을 입력해주세요"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Link href="/members/board/jobs" className="px-6 py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">취소</Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 text-sm bg-[#c41e3a] text-white rounded-lg hover:bg-[#a01830] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isLoading ? "등록 중..." : "등록"}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
