"use client";

import Link from "next/link";
import Image from "next/image";
import { FileVideo, FileText, Users, BookOpen, ArrowRight } from "lucide-react";

const quickLinks = [
  {
    id: 1,
    title: "학술대회 자료",
    description: "학술대회 발표 자료 및 초록을 보실 수 있습니다.",
    icon: FileText,
    href: "/resources/presentations",
    bgImage: "/images/slide-panel.jpg",
    color: "from-[#1a2e5a]",
  },
  {
    id: 2,
    title: "연구자료실",
    description: "AV Access 관련 연구 자료를 보실 수 있습니다.",
    icon: BookOpen,
    href: "/resources/research",
    bgImage: "/images/slide-av-study.jpg",
    color: "from-[#2e5aa7]",
  },
  {
    id: 3,
    title: "회원가입 안내",
    description: "HAM 회원 가입 및 회비 안내입니다.",
    icon: Users,
    href: "/members/join",
    bgImage: "/images/slide-group-winter.jpg",
    color: "from-[#1a2e5a]",
  },
  {
    id: 4,
    title: "포토갤러리",
    description: "학술대회 및 연구회 활동 사진을 보실 수 있습니다.",
    icon: FileVideo,
    href: "/gallery",
    bgImage: "/images/slide-group-suncheon.jpg",
    color: "from-[#2e5aa7]",
  },
];

export function QuickLinks() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a2e5a] mb-2">
            빠른 메뉴
          </h2>
          <p className="text-gray-500">HAM 주요 서비스 바로가기</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={link.bgImage}
                  alt={link.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${link.color} to-transparent opacity-80 group-hover:opacity-90 transition-opacity`} />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <link.icon className="w-8 h-8 mb-3 opacity-80" />
                <h3 className="text-lg font-bold mb-1">{link.title}</h3>
                <p className="text-sm text-white/80 line-clamp-2">
                  {link.description}
                </p>
                <div className="flex items-center gap-1 mt-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  바로가기
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
