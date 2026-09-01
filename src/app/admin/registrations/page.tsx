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
  AlertTriangle,
  Send,
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

interface ConfirmResult {
  id: number;
  ok: boolean;
  name?: string;
  email?: string;
  mailSent?: boolean;
  error?: string;
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
  const [resendKeySet, setResendKeySet] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: "ok" | "err" | "warn"; detail?: string } | null>(null);

  // 관리자 인증 확인
  useEffect(() => {
    const ok = typeof window !== "undefined" && sessionStorage.getItem("ham_admin") === "1";
    setIsAdmin(ok);
  }, []);

  // 목록 불러오기 (resendKeySet도 함께 수신)
  const fetchRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/registration/confirm?status=${filter}`,
        { headers: { "x-admin-key": ADMIN_KEY } }
      );
      const data = await res.json();
      if (data.ok) {
        setRows(data.data);
        // resendKeySet이 명시적으로 내려올 때만 업데이트
        if (typeof data.resendKeySet === "boolean") {
          setResendKeySet(data.resendKeySet);
        }
      }
    } catch {
      setMsg({ text: "목록 조회 실패", type: "err" });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (isAdmin) fetchRows();
  }, [isAdmin, fetchRows]);

  // ── 완료 처리 (pending → confirmed + 메일 발송) ──────────
  async function handleConfirm(ids: number[]) {
    if (ids.length === 0) return;
    const names = rows.filter((r) => ids.includes(r.id)).map((r) => r.name).join(", ");
    if (!confirm(`${names} (${ids.length}명) 입금 확인 처리하고 완료 메일을 발송할까요?`)) return;

    await callConfirmApi(ids, false);
  }

  // ── 메일만 재발송 (이미 confirmed인 레코드에 force: true) ──
  async function handleResendMail(id: number, name: string) {
    if (!confirm(`${name}님에게 완료 메일을 재발송할까요?`)) return;
    await callConfirmApi([id], true);
  }

  // ── 공통 API 호출 ─────────────────────────────────────────
  async function callConfirmApi(ids: number[], force: boolean) {
    setLoading(true);
    try {
      const res = await fetch("/api/registration/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({ ids, force }),
      });
      const data = await res.json();

      // resendKeySet 동기화
      if (typeof data.resendKeySet === "boolean") {
        setResendKeySet(data.resendKeySet);
      }

      const results: ConfirmResult[] = data.results ?? [];
      const successList = results.filter((r) => r.ok && r.mailSent);
      const failList = results.filter((r) => !r.ok || !r.mailSent);

      if (successList.length > 0 && failList.length === 0) {
        // 전체 성공
        setMsg({
          text: `✅ ${successList.length}명 메일 발송 완료`,
          type: "ok",
          detail: successList.map((r) => `${r.name} (${r.email})`).join(", "),
        });
        setSelected(new Set());
        await fetchRows();
      } else if (successList.length > 0) {
        // 일부 성공
        const failDetail = failList
          .map((r) => `${r.name ?? `id=${r.id}`}: ${r.error ?? "실패"}`)
          .join(" | ");
        setMsg({
          text: `⚠️ ${successList.length}명 성공 / ${failList.length}명 실패`,
          type: "warn",
          detail: `실패: ${failDetail}`,
        });
        setSelected(new Set());
        await fetchRows();
      } else {
        // 전체 실패
        const failDetail = failList
          .map((r) => `${r.name ?? `id=${r.id}`}: ${r.error ?? "실패"}`)
          .join(" | ");
        setMsg({
          text: data.error || `❌ 메일 발송 실패 (${failList.length}명)`,
          type: "err",
          detail: failDetail,
        });
      }
    } catch {
      setMsg({ text: "네트워크 오류", type: "err" });
    } finally {
      setLoading(false);
    }
  }

  // ── 선택된 confirmed 행들에 일괄 메일 재발송 ──────────────
  async function handleResendSelected() {
    const confirmedIds = selectedArr.filter(
      (id) => rows.find((r) => r.id === id)?.status === "confirmed"
    );
    if (confirmedIds.length === 0) return;
    const names = rows
      .filter((r) => confirmedIds.includes(r.id))
      .map((r) => r.name)
      .join(", ");
    if (!confirm(`${names} (${confirmedIds.length}명)에게 완료 메일을 재발송할까요?`)) return;
    await callConfirmApi(confirmedIds, true);
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
  const selectedConfirmed = selectedArr.filter((id) => rows.find((r) => r.id === id)?.status === "confirmed");

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

        {/* ⚠️ RESEND_API_KEY 미설정 경고 배너 */}
        {resendKeySet === false && (
          <div className="mb-4 flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-300 rounded-xl text-sm text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">RESEND_API_KEY가 설정되지 않았습니다</p>
              <p className="text-amber-700 mt-0.5">
                Netlify 환경변수에 <code className="bg-amber-100 px-1 rounded text-xs font-mono">RESEND_API_KEY</code>를 설정해야 완료 메일이 실제로 발송됩니다.
                현재 버튼을 눌러도 메일이 발송되지 않습니다.
              </p>
            </div>
          </div>
        )}

        {/* 알림 메시지 */}
        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
            msg.type === "ok"
              ? "bg-green-50 text-green-700 border border-green-200"
              : msg.type === "warn"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p>{msg.text}</p>
                {msg.detail && (
                  <p className="mt-1 text-xs opacity-80 font-normal break-all">{msg.detail}</p>
                )}
              </div>
              <button onClick={() => setMsg(null)} className="opacity-60 hover:opacity-100 flex-shrink-0">✕</button>
            </div>
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

          <div className="flex gap-2 ml-auto flex-wrap">
            {/* 선택된 pending 완료 처리 */}
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
            {/* 선택된 confirmed 메일 재발송 */}
            {selectedConfirmed.length > 0 && (
              <button
                onClick={handleResendSelected}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                선택 {selectedConfirmed.length}명 메일 재발송
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
                          /* pending: 완료 처리 버튼 */
                          <button
                            onClick={() => handleConfirm([r.id])}
                            disabled={loading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                          >
                            <Mail className="w-3 h-3" />
                            완료 처리
                          </button>
                        ) : (
                          /* confirmed: 메일만 재발송 버튼 */
                          <button
                            onClick={() => handleResendMail(r.id, r.name)}
                            disabled={loading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                          >
                            <Send className="w-3 h-3" />
                            메일 재발송
                          </button>
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
