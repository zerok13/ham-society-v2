"use client";

import { useState } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  User,
  Building,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Banknote,
  Info,
  Loader2,
} from "lucide-react";

// ── 역할 선택지 ────────────────────────────────────────────────
const ROLES = ["해당없음", "좌장", "연자", "패널"];

// ── 폼 초기값 ─────────────────────────────────────────────────
const INIT = {
  name: "",
  residentNumber: "",
  affiliation: "",
  licenseNumber: "",
  role: "",
  phone: "",
  email: "",
  bankAccount: "",
  regType: "doctor" as "doctor" | "medical",
  agreePrivacy: false,
};

export default function RegisterPage() {
  const [form, setForm] = useState(INIT);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isDoctor = form.regType === "doctor";
  const needBank = ["좌장", "연자", "패널"].includes(form.role);

  function set(field: keyof typeof INIT, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.agreePrivacy) {
      setErrorMsg("개인정보 수집·이용에 동의해주세요.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/registration/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
      } else {
        setErrorMsg(data.error || "등록에 실패했습니다.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setStatus("error");
    }
  }

  // ── 성공 화면 ───────────────────────────────────────────────
  if (status === "success") {
    return (
      <PageLayout title="사전등록" subtitle="Pre-Registration">
        <div className="max-w-xl mx-auto text-center py-16 px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a2e5a] mb-3">사전등록이 완료되었습니다!</h2>
          <p className="text-gray-600 mb-2">
            입력하신 이메일로 접수 확인 메일이 발송되었습니다.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            (메일을 받지 못하셨을 경우 스팸함을 확인해주세요)
          </p>

          {isDoctor && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-left">
              <p className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <Banknote className="w-4 h-4" />
                등록비 입금 안내
              </p>
              <p className="text-amber-700 text-sm leading-relaxed">
                등록비 <strong>10,000원</strong>을 아래 계좌로 입금해주세요.<br />
                <span className="font-mono font-bold text-base">79423649415</span>{" "}
                카카오뱅크<br />
                예금주: KSVS투석길연구회(9415)
              </p>
              <p className="text-amber-600 text-xs mt-2">
                ※ 반드시 등록 시 기재한 성명으로 입금해주세요.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/events/conference/11"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1a2e5a] text-white rounded-lg font-medium hover:bg-[#2e5aa7] transition-colors"
            >
              프로그램 보기
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              홈으로
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // ── 메인 폼 ─────────────────────────────────────────────────
  return (
    <PageLayout title="사전등록" subtitle="Pre-Registration">
      <div className="max-w-2xl mx-auto px-4 pb-16">
        {/* Back */}
        <Link
          href="/events/conference/11"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1a2e5a] mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          행사 안내로 돌아가기
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a2e5a] to-[#2e5aa7] rounded-xl p-6 text-white mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#c41e3a] rounded-full text-xs font-bold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            사전등록 접수 중
          </div>
          <h1 className="text-xl font-bold leading-snug mb-1">
            제 11회 대한혈관외과학회 혈액투석길 심포지엄
          </h1>
          <p className="text-white/70 text-sm">The 11th KSVS Hemodialysis Access Meeting (HAM)</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/90">
            <span>📅 2026년 10월 18일 (일)</span>
            <span>📍 세종충남대학교병원 4층 도담홀</span>
          </div>
        </div>

        {/* 안내사항 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            사전등록 안내
          </p>
          <ul className="space-y-1 pl-1 text-blue-700 leading-relaxed">
            <li>• 사전등록 마감: <strong>2026년 9월 30일(수) 23:59</strong></li>
            <li>• 대한의사협회 평점: <strong>6점</strong></li>
            <li>• 강의록은 책자 대신 <strong>QR 프로그램북</strong>으로 제공됩니다.</li>
            <li>• ＊ 표시 항목은 필수 입력사항입니다.</li>
            <li>• 등록 완료 후 입력하신 이메일로 확인 메일이 발송됩니다.</li>
            <li>• 성명과 면허번호가 다를 경우 대한의사협회 평점 승인이 불가합니다.</li>
            <li>• 마감 이후 내용 수정은 불가합니다.</li>
          </ul>
        </div>

        {/* 등록비 안내 */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => set("regType", "doctor")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              isDoctor
                ? "border-[#1a2e5a] bg-[#1a2e5a]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isDoctor ? "border-[#1a2e5a]" : "border-gray-300"
                }`}
              >
                {isDoctor && <div className="w-2 h-2 rounded-full bg-[#1a2e5a]" />}
              </div>
              <span className="font-semibold text-gray-800">의사</span>
            </div>
            <p className="text-[#c41e3a] font-bold text-lg ml-6">10,000원</p>
          </button>
          <button
            type="button"
            onClick={() => set("regType", "medical")}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              !isDoctor
                ? "border-[#1a2e5a] bg-[#1a2e5a]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  !isDoctor ? "border-[#1a2e5a]" : "border-gray-300"
                }`}
              >
                {!isDoctor && <div className="w-2 h-2 rounded-full bg-[#1a2e5a]" />}
              </div>
              <span className="font-semibold text-gray-800">의료관련 업종</span>
            </div>
            <p className="text-green-600 font-bold text-lg ml-6">무료</p>
          </button>
        </div>

        {isDoctor && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm">
            <p className="font-semibold text-amber-800 mb-1">입금 계좌 안내</p>
            <p className="text-amber-700">
              <span className="font-mono font-bold">79423649415</span> 카카오뱅크 ·
              KSVS투석길연구회(9415)
            </p>
            <p className="text-amber-600 text-xs mt-1">
              ※ 반드시 등록 시 기재한 성명으로 입금하셔야 합니다.
            </p>
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] flex items-center gap-2">
              <User className="w-4 h-4" />
              인적사항
            </h3>

            {/* 성명 */}
            <Field label="성명" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="홍길동"
                required
                className={inputCls}
              />
            </Field>

            {/* 주민등록번호 */}
            <Field label="주민등록번호" required hint="예: 800101-1234567 (평점 신청용)">
              <input
                type="text"
                value={form.residentNumber}
                onChange={(e) => set("residentNumber", e.target.value)}
                placeholder="000000-0000000"
                required
                maxLength={14}
                className={inputCls}
              />
            </Field>

            {/* 소속 */}
            <Field label="소속" required>
              <input
                type="text"
                value={form.affiliation}
                onChange={(e) => set("affiliation", e.target.value)}
                placeholder="○○병원 / ○○외과"
                required
                className={inputCls}
              />
            </Field>

            {/* 의사면허번호 */}
            <Field label="의사면허번호" required>
              <input
                type="text"
                value={form.licenseNumber}
                onChange={(e) => set("licenseNumber", e.target.value)}
                placeholder="12345"
                required
                className={inputCls}
              />
            </Field>

            {/* 역할 */}
            <Field label="역할" hint="좌장·연자·패널인 경우 선택해주세요">
              <select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className={inputCls}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r === "해당없음" ? "" : r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] flex items-center gap-2">
              <Phone className="w-4 h-4" />
              연락처
            </h3>

            {/* 전화번호 */}
            <Field label="연락처(Tel)" required>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="010-1234-5678"
                required
                className={inputCls}
              />
            </Field>

            {/* 이메일 */}
            <Field label="이메일(Mail)" required hint="확인 메일이 발송됩니다">
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="example@email.com"
                required
                className={inputCls}
              />
            </Field>

            {/* 계좌번호 — 좌장/연자/패널만 */}
            {needBank && (
              <Field label="계좌번호" hint="좌장·연자·패널만 입력 (강사료 지급용)">
                <input
                  type="text"
                  value={form.bankAccount}
                  onChange={(e) => set("bankAccount", e.target.value)}
                  placeholder="은행명 계좌번호 예금주"
                  className={inputCls}
                />
              </Field>
            )}
          </div>

          {/* 개인정보 동의 */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              수집 항목: 성명, 주민등록번호, 소속, 의사면허번호, 연락처, 이메일<br />
              수집 목적: 심포지엄 사전등록 접수, 대한의사협회 평점 신청, 등록 확인 안내<br />
              보유 기간: 행사 종료 후 1년
            </p>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreePrivacy}
                onChange={(e) => set("agreePrivacy", e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#1a2e5a] cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-gray-700">
                개인정보 수집·이용에 동의합니다. <span className="text-[#c41e3a]">＊</span>
              </span>
            </label>
          </div>

          {/* 오류 메시지 */}
          {status === "error" && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 bg-[#c41e3a] hover:bg-[#a01830] disabled:bg-gray-400 text-white font-bold text-base rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                처리 중...
              </>
            ) : (
              "사전등록 신청하기"
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            문의: 010-2688-5625 · zerok13@gmail.com
          </p>
        </form>
      </div>
    </PageLayout>
  );
}

// ── 공통 스타일 ────────────────────────────────────────────────
const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2e5a]/40 focus:border-[#1a2e5a] transition-colors bg-white";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-[#c41e3a] ml-0.5">＊</span>}
        {hint && <span className="text-gray-400 font-normal ml-1.5 text-xs">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
