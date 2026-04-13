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

// 정적 events 데이터 가져오기
async function getStaticEvents() {
  const { events } = await import("@/lib/data");
  return events;
}

// events 배열을 TypeScript 코드로 직렬화
function serializeEvents(events: any[]): string {
  const items = events.map((e) => {
    const desc = (e.description || "").replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\${/g, "\\${");
    const lines = [
      `  {`,
      `    id: ${e.id},`,
      `    title: ${JSON.stringify(e.title)},`,
      `    date: ${JSON.stringify(e.date)},`,
    ];
    if (e.endDate) lines.push(`    endDate: ${JSON.stringify(e.endDate)},`);
    lines.push(
      `    location: ${JSON.stringify(e.location || "")},`,
      `    time: ${JSON.stringify(e.time || "")},`,
      `    description: \`${desc}\`,`,
      `    isUpcoming: ${e.isUpcoming ?? true},`,
      `    type: ${JSON.stringify(e.type || "정기 학술대회")},`,
      `  }`
    );
    return lines.join("\n");
  });
  return `[\n${items.join(",\n")}\n]`;
}

// data.ts 내 events 배열을 새 배열로 교체
function replaceEventsInContent(content: string, newEvents: any[]): string {
  const startMarker = "export const events: Event[] = [";
  const startIdx = content.indexOf(startMarker);
  if (startIdx < 0) throw new Error("events array not found in data.ts");

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

  const serialized = serializeEvents(newEvents);
  return content.slice(0, startIdx) + startMarker.slice(0, -1) + serialized + content.slice(endIdx + 1);
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

// GET: 행사 목록
export async function GET() {
  try {
    const events = await getStaticEvents();
    return NextResponse.json({ ok: true, events });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}

// POST: 행사 추가
export async function POST(req: Request) {
  if (!await checkAdmin()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ ok: false, error: "GITHUB_TOKEN not configured. Please set GITHUB_TOKEN in Netlify environment variables." }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { title, date, location, time, description, isUpcoming, type } = body;
    if (!title || !date) {
      return NextResponse.json({ ok: false, error: "title and date required" }, { status: 400 });
    }

    const { content: fileContent, sha } = await getDataFile();
    const staticEvents = await getStaticEvents();
    const eventsArr = staticEvents as any[];

    const nextId = eventsArr.length ? Math.max(...eventsArr.map((e: any) => e.id)) + 1 : 1;
    const newEvent = { id: nextId, title, date, location: location || "", time: time || "", description: description || "", isUpcoming: isUpcoming ?? true, type: type || "정기 학술대회" };

    const newEventsArr = [newEvent, ...eventsArr];
    const newFileContent = replaceEventsInContent(fileContent, newEventsArr);
    await commitFile(newFileContent, sha, `feat: 학술행사 추가 - ${title}`);

    return NextResponse.json({ ok: true, event: newEvent, message: "행사가 추가되었습니다. 1-2분 후 사이트에 반영됩니다." });
  } catch (e: any) {
    console.error("POST events error:", e);
    return NextResponse.json({ ok: false, error: e.message || "failed" }, { status: 500 });
  }
}

// PUT: 행사 수정
export async function PUT(req: Request) {
  if (!await checkAdmin()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ ok: false, error: "GITHUB_TOKEN not configured. Please set GITHUB_TOKEN in Netlify environment variables." }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { id, title, date, location, time, description, isUpcoming, type } = body;
    if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });

    const { content: fileContent, sha } = await getDataFile();
    const staticEvents = await getStaticEvents();
    const eventsArr = staticEvents as any[];

    const idx = eventsArr.findIndex((e: any) => e.id === id);
    if (idx < 0) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

    eventsArr[idx] = { ...eventsArr[idx], title, date, location, time, description, isUpcoming, type };
    const newFileContent = replaceEventsInContent(fileContent, eventsArr);
    await commitFile(newFileContent, sha, `fix: 학술행사 수정 (id: ${id}) - ${title}`);

    return NextResponse.json({ ok: true, event: eventsArr[idx], message: "행사가 수정되었습니다. 1-2분 후 사이트에 반영됩니다." });
  } catch (e: any) {
    console.error("PUT events error:", e);
    return NextResponse.json({ ok: false, error: e.message || "failed" }, { status: 500 });
  }
}

// DELETE: 행사 삭제
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
    const staticEvents = await getStaticEvents();
    const eventsArr = (staticEvents as any[]).filter((e: any) => e.id !== id);

    const newFileContent = replaceEventsInContent(fileContent, eventsArr);
    await commitFile(newFileContent, sha, `fix: 학술행사 삭제 (id: ${id})`);

    return NextResponse.json({ ok: true, message: "행사가 삭제되었습니다. 1-2분 후 사이트에 반영됩니다." });
  } catch (e: any) {
    console.error("DELETE events error:", e);
    return NextResponse.json({ ok: false, error: e.message || "failed" }, { status: 500 });
  }
}
