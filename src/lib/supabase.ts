import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// ── 클라이언트용 (브라우저 — publishable key) ─────────────────────────
export const supabase = createClient(
  SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── 서버용 (Route Handler 전용 — service_role JWT, RLS 우회) ─────────
//    Next.js 서버 컴포넌트 / Route Handler 에서만 import 할 것
export function getSupabaseAdmin() {
  return createClient(
    SUPABASE_URL,
    // Legacy JWT service_role 키 우선, 없으면 새 형식 키
    process.env.SUPABASE_JWT_SERVICE || process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export const GALLERY_BUCKET = "gallery";
export const GALLERY_TABLE  = "gallery_items";
