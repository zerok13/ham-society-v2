import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 관리자 인증 확인
async function checkAdmin() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("ham_admin");
  const userCookie = cookieStore.get("ham_demo_user");
  if (adminCookie?.value === "1") return true;
  try {
    const user = JSON.parse(decodeURIComponent(userCookie?.value || "{}"));
    return user.role === "admin" || user.email?.includes("admin");
  } catch {
    return false;
  }
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "zerok13";
const REPO_NAME = "ham-society-v2";
const FILE_PATH = "src/lib/data.ts";
const BRANCH = "main";

// GitHub API에서 data.ts 파일 가져오기
async function getDataFile() {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  return {
    content: Buffer.from(data.content, "base64").toString("utf-8"),
    sha: data.sha,
  };
}

// notices 배열을 파싱 (export const notices: Notice[] = [...] 추출)
function parseNotices(content: string): any[] {
  try {
    // notices 배열 시작/끝 위치 찾기
    const startMarker = "export const notices: Notice[] = [";
    const startIdx = content.indexOf(startMarker);
    if (startIdx < 0) return [];

    // 중첩 괄호를 추적하여 배열 끝 찾기
    let depth = 0;
    let inString = false;
    let stringChar = "";
    let escaped = false;
    let templateDepth = 0;
    let i = startIdx + startMarker.length - 1; // '[' 위치

    for (; i < content.length; i++) {
      const ch = content[i];
      if (escaped) { escaped = false; continue; }
      if (ch === "\\") { escaped = true; continue; }

      if (inString) {
        if (stringChar === "`") {
          if (ch === "`") inString = false;
          else if (ch === "$" && content[i + 1] === "{") templateDepth++;
        } else {
          if (ch === stringChar) inString = false;
        }
      } else {
        if (ch === '"' || ch === "'" || ch === "`") {
          inString = true;
          stringChar = ch;
        } else if (ch === "[" || ch === "{") {
          depth++;
        } else if (ch === "]" || ch === "}") {
          depth--;
          if (depth === 0) break;
        }
      }
    }

    // 정적 데이터를 직접 반환 (파싱 대신)
    return [];
  } catch {
    return [];
  }
}

// 정적 notices 데이터를 직접 가져오기
async function getStaticNotices() {
  const { notices } = await import("@/lib/data");
  return notices;
}

// data.ts 내 notices 배열을 새 배열로 교체
function replaceNoticesInContent(content: string, newNotices: any[]): string {
  const startMarker = "export const notices: Notice[] = [";
  const startIdx = content.indexOf(startMarker);
  if (startIdx < 0) throw new Error("notices array not found in data.ts");

  // 배열 끝 찾기
  let depth = 0;
  let inString = false;
  let stringChar = "";
  let escaped = false;
  let endIdx = startIdx + startMarker.length - 1;

  for (let i = endIdx; i < content.length; i++) {
    const ch = content[i];
    if (escaped) { escaped = false; endIdx = i; continue; }
    if (ch === "\\") { escaped = true; endIdx = i; continue; }

    if (inString) {
      if (stringChar === "`") {
        if (ch === "`") inString = false;
      } else {
        if (ch === stringChar) inString = false;
      }
    } else {
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = true;
        stringChar = ch;
      } else if (ch === "[" || ch === "{") {
        depth++;
      } else if (ch === "]" || ch === "}") {
        depth--;
        if (depth === 0) { endIdx = i; break; }
      }
    }
  }

  // notices를 TypeScript 코드로 직렬화
  const serialized = serializeNotices(newNotices);
  return content.slice(0, startIdx) + startMarker.slice(0, -1) + serialized + content.slice(endIdx + 1);
}

// notices 배열을 TypeScript 코드로 직렬화
function serializeNotices(notices: any[]): string {
  const items = notices.map((n) => {
    const content = n.content?.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\${/g, "\\${") || "";
    const lines = [
      `  {`,
      `    id: ${n.id},`,
      `    title: ${JSON.stringify(n.title)},`,
      `    date: ${JSON.stringify(n.date)},`,
      `    content: \`${content}\`,`,
      `    isNew: ${n.isNew ?? false},`,
      `    category: ${JSON.stringify(n.category || "공지")},`,
      `    priority: ${JSON.stringify(n.priority || "일반")},`,
    ];
    if (n.image) lines.push(`    image: ${JSON.stringify(n.image)},`);
    lines.push(`  }`);
    return lines.join("\n");
  });
  return `[\n${items.join(",\n")}\n]`;
}

// GitHub에 파일 커밋
async function commitFile(content: string, sha: string, message: string) {
  const encoded = Buffer.from(content, "utf-8").toString("base64");
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: encoded,
        sha,
        branch: BRANCH,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub commit error: ${res.status} - ${err}`);
  }
  return res.json();
}

// GET: 공지사항 목록
export async function GET() {
  try {
    // 항상 정적 데이터 반환 (GitHub API 없이도 동작)
    const notices = await getStaticNotices();
    return NextResponse.json({ ok: true, notices });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}

// POST: 공지사항 추가
export async function POST(req: Request) {
  if (!await checkAdmin()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ ok: false, error: "GITHUB_TOKEN not configured. Please set GITHUB_TOKEN in Netlify environment variables." }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { title, content, category, priority, isNew } = body;
    if (!title || !content) {
      return NextResponse.json({ ok: false, error: "title and content required" }, { status: 400 });
    }

    const { content: fileContent, sha } = await getDataFile();
    const staticNotices = await getStaticNotices();
    const noticesArr = staticNotices as any[];

    const nextId = noticesArr.length ? Math.max(...noticesArr.map((n: any) => n.id)) + 1 : 5;
    const newNotice = {
      id: nextId,
      title,
      date: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
      content,
      isNew: isNew ?? true,
      category: category || "공지",
      priority: priority || "일반",
    };

    const newNoticesArr = [newNotice, ...noticesArr];
    const newFileContent = replaceNoticesInContent(fileContent, newNoticesArr);
    await commitFile(newFileContent, sha, `feat: 공지사항 추가 - ${title}`);

    return NextResponse.json({ ok: true, notice: newNotice, message: "공지사항이 추가되었습니다. 1-2분 후 사이트에 반영됩니다." });
  } catch (e: any) {
    console.error("POST notices error:", e);
    return NextResponse.json({ ok: false, error: e.message || "failed" }, { status: 500 });
  }
}

// PUT: 공지사항 수정
export async function PUT(req: Request) {
  if (!await checkAdmin()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ ok: false, error: "GITHUB_TOKEN not configured. Please set GITHUB_TOKEN in Netlify environment variables." }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { id, title, content, category, priority, isNew } = body;
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });

    const { content: fileContent, sha } = await getDataFile();
    const staticNotices = await getStaticNotices();
    const noticesArr = staticNotices as any[];

    const idx = noticesArr.findIndex((n: any) => n.id === id);
    if (idx < 0) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

    noticesArr[idx] = { ...noticesArr[idx], title, content, category, priority, isNew };
    const newFileContent = replaceNoticesInContent(fileContent, noticesArr);
    await commitFile(newFileContent, sha, `fix: 공지사항 수정 (id: ${id}) - ${title}`);

    return NextResponse.json({ ok: true, notice: noticesArr[idx], message: "공지사항이 수정되었습니다. 1-2분 후 사이트에 반영됩니다." });
  } catch (e: any) {
    console.error("PUT notices error:", e);
    return NextResponse.json({ ok: false, error: e.message || "failed" }, { status: 500 });
  }
}

// DELETE: 공지사항 삭제
export async function DELETE(req: Request) {
  if (!await checkAdmin()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ ok: false, error: "GITHUB_TOKEN not configured. Please set GITHUB_TOKEN in Netlify environment variables." }, { status: 503 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });

    const { content: fileContent, sha } = await getDataFile();
    const staticNotices = await getStaticNotices();
    const noticesArr = (staticNotices as any[]).filter((n: any) => n.id !== id);

    const newFileContent = replaceNoticesInContent(fileContent, noticesArr);
    await commitFile(newFileContent, sha, `fix: 공지사항 삭제 (id: ${id})`);

    return NextResponse.json({ ok: true, message: "공지사항이 삭제되었습니다. 1-2분 후 사이트에 반영됩니다." });
  } catch (e: any) {
    console.error("DELETE notices error:", e);
    return NextResponse.json({ ok: false, error: e.message || "failed" }, { status: 500 });
  }
}
