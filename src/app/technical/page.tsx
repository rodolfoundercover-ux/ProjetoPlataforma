import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function Technical() {
  const client = await serverSupabase();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) redirect("/login");
  return <><h1>SessÃ£o autenticada</h1><p>Seu login foi validado pelo Supabase.</p><p><Link href="/technical/trips">Viagens</Link></p><p><Link href="/technical/settings">ConfiguraÃ§Ãµes da agÃªncia</Link></p><p><Link href="/technical/team">Equipe e permissÃµes</Link></p><form action={logout}><button>Sair</button></form></>;
}
