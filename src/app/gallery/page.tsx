import { PageLayout } from "@/components/PageLayout";
import { galleryImages } from "@/lib/data";
import Image from "next/image";

export default function GalleryPage() {
  return (
    <PageLayout title="포토갤러리" subtitle="Photo Gallery" imageIndex={0}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#1a2e5a] mb-2">
            HAM 활동 사진
          </h2>
          <p className="text-gray-600">
            학술대회 및 연구회 활동 사진을 확인하세요
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <Image
                src={image.src}
                alt={image.title}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                <h3 className="font-bold">{image.title}</h3>
                <p className="text-sm text-white/80">{image.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>더 많은 사진은 회원 로그인 후 확인하실 수 있습니다.</p>
        </div>
      </div>
    </PageLayout>
  );
}
