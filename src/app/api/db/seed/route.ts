import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function POST() {
  const prisma = new PrismaClient();
  try {
    // ── Comment 테이블 자동 생성 (없을 경우) ───────────────────────────
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Comment" (
        "id"        SERIAL       NOT NULL,
        "content"   TEXT         NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "postId"    INTEGER      NOT NULL,
        "authorId"  INTEGER      NOT NULL,
        CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
      )
    `);

    // 외래키 제약이 없으면 추가 (PostgreSQL: 중복 추가 시 에러 발생하므로 조건 체크)
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'Comment_postId_fkey'
        ) THEN
          ALTER TABLE "Comment"
            ADD CONSTRAINT "Comment_postId_fkey"
            FOREIGN KEY ("postId") REFERENCES "BoardPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END$$
    `);

    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'Comment_authorId_fkey'
        ) THEN
          ALTER TABLE "Comment"
            ADD CONSTRAINT "Comment_authorId_fkey"
            FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
      END$$
    `);

    // ── 기본 사용자 시드 ────────────────────────────────────────────────
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

    // ── 발표자료 시드 ────────────────────────────────────────────────────
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
    console.error("[seed]", e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
