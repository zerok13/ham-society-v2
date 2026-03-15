import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

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
  description: "대한혈관외과학회 혈액투석길 연구회는 투석 환자의 혈관 접근로에 관한 연구와 임상 경험을 공유하는 학술 단체입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script crossOrigin="anonymous" src="//://unpkg.com" />
        <Script crossOrigin="anonymous" src="//://unpkg.com" />
      </head>
      <body suppressHydrationWarning className="antialiased flex flex-col min-h-screen">
        <Header />
        <ClientBody>
          <main className="flex-1">
            {children}
          </main>
        </ClientBody>
        <Footer />
      </body>
    </html>
  );
}
