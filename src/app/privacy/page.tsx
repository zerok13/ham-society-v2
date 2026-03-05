import { PageLayout } from "@/components/PageLayout";

export default function PrivacyPage() {
  return (
    <PageLayout title="개인정보처리방침" subtitle="Privacy Policy" imageIndex={1}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-bold text-[#1a2e5a] mb-4">개인정보처리방침</h2>

            <p className="text-gray-600 mb-6">
              대한혈관외과학회 혈액투석길 연구회(이하 "연구회")는 회원의 개인정보를 중요시하며,
              「개인정보 보호법」을 준수하고 있습니다.
            </p>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-[#1a2e5a] mb-3">제1조 (개인정보의 수집 및 이용목적)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  연구회는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는
                  다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는
                  별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
                  <li>회원 가입 및 관리</li>
                  <li>학술대회 및 교육 프로그램 안내</li>
                  <li>연구회 소식 및 공지사항 전달</li>
                  <li>학술자료 제공</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-[#1a2e5a] mb-3">제2조 (수집하는 개인정보 항목)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  연구회는 회원가입, 서비스 이용 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
                  <li>필수항목: 성명, 이메일, 연락처, 소속기관</li>
                  <li>선택항목: 전공, 관심분야</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-[#1a2e5a] mb-3">제3조 (개인정보의 보유 및 이용기간)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  연구회는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를
                  수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
                  <li>회원 탈퇴 시까지</li>
                  <li>단, 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-[#1a2e5a] mb-3">제4조 (개인정보의 제3자 제공)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  연구회는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서
                  처리하며, 정보주체의 사전 동의 없이는 본래의 목적 범위를 초과하여 처리하거나
                  제3자에게 제공하지 않습니다.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-[#1a2e5a] mb-3">제5조 (개인정보처리의 위탁)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  연구회는 원활한 개인정보 업무처리를 위하여 개인정보 처리업무를 위탁하지 않습니다.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-[#1a2e5a] mb-3">제6조 (정보주체의 권리·의무 및 행사방법)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  정보주체는 연구회에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
                  <li>개인정보 열람 요구</li>
                  <li>오류 등이 있을 경우 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리정지 요구</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-[#1a2e5a] mb-3">제7조 (개인정보 보호책임자)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  연구회는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
                  정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mt-3">
                  <p className="text-sm text-gray-700"><strong>개인정보 보호책임자</strong></p>
                  <p className="text-sm text-gray-600">성명: 김영균 (간사)</p>
                  <p className="text-sm text-gray-600">연락처: 010-2688-5625</p>
                  <p className="text-sm text-gray-600">이메일: zerok13@gmail.com</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-[#1a2e5a] mb-3">제8조 (개인정보처리방침 변경)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.
                  이전의 개인정보처리방침은 아래에서 확인하실 수 있습니다.
                </p>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t text-center text-gray-500 text-sm">
              <p>시행일자: 2024년 1월 1일</p>
              <p className="mt-1">대한혈관외과학회 혈액투석길 연구회</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
