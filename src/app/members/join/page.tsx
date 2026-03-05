import { PageLayout } from "@/components/PageLayout";
import { aboutInfo, contactInfo } from "@/lib/data";
import Link from "next/link";
import { Check, Users, FileText, Mail, Phone, Printer, MapPin } from "lucide-react";

const benefits = [
  "학술대회 및 연수교육 참가",
  "학술자료 및 발표자료 열람",
  "연구회 소식 및 공지사항 수신",
  "다기관 연구 참여 기회",
  "회원 전용 게시판 이용",
  "회원 네트워크 활용",
];

const requirements = [
  "대한혈관외과학회 정회원",
  "혈관외과 전문의",
  "AV access에 관심 있는 의사(준회원)",
];

// 신규: 회원 등급 / 혜택·권한 표
const tierRows = [
  { label: "학술대회/연수교육 참가", regular: true, junior: true },
  { label: "학술자료 열람", regular: true, junior: true },
  { label: "다기관 연구 참여", regular: true, junior: true },
  { label: "회원 게시판 이용", regular: true, junior: true },
  { label: "투표권/의결권", regular: true, junior: false },
  { label: "임원 자격", regular: true, junior: false },
];

export default function JoinPage() {
  return (
    <PageLayout title="회원가입 안내" subtitle="Membership" imageIndex={0}>
      <div className="max-w-4xl mx-auto">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1a2e5a] to-[#2e5aa7] rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1a2e5a] mb-2">
                HAM 회원이 되어주세요
              </h2>
              <p className="text-gray-600">
                대한혈관외과학회 혈액투석길 연구회는 AV access에 관심 있는 의사(준회원) 및 혈관외과 전문의 여러분을 환영합니다.
              </p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            {aboutInfo.membershipInfo.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Benefits */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-bold text-[#1a2e5a] mb-6">회원 혜택</h3>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#c41e3a]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#c41e3a]" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-bold text-[#1a2e5a] mb-6">가입 자격</h3>
            <ul className="space-y-4 mb-8">
              {requirements.map((req) => (
                <li key={req} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#1a2e5a]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-[#1a2e5a]" />
                  </div>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>

            <div className="border-t pt-6">
              <h4 className="font-semibold text-[#1a2e5a] mb-3">사무국 연락처</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#2e5aa7]" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-[#1a2e5a]">
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#2e5aa7]" />
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-[#1a2e5a]">
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-[#2e5aa7]" />
                  <span>FAX: {contactInfo.fax}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#2e5aa7] mt-0.5" />
                  <span>{contactInfo.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 신규: 회원 등급 및 혜택/권한 안내 표 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-lg font-bold text-[#1a2e5a] mb-6">회원 등급 및 혜택/권한</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-[#1a2e5a] font-semibold">항목</th>
                  <th className="text-center px-4 py-3 text-[#1a2e5a] font-semibold">정회원</th>
                  <th className="text-center px-4 py-3 text-[#1a2e5a] font-semibold">준회원</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tierRows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-3 text-gray-700">{row.label}</td>
                    <td className="px-4 py-3 text-center">
                      {row.regular ? (
                        <span className="inline-flex items-center gap-1 text-[#1a2e5a] font-medium"><Check className="w-4 h-4" /> 가능</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.junior ? (
                        <span className="inline-flex items-center gap-1 text-[#2e5aa7] font-medium"><Check className="w-4 h-4" /> 가능</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">※ 준회원은 AV access에 관심 있는 의사로 구성되며 투표권·임원 자격은 부여되지 않습니다.</p>
        </div>

        {/* 신규: 가입 FAQ */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-lg font-bold text-[#1a2e5a] mb-6">가입 FAQ</h3>
          <div className="space-y-3">
            <details className="group border rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-[#1a2e5a]">준회원과 정회원 차이는 무엇인가요?</summary>
              <p className="mt-2 text-sm text-gray-600">준회원은 AV access에 관심 있는 의사로 구성되어 학술대회, 자료 열람, 게시판 이용이 가능하며 투표권·임원 자격은 없습니다. 정회원은 대한혈관외과학회 정회원인 혈관외과 전문의로 투표권과 임원 자격이 부여됩니다.</p>
            </details>
            <details className="group border rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-[#1a2e5a]">가입 절차는 어떻게 되나요?</summary>
              <p className="mt-2 text-sm text-gray-600">온라인 가입 신청 후, 사무국 검토 및 승인 과정을 거쳐 최종 등록됩니다. 문의는 사무국 이메일/전화로 부탁드립니다.</p>
            </details>
            <details className="group border rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-[#1a2e5a]">회비 납부는 어떻게 하나요?</summary>
              <p className="mt-2 text-sm text-gray-600">회비 납부 안내는 공지/소식 또는 사무국을 통해 안내드립니다.</p>
            </details>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#1a2e5a] to-[#2e5aa7] rounded-xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-4">지금 가입하세요</h3>
          <p className="text-white/80 mb-6">
            HAM 회원으로 가입하시면 다양한 학술 활동과 연구에 참여하실 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-block bg-white text-[#1a2e5a] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              회원가입
            </Link>
            <Link
              href="/login"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
