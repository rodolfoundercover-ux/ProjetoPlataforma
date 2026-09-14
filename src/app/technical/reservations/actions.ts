"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { serverSupabase } from "@/lib/supabase/server";
export async function listReservationsAction(){const db=await serverSupabase();const {data}=await db.from("reservations").select("id,code,total_amount,status,financial_status,created_at").order("created_at",{ascending:false});return data??[];}
export async function reservationOptions(){const db=await serverSupabase();const [{data:trips},{data:customers}]=await Promise.all([db.from("trips").select("id,title,code").eq("status","SALES_OPEN").order("departure_at"),db.from("agency_customers").select("id,full_name").eq("status","ACTIVE").order("full_name")]);return {trips:trips??[],customers:customers??[]};}
export async function createReservationAction(form:FormData){const parsed=z.object({trip_id:z.uuid(),buyer_customer_id:z.uuid(),commercial_source:z.string().trim().min(1).max(40),sales_channel:z.string().trim().min(1).max(40),hold_minutes:z.coerce.number().int().min(1).max(1440)}).safeParse(Object.fromEntries(form));if(!parsed.success)return;const db=await serverSupabase();const expires=new Date(Date.now()+parsed.data.hold_minutes*60000).toISOString();const {error}=await db.rpc("create_manual_reservation",{p_trip:parsed.data.trip_id,p_buyer:parsed.data.buyer_customer_id,p_source:parsed.data.commercial_source,p_channel:parsed.data.sales_channel,p_expires_at:expires});if(error)return;revalidatePath("/technical/reservations");redirect("/technical/reservations");}
