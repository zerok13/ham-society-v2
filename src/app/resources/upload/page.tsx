"use client";

import { useMemo, useState, useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { events } from "@/lib/data";
import { Upload as UploadIcon, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

const PART_SIZE = 16 * 1024 * 1024; // 16MB
const CONCURRENCY = 6;

interface SignedPartUrl {
  partNumber: number;
  url: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [prefix, setPrefix] = useState<string>("presentations/");
  const [selectedEventId, setSelectedEventId] = useState<number>(10);
  const [keyName, setKeyName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedKey, setUploadedKey] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>(""); // Author from user
  const [type, setType] = useState<string>("학술대회");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(sessionStorage.getItem("ham_auth") === "1");
      try {
        const user = JSON.parse(sessionStorage.getItem("ham_user") || "{}");
        setUserName(user.name || "");
        setAuthor(user.name || ""); // Default author to logged in user
      } catch {}
    }
  }, []);

  const selectedEvent = useMemo(() => events.find((e) => e.id === selectedEventId), [selectedEventId]);

  const buildKey = () => {
    const safeName = keyName || file?.name || "unnamed.bin";
    const eventFolder = selectedEvent ? selectedEvent.date.replaceAll(".", "-") : "misc";
    return `${prefix}${eventFolder}/${safeName}`;
  };

  const sliceParts = (blob: Blob) => {
    const parts: { partNumber: number; start: number; end: number }[] = [];
    let partNumber = 1;
    for (let start = 0; start < blob.size; start += PART_SIZE) {
      const end = Math.min(start + PART_SIZE, blob.size);
      parts.push({ partNumber, start, end });
      partNumber++;
    }
    return parts;
  };

  const runWithPool = async <T,>(items: (() => Promise<T>)[], concurrency: number, onProgress?: (done: number, total: number) => void) => {
    let index = 0;
    let done = 0;
    const total = items.length;
    const results: T[] = new Array(total);

    const next = async () => {
      const currentIndex = index++;
      if (currentIndex >= total) return;
      try {
        const res = await items[currentIndex]();
        results[currentIndex] = res;
      } finally {
        done++;
        onProgress?.(done, total);
        await next();
      }
    };

    const workers = Array.from({ length: Math.min(concurrency, total) }, () => next());
    await Promise.all(workers);
    return results;
  };

  const handleUpload = async () => {
    setError("");
    if (!file) {
      setError("파일을 선택하세요.");
      return;
    }
    setIsUploading(true);
    setStatus("초기화 중...");
    setProgress(0);

    const key = buildKey();
    try {
      // 1) init
      const initRes = await fetch("/api/r2/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "init", key, contentType: file.type || "application/octet-stream" }),
      }).then((r) => r.json());
      const uploadId = initRes.uploadId as string;
      if (!uploadId) throw new Error("업로드 초기화 실패");

      // 2) parts
      const parts = sliceParts(file);
      setStatus(`파트 서명 준비 (${parts.length}개)...`);
      const partNumbers = parts.map((p) => p.partNumber);
      const signRes = await fetch("/api/r2/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sign-parts", key, uploadId, parts: partNumbers }),
      }).then((r) => r.json());
      const urls: SignedPartUrl[] = signRes.urls;
      if (!Array.isArray(urls) || urls.length !== parts.length) throw new Error("파트 서명 실패");

      setStatus("파트 업로드 중...");
      let uploaded = 0;
      const total = file.size;
      const tasks = parts.map((p) => {
        const url = urls.find((u) => u.partNumber === p.partNumber)?.url;
        if (!url) throw new Error(`URL 누락: part ${p.partNumber}`);
        const blob = file.slice(p.start, p.end);
        return async () => {
          const resp = await fetch(url, { method: "PUT", body: blob });
          if (!resp.ok) throw new Error(`파트 업로드 실패: ${p.partNumber}`);
          const etag = resp.headers.get("ETag") || resp.headers.get("etag") || "";
          uploaded += blob.size;
          setProgress(Math.round((uploaded / total) * 100));
          return { PartNumber: p.partNumber, ETag: etag?.replaceAll('"', '') };
        };
      });

      const completedParts = await runWithPool(tasks, CONCURRENCY);

      setStatus("최종 처리 중...");
      const completeRes = await fetch("/api/r2/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", key, uploadId, completedParts }),
      });
      if (!completeRes.ok) throw new Error("업로드 완료 실패");

      setUploadedKey(key);
      setStatus("업로드 완료");
      setProgress(100);

      // 메타데이터 저장 (데모)
      try {
        await fetch("/api/presentations/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title || `${selectedEvent?.title || "자료"}`,
            author,
            date: selectedEvent?.date || new Date().toISOString().slice(0, 10),
            type,
            key,
          }),
        });
      } catch {}
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "업로드 실패");
      setStatus("오류");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <PageLayout title="업로드" subtitle="자료 올리기" imageIndex={1}>
        <div className="text-center">
          <p>자료 업로드는 회원 로그인 후 가능합니다.</p>
          <Link href="/login" className="mt-4 inline-block bg-[#1a2e5a] text-white px-6 py-2 rounded-lg">로그인</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="자료 업로드" subtitle={`환영합니다, ${userName}님`} imageIndex={1}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">행사 선택</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {events
                  .filter((e) => e.type === "정기 학술대회")
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({e.date})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">자료 유형</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="학술대회">학술대회</option>
                <option value="가이드라인">가이드라인</option>
                <option value="프로토콜">프로토콜</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">자료 제목</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="예: 제10회 발표자료 모음" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">작성자</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">파일 경로 접두사</label>
            <input
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">예: presentations/</p>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">파일명 (선택)</label>
            <input
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder={file?.name || "파일 선택 시 자동 사용"}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">파일 선택</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm"
            />
            {file && (
              <p className="text-xs text-gray-500 mt-1">{file.name} — {(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              disabled={!file || isUploading}
              onClick={handleUpload}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1a2e5a] text-white disabled:opacity-50"
            >
              <UploadIcon className="w-4 h-4" /> 업로드 시작
            </button>
            {status && <span className="text-sm text-gray-600">{status}</span>}
          </div>

          {isUploading || progress > 0 ? (
            <div className="mt-4">
              <div className="w-full h-3 bg-gray-100 rounded">
                <div
                  className="h-3 bg-[#2e5aa7] rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{progress}%</p>
            </div>
          ) : null}

          {uploadedKey && (
            <div className="mt-6 flex items-center gap-2 text-[#1a2e5a]">
              <CheckCircle2 className="w-5 h-5" />
              업로드 완료: <span className="font-mono text-sm">{uploadedKey}</span>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-center gap-2 text-[#c41e3a]">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}

          <div className="mt-6 text-xs text-gray-500 flex items-center justify-between">
            <p>참고: Cloudflare R2 버킷 CORS 설정에서 이 도메인을 허용하고, 메서드 PUT/GET, 헤더 x-amz-*, Content-Type, 노출 헤더 ETag를 허용해야 합니다.</p>
            <Link href="/resources/presentations" className="text-[#1a2e5a] hover:underline">자료실 보기</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
