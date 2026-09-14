"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { serverSupabase } from "@/lib/supabase/server";

type Query = { error: unknown };
type SettingsClient = { from: (table: string) => { upsert: (row: Record<string, unknown>) => Promise<Query>; insert: (row: Record<string, unknown>) => Promise<Query> } };
const agencyId = z.uuid();
const text = z.string().trim().min(1).max(200);

function value(form: FormData, key: string) { return String(form.get(key) ?? ""); }
async function db() { return (await serverSupabase()) as unknown as SettingsClient; }
function done() { revalidatePath("/technical/settings"); }

export async function saveAgencySettings(form: FormData): Promise<void> {
  const parsed = z.object({ agency_id: agencyId, legal_name: text, cadastur: z.string().trim().max(80), contact_email: z.union([z.literal(""),z.email()]), contact_phone: z.string().trim().max(40), timezone: z.string().trim().min(1).max(80), commercial_rules: z.string().trim().max(4000) }).safeParse(Object.fromEntries(["agency_id","legal_name","cadastur","contact_email","contact_phone","timezone","commercial_rules"].map(k=>[k,value(form,k)])));
  if (!parsed.success) return;
  const rules = parsed.data.commercial_rules ? { notes: parsed.data.commercial_rules } : {};
  const { error } = await (await db()).from("agency_settings").upsert({ ...parsed.data, commercial_rules: rules });
  if (!error) done();
}

export async function saveBranding(form: FormData): Promise<void> {
  const parsed = z.object({ agency_id: agencyId, logo_url: z.union([z.literal(""),z.url()]), primary_color: z.string().regex(/^#[0-9a-f]{6}$/i), secondary_color: z.string().regex(/^#[0-9a-f]{6}$/i), font_family: z.enum(["Arial","Inter","Roboto","Montserrat"]) }).safeParse(Object.fromEntries(["agency_id","logo_url","primary_color","secondary_color","font_family"].map(k=>[k,value(form,k)])));
  if (!parsed.success) return;
  const { error } = await (await db()).from("agency_branding").upsert({ ...parsed.data, logo_url: parsed.data.logo_url || null });
  if (!error) done();
}

export async function addCategory(form: FormData): Promise<void> {
  const parsed=z.object({agency_id:agencyId,name:z.string().trim().min(2).max(80)}).safeParse({agency_id:value(form,"agency_id"),name:value(form,"name")});
  if(parsed.success && !(await (await db()).from("passenger_categories").insert(parsed.data)).error) done();
}

export async function addBoardingLocation(form: FormData): Promise<void> {
  const parsed=z.object({agency_id:agencyId,name:z.string().trim().min(2).max(100),address:text,advance_minutes:z.coerce.number().int().min(0).max(1440).optional(),tolerance_minutes:z.coerce.number().int().min(0).max(1440).optional()}).safeParse({agency_id:value(form,"agency_id"),name:value(form,"name"),address:value(form,"address"),advance_minutes:value(form,"advance_minutes")||undefined,tolerance_minutes:value(form,"tolerance_minutes")||undefined});
  if(parsed.success && !(await (await db()).from("agency_boarding_locations").insert(parsed.data)).error) done();
}

export async function addDomain(form: FormData): Promise<void> {
  const parsed=z.object({agency_id:agencyId,hostname:z.string().trim().toLowerCase().regex(/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/),is_platform_subdomain:z.boolean()}).safeParse({agency_id:value(form,"agency_id"),hostname:value(form,"hostname"),is_platform_subdomain:form.get("is_platform_subdomain")==="on"});
  if(parsed.success && !(await (await db()).from("agency_domains").insert({...parsed.data,is_primary:false,status:"PENDING",ssl_status:"PENDING"})).error) done();
}

export async function addIntegrationReference(form: FormData): Promise<void> {
  const parsed=z.object({agency_id:agencyId,provider:z.string().trim().toLowerCase().regex(/^[a-z0-9_]+$/),credential_reference:z.string().trim().regex(/^[a-zA-Z0-9_./:-]+$/)}).safeParse({agency_id:value(form,"agency_id"),provider:value(form,"provider"),credential_reference:value(form,"credential_reference")});
  if(parsed.success && !(await (await db()).from("agency_integrations").upsert({...parsed.data,status:"DISCONNECTED"})).error) done();
}
