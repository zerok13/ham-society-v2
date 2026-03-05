"use client";

import { PageLayout } from "@/components/PageLayout";
import { useEffect, useState } from "react";

interface PendingUser {
  name: string;
  email: string;
  phone: string;
  affiliation: string;
  specialty: string;
  memberLevel: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [setHamAuth, setSetHamAuth] = useState<{ [email: string]: boolean }>({});

  const load = () => {
    try {
      if (typeof window !== "undefined") {
        const usersStr = localStorage.getItem("ham_users");
        setUsers(usersStr ? JSON.parse(usersStr) : []);
      }
    } catch {}
  };

  useEffect(() => {
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

  const setHamAuthApi = async (email: string) => {
    try {
      await fetch("/api/ham_auth/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
  };

  const updateUser = async (email: string, nextStatus: "approved" | "denied") => {
    try {
      const updated = users.map((u) =>
        u.email.toLowerCase() === email.toLowerCase() ? { ...u, status: nextStatus } : u
      );
      setUsers(updated);
      localStorage.setItem("ham_users", JSON.stringify(updated));

      const u = updated.find((x) => x.email.toLowerCase() === email.toLowerCase());
      if (u) {
        notify(u.email, u.name, nextStatus);
        if (nextStatus === "approved" && setHamAuth[email]) {
          setHamAuthApi(email);
        }
      }
    } catch {}
  };

  const handleHamAuthChange = (email: string, checked: boolean) => {
    setSetHamAuth((prev) => ({
      ...prev,
      [email]: checked,
    }));
  };

  return (
    <PageLayout title="관리자" subtitle="회원 승인" imageIndex={1}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1a2e5a]">가입 승인 대기</h2>
            <button
              className="text-sm text-[#2e5aa7] hover:underline"
              onClick={load}
            >
              새로고침
            </button>
          </div>
          <div className="divide-y">
            {users.filter((u) => u.status === "pending").length === 0 && (
              <p className="p-6 text-gray-500 text-sm">승인 대기 중인 사용자가 없습니다.</p>
            )}
            {users
              .filter((u) => u.status === "pending")
              .map((u) => (
                <div key={u.email} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#1a2e5a]">{u.name} ({u.email})</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {u.affiliation} · {u.phone} · {u.specialty} · 등급: {u.memberLevel}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">신청일: {new Date(u.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`hamauth-${u.email}`}
                          checked={!!setHamAuth[u.email]}
                          onChange={(e) => handleHamAuthChange(u.email, e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor={`hamauth-${u.email}`} className="text-xs text-gray-700">
                          승인 시 HAM Auth 권한 부여
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateUser(u.email, "approved")}
                          className="px-4 py-2 rounded-lg bg-[#1a2e5a] text-white text-sm hover:bg-[#0f1d3a]"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => updateUser(u.email, "denied")}
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                        >
                          반려
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 승인/반려 이력 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-[#1a2e5a]">최근 처리 이력</h2>
          </div>
          <div className="divide-y">
            {users.filter((u) => u.status !== "pending").length === 0 && (
              <p className="p-6 text-gray-500 text-sm">처리된 이력이 없습니다.</p>
            )}
            {users
              .filter((u) => u.status !== "pending")
              .map((u) => (
                <div key={u.email} className="p-6">
                  <p className="text-sm text-gray-700">
                    {u.name} ({u.email}) — <span className={u.status === "approved" ? "text-[#1a2e5a] font-semibold" : "text-gray-500"}>{u.status === "approved" ? "승인" : "반려"}</span>
                  </p>
                </div>
              ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6">※ 데모 전용 페이지입니다. 실제 운영에서는 DB/백엔드로 전환하여 사용하세요.</p>
      </div>
    </PageLayout>
  );
}
