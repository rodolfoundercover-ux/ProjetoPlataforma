"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { serverSupabase } from "@/lib/supabase/server";
import { createHash, randomBytes } from "node:crypto";
type ProfileClient = { from: (table: "permission_profiles") => { insert: (row: { agency_id: string; name: string }) => Promise<{ error: unknown }> } };
export async function createPermissionProfile(form: FormData): Promise<void> {
  const parsed = z.object({ agencyId: z.uuid(), name: z.string().trim().min(2).max(80) }).safeParse({ agencyId: form.get("agencyId"), name: form.get("name") });
  if (!parsed.success) return;
  const client = await serverSupabase();
  const { error } = await (client as unknown as ProfileClient).from("permission_profiles").insert({ agency_id: parsed.data.agencyId, name: parsed.data.name });
  if (error) return;
  revalidatePath("/technical/team");
}

export type InvitationState={token?:string;error?:string};
type InvitationClient={from:(table:"agency_invitations")=>{insert:(row:Record<string,unknown>)=>Promise<{error:unknown}>;update:(row:Record<string,unknown>)=>{eq:(column:string,value:string)=>Promise<{error:unknown}>}}};
export async function createInvitation(_previous:InvitationState,form:FormData):Promise<InvitationState>{
  const parsed=z.object({agencyId:z.uuid(),email:z.email().transform(x=>x.trim().toLowerCase()),memberRole:z.enum(["ADMIN","ANALYST"]),hours:z.coerce.number().int().min(1).max(168)}).safeParse({agencyId:form.get("agencyId"),email:form.get("email"),memberRole:form.get("memberRole"),hours:form.get("hours")});
  if(!parsed.success)return{error:"Confira os dados do convite."};
  const client=await serverSupabase(); const {data}=await client.auth.getUser(); if(!data.user)return{error:"Sessão expirada."};
  const token=randomBytes(32).toString("base64url"); const tokenHash=createHash("sha256").update(token).digest("hex");
  const {error}=await (client as unknown as InvitationClient).from("agency_invitations").insert({agency_id:parsed.data.agencyId,email:parsed.data.email,member_role:parsed.data.memberRole,invited_by:data.user.id,token_hash:tokenHash,expires_at:new Date(Date.now()+parsed.data.hours*3600000).toISOString()});
  if(error)return{error:"Não foi possível criar o convite. Verifique sua permissão e se já existe convite pendente."};
  revalidatePath("/technical/team"); return{token};
}
export async function revokeInvitation(form:FormData):Promise<void>{
  const id=z.uuid().safeParse(form.get("invitationId")); if(!id.success)return;
  const client=await serverSupabase(); const {error}=await (client as unknown as InvitationClient).from("agency_invitations").update({status:"REVOKED",revoked_at:new Date().toISOString()}).eq("id",id.data);
  if(!error)revalidatePath("/technical/team");
}
