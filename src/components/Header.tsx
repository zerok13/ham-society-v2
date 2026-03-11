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
            <Link href="/signup" className="hover:text-gray-300">회원가입</Link>
            <Link href="/login" className="hover:text-gray-300">로그인</Link>
          </>
        )}
      </div>

      {/* 메인 로고 및 네비게이션 */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
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

        {/* ✅ 폴더 구조(about/introduction, events/schedule 등)를 완벽하게 반영했습니다! */}
        <nav className="hidden md:flex space-x-8 font-medium">
          {/* introduction은 about 폴더 안에 있습니다 */}
          <Link href="/about/introduction" className="hover:text-blue-300">연구회 소개</Link>
          
          {/* 공지사항은 news 폴더 바로 아래에 있습니다 */}
          <Link href="/news" className="hover:text-blue-300">공지/소식</Link>
          
          {/* schedule은 events 폴더 안에 있습니다 */}
          <Link href="/events/schedule" className="hover:text-blue-300">학술행사</Link>
          
          {/* 학술자료 폴더 */}
          <Link href="/resources" className="hover:text-blue-300">학술자료</Link>
          
          {/* 회원공간 폴더 */}
          <Link href="/members" className="hover:text-blue-300">회원공간</Link>
        </nav>
      </div>
    </header>
  );
}
