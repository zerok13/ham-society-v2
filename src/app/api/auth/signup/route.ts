import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ ok: false, error: "db not configured" }, { status: 500 });

  try {
    const body = await req.json();
    const { name, email, password, phone, affiliation, specialty, memberLevel } = body;

    if (!email || !password) return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ ok: false, error: "user already exists" }, { status: 409 });

    const passwordHash = bcrypt.hashSync(password, 10);

    await prisma.user.create({
      data: {
        name: name || "신청자",
        email,
        passwordHash,
        phone: phone || "",
        affiliation: affiliation || "",
        specialty: specialty || "",
        memberLevel,
        status: "pending",
      },
    });

    // 이메일 알림 (생략)

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
