"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
      { label: "회원가입 안내", href: "/members/join" },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setIsMobileOpen(false);
    setOpenMobileMenu(null);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== "undefined") {
          setIsLoggedIn(sessionStorage.getItem("ham_auth") === "1");
          setIsAdmin(sessionStorage.getItem("ham_admin") === "1");
        }
      } catch {}
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("ham_auth");
    sessionStorage.removeItem("ham_admin");
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  // 마우스가 메뉴 영역에 들어올 때 — 딜레이 타이머 취소 후 열기
  const handleMouseEnter = useCallback((label: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpenDropdown(label);
  }, []);

  // 마우스가 메뉴 영역을 벗어날 때 — 약간의 딜레이 후 닫기 (하위 메뉴로 이동 시 깜빡임 방지)
  const handleMouseLeave = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }, []);

  // 현재 경로가 해당 메뉴 하위에 속하는지 확인
  const isActiveMenu = (item: typeof navItems[0]) =>
    item.children.some((c) => pathname.startsWith(c.href));

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
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
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
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              {/* 상위 메뉴 — 클릭 시 첫 번째 하위 페이지로 이동, 현재 활성 메뉴는 밑줄 표시 */}
              <Link
                href={item.children[0]?.href ?? item.href}
                className={`flex items-center gap-1 px-3 py-2 rounded transition-colors
                  ${isActiveMenu(item)
                    ? "text-blue-300 bg-white/10"
                    : "hover:bg-white/10 hover:text-blue-300"
                  }`}
              >
                {item.label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === item.label ? "rotate-180" : ""
                  }`}
                />
              </Link>

              {/* 드롭다운 패널 */}
              <div
                className={`absolute top-full left-0 pt-1 w-44 transition-all duration-150 ${
                  openDropdown === item.label
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-4 py-2.5 text-sm transition-colors border-b border-gray-50 last:border-0
                        ${pathname === child.href || pathname.startsWith(child.href + "/")
                          ? "bg-[#1a2b4b] text-white font-semibold"
                          : "hover:bg-[#1a2b4b] hover:text-white"
                        }`}
                      onClick={() => setOpenDropdown(null)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
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
                className={`w-full flex items-center justify-between px-6 py-3.5 text-sm font-semibold transition-colors border-b border-white/5
                  ${isActiveMenu(item) ? "text-blue-300 bg-white/10" : "hover:bg-white/10"}`}
                onClick={() => setOpenMobileMenu(openMobileMenu === item.label ? null : item.label)}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openMobileMenu === item.label ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openMobileMenu === item.label && (
                <div className="bg-[#162038]">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-10 py-3 text-sm transition-colors border-b border-white/5 last:border-0
                        ${pathname === child.href || pathname.startsWith(child.href + "/")
                          ? "text-blue-300 font-semibold bg-white/10"
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                        }`}
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
