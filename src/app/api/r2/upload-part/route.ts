import { NextResponse } from "next/server";

// 메모리 기반 업로드 세션 공유 (같은 프로세스 내에서만)
// presign/route.ts의 uploadSessions와 동일한 Map을 참조하기 위해
// 글로벌 변수로 관리
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

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const uploadId = url.searchParams.get("uploadId");
    const partNumber = Number(url.searchParams.get("partNumber"));

    if (!uploadId || !partNumber) {
      return NextResponse.json({ error: "missing params" }, { status: 400 });
    }

    const sessions = getSessions();
    let session = sessions.get(uploadId);
    if (!session) {
      // 세션이 없으면 새로 생성 (presign init이 다른 인스턴스일 경우 대비)
      session = { key: uploadId, parts: new Map() };
      sessions.set(uploadId, session);
    }

    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    session.parts.set(partNumber, buffer);

    // ETag 역할을 하는 더미 값 반환
    const etag = `part-${partNumber}-${buffer.length}`;
    return new Response(null, {
      status: 200,
      headers: { ETag: etag },
    });
  } catch (e: any) {
    console.error("/api/r2/upload-part error", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
