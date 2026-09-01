"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  RefreshCw,
  Mail,
  ArrowLeft,
  Users,
  ShieldAlert,
  Search,
  Download,
} from "lucide-react";

// ── 타입 ─────────────────────────────────────────────────
interface Registration {
  id: number;
  name: string;
  affiliation: string;
  license_number: string;
  role: string;
  phone: string;
  email: string;
  reg_type: "doctor" | "medical";
  status: "pending" | "confirmed";
  created_at: string;
  bank_account: string;
}

const ADMIN_KEY = "ham_admin_2026";

// ── 유틸 ─────────────────────────────────────────────────
function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function RegistrationsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<Registration[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "ok" | "err" } | null>(null);

  // 관리자 인증 확인
  useEffect(() => {
    const ok = typeof window !== "undefined" && sessionStorage.getItem("ham_admin") === "1";
    setIsAdmin(ok);
  }, []);

  // 목록 불러오기
  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/registration/confirm?status=${filter}`,
        { headers: { "x-admin-key": ADMIN_KEY } }
      );
      const data = await res.json();
      if (data.ok) setRows(data.data);
    } catch {
      setMsg({ text: "목록 조회 실패", type: "err" });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (isAdmin) fetchRows();
  }, [isAdmin, fetchRows]);

  // 완료 처리 (선택 항목)
  async function handleConfirm(ids: number[]) {
    if (ids.length === 0) return;
    const names = rows.filter((r) => ids.includes(r.id)).map((r) => r.name).join(", ");
    if (!confirm(`${names} (${ids.length}명) 입금 확인 처리하고 완료 메일을 발송할까요?`)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/registration/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      const successCount = data.results?.filter((r: { ok: boolean }) => r.ok).length ?? 0;
      const failCount = ids.length - successCount;

      if (successCount > 0) {
        setMsg({ text: `✅ ${successCount}명 완료 처리 및 메일 발송 완료${failCount > 0 ? ` (${failCount}명 실패)` : ""}`, type: "ok" });
        setSelected(new Set());
        await fetchRows();
      } else {
        setMsg({ text: data.error || "처리 실패", type: "err" });
      }
    } catch {
      setMsg({ text: "네트워크 오류", type: "err" });
    } finally {
      setLoading(false);
    }
  }

  // CSV 다운로드
  function downloadCsv() {
    const header = ["ID", "성명", "소속", "면허번호", "역할", "연락처", "이메일", "구분", "상태", "계좌번호", "등록일시"];
    const csvRows = filtered.map((r) => [
      r.id, r.name, r.affiliation, r.license_number, r.role || "—",
      r.phone, r.email,
      r.reg_type === "doctor" ? "의사" : "의료관련",
      r.status === "confirmed" ? "완료" : "대기",
      r.bank_account || "—",
      fmtDate(r.created_at),
    ]);
    const csv = [header, ...csvRows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HAM11_registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 필터 + 검색
  const filtered = rows.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.name.includes(search) ||
      r.affiliation.includes(search) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(search)
    );
  });

  const pendingCount = rows.filter((r) => r.status === "pending").length;
  const confirmedCount = rows.filter((r) => r.status === "confirmed").length;
  const selectedArr = Array.from(selected);
  const selectedPending = selectedArr.filter((id) => rows.find((r) => r.id === id)?.status === "pending");

  // ── 인증 실패 화면 ────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-sm w-full">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-800 mb-2">접근 권한 없음</h2>
          <p className="text-gray-500 text-sm mb-6">관리자 로그인 후 이용해주세요.</p>
          <Link href="/admin" className="inline-block px-5 py-2 bg-[#1a2e5a] text-white rounded-lg text-sm font-medium hover:bg-[#2e5aa7] transition-colors">
            관리자 페이지로
          </Link>
        </div>
      </div>
    );
  }

  // ── 메인 화면 ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-[#1a2e5a] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="hover:text-blue-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold">사전등록 관리</h1>
            <p className="text-white/60 text-xs">제11회 HAM 심포지엄</p>
          </div>
        </div>
        <button
          onClick={fetchRows}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          새로고침
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 알림 메시지 */}
        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between ${
            msg.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            <span>{msg.text}</span>
            <button onClick={() => setMsg(null)} className="ml-4 opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {/* 요약 카드 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">전체</p>
            <p className="text-2xl font-bold text-[#1a2e5a]">{rows.length}</p>
            <p className="text-xs text-gray-400">명</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
            <p className="text-xs text-amber-600 mb-1">입금 대기</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-xs text-amber-400">명</p>
          </div>
          <div className="bg-white rounded-xl border border-green-200 p-4 text-center">
            <p className="text-xs text-green-600 mb-1">완료</p>
            <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
            <p className="text-xs text-green-400">명</p>
          </div>
        </div>

        {/* 툴바 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap items-center gap-3">
          {/* 상태 필터 */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            {(["all", "pending", "confirmed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setSelected(new Set()); }}
                className={`px-3 py-1.5 transition-colors ${
                  filter === f ? "bg-[#1a2e5a] text-white" : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                {f === "all" ? "전체" : f === "pending" ? "대기" : "완료"}
              </button>
            ))}
          </div>

          {/* 검색 */}
          <div className="flex items-center gap-2 flex-1 min-w-[180px] border border-gray-200 rounded-lg px-3 py-1.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="성명, 소속, 이메일, 연락처 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>

          <div className="flex gap-2 ml-auto">
            {/* 선택 완료 처리 */}
            {selectedPending.length > 0 && (
              <button
                onClick={() => handleConfirm(selectedPending)}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Mail className="w-4 h-4" />
                선택 {selectedPending.length}명 완료 처리
              </button>
            )}
            {/* CSV 다운로드 */}
            <button
              onClick={downloadCsv}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading && rows.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
              <p className="text-sm">불러오는 중...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">등록자가 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={filtered.length > 0 && filtered.every((r) => selected.has(r.id))}
                        onChange={(e) => {
                          if (e.target.checked) setSelected(new Set(filtered.map((r) => r.id)));
                          else setSelected(new Set());
                        }}
                        className="accent-[#1a2e5a]"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">상태</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">성명</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">소속</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">구분</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">역할</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">연락처</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">이메일</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">등록일시</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className={`hover:bg-gray-50 transition-colors ${selected.has(r.id) ? "bg-blue-50/40" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(r.id)}
                          onChange={(e) => {
                            const next = new Set(selected);
                            if (e.target.checked) next.add(r.id);
                            else next.delete(r.id);
                            setSelected(next);
                          }}
                          className="accent-[#1a2e5a]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {r.status === "confirmed" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" /> 완료
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3" /> 대기
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{r.affiliation}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          r.reg_type === "doctor"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {r.reg_type === "doctor" ? "의사" : "의료관련"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.role || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{r.phone}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate">{r.email}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmtDate(r.created_at)}</td>
                      <td className="px-4 py-3">
                        {r.status === "pending" ? (
                          <button
                            onClick={() => handleConfirm([r.id])}
                            disabled={loading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                          >
                            <Mail className="w-3 h-3" />
                            완료 처리
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">발송 완료</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 하단 요약 */}
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
              <span>총 {filtered.length}명 표시 중 {selected.size > 0 ? `/ ${selected.size}명 선택됨` : ""}</span>
              <span>의사: {filtered.filter(r => r.reg_type === "doctor").length}명 · 의료관련: {filtered.filter(r => r.reg_type === "medical").length}명</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
