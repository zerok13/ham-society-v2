import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

/**
 * POST /api/registration/confirm
 * body: { id: number }  또는  { ids: number[] }
 *
 * 1. symposium_registrations.status → 'confirmed'
 * 2. 최종 등록 완료 메일 발송 (Resend)
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

function adminHeaders(extra: Record<string, string> = {}) {
  const key = getServiceKey();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

// ── 완료 확인 이메일 HTML ─────────────────────────────────
function confirmedHtml(data: {
  name: string;
  affiliation: string;
  regType: string;
  role: string;
}) {
  return `
<div style="font-family:'Noto Sans KR',sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;border-radius:12px;overflow:hidden;">
  <div style="background:#1a2e5a;padding:28px 32px;">
    <h2 style="margin:0;color:white;font-size:18px;">✅ 사전등록 최종 완료</h2>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">
      제 11회 대한혈관외과학회 혈액투석길 심포지엄
    </p>
  </div>
  <div style="padding:28px 32px;background:white;">
    <p style="margin:0 0 16px;color:#374151;">안녕하세요, <strong>${data.name}</strong>님.</p>
    <p style="margin:0 0 8px;color:#374151;line-height:1.6;">
      등록비 입금이 확인되어 <strong>사전등록이 최종 완료</strong>되었습니다. 🎉
    </p>
    <p style="margin:0 0 24px;color:#374151;line-height:1.6;">
      당일 행사장에서 명찰을 수령하신 후 입장하시면 됩니다.
    </p>

    <div style="background:#f0f4ff;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-weight:bold;color:#1a2e5a;font-size:15px;">📋 행사 안내</p>
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr>
          <td style="color:#6b7280;padding:5px 0;width:80px;">일시</td>
          <td style="color:#111827;font-weight:500;">2026년 10월 18일 (일)</td>
        </tr>
        <tr>
          <td style="color:#6b7280;padding:5px 0;">장소</td>
          <td style="color:#111827;font-weight:500;">세종충남대학교병원 4층 도담홀</td>
        </tr>
        <tr>
          <td style="color:#6b7280;padding:5px 0;">소속</td>
          <td style="color:#111827;font-weight:500;">${data.affiliation}</td>
        </tr>
        ${data.role ? `
        <tr>
          <td style="color:#6b7280;padding:5px 0;">역할</td>
          <td style="color:#111827;font-weight:500;">${data.role}</td>
        </tr>` : ""}
        <tr>
          <td style="color:#6b7280;padding:5px 0;">평점</td>
          <td style="color:#111827;font-weight:500;">대한의사협회 <strong>6점</strong></td>
        </tr>
        <tr>
          <td style="color:#6b7280;padding:5px 0;">강의록</td>
          <td style="color:#111827;font-weight:500;">QR 프로그램북 제공</td>
        </tr>
      </table>
    </div>

    <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:14px 16px;border-radius:4px;margin-bottom:20px;font-size:13px;line-height:1.6;color:#166534;">
      <strong>✅ 등록 완료</strong><br/>
      ${data.regType === "doctor" ? "등록비 입금이 확인되었습니다." : "등록비 무료 대상으로 등록이 완료되었습니다."}<br/>
      대한의사협회 평점은 행사 종료 후 신청 처리됩니다.
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

// ── 이메일 발송 ───────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[confirm] (dev) email to:", to);
    return;
  }
  const mod = await import("resend");
  const resend = new mod.Resend(apiKey);
  await resend.emails.send({
    from: "HAM 투석길연구회 <no-reply@ksvsham.com>",
    to: [to],
    subject,
    html,
  });
}

// ── POST: 입금 확인 + 완료 메일 발송 ─────────────────────
export async function POST(req: Request) {
  // 관리자 인증 (서버에서는 헤더로 체크)
  const authHeader = req.headers.get("x-admin-key");
  const adminKey = process.env.ADMIN_SECRET_KEY || "ham_admin_2026";
  if (authHeader !== adminKey) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const prisma = new PrismaClient();
  try {
    const body = await req.json();
    // 단건: { id } 또는 다건: { ids: [...] }
    const ids: number[] = body.ids ?? (body.id != null ? [body.id] : []);
    if (ids.length === 0) {
      return NextResponse.json({ ok: false, error: "id 또는 ids 필요" }, { status: 400 });
    }

    const results: { id: number; ok: boolean; error?: string }[] = [];

    for (const id of ids) {
      try {
        // 1. Supabase에서 등록자 정보 조회
        const fetchRes = await fetch(
          `${SUPABASE_URL}/rest/v1/symposium_registrations?id=eq.${id}&select=*`,
          { headers: adminHeaders() }
        );
        if (!fetchRes.ok) throw new Error("DB 조회 실패");
        const rows = await fetchRes.json();
        if (!rows || rows.length === 0) throw new Error(`id=${id} 없음`);
        const reg = rows[0];

        if (reg.status === "confirmed") {
          results.push({ id, ok: false, error: "이미 완료 처리됨" });
          continue;
        }

        // 2. status → confirmed 업데이트 (Prisma)
        await prisma.$executeRaw`
          UPDATE symposium_registrations
          SET status = 'confirmed'
          WHERE id = ${id}
        `;

        // 3. 완료 메일 발송
        await sendEmail(
          reg.email,
          "[HAM] 제11회 심포지엄 사전등록 최종 완료",
          confirmedHtml({
            name: reg.name,
            affiliation: reg.affiliation,
            regType: reg.reg_type,
            role: reg.role || "",
          })
        );

        results.push({ id, ok: true });
      } catch (e) {
        results.push({ id, ok: false, error: String(e) });
      }
    }

    const allOk = results.every((r) => r.ok);
    return NextResponse.json({ ok: allOk, results });
  } catch (e) {
    console.error("[confirm] error:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// ── GET: 등록자 목록 조회 ─────────────────────────────────
export async function GET(req: Request) {
  const authHeader = req.headers.get("x-admin-key");
  const adminKey = process.env.ADMIN_SECRET_KEY || "ham_admin_2026";
  if (authHeader !== adminKey) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // pending | confirmed | all

    let url = `${SUPABASE_URL}/rest/v1/symposium_registrations?select=*&order=created_at.desc`;
    if (status && status !== "all") {
      url += `&status=eq.${status}`;
    }

    const res = await fetch(url, {
      headers: adminHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    const rows = await res.json();
    return NextResponse.json({ ok: true, data: rows });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
