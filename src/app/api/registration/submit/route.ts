import { NextResponse } from "next/server";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://xrvbwnfntfdvarvqpqcq.supabase.co";

// Supabase 프로젝트 ref (URL에서 추출)
const SUPABASE_PROJECT_REF = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "").split(".")[0];

const TABLE = "symposium_registrations";

function getServiceKey(): string {
  const key =
    process.env.SUPABASE_JWT_SERVICE ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Supabase service key not configured");
  return key;
}

function adminHeaders(extra: Record<string, string> = {}) {
  const key = getServiceKey();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

// ── 테이블 자동 생성 ──────────────────────────────────────────
async function ensureTableExists(): Promise<boolean> {
  const key = getServiceKey();

  // Supabase Management API로 SQL 실행
  const sql = `
    CREATE TABLE IF NOT EXISTS ${TABLE} (
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
  `;

  try {
    const res = await fetch(
      `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sql }),
      }
    );
    if (res.ok) {
      console.log("[registration] table ensured via management API");
      return true;
    }
    const errBody = await res.text();
    console.error("[registration] management API error:", res.status, errBody);
    return false;
  } catch (e) {
    console.error("[registration] ensureTable error:", e);
    return false;
  }
}

// ── 이메일 발송 (Resend) ─────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[registration] (dev) email to:", to, "subject:", subject);
    return;
  }
  try {
    const mod = await import("resend");
    const resend = new mod.Resend(apiKey);
    await resend.emails.send({
      from: "HAM 투석길연구회 <no-reply@ksvsham.com>",
      to: [to],
      subject,
      html,
    });
  } catch (e) {
    console.error("[registration] email error:", e);
  }
}

function confirmHtml(data: {
  name: string;
  affiliation: string;
  role: string;
  email: string;
  regType: string;
}) {
  const fee = data.regType === "doctor" ? "10,000원" : "무료";
  const bankSection =
    data.regType === "doctor"
      ? `
    <div style="background:#fff8e1;border:1px solid #f59e0b;border-radius:8px;padding:16px 20px;margin:16px 0;">
      <p style="margin:0 0 10px;font-weight:bold;color:#92400e;font-size:14px;">💳 등록비 입금 안내</p>
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr>
          <td style="color:#6b7280;padding:4px 0;width:80px;">계좌번호</td>
          <td style="color:#111827;font-weight:bold;font-family:monospace;font-size:15px;">79423649415</td>
        </tr>
        <tr>
          <td style="color:#6b7280;padding:4px 0;">은행</td>
          <td style="color:#111827;font-weight:500;">카카오뱅크</td>
        </tr>
        <tr>
          <td style="color:#6b7280;padding:4px 0;">예금주</td>
          <td style="color:#111827;font-weight:500;">김형태</td>
        </tr>
        <tr>
          <td style="color:#6b7280;padding:4px 0;">금액</td>
          <td style="color:#c41e3a;font-weight:bold;">10,000원</td>
        </tr>
      </table>
      <p style="margin:10px 0 0;font-size:12px;color:#92400e;">
        ※ 반드시 등록 시 기재한 <strong>성명</strong>으로 입금해주세요.
      </p>
    </div>`
      : "";
  return `
<div style="font-family:'Noto Sans KR',sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;border-radius:12px;overflow:hidden;">
  <div style="background:#1a2e5a;padding:28px 32px;">
    <h2 style="margin:0;color:white;font-size:18px;">사전등록 접수 확인</h2>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">
      제 11회 대한혈관외과학회 혈액투석길 심포지엄
    </p>
  </div>
  <div style="padding:28px 32px;background:white;">
    <p style="margin:0 0 16px;color:#374151;">안녕하세요, <strong>${data.name}</strong>님.</p>
    <p style="margin:0 0 20px;color:#374151;line-height:1.6;">
      제 11회 HAM 심포지엄 사전등록 신청이 접수되었습니다.<br/>
      ${data.regType === "doctor"
        ? "아래 계좌로 등록비를 입금해 주시면 <strong>입금 확인 후 최종 등록 완료 메일</strong>을 보내드립니다."
        : "등록비가 무료이므로 별도 입금 없이 <strong>사전등록이 완료</strong>되었습니다."}
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
      <tr style="background:#f3f4f6;">
        <td style="padding:10px 14px;color:#6b7280;width:120px;">소속</td>
        <td style="padding:10px 14px;color:#111827;font-weight:500;">${data.affiliation}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;color:#6b7280;">역할</td>
        <td style="padding:10px 14px;color:#111827;font-weight:500;">${data.role || "—"}</td>
      </tr>
      <tr style="background:#f3f4f6;">
        <td style="padding:10px 14px;color:#6b7280;">구분</td>
        <td style="padding:10px 14px;color:#111827;font-weight:500;">${data.regType === "doctor" ? "의사" : "의료관련 업종"}</td>
      </tr>
      <tr>
        <td style="padding:10px 14px;color:#6b7280;">등록비</td>
        <td style="padding:10px 14px;color:#111827;font-weight:500;">${fee}</td>
      </tr>
    </table>
    ${bankSection}
    <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:14px 16px;border-radius:4px;margin:16px 0;font-size:13px;line-height:1.6;color:#92400e;">
      <strong>※ 주의사항</strong><br/>
      반드시 온라인 사전등록 신청 <strong>및</strong> 등록비 입금을 모두 완료하셔야 합니다.<br/>
      등록비 미입금 시 별도 통보 없이 자동 취소됩니다.<br/>
      <strong>사전등록 마감: 2026년 9월 30일(수) 23:59</strong>
    </div>
    <p style="font-size:13px;color:#6b7280;margin:16px 0 0;">
      문의: 010-2688-5625 / zerok13@gmail.com
    </p>
  </div>
  <div style="background:#f3f4f6;padding:16px 32px;font-size:12px;color:#9ca3af;text-align:center;">
    © 2026 대한혈관외과학회 혈액투석길연구회
  </div>
</div>`;
}

// ── 실제 INSERT 시도 ──────────────────────────────────────────
async function doInsert(row: Record<string, unknown>) {
  return fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: adminHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify(row),
  });
}

// ── POST handler ─────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      residentNumber,
      affiliation,
      licenseNumber,
      role,
      phone,
      email,
      bankAccount,
      regType, // "doctor" | "medical"
    } = body;

    // 필수 필드 검증
    if (!name || !residentNumber || !affiliation || !licenseNumber || !phone || !email || !regType) {
      return NextResponse.json({ ok: false, error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
    }

    // 이메일 중복 체크
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?email=eq.${encodeURIComponent(email)}&select=id`,
      { headers: adminHeaders() }
    );
    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json(
          { ok: false, error: "이미 등록된 이메일입니다. 문의: 010-2688-5625" },
          { status: 409 }
        );
      }
    }

    const row = {
      name,
      resident_number: residentNumber,
      affiliation,
      license_number: licenseNumber,
      role: role || "",
      phone,
      email,
      bank_account: bankAccount || "",
      reg_type: regType,
      event_id: 11,
      status: "pending",
    };

    // 1차 INSERT 시도
    let insertRes = await doInsert(row);

    // 테이블 미존재 시 → 자동 생성 후 재시도
    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error("[registration] supabase insert error:", errText);

      const isTableMissing =
        errText.includes("does not exist") ||
        errText.includes("relation") ||
        insertRes.status === 404;

      if (isTableMissing) {
        console.log("[registration] table missing, attempting auto-create...");
        const created = await ensureTableExists();

        if (created) {
          // 재시도
          insertRes = await doInsert(row);

          if (!insertRes.ok) {
            const retryErr = await insertRes.text();
            console.error("[registration] retry insert error:", retryErr);
            return NextResponse.json(
              { ok: false, error: "저장 실패. 잠시 후 다시 시도해주세요." },
              { status: 500 }
            );
          }
          // 재시도 성공 — 이메일 발송으로 진행
        } else {
          // 자동 생성도 실패 → Google Sheets 폴백 안내
          return NextResponse.json(
            {
              ok: false,
              error: "시스템 준비 중입니다. 아래 이메일로 직접 등록 요청 부탁드립니다: zerok13@gmail.com",
            },
            { status: 503 }
          );
        }
      } else {
        return NextResponse.json({ ok: false, error: "저장 실패. 잠시 후 다시 시도해주세요." }, { status: 500 });
      }
    }

    // 확인 이메일 발송
    await sendEmail(
      email,
      "[HAM] 제11회 심포지엄 사전등록 접수 확인",
      confirmHtml({ name, affiliation, role: role || "", email, regType })
    );

    // 관리자 알림
    await sendEmail(
      "zerok13@gmail.com",
      `[HAM 사전등록] ${name} (${affiliation}) 접수`,
      `<p>이름: ${name}<br/>소속: ${affiliation}<br/>구분: ${regType === "doctor" ? "의사" : "의료관련업종"}<br/>연락처: ${phone}<br/>이메일: ${email}<br/>역할: ${role || "—"}</p>`
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[registration] error:", e);
    return NextResponse.json({ ok: false, error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
