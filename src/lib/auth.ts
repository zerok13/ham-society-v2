import { getPrisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getUserId() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("ham_demo_user");
  if (!userCookie) return null;
  try {
    const user = JSON.parse(userCookie.value);
    const prisma = getPrisma();
    if (!prisma || !user.email) return null;
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    return dbUser?.id || null;
  } catch {
    return null;
  }
}
