"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 403) throw new Error("아직 승인되지 않은 계정입니다.");
        if (res.status === 404 || res.status === 401) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        throw new Error(body.error || "로그인 실패");
      }

      const { user } = await res.json();

      alert(`로그인되었습니다. 환영합니다, ${user.name}님!`);
      window.location.href = "/";
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image
                src="/monicalogo.png"
                alt="HAM 로고"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#1a2e5a]">로그인</h1>
            <p className="text-gray-600 text-sm mt-1">HAM 회원 전용 서비스</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent transition-all"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
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
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] focus:border-transparent transition-all"
                    placeholder="비밀번호 입력"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#1a2e5a] focus:ring-[#1a2e5a]" />
                  <span className="text-gray-600">로그인 상태 유지</span>
                </label>
                <a href="#" className="text-[#2e5aa7] hover:underline">
                  비밀번호 찾기
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a2e5a] text-white py-3 rounded-lg font-medium hover:bg-[#0f1d3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>

              {/* Demo credentials hint */}
              <p className="text-center text-xs text-gray-400 mt-2">테스트 계정: member@ham.or.kr / ham2026</p>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-4 text-sm text-gray-500">또는</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                아직 회원이 아니신가요?{" "}
                <Link href="/signup" className="text-[#c41e3a] font-medium hover:underline">
                  회원가입
                </Link>
              </p>
            </div>
          </div>

          {/* Help */}
          <p className="text-center text-gray-500 text-sm mt-6">
            로그인에 문제가 있으신가요?{" "}
            <a href="mailto:ham.society@vascular.or.kr" className="text-[#2e5aa7] hover:underline">
              문의하기
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
