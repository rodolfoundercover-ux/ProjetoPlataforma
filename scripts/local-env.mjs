import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
const result = spawnSync(process.execPath, ["node_modules/supabase/dist/supabase.js", "status", "-o", "json"], { encoding: "utf8", timeout: 15000 });
if (result.status !== 0) throw new Error("Não foi possível consultar o CLI local. Confira as permissões do terminal e se o Supabase está iniciado. A saída foi omitida para proteger chaves.");
const status = JSON.parse(result.stdout);
const url = new URL(status.API_URL);
if (!["127.0.0.1", "localhost"].includes(url.hostname)) throw new Error("Este comando aceita somente Supabase local.");
const key = status.PUBLISHABLE_KEY || status.ANON_KEY;
if (typeof key !== "string" || /[\r\n]/.test(key)) throw new Error("Chave pública local ausente.");
if (!key.startsWith("sb_publishable_")) {
  const claims = JSON.parse(Buffer.from(key.split(".")[1] || "", "base64url").toString());
  if (claims.role !== "anon") throw new Error("Chave privilegiada recusada.");
}
if (existsSync(".env.local")) throw new Error(".env.local já existe. Preserve suas configurações; atualize manualmente se necessário.");
writeFileSync(".env.local", "NEXT_PUBLIC_SUPABASE_URL=" + url.origin + "\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=" + key + "\n", { mode: 0o600, flag: "wx" });
console.log(".env.local criado apenas com URL local e chave pública. Nenhuma chave privilegiada foi gravada.");
