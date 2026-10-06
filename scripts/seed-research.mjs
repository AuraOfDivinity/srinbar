import { createClient } from "@sanity/client";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const fileEnvironment = {};
for (const file of [".env", ".env.local"]) {
  const envPath = resolve(process.cwd(), file);
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const match = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (match) fileEnvironment[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}
for (const [name, value] of Object.entries(fileEnvironment)) {
  if (!process.env[name]) process.env[name] = value;
}

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing config. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env.local or the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-07-06", useCdn: false });
const items = JSON.parse(readFileSync(new URL("../lib/research-items.json", import.meta.url), "utf8"))
  .map((item) => ({ ...item, _type: "researchItem" }));

const transaction = items.reduce((current, item) => current.createOrReplace(item), client.transaction());
try {
  await transaction.commit();
  console.log(`${items.length} article and research items written to Sanity (${dataset}).`);
} catch (error) {
  console.error(`Could not write article and research items to Sanity: ${error instanceof Error ? error.message : "unknown error"}`);
  process.exit(1);
}
