"use client";

import { PageLayout } from "@/components/PageLayout";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, EyeOff, Eye, RefreshCcw } from "lucide-react";

interface Item {
  id: number;
  title: string;
  author: string;
  date: string;
  type: string;
  downloads: number;
  key?: string;
  hidden?: boolean;
}

export default function AdminPresentationsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/presentations/list");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const mutate = async (payload: any) => {
    await fetch("/api/presentations/mutate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  return (
    <PageLayout title="자료 관리" subtitle="Admin Presentations" imageIndex={1}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1a2e5a]">등록된 자료</h2>
            <button onClick={load} className="inline-flex items-center gap-1 text-sm text-[#2e5aa7]"><RefreshCcw className="w-4 h-4" /> 새로고침</button>
          </div>
          <div className="divide-y">
            {loading && <p className="p-4 text-sm text-gray-500">불러오는 중...</p>}
            {!loading && items.length === 0 && <p className="p-4 text-sm text-gray-500">자료가 없습니다.</p>}
            {items.map((it) => (
              <div key={it.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-[#1a2e5a]">{it.title}</p>
                  <p className="text-xs text-gray-500">{it.type} · {it.date} · {it.author} · {it.key || "(키 없음)"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => mutate({ action: it.hidden ? "unhide" : "hide", id: it.id })}
                    className="px-3 py-2 rounded bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                  >
                    {it.hidden ? (<><Eye className="w-4 h-4 inline" /> 표시</>) : (<><EyeOff className="w-4 h-4 inline" /> 숨김</>)}
                  </button>
                  <button
                    onClick={() => mutate({ action: "delete", id: it.id })}
                    className="px-3 py-2 rounded bg-[#c41e3a] text-white text-sm hover:bg-[#a01830]"
                  >
                    <Trash2 className="w-4 h-4 inline" /> 삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <Link href="/admin/upload" className="text-[#1a2e5a] hover:underline">업로드 페이지로 이동</Link>
        </div>
      </div>
    </PageLayout>
  );
}
