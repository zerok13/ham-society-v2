import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ ok: false, error: "db not configured" }, { status: 500 });

  try {
    const { email, status } = await req.json();
    if (!email || !status) return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    if (!["approved", "denied"].includes(status)) return NextResponse.json({ ok: false, error: "invalid status" }, { status: 400 });

    await prisma.user.update({
      where: { email },
      data: { status },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
