import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getR2Bucket, getR2Client } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(req: Request) {
  try {
    // Demo auth: require ham_demo_user cookie to exist
    const cookieStore = await cookies();
    const user = cookieStore.get("ham_demo_user");
    if (!user) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
    }

    const url = new URL(req.url);
    const key = url.searchParams.get("key");
    if (!key) return NextResponse.json({ ok: false, error: "key required" }, { status: 400 });

    const client = getR2Client();
    const bucket = getR2Bucket();
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    const signed = await getSignedUrl(client, cmd, { expiresIn: 60 });
    return NextResponse.json({ ok: true, url: signed });
  } catch (e) {
    console.error("/api/r2/get-url error", e);
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
