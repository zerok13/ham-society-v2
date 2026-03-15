import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#1a2b4b] text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="rounded-full bg-white p-1" />
            <div>
              <div className="font-bold text-white text-lg">대한혈관외과학회</div>
              <div className="text-sm">혈액투석길 연구회 (HAM)</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed">대한혈관외과학회 혈액투석길 연구회는 투석 환자의 혈관 접근로에 관한 연구와 임상 경험을 공유하는 학술 단체입니다.</p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">사무국 연락처</h3>
          <ul className="space-y-2 text-sm">
            <li>📍 대전 중구 계룡로 832 중도일보 2층 세이브외과</li>
            <li>📞 010-2688-5625</li>
            <li>📠 FAX: 042-536-7778</li>
            <li>✉️ zerok13@gmail.com</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">바로가기</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/about/introduction" className="hover:text-white">연구회 소개</Link>
            <Link href="/news" className="hover:text-white">공지사항</Link>
            <Link href="/events/schedule" className="hover:text-white">학술행사</Link>
            <Link href="/signup" className="hover:text-white">회원가입</Link>
            <Link href="/resources" className="hover:text-white">학술자료</Link>
            <Link href="/privacy" className="hover:text-white">개인정보처리방침</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-xs">
        Copyright © 2026 대한혈관외과학회 혈액투석길 연구회 (HAM). All rights reserved.
      </div>
    </footer>
  );
}
