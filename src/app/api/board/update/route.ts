import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";

export async function POST(req: Request) {
  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ ok: false, error: "DB not configured" }, { status: 500 });

  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });

    const body = await req.json();
    const { id, title, content } = body;

    if (!id || !title || !content) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }

    const post = await prisma.boardPost.findUnique({ where: { id } });

    if (!post || post.authorId !== userId) {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }

    const updatedPost = await prisma.boardPost.update({
      where: { id },
      data: { title, content },
    });

    return NextResponse.json({ ok: true, post: updatedPost });
  } catch (e) {
    console.error("/api/board/update error:", e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
