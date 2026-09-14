import Link from "next/link";
import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase/server";
import { addBoardingLocation, addCategory, addDomain, addIntegrationReference, saveAgencySettings, saveBranding } from "./actions";

type Membership={agency_id:string;role:string;agencies:{name:string}|null};
type Row=Record<string,unknown>;
type ReadClient={from:(table:string)=>{select:(columns:string)=>{eq:(column:string,value:string)=>Promise<{data:Row[]|null}>}}};
export const dynamic="force-dynamic";

export default async function SettingsPage({searchParams}:{searchParams:Promise<{agency?:string}>}) {
  const client=await serverSupabase(); const {data:user}=await client.auth.getUser(); if(!user.user) redirect("/login");
  const reader=client as unknown as ReadClient;
  const {data:memberRows}=await reader.from("agency_members").select("agency_id,role,agencies(name)").eq("status","ACTIVE");
  const memberships=(memberRows??[]) as Membership[]; const requested=(await searchParams).agency; const selected=memberships.find(m=>m.agency_id===requested)??memberships[0];
  if(!selected) return <><h1>Configurações da agência</h1><p>Você não possui vínculo ativo.</p><Link href="/technical">Voltar</Link></>;
  const agency=selected.agency_id;
  const read=async(table:string)=>((await reader.from(table).select("*").eq("agency_id",agency)).data??[]);
  const [settings,branding,categories,boarding,domains,integrations]=await Promise.all([read("agency_settings"),read("agency_branding"),read("passenger_categories"),read("agency_boarding_locations"),read("agency_domains"),read("agency_integrations")]);
  const s=settings[0]??{}; const b=branding[0]??{};
  return <>
    <h1>Configurações da agência</h1><p>Agência atual: <strong>{selected.agencies?.name??agency}</strong></p>
    {memberships.length>1&&<nav>{memberships.map(m=><Link key={m.agency_id} href={`/technical/settings?agency=${m.agency_id}`}>{m.agencies?.name??m.agency_id}</Link>)}</nav>}
    <section><h2>Dados legais e comerciais</h2><form action={saveAgencySettings}><input type="hidden" name="agency_id" value={agency}/><label>Razão social<input name="legal_name" defaultValue={String(s.legal_name??selected.agencies?.name??"")} required/></label><label>Cadastur<input name="cadastur" defaultValue={String(s.cadastur??"")}/></label><label>E-mail de contato<input type="email" name="contact_email" defaultValue={String(s.contact_email??"")}/></label><label>Telefone<input name="contact_phone" defaultValue={String(s.contact_phone??"")}/></label><label>Fuso horário<input name="timezone" defaultValue={String(s.timezone??"America/Sao_Paulo")} required/></label><label>Regras comerciais<textarea name="commercial_rules" defaultValue={String((s.commercial_rules as {notes?:string}|undefined)?.notes??"")}/></label><button>Salvar dados</button></form></section>
    <section><h2>Identidade visual</h2><form action={saveBranding}><input type="hidden" name="agency_id" value={agency}/><label>URL do logo<input type="url" name="logo_url" defaultValue={String(b.logo_url??"")}/></label><label>Cor principal<input type="color" name="primary_color" defaultValue={String(b.primary_color??"#075985")}/></label><label>Cor secundária<input type="color" name="secondary_color" defaultValue={String(b.secondary_color??"#172b3a")}/></label><label>Fonte<select name="font_family" defaultValue={String(b.font_family??"Arial")}>{["Arial","Inter","Roboto","Montserrat"].map(x=><option key={x}>{x}</option>)}</select></label><button>Salvar identidade</button></form></section>
    <section><h2>Categorias de passageiro</h2><ul>{categories.map(x=><li key={String(x.id)}>{String(x.name)}</li>)}</ul><form action={addCategory}><input type="hidden" name="agency_id" value={agency}/><label>Nova categoria<input name="name" required/></label><button>Adicionar categoria</button></form></section>
    <section><h2>Locais de embarque</h2><ul>{boarding.map(x=><li key={String(x.id)}>{String(x.name)} — {String(x.address)}</li>)}</ul><form action={addBoardingLocation}><input type="hidden" name="agency_id" value={agency}/><label>Nome<input name="name" required/></label><label>Endereço<input name="address" required/></label><label>Antecedência em minutos<input type="number" min="0" name="advance_minutes"/></label><label>Tolerância em minutos<input type="number" min="0" name="tolerance_minutes"/></label><button>Adicionar local</button></form></section>
    <section><h2>Domínios</h2><p>Novos domínios permanecem pendentes até a verificação técnica de DNS e SSL.</p><ul>{domains.map(x=><li key={String(x.id)}>{String(x.hostname)} — {String(x.status)} / SSL {String(x.ssl_status)}</li>)}</ul><form action={addDomain}><input type="hidden" name="agency_id" value={agency}/><label>Hostname<input name="hostname" placeholder="viagens.exemplo.com" required/></label><label className="inline"><input type="checkbox" name="is_platform_subdomain"/> Subdomínio da plataforma</label><button>Adicionar domínio</button></form></section>
    <section><h2>Integrações</h2><p>Informe somente a referência do segredo armazenado no provedor. O valor secreto nunca é exibido ou salvo aqui.</p><ul>{integrations.map(x=><li key={String(x.id)}>{String(x.provider)} — {String(x.status)}</li>)}</ul><form action={addIntegrationReference}><input type="hidden" name="agency_id" value={agency}/><label>Provedor<input name="provider" placeholder="mercado_pago" required/></label><label>Referência segura<input name="credential_reference" placeholder="vault://agency/provider" required/></label><button>Salvar referência</button></form></section>
    <p><Link href="/technical/team">Equipe e convites</Link> · <Link href="/technical">Voltar</Link></p>
  </>;
}
