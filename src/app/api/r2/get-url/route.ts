import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import path from "path";
import { existsSync } from "fs";

function isR2Configured() {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET
  );
}

export async function GET(req: Request) {
  try {
    // 로그인 확인
    const cookieStore = await cookies();
    const user = cookieStore.get("ham_demo_user");
    if (!user) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
    }

    const url = new URL(req.url);
    const key = url.searchParams.get("key");
    if (!key) return NextResponse.json({ ok: false, error: "key required" }, { status: 400 });

    // R2 설정 시 → signed URL 반환
    if (isR2Configured()) {
      const { getR2Client, getR2Bucket } = await import("@/lib/r2");
      const { GetObjectCommand } = await import("@aws-sdk/client-s3");
      const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

      const client = getR2Client();
      const bucket = getR2Bucket();
      const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
      const signed = await getSignedUrl(client, cmd, { expiresIn: 300 });
      return NextResponse.json({ ok: true, url: signed });
    }

    // R2 미설정 시 → 로컬 파일 경로 반환
    const localPath = path.join(process.cwd(), "public", "uploads", key);
    if (existsSync(localPath)) {
      // 로컬 public 경로로 직접 접근 가능한 URL 반환
      return NextResponse.json({ ok: true, url: `/uploads/${key}` });
    }

    return NextResponse.json({ ok: false, error: "file not found" }, { status: 404 });
  } catch (e) {
    console.error("/api/r2/get-url error", e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
