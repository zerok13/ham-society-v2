"use client";

import { PageLayout } from "@/components/PageLayout";
import { useEffect, useState } from "react";
import { UserCheck, UserX, RefreshCw, ShieldAlert } from "lucide-react";

interface PendingUser {
  id?: number;
  name: string;
  email: string;
  phone: string;
  affiliation: string;
  specialty: string;
  memberLevel: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
}

// DB API로 사용자 목록 조회 시도, 실패 시 빈 배열 반환
async function fetchUsersFromApi(): Promise<PendingUser[]> {
  try {
    const res = await fetch("/api/admin/users");
    if (!res.ok) return [];
    const data = await res.json();
    return data.users || [];
  } catch {
    return [];
  }
}

export default function AdminPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      // DB API 시도
      const apiUsers = await fetchUsersFromApi();
      if (apiUsers.length > 0) {
        setUsers(apiUsers);
      } else {
        // fallback: 빈 목록
        setUsers([]);
      }
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const adminCheck = typeof window !== "undefined" && sessionStorage.getItem("ham_admin") === "1";
    setIsAdmin(adminCheck);
    load();
  }, []);

  const notify = async (email: string, name: string, status: "approved" | "denied") => {
    try {
      await fetch("/api/notify/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, status }),
      });
    } catch {}
  };

  const updateUser = async (email: string, nextStatus: "approved" | "denied") => {
    try {
      // DB API 먼저 시도
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, status: nextStatus }),
      });

      if (res.ok) {
        await load(); // 새로고침
      } else {
        // API 없으면 로컬 상태만 업데이트
        setUsers((prev) =>
          prev.map((u) =>
            u.email.toLowerCase() === email.toLowerCase() ? { ...u, status: nextStatus } : u
          )
        );
      }

      const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
      if (u) notify(u.email, u.name, nextStatus);
    } catch {
      setUsers((prev) =>
        prev.map((u) =>
          u.email.toLowerCase() === email.toLowerCase() ? { ...u, status: nextStatus } : u
        )
      );
    }
  };

  if (!isAdmin) {
    return (
      <PageLayout title="관리자" subtitle="Admin" imageIndex={1}>
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-[#c41e3a]" />
          </div>
          <h2 className="text-xl font-bold text-[#1a2e5a] mb-2">접근 권한이 없습니다</h2>
          <p className="text-gray-500">관리자 계정으로 로그인해주세요.</p>
        </div>
      </PageLayout>
    );
  }

  const pendingUsers = users.filter((u) => u.status === "pending");
  const processedUsers = users.filter((u) => u.status !== "pending");

  const memberLevelLabel: Record<string, string> = {
    "regular-vascular": "정회원(혈관외과)",
    "junior-ksvs-other": "준회원(타과)",
    "junior-av": "준회원(AV관심)",
  };

  return (
    <PageLayout title="관리자" subtitle="회원 승인 관리" imageIndex={1}>
      <div className="max-w-5xl mx-auto">

        {/* 대기 중 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1a2e5a]">가입 승인 대기</h2>
              {pendingUsers.length > 0 && (
                <span className="w-6 h-6 bg-[#c41e3a] text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {pendingUsers.length}
                </span>
              )}
            </div>
            <button
              className="flex items-center gap-1.5 text-sm text-[#2e5aa7] hover:underline"
              onClick={load}
              type="button"
            >
              <RefreshCw className="w-4 h-4" /> 새로고침
            </button>
          </div>

          <div className="divide-y">
            {isLoading ? (
              <div className="py-10 text-center text-gray-400">
                <div className="animate-spin w-6 h-6 border-2 border-[#1a2e5a] border-t-transparent rounded-full mx-auto mb-2" />
                불러오는 중...
              </div>
            ) : pendingUsers.length === 0 ? (
              <p className="p-8 text-gray-500 text-sm text-center">승인 대기 중인 사용자가 없습니다.</p>
            ) : (
              pendingUsers.map((u) => (
                <div key={u.email} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#1a2e5a] text-lg">
                        {u.name}
                        <span className="text-gray-400 text-sm ml-2 font-normal">({u.email})</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {u.affiliation}
                        {u.phone && ` · ${u.phone}`}
                        {u.specialty && ` · ${u.specialty}`}
                        {u.memberLevel && ` · ${memberLevelLabel[u.memberLevel] || u.memberLevel}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        신청일: {new Date(u.createdAt).toLocaleString("ko-KR")}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => updateUser(u.email, "approved")}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#1a2e5a] text-white text-sm font-medium hover:bg-[#0f1d3a] transition-colors"
                      >
                        <UserCheck className="w-4 h-4" /> 승인
                      </button>
                      <button
                        type="button"
                        onClick={() => updateUser(u.email, "denied")}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        <UserX className="w-4 h-4" /> 반려
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 처리 이력 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-[#1a2e5a]">최근 처리 이력</h2>
          </div>
          <div className="divide-y">
            {processedUsers.length === 0 ? (
              <p className="p-8 text-gray-500 text-sm text-center">처리된 이력이 없습니다.</p>
            ) : (
              processedUsers.map((u) => (
                <div key={u.email} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-800">{u.name}</span>
                    <span className="text-gray-400 text-sm ml-2">({u.email})</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    u.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {u.status === "approved" ? "✓ 승인" : "✗ 반려"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
          ※ DB가 연결되어 있지 않으면 가입 신청 목록이 표시되지 않습니다.
          DB(PostgreSQL) 설정 후 정상 이용 가능합니다.
        </p>
      </div>
    </PageLayout>
  );
}
