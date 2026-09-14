import { describe, it, expect } from "vitest";
import { AppError, publicError } from "../../src/lib/errors";
import { errorRecord } from "../../src/lib/observability";
describe("safe error boundary", () => {
  it("never exposes SQL or provider secrets", () => {
    const secret = new Error("password=secret select customer_document from private");
    expect(JSON.stringify(publicError(secret))).not.toContain("secret");
    expect(publicError(secret).code).toBe("INTERNAL");
    expect(JSON.stringify(errorRecord("login", secret))).not.toContain("customer_document");
  });
  it("preserves safe domain code", () => {
    expect(publicError(new AppError("FORBIDDEN"))).toEqual({ code: "FORBIDDEN", message: "Acesso não permitido." });
  });
});

