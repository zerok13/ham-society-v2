"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 하이드레이션 에러 방지용 초기화
    document.body.className = "antialiased flex flex-col min-h-screen";
  }, []);

  return <>{children}</>;
}
