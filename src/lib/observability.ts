import { publicError } from "./errors.ts";
// Only a closed event vocabulary and generated correlation id may enter technical logs.
// Do not add arbitrary request bodies, URLs, emails or provider error messages.
export type Operation = "health" | "login" | "logout" | "session";
export function errorRecord(operation: Operation, error: unknown) {
  return { timestamp: new Date().toISOString(), level: "error", request_id: crypto.randomUUID(), operation, error_code: publicError(error).code };
}
export function logError(operation: Operation, error: unknown) {
  const record = errorRecord(operation, error);
  console.error(JSON.stringify(record));
  return record.request_id;
}

