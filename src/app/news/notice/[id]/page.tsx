import { PageLayout } from "@/components/PageLayout";
import { notices } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const notice = notices.find((n) => n.id === Number.parseInt(id));

  if (!notice) {
    notFound();
  }

  const currentIndex = notices.findIndex((n) => n.id === notice.id);
  const prevNotice = notices[currentIndex + 1];
  const nextNotice = notices[currentIndex - 1];

  return (
    <PageLayout title="공지사항" subtitle="Notice" imageIndex={1}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/news/notice"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a2e5a] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Link>

        {/* Notice Content */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 text-xs rounded ${
                notice.category === "공지" ? "bg-[#1a2e5a]/10 text-[#1a2e5a]" :
                notice.category === "안내" ? "bg-[#2e5aa7]/10 text-[#2e5aa7]" :
                "bg-gray-100 text-gray-600"
              }`}>
                {notice.category}
              </span>
              {notice.isNew && (
                <span className="px-1.5 py-0.5 bg-[#c41e3a] text-white text-[10px] font-bold rounded">
                  NEW
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#1a2e5a] mb-4">
              {notice.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {notice.date}
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {notice.category}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {notice.image && (
              <div className="mb-6 rounded-lg overflow-hidden border border-gray-100">
                <Image
                  src={notice.image}
                  alt={notice.title}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            )}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {notice.content}
              </p>
            </div>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-6 border rounded-xl overflow-hidden bg-white">
          {nextNotice && (
            <Link
              href={`/news/notice/${nextNotice.id}`}
              className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-500">다음글</span>
              <span className="text-gray-800 text-sm line-clamp-1 flex-1 ml-4">
                {nextNotice.title}
              </span>
            </Link>
          )}
          {prevNotice && (
            <Link
              href={`/news/notice/${prevNotice.id}`}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-500">이전글</span>
              <span className="text-gray-800 text-sm line-clamp-1 flex-1 ml-4">
                {prevNotice.title}
              </span>
            </Link>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
