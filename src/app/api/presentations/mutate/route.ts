import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id } = body;
    if (!action || typeof id !== "number") return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });

    const file = path.join(process.cwd(), "data", "presentations.json");
    const buf = await readFile(file).catch(() => Buffer.from("[]"));
    const items = JSON.parse(buf.toString());

    const idx = items.findIndex((i: any) => i.id === id);
    if (idx < 0) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

    if (action === "delete") {
      items.splice(idx, 1);
    } else if (action === "hide") {
      items[idx].hidden = true;
    } else if (action === "unhide") {
      items[idx].hidden = false;
    } else {
      return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
    }

    await writeFile(file, JSON.stringify(items, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
