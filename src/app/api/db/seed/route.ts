import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function POST() {
  const prisma = new PrismaClient();
  try {
    const usersCount = await prisma.user.count();
    if (usersCount === 0) {
      const hash = bcrypt.hashSync("ham2026", 10);
      await prisma.user.create({
        data: {
          email: "member@ham.or.kr",
          name: "정회원",
          passwordHash: hash,
          memberLevel: "regular-vascular",
          status: "approved",
        },
      });
    }

    const presCount = await prisma.presentation.count();
    if (presCount === 0) {
      await prisma.presentation.create({
        data: {
          title: "제10회 HAM 학술대회 발표자료 (샘플)",
          author: "학술위원회",
          date: "2026.04.25",
          type: "학술대회",
          key: "presentations/2026-04-25/sample.zip",
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
