"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

      // ✅ [핵심 수정] 브라우저에 로그인 정보를 저장하여 Header가 인식하게 합니다.
      sessionStorage.setItem("ham_auth", "1");
      if (user.role === "admin" || user.email.includes("admin")) {
        sessionStorage.setItem("ham_admin", "1");
      }

      alert(`로그인되었습니다. 환영합니다, ${user.name}님!`);
      
      // ✅ [핵심 수정] 강제로 메인으로 이동시켜 화면을 새로고침합니다.
      window.location.href = "/"; 
      
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image
              src="/logo.jpg"
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
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] outline-none transition-all"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
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
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2e5a] outline-none transition-all"
                  placeholder="비밀번호 입력"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a2e5a] text-white py-3 rounded-lg font-medium hover:bg-[#0f1d3a] transition-colors disabled:opacity-50"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              아직 회원이 아니신가요?{" "}
              <Link href="/signup" className="text-[#c41e3a] font-medium hover:underline">회원가입</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
