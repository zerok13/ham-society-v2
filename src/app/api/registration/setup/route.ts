import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

/**
 * GET  /api/registration/setup  → 테이블 존재 여부 확인
 * POST /api/registration/setup  → 테이블 생성 (Prisma $executeRaw 사용)
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://xrvbwnfntfdvarvqpqcq.supabase.co";

function getServiceKey() {
  return (
    process.env.SUPABASE_JWT_SERVICE ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ""
  );
}

// GET: 테이블 존재 확인 (Supabase REST)
export async function GET() {
  try {
    const key = getServiceKey();
    if (!key) {
      return NextResponse.json({ ok: false, error: "서비스 키 없음" }, { status: 500 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/symposium_registrations?select=id&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (res.ok) {
      const rows = await res.json();
      return NextResponse.json({
        ok: true,
        tableExists: true,
        rowCount: Array.isArray(rows) ? rows.length : 0,
        message: "symposium_registrations 테이블이 존재합니다.",
      });
    }

    const body = await res.text();
    return NextResponse.json({
      ok: false,
      tableExists: false,
      status: res.status,
      detail: body,
      message: "테이블이 없습니다. POST /api/registration/setup 을 호출해 생성하세요.",
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

// DELETE: 테스트 데이터 삭제 (email 파라미터)
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json({ ok: false, error: "email 파라미터 필요" }, { status: 400 });
  }
  const prisma = new PrismaClient();
  try {
    await prisma.$executeRaw`
      DELETE FROM symposium_registrations WHERE email = ${email}
    `;
    return NextResponse.json({ ok: true, message: `${email} 삭제 완료` });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Prisma $executeRaw 로 테이블 생성
export async function POST() {
  const prisma = new PrismaClient();
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS symposium_registrations (
        id              SERIAL PRIMARY KEY,
        event_id        INTEGER NOT NULL DEFAULT 11,
        name            TEXT NOT NULL,
        resident_number TEXT NOT NULL,
        affiliation     TEXT NOT NULL,
        license_number  TEXT NOT NULL,
        role            TEXT,
        phone           TEXT NOT NULL,
        email           TEXT NOT NULL,
        bank_account    TEXT,
        reg_type        TEXT NOT NULL CHECK (reg_type IN ('doctor','medical')),
        status          TEXT NOT NULL DEFAULT 'pending',
        created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_sym_reg_email
      ON symposium_registrations(email)
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_sym_reg_created
      ON symposium_registrations(created_at DESC)
    `;

    return NextResponse.json({
      ok: true,
      message: "symposium_registrations 테이블 생성 완료!",
    });
  } catch (e) {
    console.error("[setup] prisma error:", e);
    return NextResponse.json(
      { ok: false, error: String(e) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
