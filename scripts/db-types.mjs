import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
const result = spawnSync(process.execPath, ["node_modules/supabase/dist/supabase.js", "gen", "types", "typescript", "--local", "--schema", "public,internal"], { encoding: "utf8", timeout: 60000 });
if (result.status !== 0 || !result.stdout.includes("export type Database")) throw new Error("Geração falhou; nenhum tipo foi sobrescrito.");
writeFileSync("src/lib/database.types.ts", result.stdout);
console.log("Tipos gerados a partir do banco local. Revise o diff antes de versionar.");
