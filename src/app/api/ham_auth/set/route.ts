import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
    // 데모 환경: 쿠키로 auth 표시 (실서비스에서는 DB/세션으로 처리)
    const res = NextResponse.json({ ok: true });
    res.cookies.set("ham_demo_user", email, { httpOnly: false, path: "/" });
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
