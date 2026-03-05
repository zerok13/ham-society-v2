"use client";

import Link from "next/link";
import { Plus, Calendar, Bell } from "lucide-react";
import { notices as noticeData, events as eventData } from "@/lib/data";

const notices = noticeData.slice(0, 4);
const events = eventData.filter((e) => e.isUpcoming).slice(0, 2);

export function NoticeSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Notices */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-slideInLeft">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#c41e3a]" />
                <h2 className="text-xl font-bold text-[#1a2e5a]">공지사항</h2>
              </div>
              <Link
                href="/news/notice"
                className="text-gray-400 hover:text-[#1a2e5a] transition-colors"
              >
                <Plus className="w-6 h-6" />
              </Link>
            </div>
            <ul className="space-y-4">
              {notices.map((notice) => (
                <li key={notice.id}>
                  <Link
                    href={`/news/notice/${notice.id}`}
                    className="group flex items-start gap-2"
                  >
                    {notice.isNew && (
                      <span className="flex-shrink-0 px-1.5 py-0.5 bg-[#c41e3a] text-white text-[10px] font-bold rounded">
                        NEW
                      </span>
                    )}
                    <span className="text-gray-700 group-hover:text-[#c41e3a] transition-colors line-clamp-1 flex-1">
                      {notice.title}
                    </span>
                    <span className="text-gray-400 text-sm flex-shrink-0">
                      {notice.date}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-slideInRight">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2e5aa7]" />
                <h2 className="text-xl font-bold text-[#1a2e5a]">주요행사일정</h2>
              </div>
              <Link
                href="/events/schedule"
                className="text-gray-400 hover:text-[#1a2e5a] transition-colors"
              >
                <Plus className="w-6 h-6" />
              </Link>
            </div>
            <ul className="space-y-4">
              {events.map((event) => (
                <li key={event.id}>
                  <Link
                    href={`/events/conference/${event.id}`}
                    className="group block p-4 bg-gray-50 rounded-lg hover:bg-[#1a2e5a] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-[#2e5aa7] text-white text-xs font-medium rounded">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium group-hover:text-white transition-colors">
                      {event.title}
                    </p>
                    <p className="text-gray-500 text-sm mt-1 group-hover:text-gray-300 transition-colors">
                      {event.location} | {event.time}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
