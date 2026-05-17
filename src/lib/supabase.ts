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
export async function storageUpload(
  bucket: string,
  path: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`,
    {
      method: "POST",
      headers: adminHeaders({ "Content-Type": contentType }),
      body: body as unknown as BodyInit,
    }
  );
  if (!res.ok) {
    const body2 = await res.text();
    throw new Error(`Storage upload failed (${res.status}): ${body2}`);
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
  const data = await res.json();
  return `${SUPABASE_URL}/storage/v1${data.signedURL}`;
}

export const GALLERY_BUCKET = "gallery";
export const GALLERY_TABLE  = "gallery_items";
