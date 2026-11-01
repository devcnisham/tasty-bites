import { access } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  let available = false;
  try {
    await access(join(process.cwd(), "public", "demo", "lesson.mp4"));
    available = true;
  } catch {}
  return Response.json(
    { available },
    { headers: { "Cache-Control": "no-store" } },
  );
}
