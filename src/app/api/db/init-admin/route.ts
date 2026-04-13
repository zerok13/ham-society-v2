import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// POST /api/db/init-admin
// 관리자 계정 생성 또는 비밀번호 업데이트
export async function POST() {
  const prisma = new PrismaClient();
  try {
    const adminEmail = "admin@ksvsham.com";
    const adminPassword = "ksvsham2026";
    const passwordHash = bcrypt.hashSync(adminPassword, 10);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        passwordHash,
        status: "approved",
        memberLevel: "admin",
      },
      create: {
        email: adminEmail,
        name: "관리자",
        passwordHash,
        memberLevel: "admin",
        status: "approved",
      },
    });

    return NextResponse.json({ ok: true, message: "관리자 계정이 설정되었습니다." });
  } catch (e) {
    console.error("[init-admin]", e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
