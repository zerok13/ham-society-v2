"use client";

import { useEffect, useMemo, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Copy } from "lucide-react";

export default function AdminCorsPage() {
  const [currentOrigin, setCurrentOrigin] = useState<string>("");
  const [previewWildcard, setPreviewWildcard] = useState<string>("");
  const [prodNetlify, setProdNetlify] = useState<string>("https://<your-site>.netlify.app");
  const [prodCustom, setProdCustom] = useState<string>("https://<your-domain>");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { origin, hostname } = window.location;
      setCurrentOrigin(origin);
      if (hostname.endsWith(".preview.same-app.com")) {
        setPreviewWildcard("https://*.preview.same-app.com");
      }
    }
  }, []);

  const origins = useMemo(() => {
    const base = [
      currentOrigin || "",
      "http://localhost:3000",
      "http://0.0.0.0:3000",
    ].filter(Boolean);
    if (previewWildcard) base.push(previewWildcard);
    if (prodNetlify) base.push(prodNetlify);
    if (prodCustom) base.push(prodCustom);
    return Array.from(new Set(base));
  }, [currentOrigin, previewWildcard, prodNetlify, prodCustom]);

  const corsJson = useMemo(
    () =>
      JSON.stringify(
        {
          AllowedOrigins: origins,
          AllowedMethods: ["GET", "PUT", "POST", "HEAD"],
          AllowedHeaders: ["*"],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3600,
        },
        null,
        2
      ),
    [origins]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(corsJson);
      alert("CORS 템플릿이 복사되었습니다.");
    } catch {
      alert("복사에 실패했습니다. 수동으로 복사해 주세요.");
    }
  };

  return (
    <PageLayout title="CORS 템플릿" subtitle="Cloudflare R2" imageIndex={1}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-[#1a2e5a] mb-4">원클릭 CORS 입력 템플릿</h2>
          <p className="text-sm text-gray-600 mb-4">
            아래 목록은 현재 프리뷰/로컬/배포(예시) 도메인을 합친 CORS Allowed Origins입니다.
            Cloudflare 대시보드 → R2 → Buckets → (버킷) → Settings → CORS에서 입력하세요.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Netlify 도메인</label>
            <input
              value={prodNetlify}
              onChange={(e) => setProdNetlify(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">커스텀 도메인</label>
            <input
              value={prodCustom}
              onChange={(e) => setProdCustom(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">예: https://ham.or.kr</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-[#1a2e5a] mb-2">Allowed Origins</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {origins.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-[#1a2e5a]">CORS Rule (JSON)</h3>
            <button onClick={copy} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200 text-sm">
              <Copy className="w-4 h-4" /> 복사
            </button>
          </div>
          <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto">
{corsJson}
          </pre>

          <div className="mt-4 text-xs text-gray-500">
            <p>권장 설정:</p>
            <ul className="list-disc list-inside">
              <li>Allowed Methods: GET, PUT, POST, HEAD</li>
              <li>Allowed Headers: * (초기 설정 후 점진 축소)</li>
              <li>Expose Headers: ETag</li>
              <li>Max Age: 3600</li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
