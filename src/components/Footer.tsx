import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#1a2b4b] text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* 1. 상단: 관련 사이트 영역 (새로 추가됨) */}
        <div className="border-b border-white/10 pb-6 mb-10 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <span className="text-white font-bold">관련 사이트:</span>
          <a 
            href="http://www.vascular.or.kr" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors"
          >
            대한혈관외과학회
          </a>
          <a 
            href="https://www.surgery.or.kr" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors"
          >
            대한외과학회
          </a>
        </div>

        {/* 2. 메인 컨텐츠 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* 로고 및 소개 */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-1 rounded-full overflow-hidden w-[60px] h-[60px] flex items-center justify-center">
                <Image src="/logo.jpg" alt="HAM Logo" width={50} height={50} />
              </div>
              <div>
                <div className="font-bold text-white text-xl tracking-tight">대한혈관외과학회</div>
                <div className="text-[#6ea8fe] font-medium">혈액투석길 연구회 (HAM)</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              대한혈관외과학회 혈액투석길 연구회는 투석 환자의 혈관 접근로에 관한 연구와 임상 경험을 공유하는 학술 단체입니다.
            </p>
          </div>

          {/* 사무국 연락처 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-[#c41e3a] pl-3">사무국 연락처</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-blue-400">📍</span>
                <span>대전 중구 계룡로 832 중도일보<br />2층 세이브외과</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">📞</span>
                <span>010-2688-5625</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">📠</span>
                <span>FAX: 042-536-7778</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-400">✉️</span>
                <span>zerok13@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* 바로가기 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-[#c41e3a] pl-3">바로가기</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Link href="/about/introduction" className="hover:text-white transition-colors">연구회 소개</Link>
              <Link href="/news" className="hover:text-white transition-colors">공지사항</Link>
              <Link href="/events/schedule" className="hover:text-white transition-colors">학술행사</Link>
              <Link href="/signup" className="hover:text-white transition-colors">회원가입</Link>
              <Link href="/resources" className="hover:text-white transition-colors">학술자료</Link>
              <Link href="/privacy" className="hover:text-white transition-colors text-gray-500">개인정보처리방침</Link>
            </div>
          </div>
        </div>

        {/* 3. 하단: 카피라이트 */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-[10px] uppercase tracking-widest text-gray-500">
          Copyright © 2026 대한혈관외과학회 혈액투석길 연구회 (HAM). All rights reserved.
        </div>
      </div>
    </footer>
  );
}
