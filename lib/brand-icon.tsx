import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function brandIcon(size: number) {
  const symbol = await readFile(join(process.cwd(), "public/brand/srinbar-symbol.png"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#f7f4e9", borderRadius: size * 0.16 }}>
      <img src={`data:image/png;base64,${symbol.toString("base64")}`} width={size * 0.8} height={size * 0.71} alt="" />
    </div>,
    { width: size, height: size },
  );
}
