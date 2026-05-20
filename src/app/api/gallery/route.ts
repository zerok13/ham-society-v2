import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  dbSelect,
  dbSelectOne,
  dbInsert,
  dbDelete,
  storageUpload,
  storageDelete,
  storageSignedUrl,
  GALLERY_BUCKET,
  GALLERY_TABLE,
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
  // 시도 1: URL 디코딩 후 JSON 파싱
  try { return JSON.parse(decodeURIComponent(raw)); } catch {}
  // 시도 2: 그대로 JSON 파싱 (이미 디코딩된 경우)
  try { return JSON.parse(raw); } catch {}
  // 시도 3: 한 번 더 디코딩 (이중 인코딩 케이스)
  try { return JSON.parse(decodeURIComponent(decodeURIComponent(raw))); } catch {}
  // 시도 4: email만 있는 단순 문자열 (구 ham_auth/set 방식)
  if (raw.includes("@")) return { email: raw, name: raw.split("@")[0], role: "member" };
  console.error("[parseUserCookie] 파싱 실패, raw:", raw.slice(0, 100));
  return null;
}

// ── 타입 ──────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  storage_path: string;
  original_name: string;
  uploaded_by: string;
  uploaded_at: string;
  file_size: number;
  mime_type: string;
  localPath?: string;   // signed URL (DB 저장 안 함, 응답 전용)
}

// ── GET: 갤러리 목록 조회 ────────────────────────────────────────────

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    if (!userCookie) return jsonError("로그인이 필요합니다.", 401);
    const user = parseUserCookie(userCookie.value);
    if (!user) return jsonError("인증 정보가 올바르지 않습니다.", 401);

    const rows = await dbSelect<GalleryItem>(GALLERY_TABLE);

    // signed URL 병렬 발급
    const items: GalleryItem[] = await Promise.all(
      rows.map(async (row) => {
        try {
          const signedUrl = await storageSignedUrl(GALLERY_BUCKET, row.storage_path, 3600);
          return { ...row, localPath: signedUrl };
        } catch {
          return { ...row, localPath: "" };
        }
      })
    );

    return NextResponse.json({ ok: true, items });
  } catch (e: unknown) {
    const err = e as Error;
    console.error("[gallery GET]", err);
    return jsonError(err?.message || "목록 조회 실패", 500);
  }
}

// ── POST: 사진 업로드 ────────────────────────────────────────────────
// ✅ 핵심 수정: Buffer.from(arrayBuffer) 완전 제거
//    → file.arrayBuffer() 결과를 Uint8Array로 직접 변환 후 전달
//    → Netlify Function 대용량 파일 크래시 원인 해결

export const config = {
  api: { bodyParser: false, responseLimit: false },
};

export async function POST(req: NextRequest) {
  try {
    // 인증 확인
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    console.log("[gallery POST] cookie raw:", userCookie?.value?.slice(0, 80) ?? "NONE");
    if (!userCookie) return jsonError("로그인이 필요합니다.", 401);
    const user = parseUserCookie(userCookie.value);
    console.log("[gallery POST] parsed user:", JSON.stringify(user)?.slice(0, 80));
    if (!user) return jsonError("인증 정보가 올바르지 않습니다.", 401);

    // FormData 파싱
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (e: unknown) {
      const err = e as Error;
      return jsonError("파일 파싱 실패: " + (err?.message || "알 수 없는 오류"), 400);
    }

    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string)?.trim() || "제목 없음";
    const description = (formData.get("description") as string)?.trim() || "";

    if (!file || !(file instanceof File)) return jsonError("파일이 없습니다.", 400);

    const mimeType = file.type || "image/jpeg";
    if (!mimeType.startsWith("image/")) return jsonError("이미지 파일만 업로드 가능합니다.", 400);
    if (file.size > 20 * 1024 * 1024) return jsonError("파일 크기는 20MB 이하여야 합니다.", 400);

    // 파일명/ID 생성
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const storagePath = `${id}.${ext || "jpg"}`;

    console.log("[gallery POST] uploading:", file.name, file.size, "bytes →", storagePath);

    // ① ArrayBuffer 읽기 → Uint8Array 직접 변환
    //    ✅ Buffer.from(arrayBuffer) 제거: Netlify Node 20의 undici fetch에서
    //       Buffer를 BodyInit으로 전달 시 Content-Length 0으로 처리되는 버그 방지
    const arrayBuffer = await file.arrayBuffer();
    const uint8Data = new Uint8Array(arrayBuffer);

    console.log("[gallery POST] uint8 length:", uint8Data.byteLength);

    // ② Storage 업로드 (PUT upsert — POST는 중복 파일명 시 에러)
    await storageUpload(GALLERY_BUCKET, storagePath, uint8Data, mimeType);

    console.log("[gallery POST] storage upload OK");

    // ③ DB 메타데이터 저장
    const newItem: GalleryItem = {
      id,
      title,
      description,
      storage_path: storagePath,
      original_name: file.name,
      uploaded_by: user.name || user.email || "회원",
      uploaded_at: new Date().toISOString(),
      file_size: file.size,
      mime_type: mimeType,
    };

    try {
      await dbInsert(GALLERY_TABLE, newItem as unknown as Record<string, unknown>);
    } catch (dbErr: unknown) {
      const err = dbErr as Error;
      // DB 실패 시 Storage 롤백
      await storageDelete(GALLERY_BUCKET, [storagePath]);
      throw err;
    }

    console.log("[gallery POST] db insert OK");

    // ④ Signed URL 발급
    const signedUrl = await storageSignedUrl(GALLERY_BUCKET, storagePath, 3600);

    console.log("[gallery POST] signed URL OK, returning success");

    return NextResponse.json({ ok: true, item: { ...newItem, localPath: signedUrl } });

  } catch (e: unknown) {
    const err = e as Error;
    console.error("[gallery POST] FATAL:", err?.message, err?.stack?.slice(0, 500));
    return jsonError(err?.message || "업로드 실패", 500);
  }
}

// ── DELETE: 사진 삭제 ────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    if (!userCookie) return jsonError("로그인이 필요합니다.", 401);
    const user = parseUserCookie(userCookie.value);
    if (!user) return jsonError("인증 정보가 올바르지 않습니다.", 401);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return jsonError("id 필요", 400);

    const item = await dbSelectOne<GalleryItem>(GALLERY_TABLE, id);
    if (!item) return jsonError("항목을 찾을 수 없습니다.", 404);

    // 권한 확인
    const currentUser = user.name || user.email || "";
    if (user.role !== "admin" && item.uploaded_by !== currentUser) {
      return jsonError("삭제 권한이 없습니다.", 403);
    }

    // ① Storage 삭제
    await storageDelete(GALLERY_BUCKET, [item.storage_path]);

    // ② DB 삭제
    await dbDelete(GALLERY_TABLE, id);

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const err = e as Error;
    console.error("[gallery DELETE]", err);
    return jsonError(err?.message || "삭제 실패", 500);
  }
}
