"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { PageLayout } from "@/components/PageLayout";
import { galleryImages } from "@/lib/data";

// ─── 타입 ────────────────────────────────────────────────────
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

// 정적 갤러리 → GalleryItem 형식으로 변환
const staticItems: GalleryItem[] = galleryImages.map((img) => ({
  id: `static_${img.id}`,
  title: img.title,
  description: img.date,
  filename: img.src,
  originalName: img.src,
  localPath: img.src,
  uploadedBy: "관리자",
  uploadedAt: img.date,
  fileSize: 0,
  mimeType: "image/jpeg",
}));

function formatBytes(bytes: number) {
  if (bytes === 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  if (!iso) return "";
  // "2026.01.25" 같은 포맷은 그대로
  if (/^\d{4}\.\d{2}/.test(iso)) return iso;
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return iso;
  }
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────
export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(staticItems);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");

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
  const dropRef = useRef<HTMLDivElement>(null);

  // ── 로그인 상태 확인 ──────────────────────────────────────
  useEffect(() => {
    const check = () => {
      try {
        const auth = sessionStorage.getItem("ham_auth") === "1";
        const admin = sessionStorage.getItem("ham_admin") === "1";
        setIsLoggedIn(auth);
        setIsAdmin(admin);
        if (auth) {
          const raw = document.cookie
            .split("; ")
            .find((r) => r.startsWith("ham_demo_user="));
          if (raw) {
            const val = decodeURIComponent(raw.split("=").slice(1).join("="));
            const u = JSON.parse(val);
            setUserName(u.name || u.email || "");
          }
        }
      } catch {}
    };
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  // ── 갤러리 목록 불러오기 ─────────────────────────────────
  const fetchGallery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.items)) {
          setItems([...data.items, ...staticItems]);
        }
      }
    } catch {
      // API 실패 시 정적 데이터만 표시
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // ── 키보드 이벤트 (라이트박스) ────────────────────────────
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

  // ── 파일 선택/드래그 ─────────────────────────────────────
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("이미지 파일(JPG, PNG, GIF, WEBP 등)만 업로드 가능합니다.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("파일 크기는 20MB 이하여야 합니다.");
      return;
    }
    setUploadFile(file);
    setUploadError("");
    if (uploadTitle === "") setUploadTitle(file.name.replace(/\.[^.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (e) => setUploadPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // ── 업로드 실행 ───────────────────────────────────────────
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
      // 업로드 성공 → 모달 닫고 목록 갱신
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

  // ── 삭제 ─────────────────────────────────────────────────
  const handleDelete = async (item: GalleryItem) => {
    if (item.id.startsWith("static_")) {
      alert("기본 제공 사진은 삭제할 수 없습니다.");
      return;
    }
    if (!confirm(`"${item.title}" 사진을 삭제하시겠습니까?`)) return;
    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      // 라이트박스 열려 있으면 닫기
      setLightbox({ open: false, idx: 0 });
      await fetchGallery();
    } catch (e: any) {
      alert(e.message || "삭제 실패");
    }
  };

  // ── 다운로드 ──────────────────────────────────────────────
  const handleDownload = async (item: GalleryItem) => {
    try {
      let url: string;
      if (item.id.startsWith("static_")) {
        url = item.localPath;
      } else {
        const res = await fetch(`/api/r2/get-url?key=gallery/${item.filename}`);
        const data = await res.json();
        if (data.ok && data.url) {
          url = data.url;
        } else {
          // fallback: 직접 로컬 경로
          url = item.localPath;
        }
      }
      const a = document.createElement("a");
      a.href = url;
      a.download = item.originalName || item.filename;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      alert("다운로드에 실패했습니다.");
    }
  };

  const currentItem = items[lightbox.idx];

  return (
    <PageLayout title="포토갤러리" subtitle="Photo Gallery" imageIndex={0}>
      <div className="max-w-6xl mx-auto">
        {/* ── 헤더 영역 ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2e5a] mb-1">HAM 활동 사진</h2>
            <p className="text-gray-500 text-sm">학술대회 및 연구회 활동 사진을 확인하세요</p>
          </div>
          {isLoggedIn ? (
            <button
              onClick={() => { setUploadOpen(true); setUploadError(""); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2e5a] text-white rounded-lg hover:bg-[#243d78] transition-colors font-medium shadow text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              사진 업로드
            </button>
          ) : (
            <p className="text-sm text-gray-400 italic">로그인 후 사진을 업로드할 수 있습니다.</p>
          )}
        </div>

        {/* ── 갤러리 그리드 ── */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-[#1a2e5a] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">등록된 사진이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-gray-100"
                onClick={() => setLightbox({ open: true, idx })}
              >
                <Image
                  src={item.localPath}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</p>
                  <p className="text-xs text-white/70 mt-0.5">{formatDate(item.uploadedAt)}</p>
                </div>
                {/* 업로더 배지 */}
                {!item.id.startsWith("static_") && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full opacity-80">
                    NEW
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-gray-400 text-xs">
          총 {items.length}장의 사진 &nbsp;·&nbsp; 사진을 클릭하면 크게 볼 수 있습니다.
        </div>
      </div>

      {/* ════════════════════════════════════════════
          라이트박스 모달
      ════════════════════════════════════════════ */}
      {lightbox.open && currentItem && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightbox({ open: false, idx: 0 })}
        >
          {/* 닫기 버튼 */}
          <button
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            onClick={() => setLightbox({ open: false, idx: 0 })}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 이전 버튼 */}
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightbox((p) => ({ open: true, idx: (p.idx - 1 + items.length) % items.length })); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 다음 버튼 */}
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightbox((p) => ({ open: true, idx: (p.idx + 1) % items.length })); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 이미지 영역 */}
          <div
            className="relative max-w-5xl max-h-[80vh] w-full mx-16 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ maxHeight: "70vh" }}>
              <img
                src={currentItem.localPath}
                alt={currentItem.title}
                className="max-h-[70vh] max-w-full mx-auto rounded-lg object-contain shadow-2xl block"
              />
            </div>

            {/* 하단 정보 바 */}
            <div className="w-full mt-4 px-2 flex items-start justify-between gap-4">
              <div className="text-white min-w-0">
                <p className="font-bold text-lg leading-tight">{currentItem.title}</p>
                {currentItem.description && (
                  <p className="text-white/70 text-sm mt-0.5">{currentItem.description}</p>
                )}
                <p className="text-white/50 text-xs mt-1">
                  {formatDate(currentItem.uploadedAt)} &nbsp;·&nbsp; {currentItem.uploadedBy}
                  {currentItem.fileSize > 0 && ` · ${formatBytes(currentItem.fileSize)}`}
                </p>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2 flex-shrink-0">
                {/* 다운로드 */}
                <button
                  onClick={() => handleDownload(currentItem)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg transition-colors text-sm font-medium"
                  title="다운로드"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  다운로드
                </button>
                {/* 삭제 (로그인 + 관리자 또는 본인) */}
                {isLoggedIn && (isAdmin || currentItem.uploadedBy === userName) && !currentItem.id.startsWith("static_") && (
                  <button
                    onClick={() => handleDelete(currentItem)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                    title="삭제"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    삭제
                  </button>
                )}
              </div>
            </div>

            {/* 페이지 인디케이터 */}
            <p className="text-white/40 text-xs mt-3">
              {lightbox.idx + 1} / {items.length}
            </p>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          업로드 모달
      ════════════════════════════════════════════ */}
      {uploadOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => !uploading && setUploadOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-[#1a2e5a]">
              <h3 className="text-white font-bold text-lg">사진 업로드</h3>
              <button
                onClick={() => !uploading && setUploadOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* 드래그앤드롭 영역 */}
              <div
                ref={dropRef}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all min-h-[160px] ${
                  uploadPreview
                    ? "border-[#1a2e5a] bg-blue-50"
                    : "border-gray-300 hover:border-[#1a2e5a] hover:bg-gray-50"
                }`}
              >
                {uploadPreview ? (
                  <div className="relative w-full flex flex-col items-center gap-3">
                    <img src={uploadPreview} alt="미리보기" className="max-h-32 max-w-full rounded-lg object-contain shadow" />
                    <p className="text-xs text-gray-500 truncate max-w-full">{uploadFile?.name}</p>
                    <span className="text-xs text-[#1a2e5a] font-medium">클릭하여 다른 파일 선택</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-600">클릭하거나 사진을 드래그하세요</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WEBP · 최대 20MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              />

              {/* 제목 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="사진 제목을 입력하세요"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent transition"
                  maxLength={100}
                />
              </div>

              {/* 설명 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">설명 (선택)</label>
                <textarea
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="간단한 설명을 입력하세요"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent transition resize-none"
                  maxLength={300}
                />
              </div>

              {/* 에러 메시지 */}
              {uploadError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {uploadError}
                </div>
              )}

              {/* 버튼 영역 */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => !uploading && setUploadOpen(false)}
                  disabled={uploading}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !uploadFile}
                  className="flex-1 py-2.5 bg-[#1a2e5a] text-white rounded-lg text-sm font-bold hover:bg-[#243d78] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      업로드 중...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      업로드
                    </>
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
