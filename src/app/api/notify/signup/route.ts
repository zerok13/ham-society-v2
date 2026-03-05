import { NextResponse } from "next/server";

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[notify/signup] (dev) to:", to, "subject:", subject);
    return { id: "dev-log" } as any;
  }
  try {
    const mod = await import("resend");
    const resend = new mod.Resend(apiKey);
    const res = await resend.emails.send({
      from: "HAM <no-reply@ham.local>",
      to: [to],
      subject,
      html,
    });
    return res;
  } catch (e) {
    console.error("[notify/signup] error: ", e);
    throw e;
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, memberLevel } = await req.json();
    if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });

    // To admin
    const adminEmail = process.env.HAM_ADMIN_EMAIL || "zerok13@gmail.com";
    await sendEmail(
      adminEmail,
      "[HAM] 신규 회원가입 접수",
      `<p>신규 회원가입 신청이 접수되었습니다.</p>
       <ul>
        <li>이름: ${name || "-"}</li>
        <li>이메일: ${email}</li>
        <li>등급: ${memberLevel}</li>
       </ul>`
    );

    // To user
    await sendEmail(
      email,
      "[HAM] 회원가입 접수 안내",
      `<p>${name || "회원"}님, 안녕하세요.</p>
       <p>HAM 회원가입 신청이 접수되었습니다. 관리자 승인 후 로그인하실 수 있습니다.</p>
       <p>감사합니다.</p>`
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
