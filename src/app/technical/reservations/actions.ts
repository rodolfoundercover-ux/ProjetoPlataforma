"use server";

import { ReservationService } from "@/services/reservation.service";
import { revalidatePath } from "next/cache";
import { createClient } from '@supabase/supabase-js';

const reservationService = new ReservationService();
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getAgencyId(): Promise<string> {
  return "agency_123"; // In production, this comes from auth.getUser()
}

export async function listReservationsAction() {
  const agencyId = await getAgencyId();
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*, trip(title, code)')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function createReservationAction(formData: FormData) {
  const agencyId = await getAgencyId();
  
  const data = {
    agency_id: agencyId,
    trip_id: formData.get("trip_id") as string,
    buyer_customer_id: formData.get("customer_id") as string,
    commercial_source: formData.get("source") as string || 'DIRECT',
    sales_channel: formData.get("channel") as string || 'OFFLINE',
    entry_amount: Number(formData.get("entry_amount")),
    created_by: "SYSTEM_USER", 
  };

  try {
    await reservationService.createReservation(data);
    revalidatePath("/technical/reservations");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
