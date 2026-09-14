"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { serverSupabase } from "@/lib/supabase/server";
type RpcClient={rpc:(name:"accept_agency_invitation",args:{raw_token:string})=>Promise<{error:unknown}>};
export async function acceptInvitation(form:FormData):Promise<void>{const token=z.string().min(20).max(200).safeParse(form.get("token"));if(!token.success)return;const client=await serverSupabase();const {error}=await (client as unknown as RpcClient).rpc("accept_agency_invitation",{raw_token:token.data});if(!error)redirect("/technical/team");}
