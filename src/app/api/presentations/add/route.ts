import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { getPrisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, author, date, type, key, localPath } = body;

    if (!title || !author || !date || !type) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }

    // 실제 저장 key: R2 key 또는 로컬 경로
    const storageKey = key || localPath || "";

    // DB 우선 저장
    const prisma = getPrisma();
    if (prisma) {
      try {
        const item = await prisma.presentation.create({
          data: {
            title,
            author,
            date,
            type,
            key: storageKey,
          },
        });
        await prisma.$disconnect();
        return NextResponse.json({ ok: true, item });
      } catch (e) {
        console.error("DB add error, falling back to JSON", e);
      }
    }

    // JSON 파일 fallback
    const file = path.join(process.cwd(), "data", "presentations.json");
    const buf = await readFile(file).catch(() => Buffer.from("[]"));
    const items = JSON.parse(buf.toString());
    const nextId = items.length ? Math.max(...items.map((i: any) => i.id)) + 1 : 1;
    const item = { id: nextId, title, author, date, type, downloads: 0, key: storageKey };
    items.push(item);
    await writeFile(file, JSON.stringify(items, null, 2));
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    console.error("presentations/add error", e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
