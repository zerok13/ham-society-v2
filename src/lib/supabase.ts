import { createClient } from "@supabase/supabase-js";

// ── URL: NEXT_PUBLIC_ 또는 서버 전용 변수 둘 다 지원 ─────────────────
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://xrvbwnfntfdvarvqpqcq.supabase.co"; // fallback

// ── 클라이언트용 (브라우저 — publishable key) ─────────────────────────
export const supabase = createClient(
  SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── 서버용 (Route Handler 전용 — service_role JWT, RLS 우회) ─────────
export function getSupabaseAdmin() {
  // 우선순위: Legacy JWT > 새 형식 secret key
  const serviceKey =
    process.env.SUPABASE_JWT_SERVICE ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error(
      "[Supabase] 서버 키 없음 — SUPABASE_JWT_SERVICE 또는 SUPABASE_SERVICE_ROLE_KEY 환경변수를 설정하세요."
    );
  }

  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false },
  });
}

export const GALLERY_BUCKET = "gallery";
export const GALLERY_TABLE  = "gallery_items";
