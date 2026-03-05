import { NextResponse } from "next/server";

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[notify/approval] (dev) to:", to, "subject:", subject);
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
    console.error("[notify/approval] error: ", e);
    throw e;
  }
}

export async function POST(req: Request) {
  try {
    const { email, name, status } = await req.json();
    if (!email || !status) return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });

    const subject = status === "approved" ? "[HAM] 회원가입 승인 안내" : "[HAM] 회원가입 반려 안내";
    const body =
      status === "approved"
        ? `<p>${name || "회원"}님, 회원가입이 승인되었습니다.</p><p>이제 로그인 후 서비스를 이용하실 수 있습니다.</p>`
        : `<p>${name || "회원"}님, 회원가입이 반려되었습니다.</p><p>자세한 사유는 사무국에 문의해 주시기 바랍니다.</p>`;

    await sendEmail(email, subject, body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
