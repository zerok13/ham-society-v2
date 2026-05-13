"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageLayout } from "@/components/PageLayout";
import { galleryImages } from "@/lib/data";

// ─── 타입 ─────────────────────────────────────────────────────
interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  localPath: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: number;
  mimeType: string;
}

const staticItems: GalleryItem[] = galleryImages.map((img) => ({
  id: `static_${img.id}`,
  title: img.title,
  description: img.date,
  filename: img.src,
  originalName: img.src.split("/").pop() || img.src,
  localPath: img.src,
  uploadedBy: "관리자",
  uploadedAt: img.date,
  fileSize: 0,
  mimeType: "image/jpeg",
}));

function formatBytes(bytes: number) {
  if (bytes === 0) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  if (!iso) return "";
  if (/^\d{4}\.\d{2}/.test(iso)) return iso;
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch { return iso; }
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────
export default function GalleryPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 라이트박스
  const [lightbox, setLightbox] = useState<{ open: boolean; idx: number }>({ open: false, idx: 0 });

  // 업로드 모달
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── 로그인 상태 확인 ────────────────────────────────────────
  useEffect(() => {
    const check = () => {
      try {
        const auth = sessionStorage.getItem("ham_auth") === "1";
        const admin = sessionStorage.getItem("ham_admin") === "1";
        setIsLoggedIn(auth);
        setIsAdmin(admin);
        if (auth) {
          const raw = document.cookie.split("; ").find((r) => r.startsWith("ham_demo_user="));
          if (raw) {
            const u = JSON.parse(decodeURIComponent(raw.split("=").slice(1).join("=")));
            setUserName(u.name || u.email || "");
          }
        }
      } catch {}
      setAuthChecked(true);
    };
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  // ── 갤러리 목록 불러오기 ────────────────────────────────────
  const fetchGallery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.items)) {
          setItems([...data.items, ...staticItems]);
          return;
        }
      }
      setItems(staticItems);
    } catch {
      setItems(staticItems);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authChecked && isLoggedIn) fetchGallery();
  }, [authChecked, isLoggedIn, fetchGallery]);

  // ── 키보드 이벤트 (라이트박스) ──────────────────────────────
  useEffect(() => {
    if (!lightbox.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox({ open: false, idx: 0 });
      if (e.key === "ArrowRight") setLightbox((p) => ({ open: true, idx: (p.idx + 1) % items.length }));
      if (e.key === "ArrowLeft") setLightbox((p) => ({ open: true, idx: (p.idx - 1 + items.length) % items.length }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox.open, items.length]);

  // ── 파일 선택 ────────────────────────────────────────────────
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) { setUploadError("이미지 파일(JPG, PNG, GIF, WEBP)만 업로드 가능합니다."); return; }
    if (file.size > 20 * 1024 * 1024) { setUploadError("파일 크기는 20MB 이하여야 합니다."); return; }
    setUploadFile(file);
    setUploadError("");
    if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (e) => setUploadPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── 업로드 실행 ──────────────────────────────────────────────
  const handleUpload = async () => {
    if (!uploadFile) return;
    if (!uploadTitle.trim()) { setUploadError("제목을 입력하세요."); return; }
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      fd.append("title", uploadTitle.trim());
      fd.append("description", uploadDesc.trim());
      const res = await fetch("/api/gallery", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "업로드 실패");
      setUploadOpen(false);
      setUploadFile(null);
      setUploadPreview(null);
      setUploadTitle("");
      setUploadDesc("");
      await fetchGallery();
    } catch (e: any) {
      setUploadError(e.message || "업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const closeUploadModal = () => {
    if (uploading) return;
    setUploadOpen(false);
    setUploadFile(null);
    setUploadPreview(null);
    setUploadTitle("");
    setUploadDesc("");
    setUploadError("");
  };

  // ── 삭제 ────────────────────────────────────────────────────
  const handleDelete = async (item: GalleryItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (item.id.startsWith("static_")) { alert("기본 제공 사진은 삭제할 수 없습니다."); return; }
    if (!confirm(`"${item.title}" 사진을 삭제하시겠습니까?`)) return;
    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setLightbox({ open: false, idx: 0 });
      await fetchGallery();
    } catch (e: any) { alert(e.message || "삭제 실패"); }
  };

  // ── 다운로드 ────────────────────────────────────────────────
  const handleDownload = async (item: GalleryItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      let url: string;
      if (item.id.startsWith("static_")) {
        url = item.localPath;
      } else {
        const res = await fetch(`/api/r2/get-url?key=gallery/${item.filename}`);
        const data = await res.json();
        url = data.ok && data.url ? data.url : item.localPath;
      }
      const a = document.createElement("a");
      a.href = url;
      a.download = item.originalName || item.filename;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch { alert("다운로드에 실패했습니다."); }
  };

  const currentItem = items[lightbox.idx];
  const canDelete = (item: GalleryItem) =>
    !item.id.startsWith("static_") && (isAdmin || item.uploadedBy === userName);

  // ════ 인증 확인 전 → 스피너 ════
  if (!authChecked) {
    return (
      <PageLayout title="포토갤러리" subtitle="Photo Gallery" imageIndex={0}>
        <div className="flex justify-center items-center py-32">
          <div className="w-10 h-10 border-4 border-[#1a2e5a] border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  // ════ 비로그인 → 잠금 화면 ════
  if (!isLoggedIn) {
    return (
      <PageLayout title="포토갤러리" subtitle="Photo Gallery" imageIndex={0}>
        <div className="max-w-md mx-auto text-center py-24 px-4">
          <div className="w-20 h-20 rounded-full bg-[#1a2e5a]/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#1a2e5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#1a2e5a] mb-2">로그인이 필요한 페이지입니다</h3>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            포토갤러리는 회원 전용 콘텐츠입니다.<br />
            로그인 후 사진 열람 및 다운로드가 가능합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login?redirect=/gallery"
              className="px-8 py-3 bg-[#1a2e5a] text-white rounded-lg font-semibold hover:bg-[#243d78] transition-colors text-sm">
              로그인하기
            </Link>
            <Link href="/members/join"
              className="px-8 py-3 border border-[#1a2e5a] text-[#1a2e5a] rounded-lg font-semibold hover:bg-[#1a2e5a]/5 transition-colors text-sm">
              회원가입 안내
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // ════ 로그인 → 갤러리 본문 ════
  return (
    <PageLayout title="포토갤러리" subtitle="Photo Gallery" imageIndex={0}>
      <div className="max-w-6xl mx-auto">

        {/* ── 상단 헤더 바 ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2e5a] mb-1">HAM 활동 사진</h2>
            <p className="text-gray-500 text-sm">
              사진을 클릭하면 크게 볼 수 있고, 카드 위에 마우스를 올리면 다운로드 버튼이 나타납니다.
            </p>
          </div>
          {/* ★ 업로드 버튼 — 항상 크고 눈에 띄게 */}
          <button
            onClick={() => { setUploadOpen(true); setUploadError(""); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a2e5a] text-white rounded-xl
                       hover:bg-[#243d78] active:scale-95 transition-all font-bold shadow-lg text-sm whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            사진 업로드
          </button>
        </div>

        {/* ── 갤러리 그리드 ── */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-[#1a2e5a] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">등록된 사진이 없습니다.</p>
            <p className="text-sm mt-2">위의 <strong>사진 업로드</strong> 버튼으로 첫 번째 사진을 올려보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl
                           transition-all duration-300 bg-gray-100 cursor-pointer"
                onClick={() => setLightbox({ open: true, idx })}
              >
                {/* 사진 */}
                <Image
                  src={item.localPath}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* 어두운 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* NEW 배지 */}
                {!item.id.startsWith("static_") && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-bold
                                  px-2 py-0.5 rounded-full shadow">NEW</div>
                )}

                {/* ★ 다운로드 버튼 — 호버 시 카드 우상단 */}
                <button
                  onClick={(e) => handleDownload(item, e)}
                  className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white text-[#1a2e5a]
                             rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100
                             transition-all duration-200 hover:scale-110"
                  title="다운로드"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>

                {/* 하단 제목 + 날짜 */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white
                                opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                                transition-all duration-300">
                  <p className="font-semibold text-sm leading-tight line-clamp-1">{item.title}</p>
                  <p className="text-xs text-white/70 mt-0.5">{formatDate(item.uploadedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-gray-400 text-xs">
          총 <strong className="text-gray-500">{items.length}</strong>장 &nbsp;·&nbsp;
          사진 위에 마우스를 올리면 <strong className="text-gray-500">⬇ 다운로드</strong> 버튼이 나타납니다
        </p>
      </div>

      {/* ══════════════════════════════════════════════════
          라이트박스
      ══════════════════════════════════════════════════ */}
      {lightbox.open && currentItem && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-sm"
          onClick={() => setLightbox({ open: false, idx: 0 })}
        >
          {/* 닫기 */}
          <button
            className="absolute top-4 right-4 z-20 text-white/80 hover:text-white bg-white/10
                       hover:bg-white/25 rounded-full p-2.5 transition-colors"
            onClick={() => setLightbox({ open: false, idx: 0 })}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 이전 */}
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white
                       bg-white/10 hover:bg-white/25 rounded-full p-3 transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightbox((p) => ({ open: true, idx: (p.idx - 1 + items.length) % items.length })); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 다음 */}
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white
                       bg-white/10 hover:bg-white/25 rounded-full p-3 transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightbox((p) => ({ open: true, idx: (p.idx + 1) % items.length })); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 이미지 + 정보 */}
          <div
            className="relative max-w-5xl w-full mx-16 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.localPath}
              alt={currentItem.title}
              className="max-h-[72vh] max-w-full mx-auto rounded-xl object-contain shadow-2xl block"
            />

            {/* 하단 정보 + 버튼 바 */}
            <div className="w-full mt-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-white min-w-0">
                <p className="font-bold text-lg leading-tight">{currentItem.title}</p>
                {currentItem.description && (
                  <p className="text-white/65 text-sm mt-0.5">{currentItem.description}</p>
                )}
                <p className="text-white/45 text-xs mt-1">
                  {formatDate(currentItem.uploadedAt)} · {currentItem.uploadedBy}
                  {currentItem.fileSize > 0 && ` · ${formatBytes(currentItem.fileSize)}`}
                </p>
              </div>

              {/* ★ 액션 버튼들 — 크고 명확하게 */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDownload(currentItem)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#1a2e5a]
                             rounded-xl font-bold text-sm hover:bg-gray-100 active:scale-95
                             transition-all shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  다운로드
                </button>
                {canDelete(currentItem) && (
                  <button
                    onClick={() => handleDelete(currentItem)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600
                               text-white rounded-xl font-bold text-sm active:scale-95 transition-all shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    삭제
                  </button>
                )}
              </div>
            </div>

            <p className="text-white/35 text-xs mt-3">{lightbox.idx + 1} / {items.length} &nbsp;·&nbsp; ESC 또는 배경 클릭으로 닫기</p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          업로드 모달
      ══════════════════════════════════════════════════ */}
      {uploadOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeUploadModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#1a2e5a]">
              <div className="flex items-center gap-2 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <h3 className="font-bold text-lg">사진 업로드</h3>
              </div>
              <button onClick={closeUploadModal} className="text-white/70 hover:text-white p-1 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* 파일 선택 영역 */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center
                            p-6 cursor-pointer transition-all min-h-[160px]
                            ${uploadPreview ? "border-[#1a2e5a] bg-blue-50/60" : "border-gray-300 hover:border-[#1a2e5a] hover:bg-gray-50"}`}
              >
                {uploadPreview ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <img src={uploadPreview} alt="미리보기" className="max-h-36 max-w-full rounded-lg object-contain shadow" />
                    <p className="text-xs text-gray-500 truncate max-w-full px-2">{uploadFile?.name}</p>
                    <span className="text-xs text-[#1a2e5a] font-semibold">클릭하여 다른 파일 선택</span>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-600">클릭하거나 사진을 여기로 드래그하세요</p>
                    <p className="text-xs text-gray-400 mt-1">JPG · PNG · GIF · WEBP &nbsp;|&nbsp; 최대 20MB</p>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />

              {/* 제목 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="사진 제목을 입력하세요"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent transition"
                  maxLength={100}
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">설명 <span className="text-gray-400 font-normal">(선택)</span></label>
                <textarea
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="행사명, 날짜 등 간단한 설명을 입력하세요"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent transition resize-none"
                  maxLength={300}
                />
              </div>

              {/* 에러 */}
              {uploadError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {uploadError}
                </div>
              )}

              {/* 버튼 */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={closeUploadModal}
                  disabled={uploading}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold
                             text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !uploadFile}
                  className="flex-1 py-3 bg-[#1a2e5a] text-white rounded-xl text-sm font-bold
                             hover:bg-[#243d78] transition-all disabled:opacity-40 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2 active:scale-95"
                >
                  {uploading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />업로드 중...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>업로드</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
