import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, author, date, type, key } = body;
    if (!title || !author || !date || !type || !key) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }
    const file = path.join(process.cwd(), "data", "presentations.json");
    const buf = await readFile(file).catch(() => Buffer.from("[]"));
    const items = JSON.parse(buf.toString());
    const nextId = items.length ? Math.max(...items.map((i: any) => i.id)) + 1 : 1;
    const item = { id: nextId, title, author, date, type, downloads: 0, key };
    items.push(item);
    await writeFile(file, JSON.stringify(items, null, 2));
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
