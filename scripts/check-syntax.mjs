import { createRequire } from 'node:module';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
const ts = require(process.argv[2] || 'typescript');
let count = 0;
let failed = false;
function scan(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) { scan(file); continue; }
    if (!/\.tsx?$/.test(file) || file.endsWith('.d.ts')) continue;
    const result = ts.transpileModule(readFileSync(file, 'utf8'), { fileName: file, reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, isolatedModules: true } });
    for (const diagnostic of result.diagnostics || []) {
      if (diagnostic.category === ts.DiagnosticCategory.Error) {
        failed = true;
        console.error(file, ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
      }
    }
    count++;
  }
}
scan('src'); scan('tests');
console.log(count + ' arquivos verificados apenas quanto à sintaxe TypeScript; não substitui typecheck, lint ou build.');
process.exitCode = failed ? 1 : 0;
