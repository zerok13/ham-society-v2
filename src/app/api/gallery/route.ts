import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { cookies } from "next/headers";

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

// GET: 갤러리 목록 조회
export async function GET() {
  const items = await readGalleryData();
  return NextResponse.json({ ok: true, items });
}

// POST: 사진 업로드 (multipart/form-data)
export async function POST(req: Request) {
  try {
    // 로그인 확인
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    if (!userCookie) {
      return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
    }
    const user = JSON.parse(userCookie.value);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "제목 없음";
    const description = (formData.get("description") as string) || "";

    if (!file) {
      return NextResponse.json({ ok: false, error: "파일이 없습니다." }, { status: 400 });
    }

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "이미지 파일만 업로드 가능합니다." }, { status: 400 });
    }

    // 파일 크기 제한 (20MB)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "파일 크기는 20MB 이하여야 합니다." }, { status: 400 });
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
      mimeType: file.type,
    };

    const items = await readGalleryData();
    items.unshift(newItem);
    await writeGalleryData(items);

    return NextResponse.json({ ok: true, item: newItem });
  } catch (e: any) {
    console.error("[gallery POST]", e);
    return NextResponse.json({ ok: false, error: e?.message || "업로드 실패" }, { status: 500 });
  }
}

// DELETE: 사진 삭제
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    if (!userCookie) {
      return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
    }
    const user = JSON.parse(userCookie.value);

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "id 필요" }, { status: 400 });

    const items = await readGalleryData();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return NextResponse.json({ ok: false, error: "없는 항목" }, { status: 404 });

    const item = items[idx];

    // 관리자이거나 업로드한 본인만 삭제 가능
    if (user.role !== "admin" && item.uploadedBy !== (user.name || user.email)) {
      return NextResponse.json({ ok: false, error: "권한 없음" }, { status: 403 });
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
    return NextResponse.json({ ok: false, error: e?.message || "삭제 실패" }, { status: 500 });
  }
}
