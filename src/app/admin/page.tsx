"use client";

import { PageLayout } from "@/components/PageLayout";
import { useEffect, useState } from "react";
import {
  UserCheck, UserX, RefreshCw, ShieldAlert,
  Bell, Calendar, FileText, Users,
  PlusCircle, Pencil, Trash2, X, Check,
} from "lucide-react";

// ── 타입 정의 ──────────────────────────────────────────────
interface PendingUser {
  id?: number; name: string; email: string; phone: string;
  affiliation: string; specialty: string; memberLevel: string;
  status: "pending" | "approved" | "denied"; createdAt: string;
}
interface Notice {
  id: number; title: string; date: string; content: string;
  isNew: boolean; category: string; priority: string;
}
interface HAMEvent {
  id: number; title: string; date: string; location: string;
  time: string; description: string; isUpcoming: boolean; type: string;
}

type Tab = "notices" | "events" | "presentations" | "members";

// ── 초기 폼 값 ─────────────────────────────────────────────
const emptyNotice = (): Partial<Notice> => ({
  title: "", content: "", category: "공지", priority: "일반", isNew: true,
});
const emptyEvent = (): Partial<HAMEvent> => ({
  title: "", date: "", location: "", time: "", description: "",
  isUpcoming: true, type: "정기 학술대회",
});

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>("notices");

  // ── 공지사항 상태 ───────────────────────────────────────
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticeForm, setNoticeForm] = useState<Partial<Notice>>(emptyNotice());
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);
  const [showNoticeForm, setShowNoticeForm] = useState(false);

  // ── 행사 상태 ──────────────────────────────────────────
  const [events, setEvents] = useState<HAMEvent[]>([]);
  const [eventForm, setEventForm] = useState<Partial<HAMEvent>>(emptyEvent());
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);

  // ── 회원 상태 ──────────────────────────────────────────
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ── 공통 ──────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const ok = typeof window !== "undefined" && sessionStorage.getItem("ham_admin") === "1";
    setIsAdmin(ok);
    if (ok) { loadNotices(); loadEvents(); loadUsers(); }
  }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 6000); };

  // ── 공지사항 CRUD ──────────────────────────────────────
  const loadNotices = async () => {
    try {
      const res = await fetch("/api/admin/notices");
      if (res.ok) {
        const data = await res.json();
        if (data.notices) { setNotices(data.notices); return; }
      }
    } catch {}
    // data.ts 정적 데이터 fallback
    const { notices: staticNotices } = await import("@/lib/data");
    setNotices(staticNotices as Notice[]);
  };

  const saveNotice = async () => {
    setSaving(true);
    try {
      const method = editingNoticeId ? "PUT" : "POST";
      const body = editingNoticeId ? { ...noticeForm, id: editingNoticeId } : noticeForm;
      const res = await fetch("/api/admin/notices", {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        flash(data.message || (editingNoticeId ? "✅ 수정 완료 (1-2분 후 반영)" : "✅ 등록 완료 (1-2분 후 반영)"));
        setShowNoticeForm(false);
        setEditingNoticeId(null);
        setNoticeForm(emptyNotice());
        await loadNotices();
      } else {
        flash("❌ 저장 실패: " + (data.error || "알 수 없는 오류"));
      }
    } catch (e: any) {
      flash("❌ 오류: " + (e.message || "네트워크 오류"));
    } finally { setSaving(false); }
  };

  const deleteNotice = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/notices?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      flash(data.message || "🗑 삭제 완료 (1-2분 후 반영)");
    } else {
      flash("❌ 삭제 실패: " + (data.error || "알 수 없는 오류"));
    }
    await loadNotices();
  };

  const startEditNotice = (n: Notice) => {
    setNoticeForm({ title: n.title, content: n.content, category: n.category, priority: n.priority, isNew: n.isNew });
    setEditingNoticeId(n.id);
    setShowNoticeForm(true);
  };

  // ── 행사 CRUD ──────────────────────────────────────────
  const loadEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        const data = await res.json();
        if (data.events) { setEvents(data.events); return; }
      }
    } catch {}
    const { events: staticEvents } = await import("@/lib/data");
    setEvents(staticEvents as HAMEvent[]);
  };

  const saveEvent = async () => {
    setSaving(true);
    try {
      const method = editingEventId ? "PUT" : "POST";
      const body = editingEventId ? { ...eventForm, id: editingEventId } : eventForm;
      const res = await fetch("/api/admin/events", {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        flash(data.message || (editingEventId ? "✅ 수정 완료 (1-2분 후 반영)" : "✅ 등록 완료 (1-2분 후 반영)"));
        setShowEventForm(false);
        setEditingEventId(null);
        setEventForm(emptyEvent());
        await loadEvents();
      } else {
        flash("❌ 저장 실패: " + (data.error || "알 수 없는 오류"));
      }
    } catch (e: any) {
      flash("❌ 오류: " + (e.message || "네트워크 오류"));
    } finally { setSaving(false); }
  };

  const deleteEvent = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      flash(data.message || "🗑 삭제 완료 (1-2분 후 반영)");
    } else {
      flash("❌ 삭제 실패: " + (data.error || "알 수 없는 오류"));
    }
    await loadEvents();
  };

  const startEditEvent = (e: HAMEvent) => {
    setEventForm({ title: e.title, date: e.date, location: e.location, time: e.time, description: e.description, isUpcoming: e.isUpcoming, type: e.type });
    setEditingEventId(e.id);
    setShowEventForm(true);
  };

  // ── 회원 관리 ──────────────────────────────────────────
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) { const d = await res.json(); setUsers(d.users || []); }
    } finally { setUsersLoading(false); }
  };

  const updateUser = async (email: string, status: "approved" | "denied") => {
    await fetch("/api/admin/approve", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, status }),
    });
    await loadUsers();
  };

  // ── 권한 없음 ──────────────────────────────────────────
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

  const tabs = [
    { id: "notices" as Tab, label: "공지사항", icon: Bell },
    { id: "events" as Tab, label: "학술행사", icon: Calendar },
    { id: "presentations" as Tab, label: "자료관리", icon: FileText },
    { id: "members" as Tab, label: "회원관리", icon: Users },
  ];

  const memberLevelLabel: Record<string, string> = {
    "regular-vascular": "정회원(혈관외과)",
    "junior-ksvs-other": "준회원(타과)",
    "junior-av": "준회원(AV관심)",
    "admin": "관리자",
  };

  return (
    <PageLayout title="관리자" subtitle="Admin Dashboard" imageIndex={1}>
      <div className="max-w-5xl mx-auto">

        {/* 플래시 메시지 */}
        {msg && (
          <div className="mb-4 px-4 py-3 bg-[#1a2e5a] text-white rounded-lg text-sm text-center font-medium">
            {msg}
          </div>
        )}

        {/* 탭 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id} type="button" onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === id ? "bg-[#1a2e5a] text-white" : "bg-white border text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* ── 공지사항 탭 ─────────────────────────────── */}
        {tab === "notices" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1a2e5a]">공지사항 관리</h2>
              <button
                type="button" onClick={() => { setShowNoticeForm(true); setEditingNoticeId(null); setNoticeForm(emptyNotice()); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1a2e5a] text-white text-sm rounded-lg hover:bg-[#0f1d3a]"
              >
                <PlusCircle className="w-4 h-4" /> 새 공지 작성
              </button>
            </div>

            {/* 작성/수정 폼 */}
            {showNoticeForm && (
              <div className="p-6 border-b bg-blue-50">
                <h3 className="font-bold text-[#1a2e5a] mb-4">{editingNoticeId ? "공지 수정" : "새 공지 작성"}</h3>
                <div className="grid gap-3">
                  <input
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="제목"
                    value={noticeForm.title || ""}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      className="px-3 py-2 border rounded-lg text-sm"
                      value={noticeForm.category || "공지"}
                      onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                    >
                      <option value="공지">공지</option>
                      <option value="안내">안내</option>
                      <option value="소식">소식</option>
                    </select>
                    <select
                      className="px-3 py-2 border rounded-lg text-sm"
                      value={noticeForm.priority || "일반"}
                      onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                    >
                      <option value="긴급">긴급</option>
                      <option value="중요">중요</option>
                      <option value="일반">일반</option>
                    </select>
                  </div>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg text-sm min-h-[200px] font-mono"
                    placeholder="내용을 입력하세요"
                    value={noticeForm.content || ""}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox" checked={noticeForm.isNew ?? true}
                      onChange={(e) => setNoticeForm({ ...noticeForm, isNew: e.target.checked })}
                      className="w-4 h-4"
                    />
                    NEW 뱃지 표시
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={saveNotice} disabled={saving}
                      className="flex items-center gap-1.5 px-5 py-2 bg-[#1a2e5a] text-white rounded-lg text-sm disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" /> {saving ? "저장 중..." : "저장"}
                    </button>
                    <button type="button"
                      onClick={() => { setShowNoticeForm(false); setEditingNoticeId(null); setNoticeForm(emptyNotice()); }}
                      className="flex items-center gap-1.5 px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                    >
                      <X className="w-4 h-4" /> 취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 공지 목록 */}
            <div className="divide-y">
              {notices.length === 0 ? (
                <p className="p-8 text-gray-400 text-sm text-center">공지사항이 없습니다.</p>
              ) : notices.map((n) => (
                <div key={n.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                        n.category === "공지" ? "bg-[#1a2e5a]/10 text-[#1a2e5a]" :
                        n.category === "안내" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      }`}>{n.category}</span>
                      {n.isNew && <span className="px-1.5 py-0.5 bg-[#c41e3a] text-white text-[10px] font-bold rounded">NEW</span>}
                      <span className="text-xs text-gray-400">{n.date}</span>
                    </div>
                    <p className="font-medium text-gray-800 truncate">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{n.content?.slice(0, 80)}...</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button type="button" onClick={() => startEditNotice(n)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
                    >
                      <Pencil className="w-3.5 h-3.5" /> 수정
                    </button>
                    <button type="button" onClick={() => deleteNotice(n.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-50 text-[#c41e3a] text-sm hover:bg-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> 삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 학술행사 탭 ─────────────────────────────── */}
        {tab === "events" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1a2e5a]">학술행사 관리</h2>
              <button type="button"
                onClick={() => { setShowEventForm(true); setEditingEventId(null); setEventForm(emptyEvent()); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1a2e5a] text-white text-sm rounded-lg hover:bg-[#0f1d3a]"
              >
                <PlusCircle className="w-4 h-4" /> 새 행사 등록
              </button>
            </div>

            {showEventForm && (
              <div className="p-6 border-b bg-blue-50">
                <h3 className="font-bold text-[#1a2e5a] mb-4">{editingEventId ? "행사 수정" : "새 행사 등록"}</h3>
                <div className="grid gap-3">
                  <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="행사명"
                    value={eventForm.title || ""} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="px-3 py-2 border rounded-lg text-sm" placeholder="날짜 (예: 2026.04.25)"
                      value={eventForm.date || ""} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
                    <input className="px-3 py-2 border rounded-lg text-sm" placeholder="시간 (예: 15:00~18:30)"
                      value={eventForm.time || ""} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} />
                  </div>
                  <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="장소"
                    value={eventForm.location || ""} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
                  <select className="px-3 py-2 border rounded-lg text-sm"
                    value={eventForm.type || "정기 학술대회"} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}>
                    <option value="정기 학술대회">정기 학술대회</option>
                    <option value="세미나">세미나</option>
                    <option value="워크샵">워크샵</option>
                  </select>
                  <textarea className="w-full px-3 py-2 border rounded-lg text-sm min-h-[120px]" placeholder="행사 설명"
                    value={eventForm.description || ""} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={eventForm.isUpcoming ?? true}
                      onChange={(e) => setEventForm({ ...eventForm, isUpcoming: e.target.checked })} className="w-4 h-4" />
                    예정된 행사로 표시
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={saveEvent} disabled={saving}
                      className="flex items-center gap-1.5 px-5 py-2 bg-[#1a2e5a] text-white rounded-lg text-sm disabled:opacity-50">
                      <Check className="w-4 h-4" /> {saving ? "저장 중..." : "저장"}
                    </button>
                    <button type="button"
                      onClick={() => { setShowEventForm(false); setEditingEventId(null); setEventForm(emptyEvent()); }}
                      className="flex items-center gap-1.5 px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      <X className="w-4 h-4" /> 취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="divide-y">
              {events.length === 0 ? (
                <p className="p-8 text-gray-400 text-sm text-center">등록된 행사가 없습니다.</p>
              ) : events.map((e) => (
                <div key={e.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded font-medium ${e.isUpcoming ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {e.isUpcoming ? "예정" : "완료"}
                      </span>
                      <span className="text-xs text-gray-400">{e.date}</span>
                    </div>
                    <p className="font-medium text-gray-800 truncate">{e.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{e.location} · {e.time}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button type="button" onClick={() => startEditEvent(e)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-100 text-gray-700 text-sm hover:bg-gray-200">
                      <Pencil className="w-3.5 h-3.5" /> 수정
                    </button>
                    <button type="button" onClick={() => deleteEvent(e.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-50 text-[#c41e3a] text-sm hover:bg-red-100">
                      <Trash2 className="w-3.5 h-3.5" /> 삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 자료 관리 탭 ────────────────────────────── */}
        {tab === "presentations" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1a2e5a]">자료 관리</h2>
              <a href="/resources/upload"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1a2e5a] text-white text-sm rounded-lg hover:bg-[#0f1d3a]">
                <PlusCircle className="w-4 h-4" /> 자료 업로드
              </a>
            </div>
            <div className="p-6">
              <iframe src="/admin/presentations" className="w-full min-h-[400px] border-0" title="자료 관리" />
            </div>
          </div>
        )}

        {/* ── 회원 관리 탭 ────────────────────────────── */}
        {tab === "members" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#1a2e5a]">가입 승인 대기</h2>
                  {users.filter(u => u.status === "pending").length > 0 && (
                    <span className="w-6 h-6 bg-[#c41e3a] text-white rounded-full text-xs flex items-center justify-center font-bold">
                      {users.filter(u => u.status === "pending").length}
                    </span>
                  )}
                </div>
                <button type="button" onClick={loadUsers}
                  className="flex items-center gap-1.5 text-sm text-[#2e5aa7] hover:underline">
                  <RefreshCw className="w-4 h-4" /> 새로고침
                </button>
              </div>
              <div className="divide-y">
                {usersLoading ? (
                  <div className="py-10 text-center text-gray-400">
                    <div className="animate-spin w-6 h-6 border-2 border-[#1a2e5a] border-t-transparent rounded-full mx-auto mb-2" />
                    불러오는 중...
                  </div>
                ) : users.filter(u => u.status === "pending").length === 0 ? (
                  <p className="p-8 text-gray-500 text-sm text-center">승인 대기 중인 사용자가 없습니다.</p>
                ) : users.filter(u => u.status === "pending").map((u) => (
                  <div key={u.email} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#1a2e5a]">{u.name}
                        <span className="text-gray-400 text-sm ml-2 font-normal">({u.email})</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {u.affiliation}{u.specialty && ` · ${u.specialty}`}
                        {u.memberLevel && ` · ${memberLevelLabel[u.memberLevel] || u.memberLevel}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => updateUser(u.email, "approved")}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#1a2e5a] text-white text-sm font-medium hover:bg-[#0f1d3a]">
                        <UserCheck className="w-4 h-4" /> 승인
                      </button>
                      <button type="button" onClick={() => updateUser(u.email, "denied")}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                        <UserX className="w-4 h-4" /> 반려
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 처리 이력 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-lg font-bold text-[#1a2e5a]">최근 처리 이력</h2>
              </div>
              <div className="divide-y">
                {users.filter(u => u.status !== "pending").length === 0 ? (
                  <p className="p-8 text-gray-500 text-sm text-center">처리된 이력이 없습니다.</p>
                ) : users.filter(u => u.status !== "pending").map((u) => (
                  <div key={u.email} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-800">{u.name}</span>
                      <span className="text-gray-400 text-sm ml-2">({u.email})</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {u.status === "approved" ? "✓ 승인" : "✗ 반려"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
