import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ ok: false, error: "db not configured" }, { status: 500 });

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    if (user.status !== "approved") return NextResponse.json({ ok: false, error: "not approved" }, { status: 403 });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return NextResponse.json({ ok: false, error: "invalid credentials" }, { status: 401 });

    // JWT/세션 발급 (데모에서는 쿠키로)
    const res = NextResponse.json({ ok: true, user: { name: user.name, email: user.email, level: user.memberLevel } });
    res.cookies.set("ham_demo_user", JSON.stringify({ name: user.name, email: user.email }), { httpOnly: false, path: "/" });
    res.cookies.set("ham_auth", "1", { httpOnly: false, path: "/" });
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
