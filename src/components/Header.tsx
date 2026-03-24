"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";

// 메뉴 구조 정의
const navItems = [
  {
    label: "연구회 소개",
    href: "/about/introduction",
    children: [
      { label: "연구회 소개", href: "/about/introduction" },
      { label: "회장 인사말", href: "/about/greeting" },
      { label: "임원진", href: "/about/executives" },
      { label: "연혁", href: "/about/history" },
    ],
  },
  {
    label: "공지/소식",
    href: "/news/notice",
    children: [
      { label: "공지사항", href: "/news/notice" },
      { label: "연구회 소식", href: "/news/updates" },
    ],
  },
  {
    label: "학술행사",
    href: "/events/schedule",
    children: [
      { label: "행사 일정", href: "/events/schedule" },
      { label: "학술대회", href: "/events/conference" },
      { label: "연수교육", href: "/events/education" },
    ],
  },
  {
    label: "학술자료",
    href: "/resources/presentations",
    children: [
      { label: "발표자료", href: "/resources/presentations" },
      { label: "연구자료실", href: "/resources/research" },
    ],
  },
  {
    label: "회원공간",
    href: "/members/board",
    children: [
      { label: "회원 게시판", href: "/members/board" },
      { label: "자유게시판", href: "/members/board/free" },
      { label: "증례 토론", href: "/members/board/cases" },
      { label: "구인/구직", href: "/members/board/jobs" },
      { label: "회원가입 안내", href: "/members/join" },
    ],
  },
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ham_auth");
    localStorage.removeItem("ham_admin");
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <header className="bg-[#1a2b4b] text-white shadow-md relative z-50">
      {/* 상단 유틸리티 바 */}
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

      {/* 메인 헤더 */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center" ref={dropdownRef}>
        {/* 로고 */}
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

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-1 font-medium">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 rounded hover:bg-white/10 hover:text-blue-300 transition-colors"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
                onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
              >
                {item.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`} />
              </button>

              {/* 드롭다운 메뉴 */}
              <div
                className={`absolute top-full left-0 mt-1 w-44 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                  openDropdown === item.label ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-4 py-2.5 text-sm hover:bg-[#1a2b4b] hover:text-white transition-colors border-b border-gray-50 last:border-0"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          className="md:hidden p-2 rounded hover:bg-white/10 transition-colors"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="모바일 메뉴"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 모바일 드로어 메뉴 */}
      {isMobileOpen && (
        <div className="md:hidden bg-[#0f1d3a] border-t border-white/10 max-h-[70vh] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.label}>
              <button
                type="button"
                className="w-full flex items-center justify-between px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors border-b border-white/5"
                onClick={() => setOpenMobileMenu(openMobileMenu === item.label ? null : item.label)}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${openMobileMenu === item.label ? "rotate-180" : ""}`}
                />
              </button>
              {openMobileMenu === item.label && (
                <div className="bg-[#162038]">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-10 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                      onClick={() => {
                        setIsMobileOpen(false);
                        setOpenMobileMenu(null);
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* 모바일 로그인/로그아웃 */}
          <div className="px-6 py-4 border-t border-white/10 flex gap-3">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex-1 text-center py-2 bg-yellow-500 text-black rounded-lg text-sm font-bold"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    관리자
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setIsMobileOpen(false); }}
                  className="flex-1 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="flex-1 text-center py-2 border border-white/30 rounded-lg text-sm hover:bg-white/10 transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  회원가입
                </Link>
                <Link
                  href="/login"
                  className="flex-1 text-center py-2 bg-[#c41e3a] rounded-lg text-sm font-semibold hover:bg-[#a01830] transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  로그인
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
