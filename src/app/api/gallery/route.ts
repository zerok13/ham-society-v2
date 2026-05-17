import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdmin, GALLERY_BUCKET, GALLERY_TABLE } from "@/lib/supabase";

// ── 헬퍼 ──────────────────────────────────────────────────────────────

function jsonError(message: string, status = 500) {
  return new NextResponse(
    JSON.stringify({ ok: false, error: message }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

function parseUserCookie(raw: string | undefined): Record<string, string> | null {
  if (!raw) return null;
  try { return JSON.parse(decodeURIComponent(raw)); } catch {
    try { return JSON.parse(raw); } catch { return null; }
  }
}

// ── 타입 ──────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  storage_path: string;       // Supabase Storage 경로 (버킷 내 경로)
  original_name: string;
  uploaded_by: string;
  uploaded_at: string;
  file_size: number;
  mime_type: string;
  // 클라이언트에 내려줄 임시 signed URL (DB에 저장 안 함)
  localPath?: string;
}

// ── Signed URL 생성 헬퍼 ─────────────────────────────────────────────

async function getSignedUrl(storagePath: string): Promise<string> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.storage
    .from(GALLERY_BUCKET)
    .createSignedUrl(storagePath, 60 * 60); // 1시간 유효
  if (error || !data?.signedUrl) throw new Error("signed URL 생성 실패");
  return data.signedUrl;
}

// ── GET: 갤러리 목록 조회 ─────────────────────────────────────────────

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    if (!userCookie) return jsonError("로그인이 필요합니다.", 401);
    const user = parseUserCookie(userCookie.value);
    if (!user) return jsonError("인증 정보가 올바르지 않습니다.", 401);

    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from(GALLERY_TABLE)
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("[gallery GET] DB error:", error);
      return jsonError("목록 조회 실패: " + error.message, 500);
    }

    // 각 항목에 signed URL 추가 (병렬)
    const items: GalleryItem[] = await Promise.all(
      (data || []).map(async (row: GalleryItem) => {
        try {
          const signedUrl = await getSignedUrl(row.storage_path);
          return { ...row, localPath: signedUrl };
        } catch {
          return { ...row, localPath: "" };
        }
      })
    );

    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    console.error("[gallery GET]", e);
    return jsonError(e?.message || "목록 조회 실패", 500);
  }
}

// ── POST: 사진 업로드 ─────────────────────────────────────────────────

export const config = {
  api: { bodyParser: false, responseLimit: false },
};

export async function POST(req: NextRequest) {
  try {
    // 인증 확인
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    if (!userCookie) return jsonError("로그인이 필요합니다.", 401);
    const user = parseUserCookie(userCookie.value);
    if (!user) return jsonError("인증 정보가 올바르지 않습니다.", 401);

    // FormData 파싱
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (e: any) {
      return jsonError("파일 파싱 실패: " + (e?.message || "알 수 없는 오류"), 400);
    }

    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string)?.trim() || "제목 없음";
    const description = (formData.get("description") as string)?.trim() || "";

    if (!file || !(file instanceof File)) return jsonError("파일이 없습니다.", 400);

    const mimeType = file.type || "image/jpeg";
    if (!mimeType.startsWith("image/")) return jsonError("이미지 파일만 업로드 가능합니다.", 400);
    if (file.size > 20 * 1024 * 1024) return jsonError("파일 크기는 20MB 이하여야 합니다.", 400);

    // 파일명 생성
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const storagePath = `${id}.${ext}`;   // 버킷 루트에 flat하게 저장

    // ① Supabase Storage 업로드
    const sb = getSupabaseAdmin();
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await sb.storage
      .from(GALLERY_BUCKET)
      .upload(storagePath, Buffer.from(arrayBuffer), {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("[gallery POST] Storage upload error:", uploadError);
      return jsonError("파일 업로드 실패: " + uploadError.message, 500);
    }

    // ② DB에 메타데이터 저장
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

    const { error: dbError } = await sb
      .from(GALLERY_TABLE)
      .insert(newItem);

    if (dbError) {
      // DB 실패 시 이미 업로드된 파일 롤백
      await sb.storage.from(GALLERY_BUCKET).remove([storagePath]);
      console.error("[gallery POST] DB insert error:", dbError);
      return jsonError("메타데이터 저장 실패: " + dbError.message, 500);
    }

    // ③ Signed URL 발급 후 응답
    const signedUrl = await getSignedUrl(storagePath);
    return NextResponse.json({
      ok: true,
      item: { ...newItem, localPath: signedUrl },
    });

  } catch (e: any) {
    console.error("[gallery POST]", e);
    return jsonError(e?.message || "업로드 실패", 500);
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

    const sb = getSupabaseAdmin();

    // DB에서 항목 조회
    const { data, error: fetchError } = await sb
      .from(GALLERY_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !data) return jsonError("항목을 찾을 수 없습니다.", 404);

    // 권한 확인 (관리자 or 본인)
    const uploaderName = data.uploaded_by;
    const currentUser = user.name || user.email || "";
    if (user.role !== "admin" && uploaderName !== currentUser) {
      return jsonError("삭제 권한이 없습니다.", 403);
    }

    // ① Storage 파일 삭제
    const { error: storageError } = await sb.storage
      .from(GALLERY_BUCKET)
      .remove([data.storage_path]);

    if (storageError) {
      console.error("[gallery DELETE] Storage remove error:", storageError);
      // Storage 실패해도 DB는 계속 삭제 시도
    }

    // ② DB 레코드 삭제
    const { error: dbError } = await sb
      .from(GALLERY_TABLE)
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("[gallery DELETE] DB delete error:", dbError);
      return jsonError("삭제 실패: " + dbError.message, 500);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[gallery DELETE]", e);
    return jsonError(e?.message || "삭제 실패", 500);
  }
}
