"use client";

import { PageLayout } from "@/components/PageLayout";
import { FileText, Download, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";

interface Item {
  id: number;
  title: string;
  author: string;
  date: string;
  type: string;
  downloads: number;
  key?: string; // R2 object key
}

const initialData: Item[] = [
  {
    id: 1,
    title: "제10회 HAM 학술대회 발표자료 (샘플)",
    author: "학술위원회",
    date: "2026.04.25",
    type: "학술대회",
    downloads: 0,
    key: "presentations/2026-04-25/sample.zip",
  },
];

export default function PresentationsPage() {
  const [items, setItems] = useState<Item[]>(initialData);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    // Wire to new API: fetch demo list
    fetch("/api/presentations/list")
      .then(async (res) => {
        if (!res.ok) throw new Error("자료 목록을 불러오지 못했습니다.");
        const data = await res.json();
        setItems(data.items as Item[]);
      })
      .catch(() => {
        // fallback to initialData if error
        setItems(initialData);
      });
  }, []);

  const download = async (it: Item) => {
    if (!it.key) {
      alert("자료 준비 중입니다.");
      return;
    }
    try {
      setDownloading(it.id);
      const res = await fetch(`/api/r2/get-url?key=${encodeURIComponent(it.key)}`);
      if (!res.ok) {
        if (res.status === 403) {
          alert("회원 전용 자료입니다. 로그인 후 이용해 주세요.");
          return;
        }
        throw new Error("서명 URL 발급 실패");
      }
      const data = await res.json();
      const url = data.url as string;
      window.location.href = url;
    } catch (e: any) {
      alert(e?.message || "다운로드 실패");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <PageLayout title="학술자료실" subtitle="Academic Resources" imageIndex={1}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a2e5a] to-[#2e5aa7] rounded-xl p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-2">학술 자료</h2>
          <p className="text-white/80 text-sm">
            학술대회 발표자료, 가이드라인, 프로토콜 등 다양한 학술 자료를 제공합니다.
          </p>
        </div>

        {/* Filter (static UI for now) */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button type="button" className="px-4 py-2 bg-[#1a2e5a] text-white rounded-lg text-sm font-medium">
            전체
          </button>
          <button type="button" className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
            학술대회
          </button>
          <button type="button" className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
            가이드라인
          </button>
          <button type="button" className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
            프로토콜
          </button>
        </div>

        {/* Resource List */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-[#1a2e5a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#1a2e5a]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          item.type === "학술대회"
                            ? "bg-[#c41e3a]/10 text-[#c41e3a]"
                            : item.type === "가이드라인"
                            ? "bg-[#2e5aa7]/10 text-[#2e5aa7]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1a2e5a] mb-2">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {item.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {item.downloads}회 다운로드
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => download(item)}
                  disabled={downloading === item.id}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a2e5a] text-white rounded-lg text-sm font-medium hover:bg-[#0f1d3a] transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">{downloading === item.id ? "발급 중..." : "다운로드"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
          <p>학술자료 다운로드는 회원 로그인 후 가능합니다.</p>
        </div>
      </div>
    </PageLayout>
  );
}
