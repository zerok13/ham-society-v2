"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageSquare, Send, Trash2, LogIn } from "lucide-react";
import Link from "next/link";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: { name: string };
}

interface Props {
  postId: number;
}

export default function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myName, setMyName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 로그인 상태 확인
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const auth = sessionStorage.getItem("ham_auth") === "1";
        setIsLoggedIn(auth);
        if (auth) {
          const raw = document.cookie
            .split("; ")
            .find((c) => c.startsWith("ham_demo_user="));
          if (raw) {
            const user = JSON.parse(decodeURIComponent(raw.split("=")[1]));
            setMyName(user.name ?? null);
          }
        }
      }
    } catch {}
  }, []);

  // 댓글 목록 로드
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/board/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments ?? []);
      }
    } catch {}
    finally { setLoading(false); }
  }, [postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // 댓글 등록
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/board/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: text.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setText("");
      } else {
        const data = await res.json();
        setError(data.error === "unauthorized" ? "로그인이 필요합니다." : "댓글 등록에 실패했습니다.");
      }
    } catch {
      setError("댓글 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    setDeleting(commentId);
    try {
      const res = await fetch(`/api/board/comments?id=${commentId}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch {}
    finally { setDeleting(null); }
  };

  return (
    <section className="border-t mt-0">
      {/* 댓글 헤더 */}
      <div className="px-6 md:px-8 py-4 bg-gray-50 border-b flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-[#2e5aa7]" />
        <span className="font-semibold text-[#1a2e5a] text-sm">
          댓글 <span className="text-[#2e5aa7]">{comments.length}</span>
        </span>
      </div>

      {/* 댓글 목록 */}
      <div className="divide-y">
        {loading ? (
          <div className="px-6 md:px-8 py-6 text-center text-gray-400 text-sm">
            <div className="animate-spin w-5 h-5 border-2 border-[#1a2e5a] border-t-transparent rounded-full mx-auto mb-2" />
            댓글을 불러오는 중...
          </div>
        ) : comments.length === 0 ? (
          <div className="px-6 md:px-8 py-8 text-center text-gray-400 text-sm">
            첫 번째 댓글을 작성해 보세요.
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="px-6 md:px-8 py-4 flex gap-3 group hover:bg-gray-50 transition-colors">
              {/* 아바타 */}
              <div className="w-8 h-8 rounded-full bg-[#1a2e5a] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                {c.author.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-[#1a2e5a]">{c.author.name}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleString("ko-KR", {
                      year: "numeric", month: "2-digit", day: "2-digit",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                  {c.content}
                </p>
              </div>
              {/* 본인 댓글 삭제 버튼 */}
              {isLoggedIn && myName === c.author.name && (
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  disabled={deleting === c.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-gray-400 hover:text-red-500 p-1 rounded"
                  title="댓글 삭제"
                >
                  {deleting === c.id ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* 댓글 작성 영역 */}
      <div className="px-6 md:px-8 py-5 bg-gray-50 border-t">
        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-[#1a2e5a] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
              {myName?.charAt(0) ?? "나"}
            </div>
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="댓글을 입력하세요..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2e5aa7] focus:border-transparent resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(e as any);
                }}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">Ctrl+Enter로 등록</span>
                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1a2e5a] text-white text-sm font-medium rounded-lg hover:bg-[#0f1d3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  등록
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-sm text-gray-500">댓글을 작성하려면 로그인이 필요합니다.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1a2e5a] text-white text-sm font-medium rounded-lg hover:bg-[#0f1d3a] transition-colors"
            >
              <LogIn className="w-4 h-4" />
              로그인
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
