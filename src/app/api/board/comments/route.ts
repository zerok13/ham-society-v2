import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 쿠키에서 현재 로그인 사용자 ID를 조회
// ※ getPrisma()는 싱글턴이므로 disconnect 하지 않음 — 호출 측 finally 에서 처리
async function getAuthorId(prisma: NonNullable<ReturnType<typeof getPrisma>>): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("ham_demo_user");
    if (!userCookie) return null;
    const user = JSON.parse(userCookie.value);
    if (!user.email) return null;
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    return dbUser?.id ?? null;
  } catch {
    return null;
  }
}

// GET /api/board/comments?postId=<id>
export async function GET(req: Request) {
  const prisma = getPrisma();
  if (!prisma)
    return NextResponse.json({ ok: false, error: "db not configured" }, { status: 500 });

  try {
    const url = new URL(req.url);
    const postId = Number(url.searchParams.get("postId"));
    if (!postId)
      return NextResponse.json({ ok: false, error: "postId required" }, { status: 400 });

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ comments });
  } catch (e) {
    console.error("[comments GET]", e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/board/comments  { postId, content }
export async function POST(req: Request) {
  const prisma = getPrisma();
  if (!prisma)
    return NextResponse.json({ ok: false, error: "db not configured" }, { status: 500 });

  try {
    const authorId = await getAuthorId(prisma);
    if (!authorId)
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });

    const body = await req.json();
    const { postId, content } = body;
    if (!postId || !content?.trim())
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });

    const comment = await prisma.comment.create({
      data: { postId: Number(postId), content: content.trim(), authorId },
      include: { author: { select: { name: true } } },
    });

    return NextResponse.json({ ok: true, comment });
  } catch (e) {
    console.error("[comments POST]", e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/board/comments?id=<commentId>
export async function DELETE(req: Request) {
  const prisma = getPrisma();
  if (!prisma)
    return NextResponse.json({ ok: false, error: "db not configured" }, { status: 500 });

  try {
    const authorId = await getAuthorId(prisma);
    if (!authorId)
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });

    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));
    if (!id)
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment)
      return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    if (comment.authorId !== authorId)
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[comments DELETE]", e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
