import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  dbInsert,
  storageSignedUrl,
  storageDelete,
  GALLERY_BUCKET,
  GALLERY_TABLE,
} from "@/lib/supabase";
import type { GalleryItem } from "../route";

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
 * POST /api/gallery/commit
 *
 * 클라이언트가 Supabase Storage에 직접 업로드를 완료한 후 DB 메타데이터 저장
 *
 * 요청 body (JSON):
 * {
 *   id: string,
 *   storagePath: string,
 *   title: string,
 *   description: string,
 *   originalName: string,
 *   fileSize: number,
 *   mimeType: string,
 * }
 *
 * 응답:
 *   { ok: true, item: GalleryItem & { localPath: string } }
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
    const {
      id,
      storagePath,
      title,
      description,
      originalName,
      fileSize,
      mimeType,
    } = body as {
      id: string;
      storagePath: string;
      title: string;
      description: string;
      originalName: string;
      fileSize: number;
      mimeType: string;
    };

    if (!id || !storagePath || !mimeType) {
      return jsonError("필수 파라미터 누락 (id, storagePath, mimeType)", 400);
    }

    console.log("[gallery/commit] saving to DB:", storagePath, fileSize, "bytes");

    const newItem: GalleryItem = {
      id,
      title: title || "제목 없음",
      description: description || "",
      storage_path: storagePath,
      original_name: originalName || storagePath,
      uploaded_by: user.name || user.email || "회원",
      uploaded_at: new Date().toISOString(),
      file_size: fileSize || 0,
      mime_type: mimeType,
    };

    try {
      await dbInsert(GALLERY_TABLE, newItem as unknown as Record<string, unknown>);
    } catch (dbErr: unknown) {
      const err = dbErr as Error;
      // DB 실패 시 이미 업로드된 Storage 파일 롤백
      console.warn("[gallery/commit] DB insert failed, rolling back storage:", err?.message);
      await storageDelete(GALLERY_BUCKET, [storagePath]);
      throw err;
    }

    console.log("[gallery/commit] DB insert OK, generating signed URL...");

    // Signed URL 발급 (1시간 유효)
    const signedUrl = await storageSignedUrl(GALLERY_BUCKET, storagePath, 3600);

    console.log("[gallery/commit] signed URL OK");

    return NextResponse.json({ ok: true, item: { ...newItem, localPath: signedUrl } });
  } catch (e: unknown) {
    const err = e as Error;
    console.error("[gallery/commit] FATAL:", err?.message);
    return jsonError(err?.message || "DB 저장 실패", 500);
  }
}
