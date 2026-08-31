"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Calendar, MapPin, Clock, ChevronRight, ClipboardList } from "lucide-react";

const POPUP_STORAGE_KEY = "ham_popup_closed_11th";

export function AnnouncementPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  useEffect(() => {
    // 오늘 하루 닫기 여부 확인
    const stored = localStorage.getItem(POPUP_STORAGE_KEY);
    if (stored) {
      const { closedDate } = JSON.parse(stored);
      const today = new Date().toDateString();
      if (closedDate === today) {
        return; // 오늘 닫은 경우 표시 안 함
      }
    }
    // 0.5초 딜레이 후 표시 (페이지 로드 후 자연스럽게)
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (doNotShowToday) {
      localStorage.setItem(
        POPUP_STORAGE_KEY,
        JSON.stringify({ closedDate: new Date().toDateString() })
      );
    }
    setIsVisible(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-label="제11회 HAM 개최 공지"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Popup Card */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        {/* 상단 헤더 — 진한 네이비 */}
        <div className="rounded-t-2xl bg-[#1a2e5a] px-6 pt-6 pb-5 text-white">
          {/* 닫기 버튼 */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/25 transition-colors"
            aria-label="팝업 닫기"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* 뱃지 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#c41e3a] text-white text-xs font-bold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              개최 예정 공지
            </span>
          </div>

          {/* 제목 */}
          <h2 className="text-xl font-bold leading-snug mb-1">
            제 11회 대한혈관외과학회
            <br />
            혈액투석길 연구회
          </h2>
          <p className="text-white/70 text-sm font-light">
            The 11th KSVS Hemodialysis Access Meeting (HAM)
          </p>
        </div>

        {/* 본문 — 흰 배경 */}
        <div className="bg-white px-6 py-5 space-y-4">
          {/* 행사 정보 */}
          <div className="space-y-3">
            <InfoRow icon={<Calendar className="w-4 h-4 text-[#2e5aa7]" />} label="일시">
              2026년 10월 18일 (일)
            </InfoRow>
            <InfoRow icon={<Clock className="w-4 h-4 text-[#2e5aa7]" />} label="시간">
              08:55 ~ 17:00
            </InfoRow>
            <InfoRow icon={<MapPin className="w-4 h-4 text-[#2e5aa7]" />} label="장소">
              세종충남대학교병원 4층 도담홀
            </InfoRow>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-100" />

          {/* 세션 요약 */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              주요 세션
            </p>
            <ul className="space-y-1.5 text-sm text-gray-700">
              {[
                "Session I — CVC-related Complications",
                "Special Session — IRB DCB Registry",
                "Session II — CVC Cases",
                "Session III — Cephalic Arch Stenosis",
                "Session IV — Cephalic Arch Cases",
              ].map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#c41e3a] flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 버튼 2개: 프로그램 + 사전등록 */}
          <div className="flex gap-2">
            <Link
              href="/events/conference/11"
              onClick={handleClose}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#1a2e5a] hover:bg-[#2e5aa7] text-white font-semibold text-sm transition-colors"
            >
              프로그램 보기
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/events/register"
              onClick={handleClose}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#c41e3a] hover:bg-[#a01830] text-white font-semibold text-sm transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              사전등록
            </Link>
          </div>
        </div>

        {/* 하단 — 오늘 하루 닫기 */}
        <div className="rounded-b-2xl bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={doNotShowToday}
              onChange={(e) => setDoNotShowToday(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#1a2e5a] cursor-pointer"
            />
            <span className="text-xs text-gray-500">오늘 하루 보지 않기</span>
          </label>
          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 헬퍼 컴포넌트 ──────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-gray-400 font-medium block leading-none mb-0.5">
          {label}
        </span>
        <span className="text-sm font-semibold text-gray-800">{children}</span>
      </div>
    </div>
  );
}
