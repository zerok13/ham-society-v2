"use client";

import { PageLayout } from "@/components/PageLayout";
import Link from "next/link";
import {
  Lock,
  MessageSquare,
  FileText,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const boardCategories = [
  {
    id: 1,
    title: "자유게시판",
    description: "회원 간 자유로운 소통과 정보 교류를 위한 게시판입니다.",
    icon: MessageSquare,
    posts: 45,
    href: "/members/board/free",
    color: "from-[#1a2e5a] to-[#2e5aa7]",
  },
  {
    id: 2,
    title: "증례 토론",
    description: "임상 증례 공유 및 토론을 위한 게시판입니다.",
    icon: FileText,
    posts: 28,
    href: "/members/board/cases",
    color: "from-[#2e5aa7] to-[#4a90c9]",
  },
];

export default function MemberBoardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        setIsLoggedIn(sessionStorage.getItem("ham_auth") === "1");
      }
    } catch {}
  }, []);

  return (
    <PageLayout title="회원 게시판" subtitle="Member Board" imageIndex={1}>
      <div className="max-w-4xl mx-auto">
        {!isLoggedIn ? (
          <div className="bg-gradient-to-r from-[#1a2e5a] to-[#2e5aa7] rounded-xl p-8 mb-12 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">회원 전용 서비스</h2>
            <p className="text-white/80 mb-6">
              회원 게시판은 로그인 후 이용할 수 있습니다.<br />
              로그인 후 다양한 회원 서비스를 이용하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-block bg-white text-[#1a2e5a] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                회원가입
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#1a2e5a] mb-4">게시판 바로가기</h3>
            <div className="grid gap-4">
              {boardCategories.map((board) => (
                <Link
                  key={board.id}
                  href={board.href}
                  className="group block bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${board.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <board.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#1a2e5a]">{board.title}</h4>
                        <p className="text-gray-500 text-sm">{board.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{board.posts}개의 글</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#c41e3a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-[#c41e3a]" />
            </div>
            <div>
              <h4 className="font-bold text-[#1a2e5a] mb-2">이용 안내</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 게시판 이용은 로그인 후 가능합니다.</li>
                <li>• 게시글 작성 시 회원 윤리 규정을 준수해 주세요.</li>
                <li>• 부적절한 게시물은 사전 통보 없이 삭제될 수 있습니다.</li>
                <li>• 개인정보 보호를 위해 민감한 정보는 게시하지 마세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
