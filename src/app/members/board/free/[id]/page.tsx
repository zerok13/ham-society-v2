"use client";

import { PageLayout } from "@/components/PageLayout";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import CommentSection from "@/components/CommentSection";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  boardType: string;
  author: { name: string };
  attachments?: { id: number; key: string; filename: string }[];
}

export default function FreeBoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/board/detail?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        } else if (res.status === 404) {
          setNotFound(true);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  if (loading) {
    return (
      <PageLayout title="자유게시판" subtitle="Free Board">
        <div className="text-center py-20 text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-[#1a2e5a] border-t-transparent rounded-full mx-auto mb-3" />
          불러오는 중...
        </div>
      </PageLayout>
    );
  }

  if (notFound || !post) {
    return (
      <PageLayout title="자유게시판" subtitle="Free Board">
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-4">게시글을 찾을 수 없습니다.</p>
          <Link href="/members/board/free" className="text-[#1a2e5a] hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="자유게시판" subtitle="Free Board">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/members/board/free"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a2e5a] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 목록으로
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 헤더 */}
          <div className="border-b p-6 md:p-8">
            <h1 className="text-xl md:text-2xl font-bold text-[#1a2e5a] mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author?.name || "익명"}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleString("ko-KR")}
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="p-6 md:p-8 min-h-[200px]">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* 첨부파일 */}
          {post.attachments && post.attachments.length > 0 && (
            <div className="border-t p-6 md:p-8 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">첨부파일</h3>
              <ul className="space-y-2">
                {post.attachments.map((att) => (
                  <li key={att.id}>
                    <a
                      href={`/api/r2/get-url?key=${encodeURIComponent(att.key)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2e5aa7] hover:underline text-sm flex items-center gap-2"
                    >
                      📎 {att.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {/* 댓글 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
          <CommentSection postId={post.id} />
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center mt-6">
          <Link
            href="/members/board/free"
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            목록
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
