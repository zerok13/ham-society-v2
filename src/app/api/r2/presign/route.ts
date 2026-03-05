import { NextResponse } from "next/server";
import { getR2Bucket, getR2Client } from "@/lib/r2";
import {
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: Request) {
  try {
    const client = getR2Client();
    const bucket = getR2Bucket();

    const body = await req.json();
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
      if (!uploadId || !Array.isArray(parts)) return NextResponse.json({ error: "missing parts" }, { status: 400 });
      const urls = await Promise.all(
        parts.map(async (partNumber: number) => {
          const cmd = new UploadPartCommand({ Bucket: bucket, Key: key, UploadId: uploadId, PartNumber: partNumber });
          const url = await getSignedUrl(client, cmd, { expiresIn: 60 * 5 });
          return { partNumber, url };
        })
      );
      return NextResponse.json({ urls });
    }

    if (action === "complete") {
      const { completedParts } = body; // [{PartNumber, ETag}]
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
  } catch (e: any) {
    console.error("/api/r2/presign error", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
