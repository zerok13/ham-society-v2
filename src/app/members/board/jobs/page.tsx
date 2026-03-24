"use client";

import { PageLayout } from "@/components/PageLayout";
import { Users, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  author: { name: string };
  createdAt: string;
  boardType: string;
}

export default function BoardJobsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(sessionStorage.getItem("ham_auth") === "1");
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/board/list?type=jobs&page=${page}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.items || []);
          setTotal(data.total || 0);
        } else {
          setPosts([]);
          setTotal(0);
        }
      } catch {
        setPosts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  const filteredPosts = posts.filter((p) =>
    search === "" || p.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <PageLayout title="구인/구직" subtitle="Job Board">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          💼 채용 정보 및 구직 정보를 자유롭게 공유하는 게시판입니다.
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-500">
            <Users className="w-5 h-5" />
            <span className="text-sm">총 {total}개의 글</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="제목 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2e5a] outline-none"
              />
            </div>
            {isLoggedIn && (
              <Link
                href="/members/board/jobs/new"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#c41e3a] text-white text-sm rounded-lg hover:bg-[#a01830] transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> 글쓰기
              </Link>
            )}
          </div>
        </div>

        {!isLoggedIn && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-center gap-2">
            <span>💡 글쓰기는 로그인 후 이용 가능합니다.</span>
            <Link href="/login" className="underline font-semibold">로그인</Link>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-gray-400">
              <div className="animate-spin w-8 h-8 border-2 border-[#1a2e5a] border-t-transparent rounded-full mx-auto mb-3" />
              불러오는 중...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{search ? "검색 결과가 없습니다." : "등록된 구인/구직 정보가 없습니다."}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-[#1a2e5a] w-12">번호</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#1a2e5a]">제목</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#1a2e5a] w-24 hidden sm:table-cell">작성자</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#1a2e5a] w-28 hidden sm:table-cell">작성일</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPosts.map((post, idx) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center text-gray-400">{total - (page - 1) * 20 - idx}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/members/board/jobs/${post.id}`}
                        className="hover:text-[#c41e3a] hover:underline font-medium"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{post.author?.name || "익명"}</td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                      {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  p === page ? "bg-[#1a2e5a] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
