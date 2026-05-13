import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { cookies } from "next/headers";

// 모든 에러를 반드시 JSON으로 반환하는 헬퍼
function jsonError(message: string, status = 500) {
  return new NextResponse(
    JSON.stringify({ ok: false, error: message }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

// 쿠키에서 사용자 정보를 안전하게 파싱
function parseUserCookie(raw: string | undefined): Record<string, string> | null {
  if (!raw) return null;
  try {
    // URL 인코딩된 값 처리
    const decoded = decodeURIComponent(raw);
    return JSON.parse(decoded);
  } catch {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}

const DATA_FILE = path.join(process.cwd(), "data", "gallery.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "gallery");

export interface GalleryItem {
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

async function readGalleryData(): Promise<GalleryItem[]> {
  try {
    if (!existsSync(DATA_FILE)) return [];
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeGalleryData(items: GalleryItem[]) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

// GET: 갤러리 목록 조회 (로그인 필요)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    if (!userCookie) {
      return jsonError("로그인이 필요합니다.", 401);
    }
    const user = parseUserCookie(userCookie.value);
    if (!user) {
      return jsonError("인증 정보가 올바르지 않습니다.", 401);
    }
    const items = await readGalleryData();
    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    console.error("[gallery GET]", e);
    return jsonError(e?.message || "목록 조회 실패", 500);
  }
}

// Next.js 15에서 대용량 파일 업로드를 위한 설정
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

// POST: 사진 업로드 (multipart/form-data)
export async function POST(req: NextRequest) {
  try {
    // 로그인 확인
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    if (!userCookie) {
      return jsonError("로그인이 필요합니다.", 401);
    }
    const user = parseUserCookie(userCookie.value);
    if (!user) {
      return jsonError("인증 정보가 올바르지 않습니다.", 401);
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (e: any) {
      console.error("[gallery POST] formData parse error:", e);
      return jsonError("파일 파싱 실패: " + (e?.message || "알 수 없는 오류"), 400);
    }

    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string)?.trim() || "제목 없음";
    const description = (formData.get("description") as string)?.trim() || "";

    if (!file || !(file instanceof File)) {
      return jsonError("파일이 없습니다.", 400);
    }

    // 이미지 파일만 허용
    const mimeType = file.type || "image/jpeg";
    if (!mimeType.startsWith("image/")) {
      return jsonError("이미지 파일만 업로드 가능합니다.", 400);
    }

    // 파일 크기 제한 (20MB)
    if (file.size > 20 * 1024 * 1024) {
      return jsonError("파일 크기는 20MB 이하여야 합니다.", 400);
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const filename = `${id}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    const arrayBuffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(arrayBuffer));

    const newItem: GalleryItem = {
      id,
      title,
      description,
      filename,
      originalName: file.name,
      localPath: `/uploads/gallery/${filename}`,
      uploadedBy: user.name || user.email,
      uploadedAt: new Date().toISOString(),
      fileSize: file.size,
      mimeType,
    };

    const items = await readGalleryData();
    items.unshift(newItem);
    await writeGalleryData(items);

    return NextResponse.json({ ok: true, item: newItem });
  } catch (e: any) {
    console.error("[gallery POST]", e);
    return jsonError(e?.message || "업로드 실패", 500);
  }
}

// DELETE: 사진 삭제
export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    if (!userCookie) {
      return jsonError("로그인이 필요합니다.", 401);
    }
    const user = parseUserCookie(userCookie.value);
    if (!user) {
      return jsonError("인증 정보가 올바르지 않습니다.", 401);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return jsonError("id 필요", 400);

    const items = await readGalleryData();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return jsonError("없는 항목", 404);

    const item = items[idx];

    // 관리자이거나 업로드한 본인만 삭제 가능
    if (user.role !== "admin" && item.uploadedBy !== (user.name || user.email)) {
      return jsonError("권한 없음", 403);
    }

    // 파일 삭제
    const filePath = path.join(process.cwd(), "public", item.localPath);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    items.splice(idx, 1);
    await writeGalleryData(items);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[gallery DELETE]", e);
    return jsonError(e?.message || "삭제 실패", 500);
  }
}
