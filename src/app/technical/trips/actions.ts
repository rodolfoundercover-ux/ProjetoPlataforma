"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { serverSupabase } from "@/lib/supabase/server";

type Result={error:unknown}; type Client={from:(t:string)=>{insert:(v:Record<string,unknown>)=>Promise<Result>}};
export async function createTrip(form:FormData):Promise<void>{
 const input=Object.fromEntries(["agency_id","code","title","slug","destination","departure_at","return_at","sales_start_at","sales_end_at"].map(k=>[k,String(form.get(k)??"")]));
 const parsed=z.object({agency_id:z.uuid(),code:z.string().trim().min(2).max(40),title:z.string().trim().min(3).max(160),slug:z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),destination:z.string().trim().min(2).max(160),departure_at:z.iso.datetime({local:true}),return_at:z.iso.datetime({local:true}),sales_start_at:z.union([z.literal(""),z.iso.datetime({local:true})]),sales_end_at:z.union([z.literal(""),z.iso.datetime({local:true})])}).safeParse(input);
 if(!parsed.success)return;
 const client=(await serverSupabase()) as unknown as Client;
 const {data:{user}}=await (await serverSupabase()).auth.getUser(); if(!user)return;
 const row={...parsed.data,departure_at:new Date(parsed.data.departure_at).toISOString(),return_at:new Date(parsed.data.return_at).toISOString(),sales_start_at:parsed.data.sales_start_at?new Date(parsed.data.sales_start_at).toISOString():null,sales_end_at:parsed.data.sales_end_at?new Date(parsed.data.sales_end_at).toISOString():null,created_by:user.id,status:"DRAFT",contract_pending:true};
 if(!(await client.from("trips").insert(row)).error)revalidatePath("/technical/trips");
}
