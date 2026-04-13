import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  // DB 우선 조회
  const prisma = getPrisma();
  if (prisma) {
    try {
      const items = await prisma.presentation.findMany({
        where: { hidden: false },
        orderBy: { createdAt: "desc" },
      });
      await prisma.$disconnect();
      return NextResponse.json({ presentations: items, items });
    } catch (e) {
      console.error("DB list error, falling back to JSON", e);
    }
  }

  // JSON 파일 fallback
  try {
    const file = path.join(process.cwd(), "data", "presentations.json");
    const buf = await readFile(file);
    const items = JSON.parse(buf.toString());
    const visible = Array.isArray(items) ? items.filter((i: any) => !i.hidden) : [];
    return NextResponse.json({ presentations: visible, items: visible });
  } catch {
    // 최종 fallback 샘플
    const items = [
      {
        id: 1,
        title: "제10회 HAM 학술대회 발표자료 (샘플)",
        author: "학술위원회",
        date: "2026.04.25",
        type: "학술대회",
        downloads: 0,
        key: "",
      },
    ];
    return NextResponse.json({ presentations: items, items });
  }
}
