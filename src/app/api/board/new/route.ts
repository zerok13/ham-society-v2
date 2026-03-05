import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const PAGE_SIZE = 20;

async function getUserId() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("ham_demo_user");
  if (!userCookie) return null;
  try {
    const user = JSON.parse(userCookie.value);
    const prisma = getPrisma();
    if (!prisma || !user.email) return null;
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    return dbUser?.id || null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ ok: false, error: "db not configured" }, { status: 500 });
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
    const body = await req.json();
    const { title, content, boardType, attachments } = body;
    if (!title || !content || !boardType) return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    const post = await prisma.boardPost.create({
      data: {
        title,
        content,
        boardType,
        authorId: userId,
        attachments: {
          create: Array.isArray(attachments)
            ? attachments.map((att: any) => ({ key: att.key, filename: att.filename }))
            : [],
        },
      },
    });
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
