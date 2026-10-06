import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "SRINBAR — Sri Lanka Network for Bamboo and Rattan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/srinbar-full.png"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f4e9" }}>
      <img src={`data:image/png;base64,${logo.toString("base64")}`} width={462} height={480} alt="" />
    </div>,
    size,
  );
}
