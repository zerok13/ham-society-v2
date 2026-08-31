import { NextResponse } from "next/server";

/**
 * GET  /api/registration/setup  → 테이블 존재 여부 확인
 * POST /api/registration/setup  → 테이블 생성 (없는 경우)
 *
 * 관리자 전용 일회용 엔드포인트.
 * Supabase Management API를 사용해 symposium_registrations 테이블을 생성합니다.
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://xrvbwnfntfdvarvqpqcq.supabase.co";

const PROJECT_REF = SUPABASE_URL
  .replace("https://", "")
  .split(".")[0];

function getServiceKey(): string {
  const key =
    process.env.SUPABASE_JWT_SERVICE ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_JWT_SERVICE 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다.");
  return key;
}

const CREATE_SQL = `
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
);
CREATE INDEX IF NOT EXISTS idx_sym_reg_email ON symposium_registrations(email);
CREATE INDEX IF NOT EXISTS idx_sym_reg_created ON symposium_registrations(created_at DESC);
`;

// GET: 테이블 존재 확인
export async function GET() {
  try {
    const key = getServiceKey();
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

// POST: 테이블 생성
export async function POST() {
  try {
    const key = getServiceKey();

    // Supabase Management API — SQL 직접 실행
    const res = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: CREATE_SQL }),
      }
    );

    if (res.ok) {
      return NextResponse.json({
        ok: true,
        message: "symposium_registrations 테이블 생성 완료!",
        projectRef: PROJECT_REF,
      });
    }

    const errBody = await res.text();
    console.error("[setup] management API error:", res.status, errBody);

    return NextResponse.json(
      {
        ok: false,
        status: res.status,
        error: errBody,
        hint: "Supabase Management API가 service_role 키를 거부했습니다. Supabase 대시보드 > SQL Editor에서 직접 실행하세요.",
        sql: CREATE_SQL,
      },
      { status: 500 }
    );
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
