"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Lock, Phone, Building, Eye, EyeOff, Check } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    affiliation: "",
    specialty: "",
    specialtyOther: "", // 기타 전공 입력
    memberLevel: "junior-av", // 기본: 준회원(AV access 관심)
    agreeTerms: false,
    agreePrivacy: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 2) {
      setCurrentStep(2);
      return;
    }
    if (formData.specialty === "other" && !formData.specialtyOther.trim()) {
      alert("기타 전공을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          affiliation: formData.affiliation,
          specialty: formData.specialty === "other" ? formData.specialtyOther : formData.specialty,
          memberLevel: formData.memberLevel,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 409) throw new Error("이미 가입된 이메일입니다.");
        throw new Error(body.error || "가입 실패");
      }

      alert("회원가입 신청이 접수되었습니다.\n관리자 승인 후 로그인하실 수 있습니다.");
      window.location.href = "/login";
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <Image
                src="/logo.jpg"
                alt="HAM 로고"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#1a2e5a]">회원가입</h1>
            <p className="text-gray-600 text-sm mt-1">
              HAM 회원이 되어 다양한 혜택을 누리세요
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-[#1a2e5a]" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-[#1a2e5a] text-white" : "bg-gray-200"}`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className="text-sm font-medium hidden sm:inline">기본 정보</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-[#1a2e5a]" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-[#1a2e5a] text-white" : "bg-gray-200"}`}>
                2
              </div>
              <span className="text-sm font-medium hidden sm:inline">상세 정보</span>
            </div>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {currentStep === 1 && (
                <>
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      이름 <span className="text-[#c41e3a]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent"
                        placeholder="홍길동"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 <span className="text-[#c41e3a]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      비밀번호 <span className="text-[#c41e3a]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent"
                        placeholder="8자 이상 입력"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      비밀번호 확인 <span className="text-[#c41e3a]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent"
                        placeholder="비밀번호 재입력"
                      />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 <span className="text-[#c41e3a]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent"
                        placeholder="010-0000-0000"
                      />
                    </div>
                  </div>

                  {/* Member Level */}
                  <div>
                    <label htmlFor="memberLevel" className="block text-sm font-medium text-gray-700 mb-2">
                      회원 등급 <span className="text-[#c41e3a]">*</span>
                    </label>
                    <select
                      id="memberLevel"
                      required
                      value={formData.memberLevel}
                      onChange={(e) => setFormData({ ...formData, memberLevel: e.target.value })}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent"
                    >
                      <option value="regular-vascular">정회원 (대한혈관외과학회 정회원-혈관외과)</option>
                      <option value="junior-ksvs-other">준회원 (대한혈관외과학회 정회원-타과)</option>
                      <option value="junior-av">준회원 (AV access에 관심 있는 의사)</option>
                    </select>
                  </div>

                  {/* Affiliation */}
                  <div>
                    <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-2">
                      소속기관 <span className="text-[#c41e3a]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="affiliation"
                        type="text"
                        required
                        value={formData.affiliation}
                        onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent"
                        placeholder="병원/기관명"
                      />
                    </div>
                  </div>

                  {/* Specialty */}
                  <div>
                    <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                      전공
                    </label>
                    <select
                      id="specialty"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent"
                    >
                      <option value="">선택해주세요</option>
                      <option value="vascular">혈관외과</option>
                      <option value="general">외과</option>
                      <option value="other">기타</option>
                    </select>
                    {formData.specialty === "other" && (
                      <input
                        type="text"
                        value={formData.specialtyOther}
                        onChange={(e) => setFormData({ ...formData, specialtyOther: e.target.value })}
                        className="mt-2 block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent"
                        placeholder="기타 전공을 입력하세요"
                      />
                    )}
                  </div>

                  {/* Agreements */}
                  <div className="space-y-3 pt-4 border-t">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.agreeTerms}
                        onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        className="mt-1 rounded border-gray-300 text-[#1a2e5a] focus:ring-[#1a2e5a]"
                      />
                      <span className="text-sm text-gray-600">
                        <span className="text-[#c41e3a]">[필수]</span> 이용약관에 동의합니다
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.agreePrivacy}
                        onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                        className="mt-1 rounded border-gray-300 text-[#1a2e5a] focus:ring-[#1a2e5a]"
                      />
                      <span className="text-sm text-gray-600">
                        <span className="text-[#c41e3a]">[필수]</span> 개인정보 수집 및 이용에 동의합니다
                      </span>
                    </label>
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    이전
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#1a2e5a] text-white py-3 rounded-lg font-medium hover:bg-[#0f1d3a] transition-colors disabled:opacity-50"
                >
                  {isLoading ? "처리 중..." : currentStep < 2 ? "다음" : "가입하기"}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                이미 회원이신가요?{" "}
                <Link href="/login" className="text-[#c41e3a] font-medium hover:underline">
                  로그인
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
