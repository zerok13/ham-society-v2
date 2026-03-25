// Next.js 서버 시작 시 한 번 실행 — Comment 테이블 자동 생성
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Comment" (
          "id"        SERIAL       NOT NULL,
          "content"   TEXT         NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "postId"    INTEGER      NOT NULL,
          "authorId"  INTEGER      NOT NULL,
          CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
        )
      `);

      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'Comment_postId_fkey'
          ) THEN
            ALTER TABLE "Comment"
              ADD CONSTRAINT "Comment_postId_fkey"
              FOREIGN KEY ("postId") REFERENCES "BoardPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
          END IF;
        END$$
      `);

      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'Comment_authorId_fkey'
          ) THEN
            ALTER TABLE "Comment"
              ADD CONSTRAINT "Comment_authorId_fkey"
              FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
          END IF;
        END$$
      `);

      await prisma.$disconnect();
      console.log("[instrumentation] Comment table ready");
    } catch (e) {
      console.warn("[instrumentation] Comment table setup failed:", e);
    }
  }
}
