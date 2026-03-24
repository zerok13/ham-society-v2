"use client";

import { PageLayout } from "@/components/PageLayout";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default function NewCasePostPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = sessionStorage.getItem("ham_auth") === "1";
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
        body: JSON.stringify({ title, content, boardType: "cases" }),
      });
      if (res.ok) {
        alert("게시글이 등록되었습니다.");
        router.push("/members/board/cases");
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
    <PageLayout title="증례 토론 글쓰기" subtitle="Case Discussion">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/members/board/cases"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a2e5a] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 목록으로
        </Link>
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
              placeholder="증례 제목을 입력하세요"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              증례 내용 <span className="text-[#c41e3a]">*</span>
            </label>
            <textarea
              id="content"
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] outline-none resize-y"
              placeholder="증례 내용, 질문사항 등을 자세히 입력해주세요"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Link href="/members/board/cases" className="px-6 py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">취소</Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 text-sm bg-[#1a2e5a] text-white rounded-lg hover:bg-[#0f1d3a] disabled:opacity-50"
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
