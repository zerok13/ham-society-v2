/**
 * Supabase REST API 헬퍼 (순수 fetch 기반)
 * - @supabase/supabase-js SDK 미사용 → Netlify/Vercel/Node 20 환경 WebSocket 오류 없음
 * - 서버 전용 (Route Handler에서만 import)
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://xrvbwnfntfdvarvqpqcq.supabase.co";

// service_role JWT (우선순위: Legacy JWT > 새 형식 secret key)
function getServiceKey(): string {
  const key =
    process.env.SUPABASE_JWT_SERVICE ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Supabase service key not configured (SUPABASE_JWT_SERVICE or SUPABASE_SERVICE_ROLE_KEY)");
  return key;
}

// ── 공통 헤더 ────────────────────────────────────────────────────────
function adminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const key = getServiceKey();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    ...extra,
  };
}

// ── DB: 행 조회 ───────────────────────────────────────────────────────
export async function dbSelect<T>(
  table: string,
  params: Record<string, string> = {}
): Promise<T[]> {
  const qs = new URLSearchParams({ select: "*", order: "uploaded_at.desc", ...params });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${qs}`, {
    headers: adminHeaders({ "Content-Type": "application/json" }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DB select failed (${res.status}): ${body}`);
  }
  return res.json();
}

// ── DB: 행 삽입 ───────────────────────────────────────────────────────
export async function dbInsert(table: string, row: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: adminHeaders({
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    }),
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DB insert failed (${res.status}): ${body}`);
  }
}

// ── DB: 행 삭제 ───────────────────────────────────────────────────────
export async function dbDelete(table: string, id: string): Promise<void> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: adminHeaders({ "Content-Type": "application/json" }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DB delete failed (${res.status}): ${body}`);
  }
}

// ── DB: 단일 행 조회 ─────────────────────────────────────────────────
export async function dbSelectOne<T>(
  table: string,
  id: string
): Promise<T | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
    {
      headers: adminHeaders({ "Content-Type": "application/json" }),
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  const rows: T[] = await res.json();
  return rows[0] ?? null;
}

// ── Storage: 파일 업로드 ──────────────────────────────────────────────
// ✅ Buffer.from() 완전 제거 — ArrayBuffer를 Uint8Array로 직접 전달
//    이유: Buffer.from(arrayBuffer)는 Netlify Node 20 환경에서 메모리 2배 사용 및
//    `Buffer as BodyInit` 타입 캐스팅이 undici(Node 내장 fetch)에서 올바르게
//    처리되지 않아 대용량 파일에서 Function 크래시 발생
export async function storageUpload(
  bucket: string,
  path: string,
  data: ArrayBuffer | Uint8Array,
  contentType: string
): Promise<void> {
  // ArrayBuffer → Uint8Array 변환 (이미 Uint8Array면 그대로 사용)
  const uint8 = data instanceof Uint8Array ? data : new Uint8Array(data);

  // BodyInit 호환: TypeScript dom 타입에서 Uint8Array가 BodyInit으로 인식 안 될 때
  // ArrayBuffer.slice()로 복사 없이 동일 메모리의 ArrayBuffer 참조를 넘김
  const bodyData: BodyInit = uint8.buffer as ArrayBuffer;

  // PUT with upsert: 파일 이미 존재하면 덮어쓰기 (POST는 중복 시 에러)
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`,
    {
      method: "PUT",
      headers: adminHeaders({
        "Content-Type": contentType,
        "x-upsert": "true",   // 중복 파일명 → 덮어쓰기 허용
      }),
      // ArrayBuffer를 직접 body로 전달 — Buffer.from() 없이 메모리 복사 없음
      body: bodyData,
      // @ts-ignore — duplex 옵션: Node 18+ fetch streaming 필수
      duplex: "half",
    }
  );
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Storage upload failed (${res.status}): ${errBody}`);
  }
}

// ── Storage: 파일 삭제 ────────────────────────────────────────────────
export async function storageDelete(bucket: string, paths: string[]): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}`, {
    method: "DELETE",
    headers: adminHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ prefixes: paths }),
  });
  // 실패해도 throw 안 함 (삭제 실패는 치명적이지 않음)
  if (!res.ok) {
    const body = await res.text();
    console.warn(`Storage delete warning (${res.status}): ${body}`);
  }
}

// ── Storage: Signed URL 발급 ──────────────────────────────────────────
export async function storageSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/sign/${bucket}/${path}`,
    {
      method: "POST",
      headers: adminHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ expiresIn }),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Signed URL failed (${res.status}): ${body}`);
  }
  const responseData = await res.json();
  // signedURL 필드 형태: "/storage/v1/object/sign/bucket/path?token=..."
  const signedPath: string = responseData.signedURL ?? responseData.signedUrl ?? responseData.url ?? "";
  if (!signedPath) throw new Error(`Signed URL response missing: ${JSON.stringify(responseData)}`);
  // 절대 URL로 변환 (이미 https:// 로 시작하면 그대로 사용)
  return signedPath.startsWith("http") ? signedPath : `${SUPABASE_URL}/storage/v1${signedPath}`;
}

// ── Storage: Public URL (공개 버킷용) ────────────────────────────────
export function storagePublicUrl(bucket: string, path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export const GALLERY_BUCKET = "gallery";
export const GALLERY_TABLE  = "gallery_items";
