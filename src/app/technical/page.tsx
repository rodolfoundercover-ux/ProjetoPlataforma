import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function Technical() {
  const client = await serverSupabase();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) redirect("/login");
  return <><h1>Sessão autenticada</h1><p>Seu login foi validado pelo Supabase.</p><nav><Link href="/technical/trips">Viagens</Link><Link href="/technical/customers">Clientes</Link><Link href="/technical/reservations">Reservas e pagamentos</Link><Link href="/technical/settings">Configurações da agência</Link><Link href="/technical/team">Equipe e permissões</Link></nav><form action={logout}><button>Sair</button></form></>;
}
