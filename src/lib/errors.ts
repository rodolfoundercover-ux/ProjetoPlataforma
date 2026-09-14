export type ErrorCode = "UNAUTHENTICATED" | "FORBIDDEN" | "INVALID_INPUT" | "UNAVAILABLE" | "INTERNAL";
const messages: Record<ErrorCode, string> = {
  UNAUTHENTICATED: "Entre para continuar.",
  FORBIDDEN: "Acesso nÃ£o permitido.",
  INVALID_INPUT: "Confira os dados informados.",
  UNAVAILABLE: "ServiÃ§o indisponÃ­vel. Tente novamente.",
  INTERNAL: "NÃ£o foi possÃ­vel concluir a operaÃ§Ã£o.",
};
export class AppError extends Error {
  readonly code: ErrorCode;
  constructor(code: ErrorCode) { super(messages[code]); this.code = code; }
}
export function publicError(error: unknown) {
  const code = error instanceof AppError ? error.code : "INTERNAL";
  return { code, message: messages[code] };
}

