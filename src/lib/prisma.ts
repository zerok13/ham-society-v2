import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  if (!prisma) {
    try {
      prisma = new PrismaClient();
    } catch (e) {
      prisma = null;
    }
  }
  return prisma;
}

// Default export for convenience
export default getPrisma();
