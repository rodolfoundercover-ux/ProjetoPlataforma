"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase/server";
import { logError } from "@/lib/observability";
const credentials = z.object({ email: z.email().max(254), password: z.string().min(1).max(128) });
export async function login(_previous: { error: string }, form: FormData) {
  const parsed = credentials.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Confira o e-mail e a senha." };
  try {
    const client = await serverSupabase();
    const { error } = await client.auth.signInWithPassword(parsed.data);
    if (error) return { error: "Não foi possível entrar. Confira seus dados ou tente mais tarde." };
  } catch (error) {
    logError("login", error);
    return { error: "Serviço indisponível. Tente novamente." };
  }
  redirect("/technical");
}
export async function logout() {
  const client = await serverSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw new Error("Não foi possível encerrar a sessão.");
  redirect("/login");
}

