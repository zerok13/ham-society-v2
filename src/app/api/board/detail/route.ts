import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ ok: false, error: "db not configured" }, { status: 500 });

  try {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });

    const post = await prisma.boardPost.findUnique({
      where: { id },
      include: {
        author: { select: { name: true } },
        attachments: { select: { id: true, key: true, filename: true } },
      },
    });

    if (!post) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

    return NextResponse.json({ post });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
