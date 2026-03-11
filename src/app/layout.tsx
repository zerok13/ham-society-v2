import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
// 👇 헤더와 푸터를 불러오는 코드를 추가했습니다.
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "대한혈관외과학회 혈액투석길 연구회 (HAM)",
  description: "대한혈관외과학회 혈액투석길 연구회는 투석 환자의 혈관 접근로(Vascular Access)에 관한 연구와 임상 경험을 공유하는 학술 단체입니다.",
  keywords: ["HAM", "혈액투석길", "대한혈관외과학회", "Vascular Access", "AV Access", "혈관외과"],
  openGraph: {
    title: "대한혈관외과학회 혈액투석길 연구회 (HAM)",
    description: "투석 환자의 혈관 접근로에 관한 연구와 임상 경험을 공유하는 학술 단체",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-grab/dist/index.global.js"
        />
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        {/* 👇 화면에 헤더와 푸터를 그려주는 코드를 추가했습니다. */}
        <Header />
        <ClientBody>{children}</ClientBody>
        <Footer />
      </body>
    </html>
  );
}
