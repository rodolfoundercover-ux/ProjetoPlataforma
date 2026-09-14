import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const versions = {};
for (const group of ["dependencies", "devDependencies"]) {
  for (const name of Object.keys(pkg[group])) {
    const installed = JSON.parse(readFileSync(join("node_modules", name, "package.json"), "utf8"));
    if (!/^\d+\.\d+\.\d+([+-].+)?$/.test(installed.version)) throw new Error("Versão inválida: " + name);
    pkg[group][name] = installed.version;
    versions[name] = installed.version;
  }
}
writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
writeFileSync("docs/INSTALLED_VERSIONS.json", JSON.stringify({ recordedAt: new Date().toISOString(), node: process.version, packages: versions }, null, 2) + "\n");
console.log("Versões instaladas fixadas. Rode pnpm install para sincronizar o lockfile e pnpm check para validar compatibilidade.");

