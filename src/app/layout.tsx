import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

// 폰트 설정에 subsets: ["latin"]을 추가하여 에러를 해결했습니다.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"], // 👈 이 부분이 빠져서 에러가 났던 거예요!
});

export const metadata: Metadata = {
  title: "대한혈관외과학회 혈액투석길 연구회 (HAM)",
  description: "투석 환자의 혈관 접근로에 관한 연구와 임상 경험을 공유하는 학술 단체입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head />
      <body suppressHydrationWarning className="antialiased flex flex-col min-h-screen">
        {/* 헤더와 푸터는 여기서 딱 한 번만 나옵니다! */}
        <Header />
        <ClientBody>
          {children}
        </ClientBody>
        <Footer />
      </body>
    </html>
  );
}
