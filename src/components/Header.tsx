"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== "undefined") {
          setIsLoggedIn(localStorage.getItem("ham_auth") === "1");
          setIsAdmin(localStorage.getItem("ham_admin") === "1");
        }
      } catch {}
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ham_auth");
    localStorage.removeItem("ham_admin");
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <header className="bg-[#1a2b4b] text-white shadow-md">
      {/* 최상단 유틸리티 메뉴 */}
      <div className="max-w-7xl mx-auto px-4 h-10 flex justify-end items-center space-x-6 text-sm border-b border-white/10">
        <Link href="/" className="hover:text-gray-300">HOME</Link>
        {isLoggedIn ? (
          <>
            {isAdmin && <Link href="/admin" className="text-yellow-400 font-bold">관리자</Link>}
            <button onClick={handleLogout} className="hover:text-gray-300">로그아웃</button>
          </>
        ) : (
          <>
            {/* ✅ 회원가입 경로는 루트(/) 바로 아래에 있으니 그대로 둡니다 */}
            <Link href="/signup" className="hover:text-gray-300">회원가입</Link>
            <Link href="/login" className="hover:text-gray-300">로그인</Link>
          </>
        )}
      </div>

      {/* 메인 로고 및 네비게이션 */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        {/* 로고 영역 */}
        <Link href="/" className="flex items-center space-x-3">
          <Image 
            src="/logo.jpg" 
            alt="HAM Logo" 
            width={60} 
            height={60} 
            className="rounded-full bg-white p-1" 
          />
          <div className="flex flex-col">
            <span className="text-xs font-light tracking-widest text-gray-300">대한혈관외과학회</span>
            <span className="text-lg font-bold tracking-tight">혈액투석길 연구회 (HAM)</span>
          </div>
        </Link>

        {/* ✅ 이미지 속 실제 폴더 경로(events/schedule 등)에 맞춰 모두 수정했습니다! */}
        <nav className="hidden md:flex space-x-8 font-medium">
          {/* introduction은 about 폴더 안에 없으므로, 루트 아래에 있다면 /introduction */}
          <Link href="/introduction" className="hover:text-blue-300">연구회 소개</Link>
          
          {/* 💡 notice는 news 폴더 안에 있으므로 /news/notice 가 정답입니다! */}
          <Link href="/news/notice" className="hover:text-blue-300">공지/소식</Link>
          
          {/* 💡 schedule은 events 폴더 안에 있으므로 /events/schedule 이 정답입니다! */}
          <Link href="/events/schedule" className="hover:text-blue-300">학술행사</Link>
          
          {/* 💡 resources는 폴더 안에 presentations 페이지로 연결합니다 */}
          <Link href="/resources/presentations" className="hover:text-blue-300">학술자료</Link>
          
          {/* 💡 members는 폴더 안에 board 페이지로 연결합니다 */}
          <Link href="/members/board" className="hover:text-blue-300">회원공간</Link>
        </nav>
      </div>
    </header>
  );
}
