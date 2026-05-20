import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  storagePresignUpload,
  storageSignedUrl,
  GALLERY_BUCKET,
} from "@/lib/supabase";

// ── 헬퍼 ──────────────────────────────────────────────────────────────
function jsonError(message: string, status = 500) {
  return new NextResponse(
    JSON.stringify({ ok: false, error: message }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

function parseUserCookie(raw: string | undefined): Record<string, string> | null {
  if (!raw) return null;
  try { return JSON.parse(decodeURIComponent(raw)); } catch {}
  try { return JSON.parse(raw); } catch {}
  try { return JSON.parse(decodeURIComponent(decodeURIComponent(raw))); } catch {}
  if (raw.includes("@")) return { email: raw, name: raw.split("@")[0], role: "member" };
  return null;
}

/**
 * POST /api/gallery/presign
 *
 * 클라이언트 → Supabase Storage 직접 업로드를 위한 Presigned Upload URL 발급
 *
 * 요청 body (JSON):
 *   { storagePath: "1234_abc.jpg", contentType: "image/jpeg" }
 *
 * 응답:
 *   { ok: true, uploadUrl: "https://...supabase.co/storage/v1/object/sign/upload/gallery/...", token: "..." }
 *
 * 흐름:
 *   1) 클라이언트가 이 API로 presigned URL 발급 요청
 *   2) 클라이언트가 uploadUrl에 PUT 요청으로 파일 직접 전송 (Netlify Function 거치지 않음)
 *   3) 클라이언트가 /api/gallery/commit으로 DB 메타데이터 저장 요청
 */
export async function POST(req: NextRequest) {
  try {
    // 인증 확인
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    if (!userCookie) return jsonError("로그인이 필요합니다.", 401);
    const user = parseUserCookie(userCookie.value);
    if (!user) return jsonError("인증 정보가 올바르지 않습니다.", 401);

    const body = await req.json();
    const { storagePath, contentType } = body as { storagePath?: string; contentType?: string };

    if (!storagePath) return jsonError("storagePath 필요", 400);
    if (!contentType) return jsonError("contentType 필요", 400);
    if (!contentType.startsWith("image/")) return jsonError("이미지 파일만 업로드 가능합니다.", 400);

    // Presigned Upload URL 발급 (서버에서만 service_role 키 사용)
    const { uploadUrl, token } = await storagePresignUpload(
      GALLERY_BUCKET,
      storagePath,
      3600
    );

    console.log("[gallery/presign] issued presign for:", storagePath, "uploadUrl:", uploadUrl.slice(0, 80));

    return NextResponse.json({ ok: true, uploadUrl, token });
  } catch (e: unknown) {
    const err = e as Error;
    console.error("[gallery/presign] error:", err?.message);
    return jsonError(err?.message || "Presign URL 발급 실패", 500);
  }
}
