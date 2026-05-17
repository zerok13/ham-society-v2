import { getPrisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// 하드코딩 관리자 계정 (DB 없을 때도 로그인 가능)
const ADMIN_EMAIL = "admin@ksvsham.com";
const ADMIN_PASSWORD = "ksvsham2026";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password)
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });

    // ── 1) 관리자 계정 우선 체크 (DB 불필요) ─────────────────────────
    if (email === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ ok: false, error: "invalid credentials" }, { status: 401 });
      }
      const res = NextResponse.json({
        ok: true,
        user: { name: "관리자", email: ADMIN_EMAIL, level: "admin", role: "admin" },
      });
      res.cookies.set(
        "ham_demo_user",
        encodeURIComponent(JSON.stringify({ name: "관리자", email: ADMIN_EMAIL, role: "admin" })),
        { httpOnly: false, path: "/", sameSite: "lax" }
      );
      res.cookies.set("ham_auth", "1", { httpOnly: false, path: "/" });
      res.cookies.set("ham_admin", "1", { httpOnly: false, path: "/" });
      return res;
    }

    // ── 2) 일반 회원 → DB 조회 ────────────────────────────────────────
    const prisma = getPrisma();
    if (!prisma) {
      return NextResponse.json(
        { ok: false, error: "db not configured" },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    if (user.status !== "approved")
      return NextResponse.json({ ok: false, error: "not approved" }, { status: 403 });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return NextResponse.json({ ok: false, error: "invalid credentials" }, { status: 401 });

    const isAdmin =
      user.email.includes("admin") || user.memberLevel === "admin";

    const res = NextResponse.json({
      ok: true,
      user: {
        name: user.name,
        email: user.email,
        level: user.memberLevel,
        role: isAdmin ? "admin" : "member",
      },
    });
    res.cookies.set(
      "ham_demo_user",
      encodeURIComponent(JSON.stringify({ name: user.name, email: user.email, role: isAdmin ? "admin" : "member" })),
      { httpOnly: false, path: "/", sameSite: "lax" }
    );
    res.cookies.set("ham_auth", "1", { httpOnly: false, path: "/" });
    if (isAdmin) res.cookies.set("ham_admin", "1", { httpOnly: false, path: "/" });
    return res;
  } catch (e) {
    console.error("[login]", e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  } finally {
    try {
      const prisma = getPrisma();
      await prisma?.$disconnect();
    } catch {}
  }
}
