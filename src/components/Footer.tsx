"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Printer } from "lucide-react";
import { contactInfo } from "@/lib/data";
import { Logo } from "@/components/Logo";

const relatedSites = [
  { name: "대한혈관외과학회", url: "https://www.ksvs.org/" },
  { name: "대한외과학회", url: "http://www.surgery.or.kr/" },
];

export function Footer() {
  return (
    <footer className="bg-[#1a2e5a] text-white">
      {/* Related Sites */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium">관련 사이트:</span>
            {relatedSites.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {site.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 bg-white rounded-lg p-1 flex-shrink-0">
                  <img src="/logo.jpg" alt="HAM 로고" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-bold text-lg 2xl:text-[16px] 2xl:font-normal">대한혈관외과학회</p>
                  <p className="text-sm text-gray-300 2xl:text-[18px] 2xl:font-bold">혈액투석길 연구회 (HAM)</p>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              대한혈관외과학회 혈액투석길 연구회는 투석 환자의 혈관 접근로에 관한
              연구와 임상 경험을 공유하는 학술 단체입니다.
            </p>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-4">사무국 연락처</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#4a90c9] flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  {contactInfo.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#4a90c9]" />
                <a href={`tel:${contactInfo.phone}`} className="text-gray-300 text-sm hover:text-white transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-[#4a90c9]" />
                <span className="text-gray-300 text-sm">FAX: {contactInfo.fax}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#4a90c9]" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-4">바로가기</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/about/introduction"
                className="text-gray-300 text-sm hover:text-white transition-colors"
              >
                연구회 소개
              </Link>
              <Link
                href="/news/notice"
                className="text-gray-300 text-sm hover:text-white transition-colors"
              >
                공지사항
              </Link>
              <Link
                href="/events/conference"
                className="text-gray-300 text-sm hover:text-white transition-colors"
              >
                학술행사
              </Link>
              <Link
                href="/members/join"
                className="text-gray-300 text-sm hover:text-white transition-colors"
              >
                회원가입
              </Link>
              <Link
                href="/resources/presentations"
                className="text-gray-300 text-sm hover:text-white transition-colors"
              >
                학술자료
              </Link>
              <Link
                href="/privacy"
                className="text-gray-300 text-sm hover:text-white transition-colors"
              >
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-400 text-sm">
            Copyright © 2026 대한혈관외과학회 혈액투석길 연구회 (HAM). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
