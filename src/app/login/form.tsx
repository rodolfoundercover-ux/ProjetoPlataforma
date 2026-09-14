"use client";
import { useActionState } from "react";
import { login } from "./actions";
export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return <form action={action}>
    <label>E-mail<input name="email" type="email" autoComplete="username" required maxLength={254} /></label>
    <label>Senha<input name="password" type="password" autoComplete="current-password" required maxLength={128} /></label>
    <p role="status" aria-live="polite">{state.error}</p>
    <button disabled={pending} type="submit">{pending ? "Entrandoâ¦" : "Entrar"}</button>
  </form>;
}

