import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { HOME_TITLE, SITE_URL } from "@/lib/seo";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const title = (request.nextUrl.searchParams.get("title") || HOME_TITLE).replace(/\s+/g, " ").trim().slice(0, 140);
  const logo = await readFile(join(process.cwd(), "public/brand/srinbar-full.webp"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#f7f4e9", color: "#183c2c", padding: 60, borderBottom: "18px solid #b49b53" }}>
      <div style={{ display: "flex", width: 700, flexDirection: "column", justifyContent: "space-between", paddingRight: 44 }}>
        <div style={{ display: "flex", fontSize: 21, letterSpacing: 4 }}>BAMBOO · RATTAN · SRI LANKA</div>
        <div style={{ display: "flex", fontSize: title.length > 85 ? 44 : 58, fontWeight: 700, lineHeight: 1.13 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 23 }}>{new URL(SITE_URL).hostname}</div>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", borderLeft: "1px solid #cccbb8", paddingLeft: 36 }}>
        <img src={`data:image/webp;base64,${logo.toString("base64")}`} width={300} height={312} alt="SRINBAR" />
      </div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400", "X-Robots-Tag": "noindex" } },
  );
}
