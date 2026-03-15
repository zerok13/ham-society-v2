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
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo.jpg" alt="HAM Logo" width={60} height={60} className="rounded-full bg-white p-1" />
          <div className="flex flex-col">
            <span className="text-xs font-light tracking-widest text-gray-300">대한혈관외과학회</span>
            <span className="text-lg font-bold tracking-tight">혈액투석길 연구회 (HAM)</span>
          </div>
        </Link>
        <nav className="hidden md:flex space-x-8 font-medium">
          <Link href="/about/introduction" className="hover:text-blue-300">연구회 소개</Link>
          <Link href="/news" className="hover:text-blue-300">공지/소식</Link>
          <Link href="/events/schedule" className="hover:text-blue-300">학술행사</Link>
          <Link href="/resources" className="hover:text-blue-300">학술자료</Link>
          <Link href="/members" className="hover:text-blue-300">회원공간</Link>
        </nav>
      </div>
    </header>
  );
}
