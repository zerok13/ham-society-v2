import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const PAGE_SIZE = 20;

export async function GET(req: Request) {
  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ ok: false, error: "db not configured" }, { status: 500 });

  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const boardType = url.searchParams.get("type"); // e.g., free, cases, jobs
    if (!boardType) return NextResponse.json({ ok: false, error: "type required" }, { status: 400 });

    const where = { boardType };
    const [items, total] = await prisma.$transaction([
      prisma.boardPost.findMany({
        where,
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      }),
      prisma.boardPost.count({ where }),
    ]);
    return NextResponse.json({ items, total, page, pageSize: PAGE_SIZE });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
