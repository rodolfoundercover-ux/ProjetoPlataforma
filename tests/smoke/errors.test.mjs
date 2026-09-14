import { test } from "node:test";
import assert from "node:assert/strict";
import { AppError, publicError } from "../../src/lib/errors.ts";
import { errorRecord } from "../../src/lib/observability.ts";
test("unexpected errors do not leak sensitive details", () => {
  for (const error of [new Error("access_token=secret123"), { message: "CPF=123" }, "secret123", null]) {
    assert.deepEqual(publicError(error), { code: "INTERNAL", message: "Não foi possível concluir a operação." });
    const record = errorRecord("login", error);
    assert.equal(record.error_code, "INTERNAL");
    assert.match(record.request_id, /^[0-9a-f-]{36}$/);
    assert.deepEqual(Object.keys(record).sort(), ["timestamp", "level", "request_id", "operation", "error_code"].sort());
  }
});
test("known denial stays sanitized", () => {
  assert.equal(publicError(new AppError("FORBIDDEN")).message, "Acesso não permitido.");
});

