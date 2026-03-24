import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ ok: false, error: "db not configured", users: [] }, { status: 200 });

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        affiliation: true,
        specialty: true,
        memberLevel: true,
        status: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ ok: true, users });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed", users: [] }, { status: 200 });
  } finally {
    await prisma.$disconnect();
  }
}
