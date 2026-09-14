import Link from "next/link";
import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase/server";
import { createPermissionProfile } from "./actions";
import { revokeInvitation } from "./actions";
import { InvitationForm } from "./invitation-form";
type Membership = { agency_id: string; role: string; status: string; agencies: { name: string } | null };
type MembershipClient = { from: (table: "agency_members") => { select: (columns: string) => { eq: (column: string, value: string) => Promise<{ data: Membership[] | null }> } } };
type Invitation={id:string;agency_id:string;email:string;status:string;expires_at:string};
type InvitationReader={from:(table:"agency_invitations")=>{select:(columns:string)=>Promise<{data:Invitation[]|null}>}};
export const dynamic = "force-dynamic";
export default async function TeamPage() {
  const client = await serverSupabase();
  const { data: user } = await client.auth.getUser();
  if (!user.user) redirect("/login");
  const { data: memberships } = await (client as unknown as MembershipClient).from("agency_members").select("agency_id, role, status, agencies(name)").eq("status", "ACTIVE");
  const {data:invitations}=await (client as unknown as InvitationReader).from("agency_invitations").select("id,agency_id,email,status,expires_at");
  return <><h1>Equipe e permissÃµes</h1><p>Os dados exibidos e as alteraÃ§Ãµes sÃ£o autorizados pelo banco para cada agÃªncia.</p>
    {!memberships?.length ? <p role="status">VocÃª nÃ£o possui vÃ­nculo ativo com uma agÃªncia.</p> : <ul>{memberships.map(m => <li key={m.agency_id}>{m.agencies?.name ?? "AgÃªncia"} â {m.role}</li>)}</ul>}
    <h2>Criar perfil de permissÃµes</h2><form action={createPermissionProfile}><label>AgÃªncia<select name="agencyId" required>{memberships?.map(m => <option key={m.agency_id} value={m.agency_id}>{m.agencies?.name ?? m.agency_id}</option>)}</select></label><label>Nome do perfil<input name="name" maxLength={80} required /></label><button type="submit">Criar perfil</button></form>
    <h2>Convidar integrante</h2><p>Como o envio de e-mail entra em uma fase posterior, copie o token e entregue-o por um canal seguro. Ele aparece somente ao criar.</p><InvitationForm agencies={(memberships??[]).map(m=>({id:m.agency_id,name:m.agencies?.name??m.agency_id}))}/>
    <h2>Convites</h2>{!invitations?.length?<p>Nenhum convite visÃ­vel.</p>:<ul>{invitations.map(i=><li key={i.id}>{i.email} â {i.status} â vence em {new Date(i.expires_at).toLocaleString("pt-BR")} {i.status==="PENDING"&&<form action={revokeInvitation}><input type="hidden" name="invitationId" value={i.id}/><button>Revogar</button></form>}</li>)}</ul>}
    <p><Link href="/technical">Voltar</Link></p></>;
}
