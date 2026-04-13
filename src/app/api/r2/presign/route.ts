import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// 글로벌 업로드 세션 (upload-part API와 공유)
declare global {
  // eslint-disable-next-line no-var
  var __uploadSessions: Map<string, { key: string; parts: Map<number, Buffer> }> | undefined;
}

function getSessions() {
  if (!global.__uploadSessions) {
    global.__uploadSessions = new Map();
  }
  return global.__uploadSessions;
}

// R2 가용 여부 확인
function isR2Configured() {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET
  );
}

// ─── 로컬 파일 업로드 (R2 미설정 시 fallback) ─────────────────────────
async function handleLocal(body: any): Promise<NextResponse> {
  const { action, key, uploadId } = body;
  const sessions = getSessions();

  if (action === "init") {
    const id = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessions.set(id, { key, parts: new Map() });
    return NextResponse.json({ uploadId: id, mode: "local" });
  }

  if (action === "sign-parts") {
    const parts: number[] = body.parts;
    const urls = parts.map((partNumber) => ({
      partNumber,
      url: `/api/r2/upload-part?uploadId=${uploadId}&partNumber=${partNumber}`,
    }));
    return NextResponse.json({ urls, mode: "local" });
  }

  if (action === "complete") {
    const session = sessions.get(uploadId);
    if (!session) return NextResponse.json({ error: "session not found" }, { status: 404 });

    const sortedParts = [...session.parts.entries()].sort((a, b) => a[0] - b[0]);
    const chunks = sortedParts.map(([, buf]) => buf);
    const merged = Buffer.concat(chunks);

    const keyDir = path.dirname(session.key);
    const uploadDir = path.join(process.cwd(), "public", "uploads", keyDir);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(process.cwd(), "public", "uploads", session.key);
    await writeFile(filePath, merged);
    sessions.delete(uploadId);

    return NextResponse.json({ ok: true, mode: "local", localPath: `/uploads/${session.key}` });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}

// ─── R2 업로드 ────────────────────────────────────────────────────────
async function handleR2(body: any): Promise<NextResponse> {
  const { getR2Bucket, getR2Client } = await import("@/lib/r2");
  const {
    CreateMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    UploadPartCommand,
  } = await import("@aws-sdk/client-s3");
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

  const client = getR2Client();
  const bucket = getR2Bucket();
  const { action, key, contentType, parts, uploadId } = body;

  if (action === "init") {
    const cmd = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType || "application/octet-stream",
    });
    const res = await client.send(cmd);
    return NextResponse.json({ uploadId: res.UploadId });
  }

  if (action === "sign-parts") {
    if (!uploadId || !Array.isArray(parts))
      return NextResponse.json({ error: "missing parts" }, { status: 400 });
    const urls = await Promise.all(
      parts.map(async (partNumber: number) => {
        const cmd = new UploadPartCommand({
          Bucket: bucket,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
        });
        const url = await getSignedUrl(client, cmd, { expiresIn: 60 * 5 });
        return { partNumber, url };
      })
    );
    return NextResponse.json({ urls });
  }

  if (action === "complete") {
    const { completedParts } = body;
    const cmd = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: completedParts },
    });
    await client.send(cmd);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (isR2Configured()) {
      return await handleR2(body);
    }
    return await handleLocal(body);
  } catch (e: any) {
    console.error("/api/r2/presign error", e);
    return NextResponse.json({ error: e?.message || "failed" }, { status: 500 });
  }
}
